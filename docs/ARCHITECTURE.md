# Mindset Machine — Architectural Specification

Mindset Machine is an offline-first, sovereign execution system combining **Zuari 5-Plane UI/UX architecture**, **Local-First Hybrid Storage**, **Google Fit Biometrics**, and **Gemini 2.5 Flash AI Task Decomposition**.

---

## 1. Micro-Modular Departments

Every application domain is decoupled into a dedicated department package under `src/departments/`:

```
src/departments/
├── cockpit/          # Executive dashboard, Hunter Mode, execution queue
├── focus/            # Deep work focus stream, micro-steps, sub-tasks
├── schedule/         # Circadian timetable, routine optimization
├── habits/           # Streak consistency, heatmaps, monk-mode habits
├── vision/           # Macro goals, OKRs, milestone tracking
├── ai/               # Gemini 2.5 Flash prompt execution & architect
├── biometrics/       # Google Fit physical telemetry (steps, heart rate, readiness)
├── vault/            # Local directory export, notes, and cloud backup
├── types.ts          # Department manifests, health states, and plane contracts
└── departmentRegistry.ts # Unified composition of all 8 departments
```

### Department Properties
- **Zero Monolith Guarantee**: Every module and component is strictly `< 150 lines`.
- **Zuari Plane Mapping**: Each department declares its recommended presentation plane (`surface`, `dock`, `drawer`, `command`, `ambient`).
- **Explicit API Dependencies**: Each department specifies the exact connection adapters it utilizes.

---

## 2. Unified API Connections Hub

Located at `src/connections/`, the connection manager provides a standardized lifecycle (`checkHealth()`, `ping()`, `disconnect()`) and telemetry reporting across 6 external boundaries:

| Connection ID | Adapter Module | Category | Primary Function |
| :--- | :--- | :--- | :--- |
| `indexeddb` | `IndexedDbAdapter` | Storage | Instant client-side offline store & query engine |
| `local_filesystem` | `FilesystemAdapter` | Storage | Native File System Access API (`showDirectoryPicker`) |
| `google_drive` | `GoogleDriveAdapter` | Cloud | Google Drive API v3 (`drive.file` scope) LWW sync |
| `google_fit` | `GoogleFitAdapter` | Biometric | REST aggregate endpoints for steps, heart rate, and sleep |
| `gemini_ai` | `GeminiAdapter` | AI | Gemini 2.5 Flash hierarchical task decomposition |
| `capacitor_native` | `CapacitorAdapter` | Hardware | Native Android/iOS runtime detection & Haptics bridge |

---

## 3. Local-First Hybrid Storage Tiers

```
[UI State / Store]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│  Tier 1: Browser / Mobile Cache (IndexedDB)            │
│  - Instant reads/writes                                │
│  - Single source of truth for UI                      │
└──────────────────────┬─────────────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ Tier 2: Dedicated Folder   │   │ Tier 3: Cloud Sync        │
│ - File System Access API  │   │ - Google Drive API v3     │
│ - tasks.json              │   │ - drive.file scope        │
│ - mindset_logs.json       │   │ - MindsetMachine_Data     │
└───────────────────────────┘   │ - Record-level LWW merge  │
                                └───────────────────────────┘
```

### Conflict Resolution
On synchronization, tasks are merged using **Record-Level Last-Write-Wins (LWW)** comparing ISO-8601 `updatedAt` timestamps. Soft-deletes (`deletedAt`) ensure task deletions propagate correctly across devices.

---

## 4. Zuari 5-Plane Feature Division Matrix

Inspired by [`dr-week/fast-framework`](https://github.com/dr-week/fast-framework):
1. **Surface Plane**: Active full-bleed task canvas (Dashboard, Focus Stream).
2. **Dock Plane**: High-frequency switching bar (ApexHeaderDock, MobileBottomNav).
3. **Drawer Plane**: Contextual configuration panels (`GoogleCloudDrawer.vue`).
4. **Command Plane**: On-demand omni-launcher triggered via `Ctrl+K`.
5. **Ambient Plane**: Continuous low-frequency status badges (Readiness HUD, Drive sync status).
