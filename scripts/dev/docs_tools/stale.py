"""Find research and task notes whose recorded review date needs refreshing."""

import argparse
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from scripts.dev.docs_tools.find import HISTORY_FILES, RESEARCH_DIRS, TASK_FILES

REVIEW_DATE = re.compile(
    r"(?i)\b(?:reviewed|review date|verified|last verified|snapshot date|audit date|updated)\b[^\n\r0-9]{0,30}(20\d{2}-\d{2}-\d{2})"
)


def _research_files() -> set[Path]:
    return {
        path
        for directory in RESEARCH_DIRS
        if directory.exists()
        for path in directory.rglob("*.md")
        if path.is_file()
    }


def stale_notes(days: int = 90, scope: str = "all", today: date | None = None) -> list[dict[str, object]]:
    if days < 1:
        raise ValueError("days must be positive")
    if scope not in {"research", "tasks", "history", "all"}:
        raise ValueError(f"unsupported scope: {scope}")

    current = today or date.today()
    files: set[Path] = set()
    if scope in {"research", "all"}:
        files.update(_research_files())
    if scope in {"tasks", "all"}:
        files.update(path for path in TASK_FILES if path.is_file())
    if scope in {"history", "all"}:
        files.update(path for path in HISTORY_FILES if path.is_file())

    results: list[dict[str, object]] = []
    for path in files:
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        match = REVIEW_DATE.search(content)
        recorded_date = date.fromisoformat(match.group(1)) if match else None
        age_days = (current - recorded_date).days if recorded_date else None
        if age_days is not None and age_days < days:
            continue
        results.append(
            {
                "path": path.relative_to(ROOT).as_posix(),
                "review_date": recorded_date.isoformat() if recorded_date else None,
                "age_days": age_days,
                "status": "STALE" if age_days is not None else "UNDATED",
            }
        )
    return sorted(results, key=lambda item: (item["age_days"] is None, -(item["age_days"] or 0), item["path"]))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scope", choices=("research", "tasks", "history", "all"), default="all")
    parser.add_argument("--days", type=int, default=90, help="Review-date age threshold (default: 90 days).")
    parser.add_argument("--include-undated", action="store_true", help="Also list notes without a recorded review date.")
    args = parser.parse_args(argv)
    if args.days < 1:
        parser.error("--days must be positive")

    results = stale_notes(args.days, args.scope)
    if not args.include_undated:
        results = [item for item in results if item["status"] != "UNDATED"]
    if not results:
        print(f"No {args.scope} notes have a recorded review date older than {args.days} days.")
        return 0
    for item in results:
        age = f"{item['age_days']} days" if item["age_days"] is not None else "no review date"
        print(f"[{item['status']}] {item['path']} - {age}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
