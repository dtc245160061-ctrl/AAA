# HAVEN — Visual Direction v2: "Bright Product Sanctuary"

> **Previous**: "Tĩnh Lặng" (Serene Instrument) — v1, 2026-08-19  
> **Current**: "Bright Product Sanctuary" — v2, 2026-08-19  
> **Status**: Pending approval  
> **Change reason**: Product owner feedback confirmed preference for bright surfaces, scroll-driven reveals, property card choreography, liquid glass on key surfaces, and guided visual paths. "Tĩnh Lặng" was too restrictive (banned all scroll animation, glow, parallax).

---

## 1. What This Direction Is

A web app for finding and managing apartments that feels like a **living, breathing product experience** — not a dark SaaS dashboard, and not a marketing landing page.

- **Light mode is the primary experience**. Dark mode is a well-crafted companion, not an afterthought.
- **The consumer home page has 2–3 cinematic signature moments**. Everything else is calm, fast, and functional.
- **Property data is the hero**. No stock photos. Real apartments, real prices, real environmental data.
- **Motion is zoned**: expressive where it creates first impressions, restrained everywhere else.

### One-Sentence Summary

> A bright, warm product sanctuary where finding a home feels guided and trustworthy — with a few signature visual moments that create lasting brand memory, and a daily-use workspace that never gets in the way.

---

## 2. Brand Foundation (Consumer + Admin shared)

### 2.1 Typography

| Tier | Font | Weight | Use |
|------|------|--------|-----|
| Display | Plus Jakarta Sans | 700–800 | Hero headlines, section titles (28–56px) |
| Data | JetBrains Mono | 500–700 | Prices, metrics, unit IDs, timestamps |
| Body | Plus Jakarta Sans | 400–500 | Paragraphs, descriptions, labels (15px base) |
| Brand | Playfair Display | 700 | "HAVEN" logotype only, never for Vietnamese body text |

### 2.2 Color System

**Two primary accents**:
- **Emerald** `#10B981`: Safety, positive states, primary CTA, brand identity
- **Amber** `#F59E0B`: Financial data, warnings, premium markers

**Two semantic accents**:
- **Rose** `#F43F5E`: Danger, overdue, destructive actions
- **Sky** `#38BDF8`: Info, neutral highlight, links

**Neutrals**: Slate scale (`slate-50` through `slate-950`), mapped through semantic tokens that swap between themes.

### 2.3 Surfaces

4-tier hierarchy, defined by semantic tokens:

| Tier | Dark | Light | Use |
|------|------|-------|-----|
| Canvas | `#0A0C10` | `#F7F9F8` | Page background |
| Raised | `rgba(255,255,255,0.03)` | `#FFFFFF` | Cards, panels |
| Elevated | `rgba(255,255,255,0.055)` + blur | `rgba(255,255,255,0.95)` + blur | Dropdowns, popovers, featured cards |
| Overlay | `rgba(10,12,16,0.92)` + blur | `rgba(255,255,255,0.95)` + blur | Modals, drawers |

### 2.4 Shape & Border

- Panels: 20–24px radius
- Cards: 12–16px radius
- Badges/pills: 8px or full radius
- Borders: 1px, semantic color (`--haven-border`)

### 2.5 Icon Language

- Lucide icons throughout
- Default stroke: 1.75
- Active stroke: 2.5
- Never filled (except saved/bookmarked states)

---

## 3. Dual Theme — Semantic Token System

Every component uses `--haven-*` CSS custom properties. These auto-switch when the `.light` class is applied.

### 3.1 Core Token Map

| Token | Dark | Light |
|-------|------|-------|
| `--haven-bg` | `#0A0C10` | `#F7F9F8` |
| `--haven-bg-subtle` | `#0E1117` | `#EFF3F1` |
| `--haven-surface-raised` | `rgba(255,255,255,0.03)` | `#FFFFFF` |
| `--haven-surface-elevated` | `rgba(255,255,255,0.055)` | `rgba(255,255,255,0.95)` |
| `--haven-surface-hover` | `rgba(255,255,255,0.07)` | `rgba(15,23,42,0.04)` |
| `--haven-border` | `rgba(255,255,255,0.07)` | `#E2E8F0` |
| `--haven-border-strong` | `rgba(255,255,255,0.12)` | `#CBD5E1` |
| `--haven-text-primary` | `#F1F5F9` | `#0F172A` |
| `--haven-text-secondary` | `#94A3B8` | `#475569` |
| `--haven-text-tertiary` | `#64748B` | `#94A3B8` |
| `--haven-text-muted` | `#475569` | `#CBD5E1` |
| `--haven-text-inverse` | `#0F172A` | `#F1F5F9` |

### 3.2 Always-Constant Tokens (theme-independent)

| Token | Value | Use |
|-------|-------|-----|
| `--haven-text-on-dark` | `#F1F5F9` | Text on hero overlays, dark image scrims |
| `--hero-overlay` | `rgba(10,12,16,0.7)` | Dark overlay on hero images |
| All `--haven-emerald-*` | Same in both themes | Emerald accent scale |
| All `--haven-amber-*` | Same in both themes | Amber accent scale |

### 3.3 Shadow Tokens (theme-aware)

