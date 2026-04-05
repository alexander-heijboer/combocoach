import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { capacitorStorage } from '../utils/storage';

type Phase = 'Idle' | 'Prepare' | 'Work' | 'Rest' | 'Finished';

interface TimerStore {
  roundTime: number;
  restTime: number;
  rounds: number;
  currentRound: number;
  timeLeft: number;
  phase: Phase;
  isRunning: boolean;
  
  // Actions
  setRoundTime: (t: number) => void;
  setRestTime: (t: number) => void;
  setRounds: (r: number) => void;
  
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  handlePhaseEnd: () => void;
  setTimerData: (rd: number, rs: number, r: number) => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      roundTime: 180,
      restTime: 60,
      rounds: 3,
      currentRound: 1,
      timeLeft: 180,
      phase: 'Idle',
      isRunning: false,

      setRoundTime: (t) => set({ roundTime: t, timeLeft: get().phase === 'Idle' ? t : get().timeLeft }),
      setRestTime: (t) => set({ restTime: t }),
      setRounds: (r) => set({ rounds: r }),

      setTimerData: (rd, rs, r) => set({ roundTime: rd, restTime: rs, rounds: r, timeLeft: rd }),

      startTimer: () => {
        const { phase } = get();
        if (phase === 'Idle') {
          set({ phase: 'Prepare', timeLeft: 20, currentRound: 1, isRunning: true });
        } else {
          set({ isRunning: true });
        }
      },

      pauseTimer: () => set({ isRunning: false }),

      stopTimer: () => set({ 
        isRunning: false, 
        phase: 'Idle', 
        timeLeft: get().roundTime, 
        currentRound: 1 
      }),

      tick: () => {
        const { isRunning, timeLeft } = get();
        if (isRunning && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (isRunning && timeLeft === 0) {
          get().handlePhaseEnd();
        }
      },

      handlePhaseEnd: () => {
        const { phase, currentRound, rounds, roundTime, restTime } = get();
        if (phase === 'Work') {
          if (currentRound < rounds) {
            set({ phase: 'Rest', timeLeft: restTime });
          } else {
            set({ phase: 'Finished', isRunning: false });
          }
        } else if (phase === 'Rest' || phase === 'Prepare') {
          if (phase === 'Rest') set({ currentRound: currentRound + 1 });
          set({ phase: 'Work', timeLeft: roundTime });
        }
      }
    }),
    {
      name: 'boxing-timer-storage',
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state) => ({ 
        roundTime: state.roundTime, 
        restTime: state.restTime, 
        rounds: state.rounds 
      }),
    }
  )
);


