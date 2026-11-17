<script setup lang="ts">
defineProps<{
  deepCount: number
  flowCount: number
  quickCount: number
}>()
</script>

<template>
  <div class="cognitive-balance">
    <span class="cb-title">COGNITIVE LOAD</span>
    <div class="cb-bars">
      <div class="cb-pill deep" title="Deep Work items">
        <span class="cb-emoji">⚡</span>
        <span class="cb-name">Deep</span>
        <span class="cb-val">{{ deepCount }}</span>
      </div>
      <div class="cb-pill flow" title="Flow state items">
        <span class="cb-emoji">🌊</span>
        <span class="cb-name">Flow</span>
        <span class="cb-val">{{ flowCount }}</span>
      </div>
      <div class="cb-pill quick" title="Quick tactical items">
        <span class="cb-emoji">☕</span>
        <span class="cb-name">Quick</span>
        <span class="cb-val">{{ quickCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cognitive-balance {
  margin-top: 14px;
  .cb-title {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-text-dim, #52525b);
    display: block;
    margin-bottom: 6px;
  }
}
.cb-bars {
  display: flex;
  gap: 6px;
}
.cb-pill {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm, 6px);
  padding: 4px 6px;
  font-size: 0.7rem;
  .cb-emoji {
    font-size: 0.75rem;
  }
  .cb-name {
    color: var(--color-text-secondary, #a1a1aa);
  }
  .cb-val {
    margin-left: auto;
    font-weight: 700;
    color: var(--color-text-primary, #ffffff);
  }
  &.deep { border-left: 2px solid #f59e0b; }
  &.flow { border-left: 2px solid #3b82f6; }
  &.quick { border-left: 2px solid #10b981; }
}
</style>
