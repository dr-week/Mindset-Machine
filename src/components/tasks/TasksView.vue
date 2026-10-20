<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CheckSquare,
  Plus,
  Flame,
  Zap,
  Coffee,
  Waves,
  Trash2,
  Check,
  Eraser,
  Star,
} from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import type { EnergyLevel } from '@/types/mindset'

const tasksStore = useTasksStore()

const newTitle = ref('')
const newPriority = ref<'low' | 'medium' | 'high'>('high')
const newEnergy = ref<EnergyLevel>('deep')
const activeFilter = ref<'all' | 'high' | 'deep' | 'flow' | 'quick' | 'completed'>('all')

function handleAddTask(): void {
  const text = newTitle.value.trim()
  if (!text) return
  tasksStore.addTask(text, newPriority.value, newEnergy.value)
  newTitle.value = ''
}

const filteredList = computed(() => {
  const all = tasksStore.tasks
  if (activeFilter.value === 'high') {
    return all.filter((t) => t.priority === 'high' && !t.completed)
  }
  if (activeFilter.value === 'deep') {
    return all.filter((t) => t.energy === 'deep' && !t.completed)
  }
  if (activeFilter.value === 'flow') {
    return all.filter((t) => t.energy === 'flow' && !t.completed)
  }
  if (activeFilter.value === 'quick') {
    return all.filter((t) => t.energy === 'quick' && !t.completed)
  }
  if (activeFilter.value === 'completed') {
    return all.filter((t) => t.completed)
  }
  return all
})

const highCount = computed(() => tasksStore.tasks.filter((t) => t.priority === 'high' && !t.completed).length)
const deepCount = computed(() => tasksStore.tasks.filter((t) => t.energy === 'deep' && !t.completed).length)
const uncompletedCount = computed(() => tasksStore.uncompletedTasks.length)
const completedCount = computed(() => tasksStore.completedTasks.length)
</script>

<template>
  <div class="tasks-view zuari-card">
    <!-- Header -->
    <div class="tasks-header">
      <div class="header-left">
        <div class="glyph-pill">
          <CheckSquare :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Autonomous Execution Stream</h2>
          <p class="view-subtitle">High-leverage tasks categorized by priority & neuro-cognitive energy load.</p>
        </div>
      </div>

      <div class="header-stats">
        <button
          v-if="completedCount > 0"
          @click="tasksStore.sweepCompletedTasks()"
          class="btn-sweep"
          title="Sweep away completed tasks"
        >
          <Eraser :size="13" />
          <span>Sweep ({{ completedCount }})</span>
        </button>
        <span class="stat-pill">{{ uncompletedCount }} Active Queue</span>
      </div>
    </div>

    <!-- Quick Creator Bar -->
    <form @submit.prevent="handleAddTask" class="task-creator-strip">
      <input
        v-model="newTitle"
        type="text"
        placeholder="Declare high-impact action directive..."
        class="task-input"
        required
      />

      <div class="creator-options">
        <!-- Energy Selector -->
        <div class="energy-options">
          <button
            type="button"
            class="opt-btn"
            :class="{ active: newEnergy === 'deep' }"
            @click="newEnergy = 'deep'"
            title="Deep Work (High Cognitive Load)"
          >
            <Zap :size="13" /> Deep
          </button>
          <button
            type="button"
            class="opt-btn"
            :class="{ active: newEnergy === 'flow' }"
            @click="newEnergy = 'flow'"
            title="Flow State"
          >
            <Waves :size="13" /> Flow
          </button>
          <button
            type="button"
            class="opt-btn"
            :class="{ active: newEnergy === 'quick' }"
            @click="newEnergy = 'quick'"
            title="Quick Execution"
          >
            <Coffee :size="13" /> Quick
          </button>
        </div>

        <!-- Priority Toggle -->
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

    <!-- Filter Pills Strip -->
    <div class="filter-strip">
      <button
        class="f-pill"
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        All ({{ tasksStore.tasks.length }})
      </button>
      <button
        class="f-pill flame"
        :class="{ active: activeFilter === 'high' }"
        @click="activeFilter = 'high'"
      >
        <Flame :size="12" /> Critical ({{ highCount }})
      </button>
      <button
        class="f-pill deep"
        :class="{ active: activeFilter === 'deep' }"
        @click="activeFilter = 'deep'"
      >
        <Zap :size="12" /> Deep Focus ({{ deepCount }})
      </button>
      <button
        class="f-pill flow"
        :class="{ active: activeFilter === 'flow' }"
        @click="activeFilter = 'flow'"
      >
        <Waves :size="12" /> Flow
      </button>
      <button
        class="f-pill quick"
        :class="{ active: activeFilter === 'quick' }"
        @click="activeFilter = 'quick'"
      >
        <Coffee :size="12" /> Quick
      </button>
      <button
        class="f-pill done"
        :class="{ active: activeFilter === 'completed' }"
        @click="activeFilter = 'completed'"
      >
        <Check :size="12" /> Done ({{ completedCount }})
      </button>
    </div>

    <!-- Task Stream Grid -->
    <div class="task-stream">
      <div v-if="filteredList.length === 0" class="empty-stream">
        <p>No actions in this stream filter. Add one above or select another view.</p>
      </div>

      <div
        v-for="task in filteredList"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed, critical: task.priority === 'high' }"
      >
        <button
          @click="tasksStore.toggleTask(task.id)"
          class="task-checkbox"
          :class="{ checked: task.completed }"
          type="button"
          aria-label="Toggle task"
        >
          <Check v-if="task.completed" :size="13" />
        </button>

        <div class="task-main">
          <div class="task-title-row">
            <span class="task-title">{{ task.title }}</span>
            <div class="badge-group">
              <span v-if="task.isTopThree" class="badge-star" title="Rule of 3 Focus">
                <Star :size="10" /> Top 3
              </span>
              <span v-if="task.priority === 'high'" class="badge-flame">
                <Flame :size="10" /> CRITICAL
              </span>
              <span v-if="task.energy" class="badge-energy" :class="task.energy">
                {{ task.energy === 'deep' ? '⚡ DEEP' : task.energy === 'flow' ? '🌊 FLOW' : '☕ QUICK' }}
              </span>
            </div>
          </div>
          <span class="task-time-meta">{{ task.time || 'Today' }}</span>
        </div>

        <button
          @click="tasksStore.deleteTask(task.id)"
          class="task-delete-btn"
          title="Remove task"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--surface, #12141a);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.glyph-pill {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-high, #fff);
  letter-spacing: -0.01em;
}

