<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import ActiveFocusHero from '@/components/timetable/ActiveFocusHero.vue'
import TimeBlockCreator from '@/components/timetable/TimeBlockCreator.vue'
import TimeBlockItem from '@/components/timetable/TimeBlockItem.vue'

const tasksStore = useTasksStore()

const currentTimeMinutes = ref(new Date().getHours() * 60 + new Date().getMinutes())
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTimeMinutes.value = new Date().getHours() * 60 + new Date().getMinutes()
  }, 30000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const activeTimeBlock = computed(() => {
  const cur = currentTimeMinutes.value
  return tasksStore.timetable.find((b) => {
    const s = parseMinutes(b.startTime)
    const e = parseMinutes(b.endTime)
    return cur >= s && cur <= e
  })
})

function handleAddBlock(payload: {
  title: string
  category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'
  startTime: string
  endTime: string
  notes: string
}): void {
  tasksStore.addTimeBlock(
    payload.title,
    payload.category,
    payload.startTime,
    payload.endTime,
    payload.notes,
  )
}
</script>

<template>
  <div class="full-bento-card timetable-canvas zuari-card">
    <div class="full-top">
      <div class="title-with-icon">
        <Clock :size="18" class="text-ember" />
        <div>
          <h2>Circadian Timetable & Time Blocks</h2>
          <p class="subtitle-artistic">Align deep human intellect with biological peaks and uninterrupted focus sanctuaries.</p>
        </div>
      </div>
      <span class="box-counter">{{ tasksStore.timetable.length }} scheduled blocks</span>
    </div>

    <!-- Active Focus Hero Card (if currently within a block) -->
    <ActiveFocusHero
      v-if="activeTimeBlock"
      :active-time-block="activeTimeBlock"
      @toggle="tasksStore.toggleTimeBlock($event)"
    />

    <!-- Quick Block Creator Strip -->
    <TimeBlockCreator @add-block="handleAddBlock" />

    <!-- Chronological Timeline Stream -->
    <div class="timeline-stream-container">
      <TimeBlockItem
        v-for="block in tasksStore.timetable"
        :key="block.id"
        :block="block"
        @toggle="tasksStore.toggleTimeBlock($event)"
        @delete="tasksStore.deleteTimeBlock($event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.timetable-canvas {
  padding: 1.25rem 1.5rem;
  background: rgba(18, 18, 22, 0.95);
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 680px) { padding: 1rem 0.85rem; }

  .full-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 1.25rem;
    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 10px;
      h2 { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
    }
    .box-counter { font-family: $font-mono; font-size: 11px; color: $color-text-dim; }
  }

  .subtitle-artistic {
    font-size: 11.5px;
    color: $color-text-dim;
    margin-top: 2px;
    font-weight: 400;
  }

  .timeline-stream-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
