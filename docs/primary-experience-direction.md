# HAVEN — Primary Experience Direction & Signature Experience Proposal

> **Role**: Lead Product Designer, Creative Director, Senior Frontend Architect  
> **Date**: 2026-08-19  
> **Objective**: Make HAVEN feel materially more premium, visually distinctive, and interaction-rich from the first moment a user opens the web app, while preserving the usability of a real product.  
> **Status**: PROPOSAL & APPROVAL GATE — No code changes made, no packages installed. Awaiting user approval.

---

## 1. The Three Biggest Experience-Level Gaps

Based on live evaluation of the current build against the reference benchmarks (*Linearity*, *Reasonal*, *Quoti*):

1. **Disconnected Hero Composition (Controls Without a World)**:
   - *Current State*: The hero is an isolated dark box containing text and a search input. The user sees a form control rather than experiencing a "Sanctuary."
   - *Reference Quality*: In benchmark products, the hero immediately couples intent (AI lifestyle matching) with a physical artifact (a living sanctuary preview card with environmental indicators), establishing an unmistakable sense of place in the first 3 seconds.

2. **Fragmented UI Blocks Instead of a Narrative Journey**:
   - *Current State*: The Consumer Home reads as vertically stacked, generic grids (Hero → Tuning Dials grid → City cards grid → Featured properties grid → Feature strip grid). Each section feels like an isolated database query rather than a continuous exploration.
   - *Reference Quality*: Benchmark experiences guide the user's eye seamlessly across sections through visual choreography, where exploring an apartment naturally reveals and connects to its verified climate, acoustic, and infrastructural proof points.

3. **Generic Surface Physics & Hover States**:
   - *Current State*: Hovering over cards or features triggers simple CSS transforms (`translateY(-2px)`) and opacity shifts.
   - *Reference Quality*: Premium web apps employ tactile, purposeful micro-interactions (e.g. ambient lighting highlights, data-connected resonance where selecting an apartment metric activates the corresponding environmental proof point) that communicate physical substance and precision engineering.

---

## 2. The One Chosen Signature Experience

### **Selection: Option B — "The Property-to-Benefit Sanctuary Journey"**
*(Enhanced with First-Viewport Hero Resonance)*

### Why This Has the Highest Impact:
HAVEN’s unique market distinction is **verifiable living quality** (flood risk, quiet index, EV parking, backup power) — not generic property listings. 

By transforming the **Featured Properties + Guided Connector + Environmental Benefits** into a **single, interactive narrative system**:
- The user experiences a tangible, cause-and-effect relationship: *“This penthouse on floor 10 isn't just luxurious; its Low-E acoustic rating and dual power substation make it a true sanctuary.”*
- The SVG guided path evolves from a static decoration into an **active visual conductor** that lights up and bridges specific apartment features directly into verified climate data cards when exploring or hovering properties.
- It elevates the middle and lower exploration of Consumer Home into an unforgettable, signature product demonstration without altering the underlying data model.

---

## 3. The Smallest Implementation Slice to Prove the Signature Experience

To deliver maximum perceptual uplift with minimal code footprint, we will focus exclusively on the core narrative spine in `UserHomeView`:

```
┌─────────────────────────────────────────────────────────────┐
│                    Hero Section (Enhanced)                  │
│       Headline & Search coupled with Sanctuary Badges       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Visual flow)
┌──────────────────────────────▼──────────────────────────────┐
│       Featured Sanctuary Properties (Interactive Stage)     │
│   • 3 Curated Units with Active Focal State                 │
│   • Interactive Sensor Badges (Noise, Flood, EV, Power)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Dynamic SVG Connector Path)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│         Environmental Proof Grid (Resonant Feature Strip)   │
│   • 4 Environmental Proof Cards (Flood, Power, EV, Noise)   │
│   • Dynamically Highlights & Resonates with Active Unit     │
└─────────────────────────────────────────────────────────────┘
```

### Exact Components to Touch:
1. `src/components/home/FeaturedProperties.tsx`:
   - Introduce an `activeFocalUnit` state (defaulting to the first premier unit).
   - Add interactive environmental tag triggers (`[Chống Ngập: Thấp]`, `[Độ Ồn: Yên Tĩnh]`, `[Máy Phát: 100%]`) on property cards that highlight corresponding benefits.
