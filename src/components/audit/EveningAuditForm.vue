<script setup lang="ts">
import { ref } from 'vue'
import { Award, ArrowRight, Check } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'submit', payload: { win: string; tomorrow: string }): void
  (e: 'cancel'): void
}>()

const winInput = ref('')
const tomorrowInput = ref('')

function handleSubmit(): void {
  emit('submit', {
    win: winInput.value.trim() || 'Executed with high discipline',
    tomorrow: tomorrowInput.value.trim() || 'Execute first 90-min deep work block',
  })
}
</script>

<template>
  <div class="audit-form-container">
    <div class="audit-form">
      <div class="field-wrap">
        <label class="field-label">
          <Award :size="13" class="text-ember" />
          <span>1. What was your definitive high-leverage win today?</span>
        </label>
        <input
          v-model="winInput"
          type="text"
          placeholder="e.g., Shipped v2.0 IndexedDB architecture & hit 90m deep work"
          class="audit-input"
          autofocus
        />
      </div>

      <div class="field-wrap">
        <label class="field-label">
          <ArrowRight :size="13" class="text-ember" />
          <span>2. What is your singular non-negotiable Priority #1 for tomorrow morning?</span>
        </label>
        <input
          v-model="tomorrowInput"
          type="text"
          placeholder="e.g., Complete client proposal before touching communication"
          class="audit-input"
          @keyup.enter="handleSubmit"
        />
      </div>
    </div>

    <div class="audit-footer">
      <button @click="emit('cancel')" class="btn-cancel" type="button">Dismiss</button>
      <button @click="handleSubmit" class="btn-lock-audit" type="button">
        <Check :size="14" />
        <span>Lock In Day & Commit to Vault</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.audit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  .field-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    .field-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #fff; }
    .audit-input {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: $radius-sm;
      padding: 10px 12px;
      color: #fff;
      font-size: 13px;
      outline: none;
      &:focus { border-color: rgba(255, 87, 34, 0.5); }
    }
  }
}

.audit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  .btn-cancel { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: $radius-xs; color: $color-text-dim; padding: 6px 12px; cursor: pointer; &:hover { color: #fff; } }
  .btn-lock-audit {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ff5722;
    border: none;
    border-radius: $radius-xs;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    cursor: pointer;
    &:hover { filter: brightness(1.1); }
  }
}
.text-ember { color: #f59e0b; }
</style>
