import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Palette, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { SmartImage } from './common/SmartImage';

interface VisualVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVisualFilter: (keyword: string, description: string) => void;
}

interface VibePreset {
  id: string;
  name: string;
  vibe: string;
  tagline: string;
  image: string;
  palette: string[];
  filterKeyword: string;
}

const SAMPLE_PRESETS: VibePreset[] = [
  {
    id: 'japandi',
    name: 'Japandi & Tối Giản Ấm Áp',
    vibe: 'Minimalist Wood',
    tagline: 'Tone gỗ sồi tự nhiên, ban công đón nắng, không gian thoáng đãng.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
    palette: ['#E8DCC4', '#C4A482', '#655442', '#2F3E46'],
    filterKeyword: 'Gỗ'
  },
  {
    id: 'luxury_modern',
    name: 'Modern Luxury & Cẩm Thạch',
    vibe: 'Executive Suite',
    tagline: 'Đá cẩm thạch, kính Low-E tràn viền, trần cao sang trọng.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    palette: ['#1E293B', '#475569', '#CBD5E1', '#10B981'],
    filterKeyword: 'Penthouse'
  },
  {
    id: 'panorama_river',
    name: 'Panorama View Hồ & Ven Sông',
    vibe: 'Skyline Waterfront',
    tagline: 'Tầm nhìn vô cực, ban công kính đón gió trong lành.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    palette: ['#0284C7', '#38BDF8', '#E0F2FE', '#0F172A'],
    filterKeyword: 'Hồ'
  },
  {
    id: 'cozy_studio',
    name: 'Studio Tinh Tế & Trẻ Trung',
    vibe: 'Urban Creative',
    tagline: 'Tối ưu diện tích thông minh, nội thất đa năng, nhiều ánh sáng.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    palette: ['#F59E0B', '#FDE68A', '#334155', '#F8FAFC'],
    filterKeyword: 'Studio'
  }
];

export const VisualVibeModal: React.FC<VisualVibeModalProps> = ({
  isOpen,
  onClose,
  onApplyVisualFilter,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<VibePreset | null>(SAMPLE_PRESETS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      setSelectedPreset(null);
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);
  };

  const handleSelectPreset = (preset: VibePreset) => {
    setCustomImage(null);
    setSelectedPreset(preset);
    triggerAnalysis();
  };

  const handleApply = () => {
    const keyword = selectedPreset?.filterKeyword || 'Gỗ';
    const desc = selectedPreset?.name || 'Phong cách thẩm mỹ tùy chỉnh';
    onApplyVisualFilter(keyword, desc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl atmospheric-panel border border-emerald-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/35">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100">
                  Tìm Không Gian Sống Bằng Thị Giác AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                  Visual Vibe AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Tải ảnh Pinterest, chụp ảnh camera hoặc chọn phong cách bạn thích
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Upload / Camera Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/70 bg-emerald-950/10 hover:bg-emerald-950/20 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                  Tải ảnh từ máy tính hoặc chụp trực tiếp từ Camera
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Hỗ trợ định dạng JPG, PNG, WebP từ Pinterest, Instagram hoặc ảnh thực tế
                </p>
              </div>
            </div>
          </div>

          {/* Preset Styles Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoặc Chọn Phong Cách Thiết Kế Xu Hướng:</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id && !customImage;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all p-2 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                      <SmartImage
                        src={preset.image}
                        alt={preset.name}
                        width={300}
                        quality={70}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-serif font-bold text-slate-200 line-clamp-1">
                        {preset.name}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        #{preset.vibe}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Vision Scanner Result Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Vision Analysis (Quét Bảng Màu & Gu Thẩm Mỹ)</span>
              </span>
              {isAnalyzing ? (
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Đang bóc tách bảng màu...</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400">✓ Đã trích xuất đặc trưng</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                <SmartImage
                  src={customImage || selectedPreset?.image || SAMPLE_PRESETS[0].image}
                  alt="Analyzing Target"
                  width={200}
                  quality={75}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1 text-xs">
                <div>
                  <div className="font-serif font-bold text-slate-100 text-sm">
                    {customImage ? 'Ảnh Người Dùng Tải Lên' : selectedPreset?.name}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {customImage ? 'AI phát hiện các đường nét hiện đại, đón sáng tự nhiên và bài trí ấm cúng.' : selectedPreset?.tagline}
                  </p>
                </div>

                {/* Extracted Palette Swatches */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">Bảng màu:</span>
                  {(selectedPreset?.palette || ['#C4A482', '#655442', '#CBD5E1', '#10B981']).map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`Màu mã: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Áp Dụng Tìm Kiếm Căn Hộ Cùng Gu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
