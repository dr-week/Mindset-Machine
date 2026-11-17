<script setup lang="ts">
import { ref } from 'vue'
import { Flame, Plus } from 'lucide-vue-next'
import { parseTaskInput } from '@/features/tasks/taskInputParser'

const emit = defineEmits<{
  (e: 'add-task', payload: { title: string; priority: 'low' | 'medium' | 'high'; energy: 'deep' | 'flow' | 'quick' }): void
}>()

const newTaskInput = ref('')
const taskInputRef = ref<HTMLInputElement | null>(null)
const newTaskPriority = ref<'low' | 'medium' | 'high'>('high')
const newTaskEnergy = ref<'deep' | 'flow' | 'quick'>('deep')

function submit(): void {
  const rawText = newTaskInput.value.trim()
  if (!rawText) return

  const parsed = parseTaskInput(rawText, newTaskPriority.value, newTaskEnergy.value)
  emit('add-task', parsed)
  newTaskInput.value = ''
}

defineExpose({
  focusInput: () => taskInputRef.value?.focus(),
})
</script>

<template>
  <form @submit.prevent="submit" class="input-strip">
    <input
      ref="taskInputRef"
      v-model="newTaskInput"
      type="text"
      placeholder="Add task... (Press 'C' to focus)"
      class="strip-input"
    />
    <button
      type="button"
      @click="newTaskEnergy = newTaskEnergy === 'deep' ? 'flow' : newTaskEnergy === 'flow' ? 'quick' : 'deep'"
      class="btn-energy-toggle"
      :class="newTaskEnergy"
      :title="`Energy: ${newTaskEnergy}`"
    >
      <span>{{ newTaskEnergy === 'deep' ? '⚡' : newTaskEnergy === 'flow' ? '🌊' : '☕' }}</span>
    </button>
    <button
      type="button"
      @click="newTaskPriority = newTaskPriority === 'high' ? 'medium' : 'high'"
      class="btn-flame-prio"
      :class="newTaskPriority"
      :title="`Priority: ${newTaskPriority}`"
    >
      <Flame :size="14" />
    </button>
    <button type="submit" class="btn-strip-submit">
      <Plus :size="16" />
    </button>
  </form>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.input-strip {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: $radius-sm;
  padding: 3px 6px;
  gap: 6px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: rgba(255, 87, 34, 0.4);
    background: rgba(255, 255, 255, 0.03);
  }

  .strip-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 13px;
    padding: 6px 8px;
    outline: none;
    &::placeholder { color: $color-text-dim; }
  }

  .btn-energy-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: $radius-xs;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
    font-size: 11px;
    cursor: pointer;
    &.deep { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); }
    &.flow { background: rgba(14, 165, 233, 0.15); border-color: rgba(14, 165, 233, 0.3); }
    &.quick { background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); }
  }

  .btn-flame-prio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: $radius-xs;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
    color: $color-text-dim;
    cursor: pointer;
    &.high { background: rgba(255, 87, 34, 0.2); border-color: rgba(255, 87, 34, 0.5); color: #ff5722; }
  }

  .btn-strip-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: $radius-xs;
    border: none;
    background: #ff5722;
    color: #fff;
    cursor: pointer;
  }
}
</style>
