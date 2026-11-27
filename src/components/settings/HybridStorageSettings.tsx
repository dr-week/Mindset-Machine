/**
 * HybridStorageSettings.tsx — Clean React/TypeScript Settings UI Component
 * Implements Google Drive connect/disconnect (drive.file scope), local folder selection,
 * 3-mode storage switching, and Last-Write-Wins (LWW) sync triggers.
 */
import React, { useState, useEffect } from 'react'
import { storageManager } from '@/services/storage/storageManager'
import { gisAuthClient } from '@/services/google/gisAuthClient'
import { localFolderService } from '@/services/storage/localFolderService'
import type { StorageMode } from '@/types/storage'

export interface HybridStorageSettingsProps {
  onSyncComplete?: (result: any) => void
  className?: string
}

export const HybridStorageSettings: React.FC<HybridStorageSettingsProps> = ({ onSyncComplete, className }) => {
  const [mode, setMode] = useState<StorageMode>('local_only')
  const [folderName, setFolderName] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    const meta = storageManager.getSyncMeta()
    setMode(meta.storageMode)
    setIsConnected(Boolean(gisAuthClient.getAccessToken()))
    localFolderService.restoreHandle().then((name) => {
      if (name) setFolderName(name)
    })
  }, [])

  const handleModeChange = async (newMode: StorageMode) => {
    setMode(newMode)
    await storageManager.setStorageMode(newMode)
    if (newMode === 'hybrid_drive' && !isConnected) {
      await handleConnectDrive()
    }
  }

  const handlePickFolder = async () => {
    try {
      const name = await storageManager.pickLocalFolder()
      if (name) setFolderName(name)
    } catch (err: any) {
      setStatusMessage(err.message || 'Folder selection failed')
    }
  }

  const handleConnectDrive = async () => {
    try {
      await gisAuthClient.requestAccessToken()
      setIsConnected(true)
      setStatusMessage('Google Drive Connected (drive.file scope)')
    } catch (err: any) {
      setStatusMessage(err.message || 'GIS Authentication failed')
    }
  }

  const handleDisconnectDrive = () => {
    gisAuthClient.clearToken()
    setIsConnected(false)
    setStatusMessage('Google Drive Disconnected')
  }

  const handleSyncNow = async () => {
    setIsSyncing(true)
    const result = await storageManager.syncNow({ tasks: [], goals: [], habits: [], mindsetLogs: [] })
    setIsSyncing(false)
    setStatusMessage(result.driveSynced ? 'Drive Synced (LWW)' : 'Storage Updated')
    onSyncComplete?.(result)
  }

  return (
    <div className={`hybrid-storage-settings-panel ${className || ''}`} style={{ padding: '16px', background: '#121216', borderRadius: '12px', color: '#fff' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0' }}>Hybrid Storage &amp; Sync</h3>
      
      {/* 3-Tier Storage Mode Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {(['local_only', 'local_folder', 'hybrid_drive'] as StorageMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            style={{
              flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid',
              borderColor: mode === m ? '#ff5722' : 'rgba(255,255,255,0.1)',
              background: mode === m ? 'rgba(255,87,34,0.15)' : 'transparent',
              color: '#fff', fontSize: '12px', cursor: 'pointer'
            }}
          >
            {m === 'local_only' ? 'Local Only' : m === 'local_folder' ? 'Local Folder' : 'Google Drive'}
          </button>
        ))}
      </div>

      {/* Mode Details */}
      <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
        {mode === 'local_folder' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Folder: {folderName || 'None'}</span>
            <button type="button" onClick={handlePickFolder} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Pick Folder</button>
          </div>
        ) : mode === 'hybrid_drive' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Scope: drive.file (MindsetMachine_Data)</span>
            {!isConnected ? (
              <button type="button" onClick={handleConnectDrive} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Connect Drive</button>
            ) : (
              <button type="button" onClick={handleDisconnectDrive} style={{ padding: '4px 8px', fontSize: '11px', color: '#ff6b6b', cursor: 'pointer' }}>Disconnect</button>
            )}
          </div>
        ) : (
          <span>IndexedDB instant offline-first storage active.</span>
        )}
      </div>

      {/* Manual Sync Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleSyncNow}
          disabled={isSyncing}
          style={{ background: '#ff5722', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now (LWW)'}
        </button>
        {statusMessage && <span style={{ fontSize: '11px', color: '#34d399' }}>{statusMessage}</span>}
      </div>
    </div>
  )
}

export default HybridStorageSettings
