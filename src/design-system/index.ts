/**
 * Design System — Public barrel export
 * Always import design system atoms from HERE, not from individual files.
 *
 * Usage:
 *   import { ZCard, ZButton, ZBadge } from '@/design-system'
 */

// ── Atoms ────────────────────────────────────────────────────────────────────
export { default as ZCard }   from './components/ZCard.vue'
export { default as ZButton } from './components/ZButton.vue'
export { default as ZInput }  from './components/ZInput.vue'
export { default as ZBadge }  from './components/ZBadge.vue'
export { default as ZSwitch } from './components/ZSwitch.vue'
export { default as ZDialog } from './components/ZDialog.vue'

// ── Type exports ─────────────────────────────────────────────────────────────
export type { ZCardVariant }   from './components/ZCard.vue'
export type { ZButtonVariant, ZButtonSize } from './components/ZButton.vue'
export type { ZBadgeVariant }  from './components/ZBadge.vue'

// ── Design token constants (JS-side values) ───────────────────────────────────
export const DESIGN_TOKENS = {
  radius:   { xs: '4px', sm: '6px', md: '10px', card: '14px', lg: '20px', xl: '28px', pill: '9999px' },
  spacing:  { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 12: 48 },
  duration: { micro: 150, standard: 200, page: 280 },
  easing:   { standard: 'cubic-bezier(0.4, 0, 0.2, 1)', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  color: {
    action:  '#ff5722',
    accent:  'oklch(75% 0.18 190)',
    success: '#10b981',
    warn:    '#f59e0b',
    danger:  '#ef4444',
  },
} as const
