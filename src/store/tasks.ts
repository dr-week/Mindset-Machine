import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { fetchFutureTasks, fetchAiMotivation } from '@/services/aiService'
import { triggerHaptic } from '@/services/haptics'
import { playCheckSound, playSuccessChime } from '@/services/audioFeedback'
import {
  createGoalEntity,
  createTaskEntity,
  createAiSuggestionEntity,
  loadStoredState,
  saveStoredState,
} from '@/data/tasks'
import { syncHealthBiometrics } from '@/services/healthConnect'
import { wearableManager } from '@/services/wearableBridge'
import type { Task, Goal, AiSuggestion, ActiveTab, EnergyLevel, ConsistencyDay, BiometricTelemetry, TimeBlock, Habit, ActivityEvent } from '@/types/mindset'

export const useTasksStore = defineStore('tasks', () => {
  const storedState = loadStoredState()

  const tasks = ref<Task[]>(storedState.tasks)
  const goals = ref<Goal[]>(storedState.goals)
  const reviews = ref<import('@/types/mindset').DayReview[]>(storedState.reviews || [])
  const notes = ref<import('@/types/mindset').QuickNote[]>(storedState.notes || [])
  const timetable = ref<TimeBlock[]>(storedState.timetable || [])
  const habits = ref<Habit[]>(storedState.habits || [])
  const biometrics = ref<BiometricTelemetry>(storedState.biometrics || {
    sleepHours: 7.5,
    deepSleepPercent: 21,
    restingHeartRate: 59,
    recoveryScore: 84,
    stepCount: 8420,
    lastSyncedAt: new Date().toISOString(),
    source: 'simulated',
  })
  const aiSuggestedTasks = ref<AiSuggestion[]>(storedState.aiSuggestedTasks)
  const aiMotivation = ref<string>(storedState.aiMotivation)
  const loadingAi = ref<boolean>(false)
  const syncingHealth = ref<boolean>(false)
  const isPairingWearable = ref<boolean>(false)
  const useMockData = ref<boolean>(false)
  const currentTab = ref<ActiveTab>('dashboard')
  const taskFilter = ref<'all' | 'high' | 'deep' | 'flow' | 'quick'>('all')

  // Transient Undo Buffer & Notification State
  const undoToastMessage = ref<string | null>(null)
  const lastDeletedTask = ref<Task | null>(null)
  const lastDeletedGoal = ref<Goal | null>(null)
  let undoTimer: ReturnType<typeof setTimeout> | null = null

  // Computed derivations
  const uncompletedTasks = computed(() => tasks.value.filter((t) => !t.completed))
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed))
  const activeGoals = computed(() => goals.value.filter((g) => !g.completed))
  const completedGoals = computed(() => goals.value.filter((g) => g.completed))

  // ✦ Solo Leveling / RPG Hunter Stats & Gamification System ✦
  const hunterStats = computed<import('@/types/mindset').HunterStats>(() => {
    const doneTasks = completedTasks.value
    const doneGoals = completedGoals.value

    // Calculate XP based on execution weight
    const taskXp = doneTasks.reduce((acc, t) => {
      let weight = 15
      if (t.priority === 'high') weight += 15
      if (t.energy === 'deep') weight += 20
      return acc + weight
    }, 0)
    const goalXp = doneGoals.length * 100
    const consistencyBonus = dailyConsistencyGrid.value.reduce((acc, d) => acc + d.count * 10, 0)
    const totalXp = taskXp + goalXp + consistencyBonus

    // Progression level curve (100 XP per level)
    const level = Math.max(1, Math.floor(totalXp / 100) + 1)

    // Hunter Rank Mapping
    let rank: import('@/types/mindset').HunterRank = 'E'
    let title = 'Awakened Novice'
    if (level >= 30) {
      rank = 'S'
      title = 'Shadow Sovereign'
    } else if (level >= 20) {
      rank = 'A'
      title = 'Apex Vanguard'
    } else if (level >= 12) {
      rank = 'B'
      title = 'Elite Striker'
    } else if (level >= 6) {
      rank = 'C'
      title = 'Raid Specialist'
    } else if (level >= 3) {
      rank = 'D'
      title = 'Dungeon Scout'
    }

    // RPG Attributes
    const strength = 10 + doneTasks.filter((t) => t.priority === 'high').length * 4
    const intellect = 10 + doneTasks.filter((t) => t.energy === 'deep').length * 5
    const vitality = Math.round(biometrics.value.recoveryScore / 2) + Math.min(25, Math.floor(biometrics.value.stepCount / 800))
    const completedHabitsCount = habits.value.filter((h) => h.completedToday).length
    const discipline = 10 + dailyConsistencyGrid.value.filter((d) => d.level >= 2).length * 6 + completedHabitsCount * 4

    return {
      xp: totalXp,
      level,
      rank,
      title,
      strength,
      intellect,
      vitality,
      discipline,
    }
  })

  // 14-Day Visual Consistency Grid (GitHub / Loop style)
  const dailyConsistencyGrid = computed<ConsistencyDay[]>(() => {
    const days: ConsistencyDay[] = []
    const now = new Date()
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayLabel = dayNames[d.getDay()] ?? 'Day'

      const count = tasks.value.filter((t) => {
        if (!t.completed) return false
        const compDate = t.completedAt ? t.completedAt.slice(0, 10) : t.createdAt.slice(0, 10)
        return compDate === dateStr
      }).length

      let level: 0 | 1 | 2 | 3 | 4 = 0
      if (count >= 5) level = 4
      else if (count >= 3) level = 3
      else if (count >= 2) level = 2
      else if (count >= 1) level = 1

      days.push({
        date: dateStr,
        dayLabel,
        count,
        level,
      })
    }
    return days
  })

  // ✦ Real-Time Unified Daily Activity Feed & Timeline ✦
  const activityTimeline = computed<ActivityEvent[]>(() => {
    const events: ActivityEvent[] = []

    // 1. Completed Tasks
    tasks.value
      .filter((t) => t.completed)
      .forEach((t) => {
        const ts = t.completedAt || t.createdAt
        events.push({
          id: `act-task-${t.id}`,
          title: t.title,
          type: 'task',
          timestamp: ts,
          icon: t.priority === 'high' ? '🔥' : t.energy === 'deep' ? '⚡' : '✓',
          details: `${t.priority.toUpperCase()} priority • ${t.energy ? t.energy.toUpperCase() : 'FLOW'} energy`,
          xpDelta: t.priority === 'high' ? 30 : t.energy === 'deep' ? 35 : 15,
        })
      })

    // 2. Completed Habits (Today)
    habits.value
      .filter((h) => h.completedToday)
      .forEach((h) => {
        events.push({
          id: `act-habit-${h.id}`,
          title: h.title,
          type: 'habit',
          timestamp: h.lastCompletedDate || new Date().toISOString(),
          icon: h.iconEmoji || '⚡',
          details: `Streak ${h.streak}d • ${h.period.toUpperCase()} protocol`,
          xpDelta: 15,
        })
      })

    // 3. Completed Timetable Blocks
    timetable.value
      .filter((b) => b.completed)
      .forEach((b) => {
        events.push({
          id: `act-block-${b.id}`,
          title: b.title,
          type: 'timeblock',
          timestamp: new Date().toISOString().slice(0, 10) + `T${b.endTime}:00.000Z`,
          icon: '⏱️',
          details: `${b.startTime} - ${b.endTime} • ${b.category.toUpperCase()}`,
          xpDelta: 25,
        })
      })

    // 4. Evening Audits
    reviews.value.forEach((r) => {
      events.push({
        id: `act-review-${r.id}`,
        title: `Evening Audit: ${r.winNote}`,
        type: 'audit',
        timestamp: `${r.date}T21:30:00.000Z`,
        icon: '🌙',
        details: `Velocity: ${r.velocityRate}% • Next: ${r.tomorrowPriority}`,
        xpDelta: 50,
      })
    })

    // Sort descending by timestamp
    return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  })

  // Daily Summary Metrics
  const todayActivitySummary = computed(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    const completedTasksToday = tasks.value.filter((t) => {
      if (!t.completed) return false
      const compDate = t.completedAt ? t.completedAt.slice(0, 10) : t.createdAt.slice(0, 10)
      return compDate === todayStr
    }).length

    const completedHabitsToday = habits.value.filter((h) => h.completedToday).length
    const completedBlocksToday = timetable.value.filter((b) => b.completed).length

    const totalActions = completedTasksToday + completedHabitsToday + completedBlocksToday
    const estimatedFocusMinutes =
      timetable.value.filter((b) => b.completed && (b.category === 'deep' || b.category === 'ritual')).length * 60 +
      tasks.value.filter((t) => t.completed && t.energy === 'deep').length * 45

    return {
      completedTasksToday,
      completedHabitsToday,
      completedBlocksToday,
      totalActions,
      estimatedFocusMinutes,
      steps: biometrics.value.stepCount,
      recovery: biometrics.value.recoveryScore,
    }
  })

  // The Rule of 3 Focus items
  const topThreeTasks = computed(() => {
    const pinned = tasks.value.filter((t) => t.isTopThree && !t.completed)
    if (pinned.length >= 3) return pinned.slice(0, 3)
    const highUncompleted = tasks.value.filter((t) => t.priority === 'high' && !t.completed)
    const combined = [...pinned, ...highUncompleted]
    const unique = Array.from(new Set(combined))
    return unique.slice(0, 3)
  })

  // Filtered tasks based on active filter
  const filteredTasks = computed(() => {
    if (taskFilter.value === 'high') {
      return tasks.value.filter((t) => t.priority === 'high')
    }
    if (taskFilter.value === 'deep') {
      return tasks.value.filter((t) => t.energy === 'deep')
    }
    if (taskFilter.value === 'flow') {
      return tasks.value.filter((t) => t.energy === 'flow')
    }
    if (taskFilter.value === 'quick') {
      return tasks.value.filter((t) => t.energy === 'quick')
    }
    return tasks.value
  })

  const taskCompletionRate = computed(() => {
    if (!tasks.value.length) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  // Holistic Daily Efficiency (combining high-leverage tasks, circadian habits, & timeblocks)
  const dailyExecutionEfficiency = computed(() => {
    const totalItems = tasks.value.length + habits.value.length + timetable.value.length
    if (totalItems === 0) return 0

    // Weighted execution score
    const taskScore = completedTasks.value.reduce((acc, t) => {
      let weight = 1
      if (t.priority === 'high') weight += 0.5
      if (t.energy === 'deep') weight += 0.5
      return acc + weight
    }, 0)

    const habitScore = habits.value.filter((h) => h.completedToday).length * 1.2
    const blockScore = timetable.value.filter((b) => b.completed).length * 1.5

    const maxPossibleScore =
      tasks.value.reduce((acc, t) => {
        let weight = 1
        if (t.priority === 'high') weight += 0.5
        if (t.energy === 'deep') weight += 0.5
        return acc + weight
      }, 0) +
      habits.value.length * 1.2 +
      timetable.value.length * 1.5

    if (maxPossibleScore === 0) return 0
    return Math.min(100, Math.round(((taskScore + habitScore + blockScore) / maxPossibleScore) * 100))
  })

  const goalCompletionRate = computed(() => {
    if (!goals.value.length) return 0
    return Math.round((completedGoals.value.length / goals.value.length) * 100)
  })

  // Synchronize state changes to IndexedDB / localStorage
  watch(
    [tasks, goals, notes, reviews, timetable, aiSuggestedTasks, aiMotivation, biometrics],
    () => {
      saveStoredState({
        tasks: tasks.value,
        goals: goals.value,
        notes: notes.value,
        reviews: reviews.value,
        timetable: timetable.value,
        habits: habits.value,
        aiSuggestedTasks: aiSuggestedTasks.value,
        aiMotivation: aiMotivation.value,
        biometrics: biometrics.value,
      })
    },
    { deep: true },
  )

  function addNote(title: string, content: string): void {
    notes.value.unshift({
      id: `n-${Date.now().toString(36)}`,
      title: title || 'Quick Thought',
      content: content || '',
      updatedAt: new Date().toISOString(),
      pinned: false,
    })
    playCheckSound()
    void triggerHaptic('medium')
  }

  function deleteNote(id: string): void {
    notes.value = notes.value.filter((n) => n.id !== id)
    void triggerHaptic('light')
  }

  function togglePinNote(id: string): void {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      note.pinned = !note.pinned
      void triggerHaptic('light')
    }
  }

  // Timetable Operations
  function addTimeBlock(
    title: string,
    category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual',
    startTime: string,
    endTime: string,
    notesText = '',
  ): void {
    timetable.value.push({
      id: `tb-${Date.now().toString(36)}`,
      title: title.trim() || 'Focus Session',
      category,
      startTime,
      endTime,
      completed: false,
      notes: notesText,
    })
    timetable.value.sort((a, b) => a.startTime.localeCompare(b.startTime))
    playCheckSound()
    void triggerHaptic('medium')
  }

  function toggleTimeBlock(id: string): void {
    const block = timetable.value.find((b) => b.id === id)
    if (block) {
      block.completed = !block.completed
      if (block.completed) {
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        void triggerHaptic('light')
      }
    }
  }

  function deleteTimeBlock(id: string): void {
    timetable.value = timetable.value.filter((b) => b.id !== id)
    void triggerHaptic('light')
  }

  // Circadian & Micro-Habit Operations
  function toggleHabit(id: string): void {
    const habit = habits.value.find((h) => h.id === id)
    if (habit) {
      habit.completedToday = !habit.completedToday
      if (habit.completedToday) {
        habit.streak += 1
        habit.score = Math.min(100, habit.score + 5)
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        habit.streak = Math.max(0, habit.streak - 1)
        habit.score = Math.max(0, habit.score - 5)
        void triggerHaptic('light')
      }
    }
  }

  function addHabit(
    title: string,
    period: 'morning' | 'afternoon' | 'evening',
    iconEmoji = '⚡',
    targetDaysPerWeek = 7,
  ): void {
    habits.value.push({
      id: `h-${Date.now().toString(36)}`,
      title: title.trim() || 'Daily Protocol',
      period,
      iconEmoji,
      streak: 0,
      completedToday: false,
      targetDaysPerWeek,
      score: 50,
    })
    playCheckSound()
    void triggerHaptic('medium')
  }

  function deleteHabit(id: string): void {
    habits.value = habits.value.filter((h) => h.id !== id)
    void triggerHaptic('light')
  }

  async function syncHealthData(): Promise<void> {
    syncingHealth.value = true
    try {
      const data = await syncHealthBiometrics()
      biometrics.value = data
      undoToastMessage.value = `Biometrics synced: ${data.recoveryScore}% Recovery Readiness`
      playSuccessChime()
      void triggerHaptic('medium')

      if (undoTimer) clearTimeout(undoTimer)
      undoTimer = setTimeout(() => {
        undoToastMessage.value = null
      }, 4000)
    } finally {
      syncingHealth.value = false
    }
  }

  async function pairWearableDevice(): Promise<void> {
    isPairingWearable.value = true
    try {
      const connected = await wearableManager.scanAndConnectBleDevice()
      const liveHr = wearableManager.getLiveHeartRate()
      biometrics.value = {
        ...biometrics.value,
        device: connected,
        liveHeartRate: liveHr ?? biometrics.value.liveHeartRate,
        source: connected.type === 'custom_iot' ? 'custom_iot' : 'ble_wearable',
        lastSyncedAt: new Date().toISOString(),
      }
      undoToastMessage.value = `Connected: ${connected.name} (${connected.batteryLevel ?? 100}% batt)`
      playSuccessChime()
      void triggerHaptic('heavy')

      if (undoTimer) clearTimeout(undoTimer)
      undoTimer = setTimeout(() => {
        undoToastMessage.value = null
      }, 4000)
    } catch (err) {
      console.error('Failed to pair wearable device:', err)
      undoToastMessage.value = 'Failed to pair wearable device'
    } finally {
      isPairingWearable.value = false
    }
  }

  function disconnectWearable(): void {
    wearableManager.disconnectDevice()
    biometrics.value = {
      ...biometrics.value,
      device: undefined,
      liveHeartRate: undefined,
      source: 'simulated',
    }
    undoToastMessage.value = 'Wearable device disconnected'
    void triggerHaptic('light')
  }

  function addDayReview(winNote: string, tomorrowPriority: string): void {
    reviews.value.unshift({
      id: `r-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      winNote,
      tomorrowPriority,
      completedCount: completedTasks.value.length,
      velocityRate: taskCompletionRate.value,
      biometrics: biometrics.value,
    })
    void triggerHaptic('heavy')
  }

  // Goal operations
  function addGoal(
    text: string,
    category: 'monumental' | 'quarterly' | 'monthly' = 'monumental',
    targetDate?: string,
  ): Goal {
    const goal = createGoalEntity(text, category, targetDate)
    goals.value.unshift(goal)
    void triggerHaptic('medium')
    return goal
  }

  function toggleGoal(id: string): void {
    const goal = goals.value.find((g) => g.id === id)
    if (goal) {
      goal.completed = !goal.completed
      if (goal.completed) {
        goal.completedAt = new Date().toISOString()
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        goal.completedAt = undefined
        void triggerHaptic('light')
      }
    }
  }

  function deleteGoal(id: string): void {
    const goalIndex = goals.value.findIndex((g) => g.id === id)
    if (goalIndex !== -1) {
      const deleted = goals.value[goalIndex]
      if (deleted) {
        lastDeletedGoal.value = deleted
        lastDeletedTask.value = null
        goals.value.splice(goalIndex, 1)
        undoToastMessage.value = `Goal removed: "${deleted.text.slice(0, 22)}..."`
        void triggerHaptic('light')

        if (undoTimer) clearTimeout(undoTimer)
        undoTimer = setTimeout(() => {
          undoToastMessage.value = null
          lastDeletedGoal.value = null
        }, 5000)
      }
    }
  }

  // Task operations
  function addTask(
    title: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    energy: EnergyLevel = 'flow',
    time = 'Today',
  ): Task {
    const task = createTaskEntity({ title, priority, energy, time })
    tasks.value.unshift(task)
    void triggerHaptic('medium')
    return task
  }

  function toggleTask(id: string): void {
    const task = tasks.value.find((x) => x.id === id)
    if (task) {
      task.completed = !task.completed
      if (task.completed) {
        task.completedAt = new Date().toISOString()
        playCheckSound()
        void triggerHaptic('heavy')
      } else {
        task.completedAt = undefined
        void triggerHaptic('light')
      }
    }
  }

  function deleteTask(id: string): void {
    const taskIndex = tasks.value.findIndex((x) => x.id === id)
    if (taskIndex !== -1) {
      const deleted = tasks.value[taskIndex]
      if (deleted) {
        lastDeletedTask.value = deleted
        lastDeletedGoal.value = null
        tasks.value.splice(taskIndex, 1)
        undoToastMessage.value = `Task removed: "${deleted.title.slice(0, 22)}..."`
        void triggerHaptic('light')

        if (undoTimer) clearTimeout(undoTimer)
        undoTimer = setTimeout(() => {
          undoToastMessage.value = null
          lastDeletedTask.value = null
        }, 5000)
      }
    }
  }

  function undoLastDelete(): void {
    if (lastDeletedTask.value) {
      tasks.value.unshift(lastDeletedTask.value)
      undoToastMessage.value = 'Task restored'
      lastDeletedTask.value = null
      playCheckSound()
      void triggerHaptic('medium')
    } else if (lastDeletedGoal.value) {
      goals.value.unshift(lastDeletedGoal.value)
      undoToastMessage.value = 'Goal restored'
      lastDeletedGoal.value = null
      playSuccessChime()
      void triggerHaptic('medium')
    }
    if (undoTimer) clearTimeout(undoTimer)
    setTimeout(() => {
      undoToastMessage.value = null
    }, 2000)
  }

  function importFromJson(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson)
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON format' }
      }
      if (Array.isArray(parsed.tasks)) {
        tasks.value = parsed.tasks
      }
      if (Array.isArray(parsed.goals)) {
        goals.value = parsed.goals
      }
      if (Array.isArray(parsed.reviews)) {
        reviews.value = parsed.reviews
      }
      if (Array.isArray(parsed.timetable)) {
        timetable.value = parsed.timetable
      }
      if (typeof parsed.aiMotivation === 'string') {
        aiMotivation.value = parsed.aiMotivation
      }
      playSuccessChime()
      void triggerHaptic('heavy')
      return { success: true, message: `Successfully restored ${tasks.value.length} tasks and ${goals.value.length} goals!` }
    } catch (e: unknown) {
      return { success: false, message: (e as Error).message || 'Failed to parse backup JSON' }
    }
  }

  function sweepCompletedTasks(): void {
    const completedList = tasks.value.filter((t) => t.completed)
    if (completedList.length === 0) return

    tasks.value = tasks.value.filter((t) => !t.completed)
    undoToastMessage.value = `Swept ${completedList.length} completed tasks from queue`
    playCheckSound()
    void triggerHaptic('medium')

    if (undoTimer) clearTimeout(undoTimer)
    undoTimer = setTimeout(() => {
      undoToastMessage.value = null
    }, 4000)
  }

  function setFilter(filter: 'all' | 'high' | 'deep' | 'flow' | 'quick'): void {
    taskFilter.value = filter
  }

  // Accept an AI suggestion into actionable tasks
  function acceptAiSuggestion(suggestionId: string): void {
    const suggestion = aiSuggestedTasks.value.find((s) => s.id === suggestionId)
    if (suggestion) {
      addTask(suggestion.suggestion, 'high', 'deep', 'Today')
      aiSuggestedTasks.value = aiSuggestedTasks.value.filter((s) => s.id !== suggestionId)
      void triggerHaptic('heavy')
    }
  }

  function dismissAiSuggestion(suggestionId: string): void {
    aiSuggestedTasks.value = aiSuggestedTasks.value.filter((s) => s.id !== suggestionId)
    void triggerHaptic('light')
  }

  // AI Operations
  async function generateAiTasks(): Promise<void> {
    loadingAi.value = true
    try {
      const suggestions = await fetchFutureTasks(uncompletedTasks.value, goals.value)
      aiSuggestedTasks.value = suggestions.map((text) => createAiSuggestionEntity(text))
      void triggerHaptic('medium')
    } catch (err) {
      console.error('Failed to generate AI tasks:', err)
    } finally {
      loadingAi.value = false
    }
  }

  async function refreshMotivation(): Promise<void> {
    loadingAi.value = true
    try {
      const stagnantTasks = uncompletedTasks.value.filter((t) => t.priority === 'high')
      const targetTasks = stagnantTasks.length > 0 ? stagnantTasks : uncompletedTasks.value
      const motivation = await fetchAiMotivation(targetTasks)
      if (motivation) {
        aiMotivation.value = motivation
        void triggerHaptic('light')
      }
    } catch (err) {
      console.error('Failed to refresh AI motivation:', err)
    } finally {
      loadingAi.value = false
    }
  }

  function setTab(tab: ActiveTab): void {
    currentTab.value = tab
    void triggerHaptic('light')
  }

  return {
    tasks,
    goals,
    notes,
    reviews,
    timetable,
    habits,
    aiSuggestedTasks,
    aiMotivation,
    biometrics,
    hunterStats,
    loadingAi,
    syncingHealth,
    isPairingWearable,
    useMockData,
    currentTab,
    taskFilter,
    uncompletedTasks,
    completedTasks,
    activeGoals,
    completedGoals,
    topThreeTasks,
    filteredTasks,
    taskCompletionRate,
    dailyExecutionEfficiency,
    goalCompletionRate,
    dailyConsistencyGrid,
    activityTimeline,
    todayActivitySummary,
    undoToastMessage,
    addGoal,
    toggleGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    undoLastDelete,
    importFromJson,
    sweepCompletedTasks,
    syncHealthData,
    pairWearableDevice,
    disconnectWearable,
    addNote,
    deleteNote,
    togglePinNote,
    addTimeBlock,
    toggleTimeBlock,
    deleteTimeBlock,
    toggleHabit,
    addHabit,
    deleteHabit,
    setFilter,
    addDayReview,
    acceptAiSuggestion,
    dismissAiSuggestion,
    generateAiTasks,
    refreshMotivation,
    setTab,
  }
})
