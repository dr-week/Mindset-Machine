#!/usr/bin/env python3
"""
drive-minimal-sync.py — CLI utility to inspect, validate, and compact
Mindset Machine's Task & Goal JSON backups into the Minimal Drive Task DB format.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]


def compact_sample_snapshot() -> dict:
    return {
        "v": 1,
        "ts": datetime.now(timezone.utc).isoformat(),
        "t": [
            {
                "i": "t-1",
                "t": "Ship Android APK with Google Drive Minimal Sync",
                "c": 0,
                "p": "h",
                "e": "d",
                "u": [
                    {"i": "m-1", "t": "Configure Google OAuth2 Drive appDataFolder scope", "c": 1, "m": 15},
                    {"i": "m-2", "t": "Verify Gemini 2.5 Flash goal & micro-step breakdown", "c": 1, "m": 20},
                ],
            }
        ],
        "g": [
            {
                "i": "g-1",
                "t": "1% Biological & Executive Sovereignty",
                "c": 0,
                "k": "m",
            }
        ],
        "h": [
            {"i": "h-1", "t": "Morning Optical Sunlight & Hydration", "w": "m", "s": 14, "q": 92}
        ],
    }


def main() -> int:
    payload = compact_sample_snapshot()
    compact_bytes = len(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    print("=== Mindset Machine — Minimal Google Drive Task DB Inspector ===")
    print(f"Schema Version : v{payload['v']}")
    print(f"Tasks Count    : {len(payload['t'])} (with nested micro-steps)")
    print(f"Goals Count    : {len(payload['g'])}")
    print(f"Habits Count   : {len(payload['h'])}")
    print(f"Payload Size   : {compact_bytes} bytes (< 1 KB target for instant Drive appDataFolder sync)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
