# PROJECT HANDOFF

## 1. Project Overview
- **Application Name**: Property Operations (Apartment Management System).
- **Purpose**: A modern, web-based property operations platform built for property managers, building administrators, and landlords to handle residential buildings, tenant records, lease contracts, rent collections, expenses, maintenance work orders, documents, reports, and AI-assisted data querying.
- **Target Audience**: Property Managers, Building Administrators, Operations Staff, Financial Accountants.
- **Current Product Scope**: Focused on a high-efficiency administration web platform covering 12 core operational modules (Dashboard, Buildings, Units, Tenants, Contracts, Rent & Payments, Expenses, Maintenance, Documents, Reports, Notifications, and AI Assistant).

---

## 2. Instructor / Project Requirements

### Source Context:
Course templates located at `D:\AAA\Ứng dụng trí tuệ nhân tạo KHMT K23A-20260805T083400Z-1-001`:
1. `01_GenAI_SoftwareDevelopment_project-plan.docx`
2. `02_GenAI_SoftwareDevelopment_requirements-qa.docx`
3. `03_GenAI_SoftwareDevelopment_requirements-specification.docx`

### Academic Course Requirements (Instructor Framework):
- **Course**: Ứng dụng Trí tuệ Nhân tạo KHMT K23A (2026).
- **Timeline**: 9 weeks (July 27, 2026 – September 27, 2026).
- **Team Size**: 2 Students per group.
- **Core Course Deliverables**:
  - Problem Survey & Requirements Clarification Q&A.
  - Software Requirements Specification (SRS v1.0) with Use Case Modeling, Actor Definitions, UC Descriptions (UC001, UC002...), Activity & Sequence Diagrams.
  - Integration of Generative AI capabilities inside a web application.

### Distinction: Instructor Requirements vs. Our Product & Design Decisions:
- **Instructor Framework**: Mandates the academic submission structure (9-week timeline, SRS document, Use Case diagrams, functional/non-functional constraints, and AI integration).
- **Our Product Decisions**: Selecting the "Apartment / Property Management" domain, establishing the 12-module operational scope, adopting an Origin-inspired editorial visual language, excluding non-essential MVP scope (no resident mobile apps, no smart locks, no 3D WebGL models), and choosing a modern React 19 + TypeScript + Vite stack.

---

## 3. Current Product Decisions

### Primary Users & Role-Based Access Control (RBAC):
1. **Property Admin / General Manager**: Full portfolio access across all buildings, financials, staff assignments, reports, and AI capabilities.
2. **Operations Manager**: Full access to Buildings, Units, Tenants, Contracts, Maintenance, and Documents; read-only access to financial summaries.
3. **Maintenance Technician**: Access to view assigned Work Orders and log repair notes/expenses.
4. **Accountant / Financial Clerk**: Access to Rent & Payments, Expenses, Invoices, and Reports modules.

### Main Operational Workflows:
1. **Tenant Onboarding & Lease Binding**: Select Unit -> Input Tenant Details -> Define Contract Terms -> Change Unit Status to *Occupied*.
2. **Rent Collection Lifecycle**: System generates monthly invoices -> Track payment status (*Paid*, *Unpaid*, *Overdue*) -> Record received payments -> Issue receipts.
3. **Maintenance Work Orders**: Log issue -> Assign staff -> Record repair cost -> Resolve ticket.
4. **AI Property Assistant**: Natural language querying of tenant contracts, overdue rent summaries, and notice drafting.

### MVP Exclusions (Non-Goals):
- ❌ No resident-facing mobile apps or resident portal logins.
- ❌ No IoT / Smart Lock hardware integration.
- ❌ No luxury concierge / sky amenity booking engines.
- ❌ No 3D WebGL isometric building renders.
- ❌ No real estate investment yield / capitalization modeling.

---

## 4. Visual Direction (Origin-Inspired DNA)

### Visual Goal:
The visual goal is **NOT** a "dark SaaS dashboard + glassmorphism + loud gold accents + serif fonts everywhere". 

The goal is an **editorial, cinematic, art-directed digital product experience** inspired by the visual storytelling and restraint of **Origin** (`https://useorigin.com/`), translated into property operations: **"Editorial Architecture meets Real-Time Operational Telemetry"**.

