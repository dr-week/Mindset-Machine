#!/usr/bin/env python3
"""
verify-all.py - Complete Mindset Machine verification pipeline.
Runs:
1. Monolith audit (< 150 lines strict enforcement)
2. TypeScript static analysis (vue-tsc)
3. Vitest unit tests
4. Vite production bundle compilation
5. Capacitor Android sync
"""

import subprocess
import sys
from pathlib import Path

# Fix Windows console UTF-8 output if supported
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = Path(__file__).resolve().parent.parent.parent

def run_step(step_name: str, cmd: list[str]) -> bool:
    print("\n" + "=" * 50)
    print(f">> RUNNING: {step_name}")
    print(f"Command: {' '.join(cmd)}")
    print("=" * 50)
    result = subprocess.run(" ".join(cmd), cwd=ROOT_DIR, shell=True)
    if result.returncode != 0:
        print(f"[FAIL] {step_name} (exit code {result.returncode})")
        return False
    print(f"[PASS] {step_name}")
    return True

def main():
    steps = [
        ("Monolith Audit (< 150 lines)", [sys.executable, "scripts/dev/audit-monoliths.py"]),
        ("UI/UX & Mobile Alignment Audit", [sys.executable, "scripts/dev/audit-uiux.py"]),
        ("TypeScript Type-Check", ["npm", "run", "type-check"]),
        ("Unit Tests (Vitest)", ["npm", "test"]),
        ("Vite Production Build", ["npm", "run", "build-only"]),
        ("Capacitor Android Sync", ["npx", "cap", "sync", "android"]),
    ]

    for name, cmd in steps:
        success = run_step(name, cmd)
        if not success:
            sys.exit(1)

    print("\n" + "=" * 50)
    print("SUCCESS: Codebase is 100% modular, healthy & synced!")
    print("=" * 50)

if __name__ == "__main__":
    main()
