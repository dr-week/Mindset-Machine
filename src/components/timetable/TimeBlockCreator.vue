<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import TimeBlockCategorySelector from './TimeBlockCategorySelector.vue'

const emit = defineEmits<{
  (
    e: 'add-block',
    payload: {
      title: string
      category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'
      startTime: string
      endTime: string
      notes: string
    },
  ): void
}>()

const newBlockTitle = ref('')
const newBlockCategory = ref<'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'>('deep')
const newBlockStart = ref('09:00')
const newBlockEnd = ref('10:30')
const newBlockNotes = ref('')

function submit(): void {
  const title = newBlockTitle.value.trim()
  if (!title) return

  emit('add-block', {
    title,
    category: newBlockCategory.value,
    startTime: newBlockStart.value,
    endTime: newBlockEnd.value,
    notes: newBlockNotes.value.trim(),
  })

  newBlockTitle.value = ''
  newBlockNotes.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="timeblock-creator-card">
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
      <TimeBlockCategorySelector
        :active-category="newBlockCategory"
        @select="newBlockCategory = $event"
      />
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
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.timeblock-creator-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(14, 14, 18, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 1.15rem;
  border-radius: $radius-md;
  margin-bottom: 1.5rem;

  .creator-row-primary {
    display: flex;
    gap: 12px;
    align-items: center;
    .block-title-input {
      flex: 1;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: $radius-sm;
      padding: 0.55rem 0.85rem;
      font-size: 13px;
      color: #fff;
      outline: none;
      &:focus { border-color: rgba(255, 87, 34, 0.4); }
    }
    .time-range-group {
      display: flex; align-items: center; gap: 6px;
      .time-input { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: $radius-xs; padding: 5px 8px; color: #fff; font-size: 12px; }
      .time-sep { font-size: 11px; color: $color-text-dim; }
    }
    @media (max-width: 600px) { flex-direction: column; align-items: stretch; .time-range-group { justify-content: space-between; } }
  }

  .creator-row-secondary {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    .block-notes-input {
      flex: 1;
      min-width: 180px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: $radius-xs;
      padding: 5px 10px;
      font-size: 12px;
      color: #fff;
    }
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
      padding: 6px 14px;
      cursor: pointer;
    }
  }
}
</style>
