<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
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
  <div class="task-row" :class="{ completed: task.completed }">
    <button
      @click="emit('toggle', task.id)"
      class="check-pill"
      :class="{ checked: task.completed }"
      type="button"
      aria-label="Toggle task"
    >
      <Check v-if="task.completed" :size="12" />
    </button>
    <span class="task-desc">{{ task.title }}</span>
    <span v-if="task.energy" class="energy-pip" :class="task.energy">
      {{ task.energy === 'deep' ? '⚡ DEEP' : task.energy === 'flow' ? '🌊 FLOW' : '☕ QUICK' }}
    </span>
    <button
      @click="emit('delete', task.id)"
      class="btn-delete-row"
      title="Remove task"
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
  padding: 6px 8px;
  border-radius: $radius-xs;
  background: rgba(255, 255, 255, 0.015);
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);

    .btn-delete-row {
      opacity: 1;
    }
  }

  &.completed {
    opacity: 0.45;

    .task-desc {
      text-decoration: line-through;
      color: $color-text-dim;
    }
  }

  .check-pill {
    width: 18px;
    height: 18px;
    border-radius: $radius-xs;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    flex-shrink: 0;
    transition: all 0.15s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.checked {
      background: $color-emerald;
      border-color: $color-emerald;
    }
  }

  .task-desc {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: $color-text-primary;
    line-height: 1.4;
    word-break: break-word;
  }

  .energy-pip {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 1px 5px;
    border-radius: 3px;
    flex-shrink: 0;

    &.deep { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
    &.flow { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3); }
    &.quick { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
  }

  .btn-delete-row {
    background: transparent;
    border: none;
    color: $color-text-dim;
    cursor: pointer;
    opacity: 0;
    padding: 6px;
    min-width: 26px;
    min-height: 26px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;

    @media (hover: none) {
      opacity: 0.65;
    }

    &:hover,
    &:active {
      color: $color-rose;
      opacity: 1;
      background: rgba(244, 63, 94, 0.1);
    }
  }
}
</style>
