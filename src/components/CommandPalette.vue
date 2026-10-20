<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Zap,
  Target,
  CheckSquare,
  Sparkles,
  Database,
  Plus,
  X,
  Search,
  Clock,
  Flame,
  Activity,
} from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import type { ActiveTab } from '@/types/mindset'

const tasksStore = useTasksStore()
const isOpen = ref(false)
const searchInput = ref('')
const inputMode = ref<'search' | 'task' | 'goal'>('search')
const newItemText = ref('')

function openPalette(): void {
  isOpen.value = true
  inputMode.value = 'search'
  searchInput.value = ''
  newItemText.value = ''
}

function closePalette(): void {
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isOpen.value) {
      closePalette()
    } else {
      openPalette()
    }
  } else if (e.key === 'Escape' && isOpen.value) {
    closePalette()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function navigateTo(tab: ActiveTab): void {
  tasksStore.setTab(tab)
  closePalette()
}

function submitNewItem(): void {
  const text = newItemText.value.trim()
  if (!text) return
  if (inputMode.value === 'task') {
    tasksStore.addTask(text, 'high', 'deep', 'Today')
  } else if (inputMode.value === 'goal') {
    tasksStore.addGoal(text)
  }
  closePalette()
}
</script>

<template>
  <div v-if="isOpen" class="palette-overlay" @click.self="closePalette">
    <div class="palette-modal">
      <div class="palette-input-wrap">
        <Search :size="16" class="palette-search-icon" />
        <input
          v-if="inputMode === 'search'"
          v-model="searchInput"
          type="text"
          placeholder="Type a command or jump to view..."
          class="palette-input"
          autofocus
        />
        <input
          v-else
          v-model="newItemText"
          type="text"
          :placeholder="inputMode === 'task' ? 'Add new priority task...' : 'Declare new goal directive...'"
          class="palette-input"
          autofocus
          @keyup.enter="submitNewItem"
        />
        <button @click="closePalette" class="palette-close-btn">
          <X :size="14" />
        </button>
      </div>

      <div class="palette-body">
        <div v-if="inputMode === 'search'" class="palette-list">
          <!-- Quick Creations -->
          <div class="palette-group-title">QUICK ACTIONS</div>
          <button @click="inputMode = 'task'" class="palette-item">
            <Plus :size="14" class="text-ember" />
            <span class="item-title">Create New High-Impact Task</span>
            <span class="item-shortcut">Action</span>
          </button>
          <button @click="inputMode = 'goal'" class="palette-item">
            <Target :size="14" class="text-ember" />
            <span class="item-title">Declare Monumental Goal</span>
            <span class="item-shortcut">Vision</span>
          </button>
          <button @click="tasksStore.generateAiTasks(); closePalette()" class="palette-item">
            <Sparkles :size="14" class="text-emerald" />
            <span class="item-title">AI: Synthesize Next 3 Action Steps</span>
            <span class="item-shortcut">Predict</span>
          </button>

          <!-- Navigation Jumps -->
          <div class="palette-group-title">NAVIGATION DIRECTIVES</div>
          <button @click="navigateTo('dashboard')" class="palette-item">
            <Zap :size="14" />
            <span class="item-title">Jump to Mission Control (Flow)</span>
          </button>
          <button @click="navigateTo('activity')" class="palette-item">
            <Activity :size="14" class="text-ember" />
            <span class="item-title">Jump to Daily Activity Telemetry</span>
          </button>
          <button @click="navigateTo('habits')" class="palette-item">
            <Flame :size="14" class="text-ember" />
            <span class="item-title">Jump to Circadian Habit Engine</span>
          </button>
          <button @click="navigateTo('timetable')" class="palette-item">
            <Clock :size="14" class="text-ember" />
            <span class="item-title">Jump to Circadian Timetable</span>
          </button>
          <button @click="navigateTo('goals')" class="palette-item">
            <Target :size="14" />
            <span class="item-title">Jump to Goal Architect</span>
          </button>
          <button @click="navigateTo('tasks')" class="palette-item">
            <CheckSquare :size="14" />
            <span class="item-title">Jump to Execution Stream</span>
          </button>
          <button @click="navigateTo('ai')" class="palette-item">
            <Sparkles :size="14" />
            <span class="item-title">Jump to AI Strategic Studio</span>
          </button>
          <button @click="navigateTo('database')" class="palette-item">
            <Database :size="14" />
            <span class="item-title">Jump to Telemetry Vault</span>
          </button>
        </div>

        <div v-else class="palette-confirm-wrap">
          <p class="confirm-hint">Press Enter to commit to storage</p>
          <div class="confirm-btns">
            <button @click="submitNewItem" class="btn-commit">Deploy</button>
            <button @click="inputMode = 'search'" class="btn-back">Back</button>
          </div>
        </div>
      </div>

      <div class="palette-footer">
        <span class="footer-hint"><kbd>ESC</kbd> to close</span>
        <span class="footer-hint"><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
        <span class="footer-hint"><kbd>↵</kbd> to execute</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 7, 0.75);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15vh;
  animation: fadeIn 0.15s ease-out;
}

.palette-modal {
  width: 100%;
  max-width: 560px;
  background: #0d0f17;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: $radius-xl;
  box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 87, 34, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.palette-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .palette-search-icon {
    color: $color-ember;
    flex-shrink: 0;
  }

  .palette-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 15px;
    font-family: $font-sans;

    &::placeholder {
      color: $color-text-dim;
    }
  }

  .palette-close-btn {
    background: transparent;
    border: none;
    color: $color-text-dim;
    cursor: pointer;
    padding: 2px;
    display: flex;

    &:hover {
      color: #ffffff;
    }
  }
}

.palette-body {
  padding: 0.75rem;
  max-height: 340px;
  overflow-y: auto;
  @include custom-scroll;
}

.palette-group-title {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: $color-text-dim;
  padding: 0.5rem 0.65rem 0.25rem;
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .palette-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.65rem 0.85rem;
    border-radius: $radius-md;
    background: transparent;
    border: 1px solid transparent;
    color: $color-text-primary;
    font-size: 13.5px;
    cursor: pointer;
    text-align: left;
    transition: $transition-fast;

    .text-ember {
      color: $color-ember;
    }
    .text-emerald {
      color: $color-emerald;
    }

    .item-title {
      flex: 1;
    }

    .item-shortcut {
      font-family: $font-mono;
      font-size: 9px;
      color: $color-text-dim;
      background: rgba(255, 255, 255, 0.04);
      padding: 2px 6px;
      border-radius: 4px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.045);
      border-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
  }
}

.palette-confirm-wrap {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .confirm-hint {
    font-size: 13px;
    color: $color-text-secondary;
    margin: 0;
  }

  .confirm-btns {
    display: flex;
    gap: 0.75rem;

    .btn-commit {
      background: $color-ember;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: $radius-pill;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }

    .btn-back {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: $color-text-dim;
      padding: 0.5rem 1rem;
      border-radius: $radius-pill;
      font-size: 13px;
      cursor: pointer;
    }
  }
}

.palette-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0.55rem 1.25rem;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  .footer-hint {
    font-family: $font-mono;
    font-size: 10px;
    color: $color-text-dim;

    kbd {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      padding: 1px 4px;
      color: $color-text-secondary;
      margin: 0 2px;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
