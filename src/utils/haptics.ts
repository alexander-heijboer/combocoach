import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useAppStore } from '../store/useAppStore';

export const hapticLight = async () => {
  if (!useAppStore.getState().hapticsEnabled) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    // Ignore, might be on web
  }
};

export const hapticHeavy = async () => {
  if (!useAppStore.getState().hapticsEnabled) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {
    // Ignore
  }
};

export const hapticVibrate = async () => {
  if (!useAppStore.getState().hapticsEnabled) return;
  try {
    await Haptics.vibrate({ duration: 500 });
  } catch (e) {
    // Ignore
  }
};
