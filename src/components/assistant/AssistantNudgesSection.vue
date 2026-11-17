<script setup lang="ts">
import { Flame, Zap } from 'lucide-vue-next'
import type { MotivationNudge } from '@/types/assistant'

defineProps<{
  nudges: MotivationNudge[]
}>()

const emit = defineEmits<{
  (e: 'select-nudge', nudge: MotivationNudge): void
}>()
</script>

<template>
  <div class="assistant-section">
    <div class="section-title">
      <Flame :size="15" class="text-ember" />
      <span>PSYCHOLOGICAL WORK ACCELERATORS (OVERCOME FRICTION)</span>
    </div>
    <div class="nudges-grid">
      <div v-for="n in nudges" :key="n.id" class="nudge-card">
        <div class="nudge-top">
          <span class="nudge-method">{{ n.method.replace(/_/g, ' ').toUpperCase() }}</span>
          <span class="nudge-xp">+{{ n.xpBonus }} XP</span>
        </div>
        <h4 class="nudge-headline">{{ n.headline }}</h4>
        <p class="nudge-subtext">{{ n.subtext }}</p>
        <button @click="emit('select-nudge', n)" class="btn-nudge-cta" type="button">
          <Zap :size="12" />
          <span>{{ n.callToAction }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.assistant-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: $color-text-dim;
  }
}
.nudges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.nudge-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .nudge-top {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    font-weight: 700;
    .nudge-method { color: #ff7a45; letter-spacing: 0.08em; }
    .nudge-xp { color: #10b981; }
  }
  .nudge-headline { font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0; }
  .nudge-subtext { font-size: 0.75rem; color: $color-text-muted; line-height: 1.4; margin: 0; flex: 1; }
  .btn-nudge-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: $radius-xs;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    cursor: pointer;
    &:hover { background: #ff5722; border-color: #ff5722; }
  }
}
.text-ember { color: #f59e0b; }
</style>
