/**
 * GoogleAuthService — Unified Google Account OAuth2 Integration
 * Manages scopes for Google Drive appDataFolder (minimal task DB sync)
 * and Google Fit REST API (steps, sleep, resting heart rate).
 */
import type { GoogleUserProfile } from '@/types/mindset'
import { loadFromStorage, saveToStorage } from '@/data/persistence'

const AUTH_STORAGE_KEY = 'google_user_profile'

export const GOOGLE_OAUTH_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
]

export class GoogleAuthService {
  private currentUser: GoogleUserProfile | null = null

  constructor() {
    this.currentUser = loadFromStorage<GoogleUserProfile | null>(AUTH_STORAGE_KEY, null)
  }

  public getUser(): GoogleUserProfile | null {
    return this.currentUser
  }

  public isAuthenticated(): boolean {
    if (!this.currentUser?.accessToken) return false
    if (this.currentUser.expiresAt && Date.now() > this.currentUser.expiresAt) {
      return false
    }
    return true
  }

  public getAuthorizeUrl(clientId: string, redirectUri: string): string {
    const scopeStr = GOOGLE_OAUTH_SCOPES.join(' ')
    return (
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&include_granted_scopes=true` +
      `&scope=${encodeURIComponent(scopeStr)}`
    )
  }

  public async connectWithToken(accessToken: string, fallbackEmail = 'hunter@mindset.local'): Promise<GoogleUserProfile> {
    let profile: GoogleUserProfile = {
      email: fallbackEmail,
      name: 'Mindset Operator',
      accessToken,
      expiresAt: Date.now() + 3600 * 1000,
    }

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        profile = {
          email: data.email || fallbackEmail,
          name: data.name || 'Mindset Operator',
          picture: data.picture,
          accessToken,
          expiresAt: Date.now() + 3600 * 1000,
        }
      }
    } catch {
      // Offline or local test token fallback
    }

    this.currentUser = profile
    saveToStorage(AUTH_STORAGE_KEY, profile)
    return profile
  }

  public signOut(): void {
    this.currentUser = null
    saveToStorage(AUTH_STORAGE_KEY, null)
  }
}

export const googleAuthService = new GoogleAuthService()
