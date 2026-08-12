import React from 'react';
import type { MaintenanceTicket } from '../types/apartment';
import { Wrench, CheckCircle2, Clock, User } from 'lucide-react';

interface MaintenanceHubProps {
  tickets: MaintenanceTicket[];
  onResolveTicket: (id: string) => void;
}

export const MaintenanceHub: React.FC<MaintenanceHubProps> = ({ tickets, onResolveTicket }) => {
  return (
    <div className="space-y-6 text-left">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-['Cinzel']">
              Trung Tâm Bảo Trì IoT & Vé Yêu Cầu Cư Dân
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi sự cố tự động phát hiện bởi cảm biến IoT và yêu cầu trực tiếp từ cư dân.
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel-hover"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-amber-400">{tkt.id}</span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white rounded-full">
                  Căn Hộ {tkt.unitId}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    tkt.priority === 'Urgent'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : tkt.priority === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}
                >
                  {tkt.priority === 'Urgent' ? 'Gấp (Urgent)' : tkt.priority === 'Medium' ? 'Vừa' : 'Bình Thường'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{tkt.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Cư dân: {tkt.residentName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Thời gian: {tkt.reportedAt}
                </span>
                {tkt.assignedTechnician && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    KTV: {tkt.assignedTechnician}
                  </span>
                )}
              </div>
            </div>

            <div>
              {tkt.status === 'Resolved' ? (
                <span className="px-4 py-2 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Đã Hoàn Thành
                </span>
              ) : (
                <button
                  onClick={() => onResolveTicket(tkt.id)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Đánh Dấu Đã Sửa Xong
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
