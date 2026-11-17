<script setup lang="ts">
import type { HunterStats } from '@/types/mindset'

defineProps<{
  stats: HunterStats
}>()
</script>

<template>
  <div class="hunter-status-card">
    <div class="hunter-rank-crest" :class="`rank-${stats.rank}`">
      <span class="rank-letter">{{ stats.rank }}</span>
      <span class="rank-sub">RANK</span>
    </div>
    <div class="hunter-meta">
      <div class="hunter-title-row">
        <span class="hunter-name">SHADOW AWAKENED</span>
        <span class="hunter-badge">LVL {{ stats.level }}</span>
        <span class="hunter-epithet">{{ stats.title }}</span>
      </div>
      <div class="hunter-xp-bar-track" :title="`XP: ${stats.xp}`">
        <div class="hunter-xp-fill" :style="{ width: `${stats.xp % 100}%` }"></div>
      </div>
      <div class="hunter-attributes-row">
        <span class="attr-pip">⚔️ STR <b>{{ stats.strength }}</b></span>
        <span class="attr-pip">⚡ INT <b>{{ stats.intellect }}</b></span>
        <span class="attr-pip">🛡️ VIT <b>{{ stats.vitality }}</b></span>
        <span class="attr-pip">🔥 DIS <b>{{ stats.discipline }}</b></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

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

    &.rank-E { border-color: #64748b; background: rgba(100, 116, 139, 0.15); color: #94a3b8; }
    &.rank-D { border-color: #10b981; background: rgba(16, 185, 129, 0.15); color: #34d399; box-shadow: 0 0 12px rgba(16, 185, 129, 0.3); }
    &.rank-C { border-color: #0ea5e9; background: rgba(14, 165, 233, 0.15); color: #38bdf8; box-shadow: 0 0 14px rgba(14, 165, 233, 0.35); }
    &.rank-B { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.15); color: #a78bfa; box-shadow: 0 0 16px rgba(139, 92, 246, 0.4); }
    &.rank-A { border-color: #f59e0b; background: rgba(245, 158, 11, 0.15); color: #fbbf24; box-shadow: 0 0 18px rgba(245, 158, 11, 0.45); }
    &.rank-S {
      border-color: #ec4899;
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(168, 85, 247, 0.25));
      color: #f472b6;
      box-shadow: 0 0 22px rgba(236, 72, 153, 0.6);
      animation: sRankPulse 2s infinite alternate;
    }

    .rank-letter { font-size: 1.35rem; font-weight: 900; line-height: 1; }
    .rank-sub { font-size: 0.5rem; letter-spacing: 0.12em; font-weight: 700; margin-top: 1px; }
  }

  .hunter-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    .hunter-title-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.35rem 0.5rem;
      .hunter-name { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; color: #fff; }
      .hunter-badge {
        font-size: 0.65rem;
        font-weight: 700;
        background: rgba(255, 87, 34, 0.15);
        color: #ff7a45;
        border: 1px solid rgba(255, 87, 34, 0.3);
        padding: 1px 5px;
        border-radius: 4px;
      }
      .hunter-epithet { font-size: 0.7rem; color: $color-text-dim; font-style: italic; }
    }

    .hunter-xp-bar-track {
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 9999px;
      overflow: hidden;
      .hunter-xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff5722, #f59e0b);
        border-radius: 9999px;
        transition: width 0.5s ease;
      }
    }

    .hunter-attributes-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem 0.65rem;
      .attr-pip {
        font-size: 0.65rem;
        color: $color-text-muted;
        b { color: #fff; font-weight: 700; margin-left: 2px; }
      }
    }
  }
}

@keyframes sRankPulse {
  from { filter: drop-shadow(0 0 4px #ec4899); }
  to { filter: drop-shadow(0 0 14px #ec4899); }
}
</style>
