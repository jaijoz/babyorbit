import { X, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DocumentManager({ isOpen, onClose }) {
  const { user } = useAuth();
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#1f2937', borderRadius: '12px', width: '100%', maxWidth: '28rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #374151' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '18px' }}>My Documents</h2>
          <button onClick={onClose} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <FileText size={48} style={{ margin: '0 auto 16px', color: '#4b5563' }} />
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>Document storage coming soon!</p>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Upload vaccination cards, prescriptions, and medical reports here.</p>
        </div>
      </div>
    </div>
  );
}
