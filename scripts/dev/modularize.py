"""Find Python split candidates and apply explicitly marked module splits."""

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.dev.modularization.audit import audit_modules, format_json, format_report
from scripts.dev.modularization.split import apply_split, prepare_split


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    audit = commands.add_parser("audit", help="List large SMKD Python modules and their top-level boundaries.")
    audit.add_argument("--threshold", type=int, default=220)
    audit.add_argument("--file", help="Inspect one repository-relative Python module.")
    audit.add_argument("--json", action="store_true", help="Print machine-readable AST inventory.")
    split = commands.add_parser("split", help="Preview marked split regions; writes only with --apply.")
    split.add_argument("--source", required=True, help="Repository-relative source file with split markers.")
    split.add_argument("--apply", action="store_true", help="Create sibling modules and replace marker blocks with imports.")
    args = parser.parse_args(argv)

    if args.command == "audit":
        if args.threshold < 1:
            parser.error("--threshold must be positive")
        if args.file and not (ROOT / args.file).resolve().is_file():
            parser.error("--file must name an existing repository-relative Python module")
        reports = audit_modules(args.threshold, args.file)
        print(format_json(reports) if args.json else format_report(reports, args.threshold))
        return 1 if any("error" in item for item in reports) else 0

    source = (ROOT / args.source).resolve()
    if not source.is_relative_to(ROOT) or not source.is_file() or source.suffix != ".py":
        parser.error("--source must name an existing Python file inside this SMKD repository")
    if not (source.parent / "__init__.py").is_file():
        parser.error("--source must be inside a Python package so the generated relative import is valid")
    try:
        rewritten, generated = prepare_split(source)
        if args.apply:
            created = apply_split(source)
            print(f"Split applied. Created: {', '.join(path.name for path in created)}")
        else:
            print(f"Dry run: {source.relative_to(ROOT).as_posix()} remains unchanged.")
            for path, content in generated.items():
                print(f"  Would create {path.relative_to(ROOT).as_posix()} ({len(content.splitlines())} lines)")
            print(f"  Source replacement: {len(rewritten.splitlines())} lines")
            print("  Re-run with --apply after confirming each block is self-contained.")
    except (OSError, SyntaxError, ValueError, FileExistsError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
