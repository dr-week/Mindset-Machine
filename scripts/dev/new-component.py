#!/usr/bin/env python3
"""
new-component.py - Scaffold a new Vue 3 component in the correct department.
Usage: python scripts/dev/new-component.py <ComponentName> <department>
Example: python scripts/dev/new-component.py TaskItemCard tasks
"""

import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[2]
SRC_COMPONENTS = ROOT / "src" / "components"

TEMPLATE = '''\
<script setup lang="ts">
// Props and emits for {name}
// defineProps<{{ }}>()
// const emit = defineEmits<{{ }}>()
</script>

<template>
  <div class="{css_class}">
    <!-- {name} content -->
  </div>
</template>

<style lang="scss" scoped>
@use \'@/styles/variables\' as *;

.{css_class} {{
  // Styles for {name}
}}
</style>
'''

def to_css_class(name: str) -> str:
    """Convert PascalCase to kebab-case."""
    result = []
    for i, ch in enumerate(name):
        if ch.isupper() and i > 0:
            result.append('-')
        result.append(ch.lower())
    return ''.join(result)

def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/dev/new-component.py <ComponentName> <department>")
        print("Example: python scripts/dev/new-component.py TaskItemCard tasks")
        sys.exit(1)

    component_name = sys.argv[1]
    department = sys.argv[2]

    if not component_name[0].isupper():
        print(f"[ERROR] ComponentName must be PascalCase. Got: '{component_name}'")
        sys.exit(1)

    target_dir = SRC_COMPONENTS / department
    target_file = target_dir / f"{component_name}.vue"

    if target_file.exists():
        print(f"[SKIP] Already exists: {target_file.relative_to(ROOT)}")
        sys.exit(0)

    target_dir.mkdir(parents=True, exist_ok=True)
    css_class = to_css_class(component_name)
    content = TEMPLATE.format(name=component_name, css_class=css_class)

    target_file.write_text(content, encoding='utf-8')
    line_count = len(content.splitlines())

    print(f"[CREATED] src/components/{department}/{component_name}.vue ({line_count} lines)")
    if line_count > 150:
        print(f"[WARNING] File is {line_count} lines — consider splitting immediately!")
    else:
        print(f"[OK] Within 150-line limit.")

if __name__ == "__main__":
    main()
