# 🛠️ DEVELOPMENT GUIDE - MarkZap

## Quick Start (3 commands)

```bash
# 1. Install dependencies
npm ci

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

That's it! 🎉

---

## 📦 What's Inside

### Scripts (package.json)

| Command | Purpose |
|---------|---------|
| `npm start` | Start production server (node server.js) |
| `npm run dev` | Start dev server with hot reload (nodemon) |
| `npm run build` | Build production assets to `public/` |
| `npm test` | Run security check + lint + build |
| `npm run security-check` | Scan for vulnerabilities |
| `npm run backup` | Create backup (Unix/Mac) |
| `npm run backup` (Windows) | `scripts\backup.bat` |
| `npm run clean` | Remove `public/` directory |
| `npm run restart` | Rebuild and start |
| `npm run status` | Check if server is running |

---

## 🔧 Development Features

### Hot Reloading
- **nodemon** watches these files for changes:
  - `index.html` - Main page
  - `server.js` - Server code
  - `assets/` - Styles, images
  - `scripts/` - Client-side JS (if any)

- When you save a file, nodemon automatically restarts the server.
- For client-side changes (HTML/CSS), just refresh browser.
- For server changes, nodemon restarts automatically.

### Environment Variables
- Development uses `.env` file (created from `.env.example`)
- Production uses environment variables (Vercel/AWS)
- `dotenv` package loads `.env` automatically in dev

### Logging
In development, you see:
```
[timestamp] GET /health
[timestamp] POST /api/contact
```

In production, logs go to:
- CloudWatch (AWS)
- Vercel Logs
- Loki (if using monitoring stack)

---

## 🗄️ Local Database Setup (Optional)

For full-stack development with database:

### Option A: Docker Compose (Easiest - All-in-One)
```bash
# Start everything: app + PostgreSQL + Redis + Monitoring
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop everything
docker-compose down
```

Services started:
- App: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)
- Loki: http://localhost:3100

### Option B: Manual PostgreSQL Setup

**Mac (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
createdb markzap
createuser -s markzap  # optional
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb markzap
sudo -u postgres createuser -s markzap
```

**Windows:**
- Download installer from https://www.postgresql.org/download/windows/
- Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16`

Then update `.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=markzap
DATABASE_USER=markzap
DATABASE_PASSWORD=your_password
```

---

## 🔍 Debugging

### Enable Debug Mode
```bash
# Use Node inspector
npm run dev:debug

# Then open Chrome://inspect and attach
```

### View Server Logs
```bash
# All logs
npm run dev

# Only errors (filter)
npm run dev 2>&1 | grep -i error
```

### Check Server Status
```bash
npm run status
# Output: ✅ Server is running  (or ❌ not running)
```

### Test Endpoints
```bash
# Health check
curl http://localhost:3000/health

# API status
curl http://localhost:3000/api/status

# Homepage
curl http://localhost:3000

# Check headers
curl -I http://localhost:3000
```

---

## 🎨 Frontend Development

### Editing HTML/CSS
1. Edit `index.html`
2. Refresh browser (Cmd+R / Ctrl+R)
3. Changes appear instantly (no rebuild needed in dev)

### Editing Server Code
1. Edit `server.js` or files in `routes/`
2. nodemon auto-restarts
3. Changes take effect immediately

### Editing Assets
- `assets/` - CSS, images, client JS
- `images/` - Additional images
- Changes reflected on browser refresh

---

## 🧪 Testing

### Manual Testing
```bash
# Start server in one terminal
npm run dev

# In another terminal, test:
curl http://localhost:3000/health
curl http://localhost:3000/api/status

# Open browser:
# http://localhost:3000
```

### Automated Tests (when added)
```bash
npm test           # All tests
npm run test:unit  # Unit tests
npm run test:e2e   # End-to-end tests
```

---

## 📊 Monitoring in Development

### Local Monitoring Stack (Docker Compose)
```bash
# Start full monitoring
docker-compose up -d prometheus grafana loki

