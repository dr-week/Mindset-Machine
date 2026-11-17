import type { Task, Goal } from '@/types/mindset'
import { tryOllamaRequest } from './ai/ollamaClient'
import { getOfflineTaskSuggestions, getOfflineMotivation } from './ai/heuristics'

export async function fetchFutureTasks(tasks: Task[], goals: Goal[]): Promise<string[]> {
  const systemPrompt =
    'You are a productivity expert. Analyze these current tasks and goals, then predict the next 3 logical, hyper-specific actionable steps. Return ONLY a raw JSON array of strings like ["task1", "task2", "task3"] with no conversational text and no markdown backticks.'
  const userMessage = `Current tasks: ${JSON.stringify(tasks)}\n\nCurrent goals: ${JSON.stringify(goals)}`

  try {
    const ollamaContent = await tryOllamaRequest(`${systemPrompt}\n\n${userMessage}`)
    if (ollamaContent) {
      try {
        const parsed = JSON.parse(ollamaContent)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String)
      } catch {
        // Fall through
      }
    }

    const openaiKey = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) || ''
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''
        const parsed = JSON.parse(content.trim())
        if (Array.isArray(parsed)) return parsed.map(String)
      }
    }

    return getOfflineTaskSuggestions(goals)
  } catch (error) {
    console.error('Error fetching future tasks:', error)
    return getOfflineTaskSuggestions(goals)
  }
}

export async function fetchAiMotivation(stagnantTasks: Task[]): Promise<string> {
  const systemPrompt =
    'You are a direct, witty, and highly grounding AI coach. Look at these tasks that the user has not completed yet. Generate a sharp, realistic, single-line motivational prompt (maximum 15 words) tailored to push them to start. Avoid generic clichés or cheesy quotes. Return only the raw text response.'
  const userMessage = `Stagnant tasks: ${JSON.stringify(stagnantTasks)}`

  try {
    const ollamaContent = await tryOllamaRequest(`${systemPrompt}\n\n${userMessage}`)
    if (ollamaContent) return ollamaContent

    const openaiKey = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) || ''
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = (data.choices?.[0]?.message?.content || '').trim()
        if (content) return content
      }
    }

    return getOfflineMotivation(stagnantTasks)
  } catch (error) {
    console.error('Error fetching AI motivation:', error)
    return 'Action cures overthinking. Focus on the next single step.'
  }
}
