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
  Maximize2,
  FileText,
  Handshake,
  Calendar,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { type RagRetrievalResult } from '../services/geminiRagService';
import { askHavenLocalSlm, checkLocalSlmStatus } from '../services/localAiService';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';
import { ApartmentStore } from '../data/apartmentStore';
import { parseNaturalLanguageQuery } from '../services/aiAdvisorService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
  sources?: RagRetrievalResult[];
  suggestedAction?: {
    type: 'apply_filters' | 'negotiate_price' | 'draft_contract' | 'calculate_true_cost' | 'schedule_viewing' | 'fill_listing';
    queryText: string;
    payload?: any;
  };
}

interface UserAiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  units?: ApartmentUnit[];
  onApplyAiSearch: (queryText: string) => void;
  onSelectUnit?: (unitId: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const UserAiAdvisorDrawer: React.FC<UserAiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  units,
  onApplyAiSearch,
  onSelectUnit,
  initialPrompt,
  onClearInitialPrompt
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

  // Dynamically check Local Edge SLM status when drawer opens, with retry
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    let retries = 0;

    const check = () => {
      checkLocalSlmStatus().then(st => {
        if (!mounted) return;
        setSlmStatus({ isAvailable: st.isAvailable, model: st.model });
        if (!st.isAvailable && retries < 4) {
          retries++;
          setTimeout(check, 2000);
        }
      });
    };

    check();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Resizable drawer state (default 520px wide x 620px high)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 520,
    height: 620
  });
  const isResizingRef = useRef<'top' | 'left' | 'corner' | null>(null);
  const startPosRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 520,
    startH: 620
  });

  // Human-readable criteria summary formatter (No JSON)
  const formatCriteriaSummary = (payload?: any): string => {
    if (!payload) return 'Tất cả tiêu chí';
    const parts: string[] = [];
    if (payload.city) parts.push(`📍 ${payload.city}${payload.district ? ', ' + payload.district : ''}`);
    else if (payload.district) parts.push(`📍 ${payload.district}`);
    if (payload.bedrooms) parts.push(`🛏️ ${payload.bedrooms} Phòng ngủ`);
    else if (payload.minBedrooms) parts.push(`🛏️ Từ ${payload.minBedrooms} Phòng ngủ`);
    if (payload.maxRentVND) parts.push(`💰 Dưới ${(payload.maxRentVND / 1000000).toFixed(0)} Tr/tháng`);
    if (payload.hasCarParking) parts.push(`🚗 Có chỗ đỗ ô tô`);
    if (payload.petFriendly) parts.push(`🐾 Cho phép thú cưng`);
    return parts.length > 0 ? parts.join('  •  ') : 'Tiêu chí tìm kiếm chuẩn';
  };

  // Find 3 to 5 matching apartments (Sweet spot = 5)
  const getMatchingApartments = (msg: Message): ApartmentUnit[] => {
    const all = units && units.length > 0 ? units : ApartmentStore.getUnits();
    if (!all || all.length === 0) return [];

    // ONLY render cards if this message is explicitly an apply_filters search action
    if (msg.suggestedAction?.type !== 'apply_filters') return [];

    const payload = msg.suggestedAction?.payload || {};
    const parsed = parseNaturalLanguageQuery(msg.suggestedAction?.queryText || msg.text || '');
    const filterCity = payload.city || parsed.extractedFilters.city;
    const filterDistrict = payload.district || parsed.extractedFilters.district;
    const filterBedrooms = payload.bedrooms || parsed.extractedFilters.minBedrooms;
    const filterMaxRent = payload.maxRentVND || parsed.extractedFilters.maxRentVND;
    const filterCar = payload.hasCarParking !== undefined ? payload.hasCarParking : parsed.classification.required.includes('car_parking');

    const sourceIds = (msg.sources || [])
      .filter(s => s.chunk.category === 'apartment')
      .map(s => s.chunk.metadata?.unitId || s.chunk.id);

    const scored = all.map(u => {
      let score = 0;
      if (sourceIds.includes(u.id)) score += 100;
      if (filterCity && u.city.toLowerCase().includes(filterCity.toLowerCase())) score += 50;
      if (filterDistrict && u.district.toLowerCase().includes(filterDistrict.toLowerCase())) score += 40;
      if (filterBedrooms) {
        if (u.bedrooms === filterBedrooms) score += 30;
        else if (u.bedrooms > filterBedrooms) score += 10;
      }
      if (filterMaxRent) {
        if (u.monthlyRentVND <= filterMaxRent) score += 25;
        else score -= 30;
      }
      if (filterCar && u.hasCarParking) score += 20;
      return { unit: u, score };
    });

    scored.sort((a, b) => b.score - a.score);
    // Take sweet spot of 5 apartments
    return scored.slice(0, 5).map(s => s.unit);
  };

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

  // Trigger initial prompt if passed from apartment detail or comparison view
  const lastAutoSentPromptRef = useRef<string>('');
  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt.trim() && initialPrompt !== lastAutoSentPromptRef.current) {
      lastAutoSentPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [isOpen, initialPrompt]);

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
          className="fixed rounded-[28px] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.65)] border-2 border-slate-300 dark:border-slate-700 ring-1 ring-slate-400/25 bg-white dark:bg-slate-900 flex flex-col text-slate-900 dark:text-slate-100 font-sans select-none"
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
                      <span className={`w-1.5 h-1.5 rounded-full ${slmStatus.isAvailable ? 'bg-[#163300] dark:bg-[#9FE870]' : 'bg-emerald-500'} animate-pulse`} />
                      <span>{slmStatus.isAvailable ? `Local Qwen (${slmStatus.model || '3B'})` : 'Offline RAG 1,700 Căn'}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {slmStatus.isAvailable ? 'Local Edge SLM (Ollama:11434) • 100% Offline' : 'Hệ thống RAG Cục Bộ • 1,700 Căn Hộ'}
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
              {messages.map(msg => {
                const cleanDisplayMsg = msg.text
                  .replace(/```json[\s\S]*?```/gi, '')
                  .replace(/```[\s\S]*?```/gi, '')
                  .replace(/\{\s*"action"[\s\S]*?\}/gi, '')
                  .trim();
                
                const matchingApartments = msg.sender === 'ai' ? getMatchingApartments(msg) : [];

                return (
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
                      className={`max-w-[94%] px-3.5 py-2.5 rounded-[22px] space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-[#163300] text-white font-medium rounded-tr-xs shadow-sm'
                          : 'bg-[#EAEFE8] dark:bg-slate-800/95 border border-slate-300/80 dark:border-slate-600/80 text-slate-850 dark:text-slate-100 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {cleanDisplayMsg && (
                        <p className="whitespace-pre-line leading-relaxed text-[12.5px] sm:text-[13px]">
                          {cleanDisplayMsg}
                        </p>
                      )}

                      {/* Matching 3 to 5 Apartment Interactive Cards (Sweet spot: 5) */}
                      {matchingApartments.length > 0 && (
                        <div className="pt-2 space-y-2 select-none">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-0.5">
                            <span>GỢI Ý CĂN HỘ PHÙ HỢP ({matchingApartments.length} CĂN)</span>
                            <span className="text-[10px] text-[#163300] dark:text-[#9FE870] font-semibold">Bấm thẻ để xem chi tiết</span>
                          </div>

                          <div className="space-y-1.5">
                            {matchingApartments.map(u => (
                              <div
                                key={u.id}
                                onClick={() => {
                                  onSelectUnit?.(u.id);
                                  onClose();
                                }}
                                className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 hover:border-[#163300] dark:hover:border-[#9FE870] hover:shadow-md transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 group active:scale-[0.99]"
                              >
                                {/* Thumbnail Image */}
                                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                                  <img
                                    src={(u.images && u.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300'}
                                    alt={u.name || u.id}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded-xs bg-black/70 text-[9px] font-bold text-white tabular-nums">
                                    {u.id}
                                  </span>
                                </div>

                                {/* Unit Specs & Details */}
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors">
                                      {u.name || `Căn hộ ${u.id}`}
                                    </h4>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] group-hover:translate-x-0.5 transition-all shrink-0" />
                                  </div>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-black text-xs sm:text-sm text-[#163300] dark:text-[#9FE870] tabular-nums">
                                      {(u.monthlyRentVND / 1000000).toFixed(1)} Tr/tháng
                                    </span>
                                    {u.trueCost?.totalMonthlyEstimatedVND && (
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                        (True Cost ~{(u.trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1)} Tr)
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    📍 {u.district}, {u.city}
                                  </p>
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[10px]">
                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                      🛏️ {u.bedrooms} PN
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                      🚿 {u.bathrooms} WC
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                      📐 {u.sqm}m²
                                    </span>
                                    {u.hasCarParking && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] font-semibold">
                                        🚗 Đỗ ô tô
                                      </span>
                                    )}
                                    {u.pcccReport?.inspectionCertificateStatus === 'certified' && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
                                        🛡️ PCCC QCVN
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Agentic Action Chips & Criteria Summary */}
                      {msg.suggestedAction && (
                        <div className="pt-2 space-y-2">
                          {msg.suggestedAction.type === 'apply_filters' && (
                            <div className="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 space-y-2.5">
                              <div className="text-[11.5px] font-medium text-emerald-950 dark:text-emerald-200 flex flex-wrap items-center gap-1.5 leading-relaxed">
                                <span className="font-bold text-emerald-800 dark:text-emerald-300">🔍 Tiêu chí áp dụng:</span>
                                <span>{formatCriteriaSummary(msg.suggestedAction.payload)}</span>
                              </div>
                              <button
                                onClick={() => {
                                  onApplyAiSearch(msg.suggestedAction!.queryText);
                                  onClose();
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#163300] text-[#9FE870] hover:bg-[#204500] font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                              >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Áp dụng vào bộ lọc tìm kiếm</span>
                              </button>
                            </div>
                          )}

                          {msg.suggestedAction.type === 'negotiate_price' && (
                            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-[11px] space-y-2">
                              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                <Handshake className="w-3.5 h-3.5" />
                                <span>Chiến Lược Đàm Phán Tiền Thuê</span>
                              </div>
                              <p className="text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                                {msg.suggestedAction.payload?.strategy || 'Đề xuất ký hợp đồng 12 - 24 tháng hoặc thanh toán trước 3 - 6 tháng để nhận chiết khấu 5% - 10%'}
                              </p>
                              <button
                                onClick={() => {
                                  onApplyAiSearch(msg.suggestedAction!.queryText);
                                  onClose();
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <span>Xem căn hộ & gửi đề xuất</span>
                              </button>
                            </div>
                          )}

                          {msg.suggestedAction.type === 'draft_contract' && (
                            <button
                              onClick={() => {
                                onApplyAiSearch(msg.suggestedAction!.queryText);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163300] text-[#9FE870] hover:bg-[#204500] font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Mở Mẫu Hợp Đồng Thuê E-Sign</span>
                            </button>
                          )}

                          {msg.suggestedAction.type === 'schedule_viewing' && (
                            <button
                              onClick={() => {
                                onApplyAiSearch(msg.suggestedAction!.queryText);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Xác Nhận Đặt Lịch Xem Căn Hộ</span>
                            </button>
                          )}

                          {msg.suggestedAction.type === 'calculate_true_cost' && (
                            <button
                              onClick={() => {
                                onApplyAiSearch(msg.suggestedAction!.queryText);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Bóc Tách Chi Phí True Cost Chi Tiết</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Loader Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-xl bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#F7FAF6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs shadow-2xs">
                    <Loader2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] animate-spin" />
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
