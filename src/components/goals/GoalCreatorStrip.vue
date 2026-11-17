<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trophy, Compass, Calendar } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'add-goal', payload: { text: string; category: 'monumental' | 'quarterly' | 'monthly'; targetDate?: string }): void
}>()

const newGoalText = ref('')
const newGoalCategory = ref<'monumental' | 'quarterly' | 'monthly'>('monumental')
const newGoalDate = ref('')

function submit(): void {
  const text = newGoalText.value.trim()
  if (!text) return
  emit('add-goal', {
    text,
    category: newGoalCategory.value,
    targetDate: newGoalDate.value || undefined,
  })
  newGoalText.value = ''
  newGoalDate.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="goal-creator-strip">
    <div class="input-line">
      <input
        v-model="newGoalText"
        type="text"
        placeholder="Declare monumental vision or milestone..."
        class="goal-input"
        required
      />
    </div>

    <div class="controls-line">
      <div class="category-pills">
        <button
          type="button"
          class="cat-btn"
          :class="{ active: newGoalCategory === 'monumental' }"
          @click="newGoalCategory = 'monumental'"
        >
          <Trophy :size="13" /> Monumental
        </button>
        <button
          type="button"
          class="cat-btn"
          :class="{ active: newGoalCategory === 'quarterly' }"
          @click="newGoalCategory = 'quarterly'"
        >
          <Compass :size="13" /> Quarterly
        </button>
        <button
          type="button"
          class="cat-btn"
          :class="{ active: newGoalCategory === 'monthly' }"
          @click="newGoalCategory = 'monthly'"
        >
          <Calendar :size="13" /> Monthly
        </button>
      </div>

      <input v-model="newGoalDate" type="date" class="date-input" title="Target Deadline" />

      <button type="submit" class="btn-lock">
        <Plus :size="16" />
        <span>Lock Directive</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.goal-creator-strip {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(14, 20, 27, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
}
.input-line { display: flex; }
.goal-input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  color: #fff;
  outline: none;
}
.controls-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
.category-pills { display: flex; gap: 0.35rem; }
.cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #71717a;
  cursor: pointer;
  &.active { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255, 255, 255, 0.2); }
}
.date-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  color: #fff;
  outline: none;
}
.btn-lock {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  background: #ff5722;
  border: none;
  color: #fff;
  cursor: pointer;
}
</style>
