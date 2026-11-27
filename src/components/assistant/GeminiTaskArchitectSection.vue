<script setup lang="ts">
/**
 * GeminiTaskArchitectSection — Gemini 2.5 Flash Goal -> Task -> Micro-Tasks & Steps Architect
 * Allows users to enter any high-level objective and have Gemini decompose it into
 * Tasks and Micro-Task Steps, or preview & commit them directly to the Task Database.
 */
import { ref } from 'vue'
import { Sparkles, Layers, CheckCircle2, Plus } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import type { GeminiGoalBreakdown } from '@/types/assistant'

const tasksStore = useTasksStore()
const goalPrompt = ref('')
const lastBreakdown = ref<GeminiGoalBreakdown | null>(null)

async function handleArchitect(): Promise<void> {
  if (!goalPrompt.value.trim()) {
    goalPrompt.value = 'Ship Android APK with Google Drive Minimal Sync & Fit Telemetry'
  }
  const result = await tasksStore.architectGoalWithGemini(goalPrompt.value)
  lastBreakdown.value = result
  goalPrompt.value = ''
}
</script>

<template>
  <section class="gemini-architect-box">
    <div class="box-top">
      <div class="title-wrap">
        <Sparkles :size="15" class="text-ember" />
        <div>
          <h3 class="sec-title">Gemini 2.5 Flash — Goal, Task &amp; Micro-Step Architect</h3>
          <p class="sec-sub">Decomposes any monumental goal into actionable tasks, micro-tasks, and time-boxed steps.</p>
        </div>
      </div>
    </div>

    <form class="architect-form" @submit.prevent="handleArchitect">
      <input
        v-model="goalPrompt"
        type="text"
        class="architect-input"
        placeholder="Enter a goal (e.g. Build Android APK with Google Fit & Drive Sync)..."
      />
      <button type="submit" class="btn-architect" :disabled="tasksStore.loadingAi">
        <Plus :size="14" />
        <span>{{ tasksStore.loadingAi ? 'Synthesizing...' : 'Architect Goal & Steps' }}</span>
      </button>
    </form>

    <div v-if="lastBreakdown" class="breakdown-preview">
      <div class="goal-banner">
        <Layers :size="14" class="text-ember" />
        <strong>Goal Landed: {{ lastBreakdown.goalTitle }}</strong>
        <span class="cat-badge">{{ lastBreakdown.category.toUpperCase() }}</span>
      </div>

      <div class="tasks-tree">
        <div v-for="(t, idx) in lastBreakdown.tasks" :key="idx" class="task-branch">
          <div class="branch-head">
            <span class="branch-title">{{ t.taskTitle }}</span>
            <span class="branch-meta">{{ t.priority.toUpperCase() }} · {{ t.energy.toUpperCase() }}</span>
          </div>
          <ul class="micro-list">
            <li v-for="(step, sIdx) in t.microTasks" :key="sIdx" class="micro-item">
              <CheckCircle2 :size="11" class="text-emerald" />
              <span>{{ step.title }}</span>
              <small v-if="step.estimatedMinutes">{{ step.estimatedMinutes }}m</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
.gemini-architect-box {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.title-wrap { display: flex; align-items: flex-start; gap: 9px;
  .sec-title { font-size: 13.5px; font-weight: 700; color: #fff; margin: 0; }
  .sec-sub { font-size: 11px; color: $color-text-dim; margin: 2px 0 0; }
}
.architect-form { display: flex; gap: 8px; flex-wrap: wrap;
  .architect-input { flex: 1; min-width: 210px; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; padding: 8px 11px; color: #fff; font-size: 12px; }
  .btn-architect { display: inline-flex; align-items: center; gap: 6px; background: #ff5722; border: 1px solid #ff5722; border-radius: 8px; color: #fff; font-size: 11.5px; font-weight: 700; padding: 8px 13px; cursor: pointer; min-height: 36px; }
}
.breakdown-preview { display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 11px; }
.goal-banner { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #fff;
  .cat-badge { margin-left: auto; font-size: 9px; font-weight: 700; background: rgba(255,87,34,0.18); color: #ff7a45; padding: 2px 6px; border-radius: 4px; }
}
.tasks-tree { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; }
.task-branch { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;
  .branch-head { display: flex; justify-content: space-between; gap: 6px; margin-bottom: 6px; .branch-title { font-size: 11.5px; font-weight: 700; color: #fff; } .branch-meta { font-size: 9px; color: #f59e0b; font-weight: 700; } }
}
.micro-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.micro-item { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: $color-text-secondary; small { margin-left: auto; color: $color-text-dim; font-family: $font-mono; } }
.text-ember { color: #ff5722; }
.text-emerald { color: #10b981; flex-shrink: 0; }
</style>
