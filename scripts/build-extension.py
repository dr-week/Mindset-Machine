#!/usr/bin/env python3
"""
build-extension.py — Packages Mindset Machine Chrome/Edge/Firefox Manifest V3 Extension
Creates a zip distribution in public/download/ and dist-release/.
"""

import hashlib
import json
import os
import shutil
import zipfile
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
EXTENSION_DIR = ROOT_DIR / "extension"
PUBLIC_DOWNLOAD_DIR = ROOT_DIR / "public" / "download"
DIST_RELEASE_DIR = ROOT_DIR / "dist-release"


def calculate_sha256(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()


def main() -> int:
    print("==================================================")
    print(">> PACKAGING MINDSET MACHINE BROWSER EXTENSION")
    print("==================================================")

    manifest_file = EXTENSION_DIR / "manifest.json"
    if not manifest_file.exists():
        print(f"[ERROR] Missing manifest file: {manifest_file}")
        return 1

    manifest = json.loads(manifest_file.read_text())
    version = manifest.get("version", "1.0.0")

    PUBLIC_DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    DIST_RELEASE_DIR.mkdir(parents=True, exist_ok=True)

    zip_filename = "mindset-machine-extension.zip"
    target_public_zip = PUBLIC_DOWNLOAD_DIR / zip_filename
    target_dist_zip = DIST_RELEASE_DIR / zip_filename

    # Build zip bundle
    with zipfile.ZipFile(target_public_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(EXTENSION_DIR):
            for file in files:
                abs_path = Path(root) / file
                rel_path = abs_path.relative_to(EXTENSION_DIR)
                zipf.write(abs_path, rel_path)

    shutil.copyfile(target_public_zip, target_dist_zip)

    size_bytes = target_public_zip.stat().st_size
    size_kb = round(size_bytes / 1024, 2)
    sha256 = calculate_sha256(target_public_zip)

    ext_metadata = {
        "name": manifest.get("name"),
        "version": version,
        "manifestVersion": manifest.get("manifest_version"),
        "releaseDate": datetime.now(timezone.utc).isoformat(),
        "fileName": zip_filename,
        "sizeBytes": size_bytes,
        "sizeKB": size_kb,
        "sha256": sha256,
    }

    (PUBLIC_DOWNLOAD_DIR / "extension-metadata.json").write_text(json.dumps(ext_metadata, indent=2))
    (DIST_RELEASE_DIR / "extension-metadata.json").write_text(json.dumps(ext_metadata, indent=2))

    print(f"[SUCCESS] Browser Extension packaged: {target_public_zip} ({size_kb} KB)")
    print(f"SHA-256: {sha256}")
    print("==================================================")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
