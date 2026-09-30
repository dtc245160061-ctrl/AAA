import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Flame, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ExternalLink,
  Layers,
  Heart
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
    <footer className="relative mt-20 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl overflow-hidden text-slate-400">
      {/* Subtle Gradient Glow at top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* Top Section: Trust Badges Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10 border-b border-slate-800/70">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-xs text-slate-100 uppercase tracking-wide">
                Bảo Chứng Ký Quỹ Escrow
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Tiền cọc được khóa an toàn, hoàn 100% trong 72h nếu nhà sai cam kết.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-xs text-slate-100 uppercase tracking-wide">
                Kiểm Định PCCC QCVN 06:2022
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                100% tòa nhà được rà soát chứng nhận thẩm duyệt & lối thoát nạn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-xs text-slate-100 uppercase tracking-wide">
                Pháp Lý & Hợp Đồng E-Sign
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Ký số trực tuyến chuẩn Nghị định 96/2024/NĐ-CP và Luật Nhà ở.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Identity (2 cols on tablet) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black font-serif text-lg">
                H
              </div>
              <span className="font-serif font-black tracking-widest text-lg text-slate-100">
                HAVEN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                v2.5.2
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              Nền tảng công nghệ bất động sản thế hệ mới (PropTech Platform) kết hợp Trí tuệ nhân tạo cục bộ (Local Edge AI) và Mô hình Thị giác CLIP ViT-B/32, mang lại trải nghiệm tìm thuê nhà an yên trên khắp 63 tỉnh thành Việt Nam.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-2">
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

          {/* Col 2: Khám Phá Không Gian Sống */}
          <div className="space-y-3">
            <div className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200">
              Phong Cách Thiết Kế
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Japandi')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Japandi & Tối Giản Ấm Áp
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Indochine')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Indochine Đông Dương
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Penthouse')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Penthouse Sky Luxury
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Duplex')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Duplex Loft Thông Tầng
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Cổ Điển')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Tân Cổ Điển Hoàng Gia
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSearch?.('Scandinavian')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Scandinavian Bắc Âu
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Công Nghệ AI Đột Phá */}
          <div className="space-y-3">
            <div className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200">
              Công Nghệ Trí Tuệ AI
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenVisualModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-emerald-300 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visual Vibe Search (CLIP)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLifestyleModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Khảo Sát Radar Phong Cách Sống
                </button>
              </li>
              <li>
                <span className="text-slate-400">
                  Local SLM Edge Advisor
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Phân Tích Ngập Úng & Cao Độ
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Thẩm Định Chỗ Đỗ Ô Tô Hầm
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Mô Phỏng True Cost Sinh Hoạt
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Pháp Lý & Cam Kết */}
          <div className="space-y-3">
            <div className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200">
              Pháp Lý & An Toàn
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Quy Chuẩn PCCC QCVN 06:2022
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Nghị Định 96/2024/NĐ-CP BĐS
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Chính Sách Khóa Cọc Escrow
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Mẫu Biên Bản Bàn Giao 15 Hạng Mục
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Chính Sách Bảo Mật Dữ Liệu
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Điều Khoản Sàn Giao Dịch
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Academic Credentials & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-center sm:text-left">
            <span>Đồ án Chuyên ngành Ứng dụng Trí tuệ Nhân tạo</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-400 font-bold">KHMT K23A</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Local Edge Engine: Hoạt động</span>
            </div>
            <span>•</span>
            <span>© 2026 HAVEN Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
