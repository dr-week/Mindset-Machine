#!/usr/bin/env python3
"""
release-apk.py — Production Android APK Release Packager
Builds web assets, syncs Capacitor, compiles assembleRelease via Gradle,
calculates SHA-256 checksums, and copies the APK to public/download/ and dist-release/.
"""

import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
ANDROID_DIR = ROOT_DIR / "android"
PUBLIC_DOWNLOAD_DIR = ROOT_DIR / "public" / "download"
DIST_RELEASE_DIR = ROOT_DIR / "dist-release"


def calculate_sha256(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()


def run_cmd(cmd: list[str], cwd: Path = ROOT_DIR) -> int:
    print(f">> Executing: {' '.join(cmd)}")
    res = subprocess.run(cmd, cwd=cwd)
    return res.returncode


def main() -> int:
    print("==================================================")
    print(">> MINDSET MACHINE — ANDROID APK RELEASE PIPELINE")
    print("==================================================")

    npm_bin = "npm.cmd" if platform.system() == "Windows" else "npm"
    npx_bin = "npx.cmd" if platform.system() == "Windows" else "npx"

    # Step 1: Vite build
    print("\n[1/4] Building Vite Production Web Bundle...")
    if run_cmd([npm_bin, "run", "build-only"]) != 0:
        print("[ERROR] Vite build failed.")
        return 1

    # Step 2: Capacitor Sync
    print("\n[2/4] Syncing Web Bundle to Capacitor Android Container...")
    if run_cmd([npx_bin, "cap", "sync", "android"]) != 0:
        print("[ERROR] Capacitor Android sync failed.")
        return 1

    # Step 3: Gradle assembleRelease
    print("\n[3/4] Compiling Release APK via Gradle...")
    gradlew = ANDROID_DIR / ("gradlew.bat" if platform.system() == "Windows" else "gradlew")
    if platform.system() != "Windows" and gradlew.exists():
        os.chmod(gradlew, 0o755)

    if run_cmd([str(gradlew), "assembleRelease"], cwd=ANDROID_DIR) != 0:
        print("[ERROR] Gradle assembleRelease failed.")
        return 1

    built_apk = ANDROID_DIR / "app/build/outputs/apk/release/app-release-unsigned.apk"
    if not built_apk.exists():
        print(f"[ERROR] Expected APK not found at: {built_apk}")
        return 1

    # Step 4: Staging release artifacts and checksums
    print("\n[4/4] Packaging Release Artifacts & SHA-256 Checksums...")
    PUBLIC_DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    DIST_RELEASE_DIR.mkdir(parents=True, exist_ok=True)

    target_public_apk = PUBLIC_DOWNLOAD_DIR / "mindset-machine-release.apk"
    target_dist_apk = DIST_RELEASE_DIR / "mindset-machine-release.apk"

    shutil.copyfile(built_apk, target_public_apk)
    shutil.copyfile(built_apk, target_dist_apk)

    size_bytes = target_public_apk.stat().st_size
    size_mb = round(size_bytes / (1024 * 1024), 2)
    sha256_hash = calculate_sha256(target_public_apk)

    metadata = {
        "appName": "Mindset Machine",
        "packageName": "com.mindset.machine",
        "version": "1.0.0",
        "releaseDate": datetime.now(timezone.utc).isoformat(),
        "apkFileName": "mindset-machine-release.apk",
        "sizeBytes": size_bytes,
        "sizeMB": size_mb,
        "sha256": sha256_hash,
        "architecture": "universal-arm64-v8a-x86_64",
        "minSdk": 24,
        "targetSdk": 34,
    }

    meta_json = json.dumps(metadata, indent=2)
    (PUBLIC_DOWNLOAD_DIR / "release-metadata.json").write_text(meta_json)
    (DIST_RELEASE_DIR / "release-metadata.json").write_text(meta_json)

    print("\n==================================================")
    print(">> RELEASE BUILD SUCCESSFUL!")
    print(f"APK Location: {target_public_apk}")
    print(f"File Size:    {size_mb} MB ({size_bytes} bytes)")
    print(f"SHA-256:      {sha256_hash}")
    print("==================================================")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
