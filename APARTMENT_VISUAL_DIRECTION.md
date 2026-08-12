# APARTMENT MANAGEMENT SYSTEM — REVISED VISUAL DIRECTION SPECIFICATION

Inspired by the visual analysis of **Origin** (`useorigin.com`), this document defines the new visual direction for **AETHER** (Apartment Management System). 

It abandons generic SaaS dashboard templates (cramped dark boxes, harsh glass borders, loud gold buttons) in favor of an **Editorial-meets-Technologist** property operations platform.

---

## 1. Core Visual Archetype & Brand Identity

**"Editorial Architecture meets Real-Time Operational Telemetry"**

- **Tone**: Calm, authoritative, sophisticated, intentional, and spacious.
- **Composition**: Atmospheric dark canvas illuminated by soft background color glows (`filter: blur(140px)`), generous whitespace (64px+ section margins), and a high-contrast typographic pairing of light editorial serifs with precise technical monospaced data tags.

---

## 2. Color System & Atmospheric Glow Engine

### Canvas & Surface Tokens
- **Canvas Base (`--aether-bg`)**: `#0B0C0E` — Deep midnight charcoal tone (not pitch black `#000`).
- **Surface Glass (`--aether-surface`)**: `rgba(255, 255, 255, 0.025)` — Ultra-sheer background fill.
- **Surface Glass Hover (`--aether-surface-hover`)**: `rgba(255, 255, 255, 0.05)` — Subtly elevated hover state.
- **Hairline Border (`--aether-border`)**: `rgba(255, 255, 255, 0.07)` — Crisp, 1px structural stroke.

### Atmospheric Color Glow Orbs
Large, blurred color shapes positioned in fixed background layers behind data modules to create emotional atmosphere:
- **Warm Gold Amber (`#D97706` / `blur(140px)`)**: Surfaces behind financial yield analytics and Penthouse views.
- **Sky Cyan (`#0284C7` / `blur(140px)`)**: Surfaces behind vacant unit availability and contract renewal feeds.
- **Muted Rose (`#E11D48` / `blur(140px)`)**: Surfaces behind urgent maintenance work orders and overdue warnings.

---

## 3. Typographic System & Emotional Scale

A three-tier typographic pairing designed to evoke both luxury architecture and data-driven precision:

### Tier 1: Editorial Display Serif (The Emotion & Prestige)
- **Font**: `Cinzel`, `Playfair Display`, or `Georgia` (Font weight: `300` / extra-light).
- **Usage**: Main page titles, property headers, large financial totals.
- **Signature Detail**: Italicized key action terms in main titles (e.g., `*Grand Tower* Residence`, `*Portfolio* Performance`, `*Revenue* Stream`).

### Tier 2: Technical Monospace (The Precision & Telemetry)
- **Font**: `JetBrains Mono`, `Roboto Mono`, or `ui-monospace` (Font size: `11px - 13px`).
- **Usage**: Unit codes (`PH-2401`), financial metrics (`$148,500`), occupancy ratios (`30/32`), dates (`2026-07-31`), and status pills.
- **Style**: Uppercase, monospaced character spacing for mathematical alignment.

### Tier 3: Neutral Body Sans-Serif (The Readability)
- **Font**: `Plus Jakarta Sans`, `Inter`, or system sans-serif (Font size: `13px - 15px`).
- **Usage**: Description text, form labels, navigation link items.

---

## 4. Layout Rhythm & Spatial Structure

- **Airy Section Gaps**: 64px vertical spacing between page sections to eliminate layout fatigue.
- **Generous Card Padding**: 32px padding (`p-8`) inside cards so content never touches borders.
- **Header Statement Zone**: Each module begins with a low-density, wide-margin header containing the editorial title and a centered AI Search & Command Bar with simulated typing prompts (*"Draft rent reminder for Unit 302..."*).

---

## 5. Components, Cards & Surfaces

- **Floating Glass Panels**:
  ```css
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  ```
- **Buttons**:
  - *Primary Button*: Crisp `#FFFFFF` text on subtle semi-transparent amber fill (`bg-amber-500/20 border border-amber-500/40`), rounded-xl, 200ms ease-out lift.
  - *Secondary Button*: Monospaced text with `border border-white/10` and soft hover background shift (`bg-white/5`).

---

## 6. Data Visualization Style

- Delicate SVG line charts with subtle 15% opacity gradient fills under curves.
- Gridlines use 4% opacity white dashed strokes (`rgba(255, 255, 255, 0.04)`).
- Data points appear as clean white dots with outer monospaced tooltip overlays on hover.

---

## 7. Next Steps & Execution Plan

With `ORIGIN_VISUAL_ANALYSIS.md` and `APARTMENT_VISUAL_DIRECTION.md` fully defined:
1. Review the visual principles with the team/user.
2. Refactor the application styling tokens in `src/index.css` to implement the new `#0B0C0E` base, 140px blurred glow engine, and 3-tier typography system.
3. Re-architect the Dashboard view to match the editorial composition and spacious rhythm before touching remaining screens.
