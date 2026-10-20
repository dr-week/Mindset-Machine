# Mindset Machine

> A local-first executive dashboard and daily routine tracker. Built for focus, circadian rhythm, and deep work.

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-18181b?style=flat-square)](https://github.com/dr-week/Mindset-Machine)
[![Stack](https://img.shields.io/badge/Stack-Vue%203%20%7C%20TypeScript-18181b?style=flat-square)](https://github.com/dr-week/Mindset-Machine)
[![Design](https://img.shields.io/badge/Design-Zuari%20Aether-18181b?style=flat-square)](https://github.com/dr-week/Mindset-Machine)
[![License](https://img.shields.io/badge/License-MIT-18181b?style=flat-square)](LICENSE)

---

## Overview

Mindset Machine brings your tasks, circadian habits, daily time blocks, and biological telemetry together into a single, distraction-free cockpit. 

Everything runs locally on your device with zero cloud tracking, sub-millisecond response times, and native Android support.

---

## Features

- **Execution Stream** — Priority queuing with mental energy filtering (`Deep Focus`, `Flow`, `Quick Tactical`) and Rule-of-3 focus.
- **Circadian Habits** — Morning, Afternoon, and Evening protocols with rolling consistency scoring to prevent streak fatigue.
- **Focus Timetable** — Scheduled time-blocking with an active countdown horizon for your current focus block.
- **Activity Ledger** — Chronological timeline of everything completed during the day with 14-day consistency heatmaps.
- **Vision Horizons** — High-level direction mapped across Monumental, Quarterly, and Monthly milestones.
- **Biometrics & Wearables** — Web Bluetooth (BLE) pairing for smartwatches and bands to log steps, heart rate, and recovery.
- **Local AI Directives** — Dual-engine co-pilot supporting local Ollama (`llama3.2`, `deepseek-r1`) or cloud models for daily synthesis.
- **Data Sovereignty** — 100% on-device storage with one-click JSON backup and Markdown vault exports.

---

## Known Issues

- **Android CLI Build**: Terminal builds (`./gradlew assembleDebug`) require a host `JAVA_HOME`. Build directly via Android Studio (`npm run android:open`) as an alternative.
- **Bluetooth Permissions**: Web Bluetooth requires HTTPS or `localhost` and a user gesture trigger to initiate pairing.
- **Health Connect**: Full Android Health Connect synchronization requires signed production credentials on Android 14+.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/dr-week/Mindset-Machine.git
cd Mindset-Machine

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run quality checks (Type-check + Linter + Tests)
npm run verify

# Build & sync to Android
npm run build && npx cap sync android
```

---

## Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repo and create your branch (`git checkout -b feature/improvement`).
2. Keep components modular and scoped (no monolith files).
3. Run `npm run verify` to make sure all tests and lints pass.
4. Open a clean Pull Request.

---

## License

Created by **Danger Labs**. Released under the [MIT License](LICENSE).
