# TODO - MINDSET MACHINE (Danger Labs)

- [x] Replace mock state in `src/components/DashboardView.vue` with Pinia `useTasksStore()` data.
- [x] Add a collapsible sidebar and layout the dashboard with sidebar + main content.
- [x] Confirm task checkbox toggles are wired correctly to store actions (`toggleTask`, `deleteTask`).
- [x] Confirm goal creation input persists to the Pinia store via `addGoal` with completion toggles.
- [x] Upgrade data models and store to full TypeScript (`src/types/mindset.ts`, `src/store/tasks.ts`, `src/data/tasks.ts`).
- [x] Review and clean up `src/services/aiService.ts` for dual Ollama / OpenAI support with smart fallbacks.
- [x] Add dedicated `src/data/` layer for task, goal, and persistence helpers (`persistence.ts`).
- [x] Add full multi-tab navigation state and routing views (Overview, Goals Architect, Task Matrix, AI Strategy Co-Pilot, AI Vault).
- [x] Integrate high-performance, strict SCSS architecture (`_variables.scss`, `_mixins.scss`, `main.scss`, component scoped SCSS).
- [x] Add automated unit testing suite with Vitest and verify all test runs.
- [x] Run `npm run lint`, `npm test`, and `npm run type-check` to ensure the app is 100% stable and production-ready.
