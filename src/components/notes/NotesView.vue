<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import NoteCardItem from './NoteCardItem.vue'
import NoteCreatorStrip from './NoteCreatorStrip.vue'

const tasksStore = useTasksStore()

function handleCreateNote(title: string, content: string): void {
  tasksStore.addNote(title, content)
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

    <NoteCreatorStrip @create="handleCreateNote" />

    <div class="notes-cards-grid">
      <NoteCardItem
        v-for="note in tasksStore.notes"
        :key="note.id"
        :note="note"
        @toggle-pin="tasksStore.togglePinNote"
        @delete="tasksStore.deleteNote"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.notes-canvas {
  padding: 1.25rem 1.5rem;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  @media (max-width: 680px) { padding: 1rem 0.85rem; }
}

.full-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1.25rem;
  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 8px;
    h2 { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
  }
  .box-counter { font-family: $font-mono; font-size: 11px; color: $color-text-dim; }
}

.notes-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.text-ember { color: #f59e0b; }
</style>
