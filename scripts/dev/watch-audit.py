#!/usr/bin/env python3
"""
watch-audit.py - Continuously monitors src/ for 150-line violations.
Polls every 3 seconds. No external dependencies required.
Usage: python scripts/dev/watch-audit.py
Press Ctrl+C to stop.
"""

import sys
import time
import os
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "src"
THRESHOLD = 150
POLL_INTERVAL = 3
EXCLUDED = {"__tests__", "node_modules", "dist"}

def get_violations() -> list[tuple[Path, int]]:
    violations = []
    for path in SOURCE_DIR.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".vue", ".js"}:
            continue
        rel_parts = set(path.relative_to(ROOT).parts)
        if EXCLUDED.intersection(rel_parts):
            continue
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
            if len(lines) > THRESHOLD:
                violations.append((path, len(lines)))
        except Exception:
            pass
    return sorted(violations, key=lambda x: -x[1])

def clear_line():
    sys.stdout.write("\r" + " " * 80 + "\r")
    sys.stdout.flush()

def main():
    print(f"[WATCHER] Monitoring src/ for >{THRESHOLD}-line violations every {POLL_INTERVAL}s")
    print("[WATCHER] Press Ctrl+C to stop.\n")

    last_violations: set[str] = set()

    try:
        while True:
            violations = get_violations()
            current_set = {str(p) for p, _ in violations}

            if violations:
                # Only print if changed
                if current_set != last_violations:
                    print(f"\n[{time.strftime('%H:%M:%S')}] VIOLATIONS DETECTED:")
                    for path, count in violations:
                        rel = path.relative_to(ROOT).as_posix()
                        print(f"  [ALERT] {rel} has {count} lines -- split required!")
                    last_violations = current_set
            else:
                if last_violations:
                    print(f"\n[{time.strftime('%H:%M:%S')}] [OK] All files within {THRESHOLD}-line limit.")
                    last_violations = set()
                else:
                    clear_line()
                    sys.stdout.write(
                        f"[{time.strftime('%H:%M:%S')}] [OK] Monitoring... (0 violations)"
                    )
                    sys.stdout.flush()

            time.sleep(POLL_INTERVAL)

    except KeyboardInterrupt:
        print("\n[WATCHER] Stopped.")

if __name__ == "__main__":
    main()
