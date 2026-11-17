<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'

defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  (e: 'undo'): void
}>()
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="undo-toast-anchor">
      <div class="undo-toast-bubble">
        <span class="toast-text">{{ message }}</span>
        <button @click="emit('undo')" class="btn-toast-undo" type="button">
          <RotateCcw :size="12" />
          <span>UNDO (Ctrl+Z)</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.undo-toast-anchor {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;

  @media (max-width: 600px) {
    bottom: calc(76px + env(safe-area-inset-bottom, 0px));
    right: 14px;
    left: 14px;
    display: flex;
    justify-content: center;
  }
}

.undo-toast-bubble {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 87, 34, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 87, 34, 0.15);
  border-radius: $radius-md;
  padding: 8px 14px;
  color: #fff;
  font-size: 12px;
}

.btn-toast-undo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 87, 34, 0.2);
  border: 1px solid rgba(255, 87, 34, 0.4);
  border-radius: $radius-xs;
  color: #ff7a45;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  cursor: pointer;
  &:hover { background: rgba(255, 87, 34, 0.3); color: #fff; }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
