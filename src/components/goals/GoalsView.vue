<script setup lang="ts">
import { computed } from 'vue'
import { Target, Trophy, Compass, Calendar } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import GoalCreatorStrip from '@/components/goals/GoalCreatorStrip.vue'
import GoalHorizonPanel from './GoalHorizonPanel.vue'

const tasksStore = useTasksStore()

const monumentalGoals = computed(() =>
  tasksStore.goals.filter((g) => (g.category || 'monumental') === 'monumental'),
)
const quarterlyGoals = computed(() =>
  tasksStore.goals.filter((g) => g.category === 'quarterly'),
)
const monthlyGoals = computed(() =>
  tasksStore.goals.filter((g) => g.category === 'monthly'),
)

function handleAddGoal(payload: { text: string; category: 'monumental' | 'quarterly' | 'monthly'; targetDate?: string }): void {
  tasksStore.addGoal(payload.text, payload.category, payload.targetDate)
}
</script>

<template>
  <div class="goals-view zuari-card">
    <div class="goals-header">
      <div class="header-left">
        <div class="glyph-pill">
          <Target :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Vision Architect & Monumental Horizons</h2>
          <p class="view-subtitle">High-level existential directives, quarterly keystones & monumental milestones.</p>
        </div>
      </div>

      <div class="header-metrics">
        <div class="metric-badge">
          <span class="m-val text-ember">{{ tasksStore.goalCompletionRate }}%</span>
          <span class="m-lbl">Velocity Achieved</span>
        </div>
        <div class="metric-badge">
          <span class="m-val">{{ tasksStore.completedGoals.length }}/{{ tasksStore.goals.length }}</span>
          <span class="m-lbl">Directives Landed</span>
        </div>
      </div>
    </div>

    <GoalCreatorStrip @add-goal="handleAddGoal" />

    <div class="horizons-grid">
      <GoalHorizonPanel
        title="Monumental North Stars"
        :icon="Trophy"
        icon-class="text-ember"
        :goals="monumentalGoals"
        @toggle="tasksStore.toggleGoal"
        @delete="tasksStore.deleteGoal"
      />

      <GoalHorizonPanel
        title="Quarterly Keystones"
        :icon="Compass"
        icon-class="text-emerald"
        :goals="quarterlyGoals"
        @toggle="tasksStore.toggleGoal"
        @delete="tasksStore.deleteGoal"
      />

      <GoalHorizonPanel
        title="Monthly Tactical Horizons"
        :icon="Calendar"
        icon-class="text-blue"
        :goals="monthlyGoals"
        @toggle="tasksStore.toggleGoal"
        @delete="tasksStore.deleteGoal"
      />
    </div>
  </div>
</template>

<style scoped>
.goals-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg, 20px);
}
@media (max-width: 680px) {
  .goals-view { padding: 1rem 0.85rem; }
}
.goals-header {
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 87, 34, 0.1);
  border: 1px solid rgba(255, 87, 34, 0.3);
  border-radius: var(--radius-sm, 6px);
}
.view-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.view-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-dim, #71717a);
  margin: 0.15rem 0 0;
}
.header-metrics {
  display: flex;
  gap: 0.75rem;
}
.metric-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xs, 4px);
}
.m-val { font-size: 0.95rem; font-weight: 700; color: #fff; }
.m-lbl { font-size: 0.65rem; color: var(--color-text-dim, #71717a); text-transform: uppercase; }
.horizons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.25rem; }
.text-ember { color: #f59e0b; }
.text-emerald { color: #10b981; }
.text-blue { color: #3b82f6; }
</style>
