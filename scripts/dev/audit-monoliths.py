"""Audit TypeScript and Vue components for large monolith modules in Mindset Machine."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "src"
EXCLUDED_PARTS = {"__tests__", "node_modules", "dist"}


def audit_frontend(threshold: int = 150) -> list[dict[str, object]]:
    reports = []
    if not SOURCE_DIR.exists():
        return reports

    for path in SOURCE_DIR.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".vue", ".js"}:
            continue
        rel_parts = set(path.relative_to(ROOT).parts)
        if EXCLUDED_PARTS.intersection(rel_parts):
            continue

        try:
            lines = path.read_text(encoding="utf-8").splitlines()
            line_count = len(lines)
            if line_count > threshold:
                reports.append({
                    "file": path.relative_to(ROOT).as_posix(),
                    "lines": line_count,
                    "type": "vue_component" if path.suffix == ".vue" else "ts_module",
                })
        except Exception as error:
            reports.append({"file": path.relative_to(ROOT).as_posix(), "error": str(error)})

    return sorted(reports, key=lambda item: (-int(item.get("lines", 0)), str(item["file"])))


if __name__ == "__main__":
    results = audit_frontend(threshold=150)
    print(f"--- Mindset Machine Monolith Audit (threshold > 150 lines) ---")
    if not results:
        print("PERFECT: Zero files exceed the 150-line limit!")
    for r in results:
        print(f"[{r.get('lines', 0)} lines] {r.get('file')} ({r.get('type')})")
