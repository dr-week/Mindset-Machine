import type { Task, Goal } from '@/types/mindset'

/**
 * Android and Mobile Network Compatibility:
 * Android emulator and physical devices cannot reach desktop Ollama via localhost (127.0.0.1).
 * In Android emulators, the host machine is mapped to 10.0.2.2.
 */
function getOllamaEndpoints(): string[] {
  const customHost = (import.meta.env.VITE_OLLAMA_HOST as string | undefined) || ''
  const endpoints = []
  if (customHost) {
    endpoints.push(customHost)
  }
  // Standard desktop localhost
  endpoints.push('http://localhost:11434/api/generate')
  // Android Emulator loopback host
  endpoints.push('http://10.0.2.2:11434/api/generate')
  // Common local network bridge fallback
  endpoints.push('http://127.0.0.1:11434/api/generate')
  return endpoints
}

async function tryOllamaRequest(prompt: string): Promise<string | null> {
  const endpoints = getOllamaEndpoints()

  for (const url of endpoints) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const content = (data.response || '').trim()
        if (content) return content
      }
    } catch {
      // Continue to next endpoint or fallback
    }
  }
  return null
}

export async function fetchFutureTasks(tasks: Task[], goals: Goal[]): Promise<string[]> {
  const systemPrompt =
    'You are a productivity expert. Analyze these current tasks and goals, then predict the next 3 logical, hyper-specific actionable steps. Return ONLY a raw JSON array of strings like ["task1", "task2", "task3"] with no conversational text and no markdown backticks.'
  const userMessage = `Current tasks: ${JSON.stringify(tasks)}\n\nCurrent goals: ${JSON.stringify(goals)}`

  try {
    // 1. Try Ollama (Local desktop, Android emulator bridge 10.0.2.2, or custom host)
    const ollamaContent = await tryOllamaRequest(`${systemPrompt}\n\n${userMessage}`)
    if (ollamaContent) {
      try {
        const parsed = JSON.parse(ollamaContent)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String)
      } catch {
        // Fall through to other providers
      }
    }

    // 2. Try OpenAI API if VITE_OPENAI_API_KEY is configured
    const openaiKey = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) || ''
    if (openaiKey) {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      })

      if (openaiResponse.ok) {
        const data = await openaiResponse.json()
        const content = data.choices?.[0]?.message?.content || ''
        const parsed = JSON.parse(content.trim())
        if (Array.isArray(parsed)) return parsed.map(String)
      }
    }

    // 3. Robust Built-in Mobile & Offline Heuristic Engine
    const primaryGoal = goals.find((g) => !g.completed)?.text || 'Core Vision'
    return [
      `Execute 45-minute sprint on priority goal: "${primaryGoal}"`,
      'Review pending tasks and remove 1 non-essential friction item',
      'Synthesize milestone progress and schedule next focus session',
    ]
  } catch (error) {
    console.error('Error fetching future tasks:', error)
    return [
      'Break top goal into 2 actionable sub-tasks',
      'Complete remaining priority task without distractions',
      'Plan retrospective for current sprint accomplishments',
    ]
  }
}

export async function fetchAiMotivation(stagnantTasks: Task[]): Promise<string> {
  const systemPrompt =
    'You are a direct, witty, and highly grounding AI coach. Look at these tasks that the user has not completed yet. Generate a sharp, realistic, single-line motivational prompt (maximum 15 words) tailored to push them to start. Avoid generic clichés or cheesy quotes. Return only the raw text response.'
  const userMessage = `Stagnant tasks: ${JSON.stringify(stagnantTasks)}`

  try {
    // 1. Try Ollama (Local, Android Emulator 10.0.2.2, or Custom)
    const ollamaContent = await tryOllamaRequest(`${systemPrompt}\n\n${userMessage}`)
    if (ollamaContent) {
      return ollamaContent
    }

    // 2. Try OpenAI API
    const openaiKey = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) || ''
    if (openaiKey) {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      })

      if (openaiResponse.ok) {
        const data = await openaiResponse.json()
        const content = (data.choices?.[0]?.message?.content || '').trim()
        if (content) return content
      }
    }

    // 3. Offline Heuristic AI Engine
    const highPrioCount = stagnantTasks.filter((t) => t.priority === 'high').length
    if (highPrioCount > 0) {
      return `You have ${highPrioCount} critical mission tasks waiting. Eliminate the hardest one first.`
    }

    const quotes = [
      'Cut the noise. One focused hour beats eight hours of hesitation.',
      'Momentum is built by starting small, not by waiting for inspiration.',
      'Execute the highest priority item first—everything else is a distraction.',
      'Small completed reps compound into extraordinary breakthroughs.',
      'Clarity follows action. Start the task before you feel ready.',
    ]
    return quotes[Math.floor(Math.random() * quotes.length)] ?? 'Action cures fear. Start now.'
  } catch (error) {
    console.error('Error fetching AI motivation:', error)
    return 'Action cures overthinking. Focus on the next single step.'
  }
}
