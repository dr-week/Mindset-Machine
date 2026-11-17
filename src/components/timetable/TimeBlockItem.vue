<script setup lang="ts">
import { Check, Trash2 } from 'lucide-vue-next'
import type { TimeBlock } from '@/types/mindset'

defineProps<{
  block: TimeBlock
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="timeline-card" :class="[block.category, { completed: block.completed }]">
    <div class="timeline-edge-indicator"></div>
    <div class="time-slot-badge">
      <span class="start-txt">{{ block.startTime }}</span>
      <span class="end-txt">{{ block.endTime }}</span>
    </div>
    <div class="card-main">
      <div class="card-title-row">
        <span class="category-tag">{{ block.category.toUpperCase() }}</span>
        <h4 class="block-heading">{{ block.title }}</h4>
      </div>
      <p v-if="block.notes" class="block-description">{{ block.notes }}</p>
    </div>
    <div class="card-actions">
      <button
        @click="emit('toggle', block.id)"
        class="btn-block-check"
        :class="{ checked: block.completed }"
        title="Toggle completion"
        type="button"
      >
        <Check :size="14" />
      </button>
      <button
        @click="emit('delete', block.id)"
        class="btn-block-delete"
        title="Delete block"
        type="button"
      >
        <Trash2 :size="13" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.timeline-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(18, 18, 22, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 0.85rem 1.25rem;
  border-radius: $radius-md;
  transition: all 0.2s ease;

  &:hover { background: rgba(24, 24, 30, 0.8); border-color: rgba(255, 255, 255, 0.08); }
  &.completed {
    opacity: 0.45;
    filter: grayscale(0.6);
    .block-heading { text-decoration: line-through; }
  }

  .timeline-edge-indicator {
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 0 2px 2px 0;
  }
  &.deep .timeline-edge-indicator { background: #ef4444; }
  &.vitality .timeline-edge-indicator { background: #f59e0b; }
  &.ritual .timeline-edge-indicator { background: #10b981; }
  &.admin .timeline-edge-indicator { background: #0ea5e9; }
  &.rest .timeline-edge-indicator { background: #a78bfa; }

  .time-slot-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-xs;
    padding: 6px 8px;
    min-width: 64px;
    font-family: $font-mono;
    font-size: 11px;
    color: #fff;
    .end-txt { font-size: 9px; color: $color-text-dim; }
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    .card-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      .category-tag { font-family: $font-mono; font-size: 8px; letter-spacing: 0.06em; color: $color-text-dim; }
      .block-heading { font-size: 13.5px; font-weight: 700; color: #fff; margin: 0; }
    }
    .block-description { font-size: 11.5px; color: $color-text-dim; margin: 0; }
  }

  .card-actions {
    display: flex;
    gap: 6px;
    button {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: $radius-xs;
      color: $color-text-dim;
      padding: 6px;
      min-width: 28px;
      min-height: 28px;
      cursor: pointer;
      &:hover, &:active { color: #fff; }
      &.checked { background: #10b981; color: #fff; border-color: #10b981; }
    }
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 12px;
    .time-slot-badge { order: 1; }
    .card-actions { order: 2; margin-left: auto; }
    .card-main { order: 3; width: 100%; flex-basis: 100%; }
  }
}
</style>
