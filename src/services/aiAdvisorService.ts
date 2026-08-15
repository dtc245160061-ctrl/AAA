import type { ApartmentUnit } from '../types/apartment';

export interface ConsumerFilters {
  city?: 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang' | 'All';
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

  // 1. City Detection
  if (normalized.includes('hanoi')) {
    filters.city = 'Hanoi';
    classification.preferred.push('City: Hanoi');
  } else if (normalized.includes('hcmc')) {
    filters.city = 'Ho Chi Minh City';
    classification.preferred.push('City: Ho Chi Minh City');
  } else if (normalized.includes('danang')) {
    filters.city = 'Da Nang';
    classification.preferred.push('City: Da Nang');
  }

  // 2. District & Location Shorthand
  if (raw.includes('tây hồ') || raw.includes('tay ho') || raw.includes('west lake')) {
    filters.district = 'Tay Ho';
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('District: Tay Ho (Hanoi)');
  } else if (raw.includes('hoàn kiếm') || raw.includes('hoan kiem')) {
    filters.district = 'Hoan Kiem';
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('District: Hoan Kiem (Hanoi)');
  } else if (raw.includes('cầu giấy') || raw.includes('cau giay')) {
    if (!filters.city) filters.city = 'Hanoi';
    classification.preferred.push('Convenient access to Cau Giay workplace');
  } else if (raw.includes('thảo điền') || raw.includes('thao dien') || raw.includes('quận 2') || raw.includes('district 2')) {
    filters.district = 'Thu Duc / District 2';
    if (!filters.city) filters.city = 'Ho Chi Minh City';
    classification.preferred.push('District: Thao Dien / D2 (HCMC)');
  } else if (raw.includes('quận 1') || raw.includes('district 1') || raw.includes('q1')) {
    filters.district = 'District 1';
    if (!filters.city) filters.city = 'Ho Chi Minh City';
    classification.preferred.push('District: District 1 (HCMC)');
  } else if (raw.includes('sơn trà') || raw.includes('son tra') || raw.includes('mỹ khê') || raw.includes('my khe')) {
    filters.district = 'Son Tra';
    if (!filters.city) filters.city = 'Da Nang';
    classification.preferred.push('District: Son Tra Beachfront (Da Nang)');
  } else if (raw.includes('trung tâm') || raw.includes('central')) {
    classification.preferred.push('Convenient commute to City Center');
  }

  // 3. Bedrooms Detection ("2pn", "2 phòng", "2 phong ngu", "2 vợ chồng 1 con")
  const pnMatch = normalized.match(/(\d+)\s*pn/);
  if (pnMatch) {
    const beds = parseInt(pnMatch[1], 10);
    filters.minBedrooms = beds;
    classification.required.push(`${beds}+ Bedrooms`);
  } else if (raw.includes('vợ chồng 1 con') || raw.includes('hai vợ chồng') || raw.includes('gia đình') || raw.includes('family')) {
    filters.minBedrooms = 2;
    classification.preferred.push('2+ Bedrooms suitable for family setup');
  }

  // 4. Budget Regex (e.g. "tầm 18 củ", "dưới 20 củ", "duoi 20tr", "18m", "15 triệu")
  const cuMatch = normalized.match(/(tầm|dưới|duoi|dưới\s*tầm)?\s*(\d+)\s*củ/);
  if (cuMatch) {
    const num = parseInt(cuMatch[2], 10);
    filters.maxRentVND = num * 1000000;
    classification.preferred.push(`Max Budget: ~${num}M VND (${(num * 1000000 / 25000).toLocaleString('en-US')} USD)/mo`);
  }

  // 5. Car Parking ("oto", "đỗ xe ô tô", "de oto", "car")
  if (normalized.includes('oto') || raw.includes('car parking') || raw.includes('đỗ xe')) {
    filters.hasCarParking = true;
    classification.required.push('Car Parking Slot Required');
  }

  // 6. Elevator ("thangmay", "thang máy", "elevator")
  if (normalized.includes('thangmay')) {
    filters.hasElevator = true;
    classification.required.push('Elevator Building Access');
  }

  // 7. Floor Height Preference ("tầng cao", "không tầng thấp", "đừng tầng thấp quá")
  if (normalized.includes('tầng cao') || normalized.includes('không tầng thấp') || normalized.includes('đừng tầng thấp')) {
    filters.minFloor = 5;
    classification.preferred.push('Higher Floors (Floor 5+)');
    classification.avoid.push('Low Ground Floors');
  }

  // 8. Flooding & Monsoon Rain ("không ngập", "đừng ngập", "mưa")
  if (normalized.includes('ngập') || normalized.includes('mưa') || normalized.includes('flood')) {
    filters.floodingRisk = 'Low';
    classification.avoid.push('Monsoon Street Flooding Risk');
  }

