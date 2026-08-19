# HAVEN — Frontend Rebuild Plan

> **Direction**: Concept A — "Tĩnh Lặng" (Serene Instrument)  
> **Status**: Pending approval — NO code changes until approved  
> **Date**: 2026-08-19

---

## Overview

This plan refactors HAVEN's frontend in 6 incremental slices. Each slice is independently reviewable via screenshot. The direction transforms HAVEN from a generic dark SaaS template into a calm, precise, product-native instrument for finding and managing apartments.

**Key principles**:
1. Product data is the hero — no stock photos as hero imagery
2. Two accents only: emerald (safety/positive) + amber (financial/warning)
3. Typography creates hierarchy: sans display (56px) → mono data (12px) → body (15px)
4. Motion budget: exactly 6 allowed motion types, all purpose-driven
5. Mobile-first responsive: sidebar collapse → icon bar → bottom nav

---

## Slice 0: Foundation (Design Tokens + App Shell)

**Duration**: ~4–6 hours  
**Reviewable by**: Screenshot of empty shell at 1440px + 375px widths

### Tasks

#### 0.1 — Create Design Token System
- [ ] Create `src/styles/tokens.css`
  - Color tokens: `--haven-bg`, `--haven-surface-*`, `--haven-border`, `--haven-accent-emerald`, `--haven-accent-amber`, `--haven-text-*`
  - Typography tokens: `--font-display`, `--font-body`, `--font-mono` with sizes
  - Spacing scale: 4px base, 8pt grid
  - Shadow tokens: `--shadow-card`, `--shadow-elevated`, `--shadow-overlay`
  - Surface tokens: `.surface-raised`, `.surface-elevated`, `.surface-hero`
  - Transition tokens: `--ease-standard`, `--duration-micro`, `--duration-standard`

#### 0.2 — Create Utility Classes
- [ ] Create `src/styles/utilities.css`
  - Typography utilities: `.text-display`, `.text-heading`, `.text-body`, `.text-data`, `.text-label`
  - Surface utilities mapped to tokens
  - Status badge utilities: `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-neutral`

#### 0.3 — Refactor index.css
- [ ] Remove `ambient-glow-*` keyframe animations
- [ ] Remove `floatOrb` / `floatOrb2` animations
- [ ] Remove `dreamyShimmer` animation
- [ ] Import new `tokens.css` and `utilities.css`
- [ ] Simplify light-mode overrides (defer full light mode to later)
- [ ] Keep `liquid-glass` and `atmospheric-panel` classes temporarily for backward compatibility

#### 0.4 — Build App Shell Components
- [ ] Create `src/components/layout/AppShell.tsx`
  - Wraps sidebar + topbar + content area
  - Handles responsive sidebar collapse logic
  - Provides content area with correct max-width per persona
- [ ] Refactor `Sidebar.tsx`
  - Add collapsed state (icon-only, 60px width) at <1024px
  - Hide entirely at <768px
  - Use new design tokens
  - Remove `animate-pulse` from AI button
- [ ] Refactor `Topbar.tsx`
  - Remove live clock (unnecessary cognitive load)
  - Simplify: Brand mark left, centered search, action buttons right
  - Use new design tokens
- [ ] Create `src/components/layout/MobileNav.tsx`
  - Bottom fixed bar, visible at <768px only
  - 5 icon buttons: Home, Search, Compare, Guides, Profile
  - Active state indicator (dot or underline, not heavy highlight)

#### 0.5 — Build Primitive UI Components
- [ ] Create `src/components/ui/Card.tsx`
  - Props: `variant` (raised | elevated | hero), `interactive` (boolean), `children`
  - Uses new surface tokens
  - Hover: translateY(-2px) + border-color shift (200ms)
- [ ] Create `src/components/ui/Button.tsx`
  - Variants: primary (emerald), secondary (ghost border), danger (rose)
  - Sizes: sm, md, lg
  - Consistent padding, font, and hover behavior
- [ ] Create `src/components/ui/Badge.tsx`
  - Status variants: success, warning, danger, neutral, info
  - Consistent sizing and color from tokens

#### 0.6 — Update index.html
- [ ] Optimize font loading: keep Plus Jakarta Sans + JetBrains Mono
- [ ] Reduce Playfair Display to weight 700 only (used for "HAVEN" logotype)
- [ ] Remove Be Vietnam Pro if Plus Jakarta Sans handles Vietnamese well enough

---

## Slice 1: Consumer Home Rebuild

**Duration**: ~6–8 hours  
**Reviewable by**: Screenshot of full home page at 1440px + 375px

### Tasks

#### 1.1 — Product-Native Hero Section
- [ ] Remove Unsplash stock photo background
- [ ] New hero: dark canvas + centered large sans-serif headline + AI search bar
- [ ] Live data strip below search: "X căn đang trống • 16 thành phố"
- [ ] Quick suggestion pills restyled as inline links

