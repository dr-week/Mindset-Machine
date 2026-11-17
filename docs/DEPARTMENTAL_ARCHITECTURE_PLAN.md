# MINDSET MACHINE — Departmental Architecture & Modularization Master Plan

## 1. Research & Comparative Product Analysis

To build the ultimate daily executive routine cockpit that actively pushes the user to do work without visual clutter, we conducted deep architectural research into premier productivity, routine, and biometric platforms:

### 1.1 Competitive Insights
- **Sunsama & Motion:** Lead in daily planning and calendar time-boxing, but fail by cramming sidebars, task backlogs, and multi-calendars into a single overwhelming viewport.
  - *Our Solution:* A dedicated **Assistant & Calendar Department** where the schedule is uncluttered, distraction-free, and paired with proactive AI routine optimizations.
- **Rise Science & Huberman Circadian Protocols:** Pioneer sleep debt tracking and biological energy window alignment, but provide zero execution or habit tools.
  - *Our Solution:* Automatic ingestion of **Google Fit & Android Health Connect** telemetry to dynamically score recovery readiness and adapt the day's cognitive load (Deep Work vs. Flow vs. Rest).
- **Fabulous & Loop Habit Tracker:** Strong behavioral micro-stepping, but brittle streak resets cause user despair and abandonment.
  - *Our Solution:* Rolling non-zero consistency scoring ($0-100\%$) across Morning, Afternoon, and Evening biological windows.
- **Habitica & Solo Leveling RPGs:** Outstanding psychological pull through XP, ranking crests, and dynamic attributes, but burdened by cluttered gaming sprites.
  - *Our Solution:* **Hunter Awakening System** integrated into sleek cybernetic Zuari tokens: $+30\text{ STR XP}$ for high-priority completions, Level/Rank progression (E $\rightarrow$ S), and real-time attribute gains.

---

## 2. Departmental Division & Directory Structure

The codebase is organized into **independent functional departments**. Each department contains its own isolated components, composables, and services, strictly adhering to the **$< 150$ lines per file** rule:

```
src/
├── departments/ (or features/)
│   ├── cockpit/          # Executive vital signs, Velocity Arc, Hunter stats
│   ├── assistant/        # AI Personal Assistant, Routine Optimizer, Nudges, Calendar
│   ├── tasks/            # Dedicated execution stream, priority flame toggles, Rule-of-3
│   ├── habits/           # Circadian morning/afternoon/evening loops & consistency
│   ├── timetable/        # Chronological focus blocks, active horizon hero
│   ├── horizons/         # Monumental North Stars, Quarterly Keystones, Monthly targets
│   ├── activity/         # Reverse-chronological telemetry log, 14-day heatmap, evening audit
│   ├── notes/            # Idea-to-action scratchpad, markdown notes, pinning
│   ├── vault/            # JSON backup/restore, markdown export for Obsidian/Notion
│   └── mobile/           # Native Android bridge, Google Fit REST, Health Connect, BLE
```

---

## 3. Clutter-Free UI/UX System & Section Transitions

To eliminate clutter and cognitive overwhelm:
1. **One Focus at a Time:** The application uses a dock-based departmental switcher with hardware-accelerated micro-transitions (`opacity 0 -> 1` and `transform: translateY(4px)`).
2. **Micro-Components:** Views do not define inline tables or monolithic templates. Every card breaks down into:
   - Header / Filter bar ($< 120$ lines)
   - Input / Creator strip ($< 120$ lines)
   - Item row renderer ($< 120$ lines)
   - Coordinator container ($< 100$ lines)
3. **Zuari Aether Styling:** Dark mode default with perceptual contrast tokens (`oklch()`), hardware-accelerated glassmorphism, and minimal text glyphs with CSS Anchor tooltips.

---

## 4. Multi-Method Motivation System ("Push to Work")

When resistance or procrastination strikes, the Assistant activates four distinct psychological triggers:
1. **The 5-Minute Micro-Commitment Rule:** Lowers cognitive threshold to 5 minutes of non-negotiable kickoff time.
2. **Solo Leveling XP Surge:** Gamifies the next step with immediate attribute rewards.
3. **Friction Collapse:** Strips all planning and presents only step #1 (e.g., "Write one sentence").
4. **Circadian Energy Alignment:** Warns the user when their peak focus window is closing to create positive biological urgency.

---

## 5. Master Code Splitting Roadmap (< 150 Lines per File)

