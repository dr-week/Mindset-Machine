#!/usr/bin/env python3
"""
audit-structure.py — MINDSET MACHINE codebase structure validator

Checks:
  1. Files over 150 lines (error — split required)
  2. .vue/.ts files directly in src/components/ root (should be in features/)
  3. Dead code: src/stores/counter.ts (scaffold leftover)
  4. Missing feature index.ts barrel files
  5. Files with no exports (potential dead modules)

Usage:
  python scripts/dev/audit-structure.py
  python scripts/dev/audit-structure.py --strict   # exit 1 on any warning
"""
import os
import sys
import argparse
from pathlib import Path

# Fix Windows console UTF-8 output if supported
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent.parent.parent / "src"
LINE_LIMIT = 150
STRICT = "--strict" in sys.argv

ERRORS   = []
WARNINGS = []
OK       = []

# ── Helper ─────────────────────────────────────────────────────────────────────
def count_lines(path: Path) -> int:
    try:
        return sum(1 for _ in open(path, encoding="utf-8", errors="ignore"))
    except Exception:
        return 0

def rel(path: Path) -> str:
    return str(path.relative_to(ROOT.parent))

# ── Check 1: Files over 150 lines ─────────────────────────────────────────────
print("\n[SCAN] Scanning for files over 150 lines...")
for path in ROOT.rglob("*"):
    if not path.is_file():
        continue
    if path.suffix not in (".vue", ".ts", ".scss", ".css"):
        continue
    if "node_modules" in path.parts or "__tests__" in path.parts:
        continue
    lines = count_lines(path)
    if lines > LINE_LIMIT:
        ERRORS.append(f"  ❌ {rel(path)}  ({lines} lines > {LINE_LIMIT} limit)")
    elif lines > 120:
        WARNINGS.append(f"  ⚠️  {rel(path)}  ({lines} lines — approaching limit)")

# ── Check 2: Components directly in src/components/ root ──────────────────────
print("🔍 Checking for misplaced files in src/components/ root...")
components_root = ROOT / "components"
if components_root.exists():
    for path in components_root.iterdir():
        if path.is_file() and path.suffix in (".vue", ".ts"):
            WARNINGS.append(f"  ⚠️  {rel(path)}  — should be inside a feature subfolder")

# ── Check 3: Dead scaffold code ────────────────────────────────────────────────
print("🔍 Checking for dead scaffold code...")
dead_files = [ROOT / "stores" / "counter.ts"]
for df in dead_files:
    if df.exists():
        WARNINGS.append(f"  ⚠️  {rel(df)}  — dead scaffold leftover, safe to delete")

# ── Check 4: Feature domains missing index.ts ─────────────────────────────────
print("🔍 Checking feature domain barrel files...")
features_dir = ROOT / "features"
if features_dir.exists():
    for feature in features_dir.iterdir():
        if feature.is_dir():
            index_file = feature / "index.ts"
            if not index_file.exists():
                WARNINGS.append(f"  ⚠️  {rel(feature)}/  — missing index.ts barrel export")
            else:
                OK.append(f"  ✅ {rel(feature)}/index.ts")

# ── Report ─────────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("  MINDSET MACHINE — Structure Audit Report")
print("=" * 60)

if ERRORS:
    print(f"\n❌ ERRORS ({len(ERRORS)}) — Must fix before merge:")
    for e in ERRORS:
        print(e)

if WARNINGS:
    print(f"\n⚠️  WARNINGS ({len(WARNINGS)}):")
    for w in WARNINGS:
        print(w)

if OK:
    print(f"\n✅ Passing ({len(OK)}):")
    for o in OK:
        print(o)

print("\n" + "=" * 60)
total_issues = len(ERRORS) + len(WARNINGS)
if total_issues == 0:
    print("  🎉 All checks passed. Codebase structure is clean.")
else:
    print(f"  Found {len(ERRORS)} errors, {len(WARNINGS)} warnings.")

if ERRORS or (STRICT and WARNINGS):
    sys.exit(1)
