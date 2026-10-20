<script setup lang="ts">
import { ref, computed } from 'vue'
import { Flame, Check, Plus, Trash2, Sun, Sunset, Moon } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const newTitle = ref('')
const newPeriod = ref<'morning' | 'afternoon' | 'evening'>('morning')
const newEmoji = ref('⚡')
const newTargetDays = ref(7)

const morningHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'morning'))
const afternoonHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'afternoon'))
const eveningHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'evening'))

const totalHabits = computed(() => tasksStore.habits.length)
const completedTodayCount = computed(() => tasksStore.habits.filter((h) => h.completedToday).length)
const overallConsistency = computed(() => {
  if (totalHabits.value === 0) return 0
  const sum = tasksStore.habits.reduce((acc, h) => acc + h.score, 0)
  return Math.round(sum / totalHabits.value)
})

function handleAddHabit(): void {
  const title = newTitle.value.trim()
  if (!title) return
  tasksStore.addHabit(title, newPeriod.value, newEmoji.value || '⚡', newTargetDays.value)
  newTitle.value = ''
}
</script>

<template>
  <div class="habits-view zuari-card">
    <!-- Header with Circadian Summary -->
    <div class="habits-header">
      <div class="header-main">
        <div class="header-glyph-pill">
          <Flame :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Circadian Habit Engine</h2>
          <p class="view-subtitle">Loop-style consistency & biological prime non-negotiables.</p>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="metrics-strip">
        <div class="metric-chip">
          <span class="metric-val">{{ completedTodayCount }}/{{ totalHabits }}</span>
          <span class="metric-lbl">Executed Today</span>
        </div>
        <div class="metric-chip">
          <span class="metric-val text-ember">{{ overallConsistency }}%</span>
          <span class="metric-lbl">Overall Consistency</span>
        </div>
      </div>
    </div>

    <!-- Quick Add Strip -->
    <form @submit.prevent="handleAddHabit" class="quick-add-strip">
      <div class="input-wrap">
        <input
          v-model="newEmoji"
          type="text"
          class="emoji-input"
          maxlength="2"
          placeholder="⚡"
          title="Habit Icon"
        />
        <input
          v-model="newTitle"
          type="text"
          class="title-input"
          placeholder="New daily non-negotiable directive..."
          required
        />
      </div>

      <div class="control-wrap">
        <div class="period-select-pills">
          <button
            type="button"
            class="pill-btn"
            :class="{ active: newPeriod === 'morning' }"
            @click="newPeriod = 'morning'"
          >
            <Sun :size="13" /> AM
          </button>
          <button
            type="button"
            class="pill-btn"
            :class="{ active: newPeriod === 'afternoon' }"
            @click="newPeriod = 'afternoon'"
          >
            <Sunset :size="13" /> Mid
          </button>
          <button
            type="button"
            class="pill-btn"
            :class="{ active: newPeriod === 'evening' }"
            @click="newPeriod = 'evening'"
          >
            <Moon :size="13" /> PM
          </button>
        </div>

        <button type="submit" class="submit-btn">
          <Plus :size="16" />
          <span>Commit</span>
        </button>
      </div>
    </form>

    <!-- Circadian Groupings -->
    <div class="circadian-sections">
      <!-- Morning Section -->
      <section v-if="morningHabits.length > 0" class="period-section">
        <div class="section-title">
          <Sun :size="15" class="icon-sun" />
          <span>Morning Cortisol & Alignment</span>
          <span class="count-tag">{{ morningHabits.filter(h => h.completedToday).length }}/{{ morningHabits.length }}</span>
        </div>
        <div class="habits-grid">
          <div
            v-for="h in morningHabits"
            :key="h.id"
            class="habit-card"
            :class="{ completed: h.completedToday }"
            @click="tasksStore.toggleHabit(h.id)"
          >
            <div class="habit-left">
              <button
                class="habit-check-circle"
                :class="{ active: h.completedToday }"
                type="button"
                aria-label="Toggle habit"
              >
                <Check v-if="h.completedToday" :size="14" />
              </button>
              <span class="habit-emoji">{{ h.iconEmoji }}</span>
              <div class="habit-info">
                <span class="habit-name">{{ h.title }}</span>
                <div class="habit-meta">
                  <span class="meta-streak">🔥 {{ h.streak }} streak</span>
                  <span class="meta-score">{{ h.score }}% score</span>
                </div>
              </div>
            </div>

            <!-- Score Progress Bar -->
            <div class="habit-right">
              <div class="mini-score-bar">
                <div class="score-fill" :style="{ width: `${h.score}%` }"></div>
              </div>
              <button
                @click.stop="tasksStore.deleteHabit(h.id)"
                class="delete-btn"
                title="Remove habit"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Afternoon Section -->
      <section v-if="afternoonHabits.length > 0" class="period-section">
        <div class="section-title">
          <Sunset :size="15" class="icon-sunset" />
          <span>Afternoon Sustained Focus & Vitality</span>
          <span class="count-tag">{{ afternoonHabits.filter(h => h.completedToday).length }}/{{ afternoonHabits.length }}</span>
        </div>
        <div class="habits-grid">
          <div
            v-for="h in afternoonHabits"
            :key="h.id"
            class="habit-card"
            :class="{ completed: h.completedToday }"
            @click="tasksStore.toggleHabit(h.id)"
          >
            <div class="habit-left">
              <button
                class="habit-check-circle"
                :class="{ active: h.completedToday }"
                type="button"
                aria-label="Toggle habit"
              >
                <Check v-if="h.completedToday" :size="14" />
              </button>
              <span class="habit-emoji">{{ h.iconEmoji }}</span>
              <div class="habit-info">
                <span class="habit-name">{{ h.title }}</span>
                <div class="habit-meta">
                  <span class="meta-streak">🔥 {{ h.streak }} streak</span>
                  <span class="meta-score">{{ h.score }}% score</span>
                </div>
              </div>
            </div>

            <div class="habit-right">
              <div class="mini-score-bar">
                <div class="score-fill" :style="{ width: `${h.score}%` }"></div>
              </div>
              <button
                @click.stop="tasksStore.deleteHabit(h.id)"
                class="delete-btn"
                title="Remove habit"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Evening Section -->
      <section v-if="eveningHabits.length > 0" class="period-section">
        <div class="section-title">
          <Moon :size="15" class="icon-moon" />
          <span>Evening Melatonin & Downtime</span>
          <span class="count-tag">{{ eveningHabits.filter(h => h.completedToday).length }}/{{ eveningHabits.length }}</span>
        </div>
        <div class="habits-grid">
          <div
            v-for="h in eveningHabits"
            :key="h.id"
            class="habit-card"
            :class="{ completed: h.completedToday }"
            @click="tasksStore.toggleHabit(h.id)"
          >
            <div class="habit-left">
              <button
                class="habit-check-circle"
                :class="{ active: h.completedToday }"
                type="button"
                aria-label="Toggle habit"
              >
                <Check v-if="h.completedToday" :size="14" />
              </button>
              <span class="habit-emoji">{{ h.iconEmoji }}</span>
              <div class="habit-info">
                <span class="habit-name">{{ h.title }}</span>
                <div class="habit-meta">
                  <span class="meta-streak">🔥 {{ h.streak }} streak</span>
                  <span class="meta-score">{{ h.score }}% score</span>
                </div>
              </div>
            </div>

            <div class="habit-right">
              <div class="mini-score-bar">
                <div class="score-fill" :style="{ width: `${h.score}%` }"></div>
              </div>
              <button
                @click.stop="tasksStore.deleteHabit(h.id)"
                class="delete-btn"
                title="Remove habit"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.habits-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface, #12141a);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.header-glyph-pill {
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

