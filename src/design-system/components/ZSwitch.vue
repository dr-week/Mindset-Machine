<script setup lang="ts">
/**
 * ZSwitch — Tactile toggle switch atom (Zuari Design System)
 * v-model compatible boolean toggle with haptic-ready active state.
 */
const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?:   boolean
  label?:      string
}>(), {
  modelValue: false,
  disabled: false,
})
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()
function toggle() {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="z-switch" :class="{ 'z-switch--on': modelValue, 'z-switch--disabled': disabled }">
    <input
      type="checkbox"
      class="z-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="z-switch__track">
      <span class="z-switch__thumb" />
    </span>
    <span v-if="label" class="z-switch__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.z-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--mm-sp-2);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &--disabled { opacity: 0.4; cursor: not-allowed; }
}
.z-switch__input { position: absolute; opacity: 0; width: 0; height: 0; }
.z-switch__track {
  position: relative;
  width: 40px; height: 22px;
  border-radius: var(--mm-r-pill);
  background: oklch(25% 0.02 260);
  border: 1px solid var(--mm-border);
  transition: background var(--mm-dur-micro) var(--mm-ease-std),
              border-color var(--mm-dur-micro) var(--mm-ease-std);
  flex-shrink: 0;
}
.z-switch__thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: oklch(60% 0.01 260);
  transition: transform var(--mm-dur-std) var(--mm-ease-spring),
              background var(--mm-dur-micro) var(--mm-ease-std);
}
.z-switch--on .z-switch__track {
  background: var(--mm-action);
  border-color: oklch(65% 0.22 32 / 0.5);
}
.z-switch--on .z-switch__thumb {
  transform: translateX(18px);
  background: #fff;
}
.z-switch__label {
  font-size: 13px;
  color: var(--mm-text-secondary);
  user-select: none;
}
</style>
