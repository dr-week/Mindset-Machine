# Zuari Framework & Aether-Glyph Architecture Review

> **Subject**: Architectural Review of **Zuari** (`fast-framework` / `dr-week/fast-framework`) and its integration into **MINDSET**.

---

## 1. Executive Summary

**Zuari** (formerly *Fast/Nova Framework*) is a Goan-inspired platform-first UI architecture operating under the tagline:
> *"The Goan tidal-fast UI framework. Zero Virtual DOM. Under 2.5KB."*

By shifting computation away from runtime JavaScript loops into browser-native platform primitives (TC39 Signals, CSS `@scope`, OKLCH tokens, and CSS Anchor Positioning), Zuari achieves ultra-lean, instant-response interfaces.

---

## 2. Framework Strengths & Benchmarks

1. **Aether-Glyph Design Language**:
   - Replaces verbose textual clutter with **icon-first affordance**.
   - Text is not eliminated but deferred to native **CSS Anchor-Positioned micro-tooltips** (`bottom: anchor(top); left: anchor(center);`).
   - Results in quiet, distraction-free dashboards suitable for deep monk-mode work.

2. **Zero-Runtime Style Recipes (`@zuari/recipes`)**:
   - Pure CSS using `@scope (.zuari-card)` and `@scope (.nova-glyph-dock)` avoids CSS-in-JS compilation tax.
   - Perceptually uniform `oklch()` color tokens provide contrast ratios without clipping.

3. **Fine-Grained Micro-Signals (`@zuari/signals`)**:
   - Direct DOM node pointers without tree reconciliation diffs.
   - At $\sim 1.1\text{ KB}$ runtime, state updates flow directly into specific targets.

---

## 3. MINDSET Adoption & Integration

| Zuari Module (`dr-week/fast-framework`) | Integrated Role in MINDSET |
| :--- | :--- |
| **`@zuari/presets/division` (5-Plane Matrix)** | Ported into `src/design-system/planes/featureDivision.ts`. Divides all features into **Surface**, **Dock**, **Drawer** (`GoogleCloudDrawer.vue`), **Command** (`CommandPalette.vue`), and **Ambient** planes. |
| **`Contrasting Boxiness`** | Stepped OKLCH lightness stops (`--nova-color-background`, `--nova-color-surface`, `--nova-color-surface-elevated`) and crisp `1px` borders in `src/design-system/tokens/design-tokens.css`. |
| **`@zuari/ai` Workflow Pattern** | Powers `src/services/ai/geminiClient.ts` (`gemini-2.5-flash`) for hierarchical **Goal $\rightarrow$ Task $\rightarrow$ Micro-Tasks & Steps** decomposition. |
| **`@zuari/sync` Minimal Delta Compaction** | Powers `src/services/google/minimalTaskDbSerializer.ts` and `googleDriveSyncService.ts` (`>65%` payload reduction stored in Google Drive `appDataFolder`). |
| **`@zuari/recipes` & `@zuari/glyphs`** | Imported in `src/styles/zuari/` and `src/glyphs/` for icon-first affordance and scoped cards. |
| **`Zero-Monolith Rule (< 150 lines)`** | All 72+ Vue components and TypeScript modules strictly audited via `scripts/dev/audit-monoliths.py`. |

---

## 4. Similar GitHub Projects Leveraged to Accelerate Engineering

1. **[`dr-week/fast-framework`](https://github.com/dr-week/fast-framework)** — 5-Plane UI/UX Feature Division Matrix, Contrasting Boxiness tokens, `@zuari/ai` workflow controller, `@zuari/sync` compact storage patterns, and `scripts/dev/research-reuse.mjs`.
2. **[`Ywtoo/ToDoFeito`](https://github.com/Ywtoo/ToDoFeito)** — Deterministic offline-first task synchronization pattern for Google Drive `appDataFolder`.
3. **[`imxade/kitsy`](https://github.com/imxade/kitsy)** — Local-first client-side task storage with optional Google Drive sync when online.
4. **[`publius-github/hypomnema`](https://github.com/publius-github/hypomnema)** — Zero-server sovereign task/notes synchronization via personal Google Drive.

