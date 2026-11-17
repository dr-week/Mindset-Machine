<script setup lang="ts">
/**
 * ZCard — Base glass card atom (Zuari Design System)
 * Wraps any content in the standard glassmorphism card surface.
 * Variants: 'default' | 'elevated' | 'accent' | 'danger'
 */
export type ZCardVariant = 'default' | 'elevated' | 'accent' | 'danger'

withDefaults(defineProps<{
  variant?: ZCardVariant
  padding?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
}>(), {
  variant: 'default',
  padding: 'md',
  fullHeight: false,
})
</script>

<template>
  <div
    class="z-card"
    :class="[`z-card--${variant}`, `z-card--pad-${padding}`, { 'z-card--full-h': fullHeight }]"
  >
    <slot />
  </div>
</template>

<style scoped>
.z-card {
  border-radius: var(--mm-r-card);
  background: var(--mm-bg-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--mm-border);
  color: var(--mm-text-primary);
  box-shadow: 0 12px 32px -8px oklch(0% 0 0 / 0.35);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: border-color var(--mm-dur-std) var(--mm-ease-std),
              box-shadow   var(--mm-dur-std) var(--mm-ease-std);
}
.z-card--pad-sm { padding: var(--mm-sp-3); }
.z-card--pad-md { padding: var(--mm-sp-5) var(--mm-sp-6); }
.z-card--pad-lg { padding: var(--mm-sp-6) var(--mm-sp-8); }
.z-card--full-h { height: 100%; }

.z-card--elevated {
  background: var(--mm-bg-elevated);
  box-shadow: 0 20px 48px -10px oklch(0% 0 0 / 0.5);
}
.z-card--accent {
  border-color: oklch(65% 0.22 32 / 0.3);
  background: radial-gradient(130% 130% at 0% 0%,
    oklch(65% 0.22 32 / 0.08) 0%,
    var(--mm-bg-surface) 100%);
}
.z-card--danger {
  border-color: oklch(55% 0.22 25 / 0.35);
}
</style>
