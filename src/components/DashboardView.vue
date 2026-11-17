<script setup lang="ts">
/**
 * DashboardView — Tab router & view switcher
 * Handles keyboard shortcuts and delegates view rendering.
 * Layout/navigation shell is handled by AppShell (parent).
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '@/store/tasks'
import UndoToastNotification from '@/components/dashboard/UndoToastNotification.vue'

// Dashboard tab views
import HunterDirectiveCard from '@/components/dashboard/HunterDirectiveCard.vue'
import VelocityCard from '@/components/dashboard/VelocityCard.vue'
import ExecutionQueueCard from '@/components/dashboard/ExecutionQueueCard.vue'
import VisionDirectivesCard from '@/components/dashboard/VisionDirectivesCard.vue'
import AiSuggestionsCard from '@/components/dashboard/AiSuggestionsCard.vue'

// View tabs
import ActivityView from '@/components/activity/ActivityView.vue'
import TasksView from '@/components/tasks/TasksView.vue'
import GoalsView from '@/components/goals/GoalsView.vue'
import TimetableView from '@/components/timetable/TimetableView.vue'
import HabitsView from '@/components/habits/HabitsView.vue'
import NotesView from '@/components/notes/NotesView.vue'
import VaultView from '@/components/vault/VaultView.vue'
import AssistantView from '@/components/assistant/AssistantView.vue'

const tasksStore = useTasksStore()
const executionQueueRef = ref<InstanceType<typeof ExecutionQueueCard> | null>(null)

function handleKeydown(e: KeyboardEvent) {
  const isTyping = ['INPUT','TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName ?? '')
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    if (!isTyping) { e.preventDefault(); tasksStore.undoLastDelete() }
  } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'c' || e.key === 'n')) {
    if (!isTyping) { e.preventDefault(); executionQueueRef.value?.focusInput() }
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="dashboard-universe">
    <Transition name="mm-fade" mode="out-in">
      <main v-if="tasksStore.currentTab === 'dashboard'" key="cockpit" class="bento-grid">
        <HunterDirectiveCard class="bento-col-7" />
        <VelocityCard class="bento-col-5" />
        <ExecutionQueueCard ref="executionQueueRef" class="bento-col-7" />
        <VisionDirectivesCard class="bento-col-5" />
        <AiSuggestionsCard class="bento-col-12" />
      </main>
      <main v-else-if="tasksStore.currentTab === 'ai'"        key="ai"        class="view-canvas"><AssistantView /></main>
      <main v-else-if="tasksStore.currentTab === 'tasks'"     key="tasks"     class="view-canvas"><TasksView /></main>
      <main v-else-if="tasksStore.currentTab === 'goals'"     key="goals"     class="view-canvas"><GoalsView /></main>
      <main v-else-if="tasksStore.currentTab === 'activity'"  key="activity"  class="view-canvas"><ActivityView /></main>
      <main v-else-if="tasksStore.currentTab === 'timetable'" key="timetable" class="view-canvas"><TimetableView /></main>
      <main v-else-if="tasksStore.currentTab === 'habits'"    key="habits"    class="view-canvas"><HabitsView /></main>
      <main v-else-if="tasksStore.currentTab === 'notes'"     key="notes"     class="view-canvas"><NotesView /></main>
      <main v-else-if="tasksStore.currentTab === 'database'"  key="database"  class="view-canvas"><VaultView /></main>
    </Transition>

    <UndoToastNotification
      :message="tasksStore.undoToastMessage"
      @undo="tasksStore.undoLastDelete()"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.dashboard-universe { display: flex; flex-direction: column; flex: 1; min-height: 0; }

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  max-width: var(--mm-content-max-w, 1360px);
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 60px;

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px 14px calc(76px + env(safe-area-inset-bottom, 0px));
  }
}

.bento-col-7 { grid-column: span 7; }
.bento-col-5 { grid-column: span 5; }
.bento-col-12 { grid-column: span 12; }

@media (max-width: 899px) {
  .bento-col-7,
  .bento-col-5,
  .bento-col-12 {
    grid-column: 1 / -1 !important;
    width: 100%;
  }
}

.view-canvas {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 60px;
  flex: 1;

  @media (max-width: 899px) {
    padding: 12px 14px calc(76px + env(safe-area-inset-bottom, 0px));
  }
}

/* Page transition */
.mm-fade-enter-active, .mm-fade-leave-active {
  transition: opacity var(--mm-dur-std) var(--mm-ease-std),
              transform var(--mm-dur-std) var(--mm-ease-std);
}
.mm-fade-enter-from, .mm-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
