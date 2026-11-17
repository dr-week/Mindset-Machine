"""Automated UI/UX & Responsive Alignment Auditor for Mindset Machine."""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = ROOT / "src"

def check_uiux_health():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    
    print("=== Mindset Machine UI/UX & Responsive Alignment Audit ===")
    
    vue_files = list(SRC_DIR.rglob("*.vue"))
    print(f"Discovered {len(vue_files)} Vue component files.")
    
    issues = []
    
    # 1. Monolith check (< 150 lines)
    for vf in vue_files:
        lines = vf.read_text(encoding="utf-8", errors="replace").splitlines()
        if len(lines) > 150:
            issues.append(f"[MONOLITH] {vf.relative_to(ROOT)} has {len(lines)} lines (> 150 limit)")

    # 2. Safe Area Inset verification on root shell and mobile headers
    app_shell = SRC_DIR / "layout" / "AppShell.vue"
    mobile_top = SRC_DIR / "navigation" / "MobileTopHeader.vue"
    nav_sheet = SRC_DIR / "navigation" / "NavOverflowSheet.vue"
    
    for critical_file in [app_shell, mobile_top, nav_sheet]:
        if critical_file.exists():
            content = critical_file.read_text(encoding="utf-8", errors="replace")
            if "safe-area-inset" not in content:
                issues.append(f"[SAFE-AREA] {critical_file.relative_to(ROOT)} missing safe-area-inset adaptation")
    
    # 3. View canvas & Bento responsive checks
    dashboard_view = SRC_DIR / "components" / "DashboardView.vue"
    if dashboard_view.exists():
        content = dashboard_view.read_text(encoding="utf-8", errors="replace")
        if "@media (max-width" not in content:
            issues.append(f"[RESPONSIVE] DashboardView.vue missing mobile media query override")

    # 4. Mobile touch hover audit
    # Check that interactive buttons with opacity: 0 on base state don't lack hover: none fallbacks
    for vf in vue_files:
        content = vf.read_text(encoding="utf-8", errors="replace")
        # Find selectors with opacity: 0 that are NOT transitions (enter/leave)
        # and verify they have @media (hover: none) fallbacks
        lines = content.splitlines()
        for idx, line in enumerate(lines):
            if "opacity: 0" in line and not any(k in line for k in ["enter", "leave", "0%"]):
                # check context
                prev_lines = " ".join(lines[max(0, idx-4):idx+1])
                if any(k in prev_lines for k in ["btn", "delete", "action", "remove", "trash"]):
                    if "@media (hover: none)" not in content:
                        issues.append(f"[TOUCH TARGET] {vf.relative_to(ROOT)} hides actions on hover without @media (hover: none)")
                        break

    if issues:
        print(f"FOUND {len(issues)} UI/UX ISSUES:")
        for iss in issues:
            print(f"  ❌ {iss}")
        return 1
    else:
        print("PERFECT: All UI/UX responsive, safe-area, and touch-target checks PASSED!")
        return 0

if __name__ == "__main__":
    raise SystemExit(check_uiux_health())
