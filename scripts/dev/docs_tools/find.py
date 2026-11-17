"""Search existing Markdown documentation before repeating research."""

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DOCS = (ROOT / "docs", ROOT / "stock-signal-bot" / "docs")
RESEARCH_DIRS = (ROOT / "docs" / "research", ROOT / "stock-signal-bot" / "docs" / "research")
TASK_FILES = (
    ROOT / "docs" / "PRODUCT_TECHNICAL_ROADMAP.md",
    ROOT / "docs" / "MODULARIZATION_PLAN.md",
    ROOT / "docs" / "research" / "historical-intraday-ml" / "PHASES.md",
    ROOT / "docs" / "TASK_BACKLOG_REVIEW_2026-11-05.md",
)
HISTORY_FILES = (ROOT / "NEXT_STEPS_QUESTIONS.txt", ROOT / "NEXT_STEPS_ANSWERS.txt")
TOKEN = re.compile(r"[a-z0-9][a-z0-9._/-]*", re.IGNORECASE)


def _search_files(scope: str) -> list[Path]:
    if scope not in {"docs", "research", "tasks", "history", "all"}:
        raise ValueError(f"Unsupported search scope: {scope}")
    roots = DOCS if scope in {"docs", "all"} else ()
    research = RESEARCH_DIRS if scope == "research" else ()
    files: set[Path] = set()
    for folder in (*roots, *research):
        if folder.exists():
            files.update(path for path in folder.rglob("*.md") if path.is_file())
    if scope in {"tasks", "all"}:
        files.update(path for path in TASK_FILES if path.is_file())
    if scope in {"history", "all"}:
        files.update(path for path in HISTORY_FILES if path.is_file())
    return sorted(files)


def find_matches(
    query: str, limit: int = 12, scope: str = "docs"
) -> list[tuple[int, str, int, str]]:
    terms = {term.casefold() for term in TOKEN.findall(query)}
    if not terms:
        raise ValueError("Query must include at least one searchable word.")
    results = []
    for path in _search_files(scope):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeError):
            continue
        matches = [
            (number, line.strip())
            for number, line in enumerate(lines, start=1)
            if terms.intersection(term.casefold() for term in TOKEN.findall(line))
        ]
        if matches:
            score, line_number, excerpt = max(
                (
                    len(terms.intersection(term.casefold() for term in TOKEN.findall(line))),
                    number,
                    line,
                )
                for number, line in matches
            )
            relative = path.relative_to(ROOT).as_posix()
            results.append((score, relative, line_number, excerpt))
    return sorted(results, key=lambda row: (-row[0], row[1]))[:limit]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--query", required=True, help="Terms describing the topic or decision.")
    parser.add_argument("--limit", type=int, default=12)
    parser.add_argument(
        "--scope",
        choices=("docs", "research", "tasks", "history", "all"),
        default="docs",
        help="Search docs, research, active tasks, archived task notes, or all sources.",
    )
    args = parser.parse_args(argv)
    if args.limit < 1:
        parser.error("--limit must be positive.")
    results = find_matches(args.query, args.limit, args.scope)
    if not results:
        print("No matching files found. Check docs/INDEX.md before starting new research.")
        return 1
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    for score, path, line, excerpt in results:
        print(f"{path}:{line} (score {score})")
        print(f"  {excerpt[:220]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