| Token | Dark | Light |
|-------|------|-------|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)` | `0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)` |
| `--shadow-elevated` | `0 4px 16px rgba(0,0,0,0.4), 0 12px 40px rgba(0,0,0,0.25)` | `0 4px 16px rgba(15,23,42,0.06), 0 12px 40px rgba(15,23,42,0.08)` |
| `--shadow-glow-emerald` | `0 0 20px rgba(16,185,129,0.15)` | `0 0 20px rgba(16,185,129,0.1)` |

---

## 4. Motion System

### 4.1 Motion Zones

| Zone | Level | Where |
|------|-------|-------|
| **Cinematic** | HIGH | Consumer Home hero, first load only |
| **Discovery** | MEDIUM | Property browsing, feature story |
| **Task** | LOW | Search, forms, data entry |
| **Operations** | RESTRAINED | Admin dashboard, tables |

### 4.2 Motion Budget (9 allowed types)

| # | Name | Zone | Duration | Easing |
|---|------|------|----------|--------|
| 1 | First-load panel reveal | Cinematic | 600ms | `cubic-bezier(0.16,1,0.3,1)` |
| 2 | Text stagger entrance | Cinematic | 400ms + 80ms gap | `ease-out` |
| 3 | Property card choreography | Cinematic | 800ms staggered | `cubic-bezier(0.34,1.56,0.64,1)` |
| 4 | SVG path draw-on | Cinematic | 1200ms | `ease-in-out` |
| 5 | Scroll-reveal fade-up | Discovery | 400ms | `ease-out` |
| 6 | Hover lift | All | 200ms | `ease-out` |
| 7 | Drawer/modal slide | All | 300ms | `cubic-bezier(0.16,1,0.3,1)` |
| 8 | Safety Scan sweep | Detail | 600ms | `ease-in-out` |
| 9 | Number count-up | Dashboard | 400ms | `ease-out` |

### 4.3 Banned Motion

- ❌ Infinite `animate-pulse` on icons
- ❌ Auto-play carousels
- ❌ Scroll-jacking (hijacking scroll position)
- ❌ Horizontal scroll as primary navigation
- ❌ Background gradient loops
- ❌ Particle effects, confetti, snow
- ❌ Page transition animations between routes

### 4.4 Reduced-Motion Fallback

`prefers-reduced-motion: reduce` → All durations become 0ms via token override. All transforms removed. SVG path fully drawn. Content all visible immediately. Zero functionality lost.

### 4.5 Mobile Fallback

- Hero parallax: disabled on <1024px
- Property card choreography: simplified to staggered opacity fade
- SVG guided path: hidden on <768px
- Liquid glass blur: reduced from 16px to 8px
- All IntersectionObserver reveals: preserved

---

## 5. Liquid Glass Usage Rules

**Allowed on** (max 4 simultaneously on-screen):
1. Consumer Home hero card / AI search container
2. Featured property cards (max 3)
3. Modal / drawer overlays
4. Floating AI assistant bubble

**Forbidden on**: Admin metric cards, table rows, sidebar items, form inputs, badges, nav items.

**Implementation**: `backdrop-filter: blur(16px)` + translucent background + subtle edge gradient. Performance-gated: skip blur when >4 glass elements visible.

---

## 6. Consumer Home — Signature Moments

### Moment 1: First-Load Reveal
The hero section doesn't just appear — it **opens**. The background gradient fades in (300ms), then the headline reveals line-by-line (400ms + 80ms stagger), then the AI search bar scales up from 0.95→1.0 (300ms). Total sequence: ~1.2s. Feels intentional, not slow.

### Moment 2: Property Card Entrance
Below the hero, 3 featured apartment cards enter the viewport along a gentle guided arc. Left card enters from bottom-left, center from below, right from bottom-right. Staggered 150ms apart. Total: ~800ms. Uses Framer Motion `animate` with spring physics.

### Moment 3: SVG Guided Path
A thin emerald line (1px, 30% opacity) draws itself along a path connecting the property cards section → feature highlights → trust indicators. Triggered by scroll via IntersectionObserver + CSS `stroke-dashoffset`. Hidden on mobile (<768px).

---

## 7. Image & Content Direction

- **Hero**: No Unsplash stock photos. Background is a CSS gradient (warm sky blue → white in light, deep navy → slate in dark). Product UI and data are the visual content.
- **Property photos**: Use existing apartment photos from data. Apply consistent aspect ratio (16:10) and rounded corners (12px).
- **Icons**: Lucide icon set, monoline style. No filled icons except saved/bookmarked states.
- **No illustrations**: The product is real data, not art. If empty states need visual treatment, use very simple line-art or the Sparkles icon.

---

## 8. Performance Constraints

| Constraint | Budget | Current |
|-----------|--------|---------|
| JS bundle (gzipped) | <200KB | 174KB ✅ |
| CSS bundle (gzipped) | <25KB | 17KB ✅ |
| New dependencies | 0 | Framer Motion already installed |
| `backdrop-filter` elements on-screen | ≤4 | — |
| Scroll listeners | IntersectionObserver only | — |
| Font files | 3 families | 3 ✅ |
| Largest Contentful Paint | <2.5s | — |
