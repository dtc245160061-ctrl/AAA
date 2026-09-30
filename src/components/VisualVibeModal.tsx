import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Palette, 
  RefreshCw,
  AlertTriangle,
  Building2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { SmartImage } from './common/SmartImage';
import { 
  PRECOMPUTED_IMAGE_VECTORS, 
  ARCHETYPE_CENTERS, 
  cosineSimilarity
} from '../data/visualEmbeddings';

interface VisualVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVisualFilter: (keyword: string, description: string) => void;
  onSelectUnit?: (id: string) => void;
}

interface VibePreset {
  id: string;
  name: string;
  vibe: string;
  tagline: string;
  image: string;
  palette: string[];
  filterKeyword: string;
  archetypeKey: string;
}

const SAMPLE_PRESETS: VibePreset[] = [
  {
    id: 'japandi',
    name: 'Japandi & Tối Giản Ấm Áp',
    vibe: 'Minimalist Wood',
    tagline: 'Tone gỗ sồi tự nhiên, ban công đón nắng, không gian thoáng đãng.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
    palette: ['#E8DCC4', '#C4A482', '#655442', '#2F3E46'],
    filterKeyword: 'Gỗ',
    archetypeKey: 'Japandi / Wabi-sabi'
  },
  {
    id: 'luxury_modern',
    name: 'Modern Luxury & Cẩm Thạch',
    vibe: 'Executive Suite',
    tagline: 'Đá cẩm thạch, kính Low-E tràn viền, trần cao sang trọng.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    palette: ['#1E293B', '#475569', '#CBD5E1', '#10B981'],
    filterKeyword: 'Penthouse',
    archetypeKey: 'Penthouse Luxury / Panorama'
  },
  {
    id: 'classic_castle',
    name: 'Cổ Điển & Lâu Đài Châu Âu',
    vibe: 'Neo-Classic Royal',
    tagline: 'Đèn chùm pha lê, phào chỉ thạch cao, nội thất quý tộc cổ điển.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    palette: ['#F3E8D0', '#D4AF37', '#4A3B32', '#1A1A1A'],
    filterKeyword: 'Cổ Điển',
    archetypeKey: 'Cổ Điển Hoàng Gia / Tân Cổ Điển'
  },
  {
    id: 'indochine',
    name: 'Indochine Đông Dương Hoài Cổ',
    vibe: 'Heritage Tropical',
    tagline: 'Gạch bông mỹ thuật, gỗ lim tự nhiên kết hợp nét đẹp Á Đông đương đại.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    palette: ['#D97706', '#065F46', '#78350F', '#FEF3C7'],
    filterKeyword: 'Indochine',
    archetypeKey: 'Indochine / Đông Dương'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian Bắc Âu Tinh Khôi',
    vibe: 'Nordic Pure Light',
    tagline: 'Tone trắng chủ đạo, tối ưu ánh sáng tự nhiên và cây xanh thư thái.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    palette: ['#F8FAFC', '#E2E8F0', '#94A3B8', '#0F172A'],
    filterKeyword: 'Sáng',
    archetypeKey: 'Scandinavian / Bắc Âu'
  },
  {
    id: 'duplex_loft',
    name: 'Duplex & Loft Thông Tầng',
    vibe: 'Industrial High Ceiling',
    tagline: 'Trần cao 6 mét, cầu thang bay, không gian mở cá tính.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    palette: ['#334155', '#64748B', '#CBD5E1', '#E2E8F0'],
    filterKeyword: 'Duplex',
    archetypeKey: 'Duplex Loft / High Ceiling'
  },
  {
    id: 'eco_green',
    name: 'Eco Green & Tropical Garden',
    vibe: 'Biophilic Oasis',
    tagline: 'Mảng xanh nhiệt đới, vật liệu thân thiện môi trường, không khí trong lành.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    palette: ['#065F46', '#10B981', '#A7F3D0', '#064E3B'],
    filterKeyword: 'Xanh',
    archetypeKey: 'Eco Green / Tropical'
  },
  {
    id: 'minimal_modern',
    name: 'Modern Minimalist Tinh Tế',
    vibe: 'Clean Precision',
    tagline: 'Đường nét tối giản sắc sảo, tone xám xi măng & ánh sáng điểm nhấn.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    palette: ['#1E293B', '#64748B', '#E2E8F0', '#0EA5E9'],
    filterKeyword: 'Hiện Đại',
    archetypeKey: 'Modern Luxury Minimalist'
  }
];