### Visual Specifications & Design Rules:
- **Composition Principles**: Low-density editorial headers with 64px+ section gaps. Avoid cramped 4-column metric card walls. Content flows in a cinematic story sequence.
- **Typography Pairing**:
  - *Editorial Display Serif*: `Cinzel` / `Playfair Display` (light weight 300) with italicized highlights (`*Grand Tower* Residence`, `*Portfolio* Overview`).
  - *Technical Monospace*: `JetBrains Mono` / `ui-monospace` (11px–13px) for unit codes (`PH-2401`), financial metrics (`$148,500`), and telemetry badges (`Pin 92%`).
  - *Neutral Body Sans-Serif*: `Plus Jakarta Sans` for body text and navigation labels.
- **Atmosphere & Color Philosophy**:
  - Base Canvas: Deep midnight charcoal (`#0B0C0E`).
  - Atmospheric Orbs: Soft background color fields (`filter: blur(140px)`) positioned behind data sections (Amber `#D97706` for revenue, Cyan `#0284C7` for occupancy, Rose `#E11D48` for maintenance).
- **Surfaces & Hairlines**: Ultra-sheer glass panels (`bg-white/[0.025]`) with hairline structural borders (`border border-white/[0.07]`) and generous padding (32px).
- **Data Visualization**: Delicate SVG curve lines with 15% opacity gradient fill underneath, monospaced axis labels, and glowing dots on hover.
- **What We Explicitly DO NOT Want**:
  - ❌ Generic 4-column SaaS metric-card grids as the main layout structure.
  - ❌ Heavy glassmorphism or thick white glowing borders.
  - ❌ Excessive gold or loud solid color buttons.
  - ❌ Huge neon numbers everywhere.
  - ❌ Generic AI chatbot templates.

---

## 5. Current Implementation

### Tech Stack & Core Libraries:
- **Framework**: React 19 + TypeScript + Vite (`vite.config.ts`, `tsconfig.json`).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` integrated, custom tokens in `src/index.css`).
- **Icon Library**: `lucide-react`.

### Codebase Structure (`D:\AAA`):
```
D:\AAA\
├── handoff.md                   # THIS HANDOFF DOCUMENT
├── PRODUCT_DESIGN.md            # Product Vision, Workflows, 12 Modules, UX Specs
├── DESIGN_SYSTEM.md             # Visual Language & Token Specs
├── APP_ARCHITECTURE.md          # 10 TypeScript Data Schemas & Layout Architecture
├── ORIGIN_VISUAL_ANALYSIS.md    # 12 Visual Observations from useorigin.com
├── APARTMENT_VISUAL_DIRECTION.md# Revised Editorial Visual Direction Spec
├── index.html                   # HTML Entry Shell (Cinzel & Plus Jakarta Sans Fonts)
├── vite.config.ts               # Vite Configuration with @tailwindcss/vite
└── src/
    ├── types/
    │   └── apartment.ts         # TypeScript Domain Interfaces
    ├── data/
    │   └── mockData.ts          # Realistic Domain Dataset (Units, Tenants, WorkOrders)
    ├── components/
    │   ├── Sidebar.tsx          # Quiet Navigation Sidebar with Building Switcher
    │   ├── Topbar.tsx           # Global Search, Live Clock, Action Triggers
    │   ├── DashboardView.tsx    # Editorial Storytelling Dashboard Visual Prototype
    │   ├── AiCopilotDrawer.tsx  # Property AI Copilot Slide-Over Drawer
    │   └── QuickActionModal.tsx # High-frequency Operations Form Modal
    ├── index.css                # Custom CSS Design Tokens & Atmospheric Orbs
    ├── App.tsx                  # Root Routing Container & State Provider
    └── main.tsx                 # React Root Entry Point
