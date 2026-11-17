<script setup lang="ts">
import { Sparkles, CheckCircle } from 'lucide-vue-next'
import type { RoutineSuggestion } from '@/types/assistant'

defineProps<{
  suggestions: RoutineSuggestion[]
}>()

const emit = defineEmits<{
  (e: 'apply-suggestion', suggestion: RoutineSuggestion): void
}>()
</script>

<template>
  <div class="assistant-section">
    <div class="section-title">
      <Sparkles :size="15" class="text-emerald" />
      <span>CIRCADIAN ROUTINE OPTIMIZATION</span>
    </div>
    <div class="suggestions-list">
      <div v-for="s in suggestions" :key="s.id" class="suggestion-row">
        <div class="s-info">
          <h5 class="s-title">{{ s.title }}</h5>
          <p class="s-rationale">{{ s.rationale }}</p>
        </div>
        <button @click="emit('apply-suggestion', s)" class="btn-apply-sug" type="button">
          <CheckCircle :size="13" />
          <span>{{ s.actionLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.assistant-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: $color-text-dim;
  }
}
.suggestions-list { display: flex; flex-direction: column; gap: 8px; }
.suggestion-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-sm;
  .s-info {
    .s-title { font-size: 0.85rem; font-weight: 700; color: #fff; margin: 0 0 2px; }
    .s-rationale { font-size: 0.75rem; color: $color-text-muted; margin: 0; }
  }
  .btn-apply-sug {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: $radius-xs;
    color: #34d399;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    cursor: pointer;
    &:hover { background: #10b981; color: #fff; }
  }
}
.text-emerald { color: #10b981; }
</style>