# Access dashboards:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
# Loki: http://localhost:3100
```

### Simple Metrics
Server exposes:
- `GET /health` - Health check
- `GET /metrics` - Basic metrics (if ENABLE_METRICS=true)

---

## 🔐 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment (development/production) |
| `PORT` | 3000 | Server port |
| `HOST` | 0.0.0.0 | Bind host |
| `DATABASE_HOST` | localhost | PostgreSQL host |
| `DATABASE_PORT` | 5432 | PostgreSQL port |
| `DATABASE_NAME` | markzap | Database name |
| `DATABASE_USER` | markzap | Database user |
| `DATABASE_PASSWORD` | (none) | Database password |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `REDIS_PASSWORD` | (none) | Redis password |
| `SESSION_SECRET` | dev-secret | Session encryption key |
| `LOG_LEVEL` | debug | Logging level (debug/info/warn/error) |
| `CORS_ORIGIN` | * | Allowed CORS origins |
| `ENABLE_METRICS` | true | Enable /metrics endpoint |

See `.env.example` for full list.

---

## 🐛 Common Issues & Fixes

### Issue: "Port 3000 already in use"
**Fix:**
```bash
# Find process using port 3000
lsof -ti:3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill it
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env:
PORT=3001
```

### Issue: "Cannot find module 'dotenv'"
**Fix:**
```bash
npm install dotenv --save-dev
```

### Issue: "Database connection refused"
**Fix:**
```bash
# Start PostgreSQL
# Using Docker:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16-alpine

# Or start local service:
# Mac:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows:
# Start PostgreSQL from Services or Docker
```

### Issue: "nodemon not found"
**Fix:**
```bash
# Install globally OR locally (already in devDependencies)
npm install -g nodemon

# Or use npx:
npx nodemon server.js
```

### Issue: "build script not found"
**Fix:**
```bash
# Ensure scripts/build.js exists
ls -la scripts/build.js

# If missing, recreate:
node -e "console.log('Build script exists')"

# Or re-run setup:
node scripts/setup-dev.js  # if created
```

### Issue: Changes not reflecting
**Fix:**
1. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
2. Hard refresh
3. Check nodemon is watching correct files (nodemon.json)
4. Restart nodemon manually: Ctrl+C then `npm run dev`

---

## 🚀 Deploying from Development

When ready to deploy:

```bash
# 1. Test everything
npm test

# 2. Build production assets
npm run build

# 3. Commit
git add .
git commit -m "feat: ready for production"

# 4. Push (triggers CI/CD)
git push origin main

# 5. Vercel auto-deploys
# Watch: https://vercel.com/[your-org]/markzap
```

---

## 📁 Project Structure (Dev View)

```
webside/
├── index.html          ← Edit this (main page)
├── server.js           ← Edit this (backend logic)
├── package.json        ← Dependencies & scripts
├── .env                ← Your local env vars (gitignored)
├── .env.example        ← Template (committed)
├── nodemon.json        ← Dev server config
├── Dockerfile          ← Production container
├── docker-compose.yml  ← Full stack locally
│
├── assets/             ← CSS, client JS, images
│   ├── style.css
│   └── script.js
│
├── images/             ← Images
│
├── routes/             ← API routes
│   └── api.js
│
├── public/             ← Generated by `npm run build`
│   ├── index.html      ← (minified)
│   ├── assets/
│   └── ...
│
├── scripts/            ← Build & utility scripts
│   ├── build.js
│   ├── deploy.sh
│   ├── backup.sh
│   └── security-check.js
│
├── monitoring/         ← Prometheus, Grafana, Loki configs
├── terraform/          ← AWS infrastructure
├── k8s/                ← Kubernetes manifests
├── charts/             ← Helm charts
├── config/             ← Configuration files
│
├── node_modules/       ← Dependencies (gitignored)
├── backup/             ← Backups (gitignored)
└── .git/               ← Git repository
```

---

## 🔄 Workflow Examples

### Typical Development Session
```bash
# 1. Start dev server
npm run dev

