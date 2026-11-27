<script setup lang="ts">
/**
 * TaskMicroStepsList — Displays and manages Micro-Tasks / Steps inside a Task card.
 */
import { ref } from 'vue'
import { Check, Plus } from 'lucide-vue-next'
import type { MicroTask } from '@/types/mindset'

defineProps<{
  taskId: string
  steps?: MicroTask[]
}>()

const emit = defineEmits<{
  (e: 'toggle-step', payload: { taskId: string; stepId: string }): void
  (e: 'add-step', payload: { taskId: string; title: string }): void
}>()

const newStepTitle = ref('')

function submitStep(taskId: string): void {
  if (!newStepTitle.value.trim()) return
  emit('add-step', { taskId, title: newStepTitle.value.trim() })
  newStepTitle.value = ''
}
</script>

<template>
  <div class="micro-steps-container">
    <ul v-if="steps && steps.length > 0" class="steps-list">
      <li
        v-for="step in steps"
        :key="step.id"
        class="step-row"
        :class="{ done: step.completed }"
      >
        <button
          type="button"
          class="step-check"
          :class="{ checked: step.completed }"
          @click="emit('toggle-step', { taskId, stepId: step.id })"
          aria-label="Toggle micro-step"
        >
          <Check v-if="step.completed" :size="10" />
        </button>
        <span class="step-text">{{ step.title }}</span>
        <span v-if="step.estimatedMinutes" class="step-mins">{{ step.estimatedMinutes }}m</span>
      </li>
    </ul>

    <form class="add-step-form" @submit.prevent="submitStep(taskId)">
      <input
        v-model="newStepTitle"
        type="text"
        class="step-input"
        placeholder="Add micro-step..."
      />
      <button type="submit" class="btn-add-step" aria-label="Add micro-step">
        <Plus :size="12" />
      </button>
    </form>
  </div>
</template>

<style scoped>
.micro-steps-container {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.steps-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.step-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #cbd5e1;
}
.step-row.done .step-text { text-decoration: line-through; color: #64748b; }
.step-check {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.step-check.checked { background: #10b981; border-color: #10b981; }
.step-text { flex: 1; }
.step-mins { font-size: 10px; color: #64748b; font-family: monospace; }
.add-step-form { display: flex; gap: 6px; }
.step-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 4px 8px;
  color: #fff;
  font-size: 11px;
}
.btn-add-step {
  background: rgba(255, 87, 34, 0.15);
  border: 1px solid rgba(255, 87, 34, 0.35);
  border-radius: 4px;
  color: #ff7a45;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
