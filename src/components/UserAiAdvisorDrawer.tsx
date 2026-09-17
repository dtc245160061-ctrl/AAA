import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  Filter, 
  Loader2,
  Mic,
  MicOff
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { 
  askGeminiRag, 
  type RagRetrievalResult 
} from '../services/geminiRagService';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
  sources?: RagRetrievalResult[];
  suggestedAction?: {
    type: 'apply_filters';
    queryText: string;
  };
}

interface UserAiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  units?: ApartmentUnit[];
  onApplyAiSearch: (queryText: string) => void;
}

export const UserAiAdvisorDrawer: React.FC<UserAiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  units: _units,
  onApplyAiSearch
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Xin chào bạn! Tôi là Haven AI — Trợ lý Không Gian Sống HAVEN.\n\nBạn có thể hỏi bất kỳ điều gì, từ thời gian, tư vấn căn hộ (khu vực, ngân sách, số phòng, chỗ đỗ ô tô, ngập úng...) đến chính sách bảo chứng cọc Escrow nhé!`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const toggleVoiceChat = () => {
    if (isListening) {
      const captured = VoiceRecognitionService.stop();
      setIsListening(false);
      if (captured && captured.trim()) {
        setInputValue(captured.trim());
        handleSend(captured.trim());
      }
      return;
    }

    const started = VoiceRecognitionService.start({
      lang: 'vi-VN',
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (transcript, isFinal) => {
        setInputValue(transcript);
        if (isFinal) {
          handleSend(transcript);
        }
      },
      onError: (err) => {
        console.warn('Voice chat error:', err);
        setIsListening(false);
      }
    });

    if (!started) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API hoặc chưa cấp quyền micro.');
    }
  };

  // Auto-scroll ONLY inside chat box (never scroll parent page / window)
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Click outside to close window automatically
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use mousedown with slight delay to avoid immediate trigger from opening click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const quickPrompts = [
    'Tìm căn 2PN Tây Hồ yên tĩnh có đỗ ô tô',
    'Căn nào tại Đà Nẵng không lo ngập lụt?',
    'Bây giờ là mấy giờ?',
    'Chính sách bảo chứng tiền cọc Escrow?',
    'Tiêu chuẩn PCCC QCVN 06 gồm những gì?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text
      }));

      const res = await askGeminiRag(query, 'consumer', history);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        modelUsed: res.modelUsed,
        sources: res.sources,
        suggestedAction: res.suggestedAction
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Chào bạn, hiện tại kết nối đang bận một chút. Bạn có thể thử lại câu hỏi nhé!`
      };
      setMessages(prev => [...prev, errorMsg]);
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
          className="fixed !fixed bottom-5 right-5 z-[9999] w-[400px] max-w-[calc(100vw-2.5rem)] h-[500px] max-h-[calc(100vh-5.5rem)] rounded-3xl p-[2px] overflow-hidden shadow-2xl shadow-emerald-500/30 text-left flex flex-col"
        >
          {/* Continuous Dual Orbiting Running Laser Beam around AI Advisor */}
          <div className="animate-spin-beam pointer-events-none opacity-95" />

          {/* Main Inner Window Container with 100% Solid Opaque Backdrop */}
          <div className="relative z-10 w-full h-full rounded-[22px] bg-[#0B0F17] [data-theme='light']_:bg-white border border-slate-700/80 [data-theme='light']_:border-slate-200 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Top Bar Header */}
            <div className="p-3 sm:p-3.5 border-b border-slate-800 [data-theme='light']_:border-slate-200 flex items-center justify-between bg-slate-900 [data-theme='light']_:bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-sm font-bold text-slate-100 [data-theme='light']_:text-slate-900">
                  Haven AI Advisor
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Trợ Lý AI</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 [data-theme='light']_:text-slate-500">
                Tư vấn không gian sống & Phân tích chi phí
              </p>
            </div>
          </div>

          {/* Single clean Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 [data-theme='light']_:hover:bg-slate-200 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div ref={messagesContainerRef} className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-2xl space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 [data-theme=\'light\']_:bg-slate-100 border border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-200 [data-theme=\'light\']_:text-slate-800 rounded-bl-none shadow-sm leading-relaxed'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>

                {/* Filter Action Chip */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => {
                      onApplyAiSearch(msg.suggestedAction!.queryText);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[10px] font-semibold transition-colors mt-1"
                  >
                    <Filter className="w-3 h-3" />
                    <span>Áp dụng vào tìm kiếm</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing Loader Indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start items-center">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/90 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-300 [data-theme='light']_:text-slate-700 flex items-center gap-2 font-mono text-[11px] shadow-sm">
                <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                <span>Haven AI đang suy luận...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar with compact text */}
        <div className="px-2.5 py-1.5 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 bg-slate-950/60 [data-theme='light']_:bg-slate-50 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-1.5 shrink-0">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 [data-theme='light']_:bg-white hover:bg-slate-800 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-emerald-500/40 text-[11px] font-sans text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar with Voice Mic Button */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center gap-1.5 bg-slate-950 [data-theme='light']_:bg-white shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={isListening ? "Đang lắng nghe bạn nói..." : "Nhập câu hỏi hoặc nói bằng mic..."}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-100 [data-theme='light']_:text-slate-900 placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
          />
          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceChat}
            title={isListening ? "Đang lắng nghe... Bấm để dừng" : "Nói bằng giọng nói"}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 [data-theme="light"]_:bg-slate-200 [data-theme="light"]_:hover:bg-slate-300 text-slate-300 [data-theme="light"]_:text-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
