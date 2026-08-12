# DESIGN SYSTEM SPECIFICATION — AETHER DESIGN SYSTEM

Inspired by the cinematic, dark, editorial aesthetic of world-class digital products (such as Origin), the **AETHER Design System** defines a sophisticated, high-contrast dark visual language tailored for luxury property management.

---

## 1. Color System

The palette pairs an obsidian neutral baseline with subtle atmospheric radial glows and restrained, purposeful accent tones.

### Core Neutral Palette
- **Obsidian Dark (`--color-bg-base`)**: `#07080B` — Deepest canvas tone.
- **Surface Elevation 1 (`--color-surface-1`)**: `#0D0E15` — Card & table containers.
- **Surface Elevation 2 (`--color-surface-2`)**: `rgba(18, 20, 31, 0.75)` — Glassmorphism panels with `backdrop-filter: blur(20px)`.
- **Surface Hover (`--color-surface-hover`)**: `rgba(28, 31, 48, 0.85)` — Active hover states.

### Border & Translucency Tokens
- **Glass Border (`--border-glass`)**: `rgba(255, 255, 255, 0.08)` — Subtle 1px structural line.
- **Active Focus Ring (`--border-focus`)**: `rgba(245, 158, 11, 0.4)` — Amber focus halo.

### Restrained Accent Tokens
- **Metallic Gold (`--accent-gold`)**: `#F59E0B` — Primary luxury accent for headers, key metrics, and primary CTAs.
- **Emerald Pulse (`--accent-emerald`)**: `#10B981` — Occupied status & positive revenue velocity.
- **Sky Cyan (`--accent-cyan`)**: `#38BDF8` — Vacant unit availability & system telemetry.
- **Muted Rose (`--accent-rose`)**: `#F43F5E` — Maintenance alerts & overdue payment warnings.
- **Amethyst Copilot (`--accent-amethyst`)**: `#A855F7` — AI Assistant highlights.

---

## 2. Typography System

A high-contrast typographic pairing of an **Editorial Display Serif** (*Cinzel*) for brand marks and cinematic headers, with a **Modern Sans-Serif** (*Plus Jakarta Sans*) for high-density product UI, and a **Monospace** engine for numerical data.

```
Display Header   : Cinzel, Serif (32px / Line Height 1.2 / Tracking +0.05em)
Section Title    : Plus Jakarta Sans (20px / Line Height 1.3 / Font Weight 700)
Card Header      : Plus Jakarta Sans (16px / Line Height 1.4 / Font Weight 600)
Body Regular     : Plus Jakarta Sans (14px / Line Height 1.5 / Font Weight 400)
Caption / Tag    : Plus Jakarta Sans (11px / Tracking +0.1em / UPPERCASE)
Data Numeric     : JetBrains Mono / ui-monospace (13px / Font Weight 600)
```

---

## 3. Spacing & Spatial Grid Architecture

Built on a strict **8pt spatial system**:
- **Micro Spacing**: `4px` (`gap-1`), `8px` (`gap-2`)
- **Component Padding**: `16px` (`p-4`), `24px` (`p-6`)
- **Container Whitespace**: `32px` (`p-8`), `48px` (`p-12`)

**Whitespace Rule**: Layouts prioritize generous inner padding to prevent data density from feeling cluttered. Dense tables are separated from metric cards with clear 32px vertical breaks.

---

## 4. Surfaces, Borders, Shadows & Atmospheric Glow

- **Glassmorphism Spec**:
  ```css
  background: rgba(14, 17, 26, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```
- **Atmospheric Radial Glow**:
  Large blurred radial gradient Orbs positioned in fixed background layers (`width: 600px; height: 600px; filter: blur(140px); opacity: 0.15;`) to create visual depth without distracting from text.
- **Card Elevation Hover**:
  ```css
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(245, 158, 11, 0.15);
  transform: translateY(-2px);
  ```

---

## 5. Component Primitives Specifications

### Buttons
- **Primary Gold CTA**: Solid `#F59E0B` fill, black text (`#000`), bold font weight, `rounded-xl`, subtle golden shadow.
- **Secondary Glass Button**: `bg-white/5` fill, 1px `border-white/10`, white text, hover `bg-white/10`.
- **Text Link Button**: Gold or cyan text with `hover:underline` and inline arrow transition.

### Inputs & Form Fields
- **Search & Text Input**: Background `rgba(255, 255, 255, 0.04)`, border `1px solid rgba(255, 255, 255, 0.1)`, rounded `12px`, focus halo `border-amber-500/50`.

### Tables
- **Header**: Background `rgba(0, 0, 0, 0.4)`, text `uppercase 11px font-mono text-slate-400`.
- **Rows**: 1px bottom border `rgba(255, 255, 255, 0.05)`, hover highlight `rgba(255, 255, 255, 0.03)`, numeric values right-aligned using monospace font.

### Cards & Modals
- **Cards**: `rounded-2xl`, glass surface, optional 1px top color accent indicator corresponding to status.
- **Modals & Drawers**: Backdrop `rgba(0,0,0,0.85)` with `backdrop-filter: blur(24px)`. Slide-in right for drawers, fade-scale for modals.

---

## 6. Data Visualization Style

- **Charts**: Custom SVG area charts with smooth cubic bezier curves (`M ... Q ... T`).
- **Gradients**: Fill under curve uses 40% to 0% opacity gradient stops (`stopColor="#F59E0B"`).
- **Grid Lines**: Subtle horizontal dashed lines (`stroke="rgba(255,255,255,0.05)"`, `strokeDasharray="4 4"`).
- **Hover Dots**: White circle with outer accent ring, triggering a glassmorphic floating tooltip.

---

## 7. Motion Principles

- **Bezier Ease Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
- **Timing**:
  - Hover / Active press: `150ms`
  - Tab transition & Drawer slide: `300ms`
  - Full Page / Modal overlay: `400ms`

---

## 8. Responsive Behavior

- **Desktop (1440px+)**: Dual-column / 4-column card grids, fixed 260px sidebar navigation, inline slide-over drawer panels.
- **Tablet (768px - 1023px)**: 2-column grids, collapsible icon sidebar, full-screen overlay drawers.
- **Mobile (< 768px)**: Single column stacked layout, bottom fixed navigation bar, full-viewport modal sheets.

---

## 9. State States (Empty, Loading, Error)

- **Loading State**: Glass skeleton shimmer cards with subtle pulsing gradient opacity (`animate-pulse bg-white/5`).
- **Empty State**: Centered editorial illustration/icon with muted text, clear explanation, and primary `+ Add` button.
- **Error State**: Non-intrusive top banner with dark rose background (`bg-rose-500/10 border-rose-500/30 text-rose-300`).

---

## 10. Accessibility Rules (WCAG AAA Compliance)

- **Text Contrast**: Text on dark backgrounds maintains a minimum contrast ratio of 7:1 for body text (`#F3F4F6` on `#07080B`).
- **Focus Indicators**: All interactive elements display a high-contrast focus ring (`ring-2 ring-amber-500/60`).
- **ARIA & Keyboard Navigation**: Full support for `Tab`, `Escape` (to close modals), and `Enter/Space` (to activate buttons).
