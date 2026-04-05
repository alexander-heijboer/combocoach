import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORKOUTS } from '../data/workouts';
import type { Workout } from '../data/workouts';
import { Flame, Target, Play, Clock, Settings, Wand2, Zap } from 'lucide-react';
import { HeavyBag, Shadowbox, BoxingPads } from '../components/Icons';
import { useAppStore } from '../store/useAppStore';
import { calculateDynamicPunches } from '../utils/workoutUtils';

type Modality = Workout['type'];

const difficultyOrder: Record<Workout['difficulty'], number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3
};

export default function Workouts() {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<Modality | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Workout['difficulty'] | 'All'>('All');
  const { workoutPace, isPro, customWorkouts } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredWorkouts = WORKOUTS
    .filter(w => (selectedType === 'All' || w.type === selectedType))
    .filter(w => (selectedDifficulty === 'All' || w.difficulty === selectedDifficulty))
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

  const modalities: { type: Modality; label: string; icon: any }[] = [
    { type: 'Warming up', label: 'Warmup', icon: Flame },
    { type: 'Solo Bag', label: 'Heavy Bag', icon: HeavyBag },
    { type: 'Solo Shadowboxing', label: 'Shadowbox', icon: Shadowbox },
    { type: 'Pads Training', label: 'Pads', icon: BoxingPads },
  ];

  const renderSkeletons = () => (
    <div className="workout-list">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="workout-item skeleton" style={{ height: '100px', border: 'none', opacity: 0.15 }}></div>
      ))}
    </div>
  );


  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">Workouts</h1>
          <p>Choose your mode.</p>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="header-action sidebar-redundant"
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="modality-grid animate-in" style={{ animationDelay: '0.1s' }}>
        {modalities.map(({ type, label, icon: Icon }) => (
          <div 
            key={type} 
            className={`modality-card spring-press ${selectedType === type ? 'selected' : ''}`}
            onClick={() => setSelectedType(selectedType === type ? 'All' : type)}
          >
            <Icon size={24} color={selectedType === type ? 'var(--accent-primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="difficulty-filters animate-in" style={{ animationDelay: '0.2s' }}>
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <div 
            key={diff} 
            className={`difficulty-filter-pill spring-press ${selectedDifficulty === diff ? 'active' : ''} ${diff}`}
            onClick={() => setSelectedDifficulty(diff as any)}
          >
            {diff}
          </div>
        ))}
      </div>

      <div className="animate-in" style={{ animationDelay: '0.25s', marginBottom: '24px' }}>
        <div 
          className="workout-item spring-press" 
          onClick={() => navigate('/ai-workout')}
          style={{ background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.1) 0%, rgba(88, 204, 2, 0.02) 100%)', borderColor: 'rgba(88, 204, 2, 0.3)' }}
        >
          <div className="workout-info">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>AI Beta</span>
            </div>
            <h3 style={{ marginTop: '4px', color: 'var(--accent-primary)' }}>AI ComboCoach</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Custom rounds, pace & focus</p>
          </div>
          <div
            style={{ 
              background: 'var(--accent-primary)', 
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
            }}
          >
            <Wand2 size={18} />
          </div>
        </div>

        <div 
          className="workout-item spring-press" 
          onClick={() => navigate('/workout/custom-builder')}
          style={{ background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.05) 0%, rgba(88, 204, 2, 0.01) 100%)', borderColor: isPro ? 'rgba(88, 204, 2, 0.3)' : 'var(--border)' , marginTop: '12px'}}
        >
          <div className="workout-info">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: isPro ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>PRO FEATURE</span>
            </div>
            <h3 style={{ marginTop: '4px', color: isPro ? 'var(--accent-primary)' : 'var(--text-main)' }}>Custom Combo Builder</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Build your own specific rounds</p>
          </div>
          <div
            style={{ 
              background: isPro ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPro ? '#000' : 'var(--text-muted)',
            }}
          >
            <Settings size={18} />
          </div>
        </div>
      </div>

      <div className="workout-list animate-in" style={{ animationDelay: '0.3s' }}>
        {loading ? (
          renderSkeletons()
        ) : filteredWorkouts.length > 0 ? (
          (() => {
            const isPro = useAppStore.getState().isPro;
            const displayWorkouts = isPro ? filteredWorkouts : filteredWorkouts.filter(w => w.difficulty !== 'Advanced').slice(0, 3);
            
            return (
              <>
                {displayWorkouts.map((w) => (
                  <div key={w.id} className="workout-item spring-press" onClick={() => navigate(`/workout/${w.id}`)}>
                    <div className="workout-info">
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`difficulty-pill difficulty-${w.difficulty}`}>{w.difficulty}</span>
                        <span style={{ fontSize: '11px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{w.focus}</span>
                      </div>
                      <h3 style={{ marginTop: '4px' }}>{w.title}</h3>
                      <div className="workout-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {w.duration}m</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Target size={12} /> {w.rounds} Rd</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Zap size={12} /> ~{calculateDynamicPunches(w, workoutPace)}</span>
                      </div>
                    </div>
                    <div
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <Play size={18} fill="currentColor" />
                    </div>
                  </div>
                ))}
                {!isPro && filteredWorkouts.length > 3 && (
                  <div 
                    className="card spring-press" 
                    onClick={() => useAppStore.getState().setProModalOpen(true)}
                    style={{ 
                      marginTop: '12px', 
                      textAlign: 'center', 
                      background: 'rgba(255, 215, 0, 0.05)', 
                      borderColor: 'rgba(255, 215, 0, 0.2)',
                      padding: '24px'
                    }}
                  >
                    <div style={{ color: '#FFD700', fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>UNLOCK {filteredWorkouts.length - 3}+ MORE WORKOUTS</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get Pro to access Advanced level and full library</div>
                  </div>
                )}
                {isPro && customWorkouts && customWorkouts.length > 0 && selectedType === 'All' && selectedDifficulty === 'All' && (
                  <>
                    <h2 className="heading-m" style={{ marginTop: '32px', marginBottom: '16px' }}>Your Custom Workouts</h2>
                    {customWorkouts.map((w: any) => (
                      <div key={w.id} className="workout-item spring-press" style={{ borderColor: 'rgba(88, 204, 2, 0.3)' }} onClick={() => { useAppStore.getState().setAiWorkout(w); navigate(`/workout/ai-generated`); }}>
                        <div className="workout-info">
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>CUSTOM</span>
                          </div>
                          <h3 style={{ marginTop: '4px' }}>{w.title}</h3>
                          <div className="workout-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {w.duration}m</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Target size={12} /> {w.rounds} Rd</span>
                          </div>
                        </div>
                        <div
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          <Play size={18} fill="currentColor" />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            );
          })()
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No workouts found for this type.
          </div>
        )}
      </div>
    </div>
  );
}
