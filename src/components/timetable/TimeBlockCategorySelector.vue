<script setup lang="ts">
type Category = 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'

defineProps<{
  activeCategory: Category
}>()

const emit = defineEmits<{
  (e: 'select', cat: Category): void
}>()
</script>

<template>
  <div class="category-pills-selector">
    <button
      type="button"
      @click="emit('select', 'deep')"
      class="cat-pill deep"
      :class="{ active: activeCategory === 'deep' }"
    >
      ⚡ Deep Focus
    </button>
    <button
      type="button"
      @click="emit('select', 'vitality')"
      class="cat-pill vitality"
      :class="{ active: activeCategory === 'vitality' }"
    >
      ☀️ Vitality & Sun
    </button>
    <button
      type="button"
      @click="emit('select', 'ritual')"
      class="cat-pill ritual"
      :class="{ active: activeCategory === 'ritual' }"
    >
      🌿 Movement / Ritual
    </button>
    <button
      type="button"
      @click="emit('select', 'admin')"
      class="cat-pill admin"
      :class="{ active: activeCategory === 'admin' }"
    >
      ☕ Admin / Sweeping
    </button>
    <button
      type="button"
      @click="emit('select', 'rest')"
      class="cat-pill rest"
      :class="{ active: activeCategory === 'rest' }"
    >
      🌙 Digital Sunset / Rest
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.category-pills-selector {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  .cat-pill {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-xs;
    padding: 4px 8px;
    font-size: 11px;
    color: $color-text-dim;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
    &.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }
    &.deep.active { color: #ef4444; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.15); }
    &.vitality.active { color: #f59e0b; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.15); }
    &.ritual.active { color: #10b981; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.15); }
    &.admin.active { color: #3b82f6; border-color: rgba(59, 130, 246, 0.4); background: rgba(59, 130, 246, 0.15); }
    &.rest.active { color: #8b5cf6; border-color: rgba(139, 92, 246, 0.4); background: rgba(139, 92, 246, 0.15); }
  }
}
</style>
