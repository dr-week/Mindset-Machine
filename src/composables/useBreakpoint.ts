/**
 * useBreakpoint — Reactive viewport breakpoint detection
 * Compact  (<600px)  → mobile  → MobileShell  + BottomNav
 * Medium   (600–899) → tablet  → TabletShell  + NavRail
 * Expanded (≥900px)  → desktop → DesktopShell + ApexHeaderDock
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

export type Breakpoint = 'compact' | 'medium' | 'expanded'

const COMPACT_MAX = 599
const MEDIUM_MAX = 899

function getBreakpoint(w: number): Breakpoint {
  if (w <= COMPACT_MAX) return 'compact'
  if (w <= MEDIUM_MAX) return 'medium'
  return 'expanded'
}

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const breakpoint = computed<Breakpoint>(() => getBreakpoint(width.value))

  const isMobile  = computed(() => breakpoint.value === 'compact')
  const isTablet  = computed(() => breakpoint.value === 'medium')
  const isDesktop = computed(() => breakpoint.value === 'expanded')

  let observer: ResizeObserver | null = null

  function onResize() {
    width.value = window.innerWidth
  }

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize)
      observer.observe(document.documentElement)
    } else {
      window.addEventListener('resize', onResize, { passive: true })
    }
    onResize()
  })

  onUnmounted(() => {
    observer?.disconnect()
    window.removeEventListener('resize', onResize)
  })

  return { width, breakpoint, isMobile, isTablet, isDesktop }
}
