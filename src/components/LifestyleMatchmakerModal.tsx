import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Compass, 
  Bookmark, 
  Car, 
  Dog, 
  Footprints, 
  VolumeX, 
  Sun, 
  Banknote, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { SmartImage } from './common/SmartImage';

interface LifestyleMatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
}

interface Answers {
  pet: 'dog_cat' | 'small_pet' | 'no_pet' | null;
  mobility: 'car' | 'ev' | 'motorbike_public' | 'bike_walk' | null;
  fitness: 'running_park' | 'gym_pool' | 'yoga_quiet' | 'none' | null;
  acoustics: 'super_quiet' | 'moderate' | 'lively' | null;
  climate: 'morning_sun' | 'avoid_west_sun' | 'high_breeze' | null;
  budget: 'under_10m' | '10m_20m' | '20m_35m' | 'above_35m' | null;
}

const initialAnswers: Answers = {
  pet: null,
  mobility: null,
  fitness: null,
  acoustics: null,
  climate: null,
  budget: null,
};

export const LifestyleMatchmakerModal: React.FC<LifestyleMatchmakerModalProps> = ({
  isOpen,
  onClose,
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const totalSteps = 6;

  const questions = [
    {
      id: 'pet',
      icon: Dog,
      badge: 'BƯỚC 1/6 • BẠN ĐỒNG HÀNH',
      title: 'Bạn có nuôi hoặc chuẩn bị đón thú cưng không?',
      subtitle: 'HAVEN sẽ lọc các tòa nhà có chính sách thân thiện thú cưng và khuôn viên dạo bộ an toàn.',
      options: [
        {
          key: 'dog_cat',
          title: 'Có chó hoặc mèo năng động',
          desc: 'Cần ban công rào bảo vệ, gần công viên dạo bộ, tòa nhà cho phép nuôi thú cưng.',
          icon: Dog,
        },
        {
          key: 'small_pet',
          title: 'Chỉ nuôi cá cảnh, chim hoặc thú nhỏ',
          desc: 'Không gây tiếng ồn, không ảnh hưởng diện tích sinh hoạt chung.',
          icon: Footprints,
        },
        {
          key: 'no_pet',
          title: 'Không nuôi thú cưng',
          desc: 'Ưu tiên tối đa sự sạch sẽ, không lo lông thú hoặc dị ứng.',
          icon: CheckCircle2,
        },
      ],
    },
    {
      id: 'mobility',
      icon: Car,
      badge: 'BƯỚC 2/6 • PHƯƠNG TIỆN & GIAO THÔNG',
      title: 'Phương tiện di chuyển chính của bạn hàng ngày?',
      subtitle: 'Đảm bảo chỗ đỗ xe an toàn, hạ tầng thông thoáng và tránh ngập lụt.',
      options: [
        {
          key: 'car',
          title: 'Xe ô tô riêng cá nhân',
          desc: 'Bắt buộc có hầm đỗ xe 2 tầng thông minh, đường ngõ rộng > 5m, không ngập nước.',
          icon: Car,
        },
        {
          key: 'ev',
          title: 'Xe máy điện / Ô tô điện (VinFast...)',
          desc: 'Ưu tiên tòa nhà có trạm sạc điện chuyên dụng an toàn tại tầng hầm.',
          icon: Sparkles,
        },
        {
          key: 'motorbike_public',
          title: 'Xe máy xăng hoặc Metro / Xe Buýt',
          desc: 'Gần tuyến Metro Nhổn - Cát Linh hoặc trục đường lớn thuận tiện đón xe.',
          icon: Compass,
        },
        {
          key: 'bike_walk',
          title: 'Xe đạp hoặc thích đi bộ',
          desc: 'Ưu tiên trung tâm, các tiện ích siêu thị, cà phê trong bán kính 500m.',
          icon: Footprints,
        },
      ],
    },
    {
      id: 'fitness',
      icon: Footprints,
      badge: 'BƯỚC 3/6 • THỂ THAO & KHÔNG GIAN XANH',
      title: 'Thói quen rèn luyện thể chất & lối sống ngoài trời?',
      subtitle: 'AI sẽ tính toán khoảng cách thực tế từ căn hộ đến các không gian vận động.',
      options: [
        {
          key: 'running_park',
          title: 'Chạy bộ ngoài trời & Đạp xe',
          desc: 'Ưu tiên gần Công viên Cầu Giấy, Hồ Tây, Hồ Hoàn Kiếm hoặc đường chạy nội khu.',
          icon: Footprints,
        },
        {
          key: 'gym_pool',
          title: 'Tập Gym, Bơi lội & Fitness',
          desc: 'Tòa nhà tích hợp sẵn bể bơi 4 mùa, phòng tập gym tiêu chuẩn quốc tế.',
          icon: Sparkles,
        },
        {
          key: 'yoga_quiet',
          title: 'Yoga, Thiền & Nghỉ dưỡng',
          desc: 'Không gian tĩnh lặng, ban công rộng thoáng đón ánh sáng tự nhiên.',
          icon: Sun,
        },
        {
          key: 'none',
          title: 'Ít vận động ngoài trời, thích ở nhà',
          desc: 'Tập trung vào sự thoải mái của nội thất phòng khách và phòng ngủ.',
          icon: CheckCircle2,
        },
      ],
    },
    {
      id: 'acoustics',
      icon: VolumeX,
      badge: 'BƯỚC 4/6 • KHÔNG GIAN ÂM THANH',
      title: 'Mức độ nhạy cảm của bạn đối với tiếng ồn?',
      subtitle: 'Lựa chọn cao độ tầng và tiêu chuẩn kính cách âm phù hợp cho giấc ngủ.',
      options: [
        {
          key: 'super_quiet',
          title: 'Rất nhạy cảm với tiếng ồn',
          desc: 'Ưu tiên tầng cao (> tầng 15), kính hộp 2 lớp cách âm Eurowindow, tránh mặt đường.',
          icon: VolumeX,
        },
        {
          key: 'moderate',
          title: 'Mức độ thông thường',
          desc: 'Ban ngày có thể có âm thanh sinh hoạt, miễn là đêm về yên tĩnh nghỉ ngơi.',
          icon: Sliders,
        },
        {
          key: 'lively',
          title: 'Thích sự sôi động, nhộn nhịp',
          desc: 'Tầng trung hoặc thấp, tiện bước chân xuống phố ẩm thực, cà phê tấp nập.',
          icon: Sparkles,
        },
      ],
    },
    {
      id: 'climate',
      icon: Sun,
      badge: 'BƯỚC 5/6 • VI KHÍ HẬU & HƯỚNG NẮNG',
      title: 'Sở thích hướng ban công đón nắng & gió trời?',
      subtitle: 'Tối ưu nhiệt độ tự nhiên và giảm chi phí điện năng máy lạnh quanh năm.',
      options: [
        {
          key: 'morning_sun',
          title: 'Đón nắng ban mai sớm (Hướng Đông / Đông Nam)',
          desc: 'Ánh sáng tràn ngập buổi sớm tràn đầy năng lượng, gió mát lành trưa hè.',
          icon: Sun,
        },
        {
          key: 'avoid_west_sun',
          title: 'Tránh hoàn toàn nắng Tây gay gắt',
          desc: 'Ưu tiên căn hướng Nam hoặc Bắc mát mẻ, giữ nhiệt độ phòng luôn dễ chịu.',
          icon: Sparkles,
        },
        {
          key: 'high_breeze',
          title: 'Tầng cao lộng gió, tầm nhìn Panorama',
          desc: 'Tầm nhìn không bị che chắn, đón gió lưu thông tự nhiên không khí trong lành.',
          icon: Compass,
        },
      ],
    },
    {
      id: 'budget',
      icon: Banknote,
      badge: 'BƯỚC 6/6 • NGÂN SÁCH THUÊ',
      title: 'Khoảng tài chính dự kiến dành cho tổ ấm mỗi tháng?',
      subtitle: 'HAVEN sẽ tự động tính toán tổng chi phí thực tế (True Cost) minh bạch.',
      options: [
        {
          key: 'under_10m',
          title: 'Dưới 10 Triệu / tháng',
          desc: 'Phù hợp sinh viên, người đi làm độc thân, Studio hoặc 1 phòng ngủ gọn gàng.',
          icon: Banknote,
        },
        {
          key: '10m_20m',
          title: 'Từ 10 - 20 Triệu / tháng',
          desc: 'Căn hộ 2 phòng ngủ hoàn thiện full nội thất cao cấp tại các quận trung tâm.',
          icon: Banknote,
        },
        {
          key: '20m_35m',
          title: 'Từ 20 - 35 Triệu / tháng',
          desc: 'Căn hộ gia đình 2 - 3 phòng ngủ hạng sang, view hồ, dịch vụ lễ tân 24/7.',
          icon: Banknote,
        },
        {
          key: 'above_35m',
          title: 'Trên 35 Triệu / tháng',
          desc: 'Duplex, Sky Villa, Penthouse đẳng cấp thượng lưu với sân vườn riêng biệt.',
          icon: Sparkles,
        },
      ],
    },
  ];

  const handleSelectOption = (questionKey: keyof Answers, optionKey: any) => {
    setAnswers(prev => ({ ...prev, [questionKey]: optionKey }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setShowResults(true);
      }, 900);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setShowResults(false);
    setIsScanning(false);
  };

  // Algorithmic Scoring & Matching Engine
  const matchedResults = useMemo(() => {
    if (!showResults) return [];

    const scored = units.map(unit => {
      let score = 70;
      const reasons: string[] = [];

      // 1. Thú cưng
      if (answers.pet === 'dog_cat') {
        if (unit.petFriendly) {
          score += 15;
          reasons.push('Tòa nhà cho phép nuôi thú cưng & có ban công bảo vệ an toàn.');
        } else {
          score -= 30;
        }
      } else if (answers.pet === 'no_pet') {
        score += 5;
      }

      // 2. Phương tiện
      if (answers.mobility === 'car') {
        if (unit.hasCarParking) {
          score += 15;
          reasons.push('Hầm đỗ ô tô 2 tầng thông minh, ngõ rộng ô tô vào tận sảnh.');
        } else {
          score -= 25;
        }
      } else if (answers.mobility === 'ev') {
        score += 10;
        reasons.push('Trang bị điểm sạc điện xe máy an toàn tại tầng hầm.');
      }

      // 3. Thể thao
      if (answers.fitness === 'running_park') {
        const parkKeywords = ['công viên', 'hồ', 'riverside', 'park', 'green', 'ven sông', 'biển', 'bãi sau', 'sông hàn', 'hồ tây', 'hồ xương rồng', 'danko', 'crown', 'sala', 'thảo điền'];
        const isParkNearby = parkKeywords.some(kw => 
          unit.address?.toLowerCase().includes(kw) || 
          unit.name?.toLowerCase().includes(kw) || 
          unit.district?.toLowerCase().includes(kw)
        );
        if (isParkNearby) {
          score += 18;
          reasons.push(`Gần công viên ven hồ (${unit.district}, ${unit.city}), hoàn hảo cho chạy bộ.`);
        }
      } else if (answers.fitness === 'gym_pool') {
        if (unit.monthlyRentVND >= 15000000 || unit.type === 'Deluxe Apartment' || unit.type === 'Penthouse' || unit.type === 'Sky Villa') {
          score += 12;
          reasons.push('Tích hợp tiện ích bể bơi nội khu và phòng tập thể thao hiện đại.');
        }
      }

      // 4. Âm thanh
      if (answers.acoustics === 'super_quiet') {
        if (unit.noiseLevel === 'Quiet' || unit.floor >= 15) {
          score += 15;
          reasons.push(`Tầng cao ${unit.floor} tách biệt tiếng ồn phố thị, kính cách âm cao cấp.`);
        } else {
          score -= 10;
        }
      }

      // 5. Nắng gió
      if (answers.climate === 'morning_sun') {
        if (unit.orientation?.includes('Đông') || unit.orientation?.includes('Nam') || unit.balcony) {
          score += 12;
          reasons.push('Ban công đón nắng sớm tự nhiên, gió mát trưa hè.');
        }
      } else if (answers.climate === 'avoid_west_sun') {
        if (unit.orientation?.includes('Bắc') || unit.orientation?.includes('Nam')) {
          score += 12;
          reasons.push('Tránh nắng Tây trực diện, nhiệt độ phòng luôn mát mẻ.');
        }
      } else if (answers.climate === 'high_breeze') {
        if (unit.floor >= 18) {
          score += 15;
          reasons.push(`Tầng ${unit.floor} đón gió thoáng mát, tầm nhìn rộng thoáng.`);
        }
      }

      // 6. Ngân sách
      const priceM = unit.monthlyRentVND / 1000000;
      if (answers.budget === 'under_10m') {
        if (priceM <= 10) score += 15;
        else score -= Math.abs(priceM - 10) * 4;
      } else if (answers.budget === '10m_20m') {
        if (priceM >= 10 && priceM <= 20) score += 15;
        else score -= 10;
      } else if (answers.budget === '20m_35m') {
        if (priceM >= 20 && priceM <= 35) score += 15;
        else score -= 10;
      } else if (answers.budget === 'above_35m') {
        if (priceM > 35) score += 18;
      }

      const finalScore = Math.min(99, Math.max(65, Math.round(score)));

      return {
        unit,
        score: finalScore,
        reasons: reasons.slice(0, 3),
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [showResults, answers, units]);

  // Spider / Radar Dimensions
  const radarDimensions = [
    { label: 'Không Gian Xanh', value: answers.fitness === 'running_park' ? 95 : 75 },
    { label: 'Thân Thiện Pet', value: answers.pet === 'dog_cat' ? 98 : 70 },
    { label: 'Tiện Ích Xe Cộ', value: answers.mobility === 'car' ? 96 : 80 },
    { label: 'Độ Yên Tĩnh', value: answers.acoustics === 'super_quiet' ? 94 : 72 },
    { label: 'Vi Khí Hậu', value: answers.climate === 'morning_sun' ? 92 : 80 },
  ];

  const cx = 110;
  const cy = 110;
  const r = 80;
  const numAxes = 5;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const currentR = (val / 100) * r;
    return {
      x: cx + currentR * Math.cos(angle),
      y: cy + currentR * Math.sin(angle),
    };
  };

  const radarPolygonPoints = radarDimensions
    .map((dim, i) => {
      const { x, y } = getCoordinates(i, dim.value);
      return `${x},${y}`;
    })
    .join(' ');

  const currentQ = questions[currentStep];
  const isCurrentAnswered = answers[currentQ.id as keyof Answers] !== null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center shadow-xs shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-[#163300] dark:text-white tracking-tight">
                  Khảo Sát Lối Sống & Không Gian Sống
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#163300] text-[#9FE870] dark:bg-[#9FE870]/20 dark:text-[#9FE870] text-[10px] font-bold tracking-wider uppercase">
                  AI Match
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tìm căn hộ hoàn hảo dựa trên thói quen sinh hoạt và tiêu chuẩn cá nhân
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng khảo sát"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {isScanning ? (
            /* AI Scanning State */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-[#9FE870]/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-3 border-dashed border-[#20A05A] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#163300] dark:text-[#9FE870]" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#163300] dark:text-white">
                  Đang tính toán chỉ số tương thích...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Tổng hợp phân tích vi khí hậu • Bán kính công viên • Hầm xe • Mức độ yên tĩnh
                </p>
              </div>
            </div>
          ) : showResults ? (
            /* Matchmaker Result Screen */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Radar Chart & Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-6 rounded-[28px] bg-[#F7FAF6] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 items-center">
                
                {/* SVG Radar Chart */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-[200px] h-[200px]">
                    <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-sm">
                      {/* Concentric Circles */}
                      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={r * scale}
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.3)"
                          strokeDasharray={scale === 1 ? 'none' : '3,3'}
                        />
                      ))}

                      {/* Axes */}
                      {radarDimensions.map((_, i) => {
                        const { x, y } = getCoordinates(i, 100);
                        return (
                          <line
                            key={i}
                            x1={cx}
                            y1={cy}
                            x2={x}
                            y2={y}
                            stroke="rgba(148, 163, 184, 0.35)"
                          />
                        );
                      })}

                      {/* Radar Area */}
                      <polygon
                        points={radarPolygonPoints}
                        fill="rgba(159, 232, 112, 0.45)"
                        stroke="#163300"
                        strokeWidth="2.5"
                      />

                      {/* Radar Points */}
                      {radarDimensions.map((dim, i) => {
                        const { x, y } = getCoordinates(i, dim.value);
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#163300"
                            stroke="#9FE870"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[#163300] dark:text-[#9FE870] mt-2">
                    Biểu đồ cân bằng không gian sống
                  </span>
                </div>

                {/* Match Description */}
                <div className="md:col-span-7 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9FE870]/30 text-[#163300] dark:text-[#9FE870] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tìm thấy 4 căn hộ tương thích cao</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white leading-snug">
                    Hồ sơ không gian sống đạt độ phù hợp xuất sắc
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dựa trên các ưu tiên của bạn, HAVEN đã lọc ra những lựa chọn tối ưu nhất về môi trường sống, giao thông thuận tiện và chi phí hợp lý.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {radarDimensions.map((dim, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs"
                      >
                        {dim.label}: <strong className="text-[#163300] dark:text-[#9FE870]">{dim.value}%</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Units Grid */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#163300] dark:text-white uppercase tracking-wider">
                    Căn Hộ Đề Xuất Phù Hợp ({matchedResults.length})
                  </h4>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#20A05A] dark:text-[#9FE870] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại khảo sát</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedResults.map(({ unit, score, reasons }) => {
                    const isSaved = savedUnitIds.includes(unit.id);
                    return (
                      <div
                        key={unit.id}
                        className="group relative rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 hover:border-[#163300] dark:hover:border-[#9FE870] p-4 transition-all duration-300 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md"
                      >
                        {/* Unit Card Header */}
                        <div className="flex gap-3.5">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                            <SmartImage
                              src={unit.images[0]}
                              alt={unit.name || unit.id}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black shadow-xs">
                              {score}% MATCH
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <h5 className="font-bold text-sm text-[#163300] dark:text-white group-hover:text-[#20A05A] transition-colors line-clamp-1">
                                {unit.name || unit.id}
                              </h5>
                              <button
                                onClick={() => onToggleSaveUnit(unit.id)}
                                className={`p-1.5 rounded-xl border transition-colors shrink-0 ${
                                  isSaved
                                    ? 'bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] border-[#9FE870]'
                                    : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                                title={isSaved ? 'Bỏ lưu' : 'Lưu căn hộ'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {unit.district}, {unit.city} • Tầng {unit.floor} • {unit.sqm} m²
                            </p>

                            <div className="text-sm font-black text-[#163300] dark:text-[#9FE870]">
                              {(unit.monthlyRentVND / 1000000).toFixed(1)} Triệu/tháng
                            </div>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="space-y-1.5 bg-[#F9FAF8] dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-[11px]">
                          {reasons.map((r, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-[#20A05A] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{r}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTA */}
                        <button
                          onClick={() => {
                            onSelectUnit(unit.id);
                            onClose();
                          }}
                          className="w-full py-2.5 px-4 rounded-full bg-[#163300] hover:bg-[#20A05A] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Xem Chi Tiết Căn Này</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Multi-step Question View */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#163300] dark:text-[#9FE870] font-black uppercase tracking-wider">
                    {currentQ.badge}
                  </span>
                  <span className="text-slate-500 font-semibold">{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#9FE870] transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Header */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#163300] dark:text-white leading-tight">
                  {currentQ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {currentQ.options.map(opt => {
                  const isSelected = answers[currentQ.id as keyof Answers] === opt.key;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id as keyof Answers, opt.key)}
                      className={`p-4 sm:p-5 rounded-[22px] border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 border-[#163300] dark:border-[#9FE870] ring-2 ring-[#9FE870]/30 shadow-md'
                          : 'bg-[#F9FAF8] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl border ${
                          isSelected 
                            ? 'bg-[#163300] text-[#9FE870] dark:bg-[#9FE870] dark:text-[#163300] border-transparent' 
                            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#163300] dark:border-[#9FE870] bg-[#163300] dark:bg-[#9FE870] text-[#9FE870] dark:text-[#163300]'
                            : 'border-slate-300 dark:border-slate-600 bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-sm sm:text-base text-[#163300] dark:text-white">
                          {opt.title}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        {!isScanning && !showResults && (
          <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-850 flex items-center justify-between shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                currentStep === 0
                  ? 'text-slate-400 cursor-not-allowed opacity-50'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer px-3 py-1.5 rounded-full"
            >
              Bỏ qua
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                isCurrentAnswered
                  ? 'bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentStep === totalSteps - 1 ? 'Phân Tích Bằng AI' : 'Câu Tiếp Theo'}</span>
              {currentStep === totalSteps - 1 ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