# 2. Edit index.html in your editor
# 3. Refresh browser - see changes
# 4. Edit server.js
# 5. nodemon auto-restarts
# 6. Test curl:
curl http://localhost:3000/health
# 7. Commit when feature done
git add .
git commit -m "feat: add hero section"
git push
```

### Adding a New API Endpoint
```javascript
// 1. Edit routes/api.js
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Process contact form
  res.json({ success: true });
});

// 2. Server auto-reloads (nodemon)
// 3. Test:
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'

# 4. Commit
```

### Adding a New Page
```html
<!-- 1. Edit index.html, add new section -->
<section id="new-page">
  <h2>New Page</h2>
  <p>Content here</p>
</section>

<!-- 2. Add nav link -->
<a href="#new-page">New Page</a>

# 3. Refresh browser
# 4. Test navigation
# 5. Commit
```

---

## 🧹 Cleanup Commands

```bash
# Remove build artifacts
npm run clean
# or manually:
rm -rf public/

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm ci

# Clean Docker (if using)
docker system prune -a

# Clean backups (old ones only - keep recent)
find backup/ -type f -mtime +7 -delete
```

---

## 📈 Performance Tips (Dev)

1. **Use `npm run dev`** - Only rebuilds what changed
2. **Disable heavy monitoring** - Stop Docker services not in use
3. **Increase Node memory** if needed:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```
4. **Use `nodemon`** - Faster than restarting manually

---

## 🐛 Debugging Tips

### 1. Check Server Logs
```bash
npm run dev 2>&1 | tee dev.log
# View real-time logs with filtering
```

### 2. Enable Verbose Logging
Add to `.env`:
```env
LOG_LEVEL=debug
```

### 3. Debug with Chrome DevTools
```bash
# Run with inspector
node --inspect server.js
# Then open: chrome://inspect
```

### 4. Profile Memory
```bash
# Take heap snapshot
node --heapsnapshot-signal=SIGUSR2 server.js
# Analyze in Chrome DevTools Memory tab
```

---

## 🔐 Security in Development

**Important:** Development mode relaxes some security:

- CSP allows `'unsafe-inline'` and `'unsafe-eval'` for easier debugging
- CORS allows all origins (`*`)
- Detailed error messages exposed
- No rate limiting

**Never use `npm run dev` in production!**

Production uses:
- Strict CSP (no 'unsafe-inline')
- CORS restricted to markzap.online
- Generic error messages
- Rate limiting enabled

---

## 📚 Additional Resources

### Node.js Debugging
- https://nodejs.org/en/docs/guides/debugging-getting-started/
- https://nodemon.io/

### Express.js
- https://expressjs.com/en/advanced/best-practice-performance.html

### Security
- https://helmetjs.github.io/
- https://content-security-policy.com/

### Docker
- https://docs.docker.com/get-started/

---

## 🆘 Getting Help

1. **Check logs** - Most errors are explained in console
2. **Read error messages** - They're usually descriptive
3. **Search issues** - Google the error + "nodejs" or "express"
4. **Check docs** - Links above
5. **Create issue** - If bug in code, open GitHub issue

---

## ✅ Pre-Commit Checklist

Before `git push`, run:

```bash
# 1. Lint (if configured)
npm run lint

# 2. Security check
npm run security-check

# 3. Build production
npm run build

# 4. Test locally
curl http://localhost:3000/health

# 5. Run full test suite
npm test

# 6. Check for secrets
git grep -i "api_key\|secret\|password" || echo "No secrets found"

# 7. Commit
git add .
git commit -m "feat: your feature"
```

---

## 🎯 That's It!

You're ready to develop. Start with:

```bash
npm ci          # Install (one-time)
npm run dev     # Start developing
```

**Happy coding! 🚀**
