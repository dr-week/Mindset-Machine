<script setup lang="ts">
import { ref } from 'vue'
import { Target, Plus } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import VisionGoalRow from './vision/VisionGoalRow.vue'
import VisionProgressStrip from './vision/VisionProgressStrip.vue'

const tasksStore = useTasksStore()
const newGoalInput = ref('')

function handleAddGoal(): void {
  const text = newGoalInput.value.trim()
  if (!text) return
  tasksStore.addGoal(text)
  newGoalInput.value = ''
}
</script>

<template>
  <section class="box-goals zuari-card">
    <div class="box-header">
      <div class="title-with-icon">
        <Target :size="16" class="text-ember" />
        <span class="box-title">Vision Directives</span>
      </div>
      <span class="box-counter">{{ tasksStore.goalCompletionRate }}% achieved</span>
    </div>

    <form @submit.prevent="handleAddGoal" class="input-strip">
      <input
        v-model="newGoalInput"
        type="text"
        placeholder="Lock in high-level goal..."
        class="strip-input"
      />
      <button type="submit" class="btn-strip-submit">
        <Plus :size="16" />
      </button>
    </form>

    <div class="task-scroll-container">
      <VisionGoalRow
        v-for="goal in tasksStore.goals"
        :key="goal.id"
        :goal="goal"
        @toggle="tasksStore.toggleGoal"
        @delete="tasksStore.deleteGoal"
      />
    </div>

    <VisionProgressStrip
      :rate="tasksStore.goalCompletionRate"
      :completed-count="tasksStore.completedGoals.length"
      :total-count="tasksStore.goals.length"
    />
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-goals {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.15rem;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 7px;
    .box-title { font-size: 13px; font-weight: 700; color: #ffffff; }
  }
  .box-counter { font-family: $font-mono; font-size: 10px; color: $color-text-dim; }
}

.input-strip {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: $radius-md;
  padding: 4px 6px;
  gap: 6px;

  .strip-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 13px;
    padding: 0.35rem 0.5rem;
    outline: none;
    &::placeholder { color: $color-text-dim; }
  }

  .btn-strip-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 87, 34, 0.15);
    border: 1px solid rgba(255, 87, 34, 0.3);
    border-radius: $radius-xs;
    color: #ff7a45;
    cursor: pointer;
    &:hover { background: rgba(255, 87, 34, 0.25); color: #fff; }
  }
}

.task-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
}

.text-ember { color: #f59e0b; }
</style>
