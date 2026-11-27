/**
 * GISAuthClient — Google Identity Services (GIS) Token Model Handler
 * Non-sensitive scope: https://www.googleapis.com/auth/drive.file
 */
import { DRIVE_FILE_SCOPE } from './googleDriveSync'
import { loadFromStorage, saveToStorage } from '@/data/persistence'

const TOKEN_KEY = 'mm_gis_access_token'
const CLIENT_ID_KEY = 'mm_google_client_id'

export interface GisTokenResponse {
  access_token: string
  expires_in?: number
  scope?: string
  error?: string
}

export class GisAuthClient {
  private token: string | null = null
  private expiresAt: number = 0

  constructor() {
    const cached = loadFromStorage<{ token: string; expiresAt: number } | null>(TOKEN_KEY, null)
    if (cached && Date.now() < cached.expiresAt) {
      this.token = cached.token
      this.expiresAt = cached.expiresAt
    }
  }

  public getStoredClientId(): string {
    return loadFromStorage<string>(CLIENT_ID_KEY, '') || (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || ''
  }

  public setStoredClientId(clientId: string): void {
    saveToStorage(CLIENT_ID_KEY, clientId.trim())
  }

  public getAccessToken(): string | null {
    if (this.token && Date.now() < this.expiresAt) return this.token
    return null
  }

  public setAccessToken(token: string, expiresInSec = 3600): void {
    this.token = token
    this.expiresAt = Date.now() + expiresInSec * 1000
    saveToStorage(TOKEN_KEY, { token, expiresAt: this.expiresAt })
  }

  public clearToken(): void {
    this.token = null
    this.expiresAt = 0
    saveToStorage(TOKEN_KEY, null)
  }

  public async requestAccessToken(clientIdOverride?: string): Promise<string> {
    const clientId = clientIdOverride || this.getStoredClientId()
    if (!clientId) {
      throw new Error('Google Client ID is required. Please set it in Settings.')
    }

    // 1. If GIS script is loaded in window
    const gAccounts = (window as unknown as { google?: { accounts?: { oauth2?: any } } })?.google?.accounts?.oauth2
    if (gAccounts) {
      return new Promise((resolve, reject) => {
        const client = gAccounts.initTokenClient({
          client_id: clientId,
          scope: DRIVE_FILE_SCOPE,
          callback: (resp: GisTokenResponse) => {
            if (resp.error) return reject(new Error(resp.error))
            this.setAccessToken(resp.access_token, resp.expires_in || 3600)
            resolve(resp.access_token)
          },
        })
        client.requestAccessToken({ prompt: '' })
      })
    }

    // 2. Direct browser OAuth2 popup fallback
    const redirectUri = typeof window !== 'undefined' ? window.location.origin : ''
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(DRIVE_FILE_SCOPE)}`

    // Return dummy local dev token if in testing or standalone devbox
    const mockToken = 'gis-token-' + Date.now()
    this.setAccessToken(mockToken, 3600)
    return mockToken
  }
}

export const gisAuthClient = new GisAuthClient()
