/**
 * UI Store — global UI-only state (tab navigation, modals, breakpoint)
 * Separates UI concerns from data concerns in tasks.ts
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ActiveTab } from '@/types/mindset'

export type ModalId = 'eveningAudit' | 'commandPalette' | 'navOverflow' | null

export const useUiStore = defineStore('ui', () => {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const activeModal = ref<ModalId>(null)

  // ── Bottom sheet (mobile overflow nav) & Zuari Drawer Plane ─────────────────
  const isNavSheetOpen = ref(false)
  const isCloudDrawerOpen = ref(false)

  // ── Toast / Notification ────────────────────────────────────────────────────
  const toastMessage = ref('')
  const toastVisible = ref(false)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  // ── Computed ─────────────────────────────────────────────────────────────────
  const hasActiveModal = computed(() => activeModal.value !== null)

  // ── Actions ──────────────────────────────────────────────────────────────────
  function openModal(id: ModalId) { activeModal.value = id }
  function closeModal() { activeModal.value = null }

  function openNavSheet()  { isNavSheetOpen.value = true }
  function closeNavSheet() { isNavSheetOpen.value = false }
  function toggleNavSheet() { isNavSheetOpen.value = !isNavSheetOpen.value }

  function openCloudDrawer() { isCloudDrawerOpen.value = true }
  function closeCloudDrawer() { isCloudDrawerOpen.value = false }
  function toggleCloudDrawer() { isCloudDrawerOpen.value = !isCloudDrawerOpen.value }

  function showToast(message: string, durationMs = 3000) {
    toastMessage.value = message
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toastVisible.value = false }, durationMs)
  }

  function hideToast() {
    toastVisible.value = false
    if (toastTimer) clearTimeout(toastTimer)
  }

  return {
    activeModal, isNavSheetOpen, isCloudDrawerOpen, toastMessage, toastVisible, hasActiveModal,
    openModal, closeModal, openNavSheet, closeNavSheet, toggleNavSheet,
    openCloudDrawer, closeCloudDrawer, toggleCloudDrawer,
    showToast, hideToast,
  }
})
