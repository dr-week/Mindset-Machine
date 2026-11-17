<script setup lang="ts">
/**
 * NavOverflowSheet — Bottom sheet for secondary navigation tabs (mobile)
 * Slides up from bottom when "More" is tapped in MobileBottomNav
 * Closes on backdrop tap or tab selection
 */
import { SECONDARY_TABS } from '@/navigation/navConfig'
import { useTasksStore } from '@/store/tasks'
import { useUiStore } from '@/store/ui'
import { X } from 'lucide-vue-next'

const tasksStore = useTasksStore()
const uiStore = useUiStore()

defineProps<{ open: boolean }>()

function selectTab(key: Parameters<typeof tasksStore.setTab>[0]) {
  tasksStore.setTab(key)
  uiStore.closeNavSheet()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet-backdrop" @click.self="uiStore.closeNavSheet()">
        <div class="sheet-panel" role="dialog" aria-label="More navigation options">
          <div class="sheet-handle" />
          <header class="sheet-header">
            <span class="sheet-title">More Departments</span>
            <button class="close-btn" @click="uiStore.closeNavSheet()" aria-label="Close" type="button">
              <X :size="18" />
            </button>
          </header>
          <div class="sheet-grid">
            <button
              v-for="tab in SECONDARY_TABS"
              :key="tab.key"
              class="sheet-tile"
              :class="{ active: tasksStore.currentTab === tab.key }"
              @click="selectTab(tab.key)"
              :aria-label="tab.label"
              type="button"
            >
              <component :is="tab.icon" :size="22" class="tile-icon" />
              <span class="tile-label">{{ tab.shortLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.sheet-backdrop {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
}

.sheet-panel {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: #0f1018;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px 20px 0 0;
  padding: 12px 18px calc(24px + env(safe-area-inset-bottom, 0px));
}

.sheet-handle {
  width: 36px; height: 4px; border-radius: 2px;
  background: rgba(255,255,255,0.18);
  margin: 0 auto 14px;
}

.sheet-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  .sheet-title { font-size: 14px; font-weight: 700; color: #fff; }
  .close-btn { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 6px; }
}

.sheet-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sheet-tile {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  padding: 12px 6px; border-radius: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.65); cursor: pointer; min-height: 68px;
  -webkit-tap-highlight-color: transparent;
  transition: background 150ms ease, color 150ms ease;
  &:active, &.active { background: rgba(255,87,34,0.15); color: #ff5722; border-color: rgba(255,87,34,0.35); }
  .tile-label { font-size: 11px; font-weight: 600; }
}

.sheet-enter-active, .sheet-leave-active { transition: opacity 200ms ease; .sheet-panel { transition: transform 250ms cubic-bezier(0.4,0,0.2,1); } }
.sheet-enter-from, .sheet-leave-to { opacity: 0; .sheet-panel { transform: translateY(100%); } }
</style>
