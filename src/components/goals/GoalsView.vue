<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Target,
  Plus,
  Check,
  Trash2,
  Trophy,
  Compass,
  Calendar,
} from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const newGoalText = ref('')
const newGoalCategory = ref<'monumental' | 'quarterly' | 'monthly'>('monumental')
const newGoalDate = ref('')

function handleAddGoal(): void {
  const text = newGoalText.value.trim()
  if (!text) return
  tasksStore.addGoal(text, newGoalCategory.value, newGoalDate.value || undefined)
  newGoalText.value = ''
  newGoalDate.value = ''
}

const monumentalGoals = computed(() =>
  tasksStore.goals.filter((g) => (g.category || 'monumental') === 'monumental'),
)
const quarterlyGoals = computed(() =>
  tasksStore.goals.filter((g) => g.category === 'quarterly'),
)
const monthlyGoals = computed(() =>
  tasksStore.goals.filter((g) => g.category === 'monthly'),
)

const completedGoals = computed(() => tasksStore.completedGoals)
const achievementRate = computed(() => tasksStore.goalCompletionRate)
</script>

<template>
  <div class="goals-view zuari-card">
    <!-- Header -->
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
          <span class="m-val text-ember">{{ achievementRate }}%</span>
          <span class="m-lbl">Velocity Achieved</span>
        </div>
        <div class="metric-badge">
          <span class="m-val">{{ completedGoals.length }}/{{ tasksStore.goals.length }}</span>
          <span class="m-lbl">Directives Landed</span>
        </div>
      </div>
    </div>

    <!-- Quick Declaration Form -->
    <form @submit.prevent="handleAddGoal" class="goal-creator-strip">
      <div class="input-line">
        <input
          v-model="newGoalText"
          type="text"
          placeholder="Declare monumental vision or milestone..."
          class="goal-input"
          required
        />
      </div>

      <div class="controls-line">
        <div class="category-pills">
          <button
            type="button"
            class="cat-btn"
            :class="{ active: newGoalCategory === 'monumental' }"
            @click="newGoalCategory = 'monumental'"
          >
            <Trophy :size="13" /> Monumental
          </button>
          <button
            type="button"
            class="cat-btn"
            :class="{ active: newGoalCategory === 'quarterly' }"
            @click="newGoalCategory = 'quarterly'"
          >
            <Compass :size="13" /> Quarterly
          </button>
          <button
            type="button"
            class="cat-btn"
            :class="{ active: newGoalCategory === 'monthly' }"
            @click="newGoalCategory = 'monthly'"
          >
            <Calendar :size="13" /> Monthly
          </button>
        </div>

        <input
          v-model="newGoalDate"
          type="date"
          class="date-input"
          title="Target Deadline"
        />

        <button type="submit" class="btn-lock">
          <Plus :size="16" />
          <span>Lock Directive</span>
        </button>
      </div>
    </form>

    <!-- Vision Horizons Sections -->
    <div class="horizons-grid">
      <!-- Monumental Section -->
      <section class="horizon-panel">
        <div class="horizon-head">
          <div class="head-title">
            <Trophy :size="15" class="text-ember" />
            <span>Monumental North Stars</span>
          </div>
          <span class="count-tag">{{ monumentalGoals.filter(g => g.completed).length }}/{{ monumentalGoals.length }}</span>
        </div>

        <div class="goals-list">
          <div v-if="monumentalGoals.length === 0" class="empty-panel">
            <span>No monumental directives locked in yet.</span>
          </div>
          <div
            v-for="goal in monumentalGoals"
            :key="goal.id"
            class="goal-card"
            :class="{ completed: goal.completed }"
          >
            <button
              @click="tasksStore.toggleGoal(goal.id)"
              class="goal-checkbox"
              :class="{ checked: goal.completed }"
              type="button"
              aria-label="Toggle goal completion"
            >
              <Check v-if="goal.completed" :size="13" />
            </button>
            <div class="goal-info">
              <span class="goal-text">{{ goal.text }}</span>
              <span v-if="goal.targetDate" class="goal-date">Target: {{ goal.targetDate }}</span>
            </div>
            <button
              @click="tasksStore.deleteGoal(goal.id)"
              class="btn-delete-goal"
              title="Remove directive"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </section>

      <!-- Quarterly Keystones -->
      <section class="horizon-panel">
        <div class="horizon-head">
          <div class="head-title">
            <Compass :size="15" class="text-emerald" />
            <span>Quarterly Keystones</span>
          </div>
          <span class="count-tag">{{ quarterlyGoals.filter(g => g.completed).length }}/{{ quarterlyGoals.length }}</span>
        </div>

        <div class="goals-list">
          <div v-if="quarterlyGoals.length === 0" class="empty-panel">
            <span>No quarterly milestones defined.</span>
          </div>
          <div
            v-for="goal in quarterlyGoals"
            :key="goal.id"
            class="goal-card"
            :class="{ completed: goal.completed }"
          >
            <button
              @click="tasksStore.toggleGoal(goal.id)"
              class="goal-checkbox"
              :class="{ checked: goal.completed }"
              type="button"
              aria-label="Toggle goal completion"
            >
              <Check v-if="goal.completed" :size="13" />
            </button>
            <div class="goal-info">
              <span class="goal-text">{{ goal.text }}</span>
              <span v-if="goal.targetDate" class="goal-date">Target: {{ goal.targetDate }}</span>
            </div>
            <button
              @click="tasksStore.deleteGoal(goal.id)"
              class="btn-delete-goal"
              title="Remove directive"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </section>

      <!-- Monthly Horizons -->
      <section class="horizon-panel">
        <div class="horizon-head">
          <div class="head-title">
            <Calendar :size="15" class="text-blue" />
            <span>Monthly Tactical Horizons</span>
          </div>
          <span class="count-tag">{{ monthlyGoals.filter(g => g.completed).length }}/{{ monthlyGoals.length }}</span>
        </div>

        <div class="goals-list">
          <div v-if="monthlyGoals.length === 0" class="empty-panel">
            <span>No monthly objectives committed.</span>
          </div>
          <div
            v-for="goal in monthlyGoals"
            :key="goal.id"
            class="goal-card"
            :class="{ completed: goal.completed }"
          >
            <button
              @click="tasksStore.toggleGoal(goal.id)"
              class="goal-checkbox"
              :class="{ checked: goal.completed }"
              type="button"
              aria-label="Toggle goal completion"
            >
              <Check v-if="goal.completed" :size="13" />
            </button>
            <div class="goal-info">
              <span class="goal-text">{{ goal.text }}</span>
              <span v-if="goal.targetDate" class="goal-date">Target: {{ goal.targetDate }}</span>
            </div>
            <button
              @click="tasksStore.deleteGoal(goal.id)"
              class="btn-delete-goal"
              title="Remove directive"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.goals-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface, #12141a);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
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