```

---

## 6. What Has Already Been Completed

The following items are **100% complete, verified, and present in the codebase**:

- [x] **Product Specification** (`PRODUCT_DESIGN.md`)
- [x] **Architecture & Data Schema Specification** (`APP_ARCHITECTURE.md`)
- [x] **Design System Specification** (`DESIGN_SYSTEM.md`)
- [x] **Origin Visual Analysis** (`ORIGIN_VISUAL_ANALYSIS.md`)
- [x] **Apartment Visual Direction** (`APARTMENT_VISUAL_DIRECTION.md`)
- [x] **Recomposed Editorial Dashboard Prototype** (`src/components/DashboardView.tsx`)
- [x] **Quiet Sidebar Navigation with Building Switcher** (`src/components/Sidebar.tsx`)
- [x] **Topbar Header with Live Clock & Search Line** (`src/components/Topbar.tsx`)
- [x] **Property AI Copilot Slide-Over Drawer UI** (`src/components/AiCopilotDrawer.tsx`)
- [x] **Quick Action Operations Modal** (`src/components/QuickActionModal.tsx`)
- [x] **Clean Production Build Verification** (`npm run build` succeeds with 0 errors)

---

## 7. Current Dashboard Description

The implemented **Dashboard** (`src/components/DashboardView.tsx`) is designed as a 6-part visual story:

1. **Hero Header & Editorial Title**:
   - Features `PORTFOLIO OVERVIEW • 24 FLOORS` badge and italicized display title:
     > *"Managing **Grand Tower Residence** with clarity & operational velocity."*
   - Includes an embedded command prompt bar (*"Query property data or type a command..."*) with an `Ask AI` button.

2. **Key Operational Telemetry (3-Column Performance Overview)**:
   - *June Rent Collection Velocity*: `$148,500` (+12.4% vs May).
   - *Portfolio Occupancy Rate*: `93.8%` (30 / 32 Units Leased).
   - *Outstanding Overdue Rent*: `$12,400` across 2 late accounts.

3. **Financial Telemetry Visualization**:
   - Embedded SVG line chart tracking 6-month revenue growth ($112k to $148.5k) with 12% opacity gradient fill underneath, delicate 4% dashed gridlines, and monospaced month axis labels.

4. **Operational Action Queues**:
   - *Active Maintenance Work Orders*: Urgent tasks (*Urgent* rose tag for Smart Lock battery warnings, assigned technicians).
   - *Expiring Lease Contracts*: Contracts expiring in 30–60 days with countdown days and renewal CTAs.

5. **Logs & Intelligence**:
   - Real-time operational activity stream log + AI Assistant Copilot launcher card.

---

## 8. Known Problems & Technical Debt

1. **Mock Data Layer**:
   - Current datasets in `src/data/mockData.ts` are hardcoded static objects. Needs a persistent backend or local database state store.
2. **Placeholder Module Views**:
   - Modules other than Dashboard (`buildings`, `units`, `tenants`, `contracts`, `payments`, `expenses`, `maintenance`, `documents`, `reports`, `notifications`) display a placeholder spec message.
3. **Global Search Input**:
   - The Topbar search bar is visually implemented but does not filter data across screens yet.

---

## 9. Immediate Next Steps & Prioritized Roadmap

When starting in the new chat/session:

1. **Step 1: Implement the Apartment / Unit Detail Screen (✨ Signature Product View)**
   - Build the 3-column inspection view for an individual unit (`PH-2401`) as specified in `PRODUCT_DESIGN.md` (Specs, Resident Spotlight, Payment & Maintenance history).
2. **Step 2: Implement Buildings & Units List Views**
   - Build the Building Floor Plan Matrix and Unit filterable directory.
3. **Step 3: Wire Up State Mutations**
   - Connect real state updates for recording rent payments and resolving work orders.

### What Should NOT Be Touched Yet:
- ❌ Do **NOT** rewrite or scrap the current Dashboard visual style.
- ❌ Do **NOT** replace the visual direction with a generic SaaS card template.

---

## 10. Handoff Instructions for the Next Coding Agent

Dear Next Coding Agent:
1. **READ THIS FILE FIRST** (`handoff.md`).
2. **Do NOT restart the project.** The codebase in `D:\AAA` is cleanly structured, fully compiled, and running.
3. **Do NOT replace the current visual direction** with generic dark SaaS dashboards, glassmorphism, or heavy glowing cards. Preserve the **Origin-inspired visual DNA** (`ORIGIN_VISUAL_ANALYSIS.md` & `APARTMENT_VISUAL_DIRECTION.md`).
4. Continue directly with **Step 1 of the Roadmap** (building the **Apartment / Unit Detail View**).
5. Ask for user clarification only when genuinely necessary.
