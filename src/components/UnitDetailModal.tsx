import React, { useState } from 'react';
import type { ApartmentUnit } from '../types/apartment';
import { X, Lock, Key, Thermometer, Phone, Mail, Zap, Droplets, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface UnitDetailModalProps {
  unit: ApartmentUnit | null;
  onClose: () => void;
  onIssueTicket: (unitId: string, title: string) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  onClose,
  onIssueTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'iot' | 'actions'>('overview');
  const [tempC, setTempC] = useState<number>(unit?.sensors.targetTempC || 22);
  const [doorLocked, setDoorLocked] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ticketInput, setTicketInput] = useState<string>('');

  if (!unit) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLock = () => {
    setDoorLocked(!doorLocked);
    showToast(doorLocked ? `Đã mở khoá cửa từ xa căn hộ ${unit.id}` : `Đã khóa an toàn cửa căn hộ ${unit.id}`);
  };

  const handleSendPasscode = () => {
    showToast(`Mã PIN kỹ thuật số tạm thời (24h) đã được gửi tới ${unit.resident?.phone || 'cư dân'}`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    onIssueTicket(unit.id, ticketInput);
    setTicketInput('');
    showToast(`Đã tạo vé yêu cầu kỹ thuật IoT thành công!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 right-6 z-50 bg-amber-500 text-black px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl relative text-left">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono">
              {unit.floor}F
            </div>
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                {unit.type} • {unit.sqm} m²
              </span>
              <h2 className="text-2xl font-bold text-white font-['Cinzel'] flex items-center gap-2">
                Chi Tiết Căn Hộ {unit.id}
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

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 px-6 gap-4">
          {[
            { id: 'overview', label: 'Thông Tin Cư Dân & Hợp Đồng' },
            { id: 'iot', label: 'Điều Khiển IoT & Cảm Biến' },
            { id: 'actions', label: 'Tác Vụ & Tạo Yêu Cầu' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Resident Profile Card */}
              {unit.resident ? (
                <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={unit.resident.avatar}
                      alt={unit.resident.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{unit.resident.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          {unit.resident.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          {unit.resident.email}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {unit.resident.autoPayActive ? 'Tự Động Trừ Tiền (Auto-Pay)' : 'Thanh Toán Thủ Công'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
                  <h3 className="text-base font-bold text-cyan-300">Căn Hộ Đang Trống</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Giá chào thuê đề xuất: ${unit.monthlyRentUSD.toLocaleString()} / tháng. Đang sẵn sàng tiếp đón cư dân mới.
                  </p>
                </div>
              )}

              {/* Lease & Financial Spec */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Giá Thuê Hàng Tháng</span>
                  <p className="text-lg font-bold text-amber-400 mt-1 font-mono">
                    ${unit.monthlyRentUSD.toLocaleString()}
                  </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Ngày Nhận Phòng</span>
                  <p className="text-sm font-semibold text-white mt-1">
                    {unit.resident?.moveInDate || 'Chưa Có'}
                  </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Hạn Hợp Đồng</span>
                  <p className="text-sm font-semibold text-white mt-1">
                    {unit.resident?.leaseEnd || 'N/A'}
                  </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Số Cư Dân Đăng Ký</span>
                  <p className="text-sm font-semibold text-white mt-1">
                    {unit.resident?.occupantsCount || 0} Người
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: IoT Sensors & Controls */}
          {activeTab === 'iot' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Smart Lock Control */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Khoá Thông Minh (Smart Lock)</h4>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      Pin: {unit.sensors.smartLockBattery}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Trạng thái hiện tại:{' '}
                    <strong className={doorLocked ? 'text-rose-400' : 'text-emerald-400'}>
                      {doorLocked ? 'ĐÃ KHÓA' : 'ĐÃ MỞ KHOÁ'}
                    </strong>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleLock}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        doorLocked
                          ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                          : 'bg-rose-500 text-white hover:bg-rose-400'
                      }`}
                    >
                      {doorLocked ? 'Mở Khoá Từ Xa' : 'Khoá Cửa Lại'}
                    </button>
                    <button
                      onClick={handleSendPasscode}
                      className="px-3 py-2 text-xs font-semibold bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      Mã PIN 24h
                    </button>
                  </div>
                </div>

                {/* HVAC Climate Thermostat */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white">Điều Hoà Trung Tâm HVAC</h4>
                    </div>
                    <span className="text-xs font-mono text-cyan-300">{unit.sensors.hvacStatus}</span>
                  </div>

                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl">
                    <span className="text-xs text-slate-400">Nhiệt độ cài đặt:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTempC(Math.max(18, tempC - 0.5))}
                        className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold font-mono text-cyan-300">{tempC}°C</span>
                      <button
                        onClick={() => setTempC(Math.min(30, tempC + 0.5))}
                        className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utility Telemetry Metering */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Điện Năng Tiêu Thụ</span>
                    <p className="text-base font-bold text-white font-mono">
                      {unit.sensors.energyConsumptionKwh} kWh / tháng
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Droplets className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Lượng Nước Sinh Hoạt</span>
                    <p className="text-base font-bold text-white font-mono">
                      {unit.sensors.waterUsageLiters} Liters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Actions & Service Tickets */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateTicket} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Tạo Yêu Cầu Kỹ Thuật / Bảo Trì Cho Căn Hộ
                </h4>
                <input
                  type="text"
                  placeholder="Mô tả sự cố (vd: Kiểm tra bộ lọc điều hoà, thay pin khoá cửa)..."
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi Yêu Cầu Tới Đội Kỹ Thuật
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
