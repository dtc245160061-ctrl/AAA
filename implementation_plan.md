# Comprehensive Implementation Plan — Property Operations Platform

Transform the current project into a complete, cohesive, production-grade Property Operations web application across all 11 modules, with a refined global visual system (Liquid Glass + polished Light/Dark mode contrast + full interactivity + AI Copilot + search + quick actions).

## User Review Required

> [!IMPORTANT]
> **Dashboard Visual Language Locked**: The approved natural botanical landscape identity (`public/images/property-hero.png`), sky-blue + forest-green color palette, editorial serif typography, and Liquid Glass visual language remain intact and will be extended across all screens.
>
> **Light Mode Contrast Polish**: In Light Mode, localized translucent dark text backdrops will be applied behind hero headlines so typography remains crisp over natural photography without removing the background image.

---

## Proposed Changes

### Component & System Architecture

```
src/
├── types/
│   └── apartment.ts            # Expanded domain models (Invoices, Expenses, Contracts, Documents, Alerts)
├── data/
│   └── mockData.ts             # Comprehensive realistic domain dataset
├── components/
│   ├── Sidebar.tsx             # Quiet navigation bar with active module indicator
│   ├── Topbar.tsx              # Search bar, UTC clock, AI Copilot, Quick Action, Alerts dropdown, Theme switcher
│   ├── DashboardView.tsx       # Recomposed editorial overview (Hero, Telemetry, Chart, Action Queues)
│   ├── UnitDetailView.tsx      # Flagship residence inspection screen (PH-2401)
│   ├── UnitsView.tsx           # Searchable & filterable Apartment Directory
│   ├── TenantsView.tsx         # Resident Directory & Profile Cards
│   ├── ContractsView.tsx       # Lease Contract Lifecycle Manager
│   ├── PaymentsView.tsx        # Rent & Collections Financial Ledger
│   ├── BuildingsView.tsx       # Building Portfolio & Floor Elevation Matrix
│   ├── MaintenanceView.tsx     # Work Orders Kanban & Dispatch Hub
│   ├── ExpensesView.tsx        # Property Expense Ledger & Category Breakdown
│   ├── DocumentsView.tsx       # Document Library & Download Manager
│   ├── ReportsView.tsx         # Analytics Workspace & Financial Charts
│   ├── AlertsView.tsx          # Operational Alert Center
│   ├── AiCopilotDrawer.tsx     # Interactive AI Property Copilot
│   └── QuickActionModal.tsx    # State Mutation Forms (Payment, Tenant, Lease, Work Order)
└── index.css                   # Liquid Glass tokens & Dark/Light mode theme overrides
```

---

### Key Work Items Grouped by Phase

#### Phase 0: Global Design System & Light Mode Contrast Polish
- **File**: [index.css](file:///d:/AAA/src/index.css)
  - Refine `.liquid-glass` tokens for both Light and Dark modes.
  - Implement `.hero-gradient-mask` to guarantee high text contrast on the hero image in both Dark and Light modes.
  - Audit all text, inputs, cards, borders, badges, buttons, tables, dropdowns, and modals for high contrast.

#### Phase 1: Core Operational Modules
1. **Apartments / Units View**: [UnitsView.tsx](file:///d:/AAA/src/components/UnitsView.tsx)
   - Filterable directory by floor, status, type, and search query.
   - Direct inspection links to `PH-2401` signature view and unit detail modals.
2. **Tenants / Residents View**: [TenantsView.tsx](file:///d:/AAA/src/components/TenantsView.tsx)
   - Resident directory with reliability scores, contact actions, move-in/lease dates, and unit links.
3. **Lease Contracts View**: [ContractsView.tsx](file:///d:/AAA/src/components/ContractsView.tsx)
   - Active/expiring/expired lease tracking, deposit escrow status, and draft renewal CTAs.
4. **Rent & Collections View**: [PaymentsView.tsx](file:///d:/AAA/src/components/PaymentsView.tsx)
   - Invoicing overview, paid/pending/overdue filters, record payment modal trigger, and receipt generators.

#### Phase 2: Operations & Asset Facilities
5. **Buildings View**: [BuildingsView.tsx](file:///d:/AAA/src/components/BuildingsView.tsx)
   - Portfolio building overview with interactive floor plan elevation matrix (T24 to T1 floor unit grid).
6. **Work Orders View**: [MaintenanceView.tsx](file:///d:/AAA/src/components/MaintenanceView.tsx)
   - Kanban board (Open / In Progress / Resolved) and Table view toggle with status mutations and tech assignment.
7. **Property Expenses View**: [ExpensesView.tsx](file:///d:/AAA/src/components/ExpensesView.tsx)
   - Categorized expense logging, building/unit allocation, vendor ledger, and monthly expense summaries.

#### Phase 3: Intelligence, Documents & Reporting
8. **Documents Library View**: [DocumentsView.tsx](file:///d:/AAA/src/components/DocumentsView.tsx)
   - Document management (lease PDFs, IDs, receipts, building regulations) with search & download triggers.
9. **Analytics Reports View**: [ReportsView.tsx](file:///d:/AAA/src/components/ReportsView.tsx)
   - Revenue, occupancy, expense, and maintenance trend analytics with SVG visualization.
10. **Alerts Center View**: [AlertsView.tsx](file:///d:/AAA/src/components/AlertsView.tsx)
    - Alert center for overdue rent, expiring leases, urgent tickets, with read/unread toggles and deep links.
11. **Global Search, Quick Actions & AI Copilot**:
    - Wire Topbar search to query units, residents, contracts, and tickets.
    - Wire Quick Action modal forms to perform state updates (record payment, add ticket, etc.).
    - Expand AI Copilot to handle real domain data questions.

---

## Verification Plan

### Automated Tests
- Execute `npm run build` after completing each phase to ensure 0 TypeScript or bundling errors.

### Browser & Visual Verification
- Test navigation across all 11 modules in the browser.
- Verify Dark, Light, and System theme modes for each module.
- Confirm zero broken links or placeholder screens.