.view-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted, #8e95a5);
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sweep {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  color: var(--text-muted, #8e95a5);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sweep:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.stat-pill {
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
}

/* Creator Strip */
.task-creator-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  padding: 0.75rem;
  border-radius: 12px;
}

.task-input {
  flex: 1 1 280px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.55rem 0.85rem;
  color: #fff;
  font-size: 0.88rem;
}

.creator-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.energy-options {
  display: flex;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 2px;
}

.opt-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-muted, #8e95a5);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.opt-btn.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.prio-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted, #8e95a5);
  cursor: pointer;
  transition: all 0.2s;
}

.prio-toggle-btn.high {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
  font-weight: 700;
}

.btn-commit {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--ember, #ef4444);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

/* Filter Strip */
.filter-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 2px;
}

.f-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-muted, #8e95a5);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.f-pill.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
}

.f-pill.flame.active { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.f-pill.deep.active { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.f-pill.flow.active { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
.f-pill.done.active { background: rgba(16, 185, 129, 0.15); color: #10b981; }

/* Stream Grid */
.task-stream {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.empty-stream {
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--text-muted, #8e95a5);
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.015);
  border-radius: 12px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.task-card:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.1);
}

.task-card.critical {
  border-left: 3px solid #ef4444;
}

.task-card.completed {
  opacity: 0.65;
}

.task-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.task-checkbox.checked {
  background: #10b981;
  border-color: #10b981;
}

.task-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
}

.task-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.task-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-high, #fff);
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--text-muted, #8e95a5);
}

.badge-group {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.badge-flame {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 1px 5px;
  border-radius: 4px;
}

.badge-star {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 1px 5px;
  border-radius: 4px;
}

.badge-energy {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
}

.badge-energy.deep { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.badge-energy.flow { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
.badge-energy.quick { background: rgba(168, 85, 247, 0.1); color: #c084fc; }

.task-time-meta {
  font-size: 0.72rem;
  color: var(--text-muted, #8e95a5);
}

.task-delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #8e95a5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.4;
  transition: all 0.2s;
}

.task-delete-btn:hover {
  opacity: 1;
  color: #ef4444;
}
</style>
