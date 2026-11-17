<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'create', title: string, content: string): void
}>()

const newNoteTitle = ref('')
const newNoteContent = ref('')

function handleAddNote(): void {
  const title = newNoteTitle.value.trim()
  const content = newNoteContent.value.trim()
  if (!title && !content) return

  emit('create', title || 'Quick Scratch Note', content)
  newNoteTitle.value = ''
  newNoteContent.value = ''
}
</script>

<template>
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
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.notes-capture-box {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: $radius-md;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .note-title-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.4rem 0.2rem;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    outline: none;
    &:focus { border-bottom-color: #ff5722; }
    &::placeholder { color: $color-text-dim; }
  }

  .note-content-input {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 13px;
    padding: 0.4rem 0.2rem;
    resize: vertical;
    min-height: 60px;
    outline: none;
    &::placeholder { color: $color-text-dim; }
  }

  .note-capture-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .note-hint { font-size: 10px; color: $color-text-dim; }
    .btn-ember-action {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #ff5722;
      border: none;
      border-radius: $radius-xs;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      cursor: pointer;
    }
  }
}
</style>
