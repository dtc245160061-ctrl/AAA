import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  Receipt,
  FileText,
  Wrench,
  Mic,
  MicOff,
  Bot
} from 'lucide-react';
import { type RagRetrievalResult } from '../services/geminiRagService';
import { askHavenLocalSlm } from '../services/localAiService';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';

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
  const [isListening, setIsListening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSubmittedVoiceRef = useRef<string>('');

  const toggleVoiceAdmin = () => {
    if (isListening) {
      const captured = VoiceRecognitionService.stop();
      setIsListening(false);
      const cleanCaptured = (captured || '').trim();
      if (cleanCaptured && cleanCaptured !== lastSubmittedVoiceRef.current) {
        lastSubmittedVoiceRef.current = cleanCaptured;
        handleSend(cleanCaptured);
      }
      return;
    }

    const started = VoiceRecognitionService.start({
      lang: 'vi-VN',
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          const cleanTranscript = (transcript || '').trim();
          if (cleanTranscript && cleanTranscript !== lastSubmittedVoiceRef.current) {
            lastSubmittedVoiceRef.current = cleanTranscript;
            handleSend(cleanTranscript);
          }
        }
      },
      onError: (err) => {
        console.warn('Voice admin error:', err);
        setIsListening(false);
      }
    });

    if (!started) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API hoặc chưa cấp quyền micro.');
    }
  };

  // Auto-scroll ONLY inside chat box
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

      const res = await askHavenLocalSlm(query, history, 'admin');

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
          style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 9999 }}
          className="fixed bottom-5 right-5 z-[9999] w-[420px] max-w-[calc(100vw-2.5rem)] h-[540px] max-h-[calc(100vh-5.5rem)] rounded-[28px] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.65)] border-2 border-slate-300 dark:border-slate-700 ring-1 ring-slate-400/25 bg-white dark:bg-slate-900 flex flex-col text-slate-900 dark:text-slate-100 font-sans"
        >
          {/* Main Inner Window Container */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-[#F2F5F0] dark:bg-slate-850 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#163300] dark:text-white">
                      Haven Copilot
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#163300] dark:bg-[#9FE870] dark:bg-[#9FE870] animate-pulse" />
                      <span>Admin Local SLM</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Trợ lý Trí tuệ Vận hành • Qwen2.5-0.5B
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div ref={messagesContainerRef} className="p-3.5 flex-1 overflow-y-auto space-y-3 font-sans text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[88%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-[20px] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#163300] text-white font-medium shadow-sm rounded-tr-xs'
                          : 'bg-[#EAEFE8] dark:bg-slate-800/95 text-slate-850 dark:text-slate-100 border border-slate-300/80 dark:border-slate-600/80 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {(() => {
                        const cleanDisplayMsg = m.text
                          .replace(/```json[\s\S]*?```/gi, '')
                          .replace(/```[\s\S]*?```/gi, '')
                          .replace(/\{\s*"action"[\s\S]*?\}/gi, '')
                          .trim();
                        return cleanDisplayMsg ? (
                          <p className="whitespace-pre-line leading-relaxed text-[12.5px]">{cleanDisplayMsg}</p>
                        ) : null;
                      })()}
                    </div>

                    {/* Data Cards inside AI Chat */}
                    {m.dataCard && m.dataCard.type === 'overdue' && (
                      <div className="w-full bg-rose-50 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-200 dark:border-rose-500/40 space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold text-rose-800 dark:text-rose-300">
                          <span className="flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Tổng Nợ Cần Thu Hồi</span>
                          </span>
                          <span className="text-sm font-black text-rose-700 dark:text-white">{m.dataCard.total}</span>
                        </div>
                        <div className="space-y-1.5">
                          {m.dataCard.items.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-xl flex justify-between items-center text-[11px] border border-rose-100 dark:border-slate-800">
                              <div>
                                <strong className="text-slate-900 dark:text-white">{item.unit}</strong> — {item.tenant}
                                <p className="text-slate-500 dark:text-slate-400 text-[10px]">Quá hạn: {item.daysOverdue} ngày</p>
                              </div>
                              <span className="font-bold text-rose-600 dark:text-rose-400">{item.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.dataCard && m.dataCard.type === 'contracts' && (
                      <div className="w-full bg-sky-50 dark:bg-sky-950/30 p-3 rounded-2xl border border-sky-200 dark:border-sky-500/40 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-300">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Hợp Đồng Sắp Hết Hạn (60 ngày)</span>
                        </div>
                        <div className="space-y-1.5">
                          {m.dataCard.items.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-xl flex justify-between items-center text-[11px] border border-sky-100 dark:border-slate-800">
                              <div>
                                <strong className="text-slate-900 dark:text-white">{item.unit}</strong> — {item.tenant}
                                <p className="text-slate-500 dark:text-slate-400 text-[10px]">Hết hạn: {item.expires}</p>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-bold">
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.dataCard && m.dataCard.type === 'maintenance' && (
                      <div className="w-full bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-500/40 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Sự Cố Bảo Trì Cần Xử Lý</span>
                        </div>
                        <div className="space-y-1.5">
                          {m.dataCard.items.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-xl space-y-1 border border-amber-100 dark:border-slate-800">
                              <div className="flex justify-between items-center">
                                <strong className="text-slate-900 dark:text-white text-[11px]">{item.unit}</strong>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                                  {item.priority}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 text-[11px]">{item.issue}</p>
                              <p className="text-slate-500 text-[10px]">Phụ trách: {item.tech}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#F7FAF6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs shadow-2xs">
                    <Loader2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] animate-spin" />
                    <span className="font-medium">Copilot đang phân tích số liệu...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-[#F9FAF8] dark:bg-slate-850 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-1.5 shrink-0">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#163300] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 shadow-2xs cursor-pointer"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900 shrink-0">
              <input
                type="text"
                placeholder={isListening ? "Đang lắng nghe admin nói..." : "Hỏi về nợ quá hạn, hợp đồng, bảo trì..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 focus:border-[#163300] transition-all disabled:opacity-50"
              />
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleVoiceAdmin}
                title={isListening ? "Đang lắng nghe... Bấm để dừng" : "Nói bằng giọng nói"}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9FE870] hover:bg-[#8ee05b] disabled:bg-slate-100 dark:disabled:bg-slate-800 text-[#163300] disabled:text-slate-400 transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
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
