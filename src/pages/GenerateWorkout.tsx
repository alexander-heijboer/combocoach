import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, X, Settings2, Loader2, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateAIWorkout } from '../utils/aiWorkoutService';
import { Paywall } from '../components/Paywall';

export default function GenerateWorkout() {
  const navigate = useNavigate();
  const setAiWorkout = useAppStore(state => state.setAiWorkout);
  
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [rounds, setRounds] = useState(6);
  const [roundLength, setRoundLength] = useState(180); // seconds
  const [restPeriod, setRestPeriod] = useState(60); // seconds
  const [pace, setPace] = useState(30); // Seconds per combo
  const [warmup, setWarmup] = useState<'None' | 'Boxing' | 'Mix'>('Boxing');
  const [focus, setFocus] = useState<'Speed' | 'Power' | 'Defense' | 'Conditioning' | 'Footwork' | 'Technique'>('Conditioning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);
  const isPro = useAppStore(state => state.isPro);

  const handleGenerate = async () => {
    if (!isPro) return;
    setIsGenerating(true);
    setErrorMSG(null);
    try {
      // For now, if we don't have a backend we mock or use the service.
      // We will implement `generateAIWorkout` to call `.env` loaded API OR return a mocked error if missing.
      const workout = await generateAIWorkout({
        difficulty,
        rounds,
        roundLength,
        restPeriod,
        pace,
        warmup,
        focus
      });
      
      setAiWorkout(workout);
      navigate('/workout/ai-generated/active');
    } catch (error: any) {
      setErrorMSG(error.message || 'Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="heading-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={32} color="var(--accent-primary)" /> AI ComboCoach
          </h1>
          <p>Create a custom workout on the fly.</p>
        </div>
        <button 
          onClick={() => navigate('/workouts')}
          className="header-action"
        >
          <X size={22} />
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '20px' }}>
        
        {/* Difficulty */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Difficulty</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Beginner', 'Intermediate', 'Advanced'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d as any)}
                className="spring-press"
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: '12px',
                  border: `1px solid ${difficulty === d ? 'var(--accent-primary)' : 'var(--border)'}`,
                  background: difficulty === d ? 'rgba(88, 204, 2, 0.1)' : 'transparent',
                  color: difficulty === d ? 'var(--accent-primary)' : 'var(--text-main)',
                  fontWeight: difficulty === d ? 700 : 500
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Main Focus</label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['Speed', 'Power', 'Defense', 'Conditioning', 'Footwork', 'Technique'].map(f => (
              <button
                key={f}
                onClick={() => setFocus(f as any)}
                className="spring-press"
                style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${focus === f ? '#fff' : 'var(--border)'}`,
                  background: focus === f ? '#fff' : 'transparent',
                  color: focus === f ? '#000' : 'var(--text-main)',
                  fontWeight: 600
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Rounds */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rounds</label>
            <span style={{ fontWeight: 800 }}>{rounds}</span>
          </div>
          <input 
            type="range" 
            min="1" max="15" 
            value={rounds} 
            onChange={(e) => setRounds(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        {/* Duration / Length */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Round Length</label>
            <select 
              value={roundLength}
              onChange={(e) => setRoundLength(Number(e.target.value))}
              className="ai-select"
            >
              <option value="60">1 Min</option>
              <option value="120">2 Min</option>
              <option value="180">3 Min</option>
              <option value="300">5 Min</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rest Period</label>
            <select 
              value={restPeriod}
              onChange={(e) => setRestPeriod(Number(e.target.value))}
              className="ai-select"
            >
              <option value="15">15 Sec</option>
              <option value="30">30 Sec</option>
              <option value="45">45 Sec</option>
              <option value="60">1 Min</option>
              <option value="90">1.5 Min</option>
            </select>
          </div>
        </div>

        {/* Pace Options */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Combo Pace</label>
           <select 
            value={pace}
            onChange={(e) => setPace(Number(e.target.value))}
            className="ai-select"
          >
            <option value="15">Fast (15s)</option>
            <option value="20">Brisk (20s)</option>
            <option value="30">Medium (30s)</option>
            <option value="45">Steady (45s)</option>
            <option value="60">Slow (60s)</option>
          </select>
        </div>

        {/* Warmup Options */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Include Warmup</label>
          <div style={{ display: 'flex', gap: '8px' }}>
             {['None', 'Boxing', 'Mix'].map(w => (
              <button
                key={w}
                onClick={() => setWarmup(w as any)}
                className="spring-press"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '12px',
                  border: `1px solid ${warmup === w ? '#fff' : 'var(--border)'}`,
                  background: warmup === w ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: warmup === w ? '#fff' : 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMSG && (
        <div style={{ padding: '16px', background: 'rgba(255, 50, 50, 0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: '12px', color: '#ff6b6b', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Info size={18} /> {errorMSG}
        </div>
      )}

      {!isPro ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <Paywall 
            title="AI ComboCoach" 
            description="Unlock the ability to generate infinite, customized boxing workouts tailored to your goals using Gemini AI."
            feature="Pro Feature: AI ComboCoach"
          />
        </div>
      ) : (
        <button 
          className={`btn-primary spring-press ${isGenerating ? 'animate-pulse' : ''}`}
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontSize: '1.1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            background: isGenerating ? 'var(--bg-card)' : 'var(--gradient-primary)',
            borderColor: isGenerating ? 'var(--accent-primary)' : 'transparent',
            borderWidth: isGenerating ? '1px' : '0',
            borderStyle: 'solid'
          }}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <><Loader2 size={24} className="animate-spin" color="var(--accent-primary)" /> Sequencing Rounds...</>
          ) : (
            <><Settings2 size={24} /> Generate & Start</>
          )}
        </button>
      )}

    </div>
  );
}
