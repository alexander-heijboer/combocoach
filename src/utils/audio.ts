import { useAppStore } from '../store/useAppStore';

export const playBell = () => {
  if (!useAppStore.getState().soundEnabled) return;
  const audio = new Audio('/sounds/bell.mp3');
  audio.play().catch(e => console.error('Error playing bell:', e));
};

export const playTenSecWarning = () => {
  if (!useAppStore.getState().soundEnabled) return;
  const audio = new Audio('/sounds/warning.mp3');
  audio.play().catch(e => console.error('Error playing 10s warning:', e));
};

export const playRoundEndBell = () => {
  // User requested the same sound as the start
  playBell();
};
const playBeep = (frequency: number, duration: number, volume: number) => {
  if (!useAppStore.getState().soundEnabled) return;
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  } catch (e) {
    console.error('Error playing synthesized beep:', e);
  }
};

export const playTick = () => playBeep(880, 0.1, 0.05);

export const playCountdownTap = (isLast: boolean) => {
  if (isLast) {
    playBeep(1200, 0.3, 0.15);
  } else {
    playBeep(800, 0.1, 0.1);
  }
};
