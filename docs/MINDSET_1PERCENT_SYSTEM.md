# MINDSET MACHINE — The 1% Improvement Ecosystem

## 1. The Core Mindset Philosophy: 1% Daily Compounding

The Mindset Machine is engineered around a foundational mathematical reality:
$$\text{Output}_{365} = 1.01^{365} \approx 37.78\times$$
$$\text{Degradation}_{365} = 0.99^{365} \approx 0.0255\times$$

A 1% daily improvement in a man's mindset, physical recovery, focus habits, and tactical execution compounds into a **37-fold elevation** over a single year. Conversely, a 1% daily drift into distraction, sleep debt, or procrastination degrades executive capacity to nearly zero.

---

## 2. Competitive Benchmarking & Architectural Solutions

| Platform | Core Strength | Fatal Flaw | Mindset Machine Solution |
|:---|:---|:---|:---|
| **Sunsama & Motion** | Daily timeboxing & planning | Overwhelming UI clutter; 3-pane sidebars cause visual paralysis | **Zuari-Aether Docking:** Single-department view with smooth 180ms cross-fades. Zero sidebars. |
| **Rise Science & Huberman** | Circadian energy window tracking | Zero execution or task management | **Circadian Infographic Engine:** Ingests Google Fit / Health Connect metrics directly into the daily velocity curve. |
| **Fabulous & Loop Habits** | Behavioral micro-stepping | Brittle streaks cause abandonment upon single miss | **Rolling Consistency Scoring (0-100%):** Non-zero consistency metric across Morning, Afternoon, Evening windows. |
| **Habitica / Solo Leveling** | RPG XP & dopamine feedback | Cartoonish game clutter unsuitable for high-stakes work | **Hunter Awakening System:** Sleek cybernetic rank badges (E $\rightarrow$ S), STR/INT/VIT/DIS attribute growth (+30 XP high-priority). |
| **WHOOP & Oura** | Deep biological recovery scoring | High paywalls, isolated from cognitive task queue | **Open Wearable Bridge:** Google Fit REST + Android Health Connect + BLE GATT + ESP32 custom IoT watch support. |

---

## 3. The 9 Modular Functional Departments

Each department is isolated, strictly typed, and composed of files under **150 lines**:

```
src/
├── navigation/            # View routing, TopBar, BottomNav, Dock, Palette (<150 lines each)
├── layout/                # AppShell.vue (Viewport orchestrator & safe-area insets)
├── components/
│   ├── dashboard/         # Cockpit Department: Hunter stats, Velocity gauge, Queue, Vision, Biometrics
│   ├── tasks/             # Focus Stream Department: Execution stream, Top 3 star, Priority flame
│   ├── timetable/         # Schedule Department: Chronological time blocks, active focus hero
│   ├── habits/            # Habit Loop Department: Morning / Afternoon / Evening loops, consistency %
│   ├── goals/             # Horizons Department: Monumental, Quarterly, Monthly North Stars
│   ├── activity/          # Audit Department: 14-day heatmap, telemetry logs, Evening Audit
│   ├── assistant/         # AI Assistant Department: Deep work nudges, 5-min kickoff, friction collapse
│   ├── notes/             # Scratchpad Department: Fast markdown notes, pinning
│   └── vault/             # Vault Department: IndexedDB health, JSON backup, Obsidian export
```

---

## 4. Circadian Energy Windows & Telemetry Architecture

The app synchronizes task execution with human biology:

```
06:00 ──────── 10:00 ──────── 14:00 ──────── 18:00 ──────── 22:00
Cortisol Rise   Morning Peak   Post-Prandial  Second Wave    Melatonin Rise
Wake & Hydrate  Deep Work #1   Tactical Admin High Output    Audit & Sleep
                (Deep Energy)  (Flow / Quick) (Top 3 Goals)  (Wind-down)
```

1. **Morning Peak (08:00 - 12:00):** Suggested for `energy: 'deep'` (STR & INT XP +30).
2. **Tactical Dip (12:00 - 15:30):** Suggested for `energy: 'quick'` or `energy: 'flow'`.
3. **Second Wave (16:00 - 19:30):** Closing execution queue items and quarterly goal milestones.
4. **Circadian Wind-down (21:00+):** Triggers the **Evening Audit** dialog (Win note, Tomorrow's #1 priority, Velocity rate review).

---

## 5. UI/UX Dual-Form Adaptation (PC Horizontal vs. Android Vertical)

- **Android Vertical Viewport ($< 600\text{px}$):**
  - Sticky `MobileTopHeader` with `env(safe-area-inset-top)`.
  - 5-slot `MobileBottomNav` with `env(safe-area-inset-bottom)`.
  - Secondary tabs rendered in a 3-column symmetrical bottom sheet (`NavOverflowSheet`).
  - Cards take 100% full width (`grid-column: 1 / -1 !important`).
  - Actions visible without hover using `@media (hover: none)`.
  - Touch targets minimum $44\times 44\text{px}$.
- **PC Horizontal Viewport ($\ge 900\text{px}$):**
  - Sticky `ApexHeaderDock` with keyboard shortcuts (`Ctrl+K`, `1-9`).
  - 12-column Bento Grid: Hunter (7) + Velocity (5), Execution (7) + Vision (5), AI Suggestions (12).
  - Hover micro-interactions with hardware-accelerated transforms.

---

## 6. Automation Scripts Suite

All routines are automated for rapid development and zero-regression maintenance:

| Script | Command | Purpose |
|:---|:---|:---|
| `audit-monoliths.py` | `npm run audit:monoliths` | Scans all files; fails if any file $> 150$ lines |
| `audit-uiux.py` | `npm run audit:uiux` | Verifies safe-area, mobile responsive media queries, and touch targets |
| `verify-all.py` | `npm run verify:all` | Runs monolith audit, UI/UX audit, type-check, vitest, build, capacitor sync |
| `doc-sync.py` | `npm run docs:sync` | Auto-scans all 128+ files and regenerates `CODEBASE_MAP_AUTO.md` |
| `build-apk.ps1` | `npm run android:build:apk` | Compiles optimized native debug APK via Gradle with zero manual steps |
