<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FileText, Download } from 'lucide-vue-next'
import EveningAuditModal from '@/components/EveningAuditModal.vue'
import { useTasksStore } from '@/store/tasks'

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
      setTimeout(() => {
        importMessage.value = null
      }, 4000)
    }
  }
  reader.readAsText(file)
  target.value = ''
}

function exportToJson(): void {
  const data = {
    exportedAt: new Date().toISOString(),
    goals: tasksStore.goals,
    tasks: tasksStore.tasks,
    timetable: tasksStore.timetable,
    reviews: tasksStore.reviews,
    aiSuggestedTasks: tasksStore.aiSuggestedTasks,
    aiMotivation: tasksStore.aiMotivation,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mindset-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function exportToMarkdown(): void {
  let md = `# MINDSET — Productivity Vault Export\n*Exported on ${new Date().toLocaleString()}*\n\n`
  md += `## 🎯 Vision Directives (${tasksStore.goals.length})\n`
  tasksStore.goals.forEach((g) => {
    md += `- [${g.completed ? 'x' : ' '}] ${g.text}\n`
  })
  md += `\n## ⚡ Tasks Matrix (${tasksStore.tasks.length})\n`
  tasksStore.tasks.forEach((t) => {
    md += `- [${t.completed ? 'x' : ' '}] **[${t.priority.toUpperCase()}]** ${t.title} *(Energy: ${t.energy || 'normal'})*\n`
  })
  if (tasksStore.timetable.length > 0) {
    md += `\n## ⏱️ Circadian Timetable (${tasksStore.timetable.length})\n`
    tasksStore.timetable.forEach((b) => {
      md += `- [${b.completed ? 'x' : ' '}] ${b.startTime} - ${b.endTime} **[${b.category.toUpperCase()}]** ${b.title}\n`
    })
  }
  if (tasksStore.reviews.length > 0) {
    md += `\n## 🌙 Evening Audits & Wins (${tasksStore.reviews.length})\n`
    tasksStore.reviews.forEach((r) => {
      md += `### ${r.date} (Velocity: ${r.velocityRate}%)\n`
      md += `- **Win:** ${r.winNote}\n`
      md += `- **Next Priority:** ${r.tomorrowPriority}\n\n`
    })
  }

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mindset-vault-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="full-bento-card vault-canvas zuari-card">
    <div class="full-top">
      <h2>Telemetry & Vault</h2>
      <div class="export-actions-row">
        <EveningAuditModal />
        <input
          ref="fileInputRef"
          type="file"
          accept=".json"
          style="display: none;"
          @change="handleFileImport"
        />
        <button @click="triggerFileSelect" class="btn-vault-export" title="Restore entire workspace from JSON">
          <Upload :size="13" />
          <span>Restore Backup</span>
        </button>
        <button @click="exportToMarkdown" class="btn-vault-export" title="Export entire workspace to Markdown">
          <FileText :size="13" />
          <span>Export Markdown</span>
        </button>
        <button @click="exportToJson" class="btn-vault-export primary" title="Export backup JSON">
          <Download :size="13" />
          <span>Backup JSON</span>
        </button>
      </div>
    </div>

    <div v-if="importMessage" class="import-alert-banner">
      <span>{{ importMessage }}</span>
    </div>

    <div class="vault-kpis">
      <div class="kpi-card">
        <span class="val">{{ tasksStore.tasks.length }}</span>
        <span class="lbl">TASKS</span>
      </div>
      <div class="kpi-card">
        <span class="val">{{ tasksStore.goals.length }}</span>
        <span class="lbl">GOALS</span>
      </div>
      <div class="kpi-card">
        <span class="val">{{ tasksStore.timetable.length }}</span>
        <span class="lbl">TIME BLOCKS</span>
      </div>
      <div class="kpi-card">
        <span class="val">{{ tasksStore.aiSuggestedTasks.length }}</span>
        <span class="lbl">AI ROADMAPS</span>
      </div>
    </div>

    <pre class="clean-json-box">{{
      JSON.stringify(
        {
          goals: tasksStore.goals,
          tasks: tasksStore.tasks,
          timetable: tasksStore.timetable,
          reviews: tasksStore.reviews,
          suggestions: tasksStore.aiSuggestedTasks,
        },
        null,
        2,
      )
    }}</pre>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.vault-canvas {
  .export-actions-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .btn-vault-export {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0.4rem 0.75rem;
      border-radius: $radius-sm;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: $color-text-muted;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      &.primary {
        background: rgba(255, 87, 34, 0.15);
        border-color: rgba(255, 87, 34, 0.4);
        color: $color-ember;

        &:hover {
          background: rgba(255, 87, 34, 0.25);
        }
      }
    }
  }

  .import-alert-banner {
    padding: 0.6rem 0.85rem;
    margin-bottom: 1rem;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: $radius-sm;
    color: #34d399;
    font-size: 12px;
  }

  .vault-kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.25rem;

    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0.85rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: $radius-md;

      .val {
        font-family: $font-mono;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
      }

      .lbl {
        font-family: $font-mono;
        font-size: 8.5px;
        letter-spacing: 0.08em;
        color: $color-text-dim;
      }
    }
  }

  .clean-json-box {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: $radius-md;
    padding: 1.15rem;
    font-family: $font-mono;
    font-size: 11px;
    color: $color-text-muted;
    max-height: 400px;
    overflow-y: auto;
    @include custom-scroll;
  }
}

.full-bento-card {
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  .full-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
  }
}
</style>
