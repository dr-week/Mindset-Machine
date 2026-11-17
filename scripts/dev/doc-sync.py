#!/usr/bin/env python3
"""
doc-sync.py - Auto-generate docs/dev/CODEBASE_MAP_AUTO.md from src/.
Scans all .ts and .vue files and generates a grouped markdown table.
Usage: python scripts/dev/doc-sync.py
"""

import sys
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "src"
OUTPUT_FILE = ROOT / "docs" / "dev" / "CODEBASE_MAP_AUTO.md"
EXCLUDED = {"__tests__", "node_modules", "dist"}
THRESHOLD = 150

def get_department(path: Path) -> str:
    rel = path.relative_to(SOURCE_DIR)
    parts = rel.parts
    if len(parts) > 1:
        return "/".join(parts[:-1])
    return "root"

def scan_files() -> dict[str, list[dict]]:
    departments: dict[str, list[dict]] = {}
    for path in sorted(SOURCE_DIR.rglob("*")):
        if not path.is_file() or path.suffix not in {".ts", ".vue", ".js"}:
            continue
        rel_parts = set(path.relative_to(ROOT).parts)
        if EXCLUDED.intersection(rel_parts):
            continue
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
            count = len(lines)
            dept = get_department(path)
            status = "SPLIT_NEEDED" if count > THRESHOLD else "OK"
            departments.setdefault(dept, []).append({
                "file": path.relative_to(SOURCE_DIR).as_posix(),
                "lines": count,
                "status": status,
            })
        except Exception:
            pass
    return departments

def build_markdown(departments: dict[str, list[dict]]) -> str:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "# Codebase Map (Auto-Generated)",
        f"> Generated: {ts} by `scripts/dev/doc-sync.py`",
        "",
        "> [!NOTE] This file is auto-generated. Do not edit manually.",
        "",
    ]
    total_ok = 0
    total_bad = 0
    for dept in sorted(departments.keys()):
        files = departments[dept]
        lines.append(f"## `src/{dept}/`")
        lines.append("")
        lines.append("| File | Lines | Status |")
        lines.append("|:-----|------:|:-------|")
        for f in sorted(files, key=lambda x: -x["lines"]):
            icon = "✅" if f["status"] == "OK" else "❌"
            lines.append(f"| `{f['file']}` | {f['lines']} | {icon} {f['status']} |")
            if f["status"] == "OK": total_ok += 1
            else: total_bad += 1
        lines.append("")
    lines.append("---")
    lines.append(f"**Summary:** {total_ok} files OK, {total_bad} files need splitting.")
    return "\n".join(lines)

def main():
    departments = scan_files()
    markdown = build_markdown(departments)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(markdown, encoding="utf-8")
    total = sum(len(v) for v in departments.values())
    print(f"[GENERATED] docs/dev/CODEBASE_MAP_AUTO.md ({total} files scanned)")

if __name__ == "__main__":
    main()
