<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/branding/logo.png">
    <img alt="Mindset Machine Logo" src="public/branding/logo.png" width="130" style="border-radius: 24px; filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4));" />
  </picture>

  <h1>MINDSET MACHINE</h1>
  <p><strong>A local-first executive dashboard and circadian routine engine.</strong></p>

  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue 3" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://capacitorjs.com/"><img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android Native" /></a>
    <a href="https://pinia.vuejs.org/"><img src="https://img.shields.io/badge/Pinia-FFE873?style=for-the-badge&logo=pinia&logoColor=35495E" alt="Pinia" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-black?style=for-the-badge" alt="MIT License" /></a>
  </p>

  <p>
    <a href="#core-architecture">Architecture</a> &bull;
    <a href="#features">Features</a> &bull;
    <a href="#quick-start">Quick Start</a> &bull;
    <a href="#known-issues">Known Issues</a> &bull;
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## Overview

**Mindset Machine** is a precision personal operating cockpit engineered for uninterrupted focus and biological alignment. It integrates daily task prioritization, circadian habit loops, calendar focus blocks, and real-time wearable biometrics into an artistic, low-noise dashboard.

All data remains strictly on your device with sub-millisecond local reactivity and cross-platform native Android sync.

---

## Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:zap.svg" width="18" height="18" valign="middle" /> Execution Stream</h3>
      <p>Priority clustering with mental energy allocation (<code>Deep Focus</code>, <code>Flow State</code>, <code>Quick Tactical</code>), critical flame toggles, and Rule-of-3 daily locks.</p>
    </td>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:sun.svg" width="18" height="18" valign="middle" /> Circadian Habit Engine</h3>
      <p>Habits grouped into Morning, Afternoon, and Evening biological windows with rolling consistency scoring (0&ndash;100%) to eliminate streak break fatigue.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:clock.svg" width="18" height="18" valign="middle" /> Focus Timetable</h3>
      <p>Chronological time-blocking across deep focus, recovery, and ritual sanctuaries with an active countdown horizon for your current block.</p>
    </td>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:activity.svg" width="18" height="18" valign="middle" /> Activity & Telemetry Ledger</h3>
      <p>Live reverse-chronological event feed logging completed tasks, habit check-ins, and focus minutes alongside 14-day consistency heatmaps.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:target.svg" width="18" height="18" valign="middle" /> Vision Horizons</h3>
      <p>Long-range strategic planning structured across Monumental North Stars, Quarterly Keystones, and Monthly checkpoints with completion velocity.</p>
    </td>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:bluetooth.svg" width="18" height="18" valign="middle" /> Wearable & Health Bridge</h3>
      <p>Web Bluetooth (BLE GATT) connectivity for smartwatches and fitness bands (<code>0x180D</code> Heart Rate) plus Android Health Connect ingestion.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:sparkles.svg" width="18" height="18" valign="middle" /> Autonomous AI Directives</h3>
      <p>Dual-provider strategic co-pilot supporting local Ollama (<code>llama3.2</code>, <code>deepseek-r1</code>) and cloud models with heuristic offline fallback.</p>
    </td>
    <td width="50%" valign="top">
      <h3><img src="https://api.iconify.design/lucide:shield-check.svg" width="18" height="18" valign="middle" /> Absolute Data Sovereignty</h3>
      <p>Local-first storage in IndexedDB/localStorage with one-click JSON backup and formatted Markdown vault export for Obsidian, Notion, and Logseq.</p>
    </td>
  </tr>
</table>

---

## Core Architecture

<div align="center">

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **User Interface** | <img src="https://api.iconify.design/logos:vue.svg" width="14" height="14" valign="middle" /> Vue 3 + TypeScript | Componentized bento layouts and reactive view modules |
| **Design Language** | <img src="https://api.iconify.design/lucide:palette.svg" width="14" height="14" valign="middle" /> Zuari Aether Tokens | Scoped cards, OKLCH color tokens, and CSS Anchor tooltips |
| **State Management** | <img src="https://api.iconify.design/logos:pinia.svg" width="14" height="14" valign="middle" /> Pinia Store | Unified reactive state, activity feed, and multi-factor efficiency |
| **Mobile Runtime** | <img src="https://api.iconify.design/logos:capacitorjs-icon.svg" width="14" height="14" valign="middle" /> Capacitor Android | Native bridge, hardware haptics, and mobile viewports |
| **Hardware Bridge** | <img src="https://api.iconify.design/lucide:bluetooth.svg" width="14" height="14" valign="middle" /> BLE GATT API | Live heart rate, step ingestion, and IoT peripheral sync |

</div>

---

## Known Issues

- **Android CLI Compilation**: Direct host builds (`./gradlew assembleDebug`) require a configured `JAVA_HOME`. Build directly in Android Studio (`npm run android:open`) as an alternative.
- **Web Bluetooth Policies**: Web Bluetooth requires HTTPS or `localhost` and a direct user-gesture trigger to scan and pair peripherals.
- **Health Connect Credentials**: Android 14+ Health Connect sync requires signed application certificates and explicit user runtime permissions.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dr-week/Mindset-Machine.git
cd Mindset-Machine

# Install dependencies
npm install

# Start local development server
npm run dev

# Run comprehensive verification pipeline (TypeScript + Oxlint + ESLint + Vitest)
npm run verify

# Build production bundle and synchronize with Android
npm run build && npx cap sync android
```

---

## Contributing

1. Fork the repository and create your topic branch (`git checkout -b feature/enhancement`).
2. Adhere to the zero-monolith design standard (keep components modular and scoped).
3. Validate your changes with `npm run verify` (all 15+ tests and lints must pass).
4. Submit a descriptive Pull Request.

---

<div align="center">
  <p><sub>Crafted with precision by <strong>Danger Labs</strong>. Distributed under the <a href="LICENSE">MIT License</a>.</sub></p>
</div>