.header-metrics {
  display: flex;
  gap: 0.75rem;
}

.metric-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.m-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.m-lbl {
  font-size: 0.7rem;
  color: var(--text-muted, #8e95a5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Creator Strip */
.goal-creator-strip {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  padding: 0.85rem;
  border-radius: 12px;
}

.goal-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  color: #fff;
  font-size: 0.9rem;
}

.controls-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.category-pills {
  display: flex;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 2px;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-muted, #8e95a5);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-btn.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.date-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  color: #fff;
  font-size: 0.78rem;
}

.btn-lock {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--ember, #ef4444);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

/* Horizons Panels */
.horizons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.horizon-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
}

.horizon-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-high, #fff);
  text-transform: uppercase;
}

.count-tag {
  font-size: 0.72rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: var(--text-muted, #8e95a5);
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.empty-panel {
  padding: 1.5rem 0.5rem;
  text-align: center;
  color: var(--text-muted, #8e95a5);
  font-size: 0.78rem;
}

.goal-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.goal-card:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.1);
}

.goal-card.completed {
  opacity: 0.65;
}

.goal-checkbox {
  width: 20px;
  height: 20px;
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

.goal-checkbox.checked {
  background: #10b981;
  border-color: #10b981;
}

.goal-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.goal-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-high, #fff);
}

.goal-card.completed .goal-text {
  text-decoration: line-through;
  color: var(--text-muted, #8e95a5);
}

.goal-date {
  font-size: 0.7rem;
  color: var(--text-muted, #8e95a5);
  margin-top: 2px;
}

.btn-delete-goal {
  background: transparent;
  border: none;
  color: var(--text-muted, #8e95a5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.btn-delete-goal:hover {
  opacity: 1;
  color: #ef4444;
}
</style>
