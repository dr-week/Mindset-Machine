<script setup lang="ts">
/**
 * AppShell — Root layout orchestrator
 * Selects the correct shell (Mobile / Tablet / Desktop) based on breakpoint.
 * Viewport-conditional rendering & safe-area insets.
 */
import { computed } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useUiStore } from '@/store/ui'
import MobileBottomNav from '@/navigation/MobileBottomNav.vue'
import MobileTopHeader from '@/navigation/MobileTopHeader.vue'
import NavOverflowSheet from '@/navigation/NavOverflowSheet.vue'
import ApexHeaderDock from '@/navigation/ApexHeaderDock.vue'
import CommandPalette from '@/navigation/CommandPalette.vue'
import GoogleCloudDrawer from '@/navigation/GoogleCloudDrawer.vue'

const { isMobile, isTablet } = useBreakpoint()
const uiStore = useUiStore()

const showBottomNav = computed(() => isMobile.value)
const showTopDock   = computed(() => !isMobile.value) // tablet + desktop
const showNavRail   = computed(() => isTablet.value)

// Content area bottom padding to clear the bottom nav with breathing room
const contentStyle = computed(() => ({
  paddingBottom: isMobile.value
    ? 'calc(70px + env(safe-area-inset-bottom, 0px))'
    : '0px',
  paddingLeft: showNavRail.value ? '72px' : '0px',
}))
</script>

<template>
  <div class="app-shell">
    <!-- Desktop / Tablet: sticky top header -->
    <ApexHeaderDock v-if="showTopDock" />

    <!-- Mobile: sticky top app bar with safe-area top inset -->
    <MobileTopHeader v-if="isMobile" />

    <!-- Main content container -->
    <main class="shell-content" :style="contentStyle">
      <slot />
    </main>

    <!-- Mobile bottom navigation -->
    <MobileBottomNav v-if="showBottomNav" />

    <!-- Mobile overflow bottom sheet -->
    <NavOverflowSheet :open="uiStore.isNavSheetOpen" />

    <!-- Zuari Drawer Plane: Google Account, Drive Minimal DB, Fit & Gemini -->
    <GoogleCloudDrawer :open="uiStore.isCloudDrawerOpen" />

    <!-- Global overlays -->
    <CommandPalette />
  </div>
</template>

<style lang="scss" scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #06070a;
  color: #fff;
}

.shell-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: padding 200ms ease;
}
</style>
