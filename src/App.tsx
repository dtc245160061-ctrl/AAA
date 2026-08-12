import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { QuickActionModal } from './components/QuickActionModal';

export function App() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Grand Tower Residence');
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-200 flex relative selection:bg-white/20 selection:text-white overflow-x-hidden">
      {/* Subtle Atmospheric Glowing Orbs */}
      <div className="ambient-glow-gold -top-32 -left-32" />
      <div className="ambient-glow-cyan top-[600px] -right-40" />

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
        {/* Topbar Header */}
        <Topbar
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          selectedBuilding={selectedBuilding}
        />

        {/* Dashboard Visual Prototype Body */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeModule === 'dashboard' ? (
            <DashboardView
              selectedBuilding={selectedBuilding}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          ) : (
            <div className="editorial-surface p-12 rounded-3xl text-center border border-white/10 space-y-3">
              <span className="px-3 py-1 text-xs font-mono-tech bg-white/5 text-slate-300 border border-white/10 rounded-full">
                SPECIFICATION PROTOTYPE
              </span>
              <h2 className="text-2xl font-serif-editorial text-white">
                Module {activeModule.toUpperCase()} Architecture Defined
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                We are prioritizing the visual storytelling and editorial composition for the Dashboard view first.
              </p>
              <button
                onClick={() => setActiveModule('dashboard')}
                className="mt-4 px-5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all"
              >
                Return to Dashboard Overview
              </button>
            </div>
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
