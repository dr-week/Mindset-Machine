<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, Plus, Pin, Trash2 } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()
const newNoteTitle = ref('')
const newNoteContent = ref('')

function handleAddNote(): void {
  const title = newNoteTitle.value.trim()
  const content = newNoteContent.value.trim()
  if (!title && !content) return

  tasksStore.addNote(title || 'Quick Scratch Note', content)
  newNoteTitle.value = ''
  newNoteContent.value = ''
}
</script>

<template>
  <div class="full-bento-card notes-canvas zuari-card">
    <div class="full-top">
      <div class="title-with-icon">
        <BookOpen :size="18" class="text-ember" />
        <h2>Tactical Notes & Raw Scratchpad</h2>
      </div>
      <span class="box-counter">{{ tasksStore.notes.length }} active notes</span>
    </div>

    <form @submit.prevent="handleAddNote" class="notes-capture-box">
      <input
        v-model="newNoteTitle"
        type="text"
        placeholder="Note title or mental spark..."
        class="note-title-input"
      />
      <textarea
        v-model="newNoteContent"
        placeholder="Jot raw thoughts, formulas, or unpolished ideas..."
        class="note-content-input"
        rows="3"
      ></textarea>
      <div class="note-capture-foot">
        <span class="note-hint">Markdown supported • Zero lag persistence</span>
        <button type="submit" class="btn-ember-action">
          <Plus :size="14" />
          <span>Save Note</span>
        </button>
      </div>
    </form>

    <div class="notes-cards-grid">
      <div
        v-for="note in tasksStore.notes"
        :key="note.id"
        class="note-card"
        :class="{ pinned: note.pinned }"
      >
        <div class="note-card-head">
          <span class="note-card-title">{{ note.title }}</span>
          <div class="note-card-actions">
            <button
              @click="tasksStore.togglePinNote(note.id)"
              class="btn-note-pin"
              :class="{ active: note.pinned }"
              title="Pin Note"
            >
              <Pin :size="12" />
            </button>
            <button
              @click="tasksStore.deleteNote(note.id)"
              class="btn-note-del"
              title="Delete Note"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
        <p class="note-card-body">{{ note.content }}</p>
        <span class="note-card-date">{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.notes-canvas {
  .notes-capture-box {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    padding: 1.15rem;
    margin-bottom: 1.5rem;

    .note-title-input {
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.4rem 0.2rem;
      color: #ffffff;
      font-size: 14.5px;
      font-weight: 600;
      outline: none;

      &:focus {
        border-bottom-color: $color-ember;
      }

      &::placeholder {
        color: $color-text-dim;
      }
    }

    .note-content-input {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 13px;
      padding: 0.4rem 0.2rem;
      resize: vertical;
      min-height: 60px;
      outline: none;
      line-height: 1.45;

      &::placeholder {
        color: $color-text-dim;
      }
    }

    .note-capture-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.4rem;

      .note-hint {
        font-family: $font-mono;
        font-size: 9px;
        color: $color-text-dim;
      }
    }
  }

  .notes-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;

    .note-card {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: $radius-md;
      padding: 1rem 1.15rem;
      position: relative;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.035);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      &.pinned {
        border-color: rgba(255, 87, 34, 0.4);
        background: rgba(255, 87, 34, 0.03);
      }

      .note-card-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .note-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .note-card-actions {
          display: flex;
          align-items: center;
          gap: 4px;

          button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: $radius-xs;
            background: transparent;
            border: none;
            color: $color-text-dim;
            cursor: pointer;
            transition: all 0.15s ease;

            &:hover {
              color: #ffffff;
              background: rgba(255, 255, 255, 0.06);
            }

            &.btn-note-pin.active {
              color: $color-ember;
            }

            &.btn-note-del:hover {
              color: #ef4444;
            }
          }
        }
      }

      .note-card-body {
        font-size: 12.5px;
        color: rgba(255, 255, 255, 0.75);
        line-height: 1.5;
        white-space: pre-wrap;
        margin: 0;
      }

      .note-card-date {
        font-family: $font-mono;
        font-size: 8.5px;
        color: $color-text-dim;
        margin-top: auto;
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
</style>
