// ─── ChatDB: Unlimited Persistent Memory via IndexedDB ────────────────────
// Stores every message, session, and model selection permanently.
// Supports multi-user isolation by tagging sessions with userId (e.g. Google UID or guest).

const DB_NAME    = 'MarkZapChatDB';
const DB_VERSION = 3;
const STORES = {
    sessions : 'sessions',  // { id, userId, title, createdAt, updatedAt, model }
    messages : 'messages',  // { id, sessionId, role, content, model, timestamp }
    memory   : 'memory',    // { key, value }  — global KV store for AI context
};

class ChatDB {
    constructor() {
        this._db = null;
        this._ready = this._open();
    }

    // ── Open / upgrade database ───────────────────────────────────────────
    _open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = (e) => {
                const db = e.target.result;

                let s;
                if (!db.objectStoreNames.contains(STORES.sessions)) {
                    s = db.createObjectStore(STORES.sessions, { keyPath: 'id' });
                } else {
                    s = e.target.transaction.objectStore(STORES.sessions);
                }
                
                if (!s.indexNames.contains('updatedAt')) {
                    s.createIndex('updatedAt', 'updatedAt');
                }
                if (!s.indexNames.contains('userId')) {
                    s.createIndex('userId', 'userId');
                }

                if (!db.objectStoreNames.contains(STORES.messages)) {
                    const m = db.createObjectStore(STORES.messages, {
                        keyPath: 'id', autoIncrement: true
                    });
                    m.createIndex('sessionId', 'sessionId');
                    m.createIndex('timestamp', 'timestamp');
                }

                if (!db.objectStoreNames.contains(STORES.memory)) {
                    db.createObjectStore(STORES.memory, { keyPath: 'key' });
                }
            };

            req.onsuccess = (e) => {
                this._db = e.target.result;
                resolve(this._db);
            };

