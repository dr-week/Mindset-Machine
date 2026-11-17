<script setup lang="ts">
import { Pin, Trash2 } from 'lucide-vue-next'
import type { QuickNote } from '@/types/mindset'

defineProps<{
  note: QuickNote
}>()

const emit = defineEmits<{
  (e: 'toggle-pin', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="note-card" :class="{ pinned: note.pinned }">
    <div class="note-card-head">
      <span class="note-card-title">{{ note.title }}</span>
      <div class="note-card-actions">
        <button
          @click="emit('toggle-pin', note.id)"
          class="btn-note-pin"
          :class="{ active: note.pinned }"
          title="Pin Note"
          type="button"
        >
          <Pin :size="12" />
        </button>
        <button
          @click="emit('delete', note.id)"
          class="btn-note-del"
          title="Delete Note"
          type="button"
        >
          <Trash2 :size="12" />
        </button>
      </div>
    </div>
    <p class="note-card-body">{{ note.content }}</p>
    <span class="note-card-date">{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.note-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: 1rem;
  gap: 0.65rem;
  transition: all 0.2s ease;

  &.pinned {
    border-color: rgba(255, 87, 34, 0.4);
    background: rgba(255, 87, 34, 0.03);
  }

  .note-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .note-card-title { font-size: 13.5px; font-weight: 700; color: #fff; }
    .note-card-actions {
      display: flex;
      gap: 4px;
      button {
        background: transparent;
        border: none;
        color: $color-text-dim;
        cursor: pointer;
        padding: 2px;
        &:hover { color: #fff; }
        &.active { color: #ff7a45; }
      }
    }
  }

  .note-card-body {
    font-size: 12.5px;
    color: $color-text-muted;
    line-height: 1.45;
    margin: 0;
    white-space: pre-wrap;
  }

  .note-card-date {
    font-family: $font-mono;
    font-size: 9px;
    color: $color-text-dim;
    margin-top: auto;
  }
}
</style>
