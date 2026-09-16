import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  Receipt,
  FileText,
  Wrench
} from 'lucide-react';
import { askGeminiRag, type RagRetrievalResult } from '../services/geminiRagService';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: RagRetrievalResult[];
  dataCard?: any;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Xin chào Giám Đốc Vận Hành! Tôi là Haven AI Copilot — Trợ lý Trí tuệ Vận hành & Quản trị Tòa nhà HAVEN.\n\nBạn có thể yêu cầu tôi tra cứu tiền thuê quá hạn, phân tích hợp đồng sắp hết hạn trong 60 ngày, kiểm tra sự cố bảo trì khẩn cấp, hoặc tóm tắt chỉ số an toàn PCCC dựa trên dữ liệu hệ thống thời gian thực.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY inside chat box (never scroll parent page / window)
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Click outside to close automatically
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const quickPrompts = [
    'Tra cứu hóa đơn nợ quá hạn',
    'Hợp đồng nào hết hạn trong 60 ngày tới?',
    'Xem các sự cố bảo trì đang xử lý',
    'Bây giờ là mấy giờ?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const newMsgs: Message[] = [...messages, { role: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await askGeminiRag(query, 'admin', history);

      const q = query.toLowerCase();
      let extraDataCard: any = undefined;

      if (q.includes('overdue') || q.includes('rent') || q.includes('balance') || q.includes('nợ') || q.includes('hóa đơn')) {
        extraDataCard = {
          type: 'overdue',
          total: '128.5 Triệu VNĐ',
          count: 2,
          items: [
            { unit: 'HN-CG-1402', tenant: 'Phạm Thu Trang', amount: '71.3 Triệu', daysOverdue: 10 },
            { unit: 'DN-HC-1202', tenant: 'Trần Đình Trọng', amount: '57.2 Triệu', daysOverdue: 4 },
          ],
        };
      } else if (q.includes('expire') || q.includes('lease') || q.includes('contract') || q.includes('hạn') || q.includes('hợp đồng')) {
        extraDataCard = {
          type: 'contracts',
          items: [
            { unit: 'HN-CG-1402', tenant: 'Phạm Thu Trang', expires: '2026-08-31', status: 'Cần Liên Hệ Tái Ký' },
            { unit: 'SG-D1-1601', tenant: 'Nguyễn Thành Nam', expires: '2026-09-15', status: 'Đang Thương Thảo' },
          ],
        };
      } else if (q.includes('maintenance') || q.includes('issue') || q.includes('bảo trì') || q.includes('sự cố')) {
        extraDataCard = {
          type: 'maintenance',
          items: [
            { unit: 'HN-TH-2401', issue: 'Kiểm tra pin cảm biến khóa thông minh (còn 42%)', priority: 'Khẩn Cấp', tech: 'KTV. Hoàng Tuấn' },
            { unit: 'SG-D1-1601', issue: 'Hiệu chỉnh áp lực nước vòi sen Master Bath', priority: 'Trung Bình', tech: 'KTV. Lê Minh' },
          ],
        };
      }

      const assistantMsg: Message = {
        role: 'assistant',
        text: res.answer,
        sources: res.sources,
        dataCard: extraDataCard
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-5rem)] rounded-3xl p-[2px] overflow-hidden shadow-2xl shadow-emerald-500/30 text-left"
        >
          {/* Dual Symmetrical Opposing Orbiting Light Beams (180° apart, continuous, non-clipping) */}
          <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,rgba(52,211,153,0.12)_0deg,rgba(52,211,153,0.35)_35deg,rgba(52,211,153,0.85)_70deg,#34d399_90deg,rgba(52,211,153,0.85)_110deg,rgba(52,211,153,0.35)_145deg,rgba(52,211,153,0.12)_180deg,rgba(52,211,153,0.35)_215deg,rgba(52,211,153,0.85)_250deg,#34d399_270deg,rgba(52,211,153,0.85)_290deg,rgba(52,211,153,0.35)_325deg,rgba(52,211,153,0.12)_360deg)] animate-spin-beam pointer-events-none opacity-95" />

          {/* Main Inner Window Container with 100% Solid Opaque Backdrop */}
          <div className="relative z-10 w-full h-full rounded-[22px] bg-[#0B0F17] [data-theme='light']_:bg-white border border-slate-700 [data-theme='light']_:border-slate-200 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-3 sm:p-3.5 border-b border-slate-800 [data-theme='light']_:border-slate-200 flex items-center justify-between bg-slate-900 [data-theme='light']_:bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    TRỢ LÝ VẬN HÀNH AI
                  </span>
                  <h3 className="text-sm font-bold text-white [data-theme='light']_:text-slate-900 font-serif">
                    Haven Copilot
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 [data-theme='light']_:hover:bg-slate-200 transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div ref={messagesContainerRef} className="p-3.5 flex-1 overflow-y-auto space-y-3 text-xs font-mono">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 rounded-br-none'
                        : 'bg-slate-900/90 [data-theme=\'light\']_:bg-slate-100 text-slate-200 [data-theme=\'light\']_:text-slate-800 border border-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[12px]">{m.text}</p>
                  </div>

                  {/* Data Cards inside AI Chat */}
                  {m.dataCard && m.dataCard.type === 'overdue' && (
                    <div className="w-full bg-rose-950/30 p-3 rounded-2xl border border-rose-500/40 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Tổng Nợ Cần Thu Hồi</span>
                        </span>
                        <span className="font-mono text-sm text-white">{m.dataCard.total}</span>
                      </div>
                      <div className="space-y-1.5">
                        {m.dataCard.items.map((item: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-900/90 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
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
                    <div className="w-full bg-sky-950/30 p-3 rounded-2xl border border-sky-500/40 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Hợp Đồng Sắp Hết Hạn (60 ngày)</span>
                      </div>
                      <div className="space-y-1.5">
                        {m.dataCard.items.map((item: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-900/90 rounded-xl flex justify-between items-center text-[11px] border border-slate-800">
                            <div>
                              <strong className="text-white">{item.unit}</strong> — {item.tenant}
                              <p className="text-slate-400 text-[10px]">Hết hạn: {item.expires}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.dataCard && m.dataCard.type === 'maintenance' && (
                    <div className="w-full bg-amber-950/30 p-3 rounded-2xl border border-amber-500/40 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Sự Cố Bảo Trì Cần Xử Lý</span>
                      </div>
                      <div className="space-y-1.5">
                        {m.dataCard.items.map((item: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-900/90 rounded-xl space-y-1 border border-slate-800">
                            <div className="flex justify-between items-center">
                              <strong className="text-white text-[11px]">{item.unit}</strong>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{item.issue}</p>
                            <p className="text-slate-500 text-[10px]">Phụ trách: {item.tech}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-[11px] shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Copilot đang phân tích số liệu...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-2.5 py-1.5 border-t border-slate-800 [data-theme='light']_:border-slate-200 bg-slate-950/60 [data-theme='light']_:bg-slate-50 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-1.5 shrink-0">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  disabled={isLoading}
                  className="px-2 py-1 rounded-lg bg-slate-900/90 [data-theme='light']_:bg-white hover:bg-slate-800 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-emerald-500/40 text-[11px] font-sans text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 border-t border-slate-800 [data-theme='light']_:border-slate-200 flex items-center gap-2 bg-slate-950 [data-theme='light']_:bg-white shrink-0">
              <input
                type="text"
                placeholder="Hỏi về nợ quá hạn, hợp đồng, bảo trì..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs bg-slate-900 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 rounded-xl text-white [data-theme='light']_:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
