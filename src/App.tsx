import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
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

export type ThemeMode = 'dark' | 'light' | 'system';

export function App() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Grand Tower Residence');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('PH-2401');
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);

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

  const handleInspectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setActiveModule('unit_detail');
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('property_ops_theme');
    setThemeMode('dark');
    setActiveModule('dashboard');
    setSelectedBuilding('Grand Tower Residence');
    setSelectedUnitId('PH-2401');
  };

  return (
    <div className="min-h-screen canvas-surface text-slate-200 flex relative selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden transition-colors duration-300">
      {/* Subtle Atmospheric Glowing Orbs */}
      <div className="ambient-glow-sky -top-32 -left-32" />
      <div className="ambient-glow-forest top-[600px] -right-40" />

      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
      />

      {/* Main Content Layout Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Topbar Header with Theme Switcher & Staging Indicator */}
        <Topbar
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          selectedBuilding={selectedBuilding}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          onResetDemoData={handleResetDemoData}
        />

        {/* Dynamic Module Body Container */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeModule === 'dashboard' && (
            <DashboardView
              selectedBuilding={selectedBuilding}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'buildings' && (
            <BuildingsView
              selectedBuilding={selectedBuilding}
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'units' && (
            <UnitsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'unit_detail' && (
            <UnitDetailView
              unitId={selectedUnitId}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
              onBackToDirectory={() => setActiveModule('units')}
            />
          )}

          {activeModule === 'tenants' && (
            <TenantsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'contracts' && (
            <ContractsView
              onSelectUnit={handleInspectUnit}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'payments' && (
            <PaymentsView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'expenses' && (
            <ExpensesView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'maintenance' && (
            <MaintenanceView
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'documents' && (
            <DocumentsView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeModule === 'notifications' && (
            <AlertsView
              onSelectUnit={handleInspectUnit}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}
        </main>
      </div>

      {/* AI Assistant Copilot Slide-Over Drawer */}
      <AiCopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </div>
  );
}

export default App;

