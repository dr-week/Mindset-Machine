<script setup lang="ts">
import type { Component } from 'vue'
import GoalCardItem from '@/components/goals/GoalCardItem.vue'
import type { Goal } from '@/types/mindset'

defineProps<{
  title: string
  icon: Component
  iconClass?: string
  goals: Goal[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <section class="horizon-panel">
    <div class="horizon-head">
      <div class="head-title">
        <component :is="icon" :size="15" :class="iconClass" />
        <span>{{ title }}</span>
      </div>
      <span class="count-tag">{{ goals.filter(g => g.completed).length }}/{{ goals.length }}</span>
    </div>

    <div class="goals-list">
      <div v-if="goals.length === 0" class="empty-panel">
        <span>No directives locked in yet.</span>
      </div>
      <GoalCardItem
        v-for="goal in goals"
        :key="goal.id"
        :goal="goal"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.horizon-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(14, 20, 27, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm, 6px);
  padding: 1.15rem;
}
.horizon-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.head-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}
.count-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-dim, #71717a);
}
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.empty-panel {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-dim, #71717a);
}
</style>
