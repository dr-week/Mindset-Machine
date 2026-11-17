<script setup lang="ts">
import {
  Zap,
  Target,
  Sparkles,
  Database,
  Plus,
  Clock,
  Flame,
  Activity,
  CheckSquare,
  BookOpen,
} from 'lucide-vue-next'
import type { ActiveTab } from '@/types/mindset'

const emit = defineEmits<{
  (e: 'set-mode', mode: 'task' | 'goal'): void
  (e: 'generate-ai'): void
  (e: 'navigate', tab: ActiveTab): void
}>()
</script>

<template>
  <div class="palette-list">
    <div class="palette-group-title">QUICK ACTIONS</div>
    <button @click="emit('set-mode', 'task')" class="palette-item" type="button">
      <Plus :size="14" class="text-ember" />
      <span class="item-title">Create New High-Impact Task</span>
      <span class="item-shortcut">Action</span>
    </button>
    <button @click="emit('set-mode', 'goal')" class="palette-item" type="button">
      <Target :size="14" class="text-ember" />
      <span class="item-title">Declare Monumental Goal</span>
      <span class="item-shortcut">Vision</span>
    </button>
    <button @click="emit('generate-ai')" class="palette-item" type="button">
      <Sparkles :size="14" class="text-emerald" />
      <span class="item-title">AI: Synthesize Next 3 Action Steps</span>
      <span class="item-shortcut">Predict</span>
    </button>

    <div class="palette-group-title">NAVIGATION DIRECTIVES</div>
    <button @click="emit('navigate', 'dashboard')" class="palette-item" type="button">
      <Zap :size="14" />
      <span class="item-title">Jump to Mission Control (Flow)</span>
    </button>
    <button @click="emit('navigate', 'tasks')" class="palette-item" type="button">
      <CheckSquare :size="14" />
      <span class="item-title">Jump to Dedicated Task Stream</span>
    </button>
    <button @click="emit('navigate', 'activity')" class="palette-item" type="button">
      <Activity :size="14" class="text-ember" />
      <span class="item-title">Jump to Daily Activity Telemetry</span>
    </button>
    <button @click="emit('navigate', 'habits')" class="palette-item" type="button">
      <Flame :size="14" class="text-ember" />
      <span class="item-title">Jump to Circadian Habit Engine</span>
    </button>
    <button @click="emit('navigate', 'timetable')" class="palette-item" type="button">
      <Clock :size="14" class="text-ember" />
      <span class="item-title">Jump to Circadian Timetable</span>
    </button>
    <button @click="emit('navigate', 'goals')" class="palette-item" type="button">
      <Target :size="14" />
      <span class="item-title">Jump to Vision Directives</span>
    </button>
    <button @click="emit('navigate', 'notes')" class="palette-item" type="button">
      <BookOpen :size="14" />
      <span class="item-title">Jump to Idea-to-Action Notes</span>
    </button>
    <button @click="emit('navigate', 'database')" class="palette-item" type="button">
      <Database :size="14" />
      <span class="item-title">Jump to Telemetry Vault & State</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.palette-group-title {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: $color-text-dim;
  padding: 8px 10px 4px;
}
.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: $radius-xs;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  .item-title { flex: 1; }
  .item-shortcut {
    font-size: 10px;
    font-family: $font-mono;
    color: $color-text-dim;
    background: rgba(255, 255, 255, 0.04);
    padding: 1px 5px;
    border-radius: 3px;
  }
}
.text-ember { color: #f59e0b; }
.text-emerald { color: #10b981; }
</style>
