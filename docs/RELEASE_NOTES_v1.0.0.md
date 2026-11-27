# Mindset Machine v1.0.0 — Official Production Release

**Mindset Machine** is an offline-first, sovereign personal operating cockpit engineered for uninterrupted monk-mode focus, biological circadian alignment, and hierarchical task architecture.

---

### Highlights

1. **Local-First Hybrid Storage Architecture**:
   - Zero reliance on custom backend servers or database lock-in.
   - **Tier 1 (Instant Cache)**: Client-side IndexedDB sandbox with sub-millisecond local reactivity.
   - **Tier 2 (Dedicated Local Directory)**: Direct File System Access API (`showDirectoryPicker`) synchronizing `tasks.json` and `mindset_logs.json` on your PC drive.
   - **Tier 3 (Cloud Sync)**: Google Drive API v3 sync using non-sensitive `drive.file` scope only (`MindsetMachine_Data` folder) with record-level Last-Write-Wins (LWW) conflict resolution and soft-deletes (`deletedAt`).

2. **Zuari 5-Plane UI/UX Architecture**:
   - Inspired by [`dr-week/fast-framework`](https://github.com/dr-week/fast-framework).
   - Divides all views into **Surface** (Execution Canvas), **Dock** (Navigation Bar), **Drawer** (Google Cloud & Gemini setup), **Command** (`Ctrl+K` Omni-Launcher), and **Ambient** (HUD pills).

3. **Gemini 2.5 Flash AI Task Decomposition**:
   - Automated decomposition of macro goals into tasks, micro-steps, and checklists directly integrated into the Focus Stream.

4. **Google Fit Biometrics & Circadian Readiness**:
   - Live synchronization of daily steps, resting heart rate, and sleep metrics into a dynamic Monk-Mode readiness score.

5. **Micro-Modular Departments**:
   - Fully decoupled domain modules under `src/departments/`: Cockpit (`CP`), Focus Stream (`FS`), Circadian Timetable (`TT`), Habit Engine (`HB`), Vision Horizons (`VH`), Gemini AI (`AI`), Biometrics (`BM`), Data Vault (`VT`).
   - Every file strictly abides by the **Zero Monolith Rule (< 150 lines)**.

---

### Downloads & Assets

- **Android Production APK**: `mindset-machine-release.apk`
  - Version: `v1.0.0`
  - Size: `3.2 MB`
  - Minimum SDK: Android 7.0+ (API 24+)
  - SHA-256: `779ae1cd9561d13dd8bd1c5cbfbecb52309c34de4c65e8b0a4bec04b6f7cf15a`
- **Browser Companion Extension**: `mindset-machine-extension.zip`
  - Standard: Google Chrome Manifest V3
  - Size: `5.5 KB`
  - SHA-256: `f371758f60924305b7a8ab66983b1d737d8aa2d5c8d05a0f9df635ba29f0d130`
