import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, Filter } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { parseNaturalLanguageQuery, calculateMatchScore } from '../services/aiAdvisorService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: {
    type: 'apply_filters';
    queryText: string;
  };
}

interface UserAiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  units: ApartmentUnit[];
  onApplyAiSearch: (queryText: string) => void;
}

export const UserAiAdvisorDrawer: React.FC<UserAiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  units,
  onApplyAiSearch
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Xin chào! Tôi là Trợ lý AI Tư Vấn Không Gian Sống HAVEN.\n\nHãy chia sẻ mong muốn của bạn (ví dụ: thành phố, tầm ngân sách hàng tháng, số phòng ngủ, chỗ đỗ xe ô tô, yêu cầu yên tĩnh hay tránh ngập lụt...). Tôi sẽ phân tích và đề xuất các căn hộ phù hợp nhất cho bạn ngay lập tức.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim()
    };

    const parsed = parseNaturalLanguageQuery(inputValue.trim());
    
    // Find top matching units
    const scored = units.map(u => ({ unit: u, ...calculateMatchScore(u, parsed.extractedFilters) }))
      .sort((a, b) => b.score - a.score);
    
    const topUnit = scored[0]?.unit;

    let aiText = parsed.understoodText;
    if (parsed.followUpQuestion) {
      aiText += `\n\n📌 Gợi ý thêm: ${parsed.followUpQuestion}`;
    }
    if (topUnit) {
      aiText += `\n\n🏆 Lựa chọn tương thích cao nhất: ${topUnit.name || topUnit.id} (${(topUnit.monthlyRentVND / 1000000).toFixed(0)} Triệu/tháng)\nƯu điểm: ${topUnit.aiInsights.whyFit[0]}`;
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiText,
      suggestedAction: {
        type: 'apply_filters',
        queryText: inputValue.trim()
      }
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-emerald-500/30 liquid-glass-origin bg-slate-950/95 flex flex-col justify-between shadow-2xl backdrop-blur-2xl">
          {/* Top Bar Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-slate-100">Trợ Lý Nhà Ở HAVEN AI</h3>
                <p className="text-[11px] font-mono text-emerald-400">Tìm Kiếm Ngôn Ngữ Tự Nhiên & Môi Trường</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  {msg.suggestedAction && (
                    <button
                      onClick={() => {
                        onApplyAiSearch(msg.suggestedAction!.queryText);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[11px] transition-colors mt-2"
                    >
                      <Filter className="w-3 h-3" />
                      <span>Áp dụng bộ lọc này vào trang tìm kiếm</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi hoặc nhu cầu thuê nhà..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
