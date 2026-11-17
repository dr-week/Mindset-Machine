<script setup lang="ts">
/**
 * ZInput — Base text input atom (Zuari Design System)
 * Supports: text, search, number. Emits v-model compatible update.
 */
withDefaults(defineProps<{
  modelValue?:   string | number
  placeholder?:  string
  type?:         'text' | 'search' | 'number' | 'email' | 'password'
  disabled?:     boolean
  autofocus?:    boolean
  prefix?:       boolean  // show prefix slot
  size?:         'sm' | 'md' | 'lg'
}>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  autofocus: false,
  prefix: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [v: string | number]
  enter: [v: string]
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter')
    emit('enter', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="z-input-wrap" :class="`z-input-wrap--${size}`">
    <span v-if="prefix" class="z-input-prefix"><slot name="prefix" /></span>
    <input
      class="z-input"
      :class="{ 'has-prefix': prefix }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      @input="onInput"
      @keydown="onKeydown"
    />
  </div>
</template>

<style scoped>
.z-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: oklch(100% 0 0 / 0.04);
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-r-sm);
  transition: border-color var(--mm-dur-micro) var(--mm-ease-std);
  &:focus-within { border-color: var(--mm-border-focus); }
}
.z-input-wrap--sm { font-size: 12px; min-height: 30px; }
.z-input-wrap--md { font-size: 13px; min-height: 36px; }
.z-input-wrap--lg { font-size: 15px; min-height: 44px; }

.z-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--mm-text-primary);
  font-family: var(--mm-font-sans);
  padding: 0 var(--mm-sp-3);
  width: 100%;
  &::placeholder { color: var(--mm-text-dim); }
  &.has-prefix { padding-left: var(--mm-sp-2); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.z-input-prefix {
  padding-left: var(--mm-sp-3);
  color: var(--mm-text-dim);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>