2. `src/components/home/GuidedPath.tsx`:
   - Connect the active property card’s bottom anchor to the feature strip using an animated, responsive SVG beam that responds to hover/focus.
3. `src/components/home/FeatureStrip.tsx`:
   - Add active resonance states: when a property with "Điện dự phòng 100%" is hovered/selected, the "Máy Phát Điện Dự Phòng" card gently elevates with a subtle emerald glow.
4. `src/components/UserHomeView.tsx`:
   - Coordinate the light shared state (`activeHighlightKey`) between FeaturedProperties and FeatureStrip.

---

## 4. Exact Visual States & Motion Timeline

### A. State 1: Idle / Initial Reveal (0 – 700ms)
- The 3 featured property cards settle via clean vertical staggered entrance (`y: 28px → 0`).
- Card 1 (Studio Hồ Tây) is in default focal state with its primary environmental badge softly illuminated.
- The Guided Path draws its organic curve from the focal card down to the Environmental Proof Grid.
- Feature Strip cards rest in elevated surface style.

### B. State 2: User Hover / Focus on Property Card or Sensor Badge (Interactive Transition)
- **Hovered Card**: Lifts smoothly by `3px`, surface border gains a refined accent glow (`--haven-border-accent` with subtle radial halo).
- **Guided Connector**: SVG path stroke dynamically illuminates with a traveling gradient pulse along the curve toward the related environmental feature.
- **Resonant Feature Card**: The corresponding Environmental card (e.g. *Nguy Cơ Ngập Mùa Mưa* when hovering a flood-safe unit) receives a gentle elevation (`translateY(-2px)`) and background tint (`--haven-emerald-muted`), visually verifying the claim.

### C. State 3: Touch / Selection (Mobile or Click)
- Instant state change without artificial latency.
- Direct navigation to unit detail upon clicking the card or "Chi Tiết" button.

### Motion Timeline & Easing Principles:
- **Duration**: `240ms` for hover/interaction transitions; `400ms` for connector beam pulse.
- **Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (fluid natural acceleration with zero wobble or bouncing).
- **Layer Count**: Hardware-accelerated transforms (`transform`, `opacity`, `filter`) strictly bounded to active elements. Zero heavy re-renders.

---

## 5. Fallback & Accessibility Guarantees

- **Reduced Motion (`prefers-reduced-motion: reduce`)**:
  - Disable traveling beam animations and transforms.
  - State changes occur instantly via opacity and border color adjustments (`0ms` transitions).
- **Mobile (< 768px Viewport)**:
  - Guided SVG path is cleanly hidden (`hidden md:flex`) to eliminate clutter on narrow vertical screens.
  - Featured properties stack naturally with horizontal swipe/scroll padding.
  - Tap states highlight environmental tags in-place on the card itself without requiring cross-section scrolling.

---

## 6. Deliberately Deferred Items (Scope Protection)

The following items are intentionally excluded from this slice as they do not contribute to establishing the signature experience:
- ❌ Redesigning the 10 Tuning Dials panel.
- ❌ Redesigning the 3 City Guide cards.
- ❌ Migrating the 39 legacy Admin operational views.
- ❌ Altering mock datasets, routes, APIs, or apartment store business logic.
- ❌ Installing any new external animation or 3D libraries.

---

## 7. Quality & Verification Criteria

| Verification Angle | Success Threshold |
|---|---|
| **3-Second Impression (Screenshot)** | A user immediately sees the visual rhythm connecting apartment cards to tangible climate/safety proof points. No disconnected blocks. |
| **Interactive Feel (Video/Browser QA)** | Hovering an apartment card or spec immediately and fluidly illuminates the relevant environmental guarantee below. |
| **Theme Parity (Light & Dark)** | High contrast WCAG AAA standards maintained across both Light and Dark themes. |
| **Performance Budget** | TypeScript 0 errors, production build under 500ms, 60fps interaction frame rate. |

---

> **GATE STATUS**: AWAITING USER APPROVAL  
> Once approved, implementation will proceed strictly to the components specified above.
