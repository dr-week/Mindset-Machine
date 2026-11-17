# MINDSET MACHINE — Native Android, Google Fit & API Integrations

## 1. Native Android Architecture (Capacitor Runtime)

Mindset Machine runs as a progressive web client and as a compiled native Android application via **Capacitor 8.5+**.

### Auto-Detection & Automatic Phone Connection
When the application launches on a physical phone or emulator:
1. `Capacitor.isNativePlatform()` returns `true`.
2. The app immediately initiates background initialization:
   - Probes `NativeHealthConnect` / `GoogleFitService`.
   - Checks biometric permissions (`BODY_SENSORS`, `ACTIVITY_RECOGNITION`).
   - Hooks into the Android lifecycle (`appStateChange` / resume) to perform instant delta syncing without requiring user clicks.
3. If running on desktop/web, the system gracefully falls back to circadian heuristics and simulated biometrics.

---

## 2. Google Fit & Android Health Connect Integration

### Ingestion Flow
```
[ Google Fit REST API / Android Health Connect ]
                      │
                      ▼
        [ NativeHealthConnectPlugin ]
                      │
                      ▼
           [ GoogleFitBridgeService ]
                      │
   ┌──────────────────┴──────────────────┐
   ▼                                     ▼
[ Step Count & Active Minutes ]    [ Resting Heart Rate & Sleep Stages ]
   │                                     │
   └──────────────────┬──────────────────┘
                      ▼
           [ Hunter Biometric Store ]
                      │
                      ▼
     [ Dynamic Recovery & Velocity Arc ]
```

### Supported Data Types
- **Daily Step Count:** Fuels the Vitality attribute and XP calculations.
- **Sleep Hours & Deep Sleep Ratio:** Governs daily recovery readiness score ($0-100\%$).
- **Resting Heart Rate (RHR):** Detects systemic physical stress.
- **Active Focus Minutes:** Combined with time-blocked focus sessions to compute daily execution efficiency.

---

## 3. Google Calendar & Assistant Time-Blocking

- **Calendar Synchronization:** Routine time-blocks (Deep Focus, Sunlight/Vitality, Movement, Sunset Rest) can be exported to standard `.ics` format or directly synced via Google Calendar API endpoints.
- **Proactive Nudges:** Local Android notifications trigger 5 minutes before scheduled focus blocks, accompanied by micro-commitments ("Start with just 5 minutes: Open document and write one sentence").
