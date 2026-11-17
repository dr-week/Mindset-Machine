# MINDSET MACHINE — Modularization Automation Guide

## 1. Automated Monolith Auditing

We use automated tooling to ensure our strict architectural constraint: **no source file shall exceed 150 lines of code**.

### Running the Audit
```bash
python scripts/dev/audit-monoliths.py
```
This script scans all `.ts`, `.vue`, and `.js` files in `src/`, flags any file exceeding 150 lines, and exits with a non-zero code if any violations exist.

---

## 2. Extraction & Splitting Pattern

When breaking down large files:
1. **Identify Single Responsibility:** Distinguish UI presentation, user input handling, and business logic.
2. **Extract Presentation & Sub-Cards:** Move child markup, styling, and micro-interactions into a sub-component within the same feature directory.
3. **Extract Composables & Pure Utilities:** Move pure calculations, data transformations, and state accessors into pure TypeScript files.
4. **Preserve Parent Interface:** Keep the parent component as a clean coordinator that imports the extracted modules.
5. **Run Verification:**
   ```bash
   npm run type-check && npm test && npm run build-only
   ```
