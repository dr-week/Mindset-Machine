<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FileText, Download, Cloud } from 'lucide-vue-next'
import EveningAuditModal from '@/components/EveningAuditModal.vue'
import { useTasksStore } from '@/store/tasks'
import { downloadJsonBackup, downloadMarkdownVault } from './vaultExportHelpers'
import VaultKpiGrid from './VaultKpiGrid.vue'
import VaultDatabaseStatus from './VaultDatabaseStatus.vue'

const tasksStore = useTasksStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const importMessage = ref<string | null>(null)

function triggerFileSelect(): void {
  fileInputRef.value?.click()
}

function handleFileImport(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    if (content) {
      const res = tasksStore.importFromJson(content)
      importMessage.value = res.message
      setTimeout(() => { importMessage.value = null }, 4000)
    }
  }
  reader.readAsText(file)
  target.value = ''
}

async function handleDriveMinimalSync(): Promise<void> {
  const res = await tasksStore.syncMinimalToGoogleDrive()
  importMessage.value = `Synced minimal task database to Google Drive (${res.payloadBytes} bytes)`
  setTimeout(() => { importMessage.value = null }, 4000)
}

function exportToJson(): void {
  downloadJsonBackup({
    exportedAt: new Date().toISOString(),
    goals: tasksStore.goals,
    tasks: tasksStore.tasks,
    timetable: tasksStore.timetable,
    reviews: tasksStore.reviews,
    aiSuggestedTasks: tasksStore.aiSuggestedTasks,
    aiMotivation: tasksStore.aiMotivation,
  })
}

function exportToMarkdown(): void {
  downloadMarkdownVault(tasksStore.goals, tasksStore.tasks, tasksStore.timetable, tasksStore.reviews)
}
</script>

<template>
  <div class="full-bento-card vault-canvas zuari-card">
    <div class="full-top">
      <h2>Telemetry &amp; Sovereign Vault</h2>
      <div class="export-actions-row">
        <EveningAuditModal />
        <button @click="handleDriveMinimalSync" class="btn-vault-export" title="Sync Minimal Task DB to Google Drive" type="button">
          <Cloud :size="13" /><span>Drive Minimal Sync</span>
        </button>
        <input ref="fileInputRef" type="file" accept=".json" style="display: none;" @change="handleFileImport" />
        <button @click="triggerFileSelect" class="btn-vault-export" title="Restore workspace" type="button">
          <Upload :size="13" /><span>Restore</span>
        </button>
        <button @click="exportToMarkdown" class="btn-vault-export" title="Export Markdown" type="button">
          <FileText :size="13" /><span>Export MD</span>
        </button>
        <button @click="exportToJson" class="btn-vault-export primary" title="Backup JSON" type="button">
          <Download :size="13" /><span>Backup JSON</span>
        </button>
      </div>
    </div>

    <div v-if="importMessage" class="import-alert-banner"><span>{{ importMessage }}</span></div>

    <VaultKpiGrid
      :tasks-count="tasksStore.tasks.length"
      :goals-count="tasksStore.goals.length"
      :timetable-count="tasksStore.timetable.length"
      :ai-roadmaps-count="tasksStore.aiSuggestedTasks.length"
    />

    <VaultDatabaseStatus
      :total-entities="tasksStore.tasks.length + tasksStore.goals.length + tasksStore.habits.length + tasksStore.notes.length"
      :tasks-count="tasksStore.tasks.length"
      :goals-count="tasksStore.goals.length"
      :habits-count="tasksStore.habits.length"
      :notes-count="tasksStore.notes.length"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
.vault-canvas {
  padding: 1.25rem 1.5rem; background: rgba(18, 18, 22, 0.95); border-radius: $radius-lg;
  @media (max-width: 680px) { padding: 1rem 0.85rem; }
}
.full-top {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 1.25rem;
  h2 { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
  .export-actions-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
}
.btn-vault-export {
  display: inline-flex; align-items: center; gap: 5px; background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: $radius-xs; color: #fff; font-size: 11px; padding: 6px 11px; cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.06); }
  &.primary { background: #ff5722; border-color: #ff5722; font-weight: 700; }
}
.import-alert-banner {
  background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: $radius-xs; padding: 8px 12px; color: #34d399; font-size: 12px; margin-bottom: 16px;
}
</style>
