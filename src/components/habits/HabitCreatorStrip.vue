<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Sun, Sunset, Moon } from 'lucide-vue-next'

const emit = defineEmits<{
  (
    e: 'add-habit',
    payload: {
      title: string
      period: 'morning' | 'afternoon' | 'evening'
      emoji: string
      targetDays: number
    },
  ): void
}>()

const newTitle = ref('')
const newPeriod = ref<'morning' | 'afternoon' | 'evening'>('morning')
const newEmoji = ref('⚡')
const newTargetDays = ref(7)

function submit(): void {
  const title = newTitle.value.trim()
  if (!title) return
  emit('add-habit', {
    title,
    period: newPeriod.value,
    emoji: newEmoji.value || '⚡',
    targetDays: newTargetDays.value,
  })
  newTitle.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="quick-add-strip">
    <div class="input-wrap">
      <input v-model="newEmoji" type="text" class="emoji-input" maxlength="2" placeholder="⚡" title="Habit Icon" />
      <input v-model="newTitle" type="text" class="title-input" placeholder="New daily non-negotiable directive..." required />
    </div>

    <div class="control-wrap">
      <div class="period-select-pills">
        <button type="button" class="pill-btn" :class="{ active: newPeriod === 'morning' }" @click="newPeriod = 'morning'">
          <Sun :size="13" /> AM
        </button>
        <button type="button" class="pill-btn" :class="{ active: newPeriod === 'afternoon' }" @click="newPeriod = 'afternoon'">
          <Sunset :size="13" /> Mid
        </button>
        <button type="button" class="pill-btn" :class="{ active: newPeriod === 'evening' }" @click="newPeriod = 'evening'">
          <Moon :size="13" /> PM
        </button>
      </div>

      <button type="submit" class="submit-btn">
        <Plus :size="16" />
        <span>Commit</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.quick-add-strip {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(14, 20, 27, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
}
.input-wrap { display: flex; gap: 0.5rem; }
.emoji-input {
  width: 36px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  color: #fff;
  outline: none;
}
.title-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  color: #fff;
  outline: none;
}
.control-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
.period-select-pills { display: flex; gap: 0.35rem; }
.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #71717a;
  cursor: pointer;
  &.active { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255, 255, 255, 0.2); }
}
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #ff5722;
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
</style>
