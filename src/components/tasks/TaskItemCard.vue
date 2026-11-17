<script setup lang="ts">
import { Check, Flame, Star, Trash2 } from 'lucide-vue-next'
import type { Task } from '@/types/mindset'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div
    class="task-card"
    :class="{ completed: task.completed, critical: task.priority === 'high' }"
  >
    <button
      @click="emit('toggle', task.id)"
      class="task-checkbox"
      :class="{ checked: task.completed }"
      type="button"
      aria-label="Toggle task"
    >
      <Check v-if="task.completed" :size="13" />
    </button>

    <div class="task-main">
      <div class="task-title-row">
        <span class="task-title">{{ task.title }}</span>
        <div class="badge-group">
          <span v-if="task.isTopThree" class="badge-star" title="Rule of 3 Focus">
            <Star :size="10" /> Top 3
          </span>
          <span v-if="task.priority === 'high'" class="badge-flame">
            <Flame :size="10" /> CRITICAL
          </span>
          <span v-if="task.energy" class="badge-energy" :class="task.energy">
            {{ task.energy === 'deep' ? '⚡ DEEP' : task.energy === 'flow' ? '🌊 FLOW' : '☕ QUICK' }}
          </span>
        </div>
      </div>
      <span class="task-time-meta">{{ task.time || 'Today' }}</span>
    </div>

    <button
      @click="emit('delete', task.id)"
      class="task-delete-btn"
      title="Remove task"
      type="button"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: rgba(14, 20, 27, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
  transition: all 0.15s ease;
}
.task-card:hover { background: rgba(20, 28, 38, 0.75); border-color: rgba(255, 255, 255, 0.1); }
.task-card.critical { border-left: 2px solid #ff453a; }
.task-card.completed { opacity: 0.5; }
.task-card.completed .task-title { text-decoration: line-through; color: var(--text-muted, #71717a); }
.task-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  flex-shrink: 0;
}
.task-checkbox.checked { background: #30d158; border-color: #30d158; }
.task-main { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.task-title-row { display: flex; flex-direction: column; align-items: flex-start; gap: 0.3rem; }
@media (min-width: 640px) {
  .task-title-row { flex-direction: row; align-items: center; justify-content: space-between; }
}
.task-title { font-size: 0.85rem; font-weight: 600; color: #fff; line-height: 1.35; word-break: break-word; }
.badge-group { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; }
.badge-star { display: inline-flex; align-items: center; gap: 3px; font-size: 8px; font-weight: 700; color: #f59e0b; background: rgba(245, 158, 11, 0.12); padding: 1px 4px; border-radius: 3px; }
.badge-flame { display: inline-flex; align-items: center; gap: 3px; font-size: 8px; font-weight: 700; color: #ff5722; background: rgba(255, 87, 34, 0.12); padding: 1px 4px; border-radius: 3px; }
.badge-energy { font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 3px; }
.badge-energy.deep { color: #ef4444; background: rgba(239, 68, 68, 0.12); }
.badge-energy.flow { color: #0ea5e9; background: rgba(14, 165, 233, 0.12); }
.badge-energy.quick { color: #10b981; background: rgba(16, 185, 129, 0.12); }
.task-time-meta { font-size: 0.7rem; color: #71717a; }
.task-delete-btn { background: transparent; border: none; color: #71717a; cursor: pointer; padding: 6px; min-width: 28px; min-height: 28px; display: flex; align-items: center; justify-content: center; }
.task-delete-btn:hover, .task-delete-btn:active { color: #ff453a; }
</style>
