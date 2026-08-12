import React, { useState, useEffect } from 'react';
import { Building2, Bell, Sparkles, Search } from 'lucide-react';

interface HeaderProps {
  onOpenGuideModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuideModal,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Live Indicator */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#07080B] rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#07080B] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-white font-['Cinzel']">
                AETHER
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                AWWWARDS UX EDITION
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Grand Tower Residence</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="font-mono text-emerald-400">{time} UTC+7</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
          {[
            { id: 'building', label: 'Tòa Nhà 3D' },
            { id: 'analytics', label: 'Doanh Thu' },
            { id: 'amenities', label: 'Tiện Ích Sky' },
            { id: 'maintenance', label: 'Bảo Trì IoT' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/25 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm căn hộ, cư dân, mã phòng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Bí Kíp Awwwards</span>
          </button>

          <button className="p-2 text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Manager"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
