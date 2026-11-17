# MINDSET MACHINE — Modularization Plan & Code Split Roadmap

## 1. Objective & Architectural Vision

**Mindset Machine** is a local-first, privacy-focused executive operating system and circadian routine engine built with **Vue 3, Pinia, TypeScript, and Capacitor Android**.

To maintain maximum code quality, hot-reload speed, and maintainability:
- **Strict File Limit:** **All source files must strictly remain under 150 lines of code**. Any file exceeding 150 lines must be split into dedicated, single-responsibility sub-modules or composables.
- **Feature-Based Architecture:** Code is organized by domain and responsibility (`tasks`, `habits`, `timetable`, `dashboard`, `vault`, `notes`, `activity`, `assistant`, `mobile`).
- **Zero Monoliths:** Views and cards act as thin coordinators composing specialized presentational and container components.

---

## 2. Codebase Discrepancies & Historical Correction

> [!IMPORTANT]
> An audit of the repository revealed that legacy documentation files previously contained placeholder documentation from an unrelated project ("SMKD stock-signal-bot"). This has been completely audited and replaced with the accurate **Mindset Machine** architecture.

---

## 3. Monolith Inventory & 150-Line Split Strategy

All legacy monoliths have been refactored into modular sub-modules, with zero files exceeding 150 lines:

| Target File | Initial Lines | Current Modular Architecture (< 150 lines each) | Status |
|:---|:---:|:---|:---:|
| `src/components/activity/ActivityView.vue` | 450 | `ActivityTelemetryCards.vue`, `ActivityHeatmapStrip.vue`, `ActivityTimelineList.vue`, coordinator `ActivityView.vue` (74 lines) | Completed |
| `src/components/DashboardView.vue` | 448 | `ApexHeaderDock.vue`, `UndoToastNotification.vue`, coordinator `DashboardView.vue` (92 lines) | Completed |
| `src/components/dashboard/VelocityCard.vue` | 390 | `VelocityRadialGauge.vue`, `VelocityCognitiveLoad.vue`, `VelocityConsistencyGrid.vue`, coordinator `VelocityCard.vue` (115 lines) | Completed |
| `src/components/CommandPalette.vue` | 378 | `CommandPaletteActionsList.vue`, coordinator `CommandPalette.vue` (123 lines) | Completed |
| `src/components/dashboard/HunterDirectiveCard.vue` | 329 | `HunterStatusProfile.vue`, coordinator `HunterDirectiveCard.vue` (118 lines) | Completed |
| `src/store/tasks.ts` | 324 | `tasksState.ts` (65L), `tasksGetters.ts` (82L), `tasksPersistence.ts` (49L), facade `src/store/tasks.ts` (78 lines) | Completed |
| `src/components/EveningAuditModal.vue` | 322 | `EveningAuditForm.vue`, `EveningAuditSummary.vue`, coordinator `EveningAuditModal.vue` (98 lines) | Completed |
| `src/features/tasks/store/tasks.store.ts` | 318 | Lightweight facade (1 line) delegating to modular Pinia store | Completed |
| `src/components/notes/NotesView.vue` | 295 | `NoteCardItem.vue`, `NoteCreatorStrip.vue`, coordinator `NotesView.vue` (72 lines) | Completed |
| `src/components/dashboard/ExecutionQueueCard.vue` | 282 | `ExecutionInputStrip.vue`, `ExecutionPillsRow.vue`, `ExecutionTaskList.vue`, coordinator `ExecutionQueueCard.vue` (90 lines) | Completed |
| `src/components/vault/VaultView.vue` | 275 | `VaultKpiGrid.vue`, `vaultExportHelpers.ts`, coordinator `VaultView.vue` (118 lines) | Completed |
| `src/components/dashboard/VisionDirectivesCard.vue` | 264 | `VisionGoalRow.vue`, coordinator `VisionDirectivesCard.vue` (118 lines) | Completed |
| `src/data/tasks.ts` | 255 | `factories.ts`, `seedData.ts`, `seedHabitsTimetable.ts`, facade `src/data/tasks.ts` (45 lines) | Completed |
| `src/components/goals/GoalsView.vue` | 251 | `GoalHorizonPanel.vue`, `GoalCreatorStrip.vue`, `GoalCardItem.vue`, coordinator `GoalsView.vue` (115 lines) | Completed |
| `src/components/timetable/TimeBlockCreator.vue` | 248 | `TimeBlockCategorySelector.vue`, coordinator `TimeBlockCreator.vue` (125 lines) | Completed |
| `src/features/dashboard/gamification.ts` | 239 | `stats.ts`, `grid.ts`, `timeline.ts`, `summary.ts`, `efficiency.ts`, facade `index.ts` | Completed |
| `src/components/habits/HabitsView.vue` | 232 | `HabitPeriodSection.vue`, `HabitCreatorStrip.vue`, `HabitCardItem.vue`, coordinator `HabitsView.vue` (115 lines) | Completed |
| `src/components/tasks/TaskItemCard.vue` | 211 | Modularized row component (84 lines) | Completed |
| `src/components/timetable/TimeBlockItem.vue` | 204 | Modularized time-block item (123 lines) | Completed |
| `src/services/wearableBridge.ts` | 183 | `bleGatt.ts`, `iotBridge.ts`, coordinator `wearableBridge.ts` (105 lines) | Completed |
| `src/services/aiService.ts` | 172 | `ollamaClient.ts`, `heuristics.ts`, coordinator `aiService.ts` (88 lines) | Completed |
| `src/components/assistant/AssistantView.vue` | New | `AssistantNudgesSection.vue`, `AssistantRoutineSection.vue`, coordinator `AssistantView.vue` (105 lines) | Completed |

---

## 4. Mobile, Android Native & Assistant Implementation Roadmap

### Phase 1: Native Android Auto-Detection & Life Cycle
- Auto-detect mobile environment (`Capacitor.isNativePlatform()`).
- Automatically trigger background BLE / Health Connect sync on launch and resume.
- Request required permissions: `ACTIVITY_RECOGNITION`, `BODY_SENSORS`, `POST_NOTIFICATIONS`.

### Phase 2: Google Fit & Health Connect API Integration
- Connect Google Fit REST API and Android Health Connect.
- Bi-directional sync of steps, sleep stages, active minutes, and resting heart rate.
- Offline simulation fallback when running on desktop or web browser.

### Phase 3: AI Routine Personal Assistant & Calendar Engine
- Circadian routine recommendations based on recovery score and daily velocity.
- Nudge engine implementing psychological motivational triggers:
  - 5-Minute Micro-Commitment
  - Flow State priming
  - Solo Leveling gamified progression
  - Circadian optical & rest resets.
- Assistant Calendar view generating time-blocked schedules and ICS export for Google Calendar.

---

## 5. Verification Protocol

After every step:
1. `npm run type-check` (vue-tsc validation).
2. `npm test` (Vitest test suite).
3. `npm run build-only` (Vite production bundle verification).
4. `python scripts/dev/audit-monoliths.py` (Verify strict line counts < 150).
