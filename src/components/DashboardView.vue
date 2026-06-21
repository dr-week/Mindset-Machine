<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const isSidebarCollapsed = ref(false)
const newGoalTitle = ref('')

const sidebarItems = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Goals', key: 'goals' },
  { label: 'Tasks', key: 'tasks' },
  { label: 'AI Insights', key: 'ai' },
  { label: 'AI Database', key: 'database' },
]

onMounted(async () => {
  // keep existing store behavior: if useMockData is true, AI will still work.
  // Also try to refresh motivation so the AI panel isn't empty.
  try {
    if (typeof tasksStore.refreshMotivation === 'function') {
      await tasksStore.refreshMotivation()
    }
  } catch {
    // ignore UI init errors
  }
})

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function addGoal() {
  const title = newGoalTitle.value.trim()
  if (!title) return
  // store expects `text`
  tasksStore.addGoal(title)
  newGoalTitle.value = ''
}

type StoreGoal = { id: string; text: string; createdAt: string }
type StoreTask = {
  id: string
  title: string
  completed: boolean
  projectId?: string | null
  priority: string
  createdAt: string
  time?: string
}

type UiGoal = { id: string; title: string; completed: boolean }
type UiTask = {
  id: string
  title: string
  completed: boolean
  time?: string
  priority: string
  createdAt: string
}

const goals = computed<UiGoal[]>(() => {
  const raw = (tasksStore.goals || []) as StoreGoal[]
  return raw.map((g) => ({
    id: g.id,
    title: g.text,
    completed: false,
  }))
})

const tasks = computed<UiTask[]>(() => (tasksStore.tasks || []) as StoreTask[])
const completedTaskCount = computed(() => tasks.value.filter((t) => t.completed).length)
const totalTaskCount = computed(() => tasks.value.length)
const goalsCount = computed(() => goals.value.length)
const taskCompletionPct = computed(() => {
  if (!totalTaskCount.value) return 0
  return Math.round((completedTaskCount.value / totalTaskCount.value) * 100)
})

const goalCompletionPct = computed(() => {
  if (!goalsCount.value) return 0
  // store goals currently have no completion state
  // so we show 0% until completion is added.
  return 0
})

const aiMotivation = computed(() => tasksStore.aiMotivation || '')

function toggleTask(id: string) {
  // store function is named toggleTask
  tasksStore.toggleTask(id)
}

function deleteTask(id: string) {
  tasksStore.deleteTask(id)
}

const productSuiteTasks = computed(() => {
  // No project grouping exists yet in store.
  // Use priority to simulate two groups.
  return tasks.value.filter((t) => t.priority !== 'low')
})

