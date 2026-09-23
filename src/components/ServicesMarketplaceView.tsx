import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  KeyRound, 
  Shield, 
  Clock, 
  Calendar, 
  Plus
} from 'lucide-react';
import { ADDON_SERVICES, ApartmentStore } from '../data/apartmentStore';
import type { AddonService, ServiceOrder } from '../types/apartment';

interface ServicesMarketplaceViewProps {
  onShowToast: (type: 'success' | 'info', title: string, desc?: string) => void;
  isConsumerView?: boolean;
}

export const ServicesMarketplaceView: React.FC<ServicesMarketplaceViewProps> = ({
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(ApartmentStore.getServiceOrders());
  const [bookingService, setBookingService] = useState<AddonService | null>(null);

  // Form states for booking modal
  const [customerName, setCustomerName] = useState('Trần Hải Đăng');
  const [customerPhone, setCustomerPhone] = useState('0988 776 655');
  const [unitId, setUnitId] = useState('HN-TH-2401');
  const [scheduledDate, setScheduledDate] = useState('2026-08-20 09:00');

  const filteredServices = selectedCategory === 'all'
    ? ADDON_SERVICES
    : ADDON_SERVICES.filter(s => s.category === selectedCategory);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService) return;

    ApartmentStore.addServiceOrder({
      serviceId: bookingService.id,
      serviceTitle: bookingService.title,
      customerName,
      customerPhone,
      unitId,
      scheduledDate,
      priceVND: bookingService.priceVND
    });

    setServiceOrders(ApartmentStore.getServiceOrders());
    setBookingService(null);
    onShowToast(
      'success',
      `Đặt thành công dịch vụ ${bookingService.title}!`,
      `Chuyên viên đối tác sẽ liên hệ số ${customerPhone} để xác nhận lịch phục vụ.`
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-sky-400" />;
      case 'Truck': return <Truck className="w-5 h-5 text-amber-400" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-purple-400" />;
      default: return <Shield className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-10 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Radiating Central Halo & Sheen Sweep */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group transition-all">
        {/* Central Radiating Halo / Clockwise Light Beams */}
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Chợ Tiện Ích Đời Sống & Dịch Vụ Gia Tăng (VAS Marketplace)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
                Dịch Vụ Chăm Sóc Căn Hộ & Cư Dân
              </h1>
              <p className="text-sm text-slate-400">
                Đặt nhanh các dịch vụ dọn vệ sinh theo giờ, chuyển nhà trọn gói, lắp khóa vân tay thông minh và bảo hiểm tài sản.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-emerald-400 font-bold">{serviceOrders.length}</span> đơn dịch vụ đã đặt
              </div>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Tất Cả Dịch Vụ' },
              { id: 'cleaning', label: '🧹 Dọn Dẹp & Buồng Phòng' },
              { id: 'moving', label: '🚚 Chuyển Nhà HAVEN Move' },
              { id: 'smart_home', label: '🔐 Smart Living & Khóa IoT' },
              { id: 'insurance', label: '🛡️ Bảo Hiểm Nhà Ở' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="group relative rounded-3xl p-[2px] shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
          >
            {/* Dynamic Orbiting Dual Laser Beam strictly confined to 2px border */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            </div>

            <div className="relative z-10 w-full h-full p-6 rounded-[22px] atmospheric-panel backdrop-blur-xl border border-slate-800/80 [data-theme='light']_:border-slate-200/80 bg-slate-900/60 [data-theme='light']_:bg-white/80 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/60 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-200">
                    {getIcon(service.iconName)}
                  </div>
                  {service.popular && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                      Phổ Biến Nhất
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 [data-theme='light']_:text-slate-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {service.duration && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Thời gian phục vụ: {service.duration}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800/80 [data-theme='light']_:border-slate-200/80 mt-6 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold font-mono text-emerald-400 [data-theme='light']_:text-emerald-700">
                    {service.priceVND.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">/ {service.unitLabel}</div>
                </div>

                <button
                  onClick={() => setBookingService(service)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/20 hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đặt Ngay</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Xác Nhận Đặt Dịch Vụ</span>
                <h3 className="font-serif font-bold text-slate-100 text-base">{bookingService.title}</h3>
              </div>
              <button
                onClick={() => setBookingService(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-slate-300">Đơn giá trọn gói:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {bookingService.priceVND.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Họ và tên khách hàng</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Mã căn hộ</label>
                  <input
                    type="text"
                    required
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Ngày giờ hẹn</label>
                  <input
                    type="text"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Orders List with Dynamic Rotating Border Beam */}
      <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" />
        <div className="relative z-10 w-full h-full p-6 sm:p-8 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-slate-800/80 space-y-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Nhật Ký Dịch Vụ Cư Dân (Service Activity Log)</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-100 mt-1">
                Lịch Sử Đặt Dịch Vụ Của Cư Dân & Tòa Nhà
              </h2>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs self-start sm:self-auto">
              {serviceOrders.length} Yêu cầu đã ghi nhận
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Tên Dịch Vụ</th>
                  <th className="py-3 px-4">Khách Hàng / Căn Hộ</th>
                  <th className="py-3 px-4">Thời Gian Hẹn</th>
                  <th className="py-3 px-4">Chi Phí</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {serviceOrders.map(ord => (
                  <tr
                    key={ord.id}
                    className="group hover:bg-slate-800/80 [data-theme='light']_:hover:bg-emerald-50/70 border-l-4 border-l-transparent hover:border-l-emerald-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)] cursor-pointer"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 group-hover:border-emerald-400/60 group-hover:bg-emerald-950/90 transition-all inline-block shadow-sm">
                        {ord.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_8px_rgba(167,243,208,0.5)] transition-all">
                      {ord.serviceTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-slate-200 group-hover:text-emerald-100 transition-colors">
                        {ord.customerName} ({ord.customerPhone})
                      </div>
                      <div className="text-slate-500 group-hover:text-emerald-400/80 text-[10px] transition-colors">
                        Căn {ord.unitId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 group-hover:text-slate-200 transition-colors whitespace-nowrap">
                      {ord.scheduledDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] font-mono whitespace-nowrap transition-all">
                      {ord.priceVND.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all ${
                        ord.status === 'confirmed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ord.status === 'confirmed' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <span>{ord.status === 'confirmed' ? 'Đã Xác Nhận' : 'Chờ Xử Lý'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
