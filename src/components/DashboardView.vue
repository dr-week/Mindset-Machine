<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  BrainCircuit,
  LayoutGrid,
  Search,
  BookOpen,
  Clock,
  Database,
  Flame,
  Activity,
  CheckSquare,
  Target,
} from 'lucide-vue-next'
import CommandPalette from '@/components/CommandPalette.vue'
import EveningAuditModal from '@/components/EveningAuditModal.vue'
import HunterDirectiveCard from '@/components/dashboard/HunterDirectiveCard.vue'
import VelocityCard from '@/components/dashboard/VelocityCard.vue'
import ExecutionQueueCard from '@/components/dashboard/ExecutionQueueCard.vue'
import VisionDirectivesCard from '@/components/dashboard/VisionDirectivesCard.vue'
import AiSuggestionsCard from '@/components/dashboard/AiSuggestionsCard.vue'
import ActivityView from '@/components/activity/ActivityView.vue'
import TasksView from '@/components/tasks/TasksView.vue'
import GoalsView from '@/components/goals/GoalsView.vue'
import TimetableView from '@/components/timetable/TimetableView.vue'
import HabitsView from '@/components/habits/HabitsView.vue'
import NotesView from '@/components/notes/NotesView.vue'
import VaultView from '@/components/vault/VaultView.vue'
import { useTasksStore } from '@/store/tasks'
import type { ActiveTab } from '@/types/mindset'

const tasksStore = useTasksStore()
const executionQueueRef = ref<InstanceType<typeof ExecutionQueueCard> | null>(null)

const tabs = [
  { key: 'dashboard' as ActiveTab, icon: LayoutGrid, label: 'Dashboard' },
  { key: 'tasks' as ActiveTab, icon: CheckSquare, label: 'Tasks' },
  { key: 'goals' as ActiveTab, icon: Target, label: 'Vision' },
  { key: 'activity' as ActiveTab, icon: Activity, label: 'Activity' },
  { key: 'habits' as ActiveTab, icon: Flame, label: 'Habits' },
  { key: 'timetable' as ActiveTab, icon: Clock, label: 'Timetable' },
  { key: 'notes' as ActiveTab, icon: BookOpen, label: 'Notes' },
  { key: 'database' as ActiveTab, icon: Database, label: 'Vault' },
]

function handleGlobalKeydown(e: KeyboardEvent): void {
  const activeEl = document.activeElement as HTMLElement
  const isTyping = activeEl && ['input', 'textarea'].includes(activeEl.tagName?.toLowerCase())

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (isTyping) return
    e.preventDefault()
    tasksStore.undoLastDelete()
  } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'c' || e.key === 'n')) {
    if (!isTyping) {
      e.preventDefault()
      executionQueueRef.value?.focusInput()
    }
  }
}

