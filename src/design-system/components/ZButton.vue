<script setup lang="ts">
/**
 * ZButton — Tactile button atom (Zuari Design System)
 * Variants: 'primary' | 'ghost' | 'icon' | 'danger'
 * Touch-safe: 48×48dp min target, active state for mobile
 */
export type ZButtonVariant = 'primary' | 'ghost' | 'icon' | 'danger'
export type ZButtonSize    = 'sm' | 'md' | 'lg'

withDefaults(defineProps<{
  variant?:  ZButtonVariant
  size?:     ZButtonSize
  loading?:  boolean
  disabled?: boolean
  iconOnly?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  loading: false,
  disabled: false,
  iconOnly: false,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    class="z-btn"
    :class="[`z-btn--${variant}`, `z-btn--${size}`, { 'z-btn--icon': iconOnly, 'z-btn--loading': loading }]"
    :disabled="disabled || loading"
    type="button"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="z-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.z-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--mm-sp-2);
  border: 1px solid transparent;
  border-radius: var(--mm-r-sm);
  font-family: var(--mm-font-sans);
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all var(--mm-dur-micro) var(--mm-ease-std);
  min-height: 32px;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:active:not(:disabled) { opacity: 0.75; transform: scale(0.97); }
}
/* Sizes */
.z-btn--sm  { font-size: 11px; padding: 4px 10px;  min-height: 28px; }
.z-btn--md  { font-size: 13px; padding: 6px 14px;  min-height: 34px; }
.z-btn--lg  { font-size: 15px; padding: 10px 20px; min-height: 44px; }
/* Square icon-only */
.z-btn--icon { padding: 0; width: 34px; height: 34px; border-radius: var(--mm-r-sm); }
.z-btn--icon.z-btn--lg { width: 44px; height: 44px; }
/* Variants */
.z-btn--primary {
  background: linear-gradient(135deg, var(--mm-action), var(--mm-warn));
  color: #fff;
  box-shadow: 0 4px 14px var(--mm-action-glow);
  &:hover:not(:disabled) { filter: brightness(1.1); }
}
.z-btn--ghost {
  background: oklch(100% 0 0 / 0.04);
  border-color: var(--mm-border);
  color: var(--mm-text-dim);
  &:hover:not(:disabled) { color: var(--mm-text-primary); border-color: var(--mm-border-hover); }
}
.z-btn--danger {
  background: oklch(55% 0.22 25 / 0.12);
  border-color: oklch(55% 0.22 25 / 0.3);
  color: var(--mm-danger);
  &:hover:not(:disabled) { background: oklch(55% 0.22 25 / 0.2); }
}
/* Spinner */
.z-btn__spinner {
  width: 13px; height: 13px;
  border: 2px solid currentColor; border-top-color: transparent;
  border-radius: 50%;
  animation: z-spin 0.7s linear infinite;
}
@keyframes z-spin { to { transform: rotate(360deg); } }
</style>
