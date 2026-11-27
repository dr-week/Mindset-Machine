/**
 * Adapter for Google Gemini 2.5 Flash API
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'
import { getGeminiApiKey } from '@/services/ai/geminiClient'

export class GeminiAdapter implements ApiConnectionAdapter {
  readonly id = 'gemini_ai'
  readonly name = 'Google Gemini 2.5 Flash'
  readonly category = 'ai' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const key = getGeminiApiKey()

    if (!key) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'unconfigured',
        lastChecked: new Date().toISOString(),
        message: 'No API Key configured. Add your key in the Cloud drawer.',
      }
    }

    const start = performance.now()
    try {
      // Lightweight models query to verify key validity
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      const res = await fetch(url)
      const latencyMs = Math.round(performance.now() - start)

      if (!res.ok) {
        return {
          id: this.id,
          name: this.name,
          category: this.category,
          status: 'error',
          latencyMs,
          lastChecked: new Date().toISOString(),
          message: `Gemini API rejected key with HTTP ${res.status}`,
        }
      }

      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'connected',
        latencyMs,
        lastChecked: new Date().toISOString(),
        message: 'Gemini 2.5 Flash operational for goal decomposition',
      }
    } catch (err: unknown) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'error',
        lastChecked: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Network failure reaching Gemini API',
      }
    }
  }
}
