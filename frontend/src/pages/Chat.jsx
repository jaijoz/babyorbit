import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DocumentManager from '../components/DocumentManager';
import { useAuth } from '../contexts/AuthContext';
import { createSession, sendMessage } from '../services/api';
import { saveChat, loadChats, deleteChat } from '../services/chatStorage';

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { loadChats(user?.uid).then(setChats); }, [user]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function startNewChat() {
    try {
      const sess = await createSession();
      const id = genId();
      setSessionId(sess.id || sess.session_id);
      setActiveChatId(id);
      setMessages([]);
    } catch (err) {
      const id = genId();
      setActiveChatId(id);
      setMessages([{ role: 'assistant', text: '⚠️ Could not start a new session. The service may be temporarily unavailable. Please try again in 30-60 seconds.' }]);
    }
  }

  function selectChat(id) {
    const chat = chats.find(c => c.id === id);
    if (chat) { setActiveChatId(id); setMessages(chat.messages || []); setSessionId(null); }
  }

  async function handleDeleteChat(id) {
    await deleteChat(id, user?.uid);
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) { setActiveChatId(null); setMessages([]); }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');

    let sid = sessionId;
    let chatId = activeChatId;

    if (!sid) {
      try {
        const sess = await createSession();
        sid = sess.id || sess.session_id;
        setSessionId(sid);
      } catch {
        if (!chatId) { chatId = genId(); setActiveChatId(chatId); }
        const errMsgs = [...messages, { role: 'user', text }, { role: 'assistant', text: '⚠️ The AI service is temporarily busy. Please wait 30-60 seconds and try again. Your message was not lost!' }];
        setMessages(errMsgs);
        return;
      }
    }
    if (!chatId) { chatId = genId(); setActiveChatId(chatId); }

    const userMsg = { role: 'user', text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    sendMessage(sid, text,
      (partial) => setMessages([...updated, { role: 'assistant', text: partial }]),
      (final) => {
        const finalMsgs = [...updated, { role: 'assistant', text: final }];
        setMessages(finalMsgs);
        setLoading(false);
        const title = text.length > 40 ? text.slice(0, 40) + '...' : text;
        saveChat(chatId, title, finalMsgs, user?.uid);
        setChats(prev => {
          const filtered = prev.filter(c => c.id !== chatId);
          return [{ id: chatId, title, messages: finalMsgs, updatedAt: Date.now() }, ...filtered];
        });
      }
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#030712', color: '#fff' }}>
      <Sidebar chats={chats} activeChat={activeChatId} onSelectChat={selectChat} onNewChat={startNewChat} onDeleteChat={handleDeleteChat} onShowDocs={() => setShowDocs(true)} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <DocumentManager isOpen={showDocs} onClose={() => setShowDocs(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <span style={{ fontSize: '64px', marginBottom: '16px' }}>🌟</span>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome to BabyOrbit</h2>
              <p style={{ color: '#9ca3af', maxWidth: '28rem' }}>Your AI parenting companion. Ask about pregnancy, newborn care, vaccinations, or anything parenting-related.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
                {['My baby was born last month', 'What vaccines are due at 2 months?', 'Safe sleep tips for newborns', 'Is it normal for baby to spit up?'].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    style={{ padding: '8px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '13px', color: '#d1d5db', cursor: 'pointer' }}
                    onMouseOver={e => { e.target.style.background = '#374151'; e.target.style.color = '#fff'; }}
                    onMouseOut={e => { e.target.style.background = '#1f2937'; e.target.style.color = '#d1d5db'; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                    ...(msg.role === 'user'
                      ? { background: '#4f46e5', color: '#fff', borderBottomRightRadius: '4px' }
                      : { background: '#1f2937', color: '#f3f4f6', borderBottomLeftRadius: '4px' })
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ background: '#1f2937', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px' }}>
                    <Loader2 className="animate-spin" size={18} style={{ color: '#818cf8' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #1f2937', padding: '16px' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#1f2937', borderRadius: '12px', padding: '8px 12px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about pregnancy, baby care, vaccines..."
              style={{ flex: 1, background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              style={{ padding: '8px', borderRadius: '8px', background: loading || !input.trim() ? '#374151' : '#4f46e5', color: '#fff', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.3 : 1 }}>
              <Send size={16} />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#4b5563', marginTop: '8px' }}>BabyOrbit may make mistakes. Always consult your pediatrician.</p>
        </div>
      </div>
    </div>
  );
}
