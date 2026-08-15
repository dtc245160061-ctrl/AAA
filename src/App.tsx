import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { UserHomeView } from './components/UserHomeView';
import { UserSearchView } from './components/UserSearchView';
import { UserUnitDetailView } from './components/UserUnitDetailView';
import { UserCompareView } from './components/UserCompareView';
import { UserAiAdvisorDrawer } from './components/UserAiAdvisorDrawer';
import { DashboardView } from './components/DashboardView';
import { UnitDetailView } from './components/UnitDetailView';
import { UnitsView } from './components/UnitsView';
import { TenantsView } from './components/TenantsView';
import { ContractsView } from './components/ContractsView';
import { PaymentsView } from './components/PaymentsView';
import { BuildingsView } from './components/BuildingsView';
import { MaintenanceView } from './components/MaintenanceView';
import { ExpensesView } from './components/ExpensesView';
import { DocumentsView } from './components/DocumentsView';
import { ReportsView } from './components/ReportsView';
import { AlertsView } from './components/AlertsView';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { QuickActionModal } from './components/QuickActionModal';
import { DevPreviewLauncher } from './devtools/preview/DevPreviewLauncher';
import { MOCK_UNITS } from './data/mockData';
import type { ApartmentUnit } from './types/apartment';

export type ThemeMode = 'dark' | 'light' | 'system';

