<script setup lang="ts">
/**
 * ZBadge — Micro-badge / chip atom (Zuari Design System)
 * Variants: 'default' | 'accent' | 'success' | 'warn' | 'danger'
 */
export type ZBadgeVariant = 'default' | 'accent' | 'success' | 'warn' | 'danger'

withDefaults(defineProps<{
  variant?: ZBadgeVariant
  dot?:     boolean
  pill?:    boolean
}>(), {
  variant: 'default',
  dot: false,
  pill: true,
})
</script>

<template>
  <span class="z-badge" :class="[`z-badge--${variant}`, { 'z-badge--pill': pill }]">
    <span v-if="dot" class="z-badge__dot" />
    <slot />
  </span>
</template>

<style scoped>
.z-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: var(--mm-r-sm);
  border: 1px solid transparent;
  line-height: 1.4;
}
.z-badge--pill { border-radius: var(--mm-r-pill); }

.z-badge--default  { background: oklch(100% 0 0 / 0.06); color: var(--mm-text-secondary); border-color: var(--mm-border); }
.z-badge--accent   { background: oklch(65% 0.22 32 / 0.12); color: oklch(75% 0.22 32); border-color: oklch(65% 0.22 32 / 0.3); }
.z-badge--success  { background: oklch(65% 0.18 150 / 0.12); color: var(--mm-success); border-color: oklch(65% 0.18 150 / 0.3); }
.z-badge--warn     { background: oklch(78% 0.16 85 / 0.12); color: var(--mm-warn); border-color: oklch(78% 0.16 85 / 0.3); }
.z-badge--danger   { background: oklch(55% 0.22 25 / 0.12); color: var(--mm-danger); border-color: oklch(55% 0.22 25 / 0.3); }

.z-badge__dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
</style>
