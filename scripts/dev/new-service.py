#!/usr/bin/env python3
"""
new-service.py - Scaffold a new TypeScript service in the correct department.
Usage: python scripts/dev/new-service.py <ServiceName> <department>
Example: python scripts/dev/new-service.py notificationService assistant
"""

import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[2]
SRC_SERVICES = ROOT / "src" / "services"

CLASS_TEMPLATE = '''\
/**
 * {ClassName} - {department} service module.
 * Responsible for: [describe responsibility here]
 */

export class {ClassName} {{
  private static instance: {ClassName}

  public static getInstance(): {ClassName} {{
    if (!{ClassName}.instance) {{
      {ClassName}.instance = new {ClassName}()
    }}
    return {ClassName}.instance
  }}

  // Add service methods here
}}

export const {instance_name} = {ClassName}.getInstance()
'''

FUNCTION_TEMPLATE = '''\
/**
 * {name}.ts - {department} service module.
 * Responsible for: [describe responsibility here]
 */

export function {fn_name}(): void {{
  // Implement function here
  throw new Error('Not implemented: {fn_name}')
}}
'''

def pascal_to_camel(name: str) -> str:
    return name[0].lower() + name[1:] if name else name

def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/dev/new-service.py <ServiceName> <department>")
        print("Example: python scripts/dev/new-service.py notificationService assistant")
        sys.exit(1)

    service_name = sys.argv[1]
    department = sys.argv[2]

    is_class = service_name[0].isupper()

    target_dir = SRC_SERVICES / department
    file_name = service_name if not service_name.endswith('.ts') else service_name[:-3]
    target_file = target_dir / f"{file_name}.ts"

    if target_file.exists():
        print(f"[SKIP] Already exists: {target_file.relative_to(ROOT)}")
        sys.exit(0)

    target_dir.mkdir(parents=True, exist_ok=True)

    if is_class:
        content = CLASS_TEMPLATE.format(
            ClassName=service_name,
            department=department,
            instance_name=pascal_to_camel(service_name),
        )
    else:
        content = FUNCTION_TEMPLATE.format(
            name=service_name,
            department=department,
            fn_name=service_name,
        )

    target_file.write_text(content, encoding='utf-8')
    line_count = len(content.splitlines())

    print(f"[CREATED] src/services/{department}/{file_name}.ts ({line_count} lines)")
    if line_count > 150:
        print(f"[WARNING] File is {line_count} lines — split required!")
    else:
        print(f"[OK] Within 150-line limit.")

if __name__ == "__main__":
    main()
