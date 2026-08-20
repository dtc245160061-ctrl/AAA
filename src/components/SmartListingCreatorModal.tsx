import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';

interface SmartListingCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (unit: Partial<ApartmentUnit>) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const SmartListingCreatorModal: React.FC<SmartListingCreatorModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
  onShowToast
}) => {
  const [step, setStep] = useState<'upload' | 'generating' | 'review'>('upload');
  const [selectedCity, setSelectedCity] = useState<'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('Ho Chi Minh City');
  const [district, setDistrict] = useState<string>('Quận 7');
  const [sqm, setSqm] = useState<number>(85);
  const [bedrooms, setBedrooms] = useState<number>(2);

  // AI Generated Results State
  const [generatedTitle, setGeneratedTitle] = useState<string>('Căn Hộ 2PN Phú Mỹ Hưng View Sông Thoáng Mát — Đã Nghiệm Thu PCCC');
  const [generatedDesc, setGeneratedDesc] = useState<string>('Căn hộ thiết kế hiện đại tràn ngập ánh sáng tự nhiên với ban công hướng Đông Nam đón gió mát. Trang bị đầy đủ nội thất cao cấp (điều hòa Daikin, bếp từ Bosch). Tòa nhà trang bị 2 thang thoát hiểm chống khói và đầu phun Sprinkler tự động.');
  const [suggestedRentVND, setSuggestedRentVND] = useState<number>(18500000);
  const [parkingFeeVND, setParkingFeeVND] = useState<number>(1200000);

  if (!isOpen) return null;

  const handleStartAiAnalysis = () => {
    setStep('generating');
    setTimeout(() => {
      setGeneratedTitle(`Căn Hộ ${bedrooms}PN ${district} Hiện Đại — Chuẩn An Tâm PCCC`);
      setGeneratedDesc(`Căn hộ diện tích ${sqm}m² thiết kế thông minh, tối ưu diện tích sinh hoạt gia đình. Khu vực cao ráo không ngập mùa mưa, gần trường quốc tế và siêu thị lớn. Bàn giao đầy đủ nội thất chỉ việc xách vali vào ở.`);
      setSuggestedRentVND(district.includes('1') ? 28000000 : district.includes('7') ? 18500000 : 15000000);
      setStep('review');
    }, 1200);
  };

  const handleComplete = () => {
    onListingCreated?.({
      name: generatedTitle,
      city: selectedCity,
      district,
      sqm,
      bedrooms,
      monthlyRentVND: suggestedRentVND,
      status: 'vacant'
    });
    if (onShowToast) {
      onShowToast('success', 'Xuất bản tin đăng thành công', 'Tin đăng đã được AI tối ưu hóa và hiển thị trên sàn HAVEN.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-100 font-bold">Đăng Tin Thông Minh AI (Smart Listing Creator)</h3>
              <p className="text-xs text-slate-400 font-mono">Tự động nhận diện phòng, gợi ý giá thị trường và chuẩn hóa minh bạch PCCC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Upload Photos & Basic Info */}
        {step === 'upload' && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs font-mono">
            {/* Upload Box */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-950/60 text-center space-y-3 cursor-pointer hover:border-emerald-400 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-100 font-bold text-sm">Tải lên 3-8 bức ảnh chụp thực tế căn hộ</p>
                <p className="text-slate-400 text-[11px] mt-0.5">AI sẽ tự động nhận diện phòng khách, bếp, ban công và góc chụp</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                ✓ 5 ảnh mẫu đã sẵn sàng phân tích
              </span>
            </div>

            {/* Basic Spec Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Thành Phố *</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                >
                  <option value="Ho Chi Minh City">TP. Hồ Chí Minh</option>
                  <option value="Hanoi">Hà Nội</option>
                  <option value="Da Nang">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Quận / Huyện *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận 7, Quận 1..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Diện Tích (m²) & Số Phòng</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(Number(e.target.value))}
                    className="w-1/2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    placeholder="PN"
                    className="w-1/2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleStartAiAnalysis}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bắt Đầu Phân Tích & Tự Động Soạn Tin Bằng AI</span>
            </button>
          </div>
        )}

        {/* STEP 2: AI Loading Simulation */}
        {step === 'generating' && (
          <div className="py-16 text-center space-y-4 animate-in fade-in">
            <RefreshCw className="w-12 h-12 text-emerald-400 mx-auto animate-spin" />
            <h4 className="font-serif text-xl font-bold text-slate-100">AI Đang Phân Tích Hình Ảnh & Thị Trường...</h4>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
              Đang đối chiếu mức giá cho thuê trung bình tại {district}, bóc tách chi phí điện nước và lập tiêu đề chuẩn SEO.
            </p>
          </div>
        )}

        {/* STEP 3: AI Review & Quality Inspector */}
        {step === 'review' && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs font-mono">
            {/* AI Optimization Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Điểm Chất Lượng Tin Đăng: 96/100 (Tối Ưu Xuất Sắc)</span>
              </div>
              <span className="text-[10px] text-slate-400">Ước tính tăng +45% lượt liên hệ</span>
            </div>

            {/* Generated Title */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Tiêu Đề Tin Đăng Tối Ưu:</label>
              <input
                type="text"
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-serif font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Generated Description */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Mô Tả Chi Tiết Do AI Soạn Thảo:</label>
              <textarea
                rows={3}
                value={generatedDesc}
                onChange={(e) => setGeneratedDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-sans text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Price Recommendation & True Cost Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Gợi Ý Giá Thuê Thị Trường:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={suggestedRentVND}
                    onChange={(e) => setSuggestedRentVND(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-base"
                  />
                  <span className="text-slate-400 shrink-0">đ/tháng</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Phí Gửi Xe Bóc Tách:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={parkingFeeVND}
                    onChange={(e) => setParkingFeeVND(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-bold text-base"
                  />
                  <span className="text-slate-400 shrink-0">đ/tháng</span>
                </div>
              </div>
            </div>

            {/* AI Quality Inspector Suggestions */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-[11px] text-amber-300/90">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Gợi ý cải thiện từ AI Listing Optimizer:</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc font-sans text-slate-300">
                <li>Bổ sung ảnh giấy nghiệm thu PCCC để nhận huy hiệu <strong>Verified Cấp 3</strong>.</li>
                <li>Thêm thông tin vật nuôi (Pet-Friendly) để tiếp cận thêm 35% khách thuê trẻ.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('upload')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Chỉnh sửa lại
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận & Xuất Bản Tin Đăng Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
