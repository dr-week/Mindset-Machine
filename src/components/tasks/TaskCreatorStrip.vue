<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Flame, Zap, Waves, Coffee } from 'lucide-vue-next'
import type { EnergyLevel } from '@/types/mindset'

const emit = defineEmits<{
  (e: 'add-task', payload: { title: string; priority: 'low' | 'medium' | 'high'; energy: EnergyLevel }): void
}>()

const newTitle = ref('')
const newPriority = ref<'low' | 'medium' | 'high'>('high')
const newEnergy = ref<EnergyLevel>('deep')

function submit(): void {
  const text = newTitle.value.trim()
  if (!text) return
  emit('add-task', { title: text, priority: newPriority.value, energy: newEnergy.value })
  newTitle.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="task-creator-strip">
    <input v-model="newTitle" type="text" placeholder="Declare high-impact action directive..." class="task-input" required />

    <div class="creator-options">
      <div class="energy-options">
        <button type="button" class="opt-btn" :class="{ active: newEnergy === 'deep' }" @click="newEnergy = 'deep'" title="Deep Work">
          <Zap :size="13" /> Deep
        </button>
        <button type="button" class="opt-btn" :class="{ active: newEnergy === 'flow' }" @click="newEnergy = 'flow'" title="Flow State">
          <Waves :size="13" /> Flow
        </button>
        <button type="button" class="opt-btn" :class="{ active: newEnergy === 'quick' }" @click="newEnergy = 'quick'" title="Quick Execution">
          <Coffee :size="13" /> Quick
        </button>
      </div>

      <button
        type="button"
        class="prio-toggle-btn"
        :class="{ high: newPriority === 'high' }"
        @click="newPriority = newPriority === 'high' ? 'medium' : 'high'"
        :title="`Priority: ${newPriority.toUpperCase()}`"
      >
        <Flame :size="14" />
        <span>{{ newPriority === 'high' ? 'CRITICAL' : 'FLOW' }}</span>
      </button>

      <button type="submit" class="btn-commit">
        <Plus :size="16" />
        <span>Add</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-creator-strip {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(14, 20, 27, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
}
.task-input { width: 100%; background: transparent; border: none; font-size: 0.95rem; color: #fff; outline: none; }
.creator-options { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.04); }
.energy-options { display: flex; gap: 0.35rem; }
.opt-btn {
  display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); color: #71717a; cursor: pointer;
  &.active { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255, 255, 255, 0.2); }
}
.prio-toggle-btn {
  display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); color: #71717a; cursor: pointer;
  &.high { background: rgba(255, 87, 34, 0.15); color: #ff5722; border-color: rgba(255, 87, 34, 0.35); }
}
.btn-commit {
  display: inline-flex; align-items: center; gap: 0.35rem; background: #ff5722; border: none; border-radius: 4px;
  padding: 0.35rem 0.85rem; font-size: 0.75rem; font-weight: 600; color: #fff; cursor: pointer;
}
</style>
