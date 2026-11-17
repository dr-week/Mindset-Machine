<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { TimeBlock } from '@/types/mindset'

defineProps<{
  activeTimeBlock: TimeBlock
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()
</script>

<template>
  <div class="active-focus-hero" :class="activeTimeBlock.category">
    <div class="hero-glow-badge">ACTIVE HORIZON NOW</div>
    <div class="hero-content">
      <span class="hero-time">{{ activeTimeBlock.startTime }} — {{ activeTimeBlock.endTime }}</span>
      <h3 class="hero-title">{{ activeTimeBlock.title }}</h3>
      <p v-if="activeTimeBlock.notes" class="hero-notes">{{ activeTimeBlock.notes }}</p>
    </div>
    <button
      @click="emit('toggle', activeTimeBlock.id)"
      class="btn-hero-complete"
      :class="{ done: activeTimeBlock.completed }"
    >
      <Check :size="16" />
      <span>{{ activeTimeBlock.completed ? 'Session Completed' : 'Mark Complete' }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.active-focus-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
  border-radius: $radius-lg;
  background: radial-gradient(120% 120% at 0% 0%, rgba(255, 87, 34, 0.12) 0%, rgba(18, 18, 22, 0.95) 100%);
  border: 1px solid rgba(255, 87, 34, 0.35);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 87, 34, 0.05);
  overflow: hidden;

  &.deep {
    border-color: rgba(239, 68, 68, 0.45);
    background: radial-gradient(120% 120% at 0% 0%, rgba(239, 68, 68, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
  }

  &.vitality {
    border-color: rgba(245, 158, 11, 0.45);
    background: radial-gradient(120% 120% at 0% 0%, rgba(245, 158, 11, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
  }

  &.ritual {
    border-color: rgba(16, 185, 129, 0.45);
    background: radial-gradient(120% 120% at 0% 0%, rgba(16, 185, 129, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
  }

  &.admin {
    border-color: rgba(14, 165, 233, 0.45);
    background: radial-gradient(120% 120% at 0% 0%, rgba(14, 165, 233, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
  }

  &.rest {
    border-color: rgba(167, 139, 250, 0.45);
    background: radial-gradient(120% 120% at 0% 0%, rgba(167, 139, 250, 0.16) 0%, rgba(18, 18, 22, 0.95) 100%);
  }

  .hero-glow-badge {
    position: absolute;
    top: 0.75rem;
    right: 1.25rem;
    font-size: 9.5px;
    letter-spacing: 0.1em;
    font-weight: 700;
    color: #ff5722;
    background: rgba(255, 87, 34, 0.12);
    border: 1px solid rgba(255, 87, 34, 0.28);
    padding: 2px 8px;
    border-radius: $radius-pill;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .hero-time {
      font-size: 11px;
      font-weight: 600;
      color: $color-text-dim;
      letter-spacing: 0.05em;
    }

    .hero-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    .hero-notes {
      font-size: 12px;
      color: $color-text-dim;
      margin: 0;
    }
  }

  .btn-hero-complete {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.55rem 1.15rem;
    background: rgba(255, 87, 34, 0.2);
    border: 1px solid rgba(255, 87, 34, 0.4);
    color: #ff8a65;
    border-radius: $radius-sm;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 87, 34, 0.3);
      color: #fff;
    }

    &.done {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.35);
      color: #34d399;
    }
  }
}
</style>