export function App() {
  // Read initial view from URL query parameter e.g. ?view=admin
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'admin';
  });

  const [activeModule, setActiveModule] = useState<string>(() => isAdminView ? 'dashboard' : 'user_home');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Grand Tower Residence');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('HN-TH-2401');
  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(['HN-TH-2401', 'SG-D1-1601']);
  const [initialAiQuery, setInitialAiQuery] = useState<string>('');
  
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isUserAiAdvisorOpen, setIsUserAiAdvisorOpen] = useState<boolean>(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);
  const [bookingUnit, setBookingUnit] = useState<ApartmentUnit | null>(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('property_ops_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('property_ops_theme', themeMode);

    const applyTheme = () => {
      let resolved: 'dark' | 'light' = 'dark';
      if (themeMode === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = themeMode;
      }
      document.documentElement.setAttribute('data-theme', resolved);
      if (resolved === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    };

    applyTheme();

    if (themeMode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [themeMode]);

  const handleToggleSaveUnit = (unitId: string) => {
    setSavedUnitIds(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleInspectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    if (!isAdminView) {
      setActiveModule('user_detail');
    } else {
      setActiveModule('unit_detail');
    }
  };

  const handleNavigateSearch = (aiQuery?: string) => {
    if (aiQuery) {
      setInitialAiQuery(aiQuery);
    }
    setActiveModule('user_search');
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('property_ops_theme');
    setThemeMode('dark');
    setActiveModule(isAdminView ? 'dashboard' : 'user_home');
    setSelectedBuilding('Grand Tower Residence');
    setSelectedUnitId('HN-TH-2401');
    setSavedUnitIds(['HN-TH-2401', 'SG-D1-1601']);
  };

  const currentUnit = MOCK_UNITS.find(u => u.id === selectedUnitId) || MOCK_UNITS[0];

  return (
    <div className="min-h-screen canvas-surface text-slate-200 flex relative selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden transition-colors duration-300">
      {/* Subtle Ambient Glows */}
      <div className="ambient-glow-sky -top-32 -left-32" />
      <div className="ambient-glow-forest top-[600px] -right-40" />

      {/* Sidebar Navigation */}
      <Sidebar
        isAdminView={isAdminView}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenAiCopilot={() => {
          if (!isAdminView) {
            setIsUserAiAdvisorOpen(true);
          } else {
            setIsAiCopilotOpen(true);
          }
        }}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
        savedCount={savedUnitIds.length}
      />

      {/* Main Content Layout Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Topbar Header */}
        <Topbar
          isAdminView={isAdminView}
          savedCount={savedUnitIds.length}
          onOpenSaved={() => {
            setIsAdminView(false);
            setActiveModule('user_compare');
          }}
          onOpenAiCopilot={() => {
            if (!isAdminView) {
              setIsUserAiAdvisorOpen(true);
            } else {
              setIsAiCopilotOpen(true);
            }
          }}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          selectedBuilding={selectedBuilding}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          onResetDemoData={handleResetDemoData}
        />

        {/* Dynamic View Body Container */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* USER MODE CONSUMER VIEWS */}
          {!isAdminView && activeModule === 'user_home' && (
            <UserHomeView
              units={MOCK_UNITS}
              savedUnitIds={savedUnitIds}
              onToggleSaveUnit={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              onNavigateSearch={handleNavigateSearch}
            />
          )}

          {!isAdminView && activeModule === 'user_search' && (
            <UserSearchView
              units={MOCK_UNITS}
              savedUnitIds={savedUnitIds}
              onToggleSaveUnit={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              initialAiQuery={initialAiQuery}
            />
          )}

          {!isAdminView && activeModule === 'user_detail' && (
            <UserUnitDetailView
              unit={currentUnit}
              isSaved={savedUnitIds.includes(currentUnit.id)}
              onToggleSaveUnit={handleToggleSaveUnit}
              onBackToDirectory={() => setActiveModule('user_search')}
              onOpenBookingModal={(u) => setBookingUnit(u)}
            />
          )}

          {!isAdminView && activeModule === 'user_compare' && (
            <UserCompareView
              units={MOCK_UNITS}
              savedUnitIds={savedUnitIds}
              onRemoveFromSaved={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              onBackToDirectory={() => setActiveModule('user_search')}
            />
          )}

          {/* ADMIN MODE OPERATIONAL VIEWS */}
          {isAdminView && activeModule === 'dashboard' && (
            <DashboardView
              selectedBuilding={selectedBuilding}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'buildings' && (
            <BuildingsView
              selectedBuilding={selectedBuilding}
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'units' && (
            <UnitsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'unit_detail' && (
            <UnitDetailView
              unitId={selectedUnitId}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
              onBackToDirectory={() => setActiveModule('units')}
            />
          )}

          {isAdminView && activeModule === 'tenants' && (
            <TenantsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'contracts' && (
            <ContractsView
              onSelectUnit={handleInspectUnit}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'payments' && (
            <PaymentsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'expenses' && (
            <ExpensesView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'maintenance' && (
            <MaintenanceView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'documents' && (
            <DocumentsView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'reports' && (
            <ReportsView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'notifications' && (
            <AlertsView
              onSelectUnit={handleInspectUnit}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Consumer AI Housing Advisor Drawer */}
      <UserAiAdvisorDrawer
        isOpen={isUserAiAdvisorOpen}
        onClose={() => setIsUserAiAdvisorOpen(false)}
        units={MOCK_UNITS}
        onApplyAiSearch={(queryText) => {
          setInitialAiQuery(queryText);
          setIsAdminView(false);
          setActiveModule('user_search');
        }}
      />

      {/* Admin AI Copilot Slide-Over Drawer */}
      <AiCopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Admin Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />

      {/* Consumer Booking / Rental Inquiry Modal */}
      {bookingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl liquid-glass border border-emerald-500/30 p-6 space-y-5 bg-slate-950 shadow-2xl">
            <h3 className="font-serif text-xl text-slate-100">Request Rental Inquiry</h3>
            <p className="text-xs font-mono text-emerald-400">
              {bookingUnit.name || bookingUnit.id} • {(bookingUnit.monthlyRentVND / 1000000).toFixed(0)}M VND/mo
            </p>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400">Full Name</label>
                <input type="text" placeholder="Your name" className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-slate-400">Phone Number / Zalo</label>
                <input type="text" placeholder="+84 ..." className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 mt-1" />
              </div>
              <div>
                <label className="text-slate-400">Target Move-in Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 mt-1" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookingUnit(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Rental request submitted for ${bookingUnit.name || bookingUnit.id}! HAVEN Leasing Advisor will contact you shortly.`);
                  setBookingUnit(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-semibold shadow-lg shadow-emerald-500/20"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISOLATED DEVELOPER PREVIEW SYSTEM */}
      <DevPreviewLauncher currentView={isAdminView ? 'admin' : 'user'} />
    </div>
  );
}

export default App;
