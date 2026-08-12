# APP ARCHITECTURE SPECIFICATION — APARTMENT MANAGEMENT SYSTEM

## 1. System Architecture Overview

The **Apartment Management System** is structured as a client-side web application powered by **React 19**, **TypeScript**, and **Vite**, with styling built on **Tailwind CSS v4** and modern design tokens.

```
D:\AAA\
├── PRODUCT_DESIGN.md            # Product Vision, Personas, Workflows & Module Specs
├── DESIGN_SYSTEM.md             # Visual Language, Typography & Motion Tokens
├── APP_ARCHITECTURE.md          # Data Models, Layout Hierarchy & State Architecture
├── index.html                   # HTML Entry Shell
├── vite.config.ts               # Vite Configuration
└── src/
    ├── types/                   # Domain TypeScript Models
    │   ├── building.ts
    │   ├── unit.ts
    │   ├── tenant.ts
    │   ├── contract.ts
    │   ├── finance.ts           # Invoice, Payment, Expense
    │   ├── maintenance.ts       # Work Orders
    │   ├── document.ts
    │   ├── notification.ts
    │   └── ai.ts                # AI Assistant Prompt & Query Types
    ├── data/                    # Seed Datasets for Property Management
    │   └── mockPropertyData.ts
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx    # Master Sidebar + Topbar Layout Container
    │   │   ├── Sidebar.tsx      # Navigation Links for 12 Modules
    │   │   └── Topbar.tsx       # Global Search, Building Switcher, AI Toggle
    │   ├── modules/
    │   │   ├── dashboard/       # Dashboard Metric Cards & Action Feed
    │   │   ├── buildings/       # Property Directory & Floor Grid
    │   │   ├── units/           # Unit Directory & Status Filtering
    │   │   ├── tenants/         # Resident List & Profile Drawer
    │   │   ├── contracts/       # Lease Agreement Forms & Expirations
    │   │   ├── finance/         # Rent Collection Ledger & Expenses
    │   │   ├── maintenance/     # Work Order Kanban & Issue Logs
    │   │   ├── documents/       # Document Library & File Upload Drawer
    │   │   ├── reports/         # Financial & Occupancy Analytics Reports
    │   │   └── notifications/   # System Alerts Feed
    │   ├── ai/
    │   │   └── AiCopilotPanel.tsx # AI Assistant Slide-Over Drawer
    │   └── ui/                  # Reusable Design System Primitives
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Modal.tsx
    │       ├── Badge.tsx
    │       └── Table.tsx
    ├── index.css                # Tailwind v4 Directives & Custom Utilities
    ├── App.tsx                  # Root Routing & State Provider Container
    └── main.tsx                 # React DOM Root Entry
```

---

## 2. Complete Domain Data Schema (TypeScript Interfaces)

