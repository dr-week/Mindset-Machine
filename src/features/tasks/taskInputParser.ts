export interface ParsedTaskInput {
  title: string
  priority: 'low' | 'medium' | 'high'
  energy: 'deep' | 'flow' | 'quick'
}

export function parseTaskInput(
  rawText: string,
  defaultPriority: 'low' | 'medium' | 'high' = 'high',
  defaultEnergy: 'deep' | 'flow' | 'quick' = 'deep'
): ParsedTaskInput {
  let text = rawText.trim()
  let priority = defaultPriority
  let energy = defaultEnergy

  if (/\s*!high\b/i.test(text)) {
    priority = 'high'
    text = text.replace(/\s*!high\b/i, '').trim()
  } else if (/\s*!low\b/i.test(text)) {
    priority = 'low'
    text = text.replace(/\s*!low\b/i, '').trim()
  }

  if (/\s*!deep\b/i.test(text)) {
    energy = 'deep'
    text = text.replace(/\s*!deep\b/i, '').trim()
  } else if (/\s*!flow\b/i.test(text)) {
    energy = 'flow'
    text = text.replace(/\s*!flow\b/i, '').trim()
  } else if (/\s*!quick\b/i.test(text)) {
    energy = 'quick'
    text = text.replace(/\s*!quick\b/i, '').trim()
  }

  return {
    title: text || rawText.trim(),
    priority,
    energy,
  }
}