  // 9. Quietness, Natural Light & Greenery ("yên tĩnh", "chill chill", "nhiều cây", "sáng sáng")
  if (normalized.includes('yên tĩnh') || normalized.includes('chill') || normalized.includes('cây') || normalized.includes('sáng')) {
    classification.preferred.push('Quiet Environment, Natural Light & Greenery');
    classification.avoid.push('Heavy Street Traffic Noise');
  }

  // Formatted Explanation Summary for User UI
  let formattedSummary = `HAVEN AI understood your search preferences:\n`;
  if (classification.required.length > 0) {
    formattedSummary += `\n• REQUIRED: ${classification.required.join(' • ')}`;
  }
  if (classification.preferred.length > 0) {
    formattedSummary += `\n• PREFERRED: ${classification.preferred.join(' • ')}`;
  }
  if (classification.avoid.length > 0) {
    formattedSummary += `\n• AVOID: ${classification.avoid.join(' • ')}`;
  }

  // Follow-up question if critical context is missing
  let followUpQuestion: string | undefined = undefined;
  if (!filters.city && !filters.district) {
    followUpQuestion = "Which city or neighborhood are you prioritizing (e.g., Hanoi, Ho Chi Minh City, or Da Nang)?";
  } else if (!filters.maxRentVND) {
    followUpQuestion = "What monthly budget limit in VND or USD would fit your setup best?";
  } else if (!filters.minBedrooms) {
    followUpQuestion = "How many bedrooms do you need for your stay?";
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

  if (filters.city && filters.city !== 'All' && unit.city !== filters.city) {
    score -= 50;
  } else if (filters.city && unit.city === filters.city) {
    matchReasons.push(`Matches target city (${unit.city})`);
  }

  if (filters.district && !unit.district.toLowerCase().includes(filters.district.toLowerCase())) {
    score -= 15;
  } else if (filters.district) {
    matchReasons.push(`Located in target area (${unit.district})`);
  }

  if (filters.minBedrooms && unit.bedrooms < filters.minBedrooms) {
    score -= 30;
  } else if (filters.minBedrooms && unit.bedrooms >= filters.minBedrooms) {
    matchReasons.push(`${unit.bedrooms} bedrooms fit your size requirement`);
  }

  if (filters.maxRentVND && unit.monthlyRentVND > filters.maxRentVND) {
    const diffRatio = (unit.monthlyRentVND - filters.maxRentVND) / filters.maxRentVND;
    if (diffRatio <= 0.2) {
      score -= 15;
      matchReasons.push(`Slightly above budget (+${Math.round(diffRatio * 100)}%) but high quality match`);
    } else {
      score -= 35;
    }
  } else if (filters.maxRentVND && unit.monthlyRentVND <= filters.maxRentVND) {
    matchReasons.push(`Fits target budget (${(unit.monthlyRentVND / 1000000).toFixed(0)}M VND)`);
  }

  if (filters.hasCarParking && unit.hasCarParking) {
    matchReasons.push('Guaranteed basement car parking available');
  } else if (filters.hasCarParking && !unit.hasCarParking) {
    score -= 25;
  }

  if (filters.hasElevator && unit.hasElevator) {
    matchReasons.push('Elevator building access');
  }

  if (filters.minFloor && unit.floor >= filters.minFloor) {
    matchReasons.push(`Floor ${unit.floor} matches higher floor preference`);
  }

  if (filters.floodingRisk === 'Low' && unit.floodingRisk === 'Low') {
    matchReasons.push('Low historical street flooding risk');
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
      headline: 'No apartments selected for comparison.',
      recommendedUnitId: '',
      reasoning: 'Please select at least 2 apartments to compare.',
      tradeOffs: []
    };
  }

  const sorted = [...units].sort((a, b) => b.rating - a.rating);
  const best = sorted[0];

  const tradeOffs = units.map(u => ({
    unitId: u.id,
    unitName: u.name || u.id,
    pros: [
      `${u.bedrooms} Bedrooms, ${u.sqm} sqm layout`,
      u.hasCarParking ? 'Dedicated car parking space' : 'Motorbike bay available',
      `Rating: ${u.rating} ⭐ (${u.reviewCount} reviews)`,
      ...u.aiInsights.whyFit.slice(0, 2)
    ],
    cons: [
      u.floodingRisk !== 'Low' ? `Flooding Risk: ${u.floodingRisk} during monsoon rains` : '',
      u.noiseLevel === 'Busy' ? 'Located near main road with traffic noise' : '',
      ...u.aiInsights.worthConsidering.slice(0, 2)
    ].filter(Boolean)
  }));

  return {
    headline: `AI Recommendation: ${best.name || best.id} offers the strongest overall balance.`,
    recommendedUnitId: best.id,
    reasoning: `Based on location quality in ${best.district}, floor area (${best.sqm} sqm), car parking, and low environmental flood risk, ${best.name || best.id} provides the most comfortable residential experience.`,
    tradeOffs
  };
}
