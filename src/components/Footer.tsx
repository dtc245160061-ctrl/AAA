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
    <footer className="relative mt-24 bg-transparent overflow-hidden text-slate-400">
      {/* Seamless Top Hairline Divider with Subtle Emerald Glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 via-slate-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 pb-12">
          
          {/* Brand & Mission Column (Col 1 & 2) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black font-serif text-lg tracking-wider">
                H
              </div>
              <span className="font-serif font-black tracking-widest text-xl text-slate-100">
                HAVEN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                v2.5.2
              </span>
            </div>

            <p className="text-xs text-slate-400/90 leading-relaxed font-sans max-w-md">
              Nền tảng công nghệ tìm kiếm và thẩm định không gian sống thế hệ mới (PropTech Platform). Tích hợp Trí tuệ Nhân tạo cục bộ (Local Edge AI) và Mô hình Thị giác CLIP ViT-B/32, mang lại trải nghiệm tìm thuê nhà an yên trên khắp 63 tỉnh thành Việt Nam.
            </p>

            <div className="space-y-2 text-xs font-mono text-slate-400/80 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Thái Nguyên • Hà Nội • TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hotline 24/7: 1900 6868 (Bảo Chứng Escrow)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@haven-residence.vn</span>
              </div>
            </div>
          </div>

          {/* Col 3: Không Gian Sống */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Không Gian Sống</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Japandi')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Japandi & Tối Giản Ấm Áp</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Indochine')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Indochine Đông Dương</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Penthouse')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Penthouse Sky Luxury</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Duplex')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Duplex Loft Thông Tầng</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Scandinavian')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Scandinavian Bắc Âu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Công Nghệ AI Độc Quyền */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Công Nghệ AI</span>
            </div>
            <ul className="space-y-2.5 text-xs">
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
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Khảo Sát Radar Phong Cách</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('ngập úng')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Phân Tích Ngập Úng & Cao Độ</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('ô tô')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  <span>Thẩm Định Chỗ Đỗ Ô Tô Hầm</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-700" />
                  <span>Mô Phỏng True Cost Sinh Hoạt</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Pháp Lý & Bảo Chứng */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pháp Lý & An Toàn</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-slate-400/90 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Quy Chuẩn PCCC QCVN 06:2022</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Ký Quỹ Đặt Cọc Escrow 72h</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Hợp Đồng Điện Tử E-Sign</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Biên Bản Bàn Giao 15 Hạng Mục</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400/90 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Chính Sách Bảo Mật Dữ Liệu</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Academic Credentials & Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-center sm:text-left">
            <span>Đồ án Chuyên ngành Ứng dụng Trí tuệ Nhân tạo</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">KHMT K23A</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Local Edge Engine: Hoạt động</span>
            </div>
            <span className="text-slate-600">•</span>
            <span>© 2026 HAVEN Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
