import { MessageSquarePlus, Trash2, LogIn, LogOut, FileText, X, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat, onShowDocs, isOpen, onToggle }) {
  const { user, login, logout } = useAuth();

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
        style={{ display: 'none', position: 'fixed', top: '12px', left: '12px', zIndex: 50, padding: '8px', background: '#1f2937', borderRadius: '8px', color: '#fff', border: 'none', cursor: 'pointer' }}
        className="mobile-menu-btn">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div style={{
        width: '280px', minWidth: '280px', height: '100vh', background: '#111827', borderRight: '1px solid #374151',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🌟</span>
            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '18px' }}>BabyOrbit</span>
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
              <p style={{ fontSize: '11px', color: '#6b7280', padding: '4px 8px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
              {items.map(chat => (
                <div key={chat.id} onClick={() => onSelectChat(chat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', marginBottom: '2px',
                    background: chat.id === activeChat ? '#374151' : 'transparent',
                    color: chat.id === activeChat ? '#fff' : '#9ca3af'
                  }}
                  onMouseOver={e => { if (chat.id !== activeChat) { e.currentTarget.style.background = '#1f2937'; e.currentTarget.style.color = '#fff'; }}}
                  onMouseOut={e => { if (chat.id !== activeChat) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{chat.title || 'New Chat'}</span>
                  <button onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {chats.length === 0 && <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>No chats yet</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid #374151' }}>
          <button onClick={onShowDocs}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
            <FileText size={16} /> My Documents
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginTop: '4px' }}>
              <img src={user.photoURL} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{user.displayName}</span>
              <button onClick={logout} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><LogOut size={16} /></button>
            </div>
          ) : (
            <button onClick={login}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '4px', textAlign: 'left' }}>
              <LogIn size={16} /> Sign in to sync
            </button>
          )}
        </div>
      </div>
    </>
  );
}
