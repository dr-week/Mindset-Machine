<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '@/store/tasks'
import type { ActiveTab } from '@/types/mindset'
import CommandPaletteActionsList from './command-palette/CommandPaletteActionsList.vue'
import CommandPaletteInput from './command-palette/CommandPaletteInput.vue'

const tasksStore = useTasksStore()
const isOpen = ref(false)
const searchInput = ref('')
const inputMode = ref<'search' | 'task' | 'goal'>('search')
const newItemText = ref('')

function openPalette(): void {
  isOpen.value = true
  inputMode.value = 'search'
  searchInput.value = ''
  newItemText.value = ''
}

function closePalette(): void {
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isOpen.value) closePalette()
    else openPalette()
  } else if (e.key === 'Escape' && isOpen.value) {
    closePalette()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

function navigateTo(tab: ActiveTab): void {
  tasksStore.setTab(tab)
  closePalette()
}

function submitNewItem(): void {
  const text = newItemText.value.trim()
  if (!text) return
  if (inputMode.value === 'task') {
    tasksStore.addTask(text, 'high', 'deep', 'Today')
  } else if (inputMode.value === 'goal') {
    tasksStore.addGoal(text)
  }
  closePalette()
}
</script>

<template>
  <div v-if="isOpen" class="palette-overlay" @click.self="closePalette">
    <div class="palette-modal">
      <CommandPaletteInput
        :mode="inputMode"
        :model-value="inputMode === 'search' ? searchInput : newItemText"
        @update:model-value="inputMode === 'search' ? (searchInput = $event) : (newItemText = $event)"
        @submit="submitNewItem"
        @close="closePalette"
      />

      <div class="palette-body">
        <CommandPaletteActionsList
          v-if="inputMode === 'search'"
          @set-mode="inputMode = $event"
          @generate-ai="tasksStore.generateAiTasks(); closePalette()"
          @navigate="navigateTo"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.palette-modal {
  width: 100%;
  max-width: 540px;
  background: rgba(18, 18, 22, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 87, 34, 0.15);
  border-radius: $radius-lg;
  overflow: hidden;
}

.palette-body {
  padding: 8px;
  max-height: 380px;
  overflow-y: auto;
}
</style>
