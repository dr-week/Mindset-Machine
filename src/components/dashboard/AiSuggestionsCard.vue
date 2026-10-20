<script setup lang="ts">
import { Compass, X, ArrowUpRight } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

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
      <div
        v-for="s in tasksStore.aiSuggestedTasks"
        :key="s.id"
        class="suggestion-brick"
      >
        <div class="brick-top">
          <span class="brick-tag">TACTICAL MOVE</span>
          <button
            @click="tasksStore.dismissAiSuggestion(s.id)"
            class="btn-brick-dismiss"
            title="Dismiss"
          >
            <X :size="13" />
          </button>
        </div>
        <p class="brick-text">{{ s.suggestion }}</p>
        <button
          @click="tasksStore.acceptAiSuggestion(s.id)"
          class="btn-adopt-pill"
          title="Add to Execution Queue"
        >
          <span>+ Adopt into tasks</span>
          <ArrowUpRight :size="13" />
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.box-suggestions {
  grid-column: span 12;
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

  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 7px;

    .box-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }

  .box-counter {
    font-family: $font-mono;
    font-size: 10px;
    color: $color-text-dim;
  }
}

.suggestions-deck {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;

  .suggestion-brick {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: $radius-md;
    padding: 0.85rem 1rem;
    gap: 0.65rem;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 87, 34, 0.3);
      transform: translateY(-2px);
    }

    .brick-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .brick-tag {
        font-family: $font-mono;
        font-size: 8px;
        letter-spacing: 0.1em;
        color: $color-ember;
        background: rgba(255, 87, 34, 0.1);
        padding: 2px 5px;
        border-radius: $radius-xs;
      }

      .btn-brick-dismiss {
        background: transparent;
        border: none;
        color: $color-text-dim;
        cursor: pointer;
        padding: 2px;
        opacity: 0.6;
        transition: opacity 0.15s ease;

        &:hover {
          opacity: 1;
          color: #ffffff;
        }
      }
    }

    .brick-text {
      font-size: 13px;
      color: #ffffff;
      line-height: 1.45;
      margin: 0;
    }

    .btn-adopt-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: $radius-sm;
      padding: 0.4rem 0.6rem;
      color: $color-text-muted;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(255, 87, 34, 0.2);
        color: $color-ember;
        border-color: rgba(255, 87, 34, 0.4);
      }
    }
  }
}
</style>
