<script setup lang="ts">
defineProps<{
  activeFilter: 'all' | 'high' | 'deep' | 'flow' | 'quick'
}>()

const emit = defineEmits<{
  (e: 'set-filter', filter: 'all' | 'high' | 'deep' | 'flow' | 'quick'): void
}>()
</script>

<template>
  <div class="filter-pills-row">
    <button type="button" @click="emit('set-filter', 'all')" class="filter-pill" :class="{ active: activeFilter === 'all' }">All</button>
    <button type="button" @click="emit('set-filter', 'deep')" class="filter-pill deep" :class="{ active: activeFilter === 'deep' }">⚡ Deep</button>
    <button type="button" @click="emit('set-filter', 'flow')" class="filter-pill flow" :class="{ active: activeFilter === 'flow' }">🌊 Flow</button>
    <button type="button" @click="emit('set-filter', 'quick')" class="filter-pill quick" :class="{ active: activeFilter === 'quick' }">☕ Quick</button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.filter-pills-row {
  display: flex;
  gap: 6px;
  .filter-pill {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: $radius-xs;
    padding: 3px 8px;
    font-size: 11px;
    color: $color-text-dim;
    cursor: pointer;
    &.active { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255, 255, 255, 0.2); }
    &.deep.active { color: #ef4444; border-color: rgba(239, 68, 68, 0.4); }
    &.flow.active { color: #0ea5e9; border-color: rgba(14, 165, 233, 0.4); }
    &.quick.active { color: #10b981; border-color: rgba(16, 185, 129, 0.4); }
  }
}
</style>
