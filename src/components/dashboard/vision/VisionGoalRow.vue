<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
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
  <div class="task-row goal-row" :class="{ completed: goal.completed }">
    <button
      @click="emit('toggle', goal.id)"
      class="check-pill"
      :class="{ checked: goal.completed }"
      type="button"
    >
      <Check v-if="goal.completed" :size="12" />
    </button>
    <span class="task-desc">{{ goal.text }}</span>
    <button
      @click="emit('delete', goal.id)"
      class="btn-delete-row"
      title="Remove goal"
      type="button"
    >
      <X :size="13" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: $radius-sm;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    .btn-delete-row { opacity: 1; }
  }

  &.completed {
    opacity: 0.5;
    .task-desc { text-decoration: line-through; color: $color-text-dim; }
  }

  .check-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: $radius-xs;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: all 0.15s ease;
    &.checked {
      background: #10b981;
      border-color: #10b981;
    }
  }

  .task-desc {
    flex: 1;
    font-size: 13px;
    color: #fff;
  }

  .btn-delete-row {
    opacity: 0;
    background: transparent;
    border: none;
    color: $color-text-dim;
    cursor: pointer;
    padding: 4px;
    &:hover { color: #ff5722; }
  }

  @media (hover: none) {
    .btn-delete-row {
      opacity: 0.65;
    }
  }
}
</style>
