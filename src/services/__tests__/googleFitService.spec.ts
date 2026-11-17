import { describe, it, expect, vi, beforeEach } from 'vitest'
import { googleFitService } from '@/services/googleFit/googleFitService'

describe('GoogleFitService Unit Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('constructs valid OAuth2 Google Fit authorization URL with appropriate scopes', () => {
    const clientId = 'test-client-id.apps.googleusercontent.com'
    const redirectUri = 'https://localhost/callback'

    const authUrl = googleFitService.getGoogleFitAuthorizeUrl(clientId, redirectUri)
    expect(authUrl).toContain('accounts.google.com/o/oauth2/v2/auth')
    expect(authUrl).toContain(encodeURIComponent(clientId))
    expect(authUrl).toContain('fitness.activity.read')
    expect(authUrl).toContain('fitness.heart_rate.read')
    expect(authUrl).toContain('fitness.sleep.read')
  })

  it('fetches daily activity metrics with fallback resilience', async () => {
    const metrics = await googleFitService.fetchDailyActivityMetrics()
    expect(metrics).toBeDefined()
    expect(metrics.steps).toBeGreaterThan(0)
    expect(metrics.recoveryScore).toBeGreaterThanOrEqual(0)
    expect(metrics.recoveryScore).toBeLessThanOrEqual(100)
    expect(metrics.restingHeartRate).toBeGreaterThan(40)
  })
})
