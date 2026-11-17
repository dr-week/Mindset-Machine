<script setup lang="ts">
import { Check, Trash2 } from 'lucide-vue-next'
import type { Goal } from '@/types/mindset'

defineProps<{
  goal: Goal
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div
    class="goal-card"
    :class="{ completed: goal.completed }"
  >
    <button
      @click="emit('toggle', goal.id)"
      class="goal-checkbox"
      :class="{ checked: goal.completed }"
      type="button"
      aria-label="Toggle goal completion"
    >
      <Check v-if="goal.completed" :size="13" />
    </button>
    <div class="goal-info">
      <span class="goal-text">{{ goal.text }}</span>
      <span v-if="goal.targetDate" class="goal-date">Target: {{ goal.targetDate }}</span>
    </div>
    <button
      @click="emit('delete', goal.id)"
      class="btn-delete-goal"
      title="Remove directive"
      type="button"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>

<style scoped>
.goal-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  background: rgba(14, 20, 27, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
  transition: all 0.15s ease;
}

.goal-card:hover {
  background: rgba(20, 28, 38, 0.65);
  border-color: rgba(255, 255, 255, 0.1);
}

.goal-card.completed {
  opacity: 0.5;
}

.goal-card.completed .goal-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.goal-checkbox {
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
  transition: all 0.15s ease;
}

.goal-checkbox.checked {
  background: var(--color-ember, #ff453a);
  border-color: var(--color-ember, #ff453a);
}

.goal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.goal-text {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  word-break: break-word;
}

.goal-date {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.btn-delete-goal {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  opacity: 0.3;
  transition: all 0.15s ease;
}

.goal-card:hover .btn-delete-goal {
  opacity: 1;
}

.btn-delete-goal:hover {
  color: #ff453a;
}

@media (hover: none) {
  .btn-delete-goal { opacity: 0.75; }
}
</style>
