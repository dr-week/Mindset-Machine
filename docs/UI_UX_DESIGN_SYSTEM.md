# Mindset Machine — UI/UX Design System & Adaptive Viewport Architecture

## 1. Design Language: Zuari-Aether

Three foundational tenets:

1. **Calm Executive Density** — Every pixel carries information; no decorative chrome. KPIs are dense but never cluttered.
2. **Departmental Transitions** — Switching departments uses a hardware-accelerated cross-fade (`opacity 0→1`, `translateY 4px`, 180ms). Zero layout shifts.
3. **Micro-Affordances** — Interactive elements communicate state through subtle luminance shifts and haptic echoes, not intrusive animations.

---

## 2. Adaptive Viewport Architecture: PC Horizontal vs. Android Vertical

Mindset Machine dynamically adapts its entire UI/UX to the user's viewport form-factor via `useBreakpoint.ts` and `AppShell.vue`:

### 2.1 Viewport Breakpoints

| Breakpoint | Window Width | Target Form Factor | Shell Architecture |
|:---|:---|:---|:---|
| **Compact** | $< 600\text{px}$ | Android Phones (Vertical) | `MobileShell` + `MobileBottomNav` + `NavOverflowSheet` |
| **Medium** | $600\text{px} - 899\text{px}$ | Tablets / Foldables | `TabletShell` + `NavRail` (72px left offset) |
| **Expanded** | $\ge 900\text{px}$ | PC / Desktop (Horizontal) | `DesktopShell` + `ApexHeaderDock` + 12-Col Bento Grid |

### 2.2 Android Native Vertical Experience
- **Single-Column Vertical Feed:** Cockpit cards and execution queues stack in a natural, friction-free vertical flow. Zero horizontal scrolling.
- **Bottom Navigation Dock:** Fixed bottom bar (`height: calc(56px + env(safe-area-inset-bottom, 0px))`) displaying 4 high-frequency tabs (Cockpit, Tasks, Habits, Timetable) plus a "More" trigger.
- **Gesture-Friendly Overflow Drawer:** Secondary departments (Horizons, Activity, Notes, Vault, Assistant) open in a smooth swipe-up bottom sheet with clear $48\times 48\text{px}$ touch targets.
- **Android Safe-Area Awareness:** Content bottom padding automatically expands (`paddingBottom: calc(56px + env(safe-area-inset-bottom, 0px))`) so interactive elements are never blocked by Android system navigation pills or gestures.
- **Capacitor Haptic Feedback:** Physical tactile clicks on task completions, flame priority toggles, and Hunter XP rank-ups.

### 2.3 PC / Desktop Horizontal Experience
- **12-Column Bento Grid:** High-density, multi-column dashboard where Cockpit vitals, Execution Queue, Hunter Directives, Velocity Arc, and Vision Directives reside in an expansive, balanced cockpit.
- **Sticky Apex Header Dock:** Floating glassmorphic top navigation dock with quick-access telemetry, recovery scores, and instant departmental switching.
- **Keyboard Accelerators:** Full zero-mouse navigation: `1`–`9` for instant tab switching, `Ctrl+K` / `Cmd+K` for Apex Command Palette, `Ctrl+Z` for undoing deletes, and `c`/`n` for instant task input focus.

---

## 3. Clutter-Free UI Transition Choreography

To eliminate visual fatigue and keep cognitive load near zero:

1. **Strict Departmental Isolation:** Only one active department is mounted in the viewport at any moment via `<Transition name="mm-fade" mode="out-in">`. No sidebars crammed with irrelevant backlogs.
2. **Transition Standard:**
   ```css
   .mm-fade-enter-active,
   .mm-fade-leave-active {
     transition: opacity 180ms ease, transform 180ms cubic-bezier(0.4, 0, 0.2, 1);
   }
   .mm-fade-enter-from,
   .mm-fade-leave-to {
     opacity: 0;
     transform: translateY(4px);
   }
   ```
3. **Zero Layout Shift:** Content loads behind the opacity veil without triggering document-level scroll jumps or resizing jitters.

---

## 4. Color Palette Tokens

| Token | Value | Semantic Role |
|:---|:---|:---|
| `--color-ember` | `#ff5722` | Primary CTA, Hunter XP rewards, high-priority flame |
| `--color-emerald` | `#10b981` | Habit completion, biometric recovery readiness, success |
| `--color-amber` | `#f59e0b` | Warnings, biological ultradian pulse alerts, medium priority |
| `--color-violet` | `#8b5cf6` | AI Assistant recommendations, Hunter rank crests |
| `--color-rose` | `#f43f5e` | Overdue deadlines, critical health alerts |
| `--color-bg-base` | `oklch(0.10 0.015 260)` | Root application background (near-black dark base) |
| `--color-bg-surface` | `oklch(0.14 0.015 260)` | Department cards and surface containers |
| `--color-bg-card` | `oklch(0.17 0.015 260)` | Nested card interiors, input strips, modal bodies |

---

## 5. Typography & Spacing Tokens

| Role | Font Family | Weights |
|:---|:---|:---|
| UI Labels, Body, Navigation | **Plus Jakarta Sans** | 400 (Regular), 500 (Medium), 600 (Semibold) |
| Numerical Telemetry, Timers, XP | **JetBrains Mono** | 400 (Regular), 500 (Medium) |

### Radius & Sizing
- Micro-tags & Pills: `radius-xs` ($6\text{px}$)
- Input strips & Small Cards: `radius-sm` ($10\text{px}$)
- Main Department Cards: `radius-md` ($14\text{px}$)
- Modals & Sheets: `radius-lg` ($20\text{px}$)
- Touch Target Minimum: $48\times 48\text{px}$ on all mobile surfaces.

---

## 6. Micro-Component Architecture (< 150 Lines)

Every departmental view is decomposed into 4 standard micro-component layers:

```
[ Department View Coordinator ] (< 120 lines)
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[ Header / Filter ]  [ Creator Input Strip ] (< 100 lines each)
    │                   │
    └─────────┬─────────┘
              ▼
     [ Item Card Row ] (< 120 lines each)
              ▼
   [ Reusable Atoms / Badges ] (< 60 lines each)
```

Every file must stay **strictly under 150 lines**, verified automatically by `scripts/dev/audit-monoliths.py`.