            req.onerror = () => reject(req.error);
        });
    }

    async _tx(stores, mode, fn) {
        await this._ready;
        return new Promise((resolve, reject) => {
            const storeList = Array.isArray(stores) ? stores : [stores];
            const tx  = this._db.transaction(storeList, mode);
            const out = fn(tx);
            tx.oncomplete = () => resolve(out instanceof IDBRequest ? out.result : out);
            tx.onerror    = () => reject(tx.error);
        });
    }

    _req(req) {
        return new Promise((res, rej) => {
            req.onsuccess = () => res(req.result);
            req.onerror   = () => rej(req.error);
        });
    }

    // ── Sessions ──────────────────────────────────────────────────────────
    
    async createSession(title = 'New Chat', model = 'instant', userId = 'guest') {
        await this._ready;
        const id  = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const now = new Date().toISOString();
        const session = { 
            id, userId, title, model, 
            createdAt: now, updatedAt: now,
            isPinned: false, folderId: null 
        };
        await this._req(
            this._db.transaction(STORES.sessions, 'readwrite')
                    .objectStore(STORES.sessions).put(session)
        );
        await this.setMemory(`current_session_${userId}`, id);
        await this.setMemory('current_session', id);
        return session;
    }

    async getSession(id) {
        await this._ready;
        return this._req(
            this._db.transaction(STORES.sessions, 'readonly')
                    .objectStore(STORES.sessions).get(id)
        );
    }

    async updateSession(id, patch) {
        await this._ready;
        const session = await this.getSession(id);
        if (!session) return;
        Object.assign(session, patch, { updatedAt: new Date().toISOString() });
        await this._req(
            this._db.transaction(STORES.sessions, 'readwrite')
                    .objectStore(STORES.sessions).put(session)
        );
        return session;
    }

    async getAllSessions(userId = null) {
        await this._ready;
        return new Promise((resolve, reject) => {
            const tx    = this._db.transaction(STORES.sessions, 'readonly');
            const store = tx.objectStore(STORES.sessions);
            
            let req;
            if (userId && store.indexNames.contains('userId')) {
                const index = store.index('userId');
                req = index.openCursor(IDBKeyRange.only(userId));
            } else {
                req = store.index('updatedAt').openCursor(null, 'prev');
            }

            const sessions = [];
            req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    const sess = cursor.value;
                    // Fallback filtering if needed
                    if (!userId || sess.userId === userId || (!sess.userId && userId === 'guest')) {
                        sessions.push(sess);
                    }
                    cursor.continue();
                } else {
                    // Sort descending by updatedAt
                    sessions.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
                    resolve(sessions);
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    async deleteSession(id) {
        await this._ready;
        // Delete all messages for session
        const msgs = await this.getMessages(id);
        const tx   = this._db.transaction(
            [STORES.sessions, STORES.messages], 'readwrite'
        );
        tx.objectStore(STORES.sessions).delete(id);
        msgs.forEach(m => tx.objectStore(STORES.messages).delete(m.id));
        return new Promise((res, rej) => {
            tx.oncomplete = res;
            tx.onerror    = () => rej(tx.error);
        });
    }

    async clearUserSessions(userId) {
        await this._ready;
        const sessions = await this.getAllSessions(userId);
        for (const s of sessions) {
            await this.deleteSession(s.id);
        }
    }

    async purgeLegacySessions() {
        await this._ready;
        const sessions = await this.getAllSessions();
        const legacyTitles = ["Hello Rudra! It's nice to meet you.", "Hello! How can I assist you today?"];
        for (const s of sessions) {
            const msgs = await this.getMessages(s.id);
            const isLegacy = legacyTitles.includes(s.title) || 
                             msgs.some(m => m.content && (m.content.includes("Hello! I'm just a computer program") || m.content.includes("Hello Rudra!")));
            if (isLegacy) {
                await this.deleteSession(s.id);
                console.log('Purged legacy session from IndexedDB:', s.id, s.title);
            }
        }
    }

    // ── Messages ──────────────────────────────────────────────────────────

    async addMessage(sessionId, role, content, extra = {}) {
        await this._ready;
        const timestamp = new Date().toISOString();
        const msg = { sessionId, role, content, timestamp, ...extra };
        const id  = await this._req(
            this._db.transaction(STORES.messages, 'readwrite')
                    .objectStore(STORES.messages).add(msg)
        );
        // Also update session title from first user message
        if (role === 'user') {
            const session = await this.getSession(sessionId);
            const m = extra.model || (session ? session.model : 'instant');
            if (session && session.title === 'New Chat') {
                const titleSnippet = content.substring(0, 30).trim() || 'New Chat...';
                await this.updateSession(sessionId, { title: titleSnippet, model: m });
            } else if (session) {
                await this.updateSession(sessionId, { model: m });
            }
        }
        return { ...msg, id };
    }

    async getMessages(sessionId) {
        await this._ready;
        return new Promise((resolve, reject) => {
            const tx     = this._db.transaction(STORES.messages, 'readonly');
            const store  = tx.objectStore(STORES.messages);
            const index  = store.index('sessionId');
            const req    = index.openCursor(IDBKeyRange.only(sessionId));
            const msgs   = [];
            req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) { msgs.push(cursor.value); cursor.continue(); }
                else resolve(msgs.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
            };
            req.onerror = () => reject(req.error);
        });
    }

    // Returns all messages across ALL sessions for AI long-term memory
    async getAllMessages(limit = 500) {
        await this._ready;
        return new Promise((resolve, reject) => {
            const tx    = this._db.transaction(STORES.messages, 'readonly');
            const store = tx.objectStore(STORES.messages);
            const index = store.index('timestamp');
            const req   = index.openCursor(null, 'prev');
            const msgs  = [];
            let   count = 0;
            req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor && count < limit) {
                    msgs.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(msgs.reverse()); // chronological order
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    async deleteMessage(id) {
        await this._ready;
        return this._req(
            this._db.transaction(STORES.messages, 'readwrite')
                    .objectStore(STORES.messages).delete(id)
        );
    }

    async updateMessage(id, updates) {
        await this._ready;
        const tx = this._db.transaction(STORES.messages, 'readwrite');
        const store = tx.objectStore(STORES.messages);
        const msg = await this._req(store.get(id));
        if (!msg) return;
        Object.assign(msg, updates);
        await this._req(store.put(msg));
        return msg;
    }

    // ── Global KV Memory ──────────────────────────────────────────────────

    async setMemory(key, value) {
        await this._ready;
        await this._req(
            this._db.transaction(STORES.memory, 'readwrite')
                    .objectStore(STORES.memory).put({ key, value })
        );
    }

    async getMemory(key) {
        await this._ready;
        const rec = await this._req(
            this._db.transaction(STORES.memory, 'readonly')
                    .objectStore(STORES.memory).get(key)
        );
        return rec?.value ?? null;
    }

    // ── Cross-Session Memory for AI Context ───────────────────────────

    async getRecentContext(limit = 30) {
        await this._ready;
        const msgs = await this.getAllMessages(limit);
        return msgs.map(m => `[${m.role}]: ${m.content.substring(0, 300)}`).join('\n');
    }

    async getMemoryKeys() {
        await this._ready;
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction(STORES.memory, 'readonly');
            const store = tx.objectStore(STORES.memory);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async importSession(sessionData, defaultUserId = 'guest') {
        await this._ready;
        const { messages: msgs, ...session } = sessionData;
        if (!session.id) return;
        if (!session.userId) session.userId = defaultUserId;

        const existing = await this.getSession(session.id);
        if (!existing) {
            await this._req(
                this._db.transaction(STORES.sessions, 'readwrite')
                        .objectStore(STORES.sessions).put(session)
            );
        }
        if (msgs && msgs.length > 0) {
            const existingMsgs = await this.getMessages(session.id);
            const existingIds = new Set(existingMsgs.map(m => m.id));
            const tx = this._db.transaction(STORES.messages, 'readwrite');
            const store = tx.objectStore(STORES.messages);
            for (const m of msgs) {
                if (!existingIds.has(m.id)) {
                    store.put(m);
                }
            }
            return new Promise((res, rej) => {
                tx.oncomplete = res;
                tx.onerror = () => rej(tx.error);
            });
        }
    }

    // ── Export ────────────────────────────────────────────────────────────

    async exportAll(userId = null) {
        const [sessions, messages] = await Promise.all([
            this.getAllSessions(userId),
            this.getAllMessages(10000),
        ]);
        const blob = new Blob(
            [JSON.stringify({ exportedAt: new Date().toISOString(), userId, sessions, messages }, null, 2)],
            { type: 'application/json' }
        );
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = `markzap-chat-history-${userId || 'all'}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // ── Stats ─────────────────────────────────────────────────────────────

    async getStats(userId = null) {
        const [sessions, messages] = await Promise.all([
            this.getAllSessions(userId),
            this.getAllMessages(100000),
        ]);
        return {
            totalSessions  : sessions.length,
            totalMessages  : messages.length,
            totalChars     : messages.reduce((s, m) => s + m.content.length, 0),
            oldestMessage  : messages[0]?.timestamp || null,
            latestMessage  : messages[messages.length - 1]?.timestamp || null,
        };
    }
}

// Singleton export
export const db = new ChatDB();

