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
      text: 'Xin chào Trưởng BQL! Tôi là Trợ Lý AI Quản Lý Căn Hộ. Bạn cần hỗ trợ tra cứu dữ liệu, tóm tắt doanh thu hay soạn thông báo cho cư dân hôm nay?',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Tóm tắt tiền nhà còn nợ tháng này',
    'Soạn thông báo nhắc nợ Căn PH-2401',
    'Xem danh sách hợp đồng sắp hết hạn 60 ngày',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      if (query.toLowerCase().includes('nợ') || query.toLowerCase().includes('thanh toán')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Dưới đây là tóm tắt tiền nhà còn nợ tháng 6/2026 tại Grand Tower Residence:',
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
      } else if (query.toLowerCase().includes('hết hạn') || query.toLowerCase().includes('hợp đồng')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Tìm thấy 2 hợp đồng thuê sắp hết hạn trong 60 ngày tới:',
            dataCard: {
              type: 'contracts',
              items: [
                { unit: 'SV-2001', tenant: 'Sophia Chen', expires: '2026-07-31', status: 'Cần gia hạn' },
                { unit: 'DL-1201', tenant: 'David Miller', expires: '2026-08-14', status: 'Đang thảo luận' },
              ],
            },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Đã phân tích dữ liệu cho yêu cầu "${query}". Bạn có thể chọn các tác vụ nhanh bên dưới để thực thi trực tiếp trên hệ thống.`,
          },
        ]);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      <div className="w-full max-w-md h-full origin-card border-l border-amber-500/30 flex flex-col justify-between shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                PROPERTY AI COPILOT
              </span>
              <h3 className="text-base font-bold text-white font-['Cinzel']">
                Trợ Lý Quản Lý Căn Hộ
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'origin-card border border-white/10 text-slate-200'
                }`}
              >
                {m.text}
              </div>

              {/* Data Card Inside AI Response */}
              {m.dataCard && m.dataCard.type === 'overdue' && (
                <div className="w-full origin-card p-4 rounded-2xl border border-rose-500/30 space-y-3 bg-rose-500/5">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                    <span>Tổng nợ trễ hạn</span>
                    <span className="font-mono text-base text-white">{m.dataCard.total}</span>
                  </div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-black/40 rounded-xl flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-white font-mono">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">Trễ {item.daysOverdue} ngày</p>
                        </div>
                        <span className="font-bold text-amber-400 font-mono">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.dataCard && m.dataCard.type === 'contracts' && (
                <div className="w-full origin-card p-4 rounded-2xl border border-cyan-500/30 space-y-3 bg-cyan-500/5">
                  <div className="text-xs font-bold text-cyan-300">Hợp đồng hết hạn 60 ngày tới</div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-black/40 rounded-xl flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-white font-mono">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">Hạn: {item.expires}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded-full">
                          {item.status}
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
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#08090E]">
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 text-[11px] bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all text-left truncate"
              >
                {qp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Hỏi AI về tiền nhà, hợp đồng, bảo trì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
