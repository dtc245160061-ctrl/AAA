import React, { useState } from 'react';
import { X, UserPlus, FileCheck, DollarSign, Wrench, CheckCircle } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const [activeAction, setActiveAction] = useState<'tenant' | 'contract' | 'payment' | 'maintenance'>('payment');
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
      onClose();
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAction === 'tenant') showToast('Resident profile onboarded successfully!');
    if (activeAction === 'contract') showToast('New lease contract created successfully!');
    if (activeAction === 'payment') showToast('Rent payment recorded in ledger successfully!');
    if (activeAction === 'maintenance') showToast('Work order ticket dispatched successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      {toast && (
        <div className="absolute top-6 right-6 z-50 bg-emerald-400 text-slate-950 px-4 py-3 rounded-xl font-bold font-mono-tech shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-slate-950" />
          <span>{toast}</span>
        </div>
      )}

      <div className="liquid-glass w-full max-w-xl rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl relative bg-[#0A0D12]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase tracking-widest block">
              OPERATIONAL ACTIONS / STATE MUTATIONS
            </span>
            <h2 className="text-xl font-bold text-white font-serif-editorial mt-0.5">
              Quick Action Dispatcher
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Type Selector Grid */}
        <div className="p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/60 font-mono-tech">
          {[
            { id: 'payment', label: 'Record Payment', icon: DollarSign },
            { id: 'tenant', label: 'Add Resident', icon: UserPlus },
            { id: 'contract', label: 'Create Lease', icon: FileCheck },
            { id: 'maintenance', label: 'Work Order', icon: Wrench },
          ].map((act) => {
            const Icon = act.icon;
            const isActive = activeAction === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveAction(act.id as any)}
                className={`p-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1.5 border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono-tech">
          {activeAction === 'payment' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Select Residence & Tenant</label>
                <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60">
                  <option value="SV-2002">SV-2002 — Marcus Sterling ($8,750 Overdue)</option>
                  <option value="DL-0801">DL-0801 — Kenji Takahashi ($3,650 Overdue)</option>
                  <option value="PH-2401">PH-2401 — Alexander Vance ($14,500 Current)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Collected Amount ($USD)</label>
                  <input
                    type="number"
                    defaultValue={8750}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono-tech focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Payment Method</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60">
                    <option>Direct Bank Wire</option>
                    <option>Auto-Pay Escrow</option>
                    <option>Credit Card</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeAction === 'tenant' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    placeholder="resident@domain.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'contract' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Target Residence</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60">
                    <option value="PH-2402">PH-2402 (Penthouse — $16,800/mo)</option>
                    <option value="DL-1202">DL-1202 (Deluxe — $4,100/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Escrow Deposit ($)</label>
                  <input
                    type="number"
                    defaultValue={33600}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono-tech focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'maintenance' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Ticket Title & Issue</label>
                <input
                  type="text"
                  placeholder="Describe issue (e.g. Master Bath Hydro-Jet Pressure)..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Residence ID</label>
                  <input
                    type="text"
                    defaultValue="PH-2401"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono-tech focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono-tech uppercase text-[10px]">Priority Level</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60">
                    <option value="Urgent">Urgent</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 font-mono-tech">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

