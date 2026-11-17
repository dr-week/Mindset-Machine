<script setup lang="ts">
import { X, ArrowUpRight } from 'lucide-vue-next'
import type { AiSuggestion } from '@/types/mindset'

defineProps<{
  suggestion: AiSuggestion
}>()

const emit = defineEmits<{
  (e: 'accept', id: string): void
  (e: 'dismiss', id: string): void
}>()
</script>

<template>
  <div class="suggestion-brick">
    <div class="brick-top">
      <span class="brick-tag">TACTICAL MOVE</span>
      <button @click="emit('dismiss', suggestion.id)" class="btn-brick-dismiss" title="Dismiss" type="button">
        <X :size="13" />
      </button>
    </div>
    <p class="brick-text">{{ suggestion.suggestion }}</p>
    <button @click="emit('accept', suggestion.id)" class="btn-adopt-pill" title="Add to Execution Queue" type="button">
      <span>+ Adopt into tasks</span>
      <ArrowUpRight :size="13" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.suggestion-brick {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: 0.85rem 1rem;
  gap: 0.65rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 87, 34, 0.3);
    transform: translateY(-2px);
  }

  .brick-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .brick-tag {
      font-family: $font-mono;
      font-size: 8px;
      letter-spacing: 0.1em;
      color: $color-ember;
      background: rgba(255, 87, 34, 0.1);
      padding: 2px 5px;
      border-radius: $radius-xs;
    }
    .btn-brick-dismiss {
      background: transparent;
      border: none;
      color: $color-text-dim;
      cursor: pointer;
      padding: 2px;
      opacity: 0.6;
      &:hover { opacity: 1; color: #ffffff; }
    }
  }

  .brick-text {
    font-size: 13px;
    line-height: 1.4;
    color: #ffffff;
    margin: 0;
  }

  .btn-adopt-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    align-self: flex-start;
    background: rgba(255, 87, 34, 0.15);
    border: 1px solid rgba(255, 87, 34, 0.3);
    border-radius: $radius-xs;
    color: #ff7a45;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover { background: rgba(255, 87, 34, 0.25); color: #fff; }
  }
}
</style>
