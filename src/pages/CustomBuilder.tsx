import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Trash2, CheckSquare } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Paywall } from '../components/Paywall';
import type { Workout } from '../data/workouts';

export default function CustomBuilder() {
  const navigate = useNavigate();
  const isPro = useAppStore(state => state.isPro);
  const addCustomWorkout = useAppStore(state => state.addCustomWorkout);

  const [title, setTitle] = useState('My Custom Workout');
  const [rounds, setRounds] = useState(3);
  const [roundLength, setRoundLength] = useState(180); // seconds
  const [restBetweenRounds, setRestBetweenRounds] = useState(60); // seconds
  const [combinations, setCombinations] = useState<string[]>(['1 - 2', '1 - 2 - 3', '2 - 3 - 2']);
  const [newCombo, setNewCombo] = useState('');

  const handleAddCombo = () => {
    if (newCombo.trim() !== '') {
      setCombinations([...combinations, newCombo.trim()]);
      setNewCombo('');
    }
  };

  const handleRemoveCombo = (index: number) => {
    const nextCombos = [...combinations];
    nextCombos.splice(index, 1);
    setCombinations(nextCombos);
  };

  const handleSave = () => {
    if (combinations.length === 0) {
      alert('Please add at least one combination.');
      return;
    }

    const newWorkout: Workout & { id: string } = {
      id: 'custom-' + Date.now().toString(),
      type: 'Solo Bag',
      title: title,
      duration: Math.ceil((rounds * roundLength + (rounds - 1) * restBetweenRounds) / 60),
      rounds: rounds,
      roundLength: roundLength,
      restBetweenRounds: restBetweenRounds,
      combinations: combinations,
      difficulty: 'Intermediate',
      focus: 'Conditioning',
      punchesEst: 0
    };

    addCustomWorkout(newWorkout);
    navigate('/workouts');
  };

  if (!isPro) {
    return (
      <div className="animate-in" style={{ padding: '24px' }}>
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="heading-xl">Custom Combos</h1>
            <p>Build your own workout.</p>
          </div>
          <button onClick={() => navigate(-1)} className="header-action"><X size={22} /></button>
        </div>
        <Paywall 
          title="Custom Combo Builder" 
          description="Unlock the ability to create entirely custom workout rounds, tailored specifically to your needs."
          feature="Pro Feature: Custom Workouts"
        />
      </div>
    );
  }

  return (
    <div className="animate-in" style={{ paddingBottom: '100px' }}>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">Combo Builder</h1>
          <p>Design your own drills.</p>
        </div>
        <button onClick={() => navigate(-1)} className="header-action"><X size={22} /></button>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Workout Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rounds</label>
              <span style={{ fontWeight: 800 }}>{rounds}</span>
            </div>
            <input 
              type="range" min="1" max="15" 
              value={rounds} onChange={e => setRounds(Number(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Round Length</label>
            <select value={roundLength} onChange={e => setRoundLength(Number(e.target.value))} className="ai-select">
              <option value="60">1 Min</option>
              <option value="120">2 Min</option>
              <option value="180">3 Min</option>
              <option value="300">5 Min</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Rest Period</label>
            <select value={restBetweenRounds} onChange={e => setRestBetweenRounds(Number(e.target.value))} className="ai-select">
              <option value="15">15 Sec</option>
              <option value="30">30 Sec</option>
              <option value="45">45 Sec</option>
              <option value="60">1 Min</option>
              <option value="90">1.5 Min</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <h2 className="heading-m" style={{ marginBottom: '16px' }}>Combinations</h2>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input 
            type="text"
            placeholder="e.g. 1 - 2 - 3b"
            value={newCombo}
            onChange={(e) => setNewCombo(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}
          />
          <button 
            className="btn-primary spring-press"
            onClick={handleAddCombo}
            style={{ padding: '12px 16px', width: 'auto' }}
          >
            <Plus size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {combinations.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{c}</span>
              <button onClick={() => handleRemoveCombo(i)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {combinations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No combos added.</div>
          )}
        </div>
      </div>

      <button className="btn-primary spring-press" onClick={handleSave} style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
        <CheckSquare size={20} fill="currentColor" /> SAVE WORKOUT
      </button>

    </div>
  );
}
