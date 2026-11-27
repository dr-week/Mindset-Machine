<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HardDrive, Folder, Cloud, RefreshCw, LogIn, LogOut, Check } from 'lucide-vue-next'
import { storageManager } from '@/services/storage/storageManager'
import { gisAuthClient } from '@/services/google/gisAuthClient'
import { localFolderService } from '@/services/storage/localFolderService'
import { useTasksStore } from '@/store/tasks'
import type { StorageMode } from '@/types/storage'

const tasksStore = useTasksStore()
const currentMode = ref<StorageMode>('local_only')
const folderName = ref<string | null>(null)
const isDriveConnected = ref(false)
const isSyncing = ref(false)
const syncMsg = ref<string | null>(null)

onMounted(async () => {
  const meta = storageManager.getSyncMeta()
  currentMode.value = meta.storageMode
  folderName.value = (await localFolderService.restoreHandle()) || meta.localFolderName || null
  isDriveConnected.value = Boolean(gisAuthClient.getAccessToken())
})

async function setMode(mode: StorageMode) {
  currentMode.value = mode
  await storageManager.setStorageMode(mode)
  if (mode === 'hybrid_drive' && !isDriveConnected.value) {
    await handleConnectDrive()
  }
}

async function handlePickFolder() {
  try {
    const name = await storageManager.pickLocalFolder()
    if (name) folderName.value = name
  } catch (err: any) {
    syncMsg.value = err.message || 'Folder pick failed'
  }
}

async function handleConnectDrive() {
  try {
    await gisAuthClient.requestAccessToken()
    isDriveConnected.value = true
    syncMsg.value = 'Drive Connected (drive.file scope)'
  } catch (err: any) {
    syncMsg.value = err.message || 'OAuth failed'
  }
}

function handleDisconnectDrive() {
  gisAuthClient.clearToken()
  isDriveConnected.value = false
  syncMsg.value = 'Drive Disconnected'
}

async function handleManualSync() {
  isSyncing.value = true
  const res = await storageManager.syncNow({
    tasks: tasksStore.tasks,
    goals: tasksStore.goals,
    habits: tasksStore.habits,
    mindsetLogs: [],
  })
  isSyncing.value = false
  syncMsg.value = res.driveSynced ? 'Drive Synced (LWW)' : res.folderWritten ? 'Local Folder Updated' : 'IndexedDB Up to date'
  setTimeout(() => { syncMsg.value = null }, 3500)
}
</script>

<template>
  <div class="storage-card zuari-card">
    <div class="card-head">
      <HardDrive :size="16" class="text-ember" />
      <span class="head-title">Hybrid Storage &amp; Sync Architecture</span>
    </div>

    <!-- Mode Selector -->
    <div class="mode-toggles">
      <button :class="{ active: currentMode === 'local_only' }" @click="setMode('local_only')" type="button">
        <HardDrive :size="12" /><span>Local (Browser)</span>
      </button>
      <button :class="{ active: currentMode === 'local_folder' }" @click="setMode('local_folder')" type="button">
        <Folder :size="12" /><span>Local Folder</span>
      </button>
      <button :class="{ active: currentMode === 'hybrid_drive' }" @click="setMode('hybrid_drive')" type="button">
        <Cloud :size="12" /><span>Google Drive</span>
      </button>
    </div>

    <!-- Details Box -->
    <div class="panel-box">
      <div v-if="currentMode === 'local_folder'" class="folder-row">
        <span>Folder: <strong>{{ folderName || 'None selected' }}</strong></span>
        <button class="btn-sub" @click="handlePickFolder" type="button">Select Folder</button>
      </div>

      <div v-else-if="currentMode === 'hybrid_drive'" class="drive-row">
        <span>Scope: <code>drive.file</code> (MindsetMachine_Data)</span>
        <button v-if="!isDriveConnected" class="btn-sub" @click="handleConnectDrive" type="button"><LogIn :size="12" /> Connect</button>
        <button v-else class="btn-sub danger" @click="handleDisconnectDrive" type="button"><LogOut :size="12" /> Disconnect</button>
      </div>

      <div v-else class="info-row">
        <span>Instant zero-latency reads/writes in local IndexedDB sandbox.</span>
      </div>
    </div>

    <div class="actions-row">
      <button class="btn-sync" :disabled="isSyncing" @click="handleManualSync" type="button">
        <RefreshCw :size="12" :class="{ spin: isSyncing }" />
        <span>{{ isSyncing ? 'Syncing...' : 'Sync Now (LWW)' }}</span>
      </button>
      <span v-if="syncMsg" class="msg-pill"><Check :size="11" /> {{ syncMsg }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
.storage-card { background: rgba(18, 18, 22, 0.95); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: $radius-md; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.card-head { display: flex; align-items: center; gap: 8px; .head-title { font-size: 13px; font-weight: 700; color: #fff; } }
.mode-toggles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
  button { display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 6px 8px; font-size: 11px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: $radius-xs; color: $color-text-dim; cursor: pointer;
    &.active { background: rgba(255,87,34,0.15); border-color: #ff5722; color: #fff; font-weight: 700; } }
}
.panel-box { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: $radius-xs; padding: 8px 10px; font-size: 11.5px; color: #cbd5e1; }
.folder-row, .drive-row, .actions-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.btn-sub { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 10.5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #fff; cursor: pointer;
  &.danger { color: #f87171; border-color: rgba(248,113,113,0.3); } }
.btn-sync { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; font-size: 11px; font-weight: 700; background: #ff5722; border: 1px solid #ff5722; border-radius: $radius-xs; color: #fff; cursor: pointer; }
.msg-pill { font-size: 10.5px; color: #34d399; display: flex; align-items: center; gap: 4px; }
.text-ember { color: #ff5722; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
