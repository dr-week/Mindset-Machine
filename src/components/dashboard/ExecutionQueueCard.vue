<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckSquare, Eraser, Flame, Plus, Check, X } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const newTaskInput = ref('')
const taskInputRef = ref<HTMLInputElement | null>(null)
const newTaskPriority = ref<'low' | 'medium' | 'high'>('high')
const newTaskEnergy = ref<'deep' | 'flow' | 'quick'>('deep')

function handleAddTask(): void {
  const rawText = newTaskInput.value.trim()
  if (!rawText) return

  let text = rawText
  let priority = newTaskPriority.value
  let energy = newTaskEnergy.value
  let time = 'Today'

  if (/\s*!high\b/i.test(text)) {
    priority = 'high'
    text = text.replace(/\s*!high\b/i, '').trim()
  } else if (/\s*!low\b/i.test(text)) {
    priority = 'low'
    text = text.replace(/\s*!low\b/i, '').trim()
  }

  if (/\s*!deep\b/i.test(text)) {
    energy = 'deep'
    text = text.replace(/\s*!deep\b/i, '').trim()
  } else if (/\s*!flow\b/i.test(text)) {
    energy = 'flow'
    text = text.replace(/\s*!flow\b/i, '').trim()
  } else if (/\s*!quick\b/i.test(text)) {
    energy = 'quick'
    text = text.replace(/\s*!quick\b/i, '').trim()
  }

  if (/\s*tomorrow\b/i.test(text)) {
    time = 'Tomorrow'
  }

  tasksStore.addTask(text || rawText, priority, energy, time)
  newTaskInput.value = ''
}

const highPriorityTasks = computed(() =>
  tasksStore.tasks.filter((t) => t.priority === 'high'),
)

const standardTasks = computed(() =>
  tasksStore.tasks.filter((t) => t.priority !== 'high'),
)

const displayTasks = computed(() => {
  if (tasksStore.taskFilter === 'all') {
    return null
  }
  return tasksStore.filteredTasks
})

defineExpose({
  focusInput: () => taskInputRef.value?.focus(),
})
</script>

