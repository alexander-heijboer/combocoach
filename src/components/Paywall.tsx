import { Sparkles, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface PaywallProps {
  title: string;
  description: string;
  feature?: string;
}

export function Paywall({ title, description, feature }: PaywallProps) {
  const setProModalOpen = useAppStore(state => state.setProModalOpen);

  return (
    <div className="flex-center animate-in" style={{ 
      flexDirection: 'column', 
      textAlign: 'center', 
      padding: '40px 24px',
      minHeight: '400px',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '16px', 
        background: 'rgba(255, 215, 0, 0.1)', 
        border: '1px solid rgba(255, 215, 0, 0.3)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#FFD700',
        marginBottom: '24px',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)'
      }}>
        <Lock size={32} />
      </div>

      <h2 className="heading-m" style={{ marginBottom: '12px' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '280px', marginBottom: '32px' }}>
        {description}
      </p>

      {feature && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '12px 20px', 
          borderRadius: '100px', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px'
        }}>
          <Sparkles size={14} color="#FFD700" />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>{feature}</span>
        </div>
      )}

      <button 
        className="btn-primary spring-press" 
        onClick={() => setProModalOpen(true)}
        style={{ 
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          color: '#000',
          fontWeight: '900',
          border: 'none',
          boxShadow: '0 8px 24px rgba(255, 165, 0, 0.2)'
        }}
      >
        Unlock Pro Access
      </button>
      
      <p style={{ marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        One-time purchase • Lifetime access
      </p>
    </div>
  );
}
