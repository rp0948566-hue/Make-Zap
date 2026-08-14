import { supabase } from './supabaseClient';

/**
 * Save chat session to Supabase database table `chats`
 */
export const saveChatToSupabase = async (userId, title, messages) => {
  if (!userId) {
    // Save to localStorage if guest
    const localChats = JSON.parse(localStorage.getItem('mz_chats') || '[]');
    const newChat = { id: Date.now().toString(), title, messages, created_at: new Date().toISOString() };
    const updated = [newChat, ...localChats.filter(c => c.title !== title)];
    localStorage.setItem('mz_chats', JSON.stringify(updated));
    return newChat;
  }

  try {
    const { data, error } = await supabase
      .from('chats')
      .upsert({
        user_id: userId,
        title: title || 'New Conversation',
        messages,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,title' })
      .select();

    if (error) {
      console.warn('Supabase DB notice (falling back to localStorage if table not initialized):', error.message);
      const localChats = JSON.parse(localStorage.getItem('mz_chats') || '[]');
      const newChat = { id: Date.now().toString(), title, messages, created_at: new Date().toISOString() };
      const updated = [newChat, ...localChats.filter(c => c.title !== title)];
      localStorage.setItem('mz_chats', JSON.stringify(updated));
      return newChat;
    }

    return data?.[0];
  } catch (err) {
    console.error('Error saving chat:', err);
  }
};

/**
 * Fetch chat history for logged in user from Supabase or localStorage
 */
export const fetchUserChats = async (userId) => {
  if (!userId) {
    return JSON.parse(localStorage.getItem('mz_chats') || '[]');
  }

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error || !data) {
      return JSON.parse(localStorage.getItem('mz_chats') || '[]');
    }

    return data;
  } catch (err) {
    return JSON.parse(localStorage.getItem('mz_chats') || '[]');
  }
};
