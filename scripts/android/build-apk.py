#!/usr/bin/env python3
"""
build-apk.py — Cross-platform (Linux / macOS / Windows) Android APK & Capacitor builder
for Mindset Machine.
Usage:
  python3 scripts/android/build-apk.py [--mode debug|release] [--sync-only]
"""

import argparse
import os
import platform
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
ANDROID_DIR = ROOT_DIR / "android"


def run_cmd(cmd: list[str], cwd: Path = ROOT_DIR) -> int:
    print(f">> Running: {' '.join(cmd)}")
    res = subprocess.run(cmd, cwd=cwd)
    return res.returncode


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Mindset Machine Android APK")
    parser.add_argument("--mode", choices=["debug", "release"], default="debug")
    parser.add_argument("--sync-only", action="store_true", help="Only build web and sync Capacitor")
    args = parser.parse_args()

    print("=== [1/3] Building Vite Production Web Assets ===")
    npm_bin = "npm.cmd" if platform.system() == "Windows" else "npm"
    npx_bin = "npx.cmd" if platform.system() == "Windows" else "npx"

    if run_cmd([npm_bin, "run", "build-only"]) != 0:
        print("[ERROR] Vite production build failed.")
        return 1

    print("=== [2/3] Syncing Web Assets to Android Capacitor Container ===")
    if run_cmd([npx_bin, "cap", "sync", "android"]) != 0:
        print("[ERROR] Capacitor Android sync failed.")
        return 1

    if args.sync_only:
        print("[SUCCESS] Web bundle built and synced to Android Capacitor container.")
        return 0

    print(f"=== [3/3] Assembling Android APK ({args.mode}) ===")
    gradlew = ANDROID_DIR / ("gradlew.bat" if platform.system() == "Windows" else "gradlew")
    if platform.system() != "Windows" and gradlew.exists():
        os.chmod(gradlew, 0o755)

    task = "assembleRelease" if args.mode == "release" else "assembleDebug"
    code = run_cmd([str(gradlew), task], cwd=ANDROID_DIR)
    if code != 0:
        print("[WARN] Gradle build exited with non-zero code. Ensure JAVA_HOME and ANDROID_HOME are set.")
        return code

    apk_rel = (
        "app/build/outputs/apk/release/app-release-unsigned.apk"
        if args.mode == "release"
        else "app/build/outputs/apk/debug/app-debug.apk"
    )
    apk_path = ANDROID_DIR / apk_rel
    if apk_path.exists():
        size_mb = round(apk_path.stat().st_size / (1024 * 1024), 2)
        print(f"[SUCCESS] APK built at: {apk_path} ({size_mb} MB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
