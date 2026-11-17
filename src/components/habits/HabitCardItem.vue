<script setup lang="ts">
import { Check, Trash2 } from 'lucide-vue-next'
import type { Habit } from '@/types/mindset'

defineProps<{
  habit: Habit
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div
    class="habit-card"
    :class="{ completed: habit.completedToday }"
    @click="emit('toggle', habit.id)"
  >
    <div class="habit-left">
      <button
        class="habit-check-circle"
        :class="{ active: habit.completedToday }"
        type="button"
        aria-label="Toggle habit"
      >
        <Check v-if="habit.completedToday" :size="14" />
      </button>
      <span class="habit-emoji">{{ habit.iconEmoji }}</span>
      <div class="habit-info">
        <span class="habit-name">{{ habit.title }}</span>
        <div class="habit-meta">
          <span class="meta-streak">🔥 {{ habit.streak }} streak</span>
          <span class="meta-score">{{ habit.score }}% score</span>
        </div>
      </div>
    </div>

    <div class="habit-right">
      <div class="mini-score-bar">
        <div class="score-fill" :style="{ width: `${habit.score}%` }"></div>
      </div>
      <button
        @click.stop="emit('delete', habit.id)"
        class="delete-btn"
        title="Remove habit"
        type="button"
      >
        <Trash2 :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.habit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background: rgba(14, 20, 27, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  transition: all 0.15s ease;
}
.habit-card:hover { background: rgba(20, 28, 38, 0.65); border-color: rgba(255, 255, 255, 0.1); }
.habit-card.completed { border-color: rgba(48, 209, 88, 0.25); background: rgba(48, 209, 88, 0.03); }
.habit-card.completed .habit-name { color: var(--text-muted, #71717a); }
.habit-left { display: flex; align-items: center; gap: 0.75rem; min-width: 0; }
.habit-check-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
}
.habit-check-circle.active { background: #30d158; border-color: #30d158; }
.habit-emoji { font-size: 1.15rem; line-height: 1; }
.habit-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.habit-name { font-size: 0.85rem; font-weight: 600; color: #fff; line-height: 1.35; word-break: break-word; }
.habit-meta { display: flex; gap: 0.65rem; font-size: 0.7rem; color: #71717a; }
.habit-right { display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0; }
.mini-score-bar { width: 44px; height: 4px; background: rgba(255, 255, 255, 0.06); border-radius: 2px; overflow: hidden; }
.score-fill { height: 100%; background: #ff5722; border-radius: 2px; }
.delete-btn { background: transparent; border: none; color: #71717a; cursor: pointer; padding: 6px; min-width: 28px; min-height: 28px; display: flex; align-items: center; justify-content: center; }
.delete-btn:hover, .delete-btn:active { color: #ff453a; }
</style>
