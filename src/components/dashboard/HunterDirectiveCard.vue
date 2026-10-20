<script setup lang="ts">
import { Sparkles, RefreshCw, Zap } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()
</script>

<template>
  <section class="bento-box box-ai-directive zuari-card">
    <div class="hunter-status-card">
      <div class="hunter-rank-crest" :class="`rank-${tasksStore.hunterStats.rank}`">
        <span class="rank-letter">{{ tasksStore.hunterStats.rank }}</span>
        <span class="rank-sub">RANK</span>
      </div>
      <div class="hunter-meta">
        <div class="hunter-title-row">
          <span class="hunter-name">SHADOW AWAKENED</span>
          <span class="hunter-badge">LVL {{ tasksStore.hunterStats.level }}</span>
          <span class="hunter-epithet">{{ tasksStore.hunterStats.title }}</span>
        </div>
        <div class="hunter-xp-bar-track" :title="`XP: ${tasksStore.hunterStats.xp}`">
          <div
            class="hunter-xp-fill"
            :style="{ width: `${(tasksStore.hunterStats.xp % 100)}%` }"
          ></div>
        </div>
        <div class="hunter-attributes-row">
          <span class="attr-pip">⚔️ STR <b>{{ tasksStore.hunterStats.strength }}</b></span>
          <span class="attr-pip">⚡ INT <b>{{ tasksStore.hunterStats.intellect }}</b></span>
          <span class="attr-pip">🛡️ VIT <b>{{ tasksStore.hunterStats.vitality }}</b></span>
          <span class="attr-pip">🔥 DIS <b>{{ tasksStore.hunterStats.discipline }}</b></span>
        </div>
      </div>
    </div>

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
      >
        <RefreshCw :size="13" :class="{ spin: tasksStore.loadingAi }" />
      </button>
      <button
        @click="tasksStore.generateAiTasks()"
        :disabled="tasksStore.loadingAi"
        class="btn-ember-action"
      >
        <Zap :size="13" />
        <span>{{ tasksStore.loadingAi ? 'Synthesizing...' : 'Predict Next Moves' }}</span>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.box-ai-directive {
  grid-column: span 12;
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

.hunter-status-card {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .hunter-rank-crest {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    border: 1.5px solid;
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);

    &.rank-E {
      border-color: #64748b;
      background: rgba(100, 116, 139, 0.15);
      color: #94a3b8;
    }
    &.rank-D {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
    }
    &.rank-C {
      border-color: #0ea5e9;
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      box-shadow: 0 0 14px rgba(14, 165, 233, 0.35);
    }
    &.rank-B {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa;
      box-shadow: 0 0 16px rgba(139, 92, 246, 0.4);
    }
    &.rank-A {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      box-shadow: 0 0 18px rgba(245, 158, 11, 0.45);
    }
    &.rank-S {
      border-color: #ff5722;
      background: rgba(255, 87, 34, 0.2);
      color: #ff7a45;
      box-shadow: 0 0 22px rgba(255, 87, 34, 0.6);
      animation: pulse 2s infinite ease-in-out;
    }

    .rank-letter {
      font-family: $font-mono;
      font-size: 20px;
      font-weight: 800;
      line-height: 1;
    }

    .rank-sub {
      font-size: 7px;
      font-family: $font-mono;
      letter-spacing: 0.1em;
      opacity: 0.7;
      margin-top: 2px;
    }
  }

  .hunter-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    .hunter-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .hunter-name {
        font-family: $font-mono;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #ffffff;
      }

      .hunter-badge {
        font-family: $font-mono;
        font-size: 9px;
        padding: 2px 6px;
        border-radius: $radius-xs;
        background: rgba(255, 87, 34, 0.15);
        border: 1px solid rgba(255, 87, 34, 0.3);
        color: $color-ember;
        font-weight: 700;
      }

      .hunter-epithet {
        font-size: 11px;
        color: $color-text-dim;
        font-style: italic;
      }
    }

    .hunter-xp-bar-track {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: $radius-pill;
      overflow: hidden;

      .hunter-xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff7a45, #ff5722);
        box-shadow: 0 0 8px rgba(255, 87, 34, 0.8);
        transition: width 0.4s ease;
      }
    }

    .hunter-attributes-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .attr-pip {
        font-family: $font-mono;
        font-size: 9px;
        color: $color-text-muted;

        b {
          color: #ffffff;
        }
      }
    }
  }
}

.directive-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .badge-spark {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: $font-mono;
    font-size: 9.5px;
    letter-spacing: 0.1em;
    color: $color-ember;
  }

  .directive-quote {
    font-size: 15px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 500;
    margin: 0;
  }
}

.directive-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;

  .btn-icon-tactile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: $color-text-muted;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255, 87, 34, 0.3) 0%, rgba(255, 87, 34, 0.5) 100%);
      box-shadow: 0 0 15px rgba(255, 87, 34, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
