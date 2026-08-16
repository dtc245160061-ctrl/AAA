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
      const lower = text.toLowerCase();

      if (lower.includes('lịch') || lower.includes('xem')) {
        botResponse = `Lịch xem căn ${unit.name || unit.id} đang mở từ 09:00 - 18:00 hàng ngày. Bạn có thể nhấn nút "Đặt Lịch Xem Ngay" bên dưới để chọn khung giờ thuận tiện nhất nhé!`;
      } else if (lower.includes('cọc') || lower.includes('hoàn cọc')) {
        const months = unit.depositTerms?.months || 2;
        const depositM = ((unit.depositTerms?.amountVND || unit.monthlyRentVND * months) / 1000000).toFixed(0);
        botResponse = `Căn này có mức đặt cọc là ${months} tháng (${depositM} Triệu). HAVEN cam kết hoàn cọc minh bạch qua chuyển khoản trong vòng 72 giờ sau khi trả phòng theo đúng biên bản hiện trạng ban đầu.`;
      } else if (lower.includes('điện') || lower.includes('phí') || lower.includes('chi phí') || lower.includes('nước')) {
        const trueCostTotal = ((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1);
        botResponse = `Tổng chi phí thực tế ước tính của căn này là ${trueCostTotal} Triệu/tháng (đã gồm: thuê ${(unit.monthlyRentVND / 1000000).toFixed(0)} Tr + điện ước tính ~850k + nước + cáp quang 250k + phí QL tòa nhà). Không có chi phí ẩn phát sinh.`;
      } else if (lower.includes('pccc') || lower.includes('cháy') || lower.includes('thoát hiểm')) {
        const count = unit.pcccReport?.fireEscapeCount || 2;
        botResponse = `Tòa nhà đã được thẩm duyệt nghiệm thu PCCC đạt chuẩn QCVN 06:2022, trang bị ${count} thang thoát hiểm điều áp chống khói và hệ thống sprinkler tự động trong từng phòng.`;
      } else if (lower.includes('thú cưng') || lower.includes('chó') || lower.includes('mèo')) {
        botResponse = unit.petFriendly 
          ? `Căn hộ này CHO PHÉP nuôi thú cưng nhỏ (chó/mèo dưới 10kg). Tòa nhà có khuôn viên dạo bộ riêng và không phụ thu phí thú cưng!`
          : `Rất tiếc, quy chế tòa nhà này hiện KHÔNG cho phép nuôi thú cưng để đảm bảo yên tĩnh tuyệt đối cho cư dân.`;
      } else if (lower.includes('xe') || lower.includes('ô tô')) {
        botResponse = unit.hasCarParking
          ? `Căn hộ CÓ SẴN chỗ đỗ ô tô định danh tại tầng hầm B1/B2 với cổng sạc xe điện EV. Phí gửi ô tô là 1.200.000 đ/tháng.`
          : `Tòa nhà có bãi đỗ xe máy không giới hạn (120k/tháng), riêng ô tô có thể gửi tại bãi đỗ thương mại cách sảnh 100m.`;
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

  const dynamicQuickReplies = [
    { label: '📅 Lịch xem phòng', text: 'Cho mình hỏi lịch xem phòng còn trống vào khung giờ nào?' },
    { label: '💡 Tổng chi phí điện nước', text: 'Tổng chi phí thực tế gồm điện, nước và phí quản lý hàng tháng là bao nhiêu?' },
    { label: '🔥 Kiểm tra an toàn PCCC', text: 'Tòa nhà đã nghiệm thu PCCC và có mấy thang thoát hiểm?' },
    { label: '💰 Điều khoản hoàn cọc', text: 'Chính sách đặt cọc và cam kết hoàn cọc trong 72 giờ như thế nào?' },
    ...(unit.petFriendly ? [{ label: '🐾 Nuôi thú cưng', text: 'Nuôi mèo hoặc cún nhỏ ở căn này có quy định gì không?' }] : [])
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
          {dynamicQuickReplies.map((chip, idx) => (
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