All files with $> 150$ lines are mapped to their respective departments and decomposed into modular files:

| # | File | Current Lines | Department | Split Implementation Plan (< 150 lines each) |
|:---:|:---|:---:|:---:|:---|
| 1 | `src/features/tasks/store/tasks.store.ts` | 318 | `tasks` | Delegate directly to modular `src/store/tasks.ts` facade |
| 2 | `src/components/activity/ActivityView.vue` | 450 | `activity` | `ActivityHeader.vue`, `ActivityFilters.vue`, `ActivityList.vue`, `ActivityHeatmap.vue` |
| 3 | `src/components/DashboardView.vue` | 448 | `cockpit` | `CockpitVitals.vue`, `CockpitQuickActions.vue`, `CockpitOfflineNotice.vue` |
| 4 | `src/components/dashboard/VelocityCard.vue` | 390 | `cockpit` | `VelocityArc.vue`, `CognitiveLoadBreakdown.vue`, `CircadianGauge.vue` |
| 5 | `src/components/CommandPalette.vue` | 378 | `cockpit` | `PaletteInput.vue`, `PaletteResults.vue`, `PaletteShortcuts.vue` |
| 6 | `src/components/dashboard/HunterDirectiveCard.vue` | 329 | `cockpit` | `HunterRankBadge.vue`, `HunterAttributesGrid.vue`, `HunterProgressBar.vue` |
| 7 | `src/components/EveningAuditModal.vue` | 322 | `activity` | `AuditWinsStep.vue`, `AuditPrioritiesStep.vue`, `AuditStatsSummary.vue` |
| 8 | `src/components/notes/NotesView.vue` | 295 | `notes` | `NotesHeader.vue`, `NotesEditor.vue`, `NoteItemCard.vue`, `NotesList.vue` |
| 9 | `src/components/dashboard/ExecutionQueueCard.vue` | 282 | `tasks` | Sub-components `ExecutionTaskRow.vue`, `ExecutionInputStrip.vue` |
| 10 | `src/components/vault/VaultView.vue` | 275 | `vault` | `VaultExportCard.vue`, `VaultImportCard.vue`, `VaultStatsCard.vue` |
| 11 | `src/components/dashboard/VisionDirectivesCard.vue` | 264 | `horizons` | `VisionHorizonFilter.vue`, `VisionGoalItem.vue` |
| 12 | `src/components/goals/GoalsView.vue` | 251 | `horizons` | `GoalHeader.vue`, `GoalList.vue`, `GoalCardItem.vue` |
| 13 | `src/components/timetable/TimeBlockCreator.vue` | 248 | `timetable` | `TimeBlockInputs.vue`, `TimeBlockCategorySelector.vue` |
| 14 | `src/components/habits/HabitsView.vue` | 232 | `habits` | `HabitsSection.vue`, `HabitsHeader.vue` |
| 15 | `src/components/tasks/TaskItemCard.vue` | 211 | `tasks` | `TaskItemDetails.vue`, `TaskItemControls.vue` |
| 16 | `src/components/timetable/TimeBlockItem.vue` | 204 | `timetable` | `TimeBlockRow.vue`, `TimeBlockDetails.vue` |
| 17 | `src/components/tasks/TaskCreatorStrip.vue` | 189 | `tasks` | `TaskInputBase.vue`, `TaskPriorityPills.vue` |
| 18 | `src/components/habits/HabitCreatorStrip.vue` | 188 | `habits` | `HabitInputBase.vue`, `HabitPeriodSelector.vue` |
| 19 | `src/components/dashboard/ExecutionInputStrip.vue` | 184 | `tasks` | Modularized input components |
| 20 | `src/components/tasks/TasksView.vue` | 184 | `tasks` | Clean coordinator composing filter pills and task lists |
| 21 | `src/components/dashboard/BiometricTelemetryStrip.vue` | 183 | `mobile` | `BiometricMetricTile.vue`, `WearableDeviceBadge.vue` |
| 22 | `src/components/habits/HabitCardItem.vue` | 181 | `habits` | `HabitScoreBadge.vue`, `HabitItemControls.vue` |
| 23 | `src/components/goals/GoalCreatorStrip.vue` | 175 | `horizons` | Modularized goal inputs |
| 24 | `src/components/dashboard/AiSuggestionsCard.vue` | 171 | `assistant` | `AiSuggestionItem.vue`, `AiMotivationHeader.vue` |
