import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { fetchFutureTasks, fetchAiMotivation } from '@/services/aiService'
import {
  createGoalEntity,
  createAiSuggestionEntity,
  loadStoredState,
  saveStoredState,
} from '@/data/tasks'

const storedState = loadStoredState()

export const useTasksStore = defineStore('tasks', () => {
  const aiSuggestedTasks = ref(storedState.aiSuggestedTasks)
  const loadingAi = ref(false)
  const aiMotivation = ref(storedState.aiMotivation)
  const useMockData = ref(true)

  // Local task/goal state (so the UI can compute progress without needing a separate store)
  const tasks = ref(storedState.tasks)
  const goals = ref(storedState.goals)

  const uncompletedTasks = computed(() => tasks.value.filter((t) => !t.completed))
  const activeGoals = computed(() => goals.value)

  watch(
    [tasks, goals, aiSuggestedTasks, aiMotivation],
    () => {
      saveStoredState({
        tasks: tasks.value,
        goals: goals.value,
        aiSuggestedTasks: aiSuggestedTasks.value,
        aiMotivation: aiMotivation.value,
      })
    },
    { deep: true },
  )

  function addGoal(text) {
    const goal = createGoalEntity(text)
    goals.value.push(goal)
    return goal
  }

  function toggleTask(id) {
    const task = tasks.value.find((x) => x.id === id)
    if (task) task.completed = !task.completed
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((x) => x.id !== id)
  }

  async function generateAiTasks() {
    loadingAi.value = true
    try {
      let result
      if (useMockData.value) {
        result = [
          createAiSuggestionEntity('Brainstorm one bold idea'),
          createAiSuggestionEntity('Draft a compact action plan'),
          createAiSuggestionEntity('Prototype the smallest viable feature'),
        ]
      } else {
        const suggestionStrings = await fetchFutureTasks(uncompletedTasks.value, activeGoals.value)
        result = suggestionStrings.map((text) => createAiSuggestionEntity(text))
      }
      aiSuggestedTasks.value = result
    } catch (err) {
      console.error(err)
    } finally {
      loadingAi.value = false
    }
  }

  async function refreshMotivation() {
    loadingAi.value = true
    try {
      const highPriority = uncompletedTasks.value.filter((task) => task.priority === 'high')
      let motivation
      if (useMockData.value) {
        motivation = await new Promise((resolve) => {
          setTimeout(() => {
            resolve('Focus sharp: finish one high-impact task now.')
          }, 1000)
        })
      } else {
        motivation = await fetchAiMotivation(highPriority)
      }
      aiMotivation.value = motivation
    } catch (err) {
      console.error(err)
    } finally {
      loadingAi.value = false
    }
  }

  return {
    tasks,
    goals,
    aiSuggestedTasks,
    loadingAi,
    uncompletedTasks,
    activeGoals,
    generateAiTasks,
    refreshMotivation,
    aiMotivation,
    useMockData,
    addGoal,
    toggleTask,
    deleteTask,
  }
})
