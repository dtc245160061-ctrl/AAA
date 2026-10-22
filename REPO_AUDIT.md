# REPO AUDIT: HAVEN APARTMENT RENTAL & MANAGEMENT SYSTEM

**Audited Repository Path:** `d:\Workspace\Projects\AAA`  
**Audit Date:** 2026-10-15  
**Auditor Mode:** Read-only architectural inspection  

---

## 1. Tech Stack

* **Languages:**
  * **TypeScript** (`~6.0.2` in [package.json](file:///d:/Workspace/Projects/AAA/package.json#L31))
  * **JavaScript** (ES Modules, CommonJS utility/benchmark scripts in [scripts/benchmark_100_questions.cjs](file:///d:/Workspace/Projects/AAA/scripts/benchmark_100_questions.cjs#L1))
  * **C#** (.NET console desktop launcher in [launcher/Program.cs](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L7-L130))
  * **Python** (Dataset builders, image checkers, Jupyter notebooks in [scripts/](file:///d:/Workspace/Projects/AAA/scripts))
  * **HTML5 & CSS3** ([index.html](file:///d:/Workspace/Projects/AAA/index.html), [src/index.css](file:///d:/Workspace/Projects/AAA/src/index.css))
* **Frontend Framework & Libraries:**
  * **React:** `19.2.8` & **React DOM:** `19.2.8` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L19-L20))
  * **Bundler & Build Tool:** Vite `8.2.0` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L32), [vite.config.ts](file:///d:/Workspace/Projects/AAA/vite.config.ts#L1-L26))
  * **CSS Framework:** Tailwind CSS `4.3.3` with `@tailwindcss/vite` `4.3.3` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L16,L22))
  * **Animation & 3D:**
    * `framer-motion` `13.1.0` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L17))
    * `three` `0.185.1` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L23))
    * `@react-three/fiber` `9.7.0` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L15))
    * `@react-three/drei` `10.7.8` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L14))
    * `@react-spring/three` `10.1.2` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L13))
    * `shadergradient` `1.3.5` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L21))
  * **Icons:** `lucide-react` `1.31.0` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L18))
  * **Linter:** `oxlint` `1.75.0` ([package.json](file:///d:/Workspace/Projects/AAA/package.json#L30), [.oxlintrc.json](file:///d:/Workspace/Projects/AAA/.oxlintrc.json))
* **Backend Framework:**
  * **NOT FOUND**. There is no Express, NestJS, Fastify, Django, or FastAPI server. The app is a client-side Single Page Application (SPA).
* **Database:**
  * **Client-side In-Browser Storage:** `localStorage` managed via static class `ApartmentStore` ([src/data/apartmentStore.ts#L901-1777](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L901-L1777)).
  * **In-Memory Seed Data:** 1,700 pre-generated mock units in [src/data/mockData.ts](file:///d:/Workspace/Projects/AAA/src/data/mockData.ts).
  * **Relational/Document Server Database:** NOT FOUND. No SQL, MongoDB, or ORM migrations in runtime code.
* **Authentication Method:**
  * Client-side state managed in [src/components/AuthModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx) and [src/App.tsx#L158-195](file:///d:/Workspace/Projects/AAA/src/App.tsx#L158-L195).
  * Persisted in `localStorage` under key `haven_current_user`.
  * Pre-configured quick-login accounts: Admin (`zeecuchuoi@gmail.com`), Resident (`dtc245160061@ictu.edu.vn`).
  * Optional Supabase Auth integration endpoint (`POST /auth/v1/token?grant_type=password` to `https://esgzwwpvzdwsjkkeryeu.supabase.co`) in [src/components/AuthModal.tsx#L219-245](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx#L219-L245).
* **How to Run:**
  * Standard: `npm run dev` (starts Vite on `http://localhost:5173`, [package.json#L7](file:///d:/Workspace/Projects/AAA/package.json#L7)).
  * Production Build: `npm run build` (`tsc -b && vite build`, [package.json#L8](file:///d:/Workspace/Projects/AAA/package.json#L8)).
  * Node Launcher: `node launcher/serve.js` (starts Ollama daemon check and Vite dev server, [launcher/serve.js#L27-50](file:///d:/Workspace/Projects/AAA/launcher/serve.js#L27-L50)).
  * Windows Launcher: `launcher/Program.cs` (C# binary launching Ollama port 11434 and browser URL `http://localhost:5173/`, [launcher/Program.cs#L17-59](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L17-L59)).
  * Local Ollama SLM Setup: `scripts/setup_ollama_haven.bat` (executes `ollama create haven-ai -f Modelfile`, [scripts/setup_ollama_haven.bat#L18](file:///d:/Workspace/Projects/AAA/scripts/setup_ollama_haven.bat#L18)).

---

## 2. Folder Structure (Top 2 Levels)

```
d:\Workspace\Projects\AAA\
├── data/                                 # AI datasets, image manifests, visual CLIP embeddings, 1,700 mock units JSON
├── dist/                                 # Production build output
├── docs/                                 # Feature backlog, visual direction, legal notes, UX flows
│   └── academic/                         # University course deliverables (Project plan, SRS, QA requirements, audit)
├── launcher/                             # Application launcher scripts (.NET C# Program.cs, Node serve.js, icon)
├── node_modules/                         # NPM external dependencies (skipped)
├── public/                               # Static web assets (videos, avatar photos, favicon)
│   └── images/                           # Unit image assets
├── scripts/                              # Data generation, benchmark runner, CLIP/Qwen notebooks, Modelfile
├── src/                                  # Application source code
│   ├── assets/                           # Bundled media assets
│   ├── components/                       # UI components (views, modals, drawers, controls)
│   │   ├── common/                       # Shared utility components (SmartImage, HavenCursor)
│   │   ├── effects/                      # Experimental/imported visual templates (Square lens project)
│   │   ├── home/                         # Landing page sections (HeroSection, FeatureStrip, FeaturedProperties)
│   │   ├── layout/                       # Responsive shell containers (MobileNav)
│   │   └── ui/                           # Design primitives (Button, Card, Badge, ShaderCard, GlassCursor)
│   ├── data/                             # Client store (apartmentStore.ts), mock data, Matterport tours, embeddings
│   ├── devtools/                         # Developer tools & preview launcher
│   │   └── preview/                      # DevPreviewLauncher component
│   ├── hooks/                            # Custom React animation hooks (useScrollReveal, useFirstLoadReveal)
│   ├── services/                         # AI SLM/RAG services, safety guardrail, Web Speech voice recognition
│   ├── styles/                           # CSS design tokens, Wise theme, beam/border effects
│   └── types/                            # Domain TypeScript type definitions (apartment.ts)
├── video/                                # Video recordings and UI screen captures
└── Ứng dụng trí tuệ nhân tạo.../        # Academic Word submission documents (.docx)
```

* **Asset Folders Only:**
  * `public/` (Video files: `haven_bg_dark.mp4`, `haven_bg_light.mp4`; Images: `grand_tower_hero.png`, `avatar_*.jpg`, `property-hero.jpg`).
  * `public/images/` (Apartment visual assets).
  * `video/` (MP4 recordings: `Recording 2026-08-19 215435.mp4`, `linearity.mp4`, etc.).
  * `src/assets/` (Vite static assets).

---

## 3. Data Model

All models are defined in [src/types/apartment.ts](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts).

| Entity / Interface | Key Fields & Types | Relations | Free Text Fields | File Path |
| :--- | :--- | :--- | :--- | :--- |
| `ApartmentUnit` | `id` (string), `name` (string?), `floor` (number), `unitNumber` (string), `type` (UnitType), `sqm` (number), `bedrooms` (number), `bathrooms` (number), `status` (UnitStatus), `monthlyRentUSD` (number), `monthlyRentVND` (number), `city` (string), `district` (string), `address` (string?), `images` (string[]), `hasCarParking` (boolean), `hasMotorbikeParking` (boolean), `hasElevator` (boolean), `hasBackupPower` (boolean), `floodingRisk` ('Low'\|'Moderate'\|'High'), `noiseLevel` ('Quiet'\|'Moderate'\|'Busy'), `trafficDensity` ('Low'\|'Moderate'\|'Heavy'), `petFriendly` (boolean), `furnished` (boolean), `balcony` (boolean), `airConditioning` (boolean), `washingMachine` (boolean), `kitchen` (boolean), `wifi` (boolean), `rating` (number), `reviewCount` (number), `viewType` (string), `orientation` (string?), `isVerifiedPlus` (boolean?), `verificationLevel` (VerificationLevel) | Embedded: `aiInsights`, `environmentalData`, `sensors`, `resident`, `trueCost`, `pcccReport`, `landlord`, `depositTerms`, `coordinates` | `name`, `address`, `viewType` | [src/types/apartment.ts#L92-137](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L92-L137) |
| `AIInsights` | `whyFit` (string[]), `worthConsidering` (string[]) | Child of `ApartmentUnit` | `whyFit` (all items), `worthConsidering` (all items) | [src/types/apartment.ts#L35-38](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L35-L38) |
| `EnvironmentalData` | `weatherNotes` (string), `floodNotes` (string), `powerNotes` (string), `trafficNotes` (string) | Child of `ApartmentUnit` | `weatherNotes`, `floodNotes`, `powerNotes`, `trafficNotes` | [src/types/apartment.ts#L28-33](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L28-L33) |
| `Resident` | `id` (string), `name` (string), `avatar` (string), `phone` (string), `email` (string), `nationality` ('Vietnamese'\|'Foreigner'?), `moveInDate` (string), `leaseEnd` (string), `monthlyRentUSD` (number), `monthlyRentVND` (number), `autoPayActive` (boolean), `occupantsCount` (number) | Child of `ApartmentUnit` | `name` | [src/types/apartment.ts#L4-17](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L4-L17) |
| `IoTSensors` | `smartLockBattery` (number), `hvacStatus` ('Optimal'\|'Cooling'\|'Heating'\|'Standby'), `targetTempC` (number), `energyConsumptionKwh` (number), `waterUsageLiters` (number), `securityAlarmDisarmed` (boolean) | Child of `ApartmentUnit` | None | [src/types/apartment.ts#L19-26](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L19-L26) |
| `TrueCostBreakdown` | `baseRentVND` (number), `estimatedElectricityVND` (number), `waterFeeVND` (number), `internetFeeVND` (number), `managementFeeVND` (number), `parkingFeeVND` (number), `totalMonthlyEstimatedVND` (number), `depositMonths` (number), `depositVND` (number), `moveInTotalRequiredVND` (number), `electricityRatePerKwh` (number?) | Child of `ApartmentUnit` | None | [src/types/apartment.ts#L42-54](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L42-L54) |
| `PcccSafetyReport` | `hasFireEscapes` (boolean), `fireEscapeCount` (number), `hasAutomaticSprinklers` (boolean), `hasSmokeDetectors` (boolean), `hasFireExtinguishers` (boolean), `inspectionCertificateStatus` ('certified'\|'pending_renewal'\|'unverified'), `lastInspectionDate` (string?), `emergencyExitWidthMeters` (number?), `disclaimer` (string) | Child of `ApartmentUnit` | `disclaimer` | [src/types/apartment.ts#L56-66](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L56-L66) |
| `LandlordProfile` | `id` (string), `name` (string), `avatar` (string), `phone` (string), `verificationLevel` (VerificationLevel), `trustScore` (number), `reviewCount` (number), `responseRatePercent` (number), `averageResponseMinutes` (number), `activeListingsCount` (number), `joinedDate` (string), `isSuperHost` (boolean?), `badges` (string[]) | Child of `ApartmentUnit` | `name`, `joinedDate`, `badges` (items) | [src/types/apartment.ts#L68-82](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L68-L82) |
| `DepositTerms` | `months` (number), `amountVND` (number), `refundTimelineDays` (number), `deductionRules` (string[]), `depositProtectionActive` (boolean) | Child of `ApartmentUnit` | `deductionRules` (items) | [src/types/apartment.ts#L84-90](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L84-L90) |
| `RentalLead` | `id` (string), `customerName` (string), `phone` (string), `email` (string?), `unitId` (string), `unitName` (string), `unitPriceVND` (number), `desiredMoveInDate` (string), `viewingDate` (string?), `notes` (string?), `createdAt` (string), `status` (LeadStatus: 'new'\|'contacted'\|'viewing_scheduled'\|'approved'\|'rejected'\|'converted') | Foreign Key: `unitId` -> `ApartmentUnit.id` | `customerName`, `unitName`, `notes` | [src/types/apartment.ts#L141-154](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L141-L154) |
| `LeaseContract` | `id` (string), `contractNumber` (string), `unitId` (string), `unitName` (string), `tenantName` (string), `tenantPhone` (string), `tenantIdCard` (string), `startDate` (string), `endDate` (string), `monthlyRentVND` (number), `depositVND` (number), `paymentCycleMonths` (number), `status` (ContractStatus: 'active'\|'expiring_soon'\|'pending_signature'\|'terminated'), `termsSummary` (string), `createdAt` (string), `platformCommissionVND` (number?) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `unitName`, `tenantName`, `termsSummary` | [src/types/apartment.ts#L158-175](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L158-L175) |
| `RentalInvoice` | `id` (string), `invoiceCode` (string), `unitId` (string), `unitName` (string), `tenantName` (string), `monthYear` (string), `rentAmountVND` (number), `serviceFeeVND` (number), `electricityWaterVND` (number), `totalAmountVND` (number), `dueDate` (string), `paidDate` (string?), `status` (InvoiceStatus: 'paid'\|'pending'\|'overdue'), `platformTakeRateVND` (number?) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `unitName`, `tenantName` | [src/types/apartment.ts#L179-194](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L179-L194) |
| `MaintenanceTicket` | `id` (string), `unitId` (string), `title` (string), `description` (string?), `status` ('Open'\|'In Progress'\|'Resolved'), `priority` ('Low'\|'Medium'\|'High'\|'Emergency'\|'Urgent'), `createdAt` (string?), `reportedAt` (string?), `category` (string), `residentName` (string?), `assignedTechnician` (string?) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `title`, `description`, `category`, `residentName`, `assignedTechnician` | [src/types/apartment.ts#L207-219](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L207-L219) |
| `ChatMessage` | `id` (string), `conversationId` (string), `sender` ('user'\|'landlord'\|'bot'), `senderName` (string), `text` (string), `timestamp` (string), `isQuickReply` (boolean?) | Foreign Key: `conversationId` -> `ChatConversation.id` | `senderName`, `text` | [src/types/apartment.ts#L225-233](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L225-L233) |
| `ChatConversation` | `id` (string), `unitId` (string), `unitName` (string), `customerName` (string), `customerPhone` (string), `lastMessage` (string), `lastTimestamp` (string), `unreadCount` (number), `status` ('active'\|'archived'), `messages` (ChatMessage[]) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `unitName`, `customerName`, `lastMessage` | [src/types/apartment.ts#L235-246](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L235-L246) |
| `SubscriptionPlan` | `id` (SubscriptionTier), `targetAudience` ('landlord'\|'tenant'), `name` (string), `tagline` (string), `priceVND` (number), `billingCycle` ('monthly'\|'yearly'), `features` (string[]), `isPopular` (boolean?), `badge` (string?) | Standalone Reference Matrix | `name`, `tagline`, `badge`, `features` (items) | [src/types/apartment.ts#L250-260](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L250-L260) |
| `AddonService` | `id` (string), `title` (string), `category` ('cleaning'\|'moving'\|'smart_home'\|'insurance'), `description` (string), `priceVND` (number), `unitLabel` (string), `duration` (string?), `iconName` (string), `popular` (boolean?) | Referenced by `ServiceOrder.serviceId` | `title`, `description`, `unitLabel`, `duration` | [src/types/apartment.ts#L262-272](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L262-L272) |
| `ServiceOrder` | `id` (string), `serviceId` (string), `serviceTitle` (string), `customerName` (string), `customerPhone` (string), `unitId` (string), `scheduledDate` (string), `priceVND` (number), `status` ('pending'\|'confirmed'\|'completed'\|'cancelled'), `createdAt` (string) | Foreign Keys: `serviceId` -> `AddonService.id`, `unitId` -> `ApartmentUnit.id` | `serviceTitle`, `customerName` | [src/types/apartment.ts#L274-285](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L274-L285) |
| `LegalDocumentItem` | `id` (string), `title` (string), `category` ('contract'\|'deposit_escrow'\|'pccc_cert'\|'handover_report'\|'ownership_doc'), `unitId` (string), `unitName` (string), `fileSizeKb` (number), `uploadedAt` (string), `verified` (boolean), `hashSignature` (string), `downloadUrl` (string?) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `title`, `unitName` | [src/types/apartment.ts#L328-339](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L328-L339) |
| `MarketplaceModerationItem` | `id` (string), `unitId` (string), `unitName` (string), `landlordName` (string), `landlordPhone` (string), `submittedAt` (string), `status` ('pending'\|'approved'\|'flagged'\|'rejected'), `flagReason` (string?), `priceAnomalyPercent` (number?), `duplicateScorePercent` (number?), `autoCheckResult` ({ photoAuthenticityScore, priceWithinRange, noSpamKeywords, pcccDocAttached }) | Foreign Key: `unitId` -> `ApartmentUnit.id` | `unitName`, `landlordName`, `flagReason` | [src/types/apartment.ts#L341-358](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L341-L358) |
| `MarketplaceHealthKPIs` | `verifiedListingsPercent` (number), `averageApprovalHours` (number), `weeklyReportsTrendPercent` (number), `depositDisputeResolutionPercent` (number), `totalActiveListings` (number), `totalVerifiedLandlords` (number), `revenueByStream` ({ saasPercent, commissionPercent, vasPercent, escrowPercent }) | Aggregated Stats Model | None | [src/types/apartment.ts#L360-373](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L360-L373) |
| `NeighborhoodProfile` | `id` (string), `name` (string), `city` (string), `district` (string), `averageRentVND` (number), `priceTrendPercent` (number), `securityScore` (number), `floodRiskLevel` ('Low'\|'Medium'\|'High'), `lifestyleTags` (string[]), `schoolsCount` (number), `hospitalsCount` (number), `metroDistanceKm` (number?), `description` (string), `coverImage` (string), `highlights` (string[]) | Standalone Reference Catalog | `name`, `description`, `highlights` (items) | [src/types/apartment.ts#L291-307](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L291-L307) |
| `CommuteDestination` | `id` (string), `name` (string), `city` ('Hanoi'\|'Ho Chi Minh City'\|'Da Nang'), `address` (string), `category` ('office'\|'university'\|'airport'\|'landmark') | Standalone Reference Catalog | `name`, `address` | [src/types/apartment.ts#L309-315](file:///d:/Workspace/Projects/AAA/src/types/apartment.ts#L309-L315) |

---

## 4. Roles and Permissions

* **Role Definition:**
  * Two active roles: **User (Consumer / Tenant)** and **Admin (Property Manager / Platform Operator)**.
  * Role assignment is checked in [src/components/AuthModal.tsx#L70-98](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx#L70-L98) and set in `localStorage.haven_current_user`.
  * Email `zeecuchuoi@gmail.com` or role containing `'admin'` defaults to `isAdminView = true` ([src/App.tsx#L175-177](file:///d:/Workspace/Projects/AAA/src/App.tsx#L175-L177)).
  * Email `dtc245160061@ictu.edu.vn` or others default to `isAdminView = false` ([src/App.tsx#L179](file:///d:/Workspace/Projects/AAA/src/App.tsx#L179)).

* **Permission Matrix:**

| Feature / Action | User (Consumer) | Admin (Property Manager) | Enforced In (File & Line) |
| :--- | :---: | :---: | :--- |
| Browse & search units | Yes | Yes | [src/App.tsx#L518-540](file:///d:/Workspace/Projects/AAA/src/App.tsx#L518-L540) |
| View unit details, True Cost, PCCC | Yes | Yes | [src/App.tsx#L543-565](file:///d:/Workspace/Projects/AAA/src/App.tsx#L543-L565) |
| Submit rental lead / booking request | Yes | Yes | [src/App.tsx#L331-357, L791-875](file:///d:/Workspace/Projects/AAA/src/App.tsx#L331-L357) |
| Save units to comparison list & Radar chart | Yes | No (User view only) | [src/App.tsx#L578-591](file:///d:/Workspace/Projects/AAA/src/App.tsx#L578-L591) |
| Access Move-in 15-item handover checklist | Yes | No (User view only) | [src/App.tsx#L593-600](file:///d:/Workspace/Projects/AAA/src/App.tsx#L593-L600) |
| Order resident services (cleaning, moving, lock) | Yes | Yes (Manages ledger) | [src/App.tsx#L610-615, L708-713](file:///d:/Workspace/Projects/AAA/src/App.tsx#L610-L615) |
| Query Housing Advisor AI Drawer | Yes | No (Opens Copilot instead) | [src/App.tsx#L718-735](file:///d:/Workspace/Projects/AAA/src/App.tsx#L718-L735) |
| View Executive Operations Dashboard | No | Yes | [src/App.tsx#L625-635](file:///d:/Workspace/Projects/AAA/src/App.tsx#L625-L635) |
| Update unit status (`vacant`, `occupied`, etc.) | No | Yes | [src/App.tsx#L414-419](file:///d:/Workspace/Projects/AAA/src/App.tsx#L414-L419), [src/data/apartmentStore.ts#L963](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L963) |
| Add new unit via AI Smart Listing Creator | No | Yes | [src/App.tsx#L923-988](file:///d:/Workspace/Projects/AAA/src/App.tsx#L923-L988) |
| Edit & delete units | No | Yes | [src/App.tsx#L314-328](file:///d:/Workspace/Projects/AAA/src/App.tsx#L314-L328), [src/data/apartmentStore.ts#L967, L988](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L967) |
| Update Lead status (`contacted`, `converted`) | No | Yes | [src/App.tsx#L360-364](file:///d:/Workspace/Projects/AAA/src/App.tsx#L360-L364), [src/data/apartmentStore.ts#L1039](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1039) |
| Convert Lead / Chat to Contract | No | Yes | [src/App.tsx#L367-396](file:///d:/Workspace/Projects/AAA/src/App.tsx#L367-L396) |
| Create & activate lease contract | No | Yes | [src/App.tsx#L399-405](file:///d:/Workspace/Projects/AAA/src/App.tsx#L399-L405), [src/data/apartmentStore.ts#L1063](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1063) |
| Mark invoice as paid (5% take-rate calculation) | No | Yes | [src/App.tsx#L407-411](file:///d:/Workspace/Projects/AAA/src/App.tsx#L407-L411), [src/data/apartmentStore.ts#L1095](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1095) |
| Marketplace moderation (Approve / Flag listings) | No | Yes | [src/components/MarketplaceHealthView.tsx#L32-46](file:///d:/Workspace/Projects/AAA/src/components/MarketplaceHealthView.tsx#L32-L46) |
| Access Admin Operations Copilot Drawer | No | Yes | [src/App.tsx#L757-762](file:///d:/Workspace/Projects/AAA/src/App.tsx#L757-L762) |
| Query landlord private phone/bank/revenue via AI | Blocked by Guardrail | Allowed | [src/services/enterpriseSafetyGuardrail.ts#L140-153](file:///d:/Workspace/Projects/AAA/src/services/enterpriseSafetyGuardrail.ts#L140-L153) |
| Query financial knowledge chunks via RAG | Blocked in RAG retriever | Allowed | [src/services/geminiRagService.ts#L404-406](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L404-L406) |

* **Where Enforced:**
  * **Frontend UI Level:** Enforced conditionally by `isAdminView` state in [src/App.tsx#L518-714](file:///d:/Workspace/Projects/AAA/src/App.tsx#L518-L714).
  * **UI Switcher:** [src/components/Topbar.tsx#L493-497](file:///d:/Workspace/Projects/AAA/src/components/Topbar.tsx) provides a toggle between User and Admin modes.
  * **AI Service Level:** Enforced by `roleMode: 'consumer' | 'admin'` passed into [src/services/localAiService.ts#L337](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L337) and [src/services/geminiRagService.ts#L384](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L384).
  * **Backend Level:** NOT FOUND (no backend to validate tokens or permissions).

---

## 5. API / Routes

### Internal Backend Endpoints
* **NOT FOUND**: The project does NOT have a custom backend API server (no routes like `/api/apartments`, `/api/contracts`, etc.).

### Reverse Proxy Routes (Vite Dev Server)
* Configured in [vite.config.ts#L17-23](file:///d:/Workspace/Projects/AAA/vite.config.ts#L17-L23):
  * **Method:** `ANY`
  * **Path:** `/ollama/*`
  * **Target:** `http://127.0.0.1:11434/*`
  * **Purpose:** Proxies local inference requests from browser to local Ollama daemon to bypass CORS restrictions.
  * **Role:** Internal client service.

### Client-Side SPA Hash Routes
Enforced via `window.location.hash` and `activeModule` state in [src/App.tsx#L59-110](file:///d:/Workspace/Projects/AAA/src/App.tsx#L59-L110):

| Hash Route | Active Module | View Component | Role Allowed | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `#/user_home` | `user_home` | [src/components/UserHomeView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserHomeView.tsx) | User | Consumer homepage, hero highlights, curated collections |
| `#/user_search` | `user_search` | [src/components/UserSearchView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserSearchView.tsx) | User | Directory of 1,700 units with multi-facet filters |
| `#/user_detail` | `user_detail` | [src/components/UserUnitDetailView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserUnitDetailView.tsx) | User | Single unit details, True Cost, PCCC safety, landlord profile |
| `#/user_neighborhoods` | `user_neighborhoods` | [src/components/NeighborhoodGuideView.tsx](file:///d:/Workspace/Projects/AAA/src/components/NeighborhoodGuideView.tsx) | User | District-level guides, flood risks, infrastructure |
| `#/user_compare` | `user_compare` | [src/components/UserCompareView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserCompareView.tsx) | User | Side-by-side unit comparison with 5-axis Radar chart |
| `#/user_checklist` | `user_checklist` | [src/components/MoveInChecklistView.tsx](file:///d:/Workspace/Projects/AAA/src/components/MoveInChecklistView.tsx) | User | 15-item digital handover inspection checklist |
| `#/user_documents` | `user_documents` | [src/components/DocumentVaultView.tsx](file:///d:/Workspace/Projects/AAA/src/components/DocumentVaultView.tsx) | User | Legal documents & certificates vault (consumer view) |
| `#/user_services` | `user_services` | [src/components/ServicesMarketplaceView.tsx](file:///d:/Workspace/Projects/AAA/src/components/ServicesMarketplaceView.tsx) | User | VAS services marketplace (cleaning, moving, locks) |
| `#/user_subscriptions` | `user_subscriptions` | [src/components/SubscriptionsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/SubscriptionsView.tsx) | User | Resident Prime Club membership tiers |
| `#/dashboard` | `dashboard` | [src/components/DashboardView.tsx](file:///d:/Workspace/Projects/AAA/src/components/DashboardView.tsx) | Admin | Operational KPIs, revenue, overdue debt, occupancy |
| `#/units` | `units` | [src/components/UnitsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UnitsView.tsx) | Admin | Unit inventory management, status flipping, CRUD |
| `#/leads` | `leads` | [src/components/LeadsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/LeadsView.tsx) | Admin | Booking lead pipeline, status updates, 1-click conversion |
| `#/inbox` | `inbox` | [src/components/AdminInboxView.tsx](file:///d:/Workspace/Projects/AAA/src/components/AdminInboxView.tsx) | Admin | Chat messages from tenants/leads, 1-click contract creation |
| `#/contracts` | `contracts` | [src/components/ContractsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/ContractsView.tsx) | Admin | Lease contract ledger, expiration alerts, new contract form |
| `#/billing` | `billing` | [src/components/PaymentsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/PaymentsView.tsx) | Admin | Rental invoice ledger, overdue debt, mark paid (5% fee) |
| `#/admin_health` | `admin_health` | [src/components/MarketplaceHealthView.tsx](file:///d:/Workspace/Projects/AAA/src/components/MarketplaceHealthView.tsx) | Admin | Marketplace governance, auto-check, moderation queue |
| `#/admin_documents` | `admin_documents` | [src/components/DocumentVaultView.tsx](file:///d:/Workspace/Projects/AAA/src/components/DocumentVaultView.tsx) | Admin | Legal document vault (admin view) |
| `#/subscriptions` | `subscriptions` | [src/components/SubscriptionsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/SubscriptionsView.tsx) | Admin | SaaS subscription plans management |
| `#/services` | `services` | [src/components/ServicesMarketplaceView.tsx](file:///d:/Workspace/Projects/AAA/src/components/ServicesMarketplaceView.tsx) | Admin | Resident service order management |

### External Third-Party APIs Called Directly from Browser
* `GET /api/tags` on `http://127.0.0.1:11434` or `/ollama` ([src/services/localAiService.ts#L40](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L40)) - Fetch local models.
* `POST /api/chat` on `http://127.0.0.1:11434` or `/ollama` ([src/services/localAiService.ts#L361](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L361)) - Local SLM inference.
* `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` ([src/services/geminiRagService.ts#L780](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L780)) - Google Gemini API.
* `POST https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent` ([src/services/geminiRagService.ts#L218](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L218)) - Google Embedding API.
* `POST https://api.groq.com/openai/v1/chat/completions` ([src/services/geminiRagService.ts#L830](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L830)) - Groq Llama 3.3 70B API.
* `POST https://esgzwwpvzdwsjkkeryeu.supabase.co/auth/v1/token` ([src/components/AuthModal.tsx#L219](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx#L219)) - Supabase Auth API.

---

## 6. Main User Flows and Admin Flows

### Consumer Flows (User Side)

| Screen / Modal | Triggered By / Action Performed | Component File |
| :--- | :--- | :--- |
| **Homepage** | Route `#/user_home`. Browse hero property, category strips, featured cards. Opens lifestyle matchmaker, visual vibe search, or navigates to search. | [src/components/UserHomeView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserHomeView.tsx) |
| **Search Directory** | Route `#/user_search`. Multi-facet filtering (city, district, price slider, bedrooms, parking, pets, flood risk). Triggers unit detail or virtual tour. | [src/components/UserSearchView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserSearchView.tsx) |
| **Unit Detail View** | Route `#/user_detail`. Inspects 15+ unit attributes, True Cost calculator, PCCC certification badge, IoT live sensor metrics, landlord card. Launches booking modal, chat modal, commute simulator, virtual tour, escrow modal. | [src/components/UserUnitDetailView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserUnitDetailView.tsx) |
| **Unit Comparison** | Route `#/user_compare`. Compares up to 3 saved units side-by-side with 5-axis Radar chart and detailed cost differential table. | [src/components/UserCompareView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserCompareView.tsx) |
| **Booking Modal** | Click "Đặt Lịch Xem Phòng" on unit detail. Submits name, phone, move-in date, viewing appointment, and free-text notes into `RentalLead` store. | [src/App.tsx#L791-875](file:///d:/Workspace/Projects/AAA/src/App.tsx#L791-L875) |
| **Shopee Chat Modal** | Click "Chat Trực Tiếp" on unit detail. In-app messaging with auto-bot greeting and quick question chips (availability, deposit terms, parking). | [src/components/ChatModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/ChatModal.tsx) |
| **AI Housing Advisor** | Floating Sparkles FAB or Topbar button. Opens resizable drawer with text/voice query to search 1,700 units, explain True Cost, or negotiate prices. | [src/components/UserAiAdvisorDrawer.tsx](file:///d:/Workspace/Projects/AAA/src/components/UserAiAdvisorDrawer.tsx) |
| **Visual Vibe Matcher** | Click "Visual Search" / camera icon. Searches apartments by uploading photo or choosing aesthetic presets (Japandi, Indochine, Luxury Penthouse) using 512-D CLIP embeddings. | [src/components/VisualVibeModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/VisualVibeModal.tsx) |
| **Commute Simulator** | Click "Mô Phỏng Đi Làm" on unit detail. Selects landmark/office in Hanoi/HCMC/Da Nang; calculates peak vs normal travel times by motorbike/car/bus. | [src/components/CommuteSimulatorModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/CommuteSimulatorModal.tsx) |
| **Virtual Tour 3D** | Click "Tour 360" on search card or unit detail. Embeds interactive Matterport 3D digital twins photogrammetry scan. | [src/components/VirtualTourModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/VirtualTourModal.tsx) |
| **Deposit Escrow Flow** | Click "Ký Quỹ Escrow" on unit detail. 4-step escrow deposit walkthrough with BIDV escrow account simulation. | [src/components/DepositEscrowModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/DepositEscrowModal.tsx) |
| **Move-In Checklist** | Route `#/user_checklist`. 15-item inspection form with photo upload and meter reading capture for move-in/move-out. | [src/components/MoveInChecklistView.tsx](file:///d:/Workspace/Projects/AAA/src/components/MoveInChecklistView.tsx) |
| **Auth Modal** | Click "Đăng Nhập" on topbar. Fast 1-click accounts, email/phone + password, OTP simulation, mock social logins (Google, Zalo, Apple, FB). | [src/components/AuthModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx) |

### Admin Flows (Management Side)

| Screen / Modal | Triggered By / Action Performed | Component File |
| :--- | :--- | :--- |
| **Admin Dashboard** | Route `#/dashboard`. Displays high-level KPIs: occupancy (94.2%), revenue, active contracts, overdue rent count, pending leads feed, quick action links. | [src/components/DashboardView.tsx](file:///d:/Workspace/Projects/AAA/src/components/DashboardView.tsx) |
| **Units Management** | Route `#/units`. Displays unit directory; updates status (`vacant`, `occupied`, `reserved`, `maintenance`); edits unit parameters; deletes units. Launches Smart Listing modal. | [src/components/UnitsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UnitsView.tsx) |
| **Leads Pipeline** | Route `#/leads`. Displays booking leads submitted by consumers; updates status (`new`, `contacted`, `viewing_scheduled`, `rejected`); 1-click converts lead to contract form. | [src/components/LeadsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/LeadsView.tsx) |
| **Admin Inbox** | Route `#/inbox`. 2-column Shopee-style conversation center. Displays unread messages, sends replies/canned responses, 1-click converts conversation into contract. | [src/components/AdminInboxView.tsx](file:///d:/Workspace/Projects/AAA/src/components/AdminInboxView.tsx) |
| **Contracts Ledger** | Route `#/contracts`. Lists active, expiring, and terminated contracts. Fills lease contract form (auto-prefilled if converted from lead/chat), signs, and activates. | [src/components/ContractsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/ContractsView.tsx) |
| **Billing Ledger** | Route `#/billing`. Displays monthly rental invoices with rent, electric/water, and service fee breakdowns. Clicks "Xác nhận thu tiền" to mark paid and compute 5% take-rate. | [src/components/PaymentsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/PaymentsView.tsx) |
| **Marketplace Health** | Route `#/admin_health`. Governance dashboard displaying verification %, dispute resolution %, and Moderation Queue. Admin approves or flags suspect listings. | [src/components/MarketplaceHealthView.tsx](file:///d:/Workspace/Projects/AAA/src/components/MarketplaceHealthView.tsx) |
| **Smart Listing Modal** | Click "Đăng Tin Bằng AI" on Units view. Admin enters rough title and rent; AI generates title, description, and adds unit to inventory. | [src/components/SmartListingCreatorModal.tsx](file:///d:/Workspace/Projects/AAA/src/components/SmartListingCreatorModal.tsx) |
| **Admin AI Copilot** | Click AI icon in Admin mode. Slide-over drawer querying overdue rent, expiring leases in 60 days, and IoT maintenance logs via local SLM. | [src/components/AiCopilotDrawer.tsx](file:///d:/Workspace/Projects/AAA/src/components/AiCopilotDrawer.tsx) |

---

## 7. Existing AI/Chatbot Code

### Model Name and Size
* **Local SLM (Ollama):**
  * `qwen2.5:7b`, `qwen2.5-coder:7b`, `qwen:7b`, `haven-ai`, `qwen2.5:3b`, `qwen2.5:latest` ([src/services/localAiService.ts#L19-28](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L19-L28)).
  * `qwen2.5:1.5b` (Benchmark tested model in [scripts/benchmark_100_questions.cjs#L15](file:///d:/Workspace/Projects/AAA/scripts/benchmark_100_questions.cjs#L15)).
  * `haven-qwen-0.5b-q4_k_m.gguf` (~350MB, fine-tuned from `unsloth/Qwen2.5-0.5B-Instruct-bnb-4bit` using QLoRA in [scripts/train_haven_local_qwen.ipynb](file:///d:/Workspace/Projects/AAA/scripts/train_haven_local_qwen.ipynb), configured in [scripts/Modelfile#L1](file:///d:/Workspace/Projects/AAA/scripts/Modelfile#L1)).
* **Cloud Fallback LLMs:**
  * Google Gemini: `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite` ([src/services/geminiRagService.ts#L41-44](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L41-L44)).
  * Groq Cloud: `llama-3.3-70b-versatile` ([src/services/geminiRagService.ts#L107, L837](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L107)).
* **Embedding Models:**
  * Google: `text-embedding-004` ([src/services/geminiRagService.ts#L45](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L45)).
  * Fallback Hash Embedding: 64-dimensional custom heuristic vector generator ([src/services/geminiRagService.ts#L242-268](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L242-L268)).
  * Vision Embedding: OpenAI CLIP `openai/clip-vit-base-patch32` (512-D vectors in [02_train_haven_visual_clip.ipynb#L97](file:///d:/Workspace/Projects/AAA/02_train_haven_visual_clip.ipynb#L97), [src/data/visualEmbeddings.ts#L1-2](file:///d:/Workspace/Projects/AAA/src/data/visualEmbeddings.ts#L1-L2)).

### How It Is Served & Endpoints
* **Served via:**
  * Local Ollama server running as background process on `http://127.0.0.1:11434`.
  * Auto-started by [launcher/serve.js#L11-25](file:///d:/Workspace/Projects/AAA/launcher/serve.js#L11-L25) or [launcher/Program.cs#L80-105](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L80-L105).
  * Proxy endpoint in browser: `/ollama` (mapped via [vite.config.ts#L17-23](file:///d:/Workspace/Projects/AAA/vite.config.ts#L17-L23)).
  * Direct Ollama endpoints: `http://localhost:11434/api/tags` and `http://127.0.0.1:11434/api/chat`.
  * Google Gemini endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`.
  * Groq Cloud endpoint: `https://api.groq.com/openai/v1/chat/completions`.

### System Prompts (Exact Quotes)

#### 1. Ollama Modelfile System Prompt ([scripts/Modelfile#L15](file:///d:/Workspace/Projects/AAA/scripts/Modelfile#L15))
```
Bạn là HAVEN AI - Trợ lý Trí tuệ Nhân tạo Độc quyền của Nền tảng PropTech HAVEN (Sanctuary Living), chuyên tư vấn không gian sống, căn hộ cho thuê cao cấp, pháp lý và lối sống tại Việt Nam.
```

#### 2. Local AI Admin System Prompt ([src/services/localAiService.ts#L218-254](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L218-L254))
```
Bạn là HAVEN AI Copilot - Trợ lý Trí tuệ Vận hành & Quản trị Bất động sản cấp cao chạy cục bộ 100% (Local Qwen 7B SLM).
Định danh & Bản chất: Bạn là mô hình AI mã nguồn mở Qwen 7B chạy cục bộ trên máy tính qua Ollama Engine. Toàn bộ dữ liệu được bảo mật trên máy chủ nội bộ.
Nhiệm vụ: Hỗ trợ ban quản trị và chủ nhà giám sát 1,700 căn hộ, thu tiền thuê quá hạn, soạn hợp đồng điện tử E-Sign, tạo tin đăng căn hộ mới, cảm biến IoT và quy chuẩn an toàn PCCC QCVN 06.
Phong cách trả lời: Chuyên nghiệp, súc tích, đưa ra con số chính xác và khuyến nghị hành động dứt khoát.

=== TRI THỨC VẬN HÀNH THỜI GIAN THỰC ===
${contextSnippet}

=== CÔNG CỤ TỰ ĐỘNG HÓA HÀNH ĐỘNG (AGENTIC TOOLS) ===
Khi cần thực hiện hành động, HÃY KÈM THEO một khối JSON ở cuối câu trả lời theo các mẫu sau:

1. Soạn hợp đồng điện tử:
```json
{
  "action": "draft_contract",
  "unitId": "HN-TÂ-1001",
  "tenantName": "Nguyễn Văn A",
  "monthlyRentVND": 15000000,
  "depositMonths": 1,
  "startDate": "2026-10-15"
}
```

2. Điền form tạo tin đăng căn hộ mới:
```json
{
  "action": "fill_listing",
  "title": "Căn hộ 2PN view hồ Tây",
  "city": "Hà Nội",
  "district": "Tây Hồ",
  "bedrooms": 2,
  "monthlyRentVND": 18000000,
  "hasCarParking": true
}
```
```

#### 3. Local AI Consumer System Prompt ([src/services/localAiService.ts#L256-327](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L256-L327))
```
Bạn là HAVEN AI — Trợ lý Không Gian Sống Thông Minh chạy cục bộ 100% trên mô hình Qwen 7B (Local SLM qua Ollama).

=== ĐỊNH DANH & NGUYÊN TẮC HOẠT ĐỘNG (QUAN TRỌNG) ===
1. Bản chất & Quyền riêng tư: Bạn chạy hoàn toàn trên phần cứng thiết bị của người dùng (Edge SLM qua Ollama), bảo vệ 100% dữ liệu riêng tư, KHÔNG gửi dữ liệu ra máy chủ đám mây bên ngoài.
2. Giới hạn Dữ liệu Thời gian thực & Internet:
   - Bạn KHÔNG có kết nối internet thời gian thực để tra cứu: giá vàng hôm nay, giá xăng dầu hiện tại, tỷ giá ngoại tệ, chứng khoán, tin tức báo chí sự kiện trong ngày, hay thời tiết trực tiếp theo giờ.
   - Khi người dùng hỏi các thông tin này (ví dụ: "giá vàng bao nhiêu", "giá xăng hôm nay", "thời tiết Thái Nguyên bây giờ ra sao"):
     Hãy trình bày thẳng thắn, trung thực và lịch sự: Nêu rõ bạn là AI chạy cục bộ 100% offline trên máy tính người dùng nên không có kết nối internet thời gian thực để cập nhật thông tin này, nói lời xin lỗi chân thành vì không thể cung cấp dữ liệu tức thời đó. Sau đó, gợi ý sẵn sàng hỗ trợ các vấn đề về bất động sản, căn hộ, chi phí sống, pháp lý hoặc các kiến thức tổng quát khác.
3. Trí tuệ tổng quát đa năng: 
   - Bạn là mô hình trí tuệ nhân tạo độc lập, am hiểu sâu rộng về mọi lĩnh vực: văn hóa, lịch sử, đời sống, nông nghiệp, khoa học công nghệ, toán học và ngôn ngữ.
   - Người dùng hỏi bất kỳ câu hỏi nào, bạn phải trả lời đúng trọng tâm câu hỏi đó, phân tích logic, khách quan, súc tích và chân thực dựa trên tri thức của bạn.
   - Khi câu hỏi có nhiều ý/nhiều vế: Bóc tách và trả lời đầy đủ từng vế theo thứ tự rõ ràng, không được bỏ sót bất kỳ vế nào.
   - Nếu hỏi "bây giờ là mấy giờ": Trả lời giờ hiện tại ngắn gọn, kèm 1 câu hỏi lịch sự: "Bạn có cần tôi hỗ trợ gì thêm không?". Tuyệt đối không nhồi nhét danh sách căn hộ hay mời chào dài dòng!
   - Nếu người dùng hỏi các câu hỏi đời sống (như "tối nay ăn gì", cách trang trí nội thất, phong thủy, mẹo dọn nhà): Hãy trả lời phong phú, sáng tạo, ấm áp. ĐỪNG nhồi nhét căn hộ nếu người dùng không hỏi tìm phòng!
   - Nếu người dùng hỏi "đứng sau bạn là model gì", "bạn là ai": Giải thích rõ bạn là HAVEN AI vận hành trên mô hình cục bộ qua Ollama Engine chạy ngay trên máy tính của người dùng (port 11434). Kèm 3 bước để thầy cô/hội đồng chấm kiểm chứng model chạy thật trên máy:
     + Bước 1: Mở Task Manager (Ctrl+Shift+Esc) tìm tiến trình 'ollama.exe' đang chiếm ~2.5GB RAM và mở cổng 11434.
     + Bước 2: Mở Terminal/PowerShell gõ lệnh: ollama ps để thấy model đang nạp.
     + Bước 3: Ngắt hoàn toàn mạng Wi-Fi/Internet, AI vẫn phản hồi bình thường 100% offline.
4. Chuyên môn Bất Động Sản HAVEN:
   - Bảo chứng cọc Escrow (HAVEN Escrow Shield): Tiền cọc được khóa an toàn, chỉ giải ngân cho chủ nhà khi bàn giao nghiệm thu.
   - True Cost: Bóc tách minh bạch tiền thuê gốc + điện nước + phí dịch vụ/gửi xe.
   - PCCC QCVN 06: Kiểm định an toàn chống khói, lối thoát hiểm áp suất dương.
   - Đàm phán giá & Trả giá (BẮT BUỘC): Khi người dùng yêu cầu lập chiến lược đàm phán, thương lượng hoặc trả giá giảm tiền thuê cho căn hộ cụ thể (ví dụ: 'Lập chiến lược đàm phán giảm giá thuê cho căn UNIT-7434...'):
     + BẮT BUỘC phân tích chuyên sâu và đưa ra chiến thuật thực tế: Mức giá mục tiêu tối ưu (biên độ giảm 5% – 10%), 3 đòn bẩy đàm phán sắc bén (cam kết hợp đồng 12 – 24 tháng, đóng tiền trước 3 – 6 tháng, xin miễn phí đỗ xe ô tô hoặc phí quản lý tòa nhà), và kịch bản nhắn tin/gọi điện mẫu lịch sự, chắc chắn.
     + TUYỆT ĐỐI KHÔNG dùng câu chào chung chung hay đi gợi ý tìm căn hộ khác.
     + Kèm khối JSON action "negotiate_price" ở cuối câu trả lời.

=== DỮ LIỆU CĂN HỘ THAM KHẢO TRONG HỆ THỐNG ===
${contextSnippet}

=== CÔNG CỤ TỰ ĐỘNG HÓA HÀNH ĐỘNG (AGENTIC TOOLS) ===
CHỈ KÈM THEO khối JSON ở cuối câu trả lời KHI NGƯỜI DÙNG THỰC SỰ CÓ NHU CẦU tìm kiếm/lọc phòng, đàm phán giá, ký hợp đồng hoặc xem chi phí:

1. Tìm kiếm và Lọc căn hộ:
```json
{
  "action": "apply_filters",
  "city": "Thái Nguyên hoặc Hà Nội hoặc TP.HCM...",
  "maxRentVND": 8000000,
  "bedrooms": 2,
  "hasCarParking": true
}
```

2. Đàm phán giá cả:
```json
{
  "action": "negotiate_price",
  "unitId": "TN-0001",
  "currentRent": 6500000,
  "targetRent": 6000000,
  "strategy": "Đề xuất đóng trước 6 tháng để giảm giá thuê"
}
```

3. Đặt lịch xem phòng:
```json
{
  "action": "schedule_viewing",
  "unitId": "TN-0001",
  "preferredTime": "15:00 Thứ Bảy"
}
```

4. Tính toán chi phí thực tế (True Cost):
```json
{
  "action": "calculate_true_cost",
  "unitId": "TN-0001"
}
```
Nếu chỉ là câu hỏi đời sống, trò chuyện hoặc hỏi thời tiết/model, TUYỆT ĐỐI KHÔNG sinh khối JSON.
```

### Tools / Actions It Can Perform
* `apply_filters`: Updates search filters on `UserSearchView` (`city`, `district`, `maxRentVND`, `bedrooms`, `hasCarParking`).
* `negotiate_price`: Generates negotiation counter-offers and discount strategies.
* `schedule_viewing`: Opens booking modal for a specific unit.
* `calculate_true_cost`: Triggers true-cost calculator.
* `draft_contract`: Populates contract form in Admin view with tenant details and pricing.
* `fill_listing`: Populates new listing modal in Admin view.

### Context / History Handling
* Chat drawers pass the last 4 conversation turns: `history.slice(-4)` in [src/services/localAiService.ts#L354](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L354) and [src/services/geminiRagService.ts#L757](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L757).
* Auto-scrolling is restricted to the chat message container: `messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight` in [src/components/UserAiAdvisorDrawer.tsx#L253-258](file:///d:/Workspace/Projects/AAA/src/components/UserAiAdvisorDrawer.tsx#L253-L258).

### Known Limitations Visible in Code
* Local Ollama calls have a 120s timeout ([src/services/localAiService.ts#L359](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L359)); on timeout, the system falls back to regex-based static text generation (`generateNaturalResponse`).
* [src/services/geminiRagService.ts#L903-950](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L903-L950) defines `askLocalSlm`, which is a static regex mock with an 80ms `setTimeout`, distinct from `askHavenLocalSlm` in `localAiService.ts` which executes real Ollama fetch calls.
* Visual similarity search runs on pre-computed static feature vectors (`src/data/visualEmbeddings.ts`). Dynamic in-browser embedding extraction for user-uploaded arbitrary photos is not supported without a backend CLIP service.

---

## 8. Available Data for AI

| Data Type | Location / Source | Count / Estimated Volume | Key Fields & Content |
| :--- | :--- | :--- | :--- |
| **Apartment Units Seed Data** | [src/data/mockData.ts](file:///d:/Workspace/Projects/AAA/src/data/mockData.ts), [data/mock_units_1700.json](file:///d:/Workspace/Projects/AAA/data/mock_units_1700.json) | 1,700 records (~8.0 MB) | ID, name, city, district, rent, bedrooms, PCCC report, true cost, IoT sensor metrics, environmental notes |
| **Q&A Instruction Dataset** | [data/01_haven_qa_dataset.jsonl](file:///d:/Workspace/Projects/AAA/data/01_haven_qa_dataset.jsonl) | 2,507 samples (~2.65 MB) | Synthetic user queries and assistant responses for fine-tuning Qwen SLM |
| **Visual Architecture Manifest** | [data/02_haven_image_manifest_818.json](file:///d:/Workspace/Projects/AAA/data/02_haven_image_manifest_818.json) | 818 photos (~1.16 MB) | Image URL, style tag, city, linked unit ID |
| **Visual Feature Vectors (CLIP)** | [src/data/visualEmbeddings.ts](file:///d:/Workspace/Projects/AAA/src/data/visualEmbeddings.ts), [data/haven_visual_embeddings_clip.json](file:///d:/Workspace/Projects/AAA/data/haven_visual_embeddings_clip.json) | 712 unique image vectors (~1.32 MB) | 512-dimensional normalized vectors from OpenAI CLIP ViT-B/32 |
| **3D Matterport Tours** | [src/data/matterportTours.ts](file:///d:/Workspace/Projects/AAA/src/data/matterportTours.ts) | 50+ tour records (28 KB) | Matterport model ID, title, bedroom count, embed URL |
| **Urban Neighborhood Profiles** | [src/data/apartmentStore.ts#L1336-1631](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1336-L1631) | 12 profiles | Name, district, city, average rent, safety score, flood risk, description |
| **Commute Destinations** | [src/data/apartmentStore.ts#L1634-1651](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1634-L1651) | 10 destinations | Hanoi and HCMC offices, universities, airports, landmarks |
| **Legal Document Seed Vault** | [src/data/apartmentStore.ts#L1263-1319](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1263-L1319) | 4 documents | E-signed contract, escrow deposit receipt, PCCC certificate, 15-item handover report |
| **Listing Moderation Queue** | [src/data/apartmentStore.ts#L1671-1731](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L1671-L1731) | 3 records | Unit name, landlord name, flag reason, price anomaly %, photo authenticity score |
| **Benchmark Question Suite** | [scripts/benchmark_100_questions.cjs](file:///d:/Workspace/Projects/AAA/scripts/benchmark_100_questions.cjs), [BENCHMARK_100_RESULTS.md](file:///d:/Workspace/Projects/AAA/BENCHMARK_100_RESULTS.md) | 100 questions | 6 categories: search, climate/PCCC, escrow/legal, true cost, out-of-scope, edge dialogue |
| **Course Documentation** | `docs/academic/*.md`, `Ứng dụng trí tuệ.../*.docx` | 7 documents (~200 KB) | Project Plan, Requirements Specification (SRS), 20 QA questions |

---

## 9. Manual or Repetitive Work Visible in the Code

* **Lead Status Progression:** Admin must manually review incoming leads in [src/components/LeadsView.tsx#L85-115](file:///d:/Workspace/Projects/AAA/src/components/LeadsView.tsx#L85-L115) and click buttons to advance status (`new` -> `contacted` -> `viewing_scheduled` -> `converted` / `rejected`).
* **Contract Entry & Signing:** Admin must manually verify tenant ID card, start/end dates, monthly rent, and deposit in [src/components/ContractsView.tsx#L140-210](file:///d:/Workspace/Projects/AAA/src/components/ContractsView.tsx#L140-L210) before activating a contract.
* **Invoice Payment Confirmation:** In [src/components/PaymentsView.tsx#L120-155](file:///d:/Workspace/Projects/AAA/src/components/PaymentsView.tsx#L120-L155), admin must manually click "Xác nhận thu tiền" for each rent payment.
* **Payment Reminders:** Overdue rent notices are not dispatched automatically via cron/SMS; they require manual action or copying AI-drafted notices ([src/components/AiCopilotDrawer.tsx#L136-145](file:///d:/Workspace/Projects/AAA/src/components/AiCopilotDrawer.tsx#L136-L145)).
* **Listing Moderation & Flagging:** Suspect listings in [src/components/MarketplaceHealthView.tsx#L32-46](file:///d:/Workspace/Projects/AAA/src/components/MarketplaceHealthView.tsx#L32-L46) require an admin to manually click "Phê duyệt" or "Gắn cờ cảnh báo" after inspecting automated checks.
* **Unit Status Lifecycle:** Units must be manually toggled to `under_maintenance` or `vacant` via [src/components/UnitsView.tsx](file:///d:/Workspace/Projects/AAA/src/components/UnitsView.tsx).
* **Document Verification:** Verification of uploaded contracts and certificates in [src/components/DocumentVaultView.tsx](file:///d:/Workspace/Projects/AAA/src/components/DocumentVaultView.tsx) requires manual inspection.

---

## 10. Config and Environment

### Environment Variables
Referenced in [.env.example](file:///d:/Workspace/Projects/AAA/.env.example) and [src/services/geminiRagService.ts](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts):

* `VITE_GEMINI_API_KEY`: Primary Google Gemini API key ([.env.example#L3](file:///d:/Workspace/Projects/AAA/.env.example#L3)).
* `VITE_GEMINI_API_KEYS`: Comma-separated pool of Gemini keys for rotation ([.env.example#L4](file:///d:/Workspace/Projects/AAA/.env.example#L4)).
* `GEMINI_API_KEY`: Fallback environment variable name ([.env.example#L5](file:///d:/Workspace/Projects/AAA/.env.example#L5)).
* `VITE_GROQ_API_KEY`: Groq API key for Llama 3.3 70B ([.env.example#L8](file:///d:/Workspace/Projects/AAA/.env.example#L8)).
* `GROQ_API_KEY`: Fallback Groq environment variable name ([.env.example#L9](file:///d:/Workspace/Projects/AAA/.env.example#L9)).
* `VITE_SUPABASE_URL`: Supabase project URL (hardcoded default `'https://esgzwwpvzdwsjkkeryeu.supabase.co'` in [src/components/AuthModal.tsx#L66](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx#L66)).
* `VITE_SUPABASE_ANON_KEY`: Supabase anon key (hardcoded default `'sb_publishable_rM3Noo8PgnXEByo9SOZ4Dw_vbqk8SW6'` in [src/components/AuthModal.tsx#L67](file:///d:/Workspace/Projects/AAA/src/components/AuthModal.tsx#L67)).

### Network Ports
* `5173`: Vite Web Application dev server ([vite.config.ts#L13](file:///d:/Workspace/Projects/AAA/vite.config.ts#L13), [launcher/serve.js#L34](file:///d:/Workspace/Projects/AAA/launcher/serve.js#L34), [launcher/Program.cs#L11](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L11)).
* `11434`: Local Ollama inference server ([launcher/Program.cs#L12](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L12), [vite.config.ts#L19](file:///d:/Workspace/Projects/AAA/vite.config.ts#L19), [src/services/localAiService.ts#L13-17](file:///d:/Workspace/Projects/AAA/src/services/localAiService.ts#L13-L17)).

### Dependencies for Running Local Models
* **Ollama Desktop:** Required for Windows local execution. Must be installed and reachable via `ollama` CLI or at `%LOCALAPPDATA%\Programs\Ollama\ollama.exe` ([launcher/Program.cs#L83](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L83)).
* **CORS Environment Flag:** Ollama must run with `OLLAMA_ORIGINS=*` ([launcher/serve.js#L20](file:///d:/Workspace/Projects/AAA/launcher/serve.js#L20), [launcher/Program.cs#L98](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L98)).
* **Model Artifacts:** Either public models (`qwen2.5:7b`, `qwen2.5:1.5b`) pulled via Ollama or custom GGUF model referenced in [scripts/Modelfile#L1](file:///d:/Workspace/Projects/AAA/scripts/Modelfile#L1) (`haven-qwen-0.5b-q4_k_m.gguf`).
* **Node.js:** Required for `launcher/serve.js` and Vite ([launcher/Program.cs#L109](file:///d:/Workspace/Projects/AAA/launcher/Program.cs#L109)).

---

## 11. Tests and Quality

### What Exists
* **Linter:** Oxlint configuration in [.oxlintrc.json](file:///d:/Workspace/Projects/AAA/.oxlintrc.json) checking React hooks and component export rules. Executable via `npm run lint`.
* **TypeScript Compilation:** Verification via `tsc -b && vite build` in [package.json#L8](file:///d:/Workspace/Projects/AAA/package.json#L8).
* **Automated Question Benchmark Suite:** [scripts/benchmark_100_questions.cjs](file:///d:/Workspace/Projects/AAA/scripts/benchmark_100_questions.cjs) tests 100 queries against local Ollama `qwen2.5:1.5b`, validating latency, tokens/sec, and JSON tool calling accuracy. Results stored in [BENCHMARK_100_RESULTS.md](file:///d:/Workspace/Projects/AAA/BENCHMARK_100_RESULTS.md) and [scripts/benchmark_100_results.json](file:///d:/Workspace/Projects/AAA/scripts/benchmark_100_results.json).
* **Image & URL Verifiers:** [scripts/check_images.js](file:///d:/Workspace/Projects/AAA/scripts/check_images.js), [scripts/check_images.py](file:///d:/Workspace/Projects/AAA/scripts/check_images.py), and [scripts/test_all_818_urls.py](file:///d:/Workspace/Projects/AAA/scripts/test_all_818_urls.py).

### What Is Missing
* **Unit Tests:** NOT FOUND. There is no test runner installed (no Vitest, Jest, Mocha). Zero component or service unit tests.
* **E2E / Integration Tests:** NOT FOUND. No Playwright, Cypress, or Puppeteer tests.
* **Data Validation Schemas:** NOT FOUND. No runtime schema validation (e.g. Zod) for `localStorage` parsed payloads or API responses.
* **CI/CD Pipeline:** NOT FOUND. No `.github/workflows` directory for automated pull request checks or test verification.

---

## 12. Open Questions

1. **Backend & Persistent Database:** The application currently relies entirely on browser `localStorage` and a static 1,700-unit mock array (`src/data/mockData.ts`). When is a production relational database (e.g., PostgreSQL / Prisma) and server API planned to be introduced?
2. **Authentication Security Model:** `AuthModal.tsx` simulates login with hardcoded credentials (`zeecuchuoi@gmail.com`, `dtc245160061@ictu.edu.vn`) and accepts any password in fallback mode. What is the production authentication roadmap, and how will sessions be secured without server-side validation?
3. **Hardcoded API Keys in Client Bundle:** [src/services/geminiRagService.ts#L57-67](file:///d:/Workspace/Projects/AAA/src/services/geminiRagService.ts#L57-L67) includes a pool of 9 base64-encoded Gemini API keys and an assembled Groq key in client-side code. When will LLM requests be migrated to a backend proxy to prevent API key extraction?
4. **Local SLM Distribution:** [scripts/Modelfile#L1](file:///d:/Workspace/Projects/AAA/scripts/Modelfile#L1) points to an absolute path on Google Drive (`G:\My Drive\COLAB\...`). How will the local model be packaged or downloaded for end users who do not have this file path or Ollama installed?
5. **Browser Storage Quota Constraints:** [src/data/apartmentStore.ts#L905-908](file:///d:/Workspace/Projects/AAA/src/data/apartmentStore.ts#L905-L908) explicitly removes legacy unit keys because they exceeded the browser's 5MB `localStorage` quota. How will growing transaction histories (leases, invoices, chat conversations) be stored once user activity exceeds browser storage limits?
