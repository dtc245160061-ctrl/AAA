import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Building, 
  Zap
} from 'lucide-react';
import type { ApartmentUnit, ChatConversation, ChatMessage } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: ApartmentUnit;
  customerName?: string;
  customerPhone?: string;
  onOpenBookingModal?: (unit: ApartmentUnit) => void;
  onShowToast?: (type: 'success' | 'info', title: string, desc?: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  unit,
  customerName = 'Khách Thuê HAVEN',
  customerPhone = '0988 888 888',
  onOpenBookingModal
}) => {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && unit) {
      const conv = ApartmentStore.getOrCreateConversation(
        unit.id,
        unit.name || unit.id,
        customerName,
        customerPhone
      );
      setConversation(conv);
    }
  }, [isOpen, unit, customerName, customerPhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!isOpen || !unit) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !conversation) return;

    ApartmentStore.sendMessage(conversation.id, 'user', customerName, text);
    const updated = ApartmentStore.getConversations().find(c => c.id === conversation.id);
    if (updated) setConversation({ ...updated });
    setInputText('');

    // Simulate smart bot response after 800ms
    setTimeout(() => {
      let botResponse = 'Cảm ơn bạn đã nhắn tin! Ban Quản Trị đã nhận được thông tin và sẽ phản hồi bạn trong 5 phút nữa.';
      if (text.includes('lịch') || text.includes('xem')) {
        botResponse = `Lịch xem căn ${unit.name || unit.id} đang mở từ 09:00 - 18:00 hàng ngày. Bạn có thể nhấn nút "Đặt Lịch Xem Ngay" bên dưới để chọn giờ nhé!`;
      } else if (text.includes('cọc') || text.includes('hợp đồng') || text.includes('giá')) {
        botResponse = `Căn ${unit.name || unit.id} có giá ${(unit.monthlyRentVND / 1000000).toFixed(0)} Triệu/tháng, tiền cọc 02 tháng, ký hợp đồng tối thiểu 6-12 tháng.`;
      }

      const convs = ApartmentStore.getConversations();
      const current = convs.find(c => c.id === conversation.id);
      if (current) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          conversationId: conversation.id,
          sender: 'bot',
          senderName: 'Trợ Lý Tự Động HAVEN',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        current.messages.push(botMsg);
        current.lastMessage = botResponse;
        ApartmentStore.saveConversations(convs);
        setConversation({ ...current });
      }
    }, 800);
  };

  const quickReplies = [
    { label: '📅 Xem lịch phòng còn trống', text: 'Cho mình hỏi lịch xem phòng còn trống vào ngày nào?' },
    { label: '💰 Tiền cọc & Điều khoản thuê', text: 'Căn này tiền đặt cọc và chu kỳ đóng tiền như thế nào?' },
    { label: '🚗 Chỗ đỗ ô tô & Phí dịch vụ', text: 'Căn hộ có chỗ đỗ ô tô dưới hầm và phí dịch vụ bao nhiêu 1 tháng?' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="max-w-lg w-full h-[620px] rounded-3xl atmospheric-panel border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
        {/* Topbar / Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-slate-100 text-sm line-clamp-1">
                  {unit.name || unit.id}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Trực tuyến" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">{(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng</span>
                <span>•</span>
                <span>Ban Quản Trị Trực Tuyến</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar Banner */}
        <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phản hồi tức thì trong 60 giây</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenBookingModal?.(unit);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition-all"
          >
            Đặt Lịch Xem Ngay
          </button>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
          {conversation?.messages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono ${
                    isBot ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                )}

                <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] font-mono text-slate-500 px-1">
                    {msg.senderName} • {msg.timestamp}
                  </div>
                  <div className={`p-3 rounded-2xl leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                      : isBot
                      ? 'bg-slate-900/90 text-slate-200 border border-emerald-500/30 rounded-tl-sm'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {isMe && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips (Shopee Style) */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.text)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 border border-slate-700 text-[11px] font-mono whitespace-nowrap transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Nhập tin nhắn hỏi ban quản lý..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs font-sans focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 shrink-0 hover:scale-105"
            title="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
