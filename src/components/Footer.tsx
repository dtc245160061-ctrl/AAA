import React from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Compass,
  ShieldCheck,
  ChevronRight
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
  return (
    <footer className="w-full mt-12 bg-[#F2F5F0] dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 rounded-t-[32px] pt-10 pb-6 px-6 sm:px-10 text-[#495E35] dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 sm:pr-4">
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
                <MapPin className="w-4 h-4 text-[#20A05A] shrink-0" />
                <span>Thái Nguyên • Hà Nội • TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#20A05A] shrink-0" />
                <span>Hotline 24/7: 1900 6868</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#20A05A] shrink-0" />
                <span>support@haven-residence.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Khám Phá Không Gian Sống */}
          <div className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#20A05A]" />
              <span>Bộ Sưu Tập Căn Hộ</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Japandi')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Japandi & Tối Giản Ấm Áp</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Indochine')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Indochine Đông Dương</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Penthouse')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Penthouse Sky Luxury</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Duplex')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Duplex Loft Thông Tầng</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('Scandinavian')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Scandinavian Bắc Âu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Công Nghệ AI Độc Quyền */}
          <div className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#20A05A]" />
              <span>Công Nghệ Độc Bản</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenVisualModal}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span className="font-semibold text-[#163300] dark:text-[#9FE870]">Visual Vibe Search (CLIP)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLifestyleModal}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Khảo Sát Radar Phong Cách Sống</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('ngập úng')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
                  <span>Phân Tích Ngập Úng & Cao Độ</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSearch?.('ô tô')}
                  className="hover:text-[#163300] dark:hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#20A05A] transition-colors" />
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
          <div className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#20A05A]" />
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
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Chính Sách Bảo Mật Dữ Liệu</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Clean Minimal Copyright */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 HAVEN Residential Intelligence. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs">
            <span>Phiên bản 2.5.2</span>
            <span>•</span>
            <span>Chính sách quyền riêng tư</span>
            <span>•</span>
            <span>Điều khoản sử dụng</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
