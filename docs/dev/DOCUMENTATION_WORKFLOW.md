# MINDSET MACHINE — Documentation Workflow

## 1. Documentation Principles

All documentation in the `docs/` folder serves as the single source of truth for:
- Architecture and domain boundaries
- Native Android and external API integrations
- UI/UX design standards and uncluttered transitions
- File size governance (< 150 lines per file)

---

## 2. Directory Structure

```
docs/
├── MODULARIZATION_PLAN.md      # Strategic plan and line budget tracking
├── MODULARIZATION_AUTOMATION.md# Scripts and automation guides for splitting
├── RESEARCH_AND_PRODUCT_SPEC.md# Competitive analysis & feature specs
├── UI_UX_DESIGN_SYSTEM.md      # Navigation, transitions, Zuari tokens
├── ANDROID_AND_INTEGRATIONS.md # Android, Google Fit, Calendar APIs
└── dev/
    ├── CODEBASE_MAP.md          # File-by-file responsibility registry
    ├── START_HERE.md            # Onboarding & quick start commands
    └── DOCUMENTATION_WORKFLOW.md# Documentation maintenance guidelines
```

---

## 3. Maintenance Rule

Whenever a file in `src/` is created, relocated, or split into sub-modules:
1. Verify that both the parent and newly created children stay strictly below 150 lines.
2. Update `docs/dev/CODEBASE_MAP.md` with the new file paths and responsibilities.
3. Check off the refactored items in `docs/MODULARIZATION_PLAN.md`.
