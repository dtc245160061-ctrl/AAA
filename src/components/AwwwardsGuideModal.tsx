import React from 'react';
import { X, Sparkles, Layers, Cpu, Rocket } from 'lucide-react';

interface AwwwardsGuideModalProps {
  onClose: () => void;
}

export const AwwwardsGuideModal: React.FC<AwwwardsGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in text-left">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                AWWWARDS MASTERCLASS GUIDE
              </span>
              <h2 className="text-2xl font-bold text-white font-['Cinzel']">
                Bí Kíp Xây Dựng Web App Xịn Chuẩn Awwwards
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Core Mindset Shift */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-white/5">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              1. Hiểu Đúng: Ngôn Ngữ Nào Cho Giao Diện "Xịn" Đỉnh Cao?
            </h3>
            <p>
              Rất nhiều người mới thường thắc mắc: <em className="text-amber-200">"Dùng C#, Python hay Java để giao diện đẹp hơn?"</em>. 
              Thực tế: <strong className="text-white">Toàn bộ ứng dụng Web hiển thị trên trình duyệt VẪN 100% LÀ HTML, CSS và JavaScript/TypeScript.</strong>
            </p>
            <p>
              Ngôn ngữ máy chủ (Python/Node.js/Go) xử lý cơ sở dữ liệu. Nhưng để ứng dụng có giao diện **đỉnh như Awwwards**, bí kíp nằm ở **Frontend Framework & Animation System** trên trình duyệt:
            </p>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Cinzel']">
              <Layers className="w-5 h-5 text-cyan-400" />
              2. Bộ Công Cụ (Tech Stack) Của Chiếc App Bạn Đang Trải Nghiệm
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">1. Giao Diện & Logic (UI Shell)</span>
                <h4 className="text-base font-bold text-white">React 19 + TypeScript + Vite</h4>
                <p className="text-xs text-slate-400">
                  Tải siêu nhanh (SPA), render giao diện mượt mà không reload trang, quản lý state chuyên nghiệp.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">2. Thiết Kế & Màu Sắc (Styling)</span>
                <h4 className="text-base font-bold text-white">Tailwind CSS v4 + Glassmorphism</h4>
                <p className="text-xs text-slate-400">
                  Tông màu tối Obsidian neutral (`#07080B`), hiệu ứng kính làm mờ (backdrop-blur 20px), viền 1px siêu tinh tế.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase font-mono">3. Chuyển Động (Physics Motion)</span>
                <h4 className="text-base font-bold text-white">Framer Motion & Custom Bezier</h4>
                <p className="text-xs text-slate-400">
                  Đường cong chuyển động `cubic-bezier(0.16, 1, 0.3, 1)`, hover magnetic, scale(0.98) khi nhấn nút.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Step Roadmap */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Cinzel']">
              <Rocket className="w-5 h-5 text-emerald-400" />
              3. Lộ Trình 5 Bước Làm App Quản Lý Căn Hộ Từ Con Số 0
            </h3>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  title: 'Định Hình Sản Phẩm (Product Spec)',
                  desc: 'Xác định bài toán: App Quản Lý Căn Hộ sẽ gồm 4 module chính: Sơ đồ mặt bằng 3D/Isometric, Doanh thu dòng tiền, Đặt tiện ích Sky Pool/Sommelier, và Trung tâm bảo trì IoT.',
                },
                {
                  step: '02',
                  title: 'Xây Dựng Design System & Bảng Màu (Color Palette)',
                  desc: 'Tránh màu đỏ/xanh thô sơ. Sử dụng màu tối Obsidian (#07080B), accent Vàng Kim Amber (#F59E0B) cho Penthouse, Xanh Ngọc Emerald cho căn có cư dân, và Xanh Cyan cho cảm biến IoT.',
                },
                {
                  step: '03',
                  title: 'Khởi Tạo Dự Án Với React + Vite',
                  desc: 'Chạy lệnh npx create-vite@latest apartment-app --template react-ts để có ngay môi trường code chuẩn quốc tế.',
                },
                {
                  step: '04',
                  title: 'Phát Triển Các Component Tương Tác',
                  desc: 'Viết các thẻ Card căn hộ có hiệu ứng hover glassmorphism, Modal điều khiển khoá cửa IoT, Biểu đồ doanh thu dạng SVG mượt mà.',
                },
                {
                  step: '05',
                  title: 'Kết Nối Backend & Database (Node.js / Supabase / PostgreSQL)',
                  desc: 'Gửi và nhận dữ liệu thời gian thực (Websockets) từ cảm biến khoá thông minh và hệ thống điều hoà HVAC.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 glass-panel rounded-xl border border-white/10 items-start">
                  <span className="text-lg font-bold font-mono text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-amber-500/10 to-amber-700/10 border border-amber-500/30 rounded-2xl text-center space-y-2">
            <h4 className="text-base font-bold text-amber-300">Bạn Đang Cầm Trong Tay Dự Án Mẫu Đầy Đủ!</h4>
            <p className="text-xs text-slate-300">
              Tôi đã tạo toàn bộ mã nguồn của Web App này tại thư mục{' '}
              <code className="text-amber-400 bg-black/60 px-2 py-0.5 rounded font-mono">
                C:\Users\zeecu\.gemini\antigravity-ide\scratch\apartment-management-app
              </code>
              . Bạn có thể mở mã nguồn lên xem, chỉnh sửa và học từng dòng code!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
