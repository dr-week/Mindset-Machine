<script setup lang="ts">
import type { Component } from 'vue'
import HabitCardItem from '@/components/habits/HabitCardItem.vue'
import type { Habit } from '@/types/mindset'

defineProps<{
  title: string
  icon: Component
  iconClass?: string
  habits: Habit[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <section v-if="habits.length > 0" class="period-section">
    <div class="section-title">
      <component :is="icon" :size="15" :class="iconClass" />
      <span>{{ title }}</span>
      <span class="count-tag">{{ habits.filter(h => h.completedToday).length }}/{{ habits.length }}</span>
    </div>
    <div class="habits-grid">
      <HabitCardItem
        v-for="h in habits"
        :key="h.id"
        :habit="h"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.period-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}
.count-tag {
  font-size: 0.75rem;
  color: var(--color-text-dim, #71717a);
  margin-left: auto;
}
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}
</style>
