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
  MicOff,
  Maximize2
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

  // Resizable drawer state (default 440px wide x 560px high)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 440,
    height: 560
  });
  const isResizingRef = useRef<'top' | 'left' | 'corner' | null>(null);
  const startPosRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 440,
    startH: 560
  });

  // Guard against double submission and race condition from voice
  const isSubmittingRef = useRef<boolean>(false);
  const lastSubmittedVoiceRef = useRef<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Drag handlers for resizing
  const handleResizeStart = (e: React.MouseEvent, type: 'top' | 'left' | 'corner') => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = type;
    startPosRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: dimensions.width,
      startH: dimensions.height
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dx = startPosRef.current.startX - moveEvent.clientX;
      const dy = startPosRef.current.startY - moveEvent.clientY;

      let newWidth = startPosRef.current.startW;
      let newHeight = startPosRef.current.startH;

      if (isResizingRef.current === 'left' || isResizingRef.current === 'corner') {
        const maxWidth = Math.min(840, window.innerWidth - 32);
        newWidth = Math.min(Math.max(360, startPosRef.current.startW + dx), maxWidth);
      }
      if (isResizingRef.current === 'top' || isResizingRef.current === 'corner') {
        const maxHeight = Math.min(880, window.innerHeight - 60);
        newHeight = Math.min(Math.max(420, startPosRef.current.startH + dy), maxHeight);
      }

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizingRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const toggleVoiceChat = () => {
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
        setInputValue(transcript);
        if (isFinal) {
          const cleanTranscript = (transcript || '').trim();
          if (cleanTranscript && cleanTranscript !== lastSubmittedVoiceRef.current) {
            lastSubmittedVoiceRef.current = cleanTranscript;
            handleSend(cleanTranscript);
          }
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

  // Click outside to close window automatically (prevent close while resizing)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isResizingRef.current) return;
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
    'Căn hộ Tecco Elite Thái Nguyên 2PN giá tốt',
    'Tìm căn 2PN Tây Hồ yên tĩnh có đỗ ô tô',
    'Căn nào tại Đà Nẵng không lo ngập lụt?',
    'Chính sách bảo chứng tiền cọc Escrow?',
    'Tiêu chuẩn PCCC QCVN 06 gồm những gì?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSubmittingRef.current || isLoading) return;
    
    // Set synchronous locks immediately
    isSubmittingRef.current = true;
    setIsLoading(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Stop voice listening safely if active
    if (VoiceRecognitionService.getIsListening()) {
      VoiceRecognitionService.stop();
      setIsListening(false);
    }

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
      isSubmittingRef.current = false;
      setTimeout(() => {
        lastSubmittedVoiceRef.current = '';
      }, 2000);
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
          style={{ 
            position: 'fixed', 
            bottom: '1.25rem', 
            right: '1.25rem', 
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: 'calc(100vw - 2.5rem)',
            maxHeight: 'calc(100vh - 5rem)',
            zIndex: 9999 
          }}
          className="fixed !fixed rounded-3xl p-[2px] overflow-visible shadow-2xl shadow-emerald-500/20 text-left flex flex-col select-none"
        >
          {/* Continuous Running Laser Beam */}
          <div className="animate-spin-beam pointer-events-none opacity-95 rounded-3xl" />

          {/* Top Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            className="absolute -top-1.5 left-6 right-6 h-3 cursor-ns-resize z-50 hover:bg-emerald-500/30 active:bg-emerald-500/50 rounded-full transition-colors flex items-center justify-center group"
            title="Kéo lên/xuống để đổi chiều cao"
          >
            <div className="w-8 h-1 rounded-full bg-slate-500/40 group-hover:bg-emerald-400 transition-colors" />
          </div>

          {/* Left Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            className="absolute top-6 bottom-6 -left-1.5 w-3 cursor-ew-resize z-50 hover:bg-emerald-500/30 active:bg-emerald-500/50 rounded-full transition-colors flex items-center justify-center group"
            title="Kéo sang trái/phải để đổi chiều rộng"
          >
            <div className="w-1 h-8 rounded-full bg-slate-500/40 group-hover:bg-emerald-400 transition-colors" />
          </div>

          {/* Top-Left Corner Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'corner')}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 cursor-nwse-resize z-50 flex items-center justify-center group"
            title="Kéo góc để đổi cả rộng và cao"
          >
            <div className="w-3 h-3 rounded-tl-md border-t-2 border-l-2 border-emerald-400/60 group-hover:border-emerald-400 group-hover:scale-125 transition-all" />
          </div>

          {/* Main Inner Window Container */}
          <div className="relative z-10 w-full h-full rounded-[22px] bg-[#0B0F17] [data-theme='light']_:bg-white border border-slate-700/80 [data-theme='light']_:border-slate-200/90 flex flex-col justify-between overflow-hidden shadow-2xl select-text">
            {/* Top Bar Header */}
            <div className="p-3 border-b border-slate-800 [data-theme='light']_:border-slate-200/80 flex items-center justify-between bg-slate-900/95 [data-theme='light']_:bg-slate-50/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-[13px] font-bold text-slate-100 [data-theme='light']_:text-slate-900">
                      Haven AI Advisor
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8.5px] font-mono text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </span>
                  </div>
                  <p className="text-[9.5px] font-mono text-slate-400 [data-theme='light']_:text-slate-500">
                    Tư vấn không gian sống • Phân tích chi phí
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div 
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-300 [data-theme='light']_:hover:text-slate-700 cursor-nwse-resize"
                  title="Có thể kéo thả viền/góc để mở rộng cửa sổ"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
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
            </div>

            {/* Chat Messages Body with Refined Compact Typography */}
            <div ref={messagesContainerRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] px-3 py-2.5 rounded-2xl space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/90 [data-theme=\'light\']_:bg-slate-100/90 border border-slate-800/90 [data-theme=\'light\']_:border-slate-200 text-slate-200 [data-theme=\'light\']_:text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[11px] sm:text-[11.5px] font-normal tracking-wide">
                      {msg.text}
                    </p>

                    {/* Filter Action Chip */}
                    {msg.suggestedAction && (
                      <button
                        onClick={() => {
                          onApplyAiSearch(msg.suggestedAction!.queryText);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[9.5px] font-semibold transition-colors mt-1"
                      >
                        <Filter className="w-2.5 h-2.5" />
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
                  <div className="px-2.5 py-1.5 rounded-2xl bg-slate-900/90 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-300 [data-theme='light']_:text-slate-700 flex items-center gap-2 font-mono text-[10.5px] shadow-sm">
                    <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                    <span>Haven AI đang suy luận...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-2 py-1.5 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 bg-slate-950/70 [data-theme='light']_:bg-slate-50/80 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-1.5 shrink-0">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  disabled={isLoading}
                  className="px-2 py-1 rounded-lg bg-slate-900/90 [data-theme='light']_:bg-white hover:bg-slate-800 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-emerald-500/40 text-[10.5px] font-sans text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 shadow-xs"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat Input Bar with Voice Mic Button */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center gap-1.5 bg-slate-950 [data-theme='light']_:bg-white shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder={isListening ? "Đang lắng nghe... Nói tự nhiên để AI hỗ trợ" : "Nhập câu hỏi hoặc nói bằng micro..."}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-900 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-100 [data-theme='light']_:text-slate-900 placeholder:text-slate-500 text-[11.5px] focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
              />
              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceChat}
                title={isListening ? "Đang lắng nghe... Bấm để dừng và gửi" : "Nói bằng giọng nói"}
                className={`w-7 h-7 flex items-center justify-center rounded-xl transition-all shrink-0 ${
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
                className="w-7 h-7 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
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
