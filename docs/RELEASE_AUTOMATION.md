# Mindset Machine — Android APK & Release Automations

Mindset Machine includes automated release packagers for Android APKs and Browser Extensions.

---

## 1. Quick Release Commands

### Build Production Android APK (assembleRelease)
```bash
python3 scripts/android/release-apk.py
```
This automated pipeline:
1. Compiles the Vite production web bundle (`npm run build-only`).
2. Syncs assets to the Capacitor Android project (`npx cap sync android`).
3. Invokes Gradle `assembleRelease`.
4. Stages the APK at `public/download/mindset-machine-release.apk` (and `dist-release/`).
5. Generates `release-metadata.json` with version, file size (3.2 MB), and SHA-256 checksums.

### Build Debug Android APK (assembleDebug)
```bash
python3 scripts/android/build-apk.py --mode debug
```

### Package Browser Extension (.zip)
```bash
python3 scripts/build-extension.py
```

### Run Full Quality & Monolith Audit
```bash
python3 scripts/dev/verify-all.py
```

---

## 2. CI/CD GitHub Actions

- `.github/workflows/verify.yml`: Triggered on pull requests and pushes to `main`. Executes monolith audits, UI/UX audits, type-check, vitest unit tests, and Vite build.
- `.github/workflows/build-apk.yml`: Triggered on release tags or workflow dispatch. Builds the release APK in a hosted Ubuntu runner with Java 21 and Android SDK, publishing the APK as an artifact.
