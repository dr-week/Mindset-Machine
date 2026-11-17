<script setup lang="ts">
/**
 * ApexHeaderDock — Desktop/tablet top navigation bar
 * Moved to /navigation/ department. Single source: navConfig.ts
 * Mobile: hidden (MobileBottomNav takes over)
 */
import { BrainCircuit, Search } from 'lucide-vue-next'
import { NAV_TABS } from '@/navigation/navConfig'
import { useTasksStore } from '@/store/tasks'
import { useUiStore } from '@/store/ui'
import EveningAuditModal from '@/components/EveningAuditModal.vue'

const tasksStore = useTasksStore()
const uiStore = useUiStore()

function openCommandPalette() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
}
</script>

<template>
  <header class="apex-dock">
    <!-- Brand -->
    <div class="dock-brand">
      <div class="brand-mark"><BrainCircuit :size="17" /></div>
      <div class="brand-text">
        <span class="brand-name">MINDSET</span>
        <span class="brand-badge">PRO</span>
      </div>
    </div>

    <!-- Tab nav -->
    <nav class="dock-nav" aria-label="Main navigation">
      <button
        v-for="tab in NAV_TABS"
        :key="tab.key"
        class="dock-tab"
        :class="{ active: tasksStore.currentTab === tab.key }"
        @click="tasksStore.setTab(tab.key)"
        :title="tab.label"
        :aria-label="tab.label"
        :aria-current="tasksStore.currentTab === tab.key ? 'page' : undefined"
        type="button"
      >
        <component :is="tab.icon" :size="15" />
        <span v-if="tab.key === 'ai' && tasksStore.aiSuggestedTasks.length > 0" class="tab-counter">
          {{ tasksStore.aiSuggestedTasks.length }}
        </span>
      </button>
    </nav>

    <!-- Right actions -->
    <div class="dock-actions">
      <EveningAuditModal />
      <button class="cmd-btn" @click="openCommandPalette" title="Command Palette (Ctrl+K)" type="button">
        <Search :size="12" />
        <kbd>Ctrl+K</kbd>
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.apex-dock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 52px;
  padding: 0 16px;
  background: rgba(10, 11, 18, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dock-brand {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  .brand-mark {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,87,34,0.14); border: 1px solid rgba(255,87,34,0.28);
    border-radius: 8px; color: #ff5722;
  }
  .brand-name { font-size: 13px; font-weight: 800; letter-spacing: 0.04em; }
  .brand-badge { font-size: 8px; font-weight: 700; color: $color-text-dim;
    background: rgba(255,255,255,0.07); padding: 1px 4px; border-radius: 3px; }
}

.dock-nav {
  display: flex; align-items: center; gap: 2px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 999px;
  padding: 3px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.dock-tab {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: none; border-radius: 999px;
  background: transparent; color: $color-text-dim;
  cursor: pointer; transition: all var(--mm-dur-micro) var(--mm-ease-std);
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  &:hover { color: #fff; }
  &.active { background: #ff5722; color: #fff; }
}
.tab-counter {
  position: absolute; top: 1px; right: 1px;
  width: 12px; height: 12px;
  background: #ef4444; color: #fff;
  border-radius: 50%; font-size: 7px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}

.dock-actions {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  .cmd-btn {
    display: flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 4px 8px;
    color: $color-text-dim; font-size: 11px; cursor: pointer;
    kbd { font-family: $font-mono; font-size: 9px; background: rgba(255,255,255,0.06); padding: 1px 3px; border-radius: 2px; }
    &:hover { color: #fff; }
  }
}
</style>