<template>
  <section class="bento-box box-execution zuari-card">
    <div class="box-header">
      <div class="title-with-icon">
        <CheckSquare :size="16" class="text-ember" />
        <span class="box-title">Execution Queue</span>
      </div>
      <div class="header-right-actions">
        <button
          v-if="tasksStore.completedTasks.length > 0"
          @click="tasksStore.sweepCompletedTasks()"
          class="btn-sweep-action"
          title="Clean up completed tasks"
        >
          <Eraser :size="12" />
          <span>Clear Done ({{ tasksStore.completedTasks.length }})</span>
        </button>
        <span class="box-counter">{{ tasksStore.uncompletedTasks.length }} active</span>
      </div>
    </div>

    <!-- Input Bar with Flame Priority Toggle & Energy Level -->
    <form @submit.prevent="handleAddTask" class="input-strip">
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

    <!-- Quick Mental Energy Filter Pills -->
    <div class="filter-pills-row">
      <button
        type="button"
        @click="tasksStore.setFilter('all')"
        class="filter-pill"
        :class="{ active: tasksStore.taskFilter === 'all' }"
      >
        All
      </button>
      <button
        type="button"
        @click="tasksStore.setFilter('deep')"
        class="filter-pill deep"
        :class="{ active: tasksStore.taskFilter === 'deep' }"
      >
        ⚡ Deep
      </button>
      <button
        type="button"
        @click="tasksStore.setFilter('flow')"
        class="filter-pill flow"
        :class="{ active: tasksStore.taskFilter === 'flow' }"
      >
        🌊 Flow
      </button>
      <button
        type="button"
        @click="tasksStore.setFilter('quick')"
        class="filter-pill quick"
        :class="{ active: tasksStore.taskFilter === 'quick' }"
      >
        ☕ Quick
      </button>
    </div>

    <div class="task-scroll-container">
      <!-- Filtered Single Stream (when energy filter is active) -->
      <div v-if="displayTasks" class="task-cluster">
        <div
          v-for="task in displayTasks"
          :key="task.id"
          class="task-row"
          :class="{ completed: task.completed }"
        >
          <button
            @click="tasksStore.toggleTask(task.id)"
            class="check-pill"
            :class="{ checked: task.completed }"
          >
            <Check v-if="task.completed" :size="12" />
          </button>
          <span class="task-desc">{{ task.title }}</span>
          <span v-if="task.energy" class="energy-pip" :class="task.energy">
            {{ task.energy === 'deep' ? '⚡ DEEP' : task.energy === 'flow' ? '🌊 FLOW' : '☕ QUICK' }}
          </span>
          <button
            @click="tasksStore.deleteTask(task.id)"
            class="btn-delete-row"
            title="Remove task"
          >
            <X :size="13" />
          </button>
        </div>
        <div v-if="displayTasks.length === 0" class="empty-filter-state">
          <span>No tasks match the {{ tasksStore.taskFilter }} energy filter</span>
        </div>
      </div>

      <!-- Default All View with High Impact & Standard Clusters -->
      <template v-else>
        <!-- Critical Cluster -->
        <div v-if="highPriorityTasks.length > 0" class="task-cluster">
          <div class="cluster-title">
            <span class="ember-pip"></span>
            <span>HIGH IMPACT</span>
          </div>
          <div
            v-for="task in highPriorityTasks"
            :key="task.id"
            class="task-row"
            :class="{ completed: task.completed }"
          >
            <button
              @click="tasksStore.toggleTask(task.id)"
              class="check-pill"
              :class="{ checked: task.completed }"
            >
              <Check v-if="task.completed" :size="12" />
            </button>
            <span class="task-desc">{{ task.title }}</span>
            <span v-if="task.energy" class="energy-pip" :class="task.energy">
              {{ task.energy === 'deep' ? '⚡ DEEP' : task.energy === 'flow' ? '🌊 FLOW' : '☕ QUICK' }}
            </span>
            <button
              @click="tasksStore.deleteTask(task.id)"
              class="btn-delete-row"
              title="Remove task"
            >
              <X :size="13" />
            </button>
          </div>
        </div>

        <!-- Flow Cluster -->
        <div class="task-cluster">
          <div class="cluster-title">
            <span class="muted-pip"></span>
            <span>STANDARD FLOW</span>
          </div>
          <div
            v-for="task in standardTasks"
            :key="task.id"
            class="task-row"
            :class="{ completed: task.completed }"
          >
            <button
              @click="tasksStore.toggleTask(task.id)"
              class="check-pill"
              :class="{ checked: task.completed }"
            >
              <Check v-if="task.completed" :size="12" />
            </button>
            <span class="task-desc">{{ task.title }}</span>
            <button
              @click="tasksStore.deleteTask(task.id)"
              class="btn-delete-row"
              title="Remove task"
            >
              <X :size="13" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.box-execution {
  grid-column: span 8;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.15rem;

  @media (max-width: 900px) {
    grid-column: span 12;
  }
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

  .header-right-actions {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-sweep-action {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: $radius-pill;
      color: $color-text-dim;
      font-size: 10px;
      padding: 2px 7px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(255, 87, 34, 0.15);
        color: $color-ember;
        border-color: rgba(255, 87, 34, 0.3);
      }
    }

    .box-counter {
      font-family: $font-mono;
      font-size: 10px;
      color: $color-text-dim;
    }
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

  .btn-energy-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $radius-xs;
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    font-size: 12px;
    transition: all 0.15s ease;

    &.deep {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.35);
    }
    &.flow {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.35);
    }
    &.quick {
      background: rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.35);
    }
  }

  .btn-flame-prio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $radius-xs;
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.04);
    color: $color-text-dim;
    cursor: pointer;
    transition: all 0.15s ease;

    &.high {
      background: rgba(255, 87, 34, 0.2);
      border-color: rgba(255, 87, 34, 0.45);
      color: $color-ember;
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

.filter-pills-row {
  display: flex;
  gap: 0.35rem;

  .filter-pill {
    padding: 0.25rem 0.65rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-pill;
    color: $color-text-muted;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }

    &.active {
      background: rgba(255, 87, 34, 0.15);
      border-color: rgba(255, 87, 34, 0.45);
      color: $color-ember;
    }
    &.deep.active {
      background: rgba(239, 68, 68, 0.18);
      border-color: rgba(239, 68, 68, 0.5);
      color: #f87171;
    }
    &.flow.active {
      background: rgba(14, 165, 233, 0.18);
      border-color: rgba(14, 165, 233, 0.5);
      color: #38bdf8;
    }
    &.quick.active {
      background: rgba(34, 197, 94, 0.18);
      border-color: rgba(34, 197, 94, 0.5);
      color: #4ade80;
    }
  }
}

.task-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
  @include custom-scroll;
}

.task-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .cluster-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: $font-mono;
    font-size: 8.5px;
    letter-spacing: 0.1em;
    color: $color-text-dim;

    .ember-pip {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: $color-ember;
      box-shadow: 0 0 6px rgba(255, 87, 34, 0.6);
    }
    .muted-pip {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
  }
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

  .energy-pip {
    font-family: $font-mono;
    font-size: 8px;
    letter-spacing: 0.08em;
    padding: 2px 6px;
    border-radius: $radius-xs;
    font-weight: 700;

    &.deep {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    &.flow {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
    }
    &.quick {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }
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

.empty-filter-state {
  padding: 1.5rem;
  text-align: center;
  font-size: 12px;
  color: $color-text-dim;
}
</style>
