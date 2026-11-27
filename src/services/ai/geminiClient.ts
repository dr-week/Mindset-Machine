/**
 * Gemini AI Client (`gemini-2.5-flash`) & Structured Goal/Task/Micro-Task Architect
 * Modeled after `@zuari/ai` workflow controller (`https://github.com/dr-week/fast-framework`).
 * Supports:
 * 1. Gemini REST API (`generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`)
 * 2. Hierarchical Goal -> Tasks -> Micro-Tasks & Steps breakdown (`GeminiGoalBreakdown`)
 * 3. Single Task -> Micro-Tasks & Steps decomposition (`GeminiMicroStep[]`)
 * 4. Offline deterministic fallback when no API key is configured
 */
import type { GeminiGoalBreakdown, GeminiMicroStep, GeminiTaskBreakdown } from '@/types/assistant'
import { loadFromStorage, saveToStorage } from '@/data/persistence'

const GEMINI_KEY_STORAGE = 'gemini_api_key'

export function getGeminiApiKey(): string {
  const stored = loadFromStorage<string>(GEMINI_KEY_STORAGE, '')
  if (stored) return stored
  return (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || ''
}

export function setGeminiApiKey(key: string): void {
  saveToStorage(GEMINI_KEY_STORAGE, key.trim())
}

export async function callGeminiJson<T>(systemInstruction: string, userPrompt: string): Promise<T | null> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) return null

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) return null
    return JSON.parse(rawText.trim()) as T
  } catch {
    return null
  }
}

export async function generateGeminiGoalBreakdown(goalPrompt: string): Promise<GeminiGoalBreakdown> {
  const cleanGoal = goalPrompt.trim() || 'Launch High-Impact Tactical Milestone'
  const systemPrompt =
    'You are Gemini Task Architect inside Mindset Machine. Break down the user goal into 3 actionable tasks, each with 3 concrete micro-tasks (steps) and estimatedMinutes. Return strict JSON matching: {"goalTitle": string, "category": "monumental"|"quarterly"|"monthly", "tasks": [{"taskTitle": string, "priority": "high"|"medium"|"low", "energy": "deep"|"flow"|"quick", "microTasks": [{"title": string, "estimatedMinutes": number}]}]}'

  const liveResult = await callGeminiJson<GeminiGoalBreakdown>(systemPrompt, `Goal: ${cleanGoal}`)
  if (liveResult && Array.isArray(liveResult.tasks) && liveResult.tasks.length > 0) {
    return liveResult
  }

  return buildHeuristicGoalBreakdown(cleanGoal)
}

export async function generateGeminiMicroStepsForTask(taskTitle: string): Promise<GeminiMicroStep[]> {
  const cleanTitle = taskTitle.trim() || 'Execute Deep Focus Block'
  const systemPrompt =
    'You are Gemini Micro-Step Decomposer. Break this task into 3 to 4 immediate, low-friction micro-steps (5 to 25 mins each). Return strict JSON array: [{"title": string, "estimatedMinutes": number}]'

  const liveSteps = await callGeminiJson<GeminiMicroStep[]>(systemPrompt, `Task: ${cleanTitle}`)
  if (Array.isArray(liveSteps) && liveSteps.length > 0) {
    return liveSteps
  }

  return [
    { title: `Scope core requirements & success criteria for "${cleanTitle}"`, estimatedMinutes: 10 },
    { title: `Execute primary deep-work implementation sprint`, estimatedMinutes: 25 },
    { title: `Verify output, run edge-case checks & log completion`, estimatedMinutes: 15 },
  ]
}

function buildHeuristicGoalBreakdown(goalTitle: string): GeminiGoalBreakdown {
  const tasks: GeminiTaskBreakdown[] = [
    {
      taskTitle: `Phase 1: Architecture & Blueprint for ${goalTitle}`,
      priority: 'high',
      energy: 'deep',
      microTasks: [
        { title: 'Define minimum viable scope & eliminate non-essential friction', estimatedMinutes: 15 },
        { title: 'Draft technical & execution checklist in Notes vault', estimatedMinutes: 20 },
        { title: 'Lock first 90-minute circadian deep work block', estimatedMinutes: 10 },
      ],
    },
    {
      taskTitle: `Phase 2: Core Execution Sprint — ${goalTitle}`,
      priority: 'high',
      energy: 'deep',
      microTasks: [
        { title: 'Build primary deliverable component without context-switching', estimatedMinutes: 45 },
        { title: 'Validate milestone progress against keystone metrics', estimatedMinutes: 20 },
        { title: 'Document blockers and refine next action queue', estimatedMinutes: 15 },
      ],
    },
    {
      taskTitle: `Phase 3: Verification, Polish & Deployment — ${goalTitle}`,
      priority: 'medium',
      energy: 'flow',
      microTasks: [
        { title: 'Run end-to-end quality audit and final review', estimatedMinutes: 20 },
        { title: 'Sync database checkpoint to Google Drive minimal vault', estimatedMinutes: 5 },
        { title: 'Record win in Evening Metacognitive Audit', estimatedMinutes: 10 },
      ],
    },
  ]

  return {
    goalTitle,
    category: 'quarterly',
    tasks,
  }
}
