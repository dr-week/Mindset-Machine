<p align="center">
  <img src="https://img.shields.io/badge/DANGER%20LABS-ENTERPRISE-000000?style=for-the-badge&logo=target&logoColor=FF3E3E" alt="Danger Labs" />
</p>

<h1 align="center">MINDSET MACHINE</h1>

<p align="center">
  <strong>Minimalist productivity cockpit and daily executive routine tracker.</strong><br />
  Designed and engineered by <strong>Danger Labs</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Android-0A84FF?style=flat-square&logo=android&logoColor=white" alt="Platform" />
  <img src="https://img.shields.io/badge/Stack-Vue%203%20%7C%20TypeScript-42B883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Stack" />
  <img src="https://img.shields.io/badge/Design-Zuari%20Aether-6C5CE7?style=flat-square" alt="Zuari Aether" />
  <img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License" />
</p>

---

## What It Does

**Mindset Machine** is a clean, local-first daily executive dashboard designed by **Danger Labs** to keep track of your focus, habits, schedule, and biological readiness in one place without bloat.

- **Tasks Matrix**: Prioritize tasks by cognitive energy (Deep, Flow, Quick) with critical flame tags and Rule-of-3 focus.
- **Circadian Habits**: Morning, Afternoon, and Evening non-negotiable protocols with Loop-style consistency scoring.
- **Focus Timetable**: Chronological time-blocking with an active countdown horizon for your current focus block.
- **Activity Ledger**: Chronological event ledger logging actions, habits, focus minutes, and 14-day consistency heatmaps.
- **Vision Architect**: High-level horizons split into Monumental North Stars, Quarterly Keystones, and Monthly milestones.
- **Wearables & Biometrics**: Pairs with Bluetooth Low Energy (BLE) smartwatches or Health Connect for live heart rate, recovery, and step tracking.
- **AI Directives**: Dual-engine intelligence (local Ollama or cloud) for daily perspective and next-move synthesis.
- **Data Sovereignty**: 100% offline-ready, stored on-device with one-click JSON and Markdown backup exports.

---

## Current Known Issues

- **Android CLI Build**: Compiling the standalone APK directly via terminal requires `JAVA_HOME` configured on your machine. You can open and build the project in Android Studio instead (`npm run android:open`).
- **Bluetooth in Browsers**: Web Bluetooth requires HTTPS or `localhost` with a user interaction trigger to start scanning.
- **Health Connect**: Full Android Health Connect synchronization requires signed production credentials on Android 14+.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Launch development server
npm run dev

# 3. Verify code quality (TypeScript + Lint + Tests)
npm run verify

# 4. Sync production assets to native Android
npm run build && npx cap sync android
```

---

## Contributing

1. Fork the repository and create your topic branch (`git checkout -b feature/update`).
2. Adhere to the zero-monolith architecture (keep components modular and under 400 lines).
3. Ensure all tests and lints pass (`npm run verify`).
4. Submit a Pull Request.

---

## Credits

Designed, architected, and maintained by **Danger Labs**. Licensed under the MIT License.