.metrics-strip {
  display: flex;
  gap: 0.75rem;
}

.metric-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.metric-lbl {
  font-size: 0.7rem;
  color: var(--text-muted, #8e95a5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Quick Add Strip */
.quick-add-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  padding: 0.75rem;
  border-radius: 12px;
}

.input-wrap {
  display: flex;
  flex: 1 1 280px;
  gap: 0.5rem;
}

.emoji-input {
  width: 44px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1.1rem;
}

.title-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  color: #fff;
  font-size: 0.88rem;
}

.control-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.period-select-pills {
  display: flex;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 2px;
}

.pill-btn {
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
  transition: all 0.2s ease;
}

.pill-btn.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.submit-btn {
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
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

/* Circadian Sections */
.circadian-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.period-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted, #8e95a5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.icon-sun { color: #f59e0b; }
.icon-sunset { color: #ec4899; }
.icon-moon { color: #6366f1; }

.count-tag {
  margin-left: auto;
  font-size: 0.72rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.habit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.habit-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.habit-card.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.04);
}

.habit-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  overflow: hidden;
}

.habit-check-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
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

.habit-check-circle.active {
  background: #10b981;
  border-color: #10b981;
}

.habit-emoji {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.habit-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.habit-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-high, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-card.completed .habit-name {
  color: var(--text-muted, #8e95a5);
}

.habit-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: var(--text-muted, #8e95a5);
}

.habit-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: 0.5rem;
}

.mini-score-bar {
  width: 36px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #8e95a5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
  color: #ef4444;
}
</style>
