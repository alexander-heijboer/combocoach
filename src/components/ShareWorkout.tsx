import React, { useRef, useState } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { toPng } from 'html-to-image';
import { Share2, Zap, Clock, Loader2, Shield } from 'lucide-react';
import appLogo from '../assets/app_logo.png';
import { useAppStore } from './../store/useAppStore';
import { getUserRank } from './../utils/workoutUtils';

interface ActivityItem {
  id: string;
  type: 'workout' | 'manual' | 'timer';
  title: string;
  subtitle?: string;
  punches: number;
  timestamp: string;
  duration?: number;
}

interface ShareWorkoutProps {
  activity: ActivityItem;
  variant?: 'button' | 'icon';
}

export const ShareWorkout: React.FC<ShareWorkoutProps> = ({ activity, variant = 'button' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const punchesThrownEst = useAppStore(state => state.punchesThrownEst);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (cardRef.current === null) return null;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#09090b',
        width: 1080,
        height: 1080,
        style: {
          transform: 'scale(1)',
          position: 'static',
          display: 'flex',
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate image', err);
      return null;
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateImage();
      const shareText = `Just finished a ${activity.title} on ComboCoach! 🥊 ${activity.punches} punches thrown. #Boxing #Fitness #ComboCoach`;

      if (!dataUrl) {
        await Share.share({
          title: 'My Boxing Workout',
          text: shareText,
        });
        return;
      }

      if (Capacitor.isNativePlatform()) {
        // Save to filesystem to share on native
        const fileName = `workout-share-${Date.now()}.png`;
        const base64Data = dataUrl.split(',')[1];
        
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });

        await Share.share({
          title: 'My Boxing Workout',
          text: shareText,
          files: [savedFile.uri],
          dialogTitle: 'Share your progress',
        });
      } else {
        // Fallback for web: download or simple share
        if (navigator.share) {
          // Some browsers support sharing blobs
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'workout.png', { type: 'image/png' });
          
          try {
            await navigator.share({
              title: 'My Boxing Workout',
              text: shareText,
              files: [file],
            });
          } catch(e) {
            // Fallback if files aren't supported in navigator.share
            await navigator.share({
              title: 'My Boxing Workout',
              text: shareText,
            });
          }
        } else {
          // Final fallback: Download
          const link = document.createElement('a');
          link.download = `combocoach-workout-${activity.id}.png`;
          link.href = dataUrl;
          link.click();
        }
      }
    } catch (err) {
      console.error('Share failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      {/* Hidden Share Card Template (Rendered off-screen for capture) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div 
          ref={cardRef}
          style={{
            width: '1080px',
            height: '1080px',
            background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #09090b 100%)',
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white',
            fontFamily: "'Antonio', 'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
            zIndex: 0
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            zIndex: 0
          }} />

          {/* Header */}
          <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img 
                src={appLogo} 
                alt="ComboCoach" 
                style={{ 
                  height: '80px', 
                  filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))'
                }} 
              />
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                padding: '8px 16px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Shield size={20} color="#ef4444" />
                <span style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase' }}>
                  {getUserRank(punchesThrownEst).title}
                </span>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', color: '#a1a1aa', letterSpacing: '2px', fontWeight: 600 }}>
                {formatDate(activity.timestamp)}
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div style={{ zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px 32px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '100px',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              fontSize: '20px',
              color: '#ef4444',
              letterSpacing: '2px',
              marginBottom: '32px'
            }}>
              <Zap size={24} color="#ef4444" />
              SESSION COMPLETE
            </div>
            
            <h1 style={{ 
              fontSize: '110px', 
              margin: '0', 
              lineHeight: 1, 
              fontWeight: 900,
              letterSpacing: '-2px',
              textShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
              {activity.title}
            </h1>
          </div>

          {/* Footer Stats Grid */}
          <div style={{ 
            zIndex: 1, 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px',
            background: 'rgba(255,255,255,0.03)',
            padding: '60px',
            borderRadius: '40px',
            border: '2px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '130px', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
                {activity.punches}
              </div>
              <div style={{ fontSize: '28px', color: '#a1a1aa', fontWeight: 700, letterSpacing: '4px', marginTop: '10px' }}>
                EST. PUNCHES
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <Clock size={48} color="#a1a1aa" />
                <div style={{ fontSize: '60px', fontWeight: 800 }}>
                  {activity.duration ? Math.floor(activity.duration / 60) : '--'}
                </div>
              </div>
              <div style={{ fontSize: '28px', color: '#a1a1aa', fontWeight: 700, letterSpacing: '4px' }}>
                MINUTES WORK
              </div>
            </div>
          </div>

          <div style={{ 
            zIndex: 1, 
            textAlign: 'center', 
            color: '#a1a1aa', 
            fontSize: '24px', 
            letterSpacing: '12px',
            fontWeight: 800,
            marginTop: '40px'
          }}>
            COMBOCOACH.APP
          </div>
        </div>
      </div>

      {/* Actual Button Component */}
      {variant === 'button' ? (
        <button 
          onClick={handleShare}
          disabled={isGenerating}
          className="btn-primary spring-press"
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-bright)', 
            color: '#fff',
            boxShadow: 'none',
            opacity: isGenerating ? 0.7 : 1
          }}
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
          {isGenerating ? 'GENERATING...' : 'SHARE PROGRESS'}
        </button>
      ) : (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          disabled={isGenerating}
          className="header-action spring-press"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--accent-primary)',
            padding: '8px',
            opacity: isGenerating ? 0.5 : 1
          }}
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
        </button>
      )}
    </>
  );
};
