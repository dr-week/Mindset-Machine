<script setup lang="ts">
import { Flame, Zap, Waves, Coffee, Check } from 'lucide-vue-next'

defineProps<{
  activeFilter: 'all' | 'high' | 'deep' | 'flow' | 'quick' | 'completed'
  totalCount: number
  highCount: number
  deepCount: number
  completedCount: number
}>()

const emit = defineEmits<{
  (e: 'update:filter', value: 'all' | 'high' | 'deep' | 'flow' | 'quick' | 'completed'): void
}>()
</script>

<template>
  <div class="filter-strip">
    <button
      class="f-pill"
      :class="{ active: activeFilter === 'all' }"
      @click="emit('update:filter', 'all')"
    >
      All ({{ totalCount }})
    </button>
    <button
      class="f-pill flame"
      :class="{ active: activeFilter === 'high' }"
      @click="emit('update:filter', 'high')"
    >
      <Flame :size="12" /> Critical ({{ highCount }})
    </button>
    <button
      class="f-pill deep"
      :class="{ active: activeFilter === 'deep' }"
      @click="emit('update:filter', 'deep')"
    >
      <Zap :size="12" /> Deep Focus ({{ deepCount }})
    </button>
    <button
      class="f-pill flow"
      :class="{ active: activeFilter === 'flow' }"
      @click="emit('update:filter', 'flow')"
    >
      <Waves :size="12" /> Flow
    </button>
    <button
      class="f-pill quick"
      :class="{ active: activeFilter === 'quick' }"
      @click="emit('update:filter', 'quick')"
    >
      <Coffee :size="12" /> Quick
    </button>
    <button
      class="f-pill done"
      :class="{ active: activeFilter === 'completed' }"
      @click="emit('update:filter', 'completed')"
    >
      <Check :size="12" /> Done ({{ completedCount }})
    </button>
  </div>
</template>

<style scoped>
.filter-strip {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.f-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.f-pill:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

.f-pill.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-main);
}

.f-pill.flame.active {
  background: rgba(255, 69, 58, 0.15);
  border-color: rgba(255, 69, 58, 0.4);
  color: #ff453a;
}

.f-pill.deep.active {
  background: rgba(10, 132, 255, 0.15);
  border-color: rgba(10, 132, 255, 0.4);
  color: #0a84ff;
}

.f-pill.flow.active {
  background: rgba(94, 92, 230, 0.15);
  border-color: rgba(94, 92, 230, 0.4);
  color: #bf5af2;
}

.f-pill.quick.active {
  background: rgba(48, 209, 88, 0.15);
  border-color: rgba(48, 209, 88, 0.4);
  color: #30d158;
}

.f-pill.done.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
