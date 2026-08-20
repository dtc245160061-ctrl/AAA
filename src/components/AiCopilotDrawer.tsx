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
      text: 'Xin chào Giám Đốc Vận Hành! Tôi là Haven AI Copilot — Trợ lý Trí tuệ Vận hành & Quản trị Tòa nhà HAVEN. Bạn có thể yêu cầu tôi tra cứu tiền thuê quá hạn, phân tích hợp đồng sắp hết hạn trong 60 ngày, kiểm tra sự cố bảo trì khẩn cấp, hoặc tóm tắt chỉ số an toàn PCCC.',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Tra cứu hóa đơn nợ quá hạn',
    'Hợp đồng nào hết hạn trong 60 ngày tới?',
    'Xem các sự cố bảo trì đang xử lý',
    'Báo cáo tổng quan căn HN-TH-2401',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('overdue') || q.includes('rent') || q.includes('balance') || q.includes('nợ') || q.includes('hóa đơn')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Dưới đây là bảng tổng hợp các khoản tiền thuê & hóa đơn dịch vụ cần đôn đốc thu hồi:',
            dataCard: {
              type: 'overdue',
              total: '128.5 Triệu VNĐ',
              count: 2,
              items: [
                { unit: 'HN-CG-1402', tenant: 'Phạm Thu Trang', amount: '71.3 Triệu', daysOverdue: 10 },
                { unit: 'DN-HC-1202', tenant: 'Trần Đình Trọng', amount: '57.2 Triệu', daysOverdue: 4 },
              ],
            },
          },
        ]);
      } else if (q.includes('expire') || q.includes('lease') || q.includes('contract') || q.includes('hạn') || q.includes('hợp đồng')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Phát hiện 2 hợp đồng thuê sắp đến hạn tái ký trong vòng 60 ngày tới:',
            dataCard: {
              type: 'contracts',
              items: [
                { unit: 'HN-CG-1402', tenant: 'Phạm Thu Trang', expires: '2026-08-31', status: 'Cần Liên Hệ Tái Ký' },
                { unit: 'SG-D1-1601', tenant: 'Nguyễn Thành Nam', expires: '2026-09-15', status: 'Đang Thương Thảo' },
              ],
            },
          },
        ]);
      } else if (q.includes('maintenance') || q.includes('issue') || q.includes('bảo trì') || q.includes('sự cố')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Danh sách phiếu công tác bảo trì kỹ thuật đang được phân công xử lý:',
            dataCard: {
              type: 'maintenance',
              items: [
                { unit: 'HN-TH-2401', issue: 'Kiểm tra pin cảm biến khóa thông minh (còn 42%)', priority: 'Khẩn Cấp', tech: 'KTV. Hoàng Tuấn' },
                { unit: 'SG-D1-1601', issue: 'Hiệu chỉnh áp lực nước vòi sen Master Bath', priority: 'Trung Bình', tech: 'KTV. Lê Minh' },
              ],
            },
          },
        ]);
      } else if (q.includes('2401') || q.includes('tổng quan') || q.includes('summary')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: '📊 Báo Cáo Tổng Quan Căn Hộ Penthouse HN-TH-2401 (Hồ Tây Panorama):\n• Khách thuê hiện tại: Alexander Vance\n• Giá thuê: 350Tr/tháng (Thanh toán tự động VietQR)\n• Hạn hợp đồng: 14/01/2027 (còn 185 ngày)\n• Tiền ký quỹ Escrow: 700Tr (Bảo chứng tài khoản BIDV)\n• Trạng thái PCCC & IoT: Cửa an toàn 98%, Điều hòa trung tâm 22.5°C đạt chuẩn.',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Đã ghi nhận yêu cầu: "${query}". Tỷ lệ lấp đầy toàn hệ thống HAVEN hiện đạt 94.2% với 150 căn hộ vận hành ổn định.`,
          },
        ]);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      <div className="w-full max-w-md h-full liquid-glass border-l border-slate-700/80 flex flex-col justify-between shadow-2xl relative bg-[#0A0D12]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                TRỢ LÝ VẬN HÀNH AI (COPILOT)
              </span>
              <h3 className="text-base font-bold text-white font-serif">
                Haven Operations Copilot
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
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'liquid-glass text-slate-200 border border-slate-700/80'
                }`}
              >
                {m.text}
              </div>

              {/* Data Cards inside AI Chat */}
              {m.dataCard && m.dataCard.type === 'overdue' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-rose-500/40 space-y-3 bg-rose-950/20">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-300">
                    <span>Tổng Nợ Cần Thu Hồi</span>
                    <span className="font-mono text-base text-white">{m.dataCard.total}</span>
                  </div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">Quá hạn: {item.daysOverdue} ngày</p>
                        </div>
                        <span className="font-bold text-rose-400">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.dataCard && m.dataCard.type === 'contracts' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-sky-500/40 space-y-3 bg-sky-950/20">
                  <div className="text-xs font-bold text-sky-300">Hợp Đồng Hết Hạn Trong 60 Ngày</div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.tenant}
                          <p className="text-slate-400 text-[10px]">Hết hạn: {item.expires}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 rounded border border-amber-500/40 font-bold">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.dataCard && m.dataCard.type === 'maintenance' && (
                <div className="w-full liquid-glass p-4 rounded-2xl border border-emerald-500/40 space-y-3 bg-emerald-950/20">
                  <div className="text-xs font-bold text-emerald-300">Phiếu Công Tác Bảo Trì</div>
                  <div className="space-y-2">
                    {m.dataCard.items.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                        <div>
                          <strong className="text-white">{item.unit}</strong> — {item.issue}
                          <p className="text-slate-400 text-[10px]">Phụ trách: {item.tech}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-rose-950 text-rose-300 rounded border border-rose-500/40 font-bold">
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
              placeholder="Hỏi AI về tiền nhà, hợp đồng, bảo trì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

