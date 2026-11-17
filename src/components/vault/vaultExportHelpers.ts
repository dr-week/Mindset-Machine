export function downloadJsonBackup(data: object, filenamePrefix = 'mindset-backup'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadMarkdownVault(
  goals: any[],
  tasks: any[],
  timetable: any[],
  reviews: any[]
): void {
  let md = `# MINDSET — Productivity Vault Export\n*Exported on ${new Date().toLocaleString()}*\n\n`
  md += `## 🎯 Vision Directives (${goals.length})\n`
  goals.forEach((g) => {
    md += `- [${g.completed ? 'x' : ' '}] ${g.text}\n`
  })
  md += `\n## ⚡ Tasks Matrix (${tasks.length})\n`
  tasks.forEach((t) => {
    md += `- [${t.completed ? 'x' : ' '}] **[${t.priority.toUpperCase()}]** ${t.title} *(Energy: ${t.energy || 'normal'})*\n`
  })
  if (timetable.length > 0) {
    md += `\n## ⏱️ Circadian Timetable (${timetable.length})\n`
    timetable.forEach((b) => {
      md += `- [${b.completed ? 'x' : ' '}] ${b.startTime} - ${b.endTime} **[${b.category.toUpperCase()}]** ${b.title}\n`
    })
  }
  if (reviews.length > 0) {
    md += `\n## 🌙 Evening Audits & Wins (${reviews.length})\n`
    reviews.forEach((r) => {
      md += `### ${r.date} (Velocity: ${r.velocityRate}%)\n`
      md += `- **Win:** ${r.winNote}\n`
      md += `- **Next Priority:** ${r.tomorrowPriority}\n\n`
    })
  }

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mindset-vault-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
