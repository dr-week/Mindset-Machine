# MINDSET MACHINE — Codebase Map

Responsibility table of every module, component, service, and store across the Mindset Machine architecture.

---

## 1. Core State & Data Management (`src/store/` & `src/data/`)

| File / Folder | Responsibility | Line Budget |
|:---|:---|:---:|
| `src/store/tasks.ts` | Primary Pinia store facade; unifies tasks, habits, timetable, goals, and biometrics | $< 150$ |
| `src/store/modules/` | Sub-modules for state, getters, mutations, and actions | $< 150$ each |
| `src/data/persistence.ts` | Local-first persistence via `idb-keyval` and `localStorage` fallback | $< 150$ |
| `src/data/initialTasks.ts` | Seed data for initial focus tasks | $< 150$ |
| `src/data/initialHabits.ts` | Seed data for circadian morning/afternoon/evening habit loops | $< 150$ |
| `src/data/initialTimetable.ts` | Seed data for chronological daily time blocks | $< 150$ |
| `src/data/initialGoals.ts` | Seed data for vision horizon objectives | $< 150$ |
| `src/data/factories.ts` | Pure entity factory functions (`createTaskEntity`, `createHabitEntity`, etc.) | $< 150$ |

---

## 2. Services & Hardware Integrations (`src/services/`)

| File | Responsibility | Line Budget |
|:---|:---|:---:|
| `src/services/aiService.ts` | Co-pilot interface for local Ollama and cloud LLMs with heuristic fallback | $< 150$ |
| `src/services/healthConnect.ts` | Native Android Health Connect capacitor bridge | $< 150$ |
| `src/services/wearableBridge.ts` | Web Bluetooth Low Energy (BLE GATT) for smartwatches and heart rate bands | $< 150$ |
| `src/services/audioFeedback.ts` | Synthesized Web Audio API success chimes and haptic cues | $< 150$ |
| `src/services/haptics.ts` | Native Android vibration and haptic feedback via `@capacitor/haptics` | $< 150$ |
| `src/services/mobile/nativeBridge.ts` | Automatic phone detection, lifecycle hooks, and mobile auto-connect | $< 150$ |
| `src/services/googleFit/googleFitService.ts` | Google Fit REST & Health Connect API synchronization | $< 150$ |
| `src/services/assistant/routineOptimizer.ts` | AI daily routine analyzer & circadian schedule improvement engine | $< 150$ |
| `src/services/assistant/nudgeEngine.ts` | Multi-method psychological work push engine (5-min rule, XP surge, friction reduction) | $< 150$ |
| `src/services/assistant/calendarAssistant.ts` | Calendar schedule generation, ICS export, and Google Calendar sync | $< 150$ |
| `src/services/assistant/notificationService.ts` | Local/native push notifications, work reminders, and audio-haptic feedback | $< 150$ |

---

## 3. Presentation Layer (`src/components/` & `src/features/`)

| File / Folder | Responsibility | Line Budget |
|:---|:---|:---:|
| `src/components/DashboardView.vue` | Cockpit coordinator: Bento matrix composing executive cards | $< 150$ |
| `src/components/dashboard/` | Micro-cards: `HunterDirectiveCard`, `VelocityCard`, `ExecutionQueueCard`, etc. | $< 150$ each |
| `src/components/tasks/TasksView.vue` | Execution Stream view with neuro-cognitive load filters and flame toggles | $< 150$ |
| `src/components/habits/HabitsView.vue` | Circadian Habit Engine partitioned into Morning, Afternoon, and Evening | $< 150$ |
| `src/components/timetable/TimetableView.vue`| Chronological time-blocking view with active countdown horizon | $< 150$ |
| `src/components/goals/GoalsView.vue` | Vision Architect horizons (North Stars, Keystones, Horizons) | $< 150$ |
| `src/components/activity/ActivityView.vue` | Activity & telemetry ledger with 14-day consistency heatmaps | $< 150$ |
| `src/components/vault/VaultView.vue` | State persistence, JSON backup, and Markdown export for Obsidian/Notion | $< 150$ |
| `src/components/notes/NotesView.vue` | Idea-to-action scratchpad with tactile pinning | $< 150$ |
| `src/components/EveningAuditModal.vue` | Evening metacognitive review modal | $< 150$ |
| `src/components/CommandPalette.vue` | Keyboard-driven command palette (`Ctrl+K`) | $< 150$ |
| `src/components/assistant/AssistantView.vue` | Personal Assistant view with daily routine recommendations and calendar | $< 150$ |
