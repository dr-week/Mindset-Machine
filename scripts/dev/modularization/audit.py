"""AST-based inventory of oversized SMKD Python modules and split boundaries."""

import ast
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SOURCE_ROOTS = (
    ROOT / "stock-signal-bot" / "backend" / "app",
    ROOT / "scripts" / "dev",
)
EXCLUDED_PARTS = {"tests", "__pycache__", "third_party", ".venv", "node_modules"}


def _declarations(tree: ast.Module) -> list[dict[str, int | str]]:
    declarations = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            declarations.append({
                "name": node.name,
                "kind": "class" if isinstance(node, ast.ClassDef) else "function",
                "start": node.lineno,
                "end": getattr(node, "end_lineno", node.lineno),
            })
    return declarations


def audit_modules(threshold: int = 220, only: str | None = None) -> list[dict[str, object]]:
    selected = (ROOT / only).resolve() if only else None
    if selected is not None and not selected.is_relative_to(ROOT):
        raise ValueError("Selected module must be inside the repository root.")
    paths = [selected] if selected else [
        path
        for source_root in SOURCE_ROOTS
        if source_root.exists()
        for path in source_root.rglob("*.py")
        if not EXCLUDED_PARTS.intersection(path.relative_to(ROOT).parts)
    ]
    reports = []
    for path in paths:
        if not path.is_file() or path.suffix != ".py":
            continue
        try:
            source = path.read_text(encoding="utf-8")
            tree = ast.parse(source, filename=str(path))
        except (OSError, UnicodeError, SyntaxError) as error:
            reports.append({"file": path.relative_to(ROOT).as_posix(), "error": str(error)})
            continue
        line_count = len(source.splitlines())
        if only or line_count >= threshold:
            reports.append({
                "file": path.relative_to(ROOT).as_posix(),
                "lines": line_count,
                "declarations": _declarations(tree),
            })
    return sorted(reports, key=lambda item: (-int(item.get("lines", 0)), str(item["file"])))


def format_report(reports: list[dict[str, object]], threshold: int) -> str:
    lines = [
        f"# Python module split audit (threshold: {threshold} lines)",
        "",
        "AST outline for SMKD-owned backend and development-tool modules. Test, build, and `fast-framework` trees are excluded.",
        "",
        "Line count flags review candidates; it does not prove a module should be split.",
        "",
    ]
    if not reports:
        lines.append("No source modules meet the threshold.")
        return "\n".join(lines) + "\n"
    for report in reports:
        lines.extend([f"## `{report['file']}` — {report.get('lines', 0)} lines", ""])
        declarations = report.get("declarations", [])
        if declarations:
            lines.extend(
                f"- `{item['kind']} {item['name']}`: lines {item['start']}-{item['end']}"
                for item in declarations
            )
        else:
            lines.append("- No top-level classes or functions; inspect module constants and orchestration.")
        lines.append("")
    return "\n".join(lines)


def format_json(reports: list[dict[str, object]]) -> str:
    return json.dumps(reports, indent=2)