#### 1.2 — Sanctuary Tuning Dials Redesign
- [ ] Convert from tall cards to compact horizontal pill toggles
- [ ] 2-row grid layout, 5 per row
- [ ] Tighter visual: icon + label + toggle indicator
- [ ] "Apply" button remains, simplified

#### 1.3 — Featured Apartments Grid
- [ ] New card component using `ui/Card.tsx`
- [ ] Photo + price + 3 key specs + AI match score
- [ ] Consistent height, no overflow issues
- [ ] Remove "Điểm Nổi Bật Cốt Lõi" verbose descriptions

#### 1.4 — City Guides Section
- [ ] Three editorial strips (Hanoi, HCMC, Da Nang)
- [ ] Wide, short cards with subtle gradient overlay on city photo
- [ ] Click navigates to search filtered by city

---

## Slice 2: Unit Detail + Safety Scan Signature

**Duration**: ~6–8 hours  
**Reviewable by**: Screen recording of Safety Scan animation + screenshots

### Tasks

#### 2.1 — Detail Layout Restructure
- [ ] Full-width photo hero with gradient overlay (actual apartment photo from data)
- [ ] Tabbed content below: Overview | True Cost | Safety | Location | Reviews
- [ ] Sticky header with unit name + price as user scrolls past hero

#### 2.2 — True Cost Breakdown
- [ ] Count-up number animation (400ms per value)
- [ ] Stacked bar visualization of cost components
- [ ] Final total emphasized with subtle scale-up

#### 2.3 — Safety Scan Signature Moment
- [ ] On Safety tab first open: sweep animation across indicators
- [ ] Each indicator (PCCC, Flood, Noise, Power) resolves sequentially (150ms gap)
- [ ] Checkmark or warning icon appears with state-appropriate color
- [ ] Full `prefers-reduced-motion` fallback: all shown instantly

#### 2.4 — Action Buttons
- [ ] Booking, Chat, Virtual Tour, Compare — using `ui/Button.tsx`
- [ ] Consistent layout in a sticky bottom bar on mobile

---

## Slice 3: Search Results + Admin Dashboard

**Duration**: ~8 hours  
**Reviewable by**: Screenshots of search view + admin dashboard

### Tasks

#### 3.1 — Search Results View
- [ ] Left filter panel (collapsible on mobile)
- [ ] Right grid: 2 or 3 columns depending on viewport
- [ ] Compact card variant for listings
- [ ] Sort controls + result count

#### 3.2 — Admin Dashboard
- [ ] Metric cards using `ui/Card.tsx` with number count-up
- [ ] Activity feed (leads, contracts) as compact list items
- [ ] AI Copilot CTA simplified

---

## Slice 4: Remaining Admin Views

**Duration**: ~8 hours

### Tasks
- [ ] Leads View — table + status badges
- [ ] Contracts View — table + form modal
- [ ] Billing View — invoice table + payment recording
- [ ] Inbox View — conversation list + reply panel
- [ ] Documents View — file list + upload

---

## Slice 5: Polish + States + Mobile

**Duration**: ~4–6 hours

### Tasks
- [ ] Loading states: skeleton shimmer cards
- [ ] Empty states: centered illustration + CTA
- [ ] Error states: top banner, auto-dismiss
- [ ] Reduced-motion audit: verify all 6 motion types have fallbacks
- [ ] Mobile testing: verify all views at 375px width
- [ ] Remove DevPreviewLauncher from production build
- [ ] Remove `App.css` (Vite boilerplate, unused)

---

## Dependency Map

```
Slice 0 ──► Slice 1 ──► Slice 2
   │                       │
   └──► Slice 3 ───────────┤
              │             │
              └──► Slice 4 ─┘
                       │
                       └──► Slice 5
```

Slices 1 and 3 can proceed in parallel after Slice 0.  
Slice 2 depends on Slice 1 (shared card components).  
Slice 4 depends on Slice 3 (shared admin primitives).  
Slice 5 is the final polish pass.

---

## Files Summary

### New Files (Total: ~10)

```
src/styles/tokens.css
src/styles/utilities.css
src/components/layout/AppShell.tsx
src/components/layout/MobileNav.tsx
src/components/ui/Card.tsx
src/components/ui/Button.tsx
src/components/ui/Badge.tsx
src/components/ui/Input.tsx (Slice 1)
src/components/ui/Skeleton.tsx (Slice 5)
src/components/ui/EmptyState.tsx (Slice 5)
```

### Modified Files (Slice 0 only)

```
src/index.css — Token imports, remove animations
src/components/Sidebar.tsx — Collapse behavior
src/components/Topbar.tsx — Simplified layout
src/App.tsx — Import AppShell wrapper
index.html — Font loading optimization
```

### Eventually Removed

```
src/App.css — Vite boilerplate
src/components/AwwwardsGuideModal.tsx — Meta-documentation
src/devtools/preview/DevPreviewLauncher.tsx — Dev utility
```
