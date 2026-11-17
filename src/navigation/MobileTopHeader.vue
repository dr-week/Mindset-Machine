<script setup lang="ts">
/**
 * MobileTopHeader — Android Native / Mobile Top App Bar
 * Displays active department branding, safe-area top inset, and quick actions.
 */
import { computed } from 'vue'
import { Search, BrainCircuit } from 'lucide-vue-next'
import { NAV_TABS, type NavTab } from '@/navigation/navConfig'
import { useTasksStore } from '@/store/tasks'
import EveningAuditModal from '@/components/EveningAuditModal.vue'

const tasksStore = useTasksStore()

const currentTabInfo = computed<NavTab>(() => {
  return NAV_TABS.find((t) => t.key === tasksStore.currentTab) ?? (NAV_TABS[0] as NavTab)
})

function openCommandPalette(): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
}
</script>

<template>
  <header class="mobile-top-header">
    <div class="header-left">
      <div class="brand-glyph" @click="tasksStore.setTab('dashboard')">
        <BrainCircuit :size="16" class="text-ember" />
      </div>
      <div class="tab-crumb">
        <component :is="currentTabInfo.icon" :size="14" class="tab-icon" />
        <span class="tab-title">{{ currentTabInfo.label }}</span>
      </div>
    </div>

    <div class="header-right">
      <EveningAuditModal />
      <button
        @click="openCommandPalette"
        class="btn-mobile-search"
        aria-label="Command Palette"
        type="button"
      >
        <Search :size="15" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.mobile-top-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: max(10px, env(safe-area-inset-top, 0px)) 14px 10px;
  background: rgba(6, 7, 10, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;

  .brand-glyph {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $radius-xs;
    background: rgba(255, 87, 34, 0.12);
    border: 1px solid rgba(255, 87, 34, 0.28);
    cursor: pointer;
  }

  .tab-crumb {
    display: flex;
    align-items: center;
    gap: 6px;
    .tab-icon {
      color: $color-text-dim;
    }
    .tab-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;

  .btn-mobile-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: $radius-xs;
    color: $color-text-dim;
    cursor: pointer;
    &:active {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.text-ember {
  color: #ff5722;
}
</style>
