<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckSquare, Eraser } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import type { EnergyLevel } from '@/types/mindset'
import TaskCreatorStrip from '@/components/tasks/TaskCreatorStrip.vue'
import TaskFilterPills from '@/components/tasks/TaskFilterPills.vue'
import TaskItemCard from '@/components/tasks/TaskItemCard.vue'

const tasksStore = useTasksStore()
const activeFilter = ref<'all' | 'high' | 'deep' | 'flow' | 'quick' | 'completed'>('all')

function handleAddTask(payload: { title: string; priority: 'low' | 'medium' | 'high'; energy: EnergyLevel }): void {
  tasksStore.addTask(payload.title, payload.priority, payload.energy)
}

const filteredList = computed(() => {
  const all = tasksStore.tasks
  if (activeFilter.value === 'high') return all.filter((t) => t.priority === 'high' && !t.completed)
  if (activeFilter.value === 'deep') return all.filter((t) => t.energy === 'deep' && !t.completed)
  if (activeFilter.value === 'flow') return all.filter((t) => t.energy === 'flow' && !t.completed)
  if (activeFilter.value === 'quick') return all.filter((t) => t.energy === 'quick' && !t.completed)
  if (activeFilter.value === 'completed') return all.filter((t) => t.completed)
  return all
})

const highCount = computed(() => tasksStore.tasks.filter((t) => t.priority === 'high' && !t.completed).length)
const deepCount = computed(() => tasksStore.tasks.filter((t) => t.energy === 'deep' && !t.completed).length)
const uncompletedCount = computed(() => tasksStore.uncompletedTasks.length)
const completedCount = computed(() => tasksStore.completedTasks.length)
</script>

<template>
  <div class="tasks-view zuari-card">
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
          type="button"
        >
          <Eraser :size="13" />
          <span>Sweep ({{ completedCount }})</span>
        </button>
        <span class="stat-pill">{{ uncompletedCount }} Active Queue</span>
      </div>
    </div>

    <TaskCreatorStrip @add-task="handleAddTask" />

    <TaskFilterPills
      :active-filter="activeFilter"
      :total-count="tasksStore.tasks.length"
      :high-count="highCount"
      :deep-count="deepCount"
      :completed-count="completedCount"
      @update:filter="activeFilter = $event"
    />

    <div class="task-stream">
      <div v-if="filteredList.length === 0" class="empty-stream">
        <p>No actions in this stream filter. Add one above or select another view.</p>
      </div>

      <TaskItemCard
        v-for="task in filteredList"
        :key="task.id"
        :task="task"
        @toggle="tasksStore.toggleTask($event)"
        @delete="tasksStore.deleteTask($event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tasks-view { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.25rem 1.5rem; }
@media (max-width: 680px) { .tasks-view { padding: 1rem 0.85rem; } }
.tasks-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.header-left { display: flex; align-items: center; gap: 0.85rem; }
.glyph-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 87, 34, 0.1);
  border: 1px solid rgba(255, 87, 34, 0.3);
  border-radius: var(--radius-sm, 6px);
}
.view-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin: 0; }
.view-subtitle { font-size: 0.8rem; color: var(--color-text-dim, #71717a); margin: 0.15rem 0 0; }
.header-stats { display: flex; align-items: center; gap: 0.75rem; }
.btn-sweep {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xs, 4px);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
}
.stat-pill { font-size: 0.75rem; font-weight: 600; color: #71717a; }
.task-stream { display: flex; flex-direction: column; gap: 0.65rem; }
.empty-stream { padding: 2rem; text-align: center; font-size: 0.85rem; color: #71717a; }
.text-ember { color: #f59e0b; }
</style>