const growthSprintTasks = computed(() => {
  return tasks.value.filter((t) => t.priority === 'low')
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto p-6 animate-fade-in">
    <div class="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <section
        class="border border-border bg-panel p-6 rounded-2xl flex flex-col justify-between transition-all"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-zinc-500">Workspace</p>
            <h2 class="text-lg font-semibold tracking-tight text-zinc-100">Focus cockpit</h2>
          </div>
          <button
            @click="toggleSidebar"
            class="rounded-xl border border-border/50 bg-background/70 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-zinc-300 transition hover:bg-background/90"
          >
            {{ isSidebarCollapsed ? 'Expand' : 'Collapse' }}
          </button>
        </div>

        <div v-if="!isSidebarCollapsed" class="space-y-5 mt-6">
          <div class="rounded-3xl border border-border/40 bg-background/30 p-4 space-y-4">
            <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Stats</div>
            <div class="grid gap-3">
              <div class="rounded-2xl bg-zinc-950/70 p-3">
                <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Goals</div>
                <div class="mt-2 text-lg font-semibold text-zinc-100">{{ goalsCount }}</div>
              </div>
              <div class="rounded-2xl bg-zinc-950/70 p-3">
                <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Tasks</div>
                <div class="mt-2 text-lg font-semibold text-zinc-100">{{ totalTaskCount }}</div>
              </div>
              <div class="rounded-2xl bg-zinc-950/70 p-3">
                <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Done</div>
                <div class="mt-2 text-lg font-semibold text-zinc-100">{{ taskCompletionPct }}%</div>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-border/40 bg-background/30 p-4 space-y-3">
            <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Navigation</div>
            <div class="grid gap-2">
              <button
                v-for="item in sidebarItems"
                :key="item.key"
                class="w-full rounded-2xl border border-border/50 bg-zinc-950/50 px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-zinc-900"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="rounded-3xl border border-border/40 bg-background/30 p-4 space-y-3">
            <div class="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Quick actions</div>
            <button
              @click="addGoal()"
              class="w-full rounded-2xl border border-border/50 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 transition hover:bg-zinc-800"
            >
              Add goal
            </button>
            <button
              @click="tasksStore.refreshMotivation()"
              class="w-full rounded-2xl border border-border/50 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 transition hover:bg-zinc-800"
            >
              Refresh AI motivation
            </button>
          </div>
        </div>

        <div
          v-else
          class="mt-6 rounded-3xl border border-border/40 bg-background/30 p-6 text-center text-xs uppercase tracking-[0.35em] text-zinc-500"
        >
          Sidebar collapsed
        </div>
      </section>

      <div class="space-y-8">
        <!-- 🌟 TOP HEADER BANNER -->
        <header
          class="border border-border bg-panel/40 backdrop-blur-md p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-xl font-semibold tracking-tight text-zinc-100">Dashboard</h1>
            <p class="text-xs text-zinc-500 mt-1 font-light">
              A premium workspace to track goals, projects, and AI-backed actions in a minimalist
              framework.
            </p>
          </div>
          <div
            class="flex items-center space-x-3 bg-zinc-950 px-4 py-2 rounded-xl border border-border"
          >
            <span class="w-2 h-2 rounded-full bg-violet-400 animate-subtle-pulse"></span>
            <span class="text-[11px] font-mono uppercase tracking-widest text-zinc-400"
              >AI LIVE //</span
            >
          </div>
        </header>

        <!-- 📊 BENTO GRID LAYOUT -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- COLUMN 1: GOALS (3/12 Width) -->
          <section
            class="lg:col-span-4 border border-border bg-panel p-6 rounded-2xl flex flex-col justify-between space-y-6"
          >
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-500">Goals</h2>
                <span
                  class="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-border px-2 py-0.5 rounded-md"
                  >{{ goalCompletionPct }}% complete</span
                >
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-xl border border-border/40 bg-background/40">
                  <div class="text-[11px] font-mono text-zinc-500">Goals</div>
                  <div class="text-lg font-semibold text-zinc-200">{{ goalsCount }}</div>
                </div>
                <div class="p-3 rounded-xl border border-border/40 bg-background/40">
                  <div class="text-[11px] font-mono text-zinc-500">Tasks done</div>
                  <div class="text-lg font-semibold text-zinc-200">{{ completedTaskCount }}</div>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="goal in goals"
                  :key="goal.id"
                  class="flex items-center space-x-3 p-3 bg-background/50 rounded-xl border border-border/40"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                  <span class="text-sm text-zinc-300 font-light">{{ goal.title }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 pt-4 border-t border-border/40">
              <input
                v-model="newGoalTitle"
                @keyup.enter="addGoal"
                type="text"
                placeholder="Add new goal..."
                class="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none"
              />
              <button
                @click="addGoal"
                class="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-all border border-border"
              >
                Add
              </button>
            </div>
          </section>

          <!-- COLUMN 2: PROJECTS & TASKS (5/12 Width) -->
          <section class="lg:col-span-5 border border-border bg-panel p-6 rounded-2xl space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Projects & Tasks
              </h2>
            </div>

            <!-- Project Block 1 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-medium text-zinc-400 tracking-wide">Product Suite</h3>
                <span
                  class="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md"
                  >Active</span
                >
              </div>
              <div class="space-y-1">
                <div
                  v-for="task in productSuiteTasks"
                  :key="task.id"
                  class="flex items-center justify-between p-3 bg-background/30 hover:bg-background/70 rounded-xl border border-border/20 group transition-all"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      :checked="task.completed"
                      @change="toggleTask(task.id)"
                      class="accent-violet-400 rounded cursor-pointer"
                    />
                    <span
                      :class="task.completed ? 'line-through text-zinc-600' : 'text-zinc-200'"
                      class="text-sm font-light"
                      >{{ task.title }}</span
                    >
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-[11px] font-mono text-zinc-600">{{ task.time }}</span>
                    <button
                      @click="deleteTask(task.id)"
                      class="text-xs text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Block 2 -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-medium text-zinc-400 tracking-wide">Growth Sprint</h3>
                <span
                  class="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-border px-2 py-0.5 rounded-md"
                  >Planning</span
                >
              </div>
              <div class="space-y-1">
                <div
                  v-for="task in growthSprintTasks"
                  :key="task.id"
                  class="flex items-center justify-between p-3 bg-background/30 hover:bg-background/70 rounded-xl border border-border/20 group transition-all"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      :checked="task.completed"
                      @change="toggleTask(task.id)"
                      class="accent-violet-400 rounded cursor-pointer"
                    />
                    <span class="text-sm text-zinc-200 font-light">{{ task.title }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-[11px] font-mono text-zinc-600">{{ task.time }}</span>
                    <button
                      @click="deleteTask(task.id)"
                      class="text-xs text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- COLUMN 3: AI INSIGHTS (3/12 Width) -->
          <section
            class="lg:col-span-3 border border-border bg-panel p-6 rounded-2xl flex flex-col justify-between space-y-6"
          >
            <div class="space-y-4">
              <h2 class="text-xs font-mono uppercase tracking-widest text-violet-400/90">
                AI Insights
              </h2>
              <div class="p-4 bg-violet-950/10 border border-violet-500/10 rounded-xl">
                <p class="text-xs italic text-zinc-300 leading-relaxed font-light">
                  "{{ aiMotivation }}"
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                class="border border-dashed border-border/60 p-6 rounded-xl text-center bg-background/20"
              >
                <p class="text-xs text-zinc-500">AI engine idle. Awaiting task patterns.</p>
              </div>
              <p class="text-[10px] text-center text-zinc-600 font-mono tracking-wide">
                Delivered from AI analysis with subtle clarity.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
