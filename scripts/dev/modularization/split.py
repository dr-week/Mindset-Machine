"""Apply explicit, self-contained Python split regions after a dry-run review."""

import ast
import os
import re
import tempfile
from pathlib import Path

BEGIN = re.compile(r"^\s*#\s*SMKD-SPLIT-BEGIN:\s*([A-Za-z_][A-Za-z0-9_]*)\s+exports=([A-Za-z0-9_, ]+)\s*$")
END = re.compile(r"^\s*#\s*SMKD-SPLIT-END\s*$")
IDENTIFIER = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def prepare_split(source_path: Path) -> tuple[str, dict[Path, str]]:
    raw_source = source_path.read_bytes().decode("utf-8")
    newline = "\r\n" if "\r\n" in raw_source else "\n"
    source = raw_source
    lines = source.splitlines(keepends=True)
    rewritten: list[str] = []
    generated: dict[Path, str] = {}
    index = 0
    while index < len(lines):
        start = BEGIN.match(lines[index].rstrip("\r\n"))
        if not start:
            if END.match(lines[index].rstrip("\r\n")):
                raise ValueError(f"Unmatched split end marker at line {index + 1}.")
            rewritten.append(lines[index])
            index += 1
            continue

        module_name = start.group(1)
        exports = [name.strip() for name in start.group(2).split(",") if name.strip()]
        if (
            not exports
            or len(set(exports)) != len(exports)
            or any(not IDENTIFIER.fullmatch(name) for name in exports)
        ):
            raise ValueError(f"Invalid exports list for module {module_name!r}.")
        target = source_path.with_name(f"{module_name}.py")
        if target in generated:
            raise ValueError(f"Duplicate split module name: {module_name}.")
        index += 1
        block: list[str] = []
        while index < len(lines) and not END.match(lines[index].rstrip("\r\n")):
            if BEGIN.match(lines[index].rstrip("\r\n")):
                raise ValueError(f"Nested split marker inside module {module_name!r}.")
            block.append(lines[index])
            index += 1
        if index >= len(lines):
            raise ValueError(f"Missing split end marker for module {module_name!r}.")
        index += 1

        module_source = "".join(block).rstrip("\r\n") + newline
        tree = ast.parse(module_source, filename=str(target))
        available = {
            node.name
            for node in tree.body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
        }
        if not set(exports).issubset(available):
            missing = ", ".join(sorted(set(exports) - available))
            raise ValueError(f"Exports not defined at top level in {module_name}.py: {missing}")
        generated[target] = module_source
        rewritten.append(f"from .{module_name} import {', '.join(exports)}{newline}")

    if not generated:
        raise ValueError("No SMKD split markers found; source was not changed.")
    rewritten_source = "".join(rewritten)
    ast.parse(rewritten_source, filename=str(source_path))
    return rewritten_source, generated


def apply_split(source_path: Path) -> list[Path]:
    rewritten_source, generated = prepare_split(source_path)
    collisions = [path for path in generated if path.exists()]
    if collisions:
        raise FileExistsError("Refusing to overwrite: " + ", ".join(map(str, collisions)))

    temp_files: dict[Path, Path] = {}
    original_source = source_path.read_bytes()
    try:
        for target, content in generated.items():
            with tempfile.NamedTemporaryFile(
                "w", encoding="utf-8", newline="", dir=target.parent, delete=False
            ) as handle:
                handle.write(content)
                temp_files[target] = Path(handle.name)
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", newline="", dir=source_path.parent, delete=False
        ) as handle:
            handle.write(rewritten_source)
            source_temp = Path(handle.name)
        for target, temp_path in temp_files.items():
            os.replace(temp_path, target)
        os.replace(source_temp, source_path)
        return list(generated)
    except Exception:
        for temp_path in temp_files.values():
            temp_path.unlink(missing_ok=True)
        if "source_temp" in locals():
            source_temp.unlink(missing_ok=True)
        for target in generated:
            if target.exists() and not temp_files.get(target, Path()).exists():
                target.unlink(missing_ok=True)
        if source_path.read_bytes() != original_source:
            source_path.write_bytes(original_source)
        raise