function triggerCommandPalette(): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
}

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeydown)
  if (!tasksStore.aiMotivation) {
    await tasksStore.refreshMotivation()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="bento-universe">
    <!-- ✦ TOP FLOATING APEX DOCK ✦ -->
    <header class="apex-dock">
      <div class="dock-left">
        <div class="brand-mark">
          <BrainCircuit :size="18" class="brand-icon" />
        </div>
        <div class="brand-info">
          <span class="brand-name">MINDSET MACHINE</span>
          <span class="brand-badge">PRO</span>
        </div>
      </div>

      <nav class="dock-segments nova-glyph-dock">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="tasksStore.setTab(tab.key)"
          class="segment-pill nova-glyph-tile"
          :class="{ active: tasksStore.currentTab === tab.key }"
          :data-active="tasksStore.currentTab === tab.key"
          :aria-label="tab.label"
        >
          <component :is="tab.icon" :size="16" class="seg-icon" />
          <span
            v-if="tab.key === 'ai' && tasksStore.aiSuggestedTasks.length > 0"
            class="seg-counter"
          >
            {{ tasksStore.aiSuggestedTasks.length }}
          </span>
          <!-- Zuari Aether Anchor Tooltip -->
          <span class="nova-glyph-tooltip">{{ tab.label }}</span>
        </button>
      </nav>

      <div class="dock-right">
        <EveningAuditModal />
        <button class="cmd-trigger-btn" @click="triggerCommandPalette" title="Search or press Ctrl+K">
          <Search :size="13" class="cmd-search-icon" />
          <kbd>Ctrl+K</kbd>
        </button>
      </div>
    </header>

    <!-- ✦ BENTO GRID ARCHITECTURE (DASHBOARD) ✦ -->
    <main v-if="tasksStore.currentTab === 'dashboard'" class="bento-grid">
      <!-- 1. AI Strategic Perspective & Hunter Stats -->
      <HunterDirectiveCard />

      <!-- 2. Velocity Index & Biometric Strip -->
      <VelocityCard />

      <!-- 3. Execution Queue Matrix -->
      <ExecutionQueueCard ref="executionQueueRef" />

      <!-- 4. Vision Directives (Goals) -->
      <VisionDirectivesCard />

      <!-- 5. Autonomous Predictions (AI suggestions) -->
      <AiSuggestionsCard />
    </main>

    <!-- ✦ DEDICATED FULL VIEWS (Clean Bento Panels) ✦ -->
    <main v-else class="bento-full-canvas">
      <!-- Dedicated Tasks Matrix View -->
      <TasksView v-if="tasksStore.currentTab === 'tasks'" />

      <!-- Vision Architect Horizons -->
      <GoalsView v-else-if="tasksStore.currentTab === 'goals'" />

      <!-- Daily Activity Ledger -->
      <ActivityView v-else-if="tasksStore.currentTab === 'activity'" />

      <!-- Circadian Habits Engine -->
      <HabitsView v-else-if="tasksStore.currentTab === 'habits'" />

      <!-- Circadian Timetable -->
      <TimetableView v-else-if="tasksStore.currentTab === 'timetable'" />

      <!-- Notes Scratchpad -->
      <NotesView v-else-if="tasksStore.currentTab === 'notes'" />

      <!-- Telemetry Vault -->
      <VaultView v-else-if="tasksStore.currentTab === 'database'" />
    </main>

    <!-- Floating Undo Notification Toast -->
    <Transition name="toast-slide">
      <div v-if="tasksStore.undoToastMessage" class="undo-floating-toast">
        <span class="toast-text">{{ tasksStore.undoToastMessage }}</span>
        <button @click="tasksStore.undoLastDelete()" class="btn-toast-undo">
          <span>Undo</span>
          <kbd>Ctrl+Z</kbd>
        </button>
      </div>
    </Transition>

    <!-- Global Command Palette Modal -->
    <CommandPalette />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.bento-universe {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  animation: fadeIn 0.35s ease-out;
}

// ✦ APEX FLOATING DOCK ✦
.apex-dock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.15rem;
  background: rgba(18, 18, 22, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: $radius-pill;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  position: sticky;
  top: 1rem;
  z-index: 100;

  .dock-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #ff7a45, #ff5722);
      color: #ffffff;
      box-shadow: 0 0 12px rgba(255, 87, 34, 0.5);
    }

    .brand-info {
      display: flex;
      align-items: center;
      gap: 6px;

      .brand-name {
        font-family: $font-mono;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.12em;
        color: #ffffff;
      }

      .brand-badge {
        font-family: $font-mono;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.08em;
        padding: 2px 5px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: $radius-xs;
        color: $color-text-muted;
      }
    }
  }

  .dock-segments {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    padding: 3px;
    border-radius: $radius-pill;
    border: 1px solid rgba(255, 255, 255, 0.04);
    gap: 3px;

    .segment-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0.38rem 0.85rem;
      border-radius: $radius-pill;
      border: none;
      background: transparent;
      color: $color-text-muted;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      .seg-icon {
        opacity: 0.7;
        transition: transform 0.2s ease;
      }

      &:hover {
        color: #ffffff;
        .seg-icon {
          transform: translateY(-1px);
          opacity: 1;
        }
      }

      &.active {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);

        .seg-icon {
          color: $color-ember;
          opacity: 1;
        }
      }

      .seg-counter {
        font-family: $font-mono;
        font-size: 9px;
        padding: 1px 5px;
        border-radius: $radius-pill;
        background: $color-ember;
        color: #ffffff;
        font-weight: 700;
      }
    }
  }

  .dock-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .cmd-trigger-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0.35rem 0.65rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: $color-text-muted;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;

      kbd {
        font-family: $font-mono;
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: $color-text-dim;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 87, 34, 0.3);
        color: #ffffff;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;

    .brand-info {
      display: none;
    }

    .dock-segments .segment-pill {
      padding: 0.35rem 0.55rem;
      .seg-text {
        display: none;
      }
    }

    .cmd-trigger-btn kbd {
      display: none;
    }
  }
}

// ✦ BENTO GRID ARCHITECTURE (DASHBOARD) ✦
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.15rem;
  width: 100%;
}

// ✦ DEDICATED FULL VIEWS CONTAINER ✦
.bento-full-canvas {
  width: 100%;
  animation: fadeIn 0.3s ease-out;
}

// ✦ Floating Undo Toast ✦
.undo-floating-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(24, 24, 27, 0.95);
  border: 1px solid rgba(255, 87, 34, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 87, 34, 0.15);
  padding: 0.65rem 1.1rem;
  border-radius: $radius-pill;
  z-index: 1000;
  backdrop-filter: blur(12px);

  .toast-text {
    font-size: 12px;
    color: #ffffff;
    font-weight: 500;
  }

  .btn-toast-undo {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 87, 34, 0.2);
    border: 1px solid rgba(255, 87, 34, 0.4);
    border-radius: $radius-pill;
    color: $color-ember;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    cursor: pointer;
    transition: all 0.15s ease;

    kbd {
      font-family: $font-mono;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.7);
    }

    &:hover {
      background: rgba(255, 87, 34, 0.35);
      color: #ffffff;
    }
  }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
