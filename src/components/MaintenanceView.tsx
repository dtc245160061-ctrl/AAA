import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  Grid, 
  List, 
  Plus
} from 'lucide-react';
import { MOCK_TICKETS } from '../data/mockData';
import type { MaintenanceTicket } from '../types/apartment';

interface MaintenanceViewProps {
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  onSelectUnit,
  onOpenQuickAction,
}) => {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_TICKETS);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.residentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            OPERATIONS & DISPATCH / WORK ORDERS HUB
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Maintenance Work Orders
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Work Order</span>
        </button>
      </div>

      {/* Filter & View Mode Bar (Liquid Glass) */}
      <div className="liquid-glass p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search work orders by ticket ID, unit, title, or resident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>

        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all flex items-center gap-1.5 ${viewMode === 'kanban' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table List</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Open', 'In Progress', 'Resolved'] as const).map((statusGroup) => {
            const groupTickets = filteredTickets.filter((t) => t.status === statusGroup);
            return (
              <div key={statusGroup} className="liquid-glass p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tech uppercase font-bold text-white tracking-wider">
                      {statusGroup}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded-full bg-slate-800 text-slate-300">
                      {groupTickets.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {groupTickets.map((t) => (
                    <div key={t.id} className="product-ui-card p-4 space-y-3 font-mono-tech text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onSelectUnit(t.unitId)}
                            className="font-bold text-white hover:text-emerald-300 text-sm"
                          >
                            Unit {t.unitId}
                          </button>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300">{t.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] uppercase rounded ${t.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'}`}>
                          {t.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 font-sans leading-snug">{t.title}</p>
                      <p className="text-[11px] text-slate-400">Resident: {t.residentName}</p>

                      {t.assignedTechnician && (
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] text-emerald-300 flex items-center gap-1.5">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          <span>Tech: {t.assignedTechnician}</span>
                        </div>
                      )}

                      {/* Status Mutation Controls */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{t.reportedAt}</span>
                        {statusGroup === 'Open' && (
                          <button
                            onClick={() => handleStatusChange(t.id, 'In Progress')}
                            className="px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-emerald-300 rounded transition-all"
                          >
                            Start Work →
                          </button>
                        )}
                        {statusGroup === 'In Progress' && (
                          <button
                            onClick={() => handleStatusChange(t.id, 'Resolved')}
                            className="px-2.5 py-1 text-[10px] bg-emerald-950 text-emerald-200 border border-emerald-500/40 rounded hover:bg-emerald-900 transition-all"
                          >
                            Mark Resolved ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="liquid-glass p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Residence & Category</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Technician</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{t.id}</td>
                  <td className="py-4 px-4">
                    <button onClick={() => onSelectUnit(t.unitId)} className="text-emerald-300 font-semibold hover:underline block">
                      Unit {t.unitId}
                    </button>
                    <span className="text-slate-400 text-[11px]">{t.category}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-200 font-sans max-w-xs">{t.title}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-[9px] uppercase rounded ${t.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{t.assignedTechnician || 'Unassigned'}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-slate-800 text-emerald-300 border border-slate-700">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
