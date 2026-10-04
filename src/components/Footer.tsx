import React, { useState } from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Compass,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigateToSearch?: (keyword?: string) => void;
  onOpenLifestyleModal?: () => void;
  onOpenVisualModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToSearch,
  onOpenLifestyleModal,
  onOpenVisualModal
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="w-full mt-auto bg-[#F2F5F0] dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 rounded-t-[32px] pt-10 pb-6 px-6 sm:px-10 text-[#495E35] dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 sm:pr-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#163300] text-[#9FE870] flex items-center justify-center font-extrabold text-base shadow-sm">
                H
              </div>
              <span className="font-extrabold tracking-tight text-xl text-[#163300] dark:text-white">
                HAVEN
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8EC] text-[#163300] border border-[#9FE870]">
                PropTech
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Nền tảng công nghệ tìm kiếm & thẩm định không gian sống thế hệ mới, kết hợp AI phân tích dữ liệu cục bộ và Mô hình Thị giác CLIP ViT-B/32 trên 11 đô thị trọng điểm.
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                <span>Thái Nguyên • Hà Nội • TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                <span>Hotline 24/7: 1900 6868</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                <span>support@haven-residence.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Khám Phá Không Gian Sống */}
          <div className="space-y-3.5 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Bộ Sưu Tập Căn Hộ</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Japandi')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Japandi & Tối Giản Ấm Áp</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Indochine')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Indochine Đông Dương</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Penthouse')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Penthouse Sky Luxury</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Duplex')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Duplex Loft Thông Tầng</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Scandinavian')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Scandinavian Bắc Âu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Công Nghệ AI Độc Quyền */}
          <div className="space-y-3.5 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Công Nghệ Độc Bản</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenVisualModal}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span className="font-semibold text-[#163300] dark:text-[#9FE870]">Visual Vibe Search (CLIP)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLifestyleModal}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Khảo Sát Radar Phong Cách Sống</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('ngập úng')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Phân Tích Ngập Úng & Cao Độ</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('ô tô')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Thẩm Định Chỗ Đỗ Ô Tô Hầm</span>
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mô Phỏng True Cost Sinh Hoạt</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Pháp Lý & Bảo Chứng */}
          <div className="space-y-3.5 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Pháp Lý & An Toàn</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Quy Chuẩn PCCC QCVN 06:2022</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ký Quỹ Đặt Cọc Escrow 72h</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hợp Đồng Điện Tử E-Sign</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Biên Bản Bàn Giao 15 Hạng Mục</span>
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#163300] dark:group-hover:text-[#9FE870] transition-colors" />
                  <span>Chính Sách Bảo Mật Dữ Liệu</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Clean Minimal Copyright */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span>© 2026 HAVEN Residential Intelligence. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-[#163300] dark:hover:text-[#9FE870] transition-colors cursor-pointer"
            >
              Chính sách quyền riêng tư
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#163300] dark:hover:text-[#9FE870] transition-colors cursor-pointer"
            >
              Điều khoản sử dụng
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F8EC] dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#163300] dark:text-white">Chính Sách Quyền Riêng Tư & Bảo Mật HAVEN</h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-4 overflow-y-auto text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans pr-2">
              <p>
                <strong>1. Thu Thập Dữ Liệu:</strong> HAVEN chỉ thu thập thông tin định danh và số điện thoại cần thiết khi bạn tạo yêu cầu xem nhà hoặc ký kết hợp đồng điện tử theo tiêu chuẩn mã hóa SHA-256.
              </p>
              <p>
                <strong>2. Bảo Vệ Dữ Liệu Cục Bộ (Local AI):</strong> Mọi phân tích nhu cầu và khảo sát Gu Nhà Bạn được xử lý ngay tại trình duyệt của bạn (In-Browser Heuristics) hoặc mạng mô hình SLM cục bộ, không gửi lịch sử cá nhân lên máy chủ bên thứ ba mà không có sự đồng ý.
              </p>
              <p>
                <strong>3. Giao Dịch Escrow:</strong> Tiền ký quỹ bảo chứng được giữ trong tài khoản phong tỏa an toàn (MB Bank) và được bảo vệ 100% cho đến khi biên bản nhận nhà 15 mục được ký kết thành công.
              </p>
              <p>
                <strong>4. Quyền Của Người Dùng:</strong> Bạn có quyền yêu cầu xóa toàn bộ lịch sử trò chuyện và tài liệu đã tải lên bất kỳ lúc nào thông qua Cài Đặt Hồ Sơ hoặc liên hệ Hotline 1900 6868.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 rounded-full bg-[#163300] text-[#9FE870] font-bold text-xs cursor-pointer hover:bg-[#204500]"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F8EC] dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#163300] dark:text-white">Điều Khoản Dịch Vụ Nền Tảng HAVEN</h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-4 overflow-y-auto text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans pr-2">
              <p>
                <strong>1. Phạm Vi Dịch Vụ:</strong> HAVEN cung cấp công nghệ kết nối khách thuê với chủ nhà đã xác minh danh tính và quyền sở hữu căn hộ (Verified Sanctuary Cấp 3).
              </p>
              <p>
                <strong>2. Tính Xác Thực Của Tin Đăng:</strong> 100% hình ảnh căn hộ là ảnh chụp thực tế hoặc mô phỏng 3D Matterport trực tiếp từ hiện trường, nghiêm cấm dùng ảnh mẫu 3D giả lập đánh lừa khách hàng.
              </p>
              <p>
                <strong>3. Điều Khoản Tiền Cọc 72 Giờ:</strong> Sau khi trả phòng hợp pháp và hoàn tất biên bản bàn giao, tiền cọc cam kết hoàn trả trong vòng 72 giờ qua tài khoản thụ hưởng của khách thuê.
              </p>
              <p>
                <strong>4. Trách Nhiệm Pháp Lý:</strong> Hợp đồng điện tử ký kết trên nền tảng tuân thủ Luật Giao dịch Điện tử Việt Nam và có giá trị pháp lý tương đương bản ký tay.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 rounded-full bg-[#163300] text-[#9FE870] font-bold text-xs cursor-pointer hover:bg-[#204500]"
              >
                Đồng Ý & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
