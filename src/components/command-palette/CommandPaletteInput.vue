<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

defineProps<{
  mode: 'search' | 'task' | 'goal'
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
  'submit': []
  'close': []
}>()
</script>

<template>
  <div class="palette-input-wrap">
    <Search :size="16" class="palette-search-icon" />
    <input
      v-if="mode === 'search'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Type a command or jump to view..."
      class="palette-input"
      autofocus
    />
    <input
      v-else
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="mode === 'task' ? 'Add new priority task...' : 'Declare new goal directive...'"
      class="palette-input"
      autofocus
      @keyup.enter="emit('submit')"
    />
    <button @click="emit('close')" class="palette-close-btn" type="button">
      <X :size="14" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.palette-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .palette-search-icon {
    color: $color-text-dim;
  }

  .palette-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;
    &::placeholder {
      color: $color-text-dim;
    }
  }

  .palette-close-btn {
    background: transparent;
    border: none;
    color: $color-text-dim;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}
</style>
