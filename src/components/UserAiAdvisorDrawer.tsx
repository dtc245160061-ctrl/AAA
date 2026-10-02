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
import { type RagRetrievalResult } from '../services/geminiRagService';
import { askHavenLocalSlm, checkLocalSlmStatus } from '../services/localAiService';
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
      text: `Xin chào bạn! Tôi là HAVEN Local AI — Trợ lý Không Gian Sống Cục Bộ vận hành trên mô hình SLM Qwen2.5 (100% Offline, bảo mật tối đa).\n\nBạn có thể hỏi tôi bất kỳ điều gì: tư vấn trong số 1,700 căn hộ toàn quốc (Thái Nguyên, Hà Nội, TP.HCM, Đà Nẵng...), tính toán chi phí True Cost, hoặc cơ chế bảo chứng cọc Escrow an toàn nhé!`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [slmStatus, setSlmStatus] = useState<{ isAvailable: boolean; model: string }>({
    isAvailable: false,
    model: ''
  });

  // Dynamically check Local Edge SLM status when drawer opens
  useEffect(() => {
    if (isOpen) {
      checkLocalSlmStatus().then(st => {
        setSlmStatus({ isAvailable: st.isAvailable, model: st.model });
      });
    }
  }, [isOpen]);

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
    
    isSubmittingRef.current = true;
    setIsLoading(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    if (VoiceRecognitionService.getIsListening()) {
      VoiceRecognitionService.stop();
      setIsListening(false);
    }

    try {
      const history = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text
      }));

      const res = await askHavenLocalSlm(query, history, 'consumer');

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
          className="fixed rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col text-slate-900 dark:text-slate-100 font-sans select-none"
        >
          {/* Top Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            className="absolute top-0 left-6 right-6 h-2 cursor-ns-resize z-50 hover:bg-[#9FE870]/40 rounded-full transition-colors flex items-center justify-center group"
            title="Kéo lên/xuống để đổi chiều cao"
          >
            <div className="w-8 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[#163300] dark:group-hover:bg-[#9FE870] transition-colors" />
          </div>

          {/* Left Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            className="absolute top-6 bottom-6 left-0 w-2 cursor-ew-resize z-50 hover:bg-[#9FE870]/40 rounded-full transition-colors flex items-center justify-center group"
            title="Kéo sang trái/phải để đổi chiều rộng"
          >
            <div className="w-1 h-8 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[#163300] dark:group-hover:bg-[#9FE870] transition-colors" />
          </div>

          {/* Top-Left Corner Resizing Handle */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'corner')}
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-50 flex items-center justify-center group"
            title="Kéo góc để đổi cả rộng và cao"
          >
            <div className="w-2.5 h-2.5 rounded-tl-sm border-t-2 border-l-2 border-slate-400 group-hover:border-[#163300] dark:group-hover:border-[#9FE870] group-hover:scale-125 transition-all" />
          </div>

          {/* Main Inner Window Container */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden select-text">
            {/* Top Bar Header */}
            <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-[#F2F5F0] dark:bg-slate-850 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-[#163300] dark:text-white">
                      Haven AI Advisor
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      slmStatus.isAvailable
                        ? 'bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] dark:bg-[#9FE870]/20'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    } text-[10px] font-bold`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${slmStatus.isAvailable ? 'bg-[#20A05A] dark:bg-[#9FE870]' : 'bg-emerald-500'} animate-pulse`} />
                      <span>{slmStatus.isAvailable ? `Local SLM (${slmStatus.model || 'Active'})` : 'Hybrid Gateway'}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {slmStatus.isAvailable ? 'Edge SLM On-Device • 1,700 Căn Hộ RAG' : 'Gemini Flash-Lite & RAG 1,700 Căn Hộ'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div 
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-nwse-resize"
                  title="Có thể kéo viền/góc để mở rộng cửa sổ"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div ref={messagesContainerRef} className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-xl bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-[20px] space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#163300] text-white font-medium rounded-tr-xs shadow-sm'
                        : 'bg-[#F7FAF6] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[12px]">
                      {msg.text}
                    </p>

                    {/* Filter Action Chip */}
                    {msg.suggestedAction && (
                      <button
                        onClick={() => {
                          onApplyAiSearch(msg.suggestedAction!.queryText);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] hover:bg-[#8ee05b] font-bold text-[10px] transition-colors mt-1.5 shadow-2xs cursor-pointer"
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
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-xl bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#F7FAF6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs shadow-2xs">
                    <Loader2 className="w-3.5 h-3.5 text-[#20A05A] animate-spin" />
                    <span className="font-medium">Haven AI đang phân tích dữ liệu...</span>
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

            {/* Chat Input Bar with Voice Mic Button */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder={isListening ? "Đang lắng nghe... Hãy nói yêu cầu của bạn" : "Nhập câu hỏi hoặc nói bằng micro..."}
                className="flex-1 px-3.5 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 focus:border-[#163300] transition-all disabled:opacity-50"
              />
              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceChat}
                title={isListening ? "Đang lắng nghe... Bấm để dừng và gửi" : "Nói bằng giọng nói"}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9FE870] hover:bg-[#8ee05b] disabled:bg-slate-100 dark:disabled:bg-slate-800 text-[#163300] disabled:text-slate-400 transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
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
