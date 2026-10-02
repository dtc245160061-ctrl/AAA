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
      } else if (lower.includes('xe') || lower.includes('ô tô') || lower.includes('xe máy') || lower.includes('đỗ xe')) {
        botResponse = unit.hasCarParking
          ? `Căn hộ CÓ SẴN chỗ đỗ ô tô định danh tại tầng hầm B1/B2 với cổng sạc xe điện EV. Phí gửi ô tô là 1.200.000 đ/tháng.`
          : `Tòa nhà có bãi đỗ xe máy không giới hạn (120k/tháng), riêng ô tô có thể gửi tại bãi đỗ thương mại cách sảnh 100m.`;
      } else if (lower.includes('đàm phán') || lower.includes('giảm giá') || lower.includes('thương lượng') || lower.includes('bớt') || lower.includes('mặc cả') || lower.includes('mách')) {
        const baseM = (unit.monthlyRentVND / 1000000).toFixed(0);
        const discountTarget = (unit.monthlyRentVND * 0.92 / 1000000).toFixed(1);
        botResponse = `Căn này chủ đang chào ${baseM} triệu/tháng. Một số gợi ý thương lượng thực tế:\n\n1. Ký hợp đồng dài hạn (1-2 năm) và thanh toán trước 3-6 tháng để đề xuất mức giá ${discountTarget} triệu.\n2. Đề nghị chủ nhà bao trọn phí dịch vụ quản lý và gửi xe.\n3. Sử dụng bảo chứng cọc HAVEN Escrow để chủ nhà an tâm và giảm bớt tiền cọc ban đầu.`;
      }

      const convs = ApartmentStore.getConversations();
      const current = convs.find(c => c.id === conversation.id);
      if (current) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          conversationId: conversation.id,
          sender: 'bot',
          senderName: 'Trợ Lý HAVEN',
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
    { label: '🤝 Mách nước đàm phán giá', text: 'Mách mình cách mặc cả giá thuê căn này với chủ nhà sao cho khéo?' },
    { label: '📅 Lịch xem phòng', text: 'Cho mình hỏi lịch xem phòng còn trống vào khung giờ nào?' },
    { label: '💡 Chi phí điện nước', text: 'Tổng chi phí thực tế gồm điện, nước và phí quản lý hàng tháng là bao nhiêu?' },
    { label: '🔥 An toàn PCCC', text: 'Tòa nhà đã nghiệm thu PCCC và có mấy thang thoát hiểm?' },
    { label: '💰 Quy định hoàn cọc', text: 'Chính sách đặt cọc và cam kết hoàn cọc trong 72 giờ như thế nào?' },
    ...(unit.petFriendly ? [{ label: '🐾 Nuôi thú cưng', text: 'Nuôi mèo hoặc cún nhỏ ở căn này có quy định gì không?' }] : [])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="max-w-lg w-full h-[620px] rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Topbar / Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center shadow-2xs shrink-0 font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-[#163300] dark:text-white line-clamp-1">
                  {unit.name || unit.id}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#20A05A] dark:bg-[#9FE870] animate-pulse" title="Trực tuyến" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-[#20A05A] dark:text-[#9FE870] font-bold tabular-nums">
                  {(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng
                </span>
                <span>•</span>
                <span>Ban Quản Trị Trực Tuyến</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar Banner */}
        <div className="px-4 py-2.5 bg-[#E8F8EC] dark:bg-emerald-950/30 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#163300] dark:text-[#9FE870] font-bold">
            <Zap className="w-3.5 h-3.5 text-[#20A05A] dark:text-[#9FE870]" />
            <span>Phản hồi tức thì trong 60 giây</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenBookingModal?.(unit);
            }}
            className="px-3.5 py-1 rounded-full bg-[#163300] hover:bg-[#20A05A] text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
          >
            Đặt Lịch Xem Ngay
          </button>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {conversation?.messages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot ? 'bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870]' : 'bg-[#EBF2FC] text-[#2570EB]'
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                )}

                <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] text-slate-400 px-1 font-medium">
                    {msg.senderName} • {msg.timestamp}
                  </div>
                  <div className={`p-3 rounded-[20px] leading-relaxed ${
                    isMe
                      ? 'bg-[#163300] text-white font-medium rounded-tr-xs shadow-xs'
                      : isBot
                      ? 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 rounded-tl-xs'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>

                {isMe && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-[#F9FAF8] dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {dynamicQuickReplies.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.text)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#163300] text-[11px] font-medium whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Nhập tin nhắn hỏi ban quản lý..."
            className="flex-1 px-4 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 focus:border-[#163300] transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] disabled:bg-slate-100 dark:disabled:bg-slate-800 text-[#163300] disabled:text-slate-400 flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
            title="Gửi tin nhắn"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
