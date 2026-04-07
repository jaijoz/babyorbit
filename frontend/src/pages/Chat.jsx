import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Paperclip, X, FileText, Image, File } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DocumentManager from '../components/DocumentManager';
import { useAuth } from '../contexts/AuthContext';
import { createSession, sendMessage } from '../services/api';
import { saveChat, loadChats, deleteChat } from '../services/chatStorage';

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(type) {
  if (type.startsWith('image/')) return <Image size={12} />;
  if (type === 'application/pdf' || type.startsWith('text/')) return <FileText size={12} />;
  return <File size={12} />;
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // strip data-url prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TEXT_EXTENSIONS = /\.(txt|md|json|csv|xml|js|jsx|ts|tsx|py|java|c|cpp|h|css|html|yaml|yml|toml|ini|log|sh|bash|r|sql|swift|kt|go|rs|rb|php|dart)$/i;
const INLINE_MIME_PREFIX = ['image/', 'application/pdf'];

async function fileToADKPart(file) {
  const isText = file.type.startsWith('text/') || TEXT_EXTENSIONS.test(file.name);
  const isInline = INLINE_MIME_PREFIX.some(p => file.type.startsWith(p));

  if (isText) {
    const text = await file.text();
    return { text: `[Attached file: ${file.name}]\n\`\`\`\n${text}\n\`\`\`` };
  }
  if (isInline) {
    const data = await readAsBase64(file);
    return { inline_data: { mime_type: file.type, data } };
  }
  // Unsupported binary — mention filename + size
  return { text: `[Attached file: ${file.name} | ${formatSize(file.size)} | type: ${file.type || 'unknown'}]` };
}

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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { loadChats(user?.uid).then(setChats); }, [user]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function startNewChat() {
    try {
      const sess = await createSession();
      const id = genId();
      setSessionId(sess.id || sess.session_id);
      setActiveChatId(id);
      setMessages([]);
    } catch {
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

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    e.target.value = ''; // reset so same file can be re-selected
  }

  function removeFile(index) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSend() {
    if ((!input.trim() && selectedFiles.length === 0) || loading) return;
    const text = input.trim();
    setInput('');
    const filesToSend = [...selectedFiles];
    setSelectedFiles([]);

    let sid = sessionId;
    let chatId = activeChatId;

    if (!sid) {
      try {
        const sess = await createSession();
        sid = sess.id || sess.session_id;
        setSessionId(sid);
      } catch {
        if (!chatId) { chatId = genId(); setActiveChatId(chatId); }
        const errMsgs = [...messages,
          { role: 'user', text, files: filesToSend.map(f => ({ name: f.name, size: f.size, type: f.type })) },
          { role: 'assistant', text: '⚠️ The AI service is temporarily busy. Please wait 30-60 seconds and try again.' }
        ];
        setMessages(errMsgs);
        return;
      }
    }
    if (!chatId) { chatId = genId(); setActiveChatId(chatId); }

    const userMsg = {
      role: 'user',
      text,
      files: filesToSend.map(f => ({ name: f.name, size: f.size, type: f.type }))
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    // Convert files to ADK parts
    const fileParts = await Promise.all(filesToSend.map(fileToADKPart));

    sendMessage(sid, text, fileParts,
      (partial) => setMessages([...updated, { role: 'assistant', text: partial }]),
      (final) => {
        const finalMsgs = [...updated, { role: 'assistant', text: final }];
        setMessages(finalMsgs);
        setLoading(false);
        const title = (text || filesToSend[0]?.name || 'File').slice(0, 40);
        saveChat(chatId, title, finalMsgs, user?.uid);
        setChats(prev => {
          const filtered = prev.filter(c => c.id !== chatId);
          return [{ id: chatId, title, messages: finalMsgs, updatedAt: Date.now() }, ...filtered];
        });
      }
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background 0.2s ease' }}>
      <Sidebar chats={chats} activeChat={activeChatId} onSelectChat={selectChat} onNewChat={startNewChat} onDeleteChat={handleDeleteChat} onShowDocs={() => setShowDocs(true)} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <DocumentManager isOpen={showDocs} onClose={() => setShowDocs(false)} />

      {/* Hidden file input — accepts any file type */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <span style={{ fontSize: '64px', marginBottom: '16px' }}>🌟</span>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>Welcome to BabyOrbit</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '28rem' }}>Your AI parenting companion. Ask about pregnancy, newborn care, vaccinations, or anything parenting-related.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
                {['My baby was born last month', 'What vaccines are due at 2 months?', 'Safe sleep tips for newborns', 'Is it normal for baby to spit up?'].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    style={{ padding: '8px 12px', background: 'var(--quick-btn-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', color: 'var(--quick-btn-text)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--quick-btn-hover-bg)'; e.currentTarget.style.color = 'var(--quick-btn-hover-text)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--quick-btn-bg)'; e.currentTarget.style.color = 'var(--quick-btn-text)'; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div style={{ maxWidth: '80%' }}>
                    {/* File attachments shown above bubble */}
                    {msg.files?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {msg.files.map((f, fi) => (
                          <span key={fi} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '3px 8px', borderRadius: '6px', fontSize: '11px',
                            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)'
                          }}>
                            {fileIcon(f.type)} {f.name} <span style={{ color: 'var(--text-muted)' }}>({formatSize(f.size)})</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Message bubble — only render if there's text */}
                    {msg.text && (
                      <div style={{
                        padding: '12px 16px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                        ...(msg.role === 'user'
                          ? { background: 'var(--user-bubble)', color: '#fff', borderBottomRightRadius: '4px' }
                          : { background: 'var(--bot-bubble)', color: 'var(--bot-bubble-text)', borderBottomLeftRadius: '4px' })
                      }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ background: 'var(--bot-bubble)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px' }}>
                    <Loader2 className="animate-spin" size={18} style={{ color: '#818cf8' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', background: 'var(--bg-primary)', transition: 'background 0.2s ease' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto' }}>

            {/* Selected file chips */}
            {selectedFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {selectedFiles.map((f, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)', maxWidth: '200px'
                  }}>
                    {fileIcon(f.type)}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>({formatSize(f.size)})</span>
                    <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--input-bg)', borderRadius: '12px', padding: '8px 12px', border: '1px solid var(--border-color)' }}>
              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s ease' }}
                onMouseOver={e => { e.currentTarget.style.color = '#4f46e5'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Paperclip size={18} />
              </button>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about pregnancy, baby care, vaccines..."
                style={{ flex: 1, background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', fontSize: '14px' }}
              />

              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && selectedFiles.length === 0)}
                style={{
                  padding: '8px', borderRadius: '8px', border: 'none', flexShrink: 0,
                  background: (loading || (!input.trim() && selectedFiles.length === 0)) ? 'var(--send-disabled)' : '#4f46e5',
                  color: (loading || (!input.trim() && selectedFiles.length === 0)) ? 'var(--text-muted)' : '#fff',
                  cursor: (loading || (!input.trim() && selectedFiles.length === 0)) ? 'not-allowed' : 'pointer',
                  opacity: (loading || (!input.trim() && selectedFiles.length === 0)) ? 0.5 : 1,
                  transition: 'background 0.15s ease'
                }}>
                <Send size={16} />
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--disclaimer)', marginTop: '8px' }}>
              BabyOrbit may make mistakes. Always consult your pediatrician.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
