function getOllamaEndpoints(): string[] {
  const customHost = (import.meta.env.VITE_OLLAMA_HOST as string | undefined) || ''
  const endpoints = []
  if (customHost) {
    endpoints.push(customHost)
  }
  endpoints.push('http://localhost:11434/api/generate')
  endpoints.push('http://10.0.2.2:11434/api/generate')
  endpoints.push('http://127.0.0.1:11434/api/generate')
  return endpoints
}

export async function tryOllamaRequest(prompt: string): Promise<string | null> {
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
