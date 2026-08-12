import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Plus, Clock } from 'lucide-react';

interface TopbarProps {
  onOpenAiCopilot: () => void;
  onOpenQuickAction: () => void;
  selectedBuilding: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenAiCopilot,
  onOpenQuickAction,
  selectedBuilding,
}) => {
  const [time, setTime] = useState<string>('');

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

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0C0E]/90 backdrop-blur-md border-b border-white/[0.07] px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Building Context Breadcrumb & Live UTC Clock */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-tech text-slate-400">
              <span className="uppercase tracking-widest">PORTFOLIO ASSET</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                {time} UTC+7
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-serif-editorial mt-0.5">
              {selectedBuilding}
            </h2>
          </div>
        </div>

        {/* Right: Global Search, Quick Action, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search units, tenants, contracts (⌘K)..."
              className="w-64 pl-9 pr-4 py-1.5 text-xs bg-white/[0.03] border border-white/[0.07] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/20 transition-all font-mono-tech"
            />
          </div>

          {/* AI Copilot Quick Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.03] border border-white/[0.07] rounded-lg hover:bg-white/[0.07] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-white rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Action</span>
          </button>

          {/* Notification Bell */}
          <button className="p-2 text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.07] rounded-lg hover:bg-white/[0.07] transition-all relative">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full" />
          </button>

          {/* Profile */}
          <div className="pl-2 border-l border-white/[0.07]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin Profile"
              className="w-7 h-7 rounded-lg object-cover border border-white/10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
