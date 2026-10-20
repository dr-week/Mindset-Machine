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

| Zuari Module | Integrated Role in MINDSET |
| :--- | :--- |
| **`@zuari/recipes`** | Imported directly into `src/styles/zuari/`. Powers `.nova-glyph-dock`, `.nova-glyph-tile`, `.nova-glyph-tooltip`, `.zuari-card`, and `.zuari-badge`. |
| **`@zuari/glyphs`** | Vector glyph library in `src/glyphs/` providing mathematical icons and morphing path definitions. |
| **`Aether-Glyph UI`** | Apex navigation dock transformed into an icon-first floating ribbon with hover anchor tooltips. |
| **`Zero-Monolith Rule`** | Monolithic `DashboardView.vue` (3,400 lines) refactored into modular sub-components under `src/components/dashboard/`, `timetable/`, `notes/`, and `vault/`. |
