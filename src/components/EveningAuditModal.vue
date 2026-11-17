<script setup lang="ts">
import { ref } from 'vue'
import { Moon, X } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import EveningAuditSummary from './audit/EveningAuditSummary.vue'
import EveningAuditForm from './audit/EveningAuditForm.vue'

const tasksStore = useTasksStore()
const isOpen = ref(false)

function openModal(): void {
  isOpen.value = true
}

function closeModal(): void {
  isOpen.value = false
}

function handleAuditSubmit(payload: { win: string; tomorrow: string }): void {
  tasksStore.addDayReview(payload.win, payload.tomorrow)
  closeModal()
}
</script>

<template>
  <div>
    <button @click="openModal" class="btn-evening-audit" title="Conduct Evening Cold Audit" type="button">
      <Moon :size="14" class="text-ember" />
      <span>Evening Audit</span>
    </button>

    <div v-if="isOpen" class="audit-overlay" @click.self="closeModal">
      <div class="audit-modal">
        <div class="audit-header">
          <div class="audit-badge">
            <Moon :size="13" class="text-ember" />
            <span>METAGENESIS • EVENING AUDIT</span>
          </div>
          <button @click="closeModal" class="btn-close-modal" type="button">
            <X :size="15" />
          </button>
        </div>

        <EveningAuditSummary
          :completed-count="tasksStore.completedTasks.length"
          :completion-rate="tasksStore.taskCompletionRate"
          :active-goals-count="tasksStore.activeGoals.length"
        />

        <EveningAuditForm
          @submit="handleAuditSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.btn-evening-audit {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 87, 34, 0.08);
  border: 1px solid rgba(255, 87, 34, 0.25);
  border-radius: $radius-full;
  padding: 5px 12px;
  color: #ff7a45;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: rgba(255, 87, 34, 0.18); color: #fff; }
}

.audit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 8, 0.85);
  backdrop-filter: blur(14px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.audit-modal {
  width: 100%;
  max-width: 520px;
  background: rgba(18, 18, 22, 0.98);
  border: 1px solid rgba(255, 87, 34, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 87, 34, 0.15);
  border-radius: $radius-lg;
  padding: 24px;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .audit-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    color: #ff7a45;
    letter-spacing: 0.08em;
  }
  .btn-close-modal { background: transparent; border: none; color: $color-text-dim; cursor: pointer; &:hover { color: #fff; } }
}
.text-ember { color: #f59e0b; }
</style>
