import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  try {
    const impactMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }
    await Haptics.impact({ style: impactMap[style] })
  } catch {
    // Graceful fallback for standard desktop web environments without vibration hardware
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(style === 'heavy' ? 30 : style === 'medium' ? 20 : 10)
    }
  }
}
