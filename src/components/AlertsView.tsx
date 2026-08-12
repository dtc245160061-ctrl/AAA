import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface AlertsViewProps {
  onSelectUnit: (unitId: string) => void;
  onOpenAiCopilot?: () => void;
  onOpenQuickAction?: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  onSelectUnit,
}) => {
  const [alerts, setAlerts] = useState([
    { id: 'ALT-101', type: 'Overdue Rent', title: 'Unit SV-2002 rent payment is 12 days overdue ($8,750)', priority: 'Urgent', unitId: 'SV-2002', resident: 'Marcus Sterling', date: 'Today, 09:30', isRead: false },
    { id: 'ALT-102', type: 'Maintenance', title: 'Smart lock battery below 45% in Unit SV-2002', priority: 'Urgent', unitId: 'SV-2002', resident: 'Marcus Sterling', date: 'Today, 11:05', isRead: false },
    { id: 'ALT-103', type: 'Overdue Rent', title: 'Unit DL-0801 rent payment is 5 days overdue ($3,650)', priority: 'Medium', unitId: 'DL-0801', resident: 'Kenji Takahashi', date: 'Yesterday', isRead: true },
    { id: 'ALT-104', type: 'Lease Expiration', title: 'Lease for Unit SV-2001 (Sophia Chen) expires in 48 days', priority: 'Medium', unitId: 'SV-2001', resident: 'Sophia Chen', date: '2 days ago', isRead: true },
    { id: 'ALT-105', type: 'Document Audit', title: 'Annual elevator mechanical safety inspection report uploaded', priority: 'Low', unitId: 'Building', resident: 'Otis Elevator Co.', date: '3 days ago', isRead: true },
  ]);

  const toggleRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: !a.isRead } : a));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            REAL-TIME DISPATCH / OPERATIONAL ALERTS CENTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1 flex items-center gap-3">
            <span>System Alerts & Notices</span>
            {unreadCount > 0 && (
              <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 font-normal">
                {unreadCount} Unread
              </span>
            )}
          </h1>
        </div>

        <button
          onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))}
          className="px-4 py-2 text-xs font-mono-tech text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
        >
          Mark All as Read ✓
        </button>
      </div>

      {/* Alerts List (Liquid Glass) */}
      <div className="liquid-glass p-6 space-y-4">
        <div className="space-y-3 font-mono-tech text-xs">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`product-ui-card p-5 flex flex-wrap items-center justify-between gap-4 transition-all ${
                !a.isRead ? 'border-l-4 border-l-rose-500 bg-slate-900/90' : 'opacity-85'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-[280px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[9px] uppercase rounded ${
                    a.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {a.type}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">{a.date}</span>
                  {!a.isRead && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  )}
                </div>

                <p className="text-sm font-sans font-semibold text-white">{a.title}</p>
                <p className="text-slate-400 text-[11px]">Entity: <span className="text-slate-200">{a.resident} ({a.unitId})</span></p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {a.unitId !== 'Building' && (
                  <button
                    onClick={() => onSelectUnit(a.unitId)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 text-[11px] flex items-center gap-1"
                  >
                    <span>Inspect Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => toggleRead(a.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  {a.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
