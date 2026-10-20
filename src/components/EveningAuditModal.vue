<script setup lang="ts">
import { ref } from 'vue'
import { Award, Moon, Check, X, ArrowRight } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()
const isOpen = ref(false)
const winInput = ref('')
const tomorrowInput = ref('')

function openModal(): void {
  isOpen.value = true
  winInput.value = ''
  tomorrowInput.value = ''
}

function closeModal(): void {
  isOpen.value = false
}

function submitAudit(): void {
  const win = winInput.value.trim() || 'Executed with high discipline'
  const tomorrow = tomorrowInput.value.trim() || 'Execute first 90-min deep work block'
  tasksStore.addDayReview(win, tomorrow)
  closeModal()
}
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <button @click="openModal" class="btn-evening-audit" title="Conduct Evening Cold Audit">
      <Moon :size="14" class="text-ember" />
      <span>Evening Audit</span>
    </button>

    <!-- Modal Overlay -->
    <div v-if="isOpen" class="audit-overlay" @click.self="closeModal">
      <div class="audit-modal">
        <div class="audit-header">
          <div class="audit-badge">
            <Moon :size="13" class="text-ember" />
            <span>METAGENESIS • EVENING AUDIT</span>
          </div>
          <button @click="closeModal" class="btn-close-modal">
            <X :size="15" />
          </button>
        </div>

        <div class="audit-summary-strip">
          <div class="stat-cell">
            <span class="stat-num">{{ tasksStore.completedTasks.length }}</span>
            <span class="stat-tag">COMPLETED</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-cell">
            <span class="stat-num text-ember">{{ tasksStore.taskCompletionRate }}%</span>
            <span class="stat-tag">VELOCITY</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-cell">
            <span class="stat-num text-emerald">{{ tasksStore.activeGoals.length }}</span>
            <span class="stat-tag">ACTIVE GOALS</span>
          </div>
        </div>

        <div class="audit-form">
          <div class="field-wrap">
            <label class="field-label">
              <Award :size="13" class="text-ember" />
              <span>1. What was your definitive high-leverage win today?</span>
            </label>
            <input
              v-model="winInput"
              type="text"
              placeholder="e.g., Shipped v2.0 IndexedDB architecture & hit 90m deep work"
              class="audit-input"
              autofocus
            />
          </div>

          <div class="field-wrap">
            <label class="field-label">
              <ArrowRight :size="13" class="text-ember" />
              <span>2. What is your singular non-negotiable Priority #1 for tomorrow morning?</span>
            </label>
            <input
              v-model="tomorrowInput"
              type="text"
              placeholder="e.g., Complete client proposal before touching communication"
              class="audit-input"
              @keyup.enter="submitAudit"
            />
          </div>
        </div>

        <div class="audit-footer">
          <button @click="closeModal" class="btn-cancel">Dismiss</button>
          <button @click="submitAudit" class="btn-lock-audit">
            <Check :size="14" />
            <span>Lock In Day & Commit to Vault</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.btn-evening-audit {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 87, 34, 0.08);
  border: 1px solid rgba(255, 87, 34, 0.25);
  border-radius: $radius-pill;
  padding: 5px 12px;
  color: $color-ember-bright;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition-bounce;

  &:hover {
    background: rgba(255, 87, 34, 0.18);
    transform: translateY(-1.5px);
    box-shadow: 0 4px 14px rgba(255, 87, 34, 0.3);
  }
}

.audit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 8, 0.85);
  backdrop-filter: blur(14px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.audit-modal {
  width: 100%;
  max-width: 540px;
  background: #0d0f17;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: $radius-xl;
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 87, 34, 0.18);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .audit-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: $font-mono;
    font-size: 9.5px;
    letter-spacing: 0.15em;
    color: $color-ember;
    background: rgba(255, 87, 34, 0.1);
    border: 1px solid rgba(255, 87, 34, 0.25);
    padding: 3px 10px;
    border-radius: $radius-pill;
  }

  .btn-close-modal {
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

.audit-summary-strip {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 0.85rem;

  .stat-cell {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-num {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
    }

    .stat-tag {
      font-family: $font-mono;
      font-size: 8.5px;
      letter-spacing: 0.1em;
      color: $color-text-dim;
      margin-top: 2px;
    }
  }

  .stat-sep {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.06);
  }
}

.audit-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;

  .field-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;

    .field-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      font-weight: 600;
      color: $color-text-primary;
    }

    .audit-input {
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: $radius-md;
      padding: 0.65rem 0.85rem;
      color: #ffffff;
      font-size: 13px;
      transition: $transition-fast;

      &::placeholder {
        color: $color-text-dim;
      }

      &:focus {
        border-color: $color-ember;
        box-shadow: 0 0 10px -2px rgba(255, 87, 34, 0.4);
      }
    }
  }
}

.audit-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: $color-text-dim;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  .btn-lock-audit {
    display: flex;
    align-items: center;
    gap: 6px;
    background: $color-ember-gradient;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 14px rgba(255, 87, 34, 0.4);
    color: #ffffff;
    padding: 0.55rem 1.25rem;
    border-radius: $radius-pill;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition-bounce;

    &:hover {
      transform: translateY(-1.5px);
      box-shadow: 0 6px 20px rgba(255, 87, 34, 0.55);
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
