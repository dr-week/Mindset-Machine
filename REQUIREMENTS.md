# REQUIREMENTS — MINDSET MACHINE (Aether-Zuari Architecture)

> **MINDSET MACHINE**: Ultra-fast, minimal, artistic productivity platform built with **Zuari Framework Design Philosophy** (`@zuari/recipes`, `@zuari/glyphs`, `@zuari/signals`), Vue 3, Pinia, TypeScript, and Capacitor Android. Engineered by **Danger Labs**.

---

## 1. Core Principles & Design Language

| Principle | Technical Implementation | Purpose |
| :--- | :--- | :--- |
| **Zero Monoliths** | Micro-component structure (`HunterDirectiveCard`, `VelocityCard`, `ExecutionQueueCard`, `VisionDirectivesCard`, `AiSuggestionsCard`, `TimetableView`, `NotesView`, `VaultView`) | Maximum maintainability, isolated hot-reloads, testability. |
| **Aether-Glyph UI** | Icon-first affordance, crisp vector glyphs, minimal text, CSS Anchor-positioned tooltips (`.nova-glyph-dock`, `.nova-glyph-tile`, `.nova-glyph-tooltip`) | Zero visual noise, deep focus, calm aesthetic. |
| **Glassmorphism & OKLCH** | Scoped `@scope (.zuari-card)` and `oklch()` color tokens | Uniform perceptual contrast, hardware-accelerated blur. |
| **Tidal Flow Reactivity** | Micro-signals and atomic state sync | Sub-millisecond response, zero blocking overhead. |
| **Cross-Platform Parity** | Capacitor Android + Web Bluetooth Low Energy (BLE) GATT | Direct hardware sync for custom IoT bands and mobile apps. |

---

## 2. Functional Requirements (FR)

### FR-01: Mission Control Bento Matrix
- **Hunter Awakening Status**: RPG Solo Leveling XP, Level progression, Rank crests (E $\rightarrow$ S), and dynamic attributes (STR, INT, VIT, DIS).
- **AI Strategic Perspective**: High-density daily motivation, dual-provider (Ollama / OpenAI) synthesis, and heuristic offline fallback.
- **Velocity Index**: 120px SVG radial progress arc, cognitive load breakdown (Deep, Flow, Quick), and Huberman circadian recovery.
- **Biometrics & IoT Wearable Bridge**: Direct BLE GATT pairing (`0x180D` Heart Rate, `0x180F` Battery) & custom ESP32/Pico W JSON webhook ingestion.
- **Execution Queue**: Priority clustering (High Impact flame toggle vs. Standard Flow), mental energy filters, and batch sweeping.
- **Dedicated Tasks Matrix Stream**: Full standalone focus canvas with neuro-cognitive load filters (⚡ Deep, 🌊 Flow, ☕ Quick), Critical Flame toggles, and Rule-of-3 tags.
- **Vision Architect Horizons**: Dedicated strategic directives matrix categorized into Monumental North Stars (🏆), Quarterly Keystones (🧭), and Monthly Tactical Horizons (📅) with target dates and milestone velocity.

### FR-02: Circadian Timetable Subsystem
- **Chronological Time-Blocking**: Semantic categories:
  - ⚡ `Deep Focus` (uninterrupted cognitive block)
  - ☀️ `Vitality & Sun` (circadian optical exposure & hydration)
  - 🌿 `Movement / Ritual` (somatic reset & nutrition)
  - ☕ `Admin / Sweeping` (low-energy inbox clearing)
  - 🌙 `Digital Sunset / Rest` (evening wind-down & metacognitive audit)
- **Active Horizon Card**: Dynamic detection of current time window with real-time countdown and quick-complete toggle.

### FR-03: Circadian Habit Engine & Consistency Scorer
- **Circadian Grouping**: Morning (Cortisol/light/hydration), Afternoon (Sustained focus/NSDR), Evening (Melatonin/dim light).
- **Loop-Style Consistency Metric**: Rolling consistency score percentages instead of brittle zero-sum streak resets.
- **Gamified Discipline Attribute**: Habit completions dynamically empower Hunter Discipline and Level progression.

### FR-04: Idea-to-Action Notes Scratchpad
- **Zero-Latency Capture**: Fluid Markdown-supported thoughts, instant unblocking.
- **Tactile Pinning**: Top-level persistence for critical mental models.

### FR-04: Telemetry Vault & State Persistence
- **Full Data Sovereignty**: One-click JSON backup export and lossless schema restore.
- **Human-Readable Export**: Formatted Markdown vault export for Obsidian, Notion, or Logseq.
- **Evening Metacognitive Audit**: Daily wins log, velocity tracking, and next-day priority lock.

---

## 3. Non-Functional Requirements (NFR)

- **NFR-01 (Bundle Size & Performance)**: Core bundle $< 65\text{ KB}$ gzipped. Total Blocking Time (TBT) $= 0\text{ ms}$.
- **NFR-02 (Type Soundness)**: 100% strict TypeScript typing without `any` bypasses.
- **NFR-03 (Code Modularization)**: Every view component must remain $< 400$ lines. Monolithic layouts are forbidden.
- **NFR-04 (Accessibility)**: Screen reader ARIA labels on all vector glyph tiles; keyboard shortcut navigation (`Ctrl+K`, `Ctrl+Z`, `C`, `N`).
