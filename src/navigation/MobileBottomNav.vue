<script setup lang="ts">
/**
 * MobileBottomNav — Android-native bottom navigation bar
 * Shows 4 primary tabs + "More" button that opens NavOverflowSheet
 * Respects Android safe-area insets for gesture navigation
 */
import { computed } from 'vue'
import { EllipsisVertical } from 'lucide-vue-next'
import { PRIMARY_TABS } from '@/navigation/navConfig'
import { useTasksStore } from '@/store/tasks'
import { useUiStore } from '@/store/ui'

const tasksStore = useTasksStore()
const uiStore = useUiStore()

const currentTab = computed(() => tasksStore.currentTab)
const isMoreActive = computed(() => {
  return !PRIMARY_TABS.some(t => t.key === currentTab.value)
})

function selectTab(key: Parameters<typeof tasksStore.setTab>[0]) {
  tasksStore.setTab(key)
  uiStore.closeNavSheet()
}
</script>

<template>
  <nav class="mobile-bottom-nav" role="navigation" aria-label="Main navigation">
    <button
      v-for="tab in PRIMARY_TABS"
      :key="tab.key"
      class="nav-tab"
      :class="{ active: currentTab === tab.key }"
      @click="selectTab(tab.key)"
      :aria-label="tab.label"
      :aria-current="currentTab === tab.key ? 'page' : undefined"
      type="button"
    >
      <div class="tab-indicator" />
      <component :is="tab.icon" :size="22" class="tab-icon" />
      <span class="tab-label">{{ tab.shortLabel }}</span>
    </button>

    <!-- More button → overflow sheet -->
    <button
      class="nav-tab"
      :class="{ active: isMoreActive }"
      @click="uiStore.toggleNavSheet()"
      aria-label="More navigation options"
      type="button"
    >
      <div class="tab-indicator" />
      <EllipsisVertical :size="22" class="tab-icon" />
      <span class="tab-label">More</span>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.mobile-bottom-nav {
  display: flex;
  align-items: stretch;
  background: rgba(10, 11, 18, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: calc(56px + env(safe-area-inset-bottom, 0px));
}

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 48px;
  min-width: 48px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  position: relative;
  transition: color 150ms ease;
  -webkit-tap-highlight-color: transparent;

  &:active { opacity: 0.7; }

  &.active {
    color: #ff5722;
    .tab-indicator { opacity: 1; transform: scaleX(1); }
  }
}

.tab-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 32px;
  height: 2px;
  background: #ff5722;
  border-radius: 0 0 2px 2px;
  opacity: 0;
  transition: opacity 150ms ease, transform 150ms ease;
}

.tab-icon { flex-shrink: 0; }
.tab-label { font-size: 10px; font-weight: 600; letter-spacing: 0.02em; }
</style>
