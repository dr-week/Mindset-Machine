<script setup lang="ts">
import { ref } from 'vue'
import { Target, Plus, Check, X } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

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
  <section class="bento-box box-goals zuari-card">
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
      <div
        v-for="goal in tasksStore.goals"
        :key="goal.id"
        class="task-row goal-row"
        :class="{ completed: goal.completed }"
      >
        <button
          @click="tasksStore.toggleGoal(goal.id)"
          class="check-pill"
          :class="{ checked: goal.completed }"
        >
          <Check v-if="goal.completed" :size="12" />
        </button>
        <span class="task-desc">{{ goal.text }}</span>
        <button
          @click="tasksStore.deleteGoal(goal.id)"
          class="btn-delete-row"
          title="Remove goal"
        >
          <X :size="13" />
        </button>
      </div>
    </div>

    <div class="goal-progress-strip">
      <div class="gp-bar-track">
        <div class="gp-bar-fill" :style="{ width: `${tasksStore.goalCompletionRate}%` }"></div>
      </div>
      <span class="gp-meta">{{ tasksStore.completedGoals.length }} of {{ tasksStore.goals.length }} achieved</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.box-goals {
  grid-column: span 12;
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

    .box-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }

  .box-counter {
    font-family: $font-mono;
    font-size: 10px;
    color: $color-text-dim;
  }
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

    &::placeholder {
      color: $color-text-dim;
    }
  }

  .btn-strip-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $radius-xs;
    background: $color-ember;
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.1s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.task-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
  @include custom-scroll;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0.5rem 0.65rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-sm;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);

    .btn-delete-row {
      opacity: 1;
    }
  }

  &.completed {
    opacity: 0.45;

    .task-desc {
      text-decoration: line-through;
      color: $color-text-dim;
    }
  }

  .check-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: $radius-xs;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: #ffffff;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;

    &.checked {
      background: $color-emerald;
      border-color: $color-emerald;
      color: #000000;
    }
  }

  .task-desc {
    flex: 1;
    font-size: 13px;
    color: #ffffff;
    line-height: 1.4;
  }

  .btn-delete-row {
    background: transparent;
    border: none;
    color: $color-text-dim;
    cursor: pointer;
    opacity: 0;
    padding: 2px;
    transition: opacity 0.15s ease, color 0.15s ease;

    &:hover {
      color: #ef4444;
    }
  }
}

.goal-progress-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 0.25rem;

  .gp-bar-track {
    flex: 1;
    height: 5px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: $radius-pill;
    overflow: hidden;

    .gp-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff7a45, #ff5722);
      box-shadow: 0 0 8px rgba(255, 87, 34, 0.6);
      transition: width 0.4s ease;
    }
  }

  .gp-meta {
    font-family: $font-mono;
    font-size: 9px;
    color: $color-text-dim;
    letter-spacing: 0.04em;
  }
}
</style>
