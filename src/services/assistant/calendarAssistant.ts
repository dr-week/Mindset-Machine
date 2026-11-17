import type { TimeBlock } from '@/types/mindset'

export class CalendarAssistantService {
  public generateIcsFeed(blocks: TimeBlock[]): string {
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10).replace(/-/g, '')

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mindset Machine//Circadian Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ]

    blocks.forEach((b) => {
      const startClean = b.startTime.replace(':', '') + '00'
      const endClean = b.endTime.replace(':', '') + '00'
      const dtStart = `${todayStr}T${startClean}`
      const dtEnd = `${todayStr}T${endClean}`

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:mindset-block-${b.id}-${todayStr}`,
        `DTSTAMP:${todayStr}T000000Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:[Mindset] ${b.title}`,
        `DESCRIPTION:Category: ${b.category.toUpperCase()}\\nNotes: ${b.notes || 'Circadian Focus Block'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      )
    })

    icsContent.push('END:VCALENDAR')
    return icsContent.join('\r\n')
  }

  public downloadIcsFile(blocks: TimeBlock[], filename = 'mindset-schedule.ics'): void {
    const content = this.generateIcsFeed(blocks)
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const calendarAssistantService = new CalendarAssistantService()
