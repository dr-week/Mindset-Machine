#!/usr/bin/env python3
"""
git-snapshot.py - Automated git snapshot with pre-commit monolith audit.
Runs the 150-line audit before committing. Aborts if any file violates the limit.
Usage: python scripts/dev/git-snapshot.py "feat: add notification service"
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[2]

def run(cmd: list[str], capture: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        cwd=ROOT,
        shell=True,
        capture_output=capture,
        text=True,
    )

def audit_monoliths() -> bool:
    """Returns True if audit passes (zero violations)."""
    SOURCE_DIR = ROOT / "src"
    EXCLUDED = {"__tests__", "node_modules", "dist"}
    THRESHOLD = 150
    violations = []
    for path in SOURCE_DIR.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".vue", ".js"}:
            continue
        if EXCLUDED.intersection(set(path.relative_to(ROOT).parts)):
            continue
        try:
            count = len(path.read_text(encoding="utf-8").splitlines())
            if count > THRESHOLD:
                violations.append((path.relative_to(ROOT).as_posix(), count))
        except Exception:
            pass
    if violations:
        print(f"\n[ABORT] Monolith audit FAILED — {len(violations)} file(s) exceed {THRESHOLD} lines:")
        for file, count in sorted(violations, key=lambda x: -x[1]):
            print(f"  [{count} lines] {file}")
        print("\nFix violations before committing. Run: python scripts/dev/audit-monoliths.py")
        return False
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/dev/git-snapshot.py \"<commit message>\"")
        sys.exit(1)

    message = sys.argv[1]
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    full_message = f"{message} [snapshot {timestamp}]"

    print(f"[GIT] Pre-commit audit starting...")
    if not audit_monoliths():
        sys.exit(1)

    print(f"[GIT] Audit passed. Staging all changes...")
    result = run(["git", "add", "-A"])
    if result.returncode != 0:
        print(f"[ERROR] git add failed.")
        sys.exit(1)

    print(f"[GIT] Committing: {full_message}")
    result = run(["git", "commit", "-m", full_message])
    if result.returncode != 0:
        print(f"[ERROR] git commit failed (nothing to commit, or git error).")
        sys.exit(1)

    print(f"\n[GIT] Snapshot committed successfully.")
    print(f"[GIT] Message: {full_message}")

if __name__ == "__main__":
    main()
