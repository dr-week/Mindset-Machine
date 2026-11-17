<script setup lang="ts">
import { Sparkles, RefreshCw, Zap } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import HunterStatusProfile from './hunter/HunterStatusProfile.vue'

const tasksStore = useTasksStore()
</script>

<template>
  <section class="bento-box box-ai-directive zuari-card">
    <HunterStatusProfile :stats="tasksStore.hunterStats" />

    <div class="directive-content">
      <div class="badge-spark">
        <Sparkles :size="12" class="text-ember" />
        <span>AI DIRECTIVE</span>
      </div>
      <p class="directive-quote">“{{ tasksStore.aiMotivation }}”</p>
    </div>

    <div class="directive-actions">
      <button
        @click="tasksStore.refreshMotivation()"
        :disabled="tasksStore.loadingAi"
        class="btn-icon-tactile"
        title="Refresh Perspective"
        type="button"
      >
        <RefreshCw :size="13" :class="{ spin: tasksStore.loadingAi }" />
      </button>
      <button
        @click="tasksStore.generateAiTasks()"
        :disabled="tasksStore.loadingAi"
        class="btn-ember-action"
        type="button"
      >
        <Zap :size="13" />
        <span>{{ tasksStore.loadingAi ? 'Synthesizing...' : 'Predict Next Moves' }}</span>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-ai-directive {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  background: radial-gradient(130% 130% at 0% 0%, rgba(255, 87, 34, 0.08) 0%, rgba(18, 18, 22, 0.95) 100%);
  border: 1px solid rgba(255, 87, 34, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 87, 34, 0.04);
  position: relative;
  overflow: hidden;
  padding: 1.25rem 1.4rem;
  border-radius: $radius-lg;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 87, 34, 0.6), transparent);
  }
}

.directive-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  .badge-spark {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #ff7a45;
  }
  .directive-quote {
    font-size: 0.95rem;
    font-weight: 500;
    color: #fff;
    line-height: 1.45;
  }
}

.directive-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  .btn-icon-tactile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: $radius-sm;
    color: $color-text-dim;
    cursor: pointer;
    &:hover { color: #fff; border-color: rgba(255, 255, 255, 0.2); }
  }
  .btn-ember-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #ff5722, #f59e0b);
    border: none;
    border-radius: $radius-sm;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 6px 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.25);
    &:hover { filter: brightness(1.1); }
  }
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.text-ember { color: #f59e0b; }
</style>
