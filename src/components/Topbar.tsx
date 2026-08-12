import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Plus, Clock, Moon, Sun, Monitor, RotateCcw } from 'lucide-react';
import type { ThemeMode } from '../App';

interface TopbarProps {
  onOpenAiCopilot: () => void;
  onOpenQuickAction: () => void;
  selectedBuilding: string;
  themeMode?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  onResetDemoData?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenAiCopilot,
  onOpenQuickAction,
  selectedBuilding,
  themeMode = 'dark',
  onThemeChange,
  onResetDemoData,
}) => {
  const [time, setTime] = useState<string>('');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const [resetToast, setResetToast] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemo = () => {
    onResetDemoData?.();
    setThemeDropdownOpen(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Dark Mode', icon: Moon },
    { mode: 'light', label: 'Light Mode', icon: Sun },
    { mode: 'system', label: 'System Theme', icon: Monitor },
  ];

  const CurrentThemeIcon = themeMode === 'light' ? Sun : themeMode === 'system' ? Monitor : Moon;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0D12]/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-3.5 transition-colors duration-300">
      {resetToast && (
        <div className="absolute top-16 right-8 z-50 bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl font-mono-tech text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Demo state reset to initial baseline!</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left: Building Context Breadcrumb & Live UTC Clock + STAGING / DEMO Indicator */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-tech text-slate-400">
              <span className="uppercase tracking-widest text-slate-300">PORTFOLIO ASSET</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                {time} UTC+7
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold tracking-wider uppercase">
                STAGING / DEMO
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-serif-editorial mt-0.5">
              {selectedBuilding}
            </h2>
          </div>
        </div>

        {/* Right: Global Search, Quick Action, Notifications, Theme Control, Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search units, tenants, contracts (⌘K)..."
              className="w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-all font-mono-tech"
            />
          </div>

          {/* AI Copilot Quick Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/80 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Action</span>
          </button>

          {/* Theme & Demo Switcher Control */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title={`Theme: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}`}
              className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center relative group"
            >
              <CurrentThemeIcon className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Theme Dropdown Menu */}
            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-xl liquid-glass border border-slate-700/80 shadow-2xl z-50 space-y-1 bg-[#0A0D12]">
                <span className="text-[9px] font-mono-tech uppercase text-slate-400 px-2 py-1 block">
                  APPEARANCE THEME
                </span>
                {themeOptions.map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onThemeChange?.(mode);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                      themeMode === mode
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{label}</span>
                    </div>
                    {themeMode === mode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}

                <div className="pt-1.5 border-t border-slate-800">
                  <span className="text-[9px] font-mono-tech uppercase text-slate-400 px-2 py-1 block">
                    DEMO ENVIRONMENT
                  </span>
                  <button
                    onClick={handleResetDemo}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono-tech text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 transition-all text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-all relative">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full" />
          </button>

          {/* Profile */}
          <div className="pl-2 border-l border-slate-800/80">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin Profile"
              className="w-7 h-7 rounded-lg object-cover border border-slate-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

