<script setup lang="ts">
import { Clock, Sparkles } from 'lucide-vue-next'
import type { ActivityEvent } from '@/types/mindset'

defineProps<{
  events: ActivityEvent[]
}>()

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Today'
  }
}
</script>

<template>
  <div class="ledger-section">
    <div class="section-head">
      <div class="head-left">
        <Clock :size="14" class="text-ember" />
        <span>CHRONOLOGICAL ACTIVITY STREAM ({{ events.length }})</span>
      </div>
    </div>

    <div v-if="events.length === 0" class="empty-state">
      <Sparkles :size="24" class="text-muted" />
      <p>No activity recorded yet today. Complete tasks, habits, or focus blocks to log telemetry.</p>
    </div>

    <div v-else class="timeline-list">
      <div
        v-for="item in events"
        :key="item.id"
        class="timeline-item"
        :class="`type-${item.type}`"
      >
        <div class="item-time">
          {{ formatTime(item.timestamp) }}
        </div>

        <div class="item-icon-marker">
          <span class="marker-emoji">{{ item.icon }}</span>
        </div>

        <div class="item-content">
          <div class="item-header">
            <span class="item-title">{{ item.title }}</span>
            <span v-if="item.xpDelta" class="item-xp">+{{ item.xpDelta }} XP</span>
          </div>
          <span v-if="item.details" class="item-details">{{ item.details }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ledger-section {
  .section-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-text-secondary, #a1a1aa);
    margin-bottom: 16px;
    .head-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--color-text-muted, #71717a);
  font-size: 0.85rem;
  text-align: center;
}
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm, 6px);
  .item-time {
    font-size: 0.7rem;
    color: var(--color-text-dim, #52525b);
    min-width: 50px;
    padding-top: 2px;
  }
  .item-icon-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    line-height: 1;
  }
  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-primary, #ffffff);
      }
      .item-xp {
        font-size: 0.7rem;
        font-weight: 700;
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
        padding: 1px 6px;
        border-radius: 4px;
      }
    }
    .item-details {
      font-size: 0.75rem;
      color: var(--color-text-muted, #71717a);
    }
  }
}
.text-ember { color: #f59e0b; }
.text-muted { color: #71717a; }
</style>
