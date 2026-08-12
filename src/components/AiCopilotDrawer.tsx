import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; dataCard?: any }>>([
    {
      role: 'assistant',
      text: 'Greetings, Operations Manager! I am your AI Property Intelligence Copilot. Ask me to query overdue rent, analyze upcoming lease expirations, review active maintenance dispatches, or draft resident notices.',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Show overdue rent balances',
    'Which leases expire in the next 60 days?',
    'Show unresolved maintenance issues',
    'Give me a summary of PH-2401',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('overdue') || q.includes('rent') || q.includes('balance') || q.includes('nợ')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Here is the real-time summary of overdue rent collections for Grand Tower Residence:',
            dataCard: {
              type: 'overdue',
              total: '$12,400',
              count: 2,
              items: [
                { unit: 'SV-2002', tenant: 'Marcus Sterling', amount: '$8,750', daysOverdue: 12 },
                { unit: 'DL-0801', tenant: 'Kenji Takahashi', amount: '$3,650', daysOverdue: 5 },
              ],
            },
          },
        ]);
      } else if (q.includes('expire') || q.includes('lease') || q.includes('contract') || q.includes('hạn')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Identified 2 lease contracts expiring within the next 60 days:',
            dataCard: {
              type: 'contracts',
              items: [
                { unit: 'SV-2001', tenant: 'Sophia Chen', expires: '2026-07-31', status: 'Renewal Required' },
                { unit: 'DL-1201', tenant: 'David Miller', expires: '2026-08-14', status: 'Under Review' },
              ],
            },
          },
        ]);
      } else if (q.includes('maintenance') || q.includes('issue') || q.includes('bảo trì')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Active maintenance dispatches requiring technician attention:',
            dataCard: {
              type: 'maintenance',
              items: [
                { unit: 'PH-2401', issue: 'Smart Lock Battery 42%', priority: 'Urgent', tech: 'Marcus Vance' },
                { unit: 'SV-2002', issue: 'Master Bath Hydro-Jet Pressure', priority: 'Medium', tech: 'Alex Reed' },
              ],
            },
          },
        ]);
      } else if (q.includes('ph-2401') || q.includes('summary')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Executive Summary for Residence PH-2401 (Penthouse Sky Suite):\n• Resident: Alexander Vance\n• Rent Rate: $14,500/mo (Auto-Pay Active)\n• Lease Expiration: Jan 14, 2027 (185 days remaining)\n• Security Deposit: $29,000 Escrow Held\n• IoT Telemetry: Smart Lock 92%, HVAC Optimal 21.5°C',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Processed operational request for "${query}". Portfolio telemetry indicates 93.8% occupancy with all primary systems operating normally.`,
          },
        ]);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      <div className="w-full max-w-md h-full liquid-glass border-l border-slate-700/80 flex flex-col justify-between shadow-2xl relative bg-[#0A0D12]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase tracking-widest block">
                PROPERTY AI COPILOT
              </span>
              <h3 className="text-base font-bold text-white font-serif-editorial">
                Operational Assistant
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs font-mono-tech">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'liquid-glass text-slate-200 border border-slate-700/80'
                }`}
              >
                {m.text}
              </div>

              {/* Data Cards inside AI Chat */}
              {m.dataCard && m.dataCard.type === 'overdue' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-rose-500/40 space-y-3 bg-rose-950/20">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-300">
                    <span>Total Overdue Target</span>
                    <span className="font-mono-tech text-base text-white">{m.dataCard.total}</span>
                  </div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">{item.daysOverdue} days overdue</p>
                        </div>
                        <span className="font-bold text-rose-400">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.dataCard && m.dataCard.type === 'contracts' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-sky-500/40 space-y-3 bg-sky-950/20">
                  <div className="text-xs font-bold text-sky-300">60-Day Expiring Contracts</div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">End: {item.expires}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 rounded border border-amber-500/40">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.dataCard && m.dataCard.type === 'maintenance' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-emerald-500/40 space-y-3 bg-emerald-950/20">
                  <div className="text-xs font-bold text-emerald-300">Active Work Order Tickets</div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.issue}
                          <p className="text-slate-400 text-[10px]">Tech: {item.tech}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-rose-950 text-rose-300 rounded border border-rose-500/40">
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts & Input Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-[#0A0D12]">
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 text-[11px] bg-slate-900 border border-slate-700/80 rounded-lg text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all text-left truncate"
              >
                {qp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI about rent, contracts, maintenance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

