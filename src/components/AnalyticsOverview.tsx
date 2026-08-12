import React from 'react';
import { DollarSign, TrendingUp, Building, ShieldCheck, Zap } from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Doanh Thu Thuê Tháng Này</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-mono mt-3">$148,500</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-2 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% so với tháng trước</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Tỷ Lệ Lấp Đầy (Occupancy)</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-mono mt-3">94.2%</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-2 font-semibold">
            <span>30 / 32 Căn Hộ Đã Cho Thuê</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Chỉ Số Năng Lượng Xanh</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-mono mt-3">98.4 / 100</p>
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs mt-2 font-semibold">
            <span>Tối Ưu Hoá Bởi AI HVAC</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Vé Yêu Cầu Đang Mở</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-mono mt-3">2 Vé Active</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-2">
            <span>Thời gian xử lý TB: 18 phút</span>
          </div>
        </div>
      </div>

      {/* Dynamic Revenue Chart & Occupancy Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue SVG Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Biểu Đồ Doanh Thu & Dòng Tiền 2026</h3>
              <p className="text-xs text-slate-400">Số liệu thu từ tiền thuê căn hộ, phí dịch vụ & tiện ích Sky</p>
            </div>
            <span className="px-3 py-1 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              USD ($)
            </span>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Area path */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,70 T 420,40 L 500,30 L 500,190 L 0,190 Z"
                fill="url(#chartGrad)"
              />

              {/* Stroke path */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,70 T 420,40 L 500,30"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
              />

              {/* Points */}
              <circle cx="0" cy="160" r="5" fill="#F59E0B" />
              <circle cx="140" cy="110" r="5" fill="#F59E0B" />
              <circle cx="280" cy="70" r="5" fill="#F59E0B" />
              <circle cx="420" cy="40" r="5" fill="#F59E0B" />
              <circle cx="500" cy="30" r="6" fill="#FFF" stroke="#F59E0B" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
              <span>Tháng 1</span>
              <span>Tháng 2</span>
              <span>Tháng 3</span>
              <span>Tháng 4</span>
              <span>Tháng 5</span>
              <span>Tháng 6 (Hiện tại)</span>
            </div>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">Cơ Cấu Thu Nhập</h3>

          <div className="space-y-3">
            {[
              { label: 'Cho Thuê Căn Hộ Penthouse & Villa', percent: 55, amount: '$81,675', color: 'bg-amber-500' },
              { label: 'Căn Hộ Executive & Deluxe', percent: 32, amount: '$47,520', color: 'bg-cyan-500' },
              { label: 'Phí Tiện Ích & Booking Sky', percent: 8, amount: '$11,880', color: 'bg-emerald-500' },
              { label: 'Dịch Vụ Đỗ Xe & Rửa Xe Tự Động', percent: 5, amount: '$7,425', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white font-mono">{item.amount}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
