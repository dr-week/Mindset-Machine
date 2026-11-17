<script setup lang="ts">
/**
 * ZDialog — Accessible modal dialog atom (Zuari Design System)
 * Uses native <dialog> for a11y + focus trap. Teleports to body.
 * Emits 'close' on backdrop click or Escape key.
 */
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  open:   boolean
  title?: string
  width?: string
}>(), { width: '480px' })

const emit = defineEmits<{ close: [] }>()
const dialogRef = ref<HTMLDialogElement | null>(null)

watch(() => props.open, (val) => {
  if (!dialogRef.value) return
  val ? dialogRef.value.showModal() : dialogRef.value.close()
})

function onBackdrop(e: MouseEvent) {
  const r = dialogRef.value?.getBoundingClientRect()
  if (!r) return
  const outside = e.clientX < r.left || e.clientX > r.right
                || e.clientY < r.top  || e.clientY > r.bottom
  if (outside) emit('close')
}
function onEsc() { emit('close') }

onMounted(() => document.addEventListener('keydown', (e) => { if (e.key === 'Escape') onEsc() }))
onUnmounted(() => document.removeEventListener('keydown', onEsc))
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="z-dialog"
      :style="{ maxWidth: width }"
      @click="onBackdrop"
    >
      <div class="z-dialog__inner" @click.stop>
        <header v-if="title" class="z-dialog__header">
          <h2 class="z-dialog__title">{{ title }}</h2>
          <button class="z-dialog__close" @click="emit('close')" type="button" aria-label="Close">✕</button>
        </header>
        <div class="z-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" class="z-dialog__footer"><slot name="footer" /></footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.z-dialog {
  position: fixed;
  margin: auto;
  inset: 0;
  width: calc(100% - 32px);
  max-height: 90dvh;
  padding: 0;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-r-lg);
  background: var(--mm-bg-elevated);
  color: var(--mm-text-primary);
  box-shadow: 0 24px 64px -16px oklch(0% 0 0 / 0.6);
  backdrop-filter: blur(24px);
  &::backdrop { background: var(--mm-bg-overlay); backdrop-filter: blur(4px); }
}
.z-dialog__inner { display: flex; flex-direction: column; overflow: hidden; }
.z-dialog__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--mm-sp-5) var(--mm-sp-6) var(--mm-sp-3);
  border-bottom: 1px solid var(--mm-border);
}
.z-dialog__title { font-size: 15px; font-weight: 700; margin: 0; }
.z-dialog__close {
  background: none; border: none; color: var(--mm-text-dim);
  cursor: pointer; padding: 4px; border-radius: var(--mm-r-sm);
  &:hover { color: var(--mm-text-primary); }
}
.z-dialog__body { padding: var(--mm-sp-5) var(--mm-sp-6); overflow-y: auto; }
.z-dialog__footer {
  padding: var(--mm-sp-3) var(--mm-sp-6) var(--mm-sp-5);
  border-top: 1px solid var(--mm-border);
  display: flex; gap: var(--mm-sp-2); justify-content: flex-end;
}
</style>
