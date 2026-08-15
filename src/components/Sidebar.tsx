import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Building, 
  DoorOpen, 
  Users, 
  FileText, 
  CreditCard, 
  Receipt, 
  Wrench, 
  FolderArchive, 
  BarChart3, 
  Bell, 
  Sparkles,
  ChevronDown,
  Home,
  Search,
  Bookmark,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isAdminView?: boolean;
  activeModule: string;
  setActiveModule: (module: string) => void;
  onOpenAiCopilot: () => void;
  selectedBuilding: string;
  setSelectedBuilding: (b: string) => void;
  savedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAdminView = false,
  activeModule,
  setActiveModule,
  onOpenAiCopilot,
  selectedBuilding,
  setSelectedBuilding,
  savedCount = 0
}) => {
  const [buildingDropdownOpen, setBuildingDropdownOpen] = useState(false);

  const userNavItems = [
    { id: 'user_home', label: 'HAVEN Home', icon: Home },
    { id: 'user_search', label: 'Explore & Search', icon: Search },
    { id: 'user_compare', label: `Saved & Compare (${savedCount})`, icon: Bookmark },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buildings', label: 'Buildings', icon: Building },
    { id: 'units', label: 'Apartments / Units', icon: DoorOpen },
    { id: 'tenants', label: 'Tenants / Residents', icon: Users },
    { id: 'contracts', label: 'Lease Contracts', icon: FileText },
    { id: 'payments', label: 'Rent & Collections', icon: CreditCard },
    { id: 'expenses', label: 'Property Expenses', icon: Receipt },
    { id: 'maintenance', label: 'Work Orders', icon: Wrench },
    { id: 'documents', label: 'Documents Library', icon: FolderArchive },
    { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  const buildingsList = [
    'Grand Tower Residence',
    'Aether Sky Villas & Suites',
    'Horizon Park Apartments',
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-white/[0.07] bg-[#0B0C0E] flex flex-col justify-between p-5 relative z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            {isAdminView ? (
              <Building2 className="w-4 h-4 text-slate-300" />
            ) : (
              <Compass className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <h1 className="text-sm font-serif font-bold text-white tracking-wider">
              {isAdminView ? 'PROPERTY OPS' : 'HAVEN'}
            </h1>
            <span className="text-[10px] font-mono-tech tracking-widest text-slate-400 uppercase block">
              {isAdminView ? 'OPERATIONS PLATFORM' : 'RESIDENTIAL SANCTUARY'}
            </span>
          </div>
        </div>

        {/* Building Selector for Admin Mode */}
        {isAdminView && (
          <div className="relative">
            <button
              onClick={() => setBuildingDropdownOpen(!buildingDropdownOpen)}
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 text-left transition-all flex items-center justify-between group"
            >
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-medium tracking-wider block">
                  Active Property
                </span>
                <span className="text-xs font-semibold text-white truncate block mt-0.5">
                  {selectedBuilding}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-300" />
            </button>

            {buildingDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl editorial-surface border border-white/15 shadow-2xl z-50 space-y-1 bg-[#0F1014]">
                {buildingsList.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBuilding(b);
                      setBuildingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedBuilding === b
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 px-3 block mb-2">
            {isAdminView ? 'ADMIN MANAGEMENT' : 'CONSUMER DISCOVERY'}
          </span>
          <nav className="space-y-0.5">
            {(isAdminView ? adminNavItems : userNavItems).map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Assistant Trigger */}
      <div className="pt-4 border-t border-white/[0.07] space-y-3">
        <button
          onClick={onOpenAiCopilot}
          className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              {isAdminView ? 'AI Copilot' : 'AI Housing Advisor'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {isAdminView ? 'Query operational metrics & work orders...' : 'Ask AI to parse needs & rank homes...'}
          </p>
        </button>
      </div>
    </aside>
  );
};