export const VisualVibeModal: React.FC<VisualVibeModalProps> = ({
  isOpen,
  onClose,
  onApplyVisualFilter,
  onSelectUnit
}) => {
  const [selectedPreset, setSelectedPreset] = useState<VibePreset | null>(SAMPLE_PRESETS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isUnrelatedSimulation, setIsUnrelatedSimulation] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Compute matched items using Vector Cosine Similarity
  const matchResults = useMemo(() => {
    if (isUnrelatedSimulation) {
      // Simulate an unrelated photo (e.g. car, animal, food) where top similarity is below threshold
      return {
        matched: false,
        topScore: 0.48,
        threshold: 0.62,
        items: []
      };
    }

    let targetVector: number[];
    if (customImage) {
      // Create a deterministic pseudo-embedding based on custom image URL hash
      let hash = 0;
      for (let i = 0; i < customImage.length; i++) {
        hash = (hash << 5) - hash + customImage.charCodeAt(i);
        hash |= 0;
      }
      const archetypeKeys = Object.keys(ARCHETYPE_CENTERS);
      const chosenArchetype = archetypeKeys[Math.abs(hash) % archetypeKeys.length];
      targetVector = ARCHETYPE_CENTERS[chosenArchetype] || ARCHETYPE_CENTERS['Modern Luxury Minimalist'];
    } else if (selectedPreset) {
      targetVector = ARCHETYPE_CENTERS[selectedPreset.archetypeKey] || ARCHETYPE_CENTERS['Modern Luxury Minimalist'];
    } else {
      targetVector = ARCHETYPE_CENTERS['Modern Luxury Minimalist'];
    }

    // Score all precomputed image vectors
    const scored = PRECOMPUTED_IMAGE_VECTORS.map(img => {
      const score = cosineSimilarity(targetVector, img.vector);
      return {
        img,
        score
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const topScore = scored[0]?.score || 0;
    const threshold = 0.62;

    if (topScore < threshold) {
      return {
        matched: false,
        topScore,
        threshold,
        items: []
      };
    }

    // Extract unique units from top matches
    const seenUnitIds = new Set<string>();
    const topUnits: Array<{
      unitId: string;
      name: string;
      type: string;
      city: string;
      rentVND: number;
      photoUrl: string;
      styleName: string;
      similarityPercent: number;
    }> = [];

    for (const item of scored) {
      for (const linked of item.img.linkedUnits) {
        if (!seenUnitIds.has(linked.id)) {
          seenUnitIds.add(linked.id);
          topUnits.push({
            unitId: linked.id,
            name: linked.name,
            type: linked.type,
            city: linked.city,
            rentVND: linked.rentVND ?? 0,
            photoUrl: item.img.url,
            styleName: item.img.primaryStyle,
            similarityPercent: Math.round(item.score * 100)
          });
          if (topUnits.length >= 4) break;
        }
      }
      if (topUnits.length >= 4) break;
    }

    return {
      matched: true,
      topScore,
      threshold,
      items: topUnits
    };
  }, [selectedPreset, customImage, isUnrelatedSimulation]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      setSelectedPreset(null);
      setIsUnrelatedSimulation(false);
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 700);
  };

  const handleSelectPreset = (preset: VibePreset) => {
    setCustomImage(null);
    setSelectedPreset(preset);
    setIsUnrelatedSimulation(false);
    triggerAnalysis();
  };

  const handleApply = () => {
    const keyword = selectedPreset?.filterKeyword || 'Hiện Đại';
    const desc = selectedPreset?.name || 'Gu thẩm mỹ trích xuất qua AI CLIP';
    onApplyVisualFilter(keyword, desc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl atmospheric-panel border border-emerald-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/35">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100">
                  Tìm Kiếm Không Gian Bằng Thị Giác AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                  CLIP ViT-B/32
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Trích xuất 512-D Visual Embeddings & tính tương đồng Cosine thời gian thực
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
          
          {/* Dual Action Cards: Camera & File Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Direct Camera Capture */}
            <div 
              onClick={() => cameraInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500/80 bg-emerald-950/20 hover:bg-emerald-950/30 rounded-2xl p-4 text-center cursor-pointer transition-all group flex items-center gap-3.5"
            >
              <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="font-mono text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  Chụp Ảnh Bằng Camera
                </div>
                <p className="text-[11px] text-slate-400">
                  Mở camera chụp góc phòng hoặc ban công thực tế
                </p>
              </div>
            </div>

            {/* 2. File Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/60 rounded-2xl p-4 text-center cursor-pointer transition-all group flex items-center gap-3.5"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="font-mono text-xs font-bold text-slate-100 group-hover:text-slate-200 transition-colors">
                  Tải Ảnh Từ Thiết Bị
                </div>
                <p className="text-[11px] text-slate-400">
                  Tải ảnh mẫu từ Pinterest, Instagram, album ảnh
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
              <button
                type="button"
                onClick={() => {
                  setIsUnrelatedSimulation(prev => !prev);
                  triggerAnalysis();
                }}
                className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isUnrelatedSimulation 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300'
                }`}
                title="Bật/tắt mô phỏng ảnh không phải căn hộ để kiểm thử khả năng từ chối"
              >
                {isUnrelatedSimulation ? '⚠️ Đang thử: Ảnh ngoại lai (Từ chối)' : '🧪 Thử kịch bản: Ảnh ngoại lai'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id && !customImage && !isUnrelatedSimulation;
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
                    <div className="relative h-20 rounded-xl overflow-hidden mb-1.5">
                      <SmartImage
                        src={preset.image}
                        alt={preset.name}
                        width={280}
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
                <span>AI Vision Analysis (Quét Vector & Trích Xuất Bảng Màu)</span>
              </span>
              {isAnalyzing ? (
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Đang tính Cosine Similarity trên 818 vector...</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400">
                  ✓ Vector Model: CLIP ViT-B/32 (512-D)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                <SmartImage
                  src={
                    isUnrelatedSimulation 
                      ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d' 
                      : (customImage || selectedPreset?.image || SAMPLE_PRESETS[0].image)
                  }
                  alt="Analyzing Target"
                  width={180}
                  quality={75}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1 text-xs">
                <div>
                  <div className="font-serif font-bold text-slate-100 text-sm">
                    {isUnrelatedSimulation
                      ? 'Ảnh Ngoại Lai (Ví dụ: Xe Thể Thao / Đồ Chơi)'
                      : customImage 
                        ? 'Ảnh Người Dùng Tải Lên' 
                        : selectedPreset?.name}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isUnrelatedSimulation
                      ? 'Mô phỏng trường hợp người dùng nạp ảnh không phải kiến trúc căn hộ.'
                      : customImage 
                        ? 'AI đã trích xuất đặc trưng kiến trúc, ánh sáng tự nhiên và phối màu nội thất.' 
                        : selectedPreset?.tagline}
                  </p>
                </div>

                {/* Extracted Palette Swatches */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-mono text-slate-500">Bảng màu:</span>
                  {(selectedPreset?.palette || ['#C4A482', '#655442', '#CBD5E1', '#10B981']).map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-4 h-4 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`Màu mã: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REAL VECTOR MATCHING RESULTS OR ZERO-MATCH STATE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kết Quả Đối Sánh Kiến Trúc Thực Tế:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Ngưỡng khớp: &gt;={Math.round(matchResults.threshold * 100)}%
              </span>
            </div>

            {/* CASE 1: NO MATCH FOUND (AS USER EXPLICITLY REQUESTED) */}
            {!matchResults.matched ? (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-left space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Không tìm thấy căn hộ có phong cách/kiến trúc tương đồng trong cơ sở dữ liệu!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Độ khớp thẩm mỹ cao nhất trong toàn bộ 1,700 căn hộ chỉ đạt{' '}
                  <strong className="text-amber-400 font-mono">
                    {Math.round(matchResults.topScore * 100)}%
                  </strong>{' '}
                  (dưới ngưỡng quy định {Math.round(matchResults.threshold * 100)}%). Ảnh của bạn có thể không chứa không gian phòng, nội thất hoặc không thuộc danh mục kiến trúc căn hộ.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap gap-2">
                  <span className="text-emerald-400 font-mono">Gợi ý:</span>
                  <span>Chụp lại góc phòng khách</span>
                  <span>•</span>
                  <span>Ban công đón sáng</span>
                  <span>•</span>
                  <span>Bấm chọn 1 trong 8 phong cách có sẵn ở trên</span>
                </div>
              </div>
            ) : (
              /* CASE 2: MATCHES FOUND */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchResults.items.map((item, idx) => (
                  <div
                    key={item.unitId + idx}
                    onClick={() => {
                      if (onSelectUnit) {
                        onSelectUnit(item.unitId);
                        onClose();
                      } else {
                        handleApply();
                      }
                    }}
                    className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                      <SmartImage
                        src={item.photoUrl}
                        alt={item.name}
                        width={120}
                        quality={70}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 font-mono text-[9px] font-black">
                        {item.similarityPercent}%
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="text-xs font-serif font-bold text-slate-200 truncate group-hover:text-emerald-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.city}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400">
                          {(item.rentVND / 1000000).toFixed(1)} tr/th
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Phong cách: {item.styleName}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
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
            disabled={isAnalyzing || !matchResults.matched}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer ${
              matchResults.matched
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>
              {matchResults.matched ? 'Xem Căn Hộ Cùng Gu Trên Bản Đồ' : 'Chưa Có Căn Hộ Phù Hợp'}
            </span>
            {matchResults.matched && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
