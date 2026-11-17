<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckSquare, Eraser } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import ExecutionInputStrip from '@/components/dashboard/ExecutionInputStrip.vue'
import ExecutionPillsRow from './execution-queue/ExecutionPillsRow.vue'
import ExecutionTaskList from './execution-queue/ExecutionTaskList.vue'

const tasksStore = useTasksStore()
const inputStripRef = ref<InstanceType<typeof ExecutionInputStrip> | null>(null)

function handleAddTask(payload: { title: string; priority: 'low' | 'medium' | 'high'; energy: 'deep' | 'flow' | 'quick' }): void {
  tasksStore.addTask(payload.title, payload.priority, payload.energy, 'Today')
}

const highPriorityTasks = computed(() => tasksStore.tasks.filter((t) => t.priority === 'high'))
const standardTasks = computed(() => tasksStore.tasks.filter((t) => t.priority !== 'high'))
const displayTasks = computed(() => (tasksStore.taskFilter === 'all' ? null : tasksStore.filteredTasks))

defineExpose({
  focusInput: () => inputStripRef.value?.focusInput(),
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
          type="button"
        >
          <Eraser :size="12" />
          <span>Clear Done ({{ tasksStore.completedTasks.length }})</span>
        </button>
        <span class="box-counter">{{ tasksStore.uncompletedTasks.length }} active</span>
      </div>
    </div>

    <ExecutionInputStrip ref="inputStripRef" @add-task="handleAddTask" />
    <ExecutionPillsRow :active-filter="tasksStore.taskFilter" @set-filter="tasksStore.setFilter" />

    <ExecutionTaskList
      :display-tasks="displayTasks"
      :high-priority-tasks="highPriorityTasks"
      :standard-tasks="standardTasks"
      :active-filter="tasksStore.taskFilter"
      @toggle="tasksStore.toggleTask($event)"
      @delete="tasksStore.deleteTask($event)"
    />
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-execution {
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
  .title-with-icon { display: flex; align-items: center; gap: 7px; .box-title { font-size: 13px; font-weight: 700; color: #fff; } }
  .header-right-actions { display: flex; align-items: center; gap: 8px; }
  .box-counter { font-family: $font-mono; font-size: 10px; color: $color-text-dim; }
}

.btn-sweep-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius-xs;
  color: $color-text-dim;
  font-size: 10px;
  padding: 2px 6px;
  cursor: pointer;
  &:hover { color: #fff; border-color: rgba(255, 255, 255, 0.2); }
}

.text-ember { color: #f59e0b; }
</style>
