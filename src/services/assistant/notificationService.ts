import { triggerHaptic } from '@/services/haptics'
import { playSuccessChime } from '@/services/audioFeedback'

export class NotificationService {
  private static instance: NotificationService
  private hasPermission = false

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    try {
      if (Notification.permission === 'granted') {
        this.hasPermission = true
        return true
      }
      if (Notification.permission !== 'denied') {
        const status = await Notification.requestPermission()
        this.hasPermission = status === 'granted'
        return this.hasPermission
      }
    } catch (err) {
      console.warn('Notification permission request error:', err)
    }
    return false
  }

  public sendNotification(title: string, options?: NotificationOptions): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          silent: false,
          ...options,
        })
        void triggerHaptic('medium')
        playSuccessChime()
      } catch (err) {
        console.warn('Failed to dispatch notification:', err)
      }
    }
  }

  public triggerPushToWorkReminder(taskTitle: string, method: string): void {
    const bodies: Record<string, string> = {
      five_minute: `Bypass friction: Start "${taskTitle}" for just 5 minutes now.`,
      solo_leveling: `Daily Quest: Complete "${taskTitle}" to earn +30 XP and STR stats!`,
      friction_collapse: `Step 1 Only: Just open the tool and write the first word of "${taskTitle}".`,
      circadian_pulse: `Optimal Biological Window: Peak dopamine focus is active. Execute "${taskTitle}".`,
    }

    const body = bodies[method] || `Time to lock in: "${taskTitle}" awaits your focus.`
    this.sendNotification(`Mindset Machine: Focus Call`, {
      body,
      tag: 'push-to-work',
    })
  }

  public scheduleFocusReminder(timeBlockTitle: string, minutesAhead = 5): void {
    this.sendNotification(`Upcoming Focus Horizon (${minutesAhead}m)`, {
      body: `Prepare environment for "${timeBlockTitle}". Hydrate and eliminate distractions.`,
      tag: 'routine-reminder',
    })
  }
}

export const notificationService = NotificationService.getInstance()
