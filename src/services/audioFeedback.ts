// Synthesized Micro-Acoustics for Tactile Feedback (Zero External Assets)
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

let soundEnabled = true

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

/**
 * Plays a subtle, tactile mechanical micro-click (5-10ms)
 */
export function playCheckSound(): void {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04) // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  } catch {
    // Fail silently if browser audio policy blocks
  }
}

/**
 * Plays a warm ember harmonic chime on goal completion / major milestone
 */
export function playSuccessChime(): void {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 triad

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.04)

      gain.gain.setValueAtTime(0.06, now + idx * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.04)
      osc.stop(now + idx * 0.04 + 0.25)
    })
  } catch {
    // Graceful fallback
  }
}
