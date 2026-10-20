<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock, Check, Plus, Trash2 } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const newBlockTitle = ref('')
const newBlockCategory = ref<'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'>('deep')
const newBlockStart = ref('09:00')
const newBlockEnd = ref('10:30')
const newBlockNotes = ref('')

function handleAddTimeBlock(): void {
  const title = newBlockTitle.value.trim()
  if (!title) return

  tasksStore.addTimeBlock(
    title,
    newBlockCategory.value,
    newBlockStart.value,
    newBlockEnd.value,
    newBlockNotes.value.trim(),
  )
  newBlockTitle.value = ''
  newBlockNotes.value = ''
}

const currentTimeMinutes = ref(new Date().getHours() * 60 + new Date().getMinutes())
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTimeMinutes.value = new Date().getHours() * 60 + new Date().getMinutes()
  }, 30000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const activeTimeBlock = computed(() => {
  const cur = currentTimeMinutes.value
  return tasksStore.timetable.find((b) => {
    const s = parseMinutes(b.startTime)
    const e = parseMinutes(b.endTime)
    return cur >= s && cur <= e
  })
})
</script>

<template>
  <div class="full-bento-card timetable-canvas zuari-card">
    <div class="full-top">
      <div class="title-with-icon">
        <Clock :size="18" class="text-ember" />
        <div>
          <h2>Circadian Timetable & Time Blocks</h2>
          <p class="subtitle-artistic">Align deep human intellect with biological peaks and uninterrupted focus sanctuaries.</p>
        </div>
      </div>
      <span class="box-counter">{{ tasksStore.timetable.length }} scheduled blocks</span>
    </div>

    <!-- Active Focus Hero Card (if currently within a block) -->
    <div v-if="activeTimeBlock" class="active-focus-hero" :class="activeTimeBlock.category">
      <div class="hero-glow-badge">ACTIVE HORIZON NOW</div>
      <div class="hero-content">
        <span class="hero-time">{{ activeTimeBlock.startTime }} — {{ activeTimeBlock.endTime }}</span>
        <h3 class="hero-title">{{ activeTimeBlock.title }}</h3>
        <p v-if="activeTimeBlock.notes" class="hero-notes">{{ activeTimeBlock.notes }}</p>
      </div>
      <button
        @click="tasksStore.toggleTimeBlock(activeTimeBlock.id)"
        class="btn-hero-complete"
        :class="{ done: activeTimeBlock.completed }"
      >
        <Check :size="16" />
        <span>{{ activeTimeBlock.completed ? 'Session Completed' : 'Mark Complete' }}</span>
      </button>
    </div>

    <!-- Quick Block Creator Strip -->
    <form @submit.prevent="handleAddTimeBlock" class="timeblock-creator-card">
      <div class="creator-row-primary">
        <input
          v-model="newBlockTitle"
          type="text"
          placeholder="Block Directive (e.g. 90m Deep Work, Somatic Reset...)"
          class="block-title-input"
        />
        <div class="time-range-group">
          <input v-model="newBlockStart" type="time" class="time-input" />
          <span class="time-sep">to</span>
          <input v-model="newBlockEnd" type="time" class="time-input" />
        </div>
      </div>
      <div class="creator-row-secondary">
        <div class="category-pills-selector">
          <button
            type="button"
            @click="newBlockCategory = 'deep'"
            class="cat-pill deep"
            :class="{ active: newBlockCategory === 'deep' }"
          >
            ⚡ Deep Focus
          </button>
          <button
            type="button"
            @click="newBlockCategory = 'vitality'"
            class="cat-pill vitality"
            :class="{ active: newBlockCategory === 'vitality' }"
          >
            ☀️ Vitality & Sun
          </button>
          <button
            type="button"
            @click="newBlockCategory = 'ritual'"
            class="cat-pill ritual"
            :class="{ active: newBlockCategory === 'ritual' }"
          >
            🌿 Movement / Ritual
          </button>
          <button
            type="button"
            @click="newBlockCategory = 'admin'"
            class="cat-pill admin"
            :class="{ active: newBlockCategory === 'admin' }"
          >
            ☕ Admin / Sweeping
          </button>
          <button
            type="button"
            @click="newBlockCategory = 'rest'"
            class="cat-pill rest"
            :class="{ active: newBlockCategory === 'rest' }"
          >
            🌙 Digital Sunset / Rest
          </button>
        </div>
        <input
          v-model="newBlockNotes"
          type="text"
          placeholder="Micro-protocol note (optional)..."
          class="block-notes-input"
        />
        <button type="submit" class="btn-ember-action">
          <Plus :size="14" />
          <span>Add Block</span>
        </button>
      </div>
    </form>

    <!-- Chronological Timeline Stream -->
    <div class="timeline-stream-container">
      <div
        v-for="block in tasksStore.timetable"
        :key="block.id"
        class="timeline-card"
        :class="[block.category, { completed: block.completed }]"
      >
        <div class="timeline-edge-indicator"></div>
        <div class="time-slot-badge">
          <span class="start-txt">{{ block.startTime }}</span>
          <span class="end-txt">{{ block.endTime }}</span>
        </div>
        <div class="card-main">
          <div class="card-title-row">
            <span class="category-tag">{{ block.category.toUpperCase() }}</span>
            <h4 class="block-heading">{{ block.title }}</h4>
          </div>
          <p v-if="block.notes" class="block-description">{{ block.notes }}</p>
        </div>
        <div class="card-actions">
          <button
            @click="tasksStore.toggleTimeBlock(block.id)"
            class="btn-block-check"
            :class="{ checked: block.completed }"
            title="Toggle completion"
          >
            <Check :size="14" />
          </button>
          <button
            @click="tasksStore.deleteTimeBlock(block.id)"
            class="btn-block-delete"
            title="Delete block"
          >
            <Trash2 :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.timetable-canvas {
  .subtitle-artistic {
    font-size: 11.5px;
    color: $color-text-dim;
    margin-top: 2px;
    font-weight: 400;
  }

  .active-focus-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.25rem;
    border-radius: $radius-lg;
    background: radial-gradient(120% 120% at 0% 0%, rgba(255, 87, 34, 0.12) 0%, rgba(18, 18, 22, 0.95) 100%);
    border: 1px solid rgba(255, 87, 34, 0.35);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 87, 34, 0.05);
    overflow: hidden;

    &.deep {
      border-color: rgba(239, 68, 68, 0.45);
      background: radial-gradient(120% 120% at 0% 0%, rgba(239, 68, 68, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
    }

    &.vitality {
      border-color: rgba(245, 158, 11, 0.45);
      background: radial-gradient(120% 120% at 0% 0%, rgba(245, 158, 11, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
    }

    &.ritual {
      border-color: rgba(16, 185, 129, 0.45);
      background: radial-gradient(120% 120% at 0% 0%, rgba(16, 185, 129, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
    }

    &.admin {
      border-color: rgba(14, 165, 233, 0.45);
      background: radial-gradient(120% 120% at 0% 0%, rgba(14, 165, 233, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
    }

    &.rest {
      border-color: rgba(167, 139, 250, 0.45);
      background: radial-gradient(120% 120% at 0% 0%, rgba(167, 139, 250, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
    }

    .hero-glow-badge {
      position: absolute;
      top: 10px;
      right: 14px;
      font-family: $font-mono;
      font-size: 8px;
      letter-spacing: 0.1em;
      padding: 2px 7px;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      animation: pulse 2.5s infinite ease-in-out;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .hero-time {
        font-family: $font-mono;
        font-size: 11px;
        color: $color-ember;
        letter-spacing: 0.05em;
      }

      .hero-title {
        font-size: 17px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.01em;
      }

      .hero-notes {
        font-size: 12px;
        color: $color-text-muted;
        max-width: 520px;
        line-height: 1.4;
      }
    }

    .btn-hero-complete {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 87, 34, 0.2);
      border: 1px solid rgba(255, 87, 34, 0.45);
      color: #ffffff;
      border-radius: $radius-md;
      padding: 0.55rem 1rem;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 87, 34, 0.35);
        box-shadow: 0 0 12px rgba(255, 87, 34, 0.4);
      }

      &.done {
        background: rgba(16, 185, 129, 0.2);
        border-color: rgba(16, 185, 129, 0.5);
        color: #34d399;
      }
    }
  }

  .timeblock-creator-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    padding: 1.15rem;
    margin-bottom: 1.5rem;

    .creator-row-primary {
      display: flex;
      gap: 1rem;
      align-items: center;

      .block-title-input {
        flex: 1;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.4rem 0.2rem;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        outline: none;

        &:focus {
          border-bottom-color: $color-ember;
        }

        &::placeholder {
          color: $color-text-dim;
        }
      }

      .time-range-group {
        display: flex;
        align-items: center;
        gap: 6px;

        .time-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: $radius-xs;
          padding: 0.3rem 0.5rem;
          color: #ffffff;
          font-family: $font-mono;
          font-size: 12px;
          outline: none;

          &:focus {
            border-color: $color-ember;
          }
        }

        .time-sep {
          font-size: 11px;
          color: $color-text-dim;
        }
      }
    }

    .creator-row-secondary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;

      .category-pills-selector {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;

        .cat-pill {
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: $radius-pill;
          color: $color-text-muted;
          font-size: 10.5px;
          cursor: pointer;
          transition: all 0.15s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.07);
            color: #ffffff;
          }

          &.active {
            &.deep {
              background: rgba(239, 68, 68, 0.2);
              border-color: rgba(239, 68, 68, 0.5);
              color: #f87171;
            }
            &.vitality {
              background: rgba(245, 158, 11, 0.2);
              border-color: rgba(245, 158, 11, 0.5);
              color: #fbbf24;
            }
            &.ritual {
              background: rgba(16, 185, 129, 0.2);
              border-color: rgba(16, 185, 129, 0.5);
              color: #34d399;
            }
            &.admin {
              background: rgba(14, 165, 233, 0.2);
              border-color: rgba(14, 165, 233, 0.5);
              color: #38bdf8;
            }
            &.rest {
              background: rgba(167, 139, 250, 0.2);
              border-color: rgba(167, 139, 250, 0.5);
              color: #c4b5fd;
            }
          }
        }
      }

      .block-notes-input {
        flex: 1;
        min-width: 140px;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0.35rem 0.2rem;
        color: #ffffff;
        font-size: 12px;
        outline: none;

        &:focus {
          border-bottom-color: rgba(255, 255, 255, 0.3);
        }

        &::placeholder {
          color: $color-text-dim;
        }
      }
    }
  }

  .timeline-stream-container {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;

    .timeline-card {
      display: flex;
      align-items: center;
      position: relative;
      gap: 1.15rem;
      padding: 0.85rem 1.15rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: $radius-md;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.035);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }

      .timeline-edge-indicator {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        border-top-left-radius: $radius-md;
        border-bottom-left-radius: $radius-md;
      }

      &.deep .timeline-edge-indicator { background: #ef4444; }
      &.vitality .timeline-edge-indicator { background: #f59e0b; }
      &.ritual .timeline-edge-indicator { background: #10b981; }
      &.admin .timeline-edge-indicator { background: #0ea5e9; }
      &.rest .timeline-edge-indicator { background: #8b5cf6; }

      &.completed {
        opacity: 0.55;

        .block-heading {
          text-decoration: line-through;
          color: $color-text-muted;
        }
      }

      .time-slot-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 48px;
        font-family: $font-mono;

        .start-txt {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .end-txt {
          font-size: 9.5px;
          color: $color-text-dim;
        }
      }

      .card-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .card-title-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .category-tag {
            font-family: $font-mono;
            font-size: 8px;
            letter-spacing: 0.08em;
            padding: 1px 5px;
            border-radius: $radius-xs;
            background: rgba(255, 255, 255, 0.05);
            color: $color-text-dim;
          }

          .block-heading {
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            margin: 0;
          }
        }

        .block-description {
          font-size: 11.5px;
          color: $color-text-dim;
          margin: 0;
          line-height: 1.35;
        }
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 6px;

        .btn-block-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: $radius-xs;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: $color-text-dim;
          cursor: pointer;
          transition: all 0.15s ease;

          &:hover {
            background: rgba(16, 185, 129, 0.15);
            border-color: rgba(16, 185, 129, 0.35);
            color: #34d399;
          }

          &.checked {
            background: rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.5);
            color: #34d399;
          }
        }

        .btn-block-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: $radius-xs;
          background: transparent;
          border: none;
          color: $color-text-dim;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.15s ease;

          &:hover {
            opacity: 1;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
          }
        }
      }
    }
  }
}

.btn-ember-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.2) 0%, rgba(255, 87, 34, 0.35) 100%);
  border: 1px solid rgba(255, 87, 34, 0.5);
  border-radius: $radius-md;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 87, 34, 0.3) 0%, rgba(255, 87, 34, 0.5) 100%);
    box-shadow: 0 0 15px rgba(255, 87, 34, 0.4);
  }
}

.full-bento-card {
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  .full-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 10px;

      h2 {
        font-size: 17px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }
    }

    .box-counter {
      font-family: $font-mono;
      font-size: 11px;
      color: $color-text-dim;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
