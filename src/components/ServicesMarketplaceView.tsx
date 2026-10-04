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
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />;
      case 'Truck': return <Truck className="w-5 h-5 text-[#2570EB]" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-[#7A5200] dark:text-[#FFC83B]" />;
      default: return <Shield className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />;
    }
  };

  return (
    <div className="space-y-10 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner - Pure Wise Clean Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#163300]/70 dark:text-[#9FE870] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#2570EB]" />
              <span>Chợ Tiện Ích Đời Sống & Dịch Vụ Gia Tăng (VAS Marketplace)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-slate-100 tracking-tight">
              Dịch Vụ Chăm Sóc Căn Hộ & Cư Dân
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Đặt nhanh các dịch vụ dọn vệ sinh theo giờ, chuyển nhà trọn gói, lắp khóa vân tay thông minh và bảo hiểm tài sản.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] border border-[#9FE870]/30 text-xs font-bold">
              <span>{serviceOrders.length}</span> đơn dịch vụ đã đặt
            </div>
          </div>
        </div>

        {/* Categories Bar - Wise Pill Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="wise-pill-tabs overflow-x-auto max-w-full">
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
                className={selectedCategory === cat.id ? 'wise-pill-tab-active' : 'wise-pill-tab'}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid - Pure Wise Rounded-[24px] Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-[#163300]/30 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center">
                  {getIcon(service.iconName)}
                </div>
                {service.popular && (
                  <span className="px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-bold uppercase shadow-xs">
                    Phổ Biến Nhất
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[#163300] dark:text-slate-100 hover:text-[#2570EB] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {service.duration && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Thời gian phục vụ: {service.duration}</span>
                </div>
              )}
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between">
              <div>
                <div className="text-xl font-extrabold tabular-nums text-[#163300] dark:text-[#9FE870]">
                  {service.priceVND.toLocaleString('vi-VN')} đ
                </div>
                <div className="text-[10px] text-slate-400 font-medium">/ {service.unitLabel}</div>
              </div>

              <button
                onClick={() => setBookingService(service)}
                className="px-4 py-2 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Đặt Ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal - Pure Wise Style */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Xác Nhận Đặt Dịch Vụ</span>
                <h3 className="font-bold text-[#163300] dark:text-slate-100 text-base">{bookingService.title}</h3>
              </div>
              <button
                onClick={() => setBookingService(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-[#F2F5F0] dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-[16px] bg-[#9FE870]/15 border border-[#9FE870]/30 flex items-center justify-between">
                <span className="text-[#163300] dark:text-[#9FE870] font-bold">Đơn giá trọn gói:</span>
                <span className="text-base font-extrabold text-[#163300] dark:text-[#9FE870] tabular-nums">
                  {bookingService.priceVND.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-slate-400 font-bold">Họ và tên khách hàng</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-slate-400 font-bold">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400 font-bold">Mã căn hộ</label>
                  <input
                    type="text"
                    required
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400 font-bold">Ngày giờ hẹn</label>
                  <input
                    type="text"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="px-5 py-2.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Orders List - Wise Card Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Nhật Ký Dịch Vụ Cư Dân (Service Activity Log)</span>
            </div>
            <h2 className="text-xl font-bold text-[#163300] dark:text-white mt-1">
              Lịch Sử Đặt Dịch Vụ Của Cư Dân & Tòa Nhà
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 text-[#163300] dark:text-[#9FE870] border border-slate-200 dark:border-slate-700 font-bold text-xs self-start sm:self-auto">
            {serviceOrders.length} Yêu cầu đã ghi nhận
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F5F0] dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider rounded-xl">
              <tr>
                <th className="py-3.5 px-4 rounded-l-xl">Mã Đơn</th>
                <th className="py-3.5 px-4">Tên Dịch Vụ</th>
                <th className="py-3.5 px-4">Khách Hàng / Căn Hộ</th>
                <th className="py-3.5 px-4">Thời Gian Hẹn</th>
                <th className="py-3.5 px-4">Chi Phí</th>
                <th className="py-3.5 px-4 rounded-r-xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {serviceOrders.map(ord => (
                <tr
                  key={ord.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#163300] dark:text-emerald-300 px-2.5 py-1 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 tabular-nums">
                      {ord.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#163300] dark:text-white">
                    {ord.serviceTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#163300] dark:text-slate-200">
                      {ord.customerName} ({ord.customerPhone})
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Căn {ord.unitId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {ord.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#163300] dark:text-[#9FE870] whitespace-nowrap">
                    {ord.priceVND.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      ord.status === 'confirmed'
                        ? 'bg-[#E8F8EC] text-[#163300] border border-[#9FE870]'
                        : 'bg-[#FFF8E6] text-[#9A6700] border border-[#FFC83B]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ord.status === 'confirmed' ? 'bg-[#163300] dark:bg-[#9FE870]' : 'bg-[#FFC83B]'}`} />
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
  );
};
