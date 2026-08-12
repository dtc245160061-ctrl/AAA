# Project Handoff Document — Property Operations Platform

**Project Directory**: `D:\AAA`  
**GitHub Repository**: `https://github.com/dtc245160061-ctrl/AAA` *(PRIVATE)*  
**Production URL**: `https://aaa-jade-two.vercel.app`  
**Current Branch**: `main`  
**Deployment Pipeline**: GitHub → Vercel Automatic Deployment  

---

## A. PROJECT OVERVIEW

This application is a **React 19 + TypeScript + Vite + Tailwind CSS v4** single-page web application (SPA) built with an editorial, botanical luxury design system inspired by Origin ([useorigin.com](https://useorigin.com/)).

### Core Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite v8.2
- **Styling**: Vanilla CSS custom tokens + Tailwind CSS v4 (`src/index.css`)
- **Icons**: Lucide React (`lucide-react`)
- **Typography**: Google Fonts — `Cinzel` (Editorial Serif), `JetBrains Mono` (Technical Code), `Plus Jakarta Sans` (Body)
- **Deployment Platform**: Vercel SPA Automatic Pipeline (`vercel.json` rewrite rule: `/(.*)` → `/index.html`)

### Application Architecture
- **Layout Shell**: `src/App.tsx` controls global theme, active module state (`dashboard`, `buildings`, `units`, `unit_detail`, `tenants`, `contracts`, `payments`, `expenses`, `maintenance`, `documents`, `reports`, `notifications`), drawer modals, and demo reset logic.
- **Header**: `src/components/Topbar.tsx` contains UTC clock, `STAGING / DEMO` indicator, search bar, AI Copilot trigger, Quick Action button, Theme / Demo reset dropdown, and profile badge.
- **Navigation**: `src/components/Sidebar.tsx` quiet left sidebar with active building selector and 11 module links.
- **Domain Types & Mock Data**: `src/types/apartment.ts` and `src/data/mockData.ts`.

---

## B. CURRENT PRODUCT DIRECTION & PENDING DECISION

> [!IMPORTANT]
> **CRITICAL UNRESOLVED QUESTION — PRODUCT DIRECTION**
> 
> The application is currently built as a **Property Operations / Property Management System** for property managers and building operations teams (B2B Admin Dashboard).
> 
> However, stakeholder / teacher feedback suggests that the actual requirement for this project might be an **Apartment Rental Marketplace** (similar to Airbnb), where end users search for apartments by city/dates/guests, browse listings, view unit details, and book/rent residences.
> 
> **Instructions for the Next Agent**:
> 1. **Do NOT delete or pivot the existing code architecture** until the product direction is officially confirmed by the user/stakeholder.
> 2. If the user confirms a pivot to **Apartment Rental Marketplace**, **DO NOT start from scratch**. Reuse the existing UI components (`UnitsView`, `UnitDetailView`, hero assets, Liquid Glass surfaces, and mock datasets).

---

## C. COMPLETED FEATURES

The following features exist and are fully implemented in the code:

1. **Dashboard** (`src/components/DashboardView.tsx`): Hero landscape photograph with gradient overlay, operational telemetry band, revenue growth chart, maintenance queue, expiring lease list, and activity feed.
2. **Buildings** (`src/components/BuildingsView.tsx`): Building overview with an **Interactive Floor Elevation Matrix** (visual grid from Floor 24 down to Floor 1 with color-coded unit statuses).
3. **Apartments / Units** (`src/components/UnitsView.tsx`): Searchable & filterable unit directory (Grid & Table list toggle, floor/status filters) with direct links to inspect unit details.
4. **Tenants / Residents** (`src/components/TenantsView.tsx`): Verified resident directory with profile cards, contact info, lease dates, auto-pay badges, and unit links.
5. **Lease Contracts** (`src/components/ContractsView.tsx`): Agreement lifecycle manager, deposit escrow tracking, 60-day expiration alerts, and renewal actions.
6. **Rent & Collections** (`src/components/PaymentsView.tsx`): Invoicing ledger, target collection velocity metrics, paid/pending/overdue filters, and payment recording.
7. **Property Expenses** (`src/components/ExpensesView.tsx`): Categorized expense logging, vendor audit breakdown, and monthly budget progress.
8. **Work Orders** (`src/components/MaintenanceView.tsx`): Dispatch hub with Kanban Board (Open / In Progress / Resolved) and Table view toggle, status mutations, and technician assignment.
9. **Documents Library** (`src/components/DocumentsView.tsx`): Centralized repository for signed leases, resident IDs, receipts, and building bylaws with download CTAs.
10. **Analytics Reports** (`src/components/ReportsView.tsx`): Executive cash flow velocity SVG chart and NOI metrics workspace.
11. **Alerts Center** (`src/components/AlertsView.tsx`): Operational notification center with unread/read toggles and deep links to units.
12. **AI Copilot Drawer** (`src/components/AiCopilotDrawer.tsx`): Interactive assistant drawer answering operational queries ("Show overdue rent", "Which leases expire in 60 days?", "Show unresolved maintenance issues", "Give me a summary of PH-2401").
13. **Quick Action Dispatcher** (`src/components/QuickActionModal.tsx`): Modal form for state mutations (Record Payment, Add Resident, Create Lease, Log Work Order).
14. **Signature Unit Detail View** (`src/components/UnitDetailView.tsx`): Penthouse Sky Residence profile with 5 Liquid Glass tabs (`Resident Spotlight`, `Climate & IoT`, `Payment Ledger`, `Work Orders`, `Documents`).
15. **Global Theme System**: Dark, Light, and System modes with `localStorage` persistence and `prefers-color-scheme` reactive auto-detection.
16. **Liquid Glass System**: Custom backdrop-blurred optical surfaces (`.liquid-glass`, `.atmospheric-panel`, `.product-ui-card`).
17. **Approved Visual Identity**: Natural botanical landscape photograph (`public/images/property-hero.png`).
18. **Demo Reset Action**: Topbar menu action to clear local state and restore initial mock data.

---

## D. CURRENT VISUAL DIRECTION

- **Identity**: *"Luxury residential nature + editorial technology + real operational precision."*
- **Color Palette**: Deep natural forest green (`#10B981`), sky blue (`#0284C7`), warm off-white canvas in Light Mode (`#F5F7F6`), dark slate canvas in Dark Mode (`#0A0D12`).
- **Typography**: `Cinzel` serif display headlines, `JetBrains Mono` technical data, `Plus Jakarta Sans` body.
- **Light Mode Status**: Implemented across all 11 modules, but requires further refinement to eliminate subtle dark mode visual biases on certain borders and badges.
- **Visual Richness**: Dashboard and `PH-2401` Penthouse view are highly art-directed; secondary modules should be audited to ensure consistent visual polish.

---

## E. DEPLOYMENT WORKFLOW

- **Pipeline**: `Local Code` → `Git Commit` → `git push origin main` → `GitHub PRIVATE repo` → `Vercel Automatic Deployment` → `Production URL`.
- **Production URL**: [https://aaa-jade-two.vercel.app](https://aaa-jade-two.vercel.app)
- **Rule**: Do **NOT** run `npx vercel --prod` for normal development. Automatic deployment triggers on `git push origin main`.
- **Publishing Rule**: Only push/deploy when the user explicitly requests *"PUBLISH CURRENT BUILD"*.

---

## F. TESTING & TEAM ACCESS

- **Staging / Demo URL**: [https://aaa-jade-two.vercel.app](https://aaa-jade-two.vercel.app)
- **Tester Permissions**: Teammates access the website as end-user testers. The GitHub repository remains **PRIVATE**, and testers have **NO write access** to the source code.
- **Demo Data Behavior**: Uses frontend mock dataset with in-memory and `localStorage` persistence. Testers can click **Reset Demo Data** in the topbar dropdown to restore initial mock data anytime.

---

## G. KNOWN ISSUES & OPEN QUESTIONS

1. **Product Direction**: Unresolved choice between Property Management System (B2B Admin) vs. Apartment Rental Marketplace (B2C Airbnb-style).
2. **Rental Marketplace Flow**: If pivoting, primary user journeys (search by city/dates/guests, booking flow) need to be defined.
3. **Light Mode Polish**: Further visual polish needed on light mode contrasts, borders, and input controls.
4. **Visual Richness**: Secondary modules require auditing to match the visual depth of the Dashboard.
5. **Backend Data Scope**: No production database, authentication service, or payment gateway backend exists; the app operates entirely on a structured frontend mock dataset.

---

## H. NEXT RECOMMENDED STEPS

1. **Clarify Product Direction**: Confirm with the user/stakeholder whether to maintain Property Operations Management or pivot to an Apartment Rental Marketplace.
2. **If Pivoting to Marketplace**:
   - Re-architect primary user journeys (Search bar for City/Dates/Guests, Listing Cards, Booking Flow).
   - Maximize code reuse (`UnitsView`, `UnitDetailView`, Liquid Glass components, mock data).
3. **If Maintaining Management System**:
   - Refine Light Mode contrast and visual consistency across secondary modules.
   - Audit interactive forms and AI Copilot responses.
4. **Deploy Control**: Only execute `git push origin main` when the user asks to *"PUBLISH CURRENT BUILD"*.
