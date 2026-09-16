import type { ApartmentUnit } from '../types/apartment';

export interface ConsumerFilters {
  city?: string;
  district?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  maxRentVND?: number;
  minRentVND?: number;
  hasCarParking?: boolean;
  hasMotorbikeParking?: boolean;
  hasElevator?: boolean;
  petFriendly?: boolean;
  minFloor?: number;
  floodingRisk?: 'Low' | 'Moderate' | 'High' | 'All';
  hasBackupPower?: boolean;
  searchKeyword?: string;
}

export interface CriteriaClassification {
  required: string[];
  preferred: string[];
  avoid: string[];
}

export interface AIParsedQuery {
  understoodText: string;
  extractedFilters: ConsumerFilters;
  classification: CriteriaClassification;
  followUpQuestion?: string;
}

export interface ComparisonResult {
  headline: string;
  recommendedUnitId: string;
  reasoning: string;
  tradeOffs: {
    unitId: string;
    unitName: string;
    pros: string[];
    cons: string[];
  }[];
}

/**
 * Robust Natural Language Parser for HAVEN AI Housing Advisor
 * Parses informal Vietnamese, shorthand, abbreviations, typos, unaccented text, and VND expressions.
 */
export function parseNaturalLanguageQuery(queryText: string): AIParsedQuery {
  const raw = queryText.toLowerCase();

  // Normalize common shorthand tokens
  const normalized = raw
    .replace(/triệu|củ|tr|m\b/g, 'củ')
    .replace(/phòng ngủ|phong ngu|phòng|pn|bed|br\b/g, 'pn')
    .replace(/ô tô|xe hơi|de oto|oto|car\b/g, 'oto')
    .replace(/thang máy|thang may|elevator\b/g, 'thangmay')
    .replace(/hà nội|ha noi|hanoi|hn\b/g, 'hanoi')
    .replace(/sài gòn|saigon|hồ chí minh|ho chi minh|hcmc|hcm|sg\b/g, 'hcmc')
    .replace(/đà nẵng|da nang|danang|dn\b/g, 'danang');

  const filters: ConsumerFilters = {};
  const classification: CriteriaClassification = {
    required: [],
    preferred: [],
    avoid: []
  };

  // 1. City / Province Detection (All 63 provinces of Vietnam)
  const VIETNAM_PROVINCES: Array<{ keywords: string[]; city: string; label: string }> = [
    { keywords: ['thái nguyên', 'thai nguyen', 'tn'], city: 'Thái Nguyên', label: 'Thái Nguyên' },
    { keywords: ['hà nội', 'ha noi', 'hanoi', 'hn'], city: 'Hanoi', label: 'Hà Nội' },
    { keywords: ['hồ chí minh', 'ho chi minh', 'sài gòn', 'saigon', 'hcmc', 'hcm', 'sg', 'tphcm'], city: 'Ho Chi Minh City', label: 'TP. Hồ Chí Minh' },
    { keywords: ['đà nẵng', 'da nang', 'danang', 'dn'], city: 'Da Nang', label: 'Đà Nẵng' },
    { keywords: ['hải phòng', 'hai phong', 'hp'], city: 'Hai Phong', label: 'Hải Phòng' },
    { keywords: ['bắc ninh', 'bac ninh', 'bn'], city: 'Bắc Ninh', label: 'Bắc Ninh' },
    { keywords: ['bắc giang', 'bac giang', 'bg'], city: 'Bắc Giang', label: 'Bắc Giang' },
    { keywords: ['bình dương', 'binh duong', 'bd'], city: 'Binh Duong', label: 'Bình Dương' },
    { keywords: ['quảng ninh', 'quang ninh', 'hạ long', 'ha long', 'qn'], city: 'Quảng Ninh', label: 'Quảng Ninh' },
    { keywords: ['nha trang', 'khánh hòa', 'khanh hoa'], city: 'Nha Trang', label: 'Nha Trang' },
    { keywords: ['cần thơ', 'can tho'], city: 'Can Tho', label: 'Cần Thơ' },
    { keywords: ['vũng tàu', 'vung tau', 'bà rịa', 'ba ria'], city: 'Vung Tau', label: 'Vũng Tàu' },
    { keywords: ['đà lạt', 'da lat', 'lâm đồng', 'lam dong'], city: 'Da Lat', label: 'Đà Lạt' },
    { keywords: ['huế', 'hue', 'thừa thiên huế'], city: 'Hue', label: 'Huế' },
    { keywords: ['quy nhơn', 'quy nhon', 'bình định', 'binh dinh'], city: 'Quy Nhon', label: 'Quy Nhơn' },
    { keywords: ['biên hòa', 'bien hoa', 'đồng nai', 'dong nai'], city: 'Bien Hoa', label: 'Biên Hòa' },
    { keywords: ['vinh', 'nghệ an', 'nghe an'], city: 'Vinh', label: 'Vinh' },
    { keywords: ['thanh hóa', 'thanh hoa'], city: 'Thanh Hoa', label: 'Thanh Hóa' },
    { keywords: ['buôn ma thuột', 'buon ma thuot', 'đắk lắk', 'dak lak'], city: 'Buon Ma Thuot', label: 'Buôn Ma Thuột' },
    { keywords: ['hải dương', 'hai duong'], city: 'Hải Dương', label: 'Hải Dương' },
    { keywords: ['hưng yên', 'hung yen'], city: 'Hưng Yên', label: 'Hưng Yên' },
    { keywords: ['nam định', 'nam dinh'], city: 'Nam Định', label: 'Nam Định' },
    { keywords: ['thái bình', 'thai binh'], city: 'Thái Bình', label: 'Thái Bình' },
    { keywords: ['vĩnh phúc', 'vinh phuc', 'vĩnh yên'], city: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
    { keywords: ['phú thọ', 'phu tho', 'việt trì'], city: 'Phú Thọ', label: 'Phú Thọ' },
    { keywords: ['lào cai', 'lao cai', 'sa pa', 'sapa'], city: 'Lào Cai', label: 'Lào Cai' },
    { keywords: ['hòa bình', 'hoa binh'], city: 'Hòa Bình', label: 'Hòa Bình' },
    { keywords: ['hà nam', 'ha nam', 'phủ lý'], city: 'Hà Nam', label: 'Hà Nam' },
    { keywords: ['ninh bình', 'ninh binh'], city: 'Ninh Bình', label: 'Ninh Bình' },
    { keywords: ['hà tĩnh', 'ha tinh'], city: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { keywords: ['quảng bình', 'quang binh', 'đồng hới'], city: 'Quảng Bình', label: 'Quảng Bình' },
    { keywords: ['quảng trị', 'quang tri'], city: 'Quảng Trị', label: 'Quảng Trị' },
    { keywords: ['quảng nam', 'quang nam', 'hội an'], city: 'Quảng Nam', label: 'Quảng Nam' },
    { keywords: ['quảng ngãi', 'quang ngai'], city: 'Quảng Ngãi', label: 'Quảng Ngãi' },
    { keywords: ['phú yên', 'phu yen', 'tuy hòa'], city: 'Phú Yên', label: 'Phú Yên' },
    { keywords: ['ninh thuận', 'ninh thuan', 'phan rang'], city: 'Ninh Thuận', label: 'Ninh Thuận' },
    { keywords: ['bình thuận', 'binh thuan', 'phan thiết'], city: 'Bình Thuận', label: 'Bình Thuận' },
    { keywords: ['kon tum', 'kontum'], city: 'Kon Tum', label: 'Kon Tum' },
    { keywords: ['gia lai', 'pleiku'], city: 'Gia Lai', label: 'Gia Lai' },
    { keywords: ['đắk nông', 'dak nong'], city: 'Đắk Nông', label: 'Đắk Nông' },
    { keywords: ['tây ninh', 'tay ninh'], city: 'Tây Ninh', label: 'Tây Ninh' },
    { keywords: ['bình phước', 'binh phuoc'], city: 'Bình Phước', label: 'Bình Phước' },
    { keywords: ['long an', 'tân an'], city: 'Long An', label: 'Long An' },
    { keywords: ['tiền giang', 'mỹ tho'], city: 'Tiền Giang', label: 'Tiền Giang' },
    { keywords: ['bến tre', 'ben tre'], city: 'Bến Tre', label: 'Bến Tre' },
    { keywords: ['trà vinh', 'tra vinh'], city: 'Trà Vinh', label: 'Trà Vinh' },
    { keywords: ['vĩnh long', 'vinh long'], city: 'Vĩnh Long', label: 'Vĩnh Long' },
    { keywords: ['đồng tháp', 'dong thap', 'cao lãnh'], city: 'Đồng Tháp', label: 'Đồng Tháp' },
    { keywords: ['an giang', 'long xuyên', 'châu đốc'], city: 'An Giang', label: 'An Giang' },
    { keywords: ['kiên giang', 'rạch giá', 'phú quốc'], city: 'Kiên Giang', label: 'Kiên Giang' },
    { keywords: ['hậu giang', 'vị thanh'], city: 'Hậu Giang', label: 'Hậu Giang' },
    { keywords: ['sóc trăng', 'soc trang'], city: 'Sóc Trăng', label: 'Sóc Trăng' },
    { keywords: ['bạc liêu', 'bac lieu'], city: 'Bạc Liêu', label: 'Bạc Liêu' },
    { keywords: ['cà mau', 'ca mau'], city: 'Cà Mau', label: 'Cà Mau' },
    { keywords: ['tuyên quang', 'tuyen quang'], city: 'Tuyên Quang', label: 'Tuyên Quang' },
    { keywords: ['hà giang', 'ha giang'], city: 'Hà Giang', label: 'Hà Giang' },
    { keywords: ['cao bằng', 'cao bang'], city: 'Cao Bằng', label: 'Cao Bằng' },
    { keywords: ['bắc kạn', 'bac kan'], city: 'Bắc Kạn', label: 'Bắc Kạn' },
    { keywords: ['lạng sơn', 'lang son'], city: 'Lạng Sơn', label: 'Lạng Sơn' },
    { keywords: ['yên bái', 'yen bai'], city: 'Yên Bái', label: 'Yên Bái' },
    { keywords: ['sơn la', 'son la', 'mộc châu'], city: 'Sơn La', label: 'Sơn La' },
    { keywords: ['điện biên', 'dien bien'], city: 'Điện Biên', label: 'Điện Biên' },
    { keywords: ['lai châu', 'lai chau'], city: 'Lai Châu', label: 'Lai Châu' }
  ];

  for (const prov of VIETNAM_PROVINCES) {
    if (prov.keywords.some(k => raw.includes(k) || normalized.includes(k))) {
      filters.city = prov.city;
      classification.preferred.push(`Địa điểm: ${prov.label}`);
      break;
    }
  }

  // 2. District & Location Shorthand
  if (raw.includes('tây hồ') || raw.includes('tay ho') || raw.includes('west lake')) {
    filters.district = 'Tây Hồ';
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('Khu vực: Quận Tây Hồ (Hà Nội)');
  } else if (raw.includes('hoàn kiếm') || raw.includes('hoan kiem')) {
    filters.district = 'Hoàn Kiếm';
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('Khu vực: Quận Hoàn Kiếm (Hà Nội)');
  } else if (raw.includes('cầu giấy') || raw.includes('cau giay')) {
    filters.district = 'Cầu Giấy';
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('Khu vực: Quận Cầu Giấy (Hà Nội)');
  } else if (raw.includes('thảo điền') || raw.includes('thao dien') || raw.includes('quận 2') || raw.includes('district 2')) {
    filters.district = 'Thủ Đức';
    if (!filters.city) filters.city = 'Ho Chi Minh City';
    classification.preferred.push('Khu vực: Thảo Điền / TP. Thủ Đức (TP.HCM)');
  } else if (raw.includes('quận 1') || raw.includes('district 1') || raw.includes('q1')) {
    filters.district = 'Quận 1';
    if (!filters.city) filters.city = 'Ho Chi Minh City';
    classification.preferred.push('Khu vực: Quận 1 (TP.HCM)');
  } else if (raw.includes('quận 7') || raw.includes('district 7') || raw.includes('q7') || raw.includes('phú mỹ hưng')) {
    filters.district = 'Quận 7';
    if (!filters.city) filters.city = 'Ho Chi Minh City';
    classification.preferred.push('Khu vực: Quận 7 / Phú Mỹ Hưng (TP.HCM)');
  } else if (raw.includes('sơn trà') || raw.includes('son tra') || raw.includes('mỹ khê') || raw.includes('my khe')) {
    filters.district = 'Sơn Trà';
    if (!filters.city) filters.city = 'Da Nang';
    classification.preferred.push('Khu vực: Sơn Trà / Biển Mỹ Khê (Đà Nẵng)');
  } else if (raw.includes('trung tâm') || raw.includes('central')) {
    classification.preferred.push('Gần trung tâm thành phố');
  }

  // 3. Bedrooms Detection ("2pn", "2 phòng", "2 phong ngu", "2 vợ chồng 1 con")
  const pnMatch = normalized.match(/(\d+)\s*pn/);
  if (pnMatch) {
    const beds = parseInt(pnMatch[1], 10);
    filters.minBedrooms = beds;
    classification.required.push(`Từ ${beds} phòng ngủ trở lên`);
  } else if (raw.includes('vợ chồng 1 con') || raw.includes('hai vợ chồng') || raw.includes('gia đình') || raw.includes('family')) {
    filters.minBedrooms = 2;
    classification.preferred.push('Từ 2 phòng ngủ trở lên (phù hợp gia đình)');
  }

  // 4. Budget Regex (e.g. "tầm 18 củ", "dưới 20 củ", "duoi 20tr", "18m", "15 triệu")
  const cuMatch = normalized.match(/(tầm|dưới|duoi|dưới\s*tầm)?\s*(\d+)\s*củ/);
  if (cuMatch) {
    const num = parseInt(cuMatch[2], 10);
    filters.maxRentVND = num * 1000000;
    classification.preferred.push(`Ngân sách tối đa: ~${num} Triệu VNĐ/tháng`);
  }

  // 5. Car Parking ("oto", "đỗ xe ô tô", "de oto", "car")
  if (normalized.includes('oto') || raw.includes('car parking') || raw.includes('đỗ xe')) {
    filters.hasCarParking = true;
    classification.required.push('Có chỗ đỗ ô tô định danh');
  }

  // 6. Elevator ("thangmay", "thang máy", "elevator")
  if (normalized.includes('thangmay')) {
    filters.hasElevator = true;
    classification.required.push('Có thang máy di chuyển');
  }

  // 7. Floor Height Preference ("tầng cao", "không tầng thấp", "đừng tầng thấp quá")
  if (normalized.includes('tầng cao') || normalized.includes('không tầng thấp') || normalized.includes('đừng tầng thấp')) {
    filters.minFloor = 5;
    classification.preferred.push('Tầng cao thoáng mát (Tầng 5 trở lên)');
    classification.avoid.push('Tránh tầng thấp sát mặt đất');
  }

  // 8. Flooding & Monsoon Rain ("không ngập", "đừng ngập", "mưa")
  if (normalized.includes('ngập') || normalized.includes('mưa') || normalized.includes('flood')) {
    filters.floodingRisk = 'Low';
    classification.avoid.push('Tránh khu vực ngập úng khi mưa to / triều cường');
  }

  // 9. Quietness, Natural Light & Greenery ("yên tĩnh", "chill chill", "nhiều cây", "sáng sáng")
  if (normalized.includes('yên tĩnh') || normalized.includes('chill') || normalized.includes('cây') || normalized.includes('sáng')) {
    classification.preferred.push('Không gian yên tĩnh, nhiều cây xanh & ánh sáng');
    classification.avoid.push('Tiếng ồn xe cộ đường lớn');
  }

  // Formatted Explanation Summary for User UI
  let formattedSummary = `Trợ lý AI HAVEN đã phân tích các tiêu chí của bạn:\n`;
  if (classification.required.length > 0) {
    formattedSummary += `\n• BẮT BUỘC: ${classification.required.join(' • ')}`;
  }
  if (classification.preferred.length > 0) {
    formattedSummary += `\n• ƯU TIÊN: ${classification.preferred.join(' • ')}`;
  }
  if (classification.avoid.length > 0) {
    formattedSummary += `\n• TRÁNH: ${classification.avoid.join(' • ')}`;
  }

  // Follow-up question if critical context is missing
  let followUpQuestion: string | undefined = undefined;
  if (!filters.city && !filters.district) {
    followUpQuestion = "Bạn ưu tiên tìm căn hộ tại thành phố nào (Hà Nội, TP. Hồ Chí Minh hay Đà Nẵng)?";
  } else if (!filters.maxRentVND) {
    followUpQuestion = "Mức ngân sách thuê hàng tháng phù hợp với bạn là bao nhiêu Triệu/tháng?";
  } else if (!filters.minBedrooms) {
    followUpQuestion = "Bạn đang cần tìm căn hộ có mấy phòng ngủ?";
  }

  return {
    understoodText: formattedSummary,
    extractedFilters: filters,
    classification,
    followUpQuestion
  };
}

/**
 * Calculate Match Score % for an apartment against active filters
 */
export function calculateMatchScore(unit: ApartmentUnit, filters: ConsumerFilters): { score: number; matchReasons: string[] } {
  let score = 100;
  const matchReasons: string[] = [];

  const cityNameMap: Record<string, string> = {
    'Hanoi': 'Hà Nội',
    'Ho Chi Minh City': 'TP. Hồ Chí Minh',
    'Da Nang': 'Đà Nẵng'
  };

  if (filters.city && filters.city !== 'All' && unit.city !== filters.city) {
    score -= 50;
  } else if (filters.city && unit.city === filters.city) {
    matchReasons.push(`Chuẩn địa điểm ${cityNameMap[unit.city] || unit.city}`);
  }

  if (filters.district && !unit.district.toLowerCase().includes(filters.district.toLowerCase())) {
    score -= 15;
  } else if (filters.district) {
    matchReasons.push(`Nằm ngay khu vực ${unit.district}`);
  }

  if (filters.minBedrooms && unit.bedrooms < filters.minBedrooms) {
    score -= 30;
  } else if (filters.minBedrooms && unit.bedrooms >= filters.minBedrooms) {
    matchReasons.push(`${unit.bedrooms} phòng ngủ đúng nhu cầu`);
  }

  if (filters.maxRentVND && unit.monthlyRentVND > filters.maxRentVND) {
    const diffRatio = (unit.monthlyRentVND - filters.maxRentVND) / filters.maxRentVND;
    if (diffRatio <= 0.2) {
      score -= 15;
      matchReasons.push(`Cao hơn ngân sách (${Math.round(diffRatio * 100)}%) nhưng chất lượng vượt trội`);
    } else {
      score -= 35;
    }
  } else if (filters.maxRentVND && unit.monthlyRentVND <= filters.maxRentVND) {
    matchReasons.push(`Ngân sách tối ưu (${(unit.monthlyRentVND / 1000000).toFixed(0)}Tr/tháng)`);
  }

  if (filters.hasCarParking && unit.hasCarParking) {
    matchReasons.push('Có sẵn chỗ đỗ ô tô trong hầm');
  } else if (filters.hasCarParking && !unit.hasCarParking) {
    score -= 25;
  }

  if (filters.hasElevator && unit.hasElevator) {
    matchReasons.push('Tòa nhà trang bị thang máy tốc độ cao');
  }

  if (filters.minFloor && unit.floor >= filters.minFloor) {
    matchReasons.push(`Tầng ${unit.floor} cao ráo, thoáng mát`);
  }

  if (filters.floodingRisk === 'Low' && unit.floodingRisk === 'Low') {
    matchReasons.push('Không ngập lụt, hạ tầng cao ráo');
  }

  const finalScore = Math.max(35, Math.min(99, score));
  return { score: finalScore, matchReasons: matchReasons.slice(0, 3) };
}

/**
 * Compare apartments side-by-side with AI trade-offs
 */
export function compareApartments(units: ApartmentUnit[]): ComparisonResult {
  if (units.length === 0) {
    return {
      headline: 'Chưa có căn hộ nào được chọn để so sánh.',
      recommendedUnitId: '',
      reasoning: 'Vui lòng chọn ít nhất 2 căn hộ từ danh sách yêu thích để phân tích.',
      tradeOffs: []
    };
  }

  const sorted = [...units].sort((a, b) => b.rating - a.rating);
  const best = sorted[0];

  const tradeOffs = units.map(u => ({
    unitId: u.id,
    unitName: u.name || u.id,
    pros: [
      `${u.bedrooms} Phòng ngủ • Diện tích ${u.sqm} m²`,
      u.hasCarParking ? 'Có chỗ đỗ ô tô định danh' : 'Bãi đỗ xe máy rộng rãi',
      `Đánh giá: ${u.rating} ⭐ (${u.reviewCount} lượt đánh giá)`,
      ...u.aiInsights.whyFit.slice(0, 2)
    ],
    cons: [
      u.floodingRisk !== 'Low' ? `Nguy cơ ngập đường: Mức ${u.floodingRisk === 'Moderate' ? 'Trung bình' : 'Cao'} khi triều cường/mưa lớn` : '',
      u.noiseLevel === 'Busy' || u.noiseLevel === 'Moderate' ? 'Mật độ xe cộ đường chính giờ tan tầm khá đông' : '',
      ...u.aiInsights.worthConsidering.slice(0, 2)
    ].filter(Boolean)
  }));

  return {
    headline: `Gợi ý từ AI: ${best.name || best.id} là lựa chọn cân bằng và xuất sắc nhất.`,
    recommendedUnitId: best.id,
    reasoning: `Dựa trên vị trí đắc địa tại ${best.district}, diện tích rộng rãi (${best.sqm} m²), chỗ đỗ ô tô riêng biệt và điểm an toàn ngập lụt tối ưu, ${best.name || best.id} mang lại trải nghiệm sống tiện nghi nhất cho bạn.`,
    tradeOffs
  };
}
