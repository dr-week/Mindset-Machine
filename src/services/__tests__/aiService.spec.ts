import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchFutureTasks, fetchAiMotivation } from '@/services/aiService'
import type { Task, Goal } from '@/types/mindset'

describe('aiService Compatibility & Offline Fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const dummyGoals: Goal[] = [
    {
      id: 'g-1',
      text: 'Build High-Performance Mobile App',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]

  const dummyTasks: Task[] = [
    {
      id: 't-1',
      title: 'Setup Android Build Scripts',
      completed: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
  ]

  it('generates future tasks using fallback heuristics when offline or service unavailable', async () => {
    // Simulate offline/fetch rejection
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'))

    const results = await fetchFutureTasks(dummyTasks, dummyGoals)
    expect(results).toBeDefined()
    expect(results.length).toBeGreaterThanOrEqual(3)
    expect(results[0]).toContain('Build High-Performance Mobile App')
  })

  it('generates motivational directives even when external AI API is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Connection refused'))

    const motivation = await fetchAiMotivation(dummyTasks)
    expect(typeof motivation).toBe('string')
    expect(motivation.length).toBeGreaterThan(5)
  })

  it('parses valid AI JSON responses when Ollama or OpenAI responds successfully', async () => {
    const mockSuggestions = ['Phase 1 deployment', 'Phase 2 integration', 'Phase 3 testing']
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify(mockSuggestions),
      }),
    } as Response)

    const results = await fetchFutureTasks(dummyTasks, dummyGoals)
    expect(results).toEqual(mockSuggestions)
  })
})
