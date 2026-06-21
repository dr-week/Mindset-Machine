export async function fetchFutureTasks(tasks, goals) {
  const systemPrompt =
    'You are a productivity expert. Analyze these current tasks and goals, then predict the next 3 logical, hyper-specific actionable steps. Return ONLY a raw JSON array of strings like ["task1", "task2", "task3"] with no conversational text and no markdown backticks.'
  const userMessage = `Current tasks: ${JSON.stringify(tasks)}\n\nCurrent goals: ${JSON.stringify(goals)}`

  try {
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${systemPrompt}\n\n${userMessage}`,
          stream: false,
        }),
      })

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json()
        const content = data.response || ''
        const parsed = JSON.parse(content.trim())
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (ollamaError) {
      console.warn('Ollama endpoint failed, trying OpenAI fallback', ollamaError)
    }

    const openaiKey = process.env.VITE_OPENAI_API_KEY
    if (!openaiKey) throw new Error('OpenAI API key not configured')

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)

    const data = await openaiResponse.json()
    const content = data.choices?.[0]?.message?.content || ''
    const parsed = JSON.parse(content.trim())
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Error fetching future tasks:', error)
    return []
  }
}

export async function fetchAiMotivation(stagnantTasks) {
  const systemPrompt =
    'You are a direct, witty, and highly grounding AI coach. Look at these tasks that the user has not completed yet. Generate a sharp, realistic, single-line motivational prompt (maximum 15 words) tailored to push them to start. Avoid generic clichés or cheesy quotes. Return only the raw text response.'
  const userMessage = `Stagnant tasks: ${JSON.stringify(stagnantTasks)}`

  try {
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${systemPrompt}\n\n${userMessage}`,
          stream: false,
        }),
      })

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json()
        const content = data.response || ''
        return content.trim()
      }
    } catch (ollamaError) {
      console.warn('Ollama endpoint failed, trying OpenAI fallback', ollamaError)
    }

    const openaiKey = process.env.VITE_OPENAI_API_KEY
    if (!openaiKey) throw new Error('OpenAI API key not configured')

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)

    const data = await openaiResponse.json()
    const content = data.choices?.[0]?.message?.content || ''
    return content.trim()
  } catch (error) {
    console.error('Error fetching AI motivation:', error)
    return ''
  }
}
