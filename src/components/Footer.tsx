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
    <footer className="relative w-full mt-12 pt-8 pb-6 bg-transparent text-slate-400 border-t border-white/[0.08]">
      {/* Subtle Hairline Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/35 via-slate-600/30 to-transparent" />

      <div className="w-full px-2 sm:px-4 space-y-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3.5 sm:pr-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-slate-950 font-black font-serif text-base shadow-sm shadow-emerald-500/20">
                H
              </div>
              <span className="font-serif font-black tracking-widest text-lg text-slate-100">
                HAVEN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                v2.5.2
              </span>
            </div>

            <p className="text-xs text-slate-400/90 leading-relaxed font-sans">
              Nền tảng công nghệ tìm kiếm & thẩm định không gian sống thế hệ mới (PropTech Platform), kết hợp Trí tuệ Nhân tạo cục bộ và Mô hình Thị giác CLIP ViT-B/32 trên 63 tỉnh thành Việt Nam.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-slate-400/80 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Thái Nguyên • Hà Nội • TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hotline 24/7: 1900 6868</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@haven-residence.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Khám Phá Không Gian Sống */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bộ Sưu Tập Căn Hộ</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('Japandi')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Japandi & Tối Giản Ấm Áp</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('Indochine')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Indochine Đông Dương</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('Penthouse')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Penthouse Sky Luxury</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('Duplex')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Duplex Loft Thông Tầng</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('Scandinavian')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Scandinavian Bắc Âu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Công Nghệ AI Độc Quyền */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Công Nghệ AI Đột Phá</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenVisualModal}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-emerald-400 font-semibold group"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Visual Vibe Search (CLIP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLifestyleModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Khảo Sát Radar Phong Cách Sống</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('ngập úng')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Phân Tích Ngập Úng & Cao Độ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSearch?.('ô tô')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Thẩm Định Chỗ Đỗ Ô Tô Hầm</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-700" />
                  <span>Mô Phỏng True Cost Sinh Hoạt</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Pháp Lý & Bảo Chứng */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pháp Lý & An Toàn</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400/90 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Quy Chuẩn PCCC QCVN 06:2022</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Ký Quỹ Đặt Cọc Escrow 72h</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Hợp Đồng Điện Tử E-Sign</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Biên Bản Bàn Giao 15 Hạng Mục</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Chính Sách Bảo Mật Dữ Liệu</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Academic Credentials & Copyright */}
        <div className="pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>Đồ án Chuyên ngành Ứng dụng Trí tuệ Nhân tạo</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400/90 font-bold">KHMT K23A</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Local Edge Engine: Hoạt động</span>
            </div>
            <span className="text-slate-600">•</span>
            <span>© 2026 HAVEN Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
