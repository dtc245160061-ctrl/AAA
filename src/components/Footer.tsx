import React from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

interface FooterProps {
  onNavigateToSearch?: (keyword?: string) => void;
  onOpenLifestyleModal?: () => void;
  onOpenVisualModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToSearch,
  onOpenLifestyleModal,
  onOpenVisualModal
}) => {
  return (
    <footer className="relative w-full mt-6 pt-4 pb-3 bg-transparent text-slate-400 border-t border-white/[0.08]">
      {/* Subtle Hairline Gradient Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 via-slate-600/30 to-transparent" />

      <div className="w-full px-1 sm:px-2 space-y-3">
        {/* Row 1: Brand & Horizontal Quick Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          {/* Brand Identity & Vision */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-slate-950 font-black font-serif text-xs shadow-sm shadow-emerald-500/20">
              H
            </div>
            <span className="font-serif font-black tracking-widest text-sm text-slate-100">
              HAVEN
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
              v2.5.2
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Nền tảng BĐS Trí tuệ Nhân tạo • 63 Tỉnh Thành
            </span>
          </div>

          {/* Streamlined Horizontal Navigation Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-sans text-slate-400">
            <button
              onClick={() => onNavigateToSearch?.('Japandi')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Japandi
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => onNavigateToSearch?.('Indochine')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Indochine
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => onNavigateToSearch?.('Penthouse')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Penthouse
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => onNavigateToSearch?.('Duplex')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Duplex
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onOpenVisualModal}
              className="inline-flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Visual Vibe Search</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onOpenLifestyleModal}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Khảo Sát Radar
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400/80" />
              <span>PCCC QCVN 06 & Escrow 72h</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400/80" />
              <span>Hotline 1900 6868</span>
            </span>
          </div>

        </div>

        {/* Row 2: Academic Credentials & Engine Status */}
        <div className="pt-2 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>Đồ án Chuyên ngành Ứng dụng Trí tuệ Nhân tạo</span>
            <span>•</span>
            <span className="text-emerald-400/90 font-bold">KHMT K23A</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Local Edge Engine: Hoạt động</span>
            </div>
            <span>•</span>
            <span>© 2026 HAVEN Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