```typescript
// Building Entity
export interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  totalUnits: number;
  managerName: string;
  imageUrl?: string;
  createdAt: string;
}

// Unit Status & Specs
export type UnitStatus = 'Occupied' | 'Vacant' | 'Under Maintenance' | 'Reserved';

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  floor: number;
  type: string; // e.g. "2-Bedroom Suite", "1-Bedroom Studio"
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  baseRentUSD: number;
  status: UnitStatus;
}

// Tenant Entity
export interface Tenant {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  idDocumentNumber: string;
  registeredOccupantsCount: number;
  createdAt: string;
}

// Lease Contract Entity
export type ContractStatus = 'Active' | 'Expiring Soon' | 'Terminated' | 'Pending Deposit';

export interface Contract {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRentUSD: number;
  depositUSD: number;
  paymentDueDay: number; // e.g., 5th of every month
  status: ContractStatus;
  pdfDocumentUrl?: string;
}

// Financial Invoice Entity
export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Partial';

export interface Invoice {
  id: string;
  contractId: string;
  unitId: string;
  tenantId: string;
  periodMonth: number;
  periodYear: number;
  amountDueUSD: number;
  amountPaidUSD: number;
  dueDate: string;
  status: InvoiceStatus;
}

// Financial Payment Log Entity
export interface Payment {
  id: string;
  invoiceId: string;
  amountUSD: number;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Check';
  transactionRef: string;
}

// Expense Entity
export type ExpenseCategory = 'Maintenance & Repair' | 'Utilities' | 'Janitorial' | 'Administrative' | 'Tax & Insurance';

export interface Expense {
  id: string;
  buildingId: string;
  unitId?: string;
  category: ExpenseCategory;
  amountUSD: number;
  vendorName: string;
  description: string;
  expenseDate: string;
  receiptFileUrl?: string;
}

// Work Order / Maintenance Entity
export type WorkOrderPriority = 'Urgent' | 'Medium' | 'Low';
export type WorkOrderStatus = 'Open' | 'In Progress' | 'Resolved';

export interface WorkOrder {
  id: string;
  unitId: string;
  tenantName: string;
  category: 'Plumbing' | 'HVAC' | 'Electrical' | 'Appliance' | 'Structural';
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedStaff?: string;
  costUSD?: number;
  reportedAt: string;
  resolvedAt?: string;
}

// Document Repository Entity
export interface PropertyDocument {
  id: string;
  title: string;
  category: 'Lease Contract' | 'Tenant ID' | 'Invoice Receipt' | 'Building Policy' | 'Inspection Report';
  relatedEntityType: 'Contract' | 'Tenant' | 'Building' | 'WorkOrder';
  entityId: string;
  fileName: string;
  fileSizeKb: number;
  fileUrl: string;
  uploadedAt: string;
}

// System Notification Entity
export interface SystemNotification {
  id: string;
  type: 'Payment Overdue' | 'Contract Expiry' | 'Maintenance Urgent' | 'System';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
```

---

## 3. Component Hierarchy & Layout Architecture

```
[AppLayout Container]
 ├── [Sidebar]
 │    ├── Logo & Brand Mark
 │    ├── Building Switcher Dropdown
 │    └── Module Nav Items (12 Items with Active Highlights)
 │
 ├── [Topbar Header]
 │    ├── Global Search Input (Searches Tenants, Units, Contracts)
 │    ├── AI Copilot Button (Opens Slide-Over Drawer)
 │    ├── Notifications Bell Indicator
 │    └── Admin Profile Avatar
 │
 └── [Main Content Area]
      ├── [Module Header] -> Title, Breadcrumb, Primary Action Button
      ├── [Filter Toolbar] -> Search, Status Pills, Date Range Picker
      └── [View Renderer]
           ├── Table / Grid List View
           ├── Metric Summary Cards
           └── Detail Drawer / Modal Overlay
```

---

## 4. AI Assistant Architecture & Data Querying Integration

The AI Assistant operates as a **Property Operations Copilot**:

```
[User Natural Language Input]
       │
       ▼
[AI Query Engine Parser]
  ├── Identifies Intent: (e.g., Query Overdue Rent, Draft Reminder, Expense Summary)
  ├── Extracts Parameters: (Building ID, Date Range, Status)
  └── Queries Local Property Data State (Invoices, Contracts, Tenants)
       │
       ▼
[Response Synthesizer]
  ├── Returns Formatted Data Summary Table / Metric Highlight
  └── Generates Action Trigger Button (e.g., "Send Overdue Email", "Export Report")
```

---

## 5. Implementation Roadmap (Post-Approval)

1. **Step 1: Data Models & Mock Dataset Expansion**
   - Populate realistic datasets for 2 Buildings, 24 Units, Tenants, Contracts, Invoices, Work Orders, and Expenses.
2. **Step 2: Core Layout Shell & Navigation**
   - Build `AppLayout`, `Sidebar`, and `Topbar` using Design System tokens.
3. **Step 3: Module Screen Implementation**
   - Build Dashboard, Buildings, Units, Tenants, Contracts, Rent & Payments, Expenses, Maintenance, Documents, Reports, Notifications.
4. **Step 4: AI Copilot Assistant Panel**
   - Implement slide-over AI assistant drawer with domain-specific property queries and notice drafting tools.
