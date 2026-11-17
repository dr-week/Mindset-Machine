<script setup lang="ts">
import { Compass } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import SuggestionBrick from './ai-suggestions/SuggestionBrick.vue'

const tasksStore = useTasksStore()
</script>

<template>
  <section v-if="tasksStore.aiSuggestedTasks.length > 0" class="bento-box box-suggestions zuari-card">
    <div class="box-header">
      <div class="title-with-icon">
        <Compass :size="16" class="text-ember" />
        <span class="box-title">AI Suggested Actions</span>
      </div>
      <span class="box-counter">{{ tasksStore.aiSuggestedTasks.length }} generated</span>
    </div>

    <div class="suggestions-deck">
      <SuggestionBrick
        v-for="s in tasksStore.aiSuggestedTasks"
        :key="s.id"
        :suggestion="s"
        @accept="tasksStore.acceptAiSuggestion"
        @dismiss="tasksStore.dismissAiSuggestion"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-suggestions {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.15rem;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-with-icon { display: flex; align-items: center; gap: 7px; .box-title { font-size: 13px; font-weight: 700; color: #fff; } }
  .box-counter { font-family: $font-mono; font-size: 10px; color: $color-text-dim; }
}

.suggestions-deck {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
}

.text-ember { color: #f59e0b; }
</style>
