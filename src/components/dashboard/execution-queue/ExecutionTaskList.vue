<script setup lang="ts">
import type { Task } from '@/types'
import ExecutionTaskRow from '@/components/dashboard/ExecutionTaskRow.vue'

defineProps<{
  displayTasks: Task[] | null
  highPriorityTasks: Task[]
  standardTasks: Task[]
  activeFilter: string
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="task-scroll-container">
    <div v-if="displayTasks" class="task-cluster">
      <ExecutionTaskRow
        v-for="task in displayTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
      <div v-if="displayTasks.length === 0" class="empty-filter-state">
        <span>No tasks match the {{ activeFilter }} energy filter</span>
      </div>
    </div>

    <template v-else>
      <div v-if="highPriorityTasks.length > 0" class="task-cluster">
        <div class="cluster-title">
          <span class="ember-pip"></span>
          <span>HIGH IMPACT</span>
        </div>
        <ExecutionTaskRow
          v-for="task in highPriorityTasks"
          :key="task.id"
          :task="task"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </div>

      <div class="task-cluster">
        <div class="cluster-title">
          <span class="muted-pip"></span>
          <span>STANDARD FLOW</span>
        </div>
        <ExecutionTaskRow
          v-for="task in standardTasks"
          :key="task.id"
          :task="task"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
}

.task-cluster {
  display: flex;
  flex-direction: column;
  gap: 4px;
  .cluster-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
    font-weight: 700;
    color: $color-text-dim;
    letter-spacing: 0.06em;
    padding-bottom: 2px;
    .ember-pip { width: 5px; height: 5px; border-radius: 50%; background: #ff5722; }
    .muted-pip { width: 5px; height: 5px; border-radius: 50%; background: #71717a; }
  }
}

.empty-filter-state {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: $color-text-dim;
}
</style>
