# START HERE — Mindset Machine Developer Onboarding

> [!IMPORTANT]
> Read this before touching any file. It covers setup, scripts, and the 3 architecture rules every contributor must follow.

---

## Prerequisites

| Tool | Minimum Version |
|:---|:---|
| Node.js | 20+ |
| Python | 3.10+ |
| Android Studio | Hedgehog (2023.1.1)+ |
| Java (JDK) | 17 |

Install Node deps once after clone:
```bash
npm install
```

---

## Run Locally

```bash
npm run dev        # Vite dev server → http://localhost:5173
```

---

## Key Scripts

| Script | Purpose |
|:---|:---|
| `npm test` | Run Vitest unit test suite |
| `npm run type-check` | vue-tsc type validation (zero errors required) |
| `npm run build-only` | Vite production bundle — confirm before every PR |
| `python scripts/dev/verify-all.py` | Full suite: type-check + tests + monolith audit |
| `python scripts/dev/audit-monoliths.py` | Report all files > 150 lines |
| `npm run android:sync` | Capacitor sync (web → Android assets) |
| `npm run android:build:apk` | Build release APK via Gradle |

---

## Automation Scripts

| Script | Usage | Purpose |
|:---|:---|:---|
| `new-component.py` | `python scripts/dev/new-component.py <Name> <dept>` | Scaffold component + test stub in correct department |
| `new-service.py` | `python scripts/dev/new-service.py <Name> <dept>` | Scaffold service with 150-line budget comment |
| `watch-audit.py` | `python scripts/dev/watch-audit.py` | Live file-watch; warns on any file exceeding 150 lines |
| `doc-sync.py` | `python scripts/dev/doc-sync.py` | Sync CODEBASE_MAP.md with actual src/ file tree |
| `git-snapshot.py` | `python scripts/dev/git-snapshot.py "<msg>"` | Stage all + commit + push with auto-prefixed message |

---

## Architecture Rules

- **150-line hard cap.** Every `.vue`, `.ts`, and `.py` file must stay under 150 lines. If a file grows beyond this, split it immediately — no exceptions.
- **Department ownership.** Code lives in its owning department (`cockpit`, `tasks`, `habits`, `timetable`, `horizons`, `activity`, `notes`, `vault`, `mobile`). No cross-department imports except through `src/shared/`.
- **Views are thin coordinators.** Views compose sub-components; they never define business logic, inline styles, or data manipulation directly.

---

## Verification Before Every PR

```bash
python scripts/dev/verify-all.py   # must exit 0
npm run build-only                 # must succeed
```
