import { MessageSquarePlus, Trash2, LogIn, LogOut, FileText, X, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat, onShowDocs, isOpen, onToggle }) {
  const { user, login, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const grouped = chats.reduce((acc, chat) => {
    const d = new Date(chat.updatedAt);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    const label = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff < 7 ? 'This Week' : 'Older';
    (acc[label] = acc[label] || []).push(chat);
    return acc;
  }, {});

  return (
    <>
      <button onClick={onToggle}
        style={{ display: 'none', position: 'fixed', top: '12px', left: '12px', zIndex: 50, padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
        className="mobile-menu-btn">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div style={{
        width: '280px', minWidth: '280px', height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'background 0.2s ease'
      }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🌟</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '18px' }}>BabyOrbit</span>
            </div>

            {/* Theme toggle switch */}
            <button
              onClick={toggle}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                position: 'relative', display: 'none', alignItems: 'center',
                width: '52px', height: '26px', borderRadius: '13px',
                background: theme === 'dark' ? '#4f46e5' : '#e2e8f0',
                border: 'none', cursor: 'pointer', padding: '3px',
                flexShrink: 0, transition: 'background 0.25s ease'
              }}
            >
              <Sun size={11} style={{
                position: 'absolute', left: '6px',
                color: theme === 'dark' ? '#818cf8' : '#f59e0b',
                transition: 'color 0.2s'
              }} />
              <Moon size={11} style={{
                position: 'absolute', right: '6px',
                color: theme === 'dark' ? '#c7d2fe' : '#94a3b8',
                transition: 'color 0.2s'
              }} />
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transform: theme === 'dark' ? 'translateX(26px)' : 'translateX(0)',
                transition: 'transform 0.25s ease',
                zIndex: 1, flexShrink: 0
              }} />
            </button>
          </div>

          <button onClick={onNewChat}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            <MessageSquarePlus size={16} /> New Chat
          </button>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label} style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
              {items.map(chat => (
                <div key={chat.id} onClick={() => onSelectChat(chat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', marginBottom: '2px',
                    background: chat.id === activeChat ? 'var(--bg-hover)' : 'transparent',
                    color: chat.id === activeChat ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseOver={e => { if (chat.id !== activeChat) { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                  onMouseOut={e => { if (chat.id !== activeChat) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{chat.title || 'New Chat'}</span>
                  <button onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {chats.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>No chats yet</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onShowDocs}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
            <FileText size={16} /> My Documents
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginTop: '4px' }}>
              <img src={user.photoURL} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{user.displayName}</span>
              <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><LogOut size={16} /></button>
            </div>
          ) : (
            <button onClick={login}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '4px', textAlign: 'left' }}>
              <LogIn size={16} /> Sign in to sync
            </button>
          )}
        </div>
      </div>
    </>
  );
}
