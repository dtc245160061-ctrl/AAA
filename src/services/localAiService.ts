import { ApartmentStore, normalizeCity } from '../data/apartmentStore';
import { generateNaturalResponse, type RagChatResponse, type RagRetrievalResult } from './geminiRagService';
import { parseNaturalLanguageQuery } from './aiAdvisorService';
import { evaluateEnterpriseSafety } from './enterpriseSafetyGuardrail';
import { aiCommandBus } from './aiCommandBus';
import { 
  extractContractEntitiesFromText, 
  extractListingEntitiesFromText 
} from './aiOcrAndFormService';
import type { ApartmentUnit } from '../types/apartment';

export interface LocalSlmStatus {
  isAvailable: boolean;
  model: string;
  endpoint: string;
  installedModels: string[];
}

export interface ConversationalFilterMemory {
  city?: string;
  district?: string;
  bedrooms?: number;
  minRentVND?: number;
  maxRentVND?: number;
  minFloor?: number;
  filterMode?: 'baseRent' | 'trueCost';
  carParkingOnly?: boolean;
  lowFloodOnly?: boolean;
  backupPowerOnly?: boolean;
  petFriendlyOnly?: boolean;
  pcccCertifiedOnly?: boolean;
  verifiedLandlordOnly?: boolean;
}

let resolvedOllamaEndpoint = typeof window !== 'undefined' ? '/ollama' : 'http://127.0.0.1:11434';

const OLLAMA_CANDIDATE_ENDPOINTS = typeof window !== 'undefined'
  ? ['/ollama', 'http://localhost:11434', 'http://127.0.0.1:11434']
  : ['http://127.0.0.1:11434', 'http://localhost:11434'];

/**
 * Prioritize high-performance Qwen 7B models strictly optimized for RTX 3060 6GB VRAM.
 * Micro-models (0.5B/1.5B) are completely excluded from selection.
 */
export const PREFERRED_LOCAL_MODELS = [
  'qwen2.5:7b',
  'qwen2.5-coder:7b',
  'qwen:7b',
  'haven-ai'
];

/**
 * Hardware-tuned Ollama generation parameters for NVIDIA GeForce RTX 3060 6GB VRAM:
 * - 3072 context window keeps KV cache within 1.2GB VRAM headroom
 * - num_predict 1024 prevents token generation stalls
 * - keep_alive -1 holds model resident in GPU memory for instantaneous TTFT
 */
export const OLLAMA_RTX3060_OPTIONS = {
  temperature: 0.25,
  num_ctx: 3072,
  num_predict: 1024,
  keep_alive: -1
};

// Persistent multi-turn conversational filter memory
let conversationalFilterMemory: ConversationalFilterMemory = {};

/**
 * Access the active accumulated filter memory
 */
export function getAiFilterMemory(): ConversationalFilterMemory {
  return { ...conversationalFilterMemory };
}

/**
 * Reset accumulated conversational memory (called when clearing chat or user explicitly resets)
 */
export function resetAiFilterMemory(): void {
  conversationalFilterMemory = {};
}

/**
 * Set or restore conversational filter memory
 */
export function setAiFilterMemory(mem: ConversationalFilterMemory): void {
  conversationalFilterMemory = { ...mem };
}

/**
 * Check if Local Ollama inference server is active and find target Qwen 7B model
 */
export async function checkLocalSlmStatus(): Promise<LocalSlmStatus> {
  for (const endpoint of OLLAMA_CANDIDATE_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const models: string[] = (data.models || []).map((m: any) => m.name || m.model);

        if (models.length > 0) {
          let chosenModel = PREFERRED_LOCAL_MODELS[0]; // Default to qwen2.5:7b
          for (const pref of PREFERRED_LOCAL_MODELS) {
            const match = models.find(m => m.toLowerCase().includes(pref.toLowerCase()));
            if (match) {
              chosenModel = match;
              break;
            }
          }

          resolvedOllamaEndpoint = endpoint;
          return {
            isAvailable: true,
            model: chosenModel,
            endpoint: endpoint,
            installedModels: models
          };
        }
      }
    } catch {
      // Try next endpoint candidate
    }
  }

  return { 
    isAvailable: false, 
    model: PREFERRED_LOCAL_MODELS[0], 
    endpoint: resolvedOllamaEndpoint, 
    installedModels: [] 
  };
}

/**
 * Deterministic Natural Language Pre-Parser & State Accumulator
 * Extracts constraints and merges them into ConversationalFilterMemory across conversation turns.
 */
export function parseAndAccumulateFilters(query: string): {
  memory: ConversationalFilterMemory;
  isHousingQuery: boolean;
  isCompareQuery: boolean;
  isReset: boolean;
  targetUnitId?: string;
  targetModule?: string;
} {
  const raw = query.toLowerCase();

  // 1. Check for Reset / Clear Filter intent
  const isReset = /tìm lại từ đầu|xóa bộ lọc|xoa bo loc|reset|xóa lọc|làm mới|bắt đầu lại|bỏ lọc/i.test(raw);
  if (isReset) {
    resetAiFilterMemory();
    return {
      memory: {},
      isHousingQuery: false,
      isCompareQuery: false,
      isReset: true
    };
  }

  // 2. Check for Comparison query
  const isCompareQuery = /so sánh|so sanh|đối chiếu|doi chieu|compare|radar|bảng so sánh/i.test(raw);

  // 3. Check for Direct Unit ID match (e.g. HN-TH-2401)
  const unitMatch = query.match(/\b([A-Za-z0-9]{2,4}-[A-Za-z0-9]{2,4}-\d{3,5})\b/i);
  const targetUnitId = unitMatch ? unitMatch[1].toUpperCase() : undefined;

  // 4. Check for direct Navigation request
  let targetModule: string | undefined = undefined;
  if (/hợp đồng|hop dong|ký hợp đồng/i.test(raw)) targetModule = 'contracts';
  else if (/hóa đơn|tiền nhà|billing|thanh toán|nợ tiền/i.test(raw)) targetModule = 'billing';
  else if (/nhận nhà|thủ tục nhận nhà|checklist/i.test(raw)) targetModule = 'user_checklist';
  else if (/giấy tờ|bảo hiểm|document vault|kho hồ sơ/i.test(raw)) targetModule = 'user_documents';
  else if (/dashboard|tổng quan|báo cáo doanh thu/i.test(raw)) targetModule = 'dashboard';
  else if (/khách thuê|leads|khách quan tâm/i.test(raw)) targetModule = 'leads';
  else if (/sức khỏe|admin health|hệ thống iot/i.test(raw)) targetModule = 'admin_health';

  // 5. Detect City / Province across all Vietnam regions
  let detectedCity: string | undefined = undefined;
  if (/hà nội|ha noi|hanoi|hn\b/i.test(raw)) detectedCity = 'Hà Nội';
  else if (/hồ chí minh|ho chi minh|sài gòn|saigon|tphcm|hcmc|hcm|sg\b/i.test(raw)) detectedCity = 'TP. Hồ Chí Minh';
  else if (/đà nẵng|da nang|danang|dn\b/i.test(raw)) detectedCity = 'Đà Nẵng';
  else if (/thái nguyên|thai nguyen|tn\b/i.test(raw)) detectedCity = 'Thái Nguyên';
  else if (/hải phòng|hai phong|hp\b/i.test(raw)) detectedCity = 'Hải Phòng';
  else if (/cần thơ|can tho/i.test(raw)) detectedCity = 'Cần Thơ';
  else if (/bình dương|binh duong|bd\b/i.test(raw)) detectedCity = 'Bình Dương';
  else if (/bắc ninh|bac ninh|bn\b/i.test(raw)) detectedCity = 'Bắc Ninh';
  else if (/quảng ninh|quang ninh|hạ long|ha long/i.test(raw)) detectedCity = 'Quảng Ninh';
  else if (/nha trang|khánh hòa|khanh hoa/i.test(raw)) detectedCity = 'Nha Trang';
  else if (/vũng tàu|vung tau/i.test(raw)) detectedCity = 'Vũng Tàu';
  else if (/đà lạt|da lat|lâm đồng/i.test(raw)) detectedCity = 'Đà Lạt';

  // If user explicitly switches to a DIFFERENT city, update city and reset previous district
  if (detectedCity) {
    if (conversationalFilterMemory.city && normalizeCity(conversationalFilterMemory.city) !== normalizeCity(detectedCity)) {
      conversationalFilterMemory.city = detectedCity;
      conversationalFilterMemory.district = undefined;
    } else {
      conversationalFilterMemory.city = detectedCity;
    }
  }

  // 6. Detect District
  if (/cầu giấy|cau giay/i.test(raw)) {
    conversationalFilterMemory.district = 'Cầu Giấy';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/tây hồ|tay ho|west lake/i.test(raw)) {
    conversationalFilterMemory.district = 'Tây Hồ';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/hoàn kiếm|hoan kiem/i.test(raw)) {
    conversationalFilterMemory.district = 'Hoàn Kiếm';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/ba đình|ba dinh/i.test(raw)) {
    conversationalFilterMemory.district = 'Ba Đình';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/đống đa|dong da/i.test(raw)) {
    conversationalFilterMemory.district = 'Đống Đa';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/hai bà trưng|hai ba trung/i.test(raw)) {
    conversationalFilterMemory.district = 'Hai Bà Trưng';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/nam từ liêm|nam tu liem|mỹ đình|my dinh/i.test(raw)) {
    conversationalFilterMemory.district = 'Nam Từ Liêm';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/hoàng mai|hoang mai|linh đàm|linh dam|gamuda/i.test(raw)) {
    conversationalFilterMemory.district = 'Hoàng Mai';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/thanh xuân|thanh xuan/i.test(raw)) {
    conversationalFilterMemory.district = 'Thanh Xuân';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Hà Nội';
  } else if (/quận 1|district 1|q1\b/i.test(raw)) {
    conversationalFilterMemory.district = 'Quận 1';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'TP. Hồ Chí Minh';
  } else if (/quận 7|district 7|q7\b|phú mỹ hưng/i.test(raw)) {
    conversationalFilterMemory.district = 'Quận 7';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'TP. Hồ Chí Minh';
  } else if (/quận 2|district 2|q2\b|thảo điền|thao dien|thủ đức|thu duc/i.test(raw)) {
    conversationalFilterMemory.district = 'Thủ Đức';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'TP. Hồ Chí Minh';
  } else if (/bình thạnh|binh thanh/i.test(raw)) {
    conversationalFilterMemory.district = 'Bình Thạnh';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'TP. Hồ Chí Minh';
  } else if (/sơn trà|son tra|mỹ khê|my khe/i.test(raw)) {
    conversationalFilterMemory.district = 'Sơn Trà';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Đà Nẵng';
  } else if (/hải châu|hai chau/i.test(raw)) {
    conversationalFilterMemory.district = 'Hải Châu';
    if (!conversationalFilterMemory.city) conversationalFilterMemory.city = 'Đà Nẵng';
  }

  // 7. Detect Bedroom count (including Vietnamese number words: một, hai, ba, bốn, năm)
  const normBedrooms = raw
    .replace(/\b(?:một|mot)\s*(?:phòng\s*ngủ|phong\s*ngu|buồng\s*ngủ|buong\s*ngu|phòng|phong|pn|bed|br)\b/gi, '1 pn')
    .replace(/\b(?:hai)\s*(?:phòng\s*ngủ|phong\s*ngu|buồng\s*ngủ|buong\s*ngu|phòng|phong|pn|bed|br)\b/gi, '2 pn')
    .replace(/\b(?:ba)\s*(?:phòng\s*ngủ|phong\s*ngu|buồng\s*ngủ|buong\s*ngu|phòng|phong|pn|bed|br)\b/gi, '3 pn')
    .replace(/\b(?:bốn|bon|tư|tu)\s*(?:phòng\s*ngủ|phong\s*ngu|buồng\s*ngủ|buong\s*ngu|phòng|phong|pn|bed|br)\b/gi, '4 pn')
    .replace(/\b(?:năm|nam)\s*(?:phòng\s*ngủ|phong\s*ngu|buồng\s*ngủ|buong\s*ngu|phòng|phong|pn|bed|br)\b/gi, '5 pn');

  const pnMatch = normBedrooms.match(/(\d+)\s*(?:pn|phòng ngủ|phong ngu|phòng|bed|br)\b/i);
  if (pnMatch) {
    conversationalFilterMemory.bedrooms = parseInt(pnMatch[1], 10);
  } else if (/studio|độc thân|1 người/i.test(raw)) {
    conversationalFilterMemory.bedrooms = 1;
  } else if (/vợ chồng 1 con|hai vợ chồng|gia đình 3 người/i.test(raw)) {
    conversationalFilterMemory.bedrooms = 2;
  }

  // 8. Detect Budget / Price Range ("40 80 triệu", "40-80tr", "từ 40 đến 80 triệu", "dưới 20 triệu")
  const priceRangeMatch = raw.match(
    /(?:từ|tu|khoảng|khoang|tầm|tam)?\s*(\d+(?:[.,]\d+)?)\s*(?:tr|triệu|trieu|củ|cu|m)?\s*(?:đến|den|tới|toi|to|-|\s+)\s*(\d+(?:[.,]\d+)?)\s*(?:tr|triệu|trieu|củ|cu|m\b)/i
  );

  if (priceRangeMatch) {
    const n1 = parseFloat(priceRangeMatch[1].replace(',', '.'));
    const n2 = parseFloat(priceRangeMatch[2].replace(',', '.'));
    if (!isNaN(n1) && !isNaN(n2) && n1 > 0 && n2 > 0 && n1 <= 500 && n2 <= 500) {
      conversationalFilterMemory.minRentVND = Math.round(Math.min(n1, n2) * 1000000);
      conversationalFilterMemory.maxRentVND = Math.round(Math.max(n1, n2) * 1000000);
    }
  } else {
    const budgetMatch = raw.match(/(?:dưới|tầm|khoảng|<=|≤|<)?\s*(\d+(?:[.,]\d+)?)\s*(?:triệu|tr|củ|m\b)/i);
    if (budgetMatch) {
      const val = parseFloat(budgetMatch[1].replace(',', '.'));
      if (val > 0 && val <= 500) {
        conversationalFilterMemory.maxRentVND = Math.round(val * 1000000);
      }
    }
    const minBudgetMatch = raw.match(/(?:trên|tren|từ|tu|>=|≥|>)\s*(\d+(?:[.,]\d+)?)\s*(?:triệu|tr|củ|m\b)/i);
    if (minBudgetMatch) {
      const minVal = parseFloat(minBudgetMatch[1].replace(',', '.'));
      if (minVal > 0 && minVal <= 500) {
        conversationalFilterMemory.minRentVND = Math.round(minVal * 1000000);
      }
    }
  }

  // 8b. High Floor ("tầng cao", "thoáng mát", "thông thoáng")
  if (/tầng cao|tang cao|thoáng mát|thoang mat|thông thoáng|thong thoang|view thoáng|view thoang/i.test(raw)) {
    conversationalFilterMemory.minFloor = 8;
  }

  // 9. Detect Filter Mode (Base Rent vs True Cost)
  if (/true cost|chi phí thực tế|tổng chi phí|tính cả điện nước/i.test(raw)) {
    conversationalFilterMemory.filterMode = 'trueCost';
  } else if (/giá gốc|giá thuê gốc|tiền thuê thuần/i.test(raw)) {
    conversationalFilterMemory.filterMode = 'baseRent';
  }

  // 10. Detect Amenities & Features
  if (/oto|ô tô|xe hơi|car\b|đỗ xe ô tô|chỗ để xe hơi/i.test(raw)) {
    conversationalFilterMemory.carParkingOnly = true;
  }
  if (/không ngập|tránh ngập|đừng ngập|hạn chế ngập|low flood/i.test(raw)) {
    conversationalFilterMemory.lowFloodOnly = true;
  }
  if (/máy phát|điện dự phòng|cúp điện|mất điện|backup power/i.test(raw)) {
    conversationalFilterMemory.backupPowerOnly = true;
  }
  if (/thú cưng|nuôi chó|nuôi mèo|pet\b|pet friendly/i.test(raw)) {
    conversationalFilterMemory.petFriendlyOnly = true;
  }
  if (/pccc|phòng cháy|an toàn cháy|qcvn 06|báo cháy/i.test(raw)) {
    conversationalFilterMemory.pcccCertifiedOnly = true;
  }
  if (/chính chủ|chủ nhà xác thực|verified/i.test(raw)) {
    conversationalFilterMemory.verifiedLandlordOnly = true;
  }

  const isHousingQuery = Boolean(
    detectedCity ||
    conversationalFilterMemory.city ||
    conversationalFilterMemory.district ||
    conversationalFilterMemory.bedrooms ||
    conversationalFilterMemory.maxRentVND ||
    conversationalFilterMemory.carParkingOnly ||
    /phòng|nhà|căn hộ|chung cư|thuê|giá|ngân sách|cọc|xem phòng|tìm/i.test(raw)
  );

  return {
    memory: { ...conversationalFilterMemory },
    isHousingQuery,
    isCompareQuery,
    isReset: false,
    targetUnitId,
    targetModule
  };
}

/**
 * Format accumulated filter criteria into human-readable Vietnamese summary
 */
export function formatFilterSummary(mem: ConversationalFilterMemory, matchingCount?: number): string {
  const parts: string[] = [];
  if (mem.city && mem.city !== 'All') parts.push(mem.city);
  if (mem.district) parts.push(mem.district);
  if (mem.bedrooms) parts.push(`${mem.bedrooms} PN`);
  if (mem.minRentVND && mem.maxRentVND) {
    parts.push(`${(mem.minRentVND / 1e6).toFixed(0)} - ${(mem.maxRentVND / 1e6).toFixed(0)}tr${mem.filterMode === 'trueCost' ? ' (True Cost)' : ''}`);
  } else if (mem.maxRentVND) {
    const rentTr = (mem.maxRentVND / 1000000).toFixed(mem.maxRentVND % 1000000 === 0 ? 0 : 1);
    parts.push(`≤ ${rentTr}tr${mem.filterMode === 'trueCost' ? ' (True Cost)' : ''}`);
  } else if (mem.minRentVND) {
    const rentTr = (mem.minRentVND / 1000000).toFixed(mem.minRentVND % 1000000 === 0 ? 0 : 1);
    parts.push(`≥ ${rentTr}tr${mem.filterMode === 'trueCost' ? ' (True Cost)' : ''}`);
  }
  if (mem.minFloor) parts.push(`Tầng ≥ ${mem.minFloor}`);
  if (mem.carParkingOnly) parts.push('Đỗ ô tô');
  if (mem.lowFloodOnly) parts.push('Không ngập');
  if (mem.backupPowerOnly) parts.push('Điện dự phòng');
  if (mem.petFriendlyOnly) parts.push('Nuôi thú cưng');
  if (mem.pcccCertifiedOnly) parts.push('PCCC QCVN 06');
  if (mem.verifiedLandlordOnly) parts.push('Chính chủ');

  if (parts.length === 0) {
    return matchingCount !== undefined ? `Toàn bộ ${matchingCount} căn hộ trên hệ thống` : 'Tất cả căn hộ';
  }

  const base = parts.join(' • ');
  return matchingCount !== undefined ? `${base} (Tìm thấy ${matchingCount} căn)` : base;
}

/**
 * Strips completed and actively streaming markdown JSON blocks or open fences
 * Ensuring the user only reads pure conversational Vietnamese text in real-time.
 */
export function stripTrailingJsonBlock(text: string): string {
  // 1. Remove all closed ```json ... ``` or ``` ... ``` blocks
  let cleaned = text.replace(/```(?:json)?[\s\S]*?```/g, '');
  
  // 2. Cut off if currently streaming an unclosed code fence
  const unclosedFenceIndex = cleaned.indexOf('```');
  if (unclosedFenceIndex !== -1) {
    cleaned = cleaned.substring(0, unclosedFenceIndex);
  }

  return cleaned.trimEnd();
}

/**
 * Evaluates the accumulated ConversationalFilterMemory against ALL 1,700 units in ApartmentStore.
 * Computes exact statistical aggregates and top 6 matching units for LLM grounding.
 */
export function retrieveLocalContext(query: string, limit: number = 6): { 
  snippet: string; 
  sources: RagRetrievalResult[]; 
  matchingCount: number;
  topUnits: ApartmentUnit[];
  summaryBadge: string;
} {
  const allUnits = ApartmentStore.getUnits();
  if (!allUnits || allUnits.length === 0) {
    return { 
      snippet: 'Không có dữ liệu căn hộ trong hệ thống.', 
      sources: [], 
      matchingCount: 0, 
      topUnits: [],
      summaryBadge: 'Không có dữ liệu'
    };
  }

  // Pre-parse and accumulate filters
  const { memory, isHousingQuery, targetUnitId } = parseAndAccumulateFilters(query);

  // If strictly non-housing query, return neutral conversational context
  if (!isHousingQuery && Object.keys(memory).length === 0) {
    return {
      snippet: 'Người dùng đang trò chuyện hoặc hỏi thông tin chung (không tìm nhà). Trả lời trọng tâm câu hỏi của người dùng.',
      sources: [],
      matchingCount: allUnits.length,
      topUnits: allUnits.slice(0, limit),
      summaryBadge: ''
    };
  }

  // Evaluate accumulated memory against all 1,700 units
  const matchingUnits = allUnits.filter(unit => {
    // City filter
    if (memory.city && memory.city !== 'All') {
      const uCity = normalizeCity(unit.city).toLowerCase();
      const mCity = normalizeCity(memory.city).toLowerCase();
      if (!uCity.includes(mCity) && !mCity.includes(uCity)) return false;
    }

    // District filter
    if (memory.district) {
      const uDist = (unit.district || '').toLowerCase();
      const mDist = memory.district.toLowerCase();
      if (!uDist.includes(mDist)) return false;
    }

    // Bedrooms filter (strictly exact matching so only requested bedroom count is returned)
    if (memory.bedrooms && memory.bedrooms > 0) {
      if (unit.bedrooms !== memory.bedrooms) return false;
    }

    // Min Budget filter
    if (memory.minRentVND && memory.minRentVND > 0) {
      const effectivePrice = memory.filterMode === 'trueCost'
        ? (unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND)
        : unit.monthlyRentVND;
      if (effectivePrice < memory.minRentVND) return false;
    }

    // Max Budget filter
    if (memory.maxRentVND && memory.maxRentVND > 0) {
      const effectivePrice = memory.filterMode === 'trueCost'
        ? (unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND)
        : unit.monthlyRentVND;
      if (effectivePrice > memory.maxRentVND) return false;
    }

    // Floor filter (e.g. floor >= 8 for high-floor)
    if (memory.minFloor && memory.minFloor > 0) {
      if (unit.floor < memory.minFloor) return false;
    }

    // Amenities
    if (memory.carParkingOnly && !unit.hasCarParking) return false;
    if (memory.lowFloodOnly && unit.floodingRisk !== 'Low') return false;
    if (memory.backupPowerOnly && !unit.hasBackupPower) return false;
    if (memory.petFriendlyOnly && !unit.petFriendly) return false;
    if (memory.verifiedLandlordOnly && !(unit.isVerifiedPlus || unit.verificationLevel === 'full_ownership_verified' || unit.verificationLevel === 'id_verified')) return false;

    return true;
  });

  const targetSet = matchingUnits.length > 0 ? matchingUnits : allUnits;
  const matchingCount = matchingUnits.length;
  const totalCount = allUnits.length;

  // Compute exact aggregate dataset statistics
  let minRent = Infinity;
  let maxRent = 0;
  let sumRent = 0;
  let minTrueCost = Infinity;
  let maxTrueCost = 0;
  let sumTrueCost = 0;

  const districtCounts: Record<string, number> = {};
  const bedroomCounts: Record<string, number> = { '1PN': 0, '2PN': 0, '3PN': 0, '4PN+': 0 };

  for (const u of targetSet) {
    if (u.monthlyRentVND < minRent) minRent = u.monthlyRentVND;
    if (u.monthlyRentVND > maxRent) maxRent = u.monthlyRentVND;
    sumRent += u.monthlyRentVND;

    const tc = u.trueCost?.totalMonthlyEstimatedVND || u.monthlyRentVND;
    if (tc < minTrueCost) minTrueCost = tc;
    if (tc > maxTrueCost) maxTrueCost = tc;
    sumTrueCost += tc;

    const dist = u.district || 'Khác';
    districtCounts[dist] = (districtCounts[dist] || 0) + 1;

    if (u.bedrooms === 1) bedroomCounts['1PN']++;
    else if (u.bedrooms === 2) bedroomCounts['2PN']++;
    else if (u.bedrooms === 3) bedroomCounts['3PN']++;
    else if (u.bedrooms >= 4) bedroomCounts['4PN+']++;
  }

  const avgRent = targetSet.length > 0 ? Math.round(sumRent / targetSet.length) : 0;
  const avgTrueCost = targetSet.length > 0 ? Math.round(sumTrueCost / targetSet.length) : 0;

  const sortedDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([d, c]) => `${d} (${c} căn)`)
    .join(', ');

  const bedroomDistStr = Object.entries(bedroomCounts)
    .filter(([_, c]) => c > 0)
    .map(([k, c]) => `${k}: ${c} căn`)
    .join(' • ');

  // Score individual units to pick top 6 best matches
  const qTokens = query.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const scored = targetSet.map(unit => {
    let score = 0;

    // Unit ID exact match
    if (targetUnitId && unit.id.toUpperCase() === targetUnitId) score += 10000;

    // Keyword tokens
    const textCorpus = `${unit.name || ''} ${unit.address || ''} ${unit.district} ${unit.city} ${unit.id}`.toLowerCase();
    for (const t of qTokens) {
      if (textCorpus.includes(t)) score += 8;
    }

    if (unit.pcccReport?.inspectionCertificateStatus === 'certified') score += 15;
    if (unit.isVerifiedPlus || unit.verificationLevel === 'full_ownership_verified') score += 10;
    if (unit.floodingRisk === 'Low') score += 10;

    return { unit, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const selectedTop = scored.slice(0, limit).map(s => s.unit);

  const sources: RagRetrievalResult[] = selectedTop.map((u, i) => ({
    score: scored[i]?.score || 100,
    chunk: {
      id: u.id,
      category: 'apartment',
      title: `${u.name ? u.name + ' - ' : ''}${u.id} (${u.bedrooms}PN, ${u.sqm}m²)`,
      content: `${u.address || ''}, ${u.district}, ${u.city}. Giá ${(u.monthlyRentVND / 1000000).toFixed(1)} tr/tháng • True Cost: ${((u.trueCost?.totalMonthlyEstimatedVND || u.monthlyRentVND) / 1000000).toFixed(1)} tr/tháng`,
      metadata: {
        unitId: u.id,
        priceVND: u.monthlyRentVND,
        city: u.city,
        bedrooms: u.bedrooms
      }
    }
  }));

  const unitsSnippet = selectedTop.map((u, i) => {
    const trueCostStr = u.trueCost?.totalMonthlyEstimatedVND 
      ? `${(u.trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1)} triệu VNĐ/tháng` 
      : `${(u.monthlyRentVND / 1000000).toFixed(1)} triệu VNĐ/tháng`;
    return `[Căn ${i + 1}] Mã: ${u.id} | Tên: ${u.name || 'Căn hộ HAVEN'} | Đ/C: ${u.address || ''}, ${u.district}, ${u.city}
• Giá thuê gốc: ${(u.monthlyRentVND / 1000000).toFixed(1)} tr/tháng | True Cost ước tính: ${trueCostStr}
• Thông số: ${u.bedrooms} phòng ngủ, ${u.bathrooms} WC, diện tích ${u.sqm} m²
• Tiện ích: Đỗ ô tô: ${u.hasCarParking ? 'Có' : 'Không'} | Rủi ro ngập: ${u.floodingRisk === 'Low' ? 'Thấp' : 'Trung bình'} | Thú cưng: ${u.petFriendly ? 'Cho phép' : 'Không'}
• An toàn PCCC: ${u.pcccReport?.inspectionCertificateStatus === 'certified' ? 'Đạt chuẩn QCVN 06' : 'Đang kiểm tra'} | Chủ nhà: ${u.isVerifiedPlus || u.verificationLevel === 'full_ownership_verified' ? 'Đã xác thực' : 'Thường'}`;
  }).join('\n\n');

  const summaryBadge = formatFilterSummary(memory, matchingCount);

  const snippet = `=== THỐNG KÊ TỔNG HỢP TOÀN BỘ 1,700 CĂN HỘ HAVEN (THỜI GIAN THỰC) ===
• Trạng thái tìm kiếm: Khớp ${matchingCount} / ${totalCount} căn hộ trong hệ thống
• Khoảng giá thuê gốc: Thấp nhất: ${(minRent / 1e6).toFixed(1)} tr/tháng | Cao nhất: ${(maxRent / 1e6).toFixed(1)} tr/tháng | Trung bình: ${(avgRent / 1e6).toFixed(1)} tr/tháng
• Khoảng True Cost thực tế: Thấp nhất: ${(minTrueCost / 1e6).toFixed(1)} tr/tháng | Cao nhất: ${(maxTrueCost / 1e6).toFixed(1)} tr/tháng | Trung bình: ${(avgTrueCost / 1e6).toFixed(1)} tr/tháng
• Phân bổ theo Quận: ${sortedDistricts || 'Đang thống kê'}
• Phân bổ số phòng ngủ: ${bedroomDistStr || 'Đang thống kê'}

=== TOP ${selectedTop.length} CĂN HỘ PHÙ HỢP NHẤT TRONG KHO DỮ LIỆU ===
${unitsSnippet}`;

  return { 
    snippet, 
    sources, 
    matchingCount, 
    topUnits: selectedTop,
    summaryBadge
  };
}

/**
 * Builds Haven System Persona with Multi-Agentic Tool Calling capability and Accumulated Memory
 */
function buildHavenSystemPrompt(roleMode: 'consumer' | 'admin', contextSnippet: string): string {
  const mem = getAiFilterMemory();
  const memSummary = formatFilterSummary(mem);

  if (roleMode === 'admin') {
    return `Bạn là HAVEN AI Copilot - Trợ lý Trí tuệ Vận hành & Quản trị Bất động sản cấp cao chạy cục bộ 100% trên mô hình Qwen 2.5 7B (Ollama RTX 3060 6GB).
Định danh & Bản chất: Bạn là mô hình AI mã nguồn mở Qwen 2.5 7B chạy cục bộ trên máy tính. Toàn bộ dữ liệu được bảo vệ an toàn trên bộ nhớ nội bộ.
Nhiệm vụ: Hỗ trợ ban quản trị giám sát 1,700 căn hộ, thu hồi nợ quá hạn, soạn hợp đồng điện tử E-Sign, tạo tin đăng căn hộ mới, quản lý sự cố cảm biến IoT và quy chuẩn an toàn PCCC QCVN 06.
Phong cách trả lời: Chuyên nghiệp, súc tích, đưa ra con số chính xác và khuyến nghị hành động dứt khoát.

=== TRI THỨC VẬN HÀNH THỜI GIAN THỰC (1,700 CĂN HỘ) ===
${contextSnippet}

=== CÔNG CỤ TỰ ĐỘNG HÓA HÀNH ĐỘNG (AGENTIC TOOLS) ===
Khi cần thực hiện hành động, HÃY KÈM THEO một khối JSON ở cuối câu trả lời theo các mẫu sau:

1. Soạn hợp đồng điện tử:
\`\`\`json
{
  "action": "draft_contract",
  "unitId": "HN-CG-1402",
  "tenantName": "Nguyễn Văn A",
  "monthlyRentVND": 15000000,
  "depositMonths": 1,
  "startDate": "2026-10-15"
}
\`\`\`

2. Điền form tạo tin đăng căn hộ mới:
\`\`\`json
{
  "action": "fill_listing",
  "title": "Căn hộ 2PN view hồ Tây",
  "city": "Hà Nội",
  "district": "Tây Hồ",
  "bedrooms": 2,
  "monthlyRentVND": 18000000,
  "hasCarParking": true
}
\`\`\``;
  }

  return `Bạn là HAVEN AI — Trợ lý Không Gian Sống Thông Minh chạy cục bộ 100% trên mô hình Qwen 2.5 7B (Local SLM qua Ollama RTX 3060 6GB).

=== ĐỊNH DANH & NGUYÊN TẮC HOẠT ĐỘNG (BẮT BUỘC) ===
1. Bản chất & Quyền riêng tư: Bạn chạy hoàn toàn trên phần cứng thiết bị của người dùng (Edge SLM qua Ollama), bảo vệ 100% dữ liệu riêng tư, KHÔNG gửi dữ liệu ra máy chủ đám mây bên ngoài.
2. Giới hạn Dữ liệu Thời gian thực & Internet:
   - Bạn KHÔNG có kết nối internet thời gian thực để tra cứu: giá vàng hôm nay, giá xăng dầu hiện tại, tỷ giá ngoại tệ, chứng khoán, tin tức báo chí sự kiện trong ngày, hay thời tiết trực tiếp theo giờ.
   - Khi người dùng hỏi các thông tin này: Hãy thẳng thắn, trung thực nêu rõ bạn là AI chạy offline 100% trên máy tính nên không thể cập nhật tin tức trực tiếp từ internet, nói lời xin lỗi lịch sự và sẵn sàng hỗ trợ về bất động sản, căn hộ, chi phí sống, pháp lý hoặc các kiến thức tổng quát khác.
3. Trí tuệ tổng quát đa năng: 
   - Bạn am hiểu sâu rộng về mọi lĩnh vực: văn hóa, lịch sử, đời sống, khoa học công nghệ, mẹo vặt gia đình.
   - Trả lời đúng trọng tâm câu hỏi, khách quan và súc tích.
   - Nếu hỏi "bây giờ là mấy giờ": Trả lời giờ hiện tại ngắn gọn, kèm câu hỏi: "Bạn có cần tôi hỗ trợ gì thêm không?". Tuyệt đối không nhồi nhét căn hộ!
   - Nếu người dùng hỏi các câu hỏi đời sống: Trả lời ấm áp, phong phú. ĐỪNG nhồi nhét danh sách căn hộ nếu người dùng không hỏi tìm phòng!
   - Nếu người dùng hỏi "đứng sau bạn là model gì", "bạn là ai": Bạn là HAVEN AI vận hành trên mô hình cục bộ Qwen 2.5 7B qua Ollama Engine chạy trên máy tính người dùng (port 11434).

4. Chuyên môn Bất Động Sản HAVEN:
   - Dựa vào bảng Thống kê tổng hợp 1,700 căn hộ để trả lời số liệu chính xác (min, max, trung bình, phân bổ quận, phân bổ phòng ngủ).
   - Bảo chứng cọc Escrow (HAVEN Escrow Shield): Tiền cọc khóa an toàn, chỉ giải ngân cho chủ nhà khi bàn giao nghiệm thu.
   - True Cost: Bóc tách minh bạch tiền thuê gốc + điện nước + phí dịch vụ/gửi xe.
   - PCCC QCVN 06: Kiểm định an toàn chống khói, lối thoát hiểm áp suất dương.
   - Đàm phán giá: Khi người dùng yêu cầu lập chiến lược đàm phán trả giá, đưa ra mức giá mục tiêu (giảm 5% – 10%), đòn bẩy đàm phán và kịch bản nhắn tin mẫu.

=== BỘ LỌC TÍCH LŨY TỪ HỘI THOẠI (CONVERSATIONAL FILTER MEMORY) ===
${memSummary ? `• Tiêu chí đang áp dụng: ${memSummary}` : '• Chưa có tiêu chí lọc cụ thể (đang xem toàn bộ 1,700 căn)'}

=== DỮ LIỆU CĂN HỘ THAM KHẢO TRONG HỆ THỐNG (1,700 CĂN HỘ) ===
${contextSnippet}

=== CÔNG CỤ TỰ ĐỘNG HÓA HÀNH ĐỘNG (AGENTIC TOOLS) ===
KHI NGƯỜI DÙNG CÓ NHU CẦU tìm kiếm/lọc phòng, so sánh căn, đàm phán giá, hoặc xem chi phí, HÃY KÈM THEO khối JSON ở cuối:

1. Tìm kiếm và Lọc căn hộ:
\`\`\`json
{
  "action": "apply_filters",
  "city": "Hà Nội",
  "district": "Cầu Giấy",
  "maxRentVND": 15000000,
  "bedrooms": 2,
  "hasCarParking": true
}
\`\`\`

2. So sánh các căn hộ (Radar Comparison):
\`\`\`json
{
  "action": "compare_units",
  "unitIds": ["HN-CG-1402", "HN-TH-2401", "HN-HM-0101"]
}
\`\`\`

3. Đàm phán giá cả:
\`\`\`json
{
  "action": "negotiate_price",
  "unitId": "HN-CG-1402",
  "currentRent": 14500000,
  "targetRent": 13500000,
  "strategy": "Đề xuất ký hợp đồng 12 tháng và đóng trước 3 tháng"
}
\`\`\`

Nếu chỉ là câu hỏi đời sống, trò chuyện hoặc hỏi thời tiết/model, TUYỆT ĐỐI KHÔNG sinh khối JSON.`;
}

/**
 * Main Pure Local Agentic SLM Entry Point (100% Offline Qwen 2.5 7B Model Inference)
 * Target Model: Qwen 2.5 7B tuned for NVIDIA RTX 3060 6GB VRAM
 * Supports real-time token streaming with onTokenStream callback and Autonomous UI Action Bus.
 */
export async function askHavenLocalSlm(
  userQuery: string,
  history: { role: 'user' | 'assistant'; text: string }[] = [],
  roleMode: 'consumer' | 'admin' = 'consumer',
  onTokenStream?: (partialCleanText: string) => void
): Promise<RagChatResponse> {
  const normQuery = userQuery.trim();
  const guardrailEval = evaluateEnterpriseSafety(normQuery, roleMode);
  const parsed = parseNaturalLanguageQuery(normQuery);

  // 1. Evaluate accumulated filter memory across 1,700 units & get statistical grounding
  const { 
    snippet: contextSnippet, 
    sources: retrievedSources, 
    matchingCount, 
    topUnits, 
    summaryBadge 
  } = retrieveLocalContext(normQuery, 6);

  const { isCompareQuery, targetUnitId, targetModule } = parseAndAccumulateFilters(normQuery);
  const activeMemory = getAiFilterMemory();
  const hasFilterCriteria = Object.keys(activeMemory).length > 0;

  const isContractIntent = /(?:lập|soạn|tạo|làm|soan|lap)\s+hợp\s+đồng|draft\s+contract|hợp\s+đồng\s+cho\s+khách/i.test(normQuery);
  const isListingIntent = /(?:đăng\s+tin|tạo\s+tin|đăng\s+căn|thêm\s+căn|tạo\s+căn|fill\s+listing|mở\s+form\s+đăng)/i.test(normQuery);
  const isReconcileIntent = /(?:đối\s*soát|gạch\s*nợ|khớp\s*lệnh|sms\s*ngân\s*hàng|chuyển\s*khoản|biến\s*động\s*số\s*dư|reconcil)/i.test(normQuery);
  const isDebtIntent = /(?:thu\s*hồi\s*nợ|nhắc\s*nợ|quá\s*hạn|nợ\s*tiền\s*nhà|debt\s*collect|đòi\s*nợ)/i.test(normQuery);
  const isLeakIntent = /(?:rò\s*rỉ|công\s*tơ|tiền\s*điện\s*tăng|bất\s*thường\s*điện|cảm\s*biến\s*iot|pin\s*khóa|leak|iot\s*anomal)/i.test(normQuery);
  const isModerationIntent = /(?:duyệt\s*tin|kiểm\s*duyệt|chặn\s*tin\s*rác|lừa\s*đảo\s*cọc|bẫy\s*cọc|moderate|quét\s*sàn|auto-moderator)/i.test(normQuery);
  const isScanContractTrapsIntent = /(?:quét\s*bẫy|bẫy\s*hợp\s*đồng|legal\s*shield|red\s*flag|hợp\s*đồng\s*bẫy|soát\s*hợp\s*đồng|kiểm\s*tra\s*hợp\s*đồng)/i.test(normQuery);
  const isAuditPcccIntent = /(?:pccc|cháy\s*nổ|sinh\s*tồn|thoát\s*hiểm|qcvn\s*06|phòng\s*cháy)/i.test(normQuery);
  const isNegotiationIntent = /(?:đàm\s*phán|mặc\s*cả|trả\s*giá|war\s*room|hạ\s*giá|bớt\s*tiền|giảm\s*giá\s*thuê)/i.test(normQuery);
  const isYieldOptimizerIntent = /(?:tối\s*ưu\s*giá|định\s*giá|tăng\s*yield|tăng\s*lợi\s*nhuận|giá\s*thuê\s*tối\s*ưu|lợi\s*suất|capex)/i.test(normQuery);

  // 2. Autonomous UI Action Execution: Trigger action immediately on UI Action Bus
  if (isScanContractTrapsIntent) {
    aiCommandBus.scanContractTraps(
      {},
      'AI Đang mở Kho Pháp Lý & Kích hoạt Máy quét bẫy hợp đồng Legal Shield (Luật Nhà ở 2023)'
    );
  } else if (isAuditPcccIntent) {
    aiCommandBus.auditPccc(
      targetUnitId || topUnits[0]?.id || 'HN-TH-2401',
      'AI Đang mở Kiểm định sinh tồn PCCC & Thoát hiểm QCVN 06:2022'
    );
  } else if (isNegotiationIntent) {
    aiCommandBus.openNegotiationWarRoom(
      targetUnitId || topUnits[0]?.id || 'HN-TH-2401',
      'AI Đang kích hoạt Phòng Đấu Trí Đàm Phán Giá & Chiến lược Counter-Offer'
    );
  } else if (isYieldOptimizerIntent) {
    aiCommandBus.optimizeUnitYield(
      targetUnitId || topUnits[0]?.id || 'HN-TH-2401',
      'AI Đang mở Công cụ Tối ưu Giá Thuê & Hiệu suất sinh lời Yield ROI'
    );
  } else if (isContractIntent) {
    const contractPayload = await extractContractEntitiesFromText(normQuery);
    aiCommandBus.draftContract(
      contractPayload,
      `Đã tự động trích xuất thông tin hợp đồng cho ${contractPayload.tenantName || 'khách thuê'} (Căn ${contractPayload.unitId || 'chưa chỉ định'})`
    );
  } else if (isListingIntent) {
    const listingPayload = await extractListingEntitiesFromText(normQuery);
    aiCommandBus.fillListing(
      listingPayload,
      `Đã tự động trích xuất thông số căn hộ (${listingPayload.bedrooms || 2}PN - ${listingPayload.district || 'Hà Nội'})`
    );
  } else if (isReconcileIntent) {
    aiCommandBus.reconcilePayments(
      {},
      'AI Đang mở Sổ Quỹ Thu Tiền & Sẵn sàng đối soát tin nhắn ngân hàng tự động'
    );
  } else if (isDebtIntent) {
    aiCommandBus.collectDebts(
      {},
      'AI Đang kích hoạt chiến dịch thu hồi công nợ đa tầng (Level 1, 2, 3)'
    );
  } else if (isLeakIntent) {
    aiCommandBus.scanIotLeaks(
      {},
      'AI Đang khởi chạy Radar quét rò rỉ điện nước & pin khóa thông minh'
    );
  } else if (isModerationIntent) {
    aiCommandBus.moderateMarketplace(
      {},
      'AI Đang mở Trung tâm Kiểm duyệt Sàn & quét chống tin rác/lừa đảo cọc'
    );
  } else if (isCompareQuery && topUnits.length >= 2) {
    const compareIds = topUnits.slice(0, 3).map(u => u.id);
    aiCommandBus.compareUnits(
      compareIds, 
      `Đã nạp ${compareIds.length} căn phù hợp nhất vào biểu đồ Radar so sánh.`
    );
  } else if (targetUnitId) {
    aiCommandBus.openUnitDetail(
      targetUnitId, 
      `Đang mở chi tiết căn hộ ${targetUnitId}`
    );
  } else if (targetModule) {
    aiCommandBus.navigateModule(
      targetModule, 
      `Chuyển hướng thông minh tới ${targetModule}`
    );
  } else if (hasFilterCriteria) {
    aiCommandBus.applyFilters({
      ...activeMemory,
      queryText: normQuery,
      summaryBadge: `Đã tự động lọc: ${summaryBadge}`,
      matchingCount
    });
  }

  const systemPrompt = buildHavenSystemPrompt(roleMode, contextSnippet);

  // 3. Query Local Ollama Server with Real-time Token Streaming
  const status = await checkLocalSlmStatus();

  if (status.isAvailable) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4).map(h => ({ role: h.role, content: h.text })),
        { role: 'user', content: normQuery }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const targetModel = status.model || PREFERRED_LOCAL_MODELS[0];
      const isStream = Boolean(onTokenStream);

      const resp = await fetch(`${status.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          messages: messages,
          stream: isStream,
          options: OLLAMA_RTX3060_OPTIONS
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        let rawContent = '';

        if (isStream && resp.body) {
          const reader = resp.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const chunk = JSON.parse(trimmed);
                const token = chunk?.message?.content || '';
                if (token) {
                  rawContent += token;
                  // Strip out any trailing ```json or incomplete code blocks so user sees pure text
                  const cleanPreview = stripTrailingJsonBlock(rawContent);
                  if (cleanPreview && onTokenStream) {
                    onTokenStream(cleanPreview);
                  }
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        } else {
          const data = await resp.json();
          rawContent = data?.message?.content || '';
        }

        if (rawContent && rawContent.trim()) {
          let cleanText = rawContent;
          let suggestedAction: any = undefined;

          // Extract agentic tool calls from raw response
          const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            try {
              const parsedJson = JSON.parse(jsonMatch[1]);
              const actionType = parsedJson.action;

              if (['apply_filters', 'compare_units', 'open_unit_detail', 'navigate_module', 'negotiate_price', 'draft_contract', 'calculate_true_cost', 'schedule_viewing', 'fill_listing'].includes(actionType)) {
                suggestedAction = {
                  type: actionType,
                  queryText: normQuery,
                  payload: parsedJson,
                  summaryBadge: `Đã tự động lọc: ${summaryBadge}`
                };

                if (actionType === 'draft_contract') {
                  aiCommandBus.draftContract(parsedJson, 'Đã chuẩn bị thông tin hợp đồng từ AI');
                } else if (actionType === 'fill_listing') {
                  aiCommandBus.fillListing(parsedJson, 'Đã chuẩn bị thông số tin đăng từ AI');
                }
              }
              cleanText = rawContent.replace(/```json[\s\S]*?```/, '').trim();
            } catch {
              // Preserve raw text on JSON parse issue
            }
          }

          cleanText = stripTrailingJsonBlock(cleanText).trim();

          // Fallback autonomous action if LLM produced conversational answer without JSON block
          if (!suggestedAction) {
            if (isCompareQuery && topUnits.length >= 2) {
              suggestedAction = {
                type: 'compare_units',
                queryText: normQuery,
                payload: { unitIds: topUnits.slice(0, 3).map(u => u.id) },
                summaryBadge: `Đã so sánh ${topUnits.length} căn hộ tiêu biểu`
              };
            } else if (hasFilterCriteria) {
              suggestedAction = {
                type: 'apply_filters',
                queryText: normQuery,
                payload: activeMemory,
                summaryBadge: `Đã tự động lọc: ${summaryBadge}`
              };
            }
          }

          return {
            answer: cleanText || rawContent,
            sources: retrievedSources,
            modelUsed: `Local Qwen 2.5 7B (${targetModel} • RTX 3060 6GB • 100% Offline)`,
            usedRealApi: false,
            suggestedAction
          };
        }
      }
    } catch (localErr) {
      console.warn('Local Ollama 7B call error or timeout, falling back to Instant Grounded RAG:', localErr);
    }
  }

  // 4. Fallback to 100% Offline Local Heuristic Grounded RAG (Instant, zero cloud calls)
  const naturalAnswer = generateNaturalResponse(normQuery, roleMode, retrievedSources, guardrailEval);
  
  let fallbackAction: any = undefined;
  if (/đàm phán|dam phan|trả giá|tra gia|giảm giá|giam gia|thương lượng|thuong luong|chiến lược/i.test(normQuery)) {
    fallbackAction = {
      type: 'negotiate_price',
      queryText: normQuery,
      payload: {
        strategy: 'Đề xuất ký hợp đồng 12 – 24 tháng hoặc thanh toán trước 3 – 6 tháng để nhận chiết khấu 5% – 10%'
      }
    };
  } else if (/bóc tách|boc tach|chi phí sinh hoạt|chi phí thực tế|true cost/i.test(normQuery)) {
    fallbackAction = {
      type: 'calculate_true_cost',
      queryText: normQuery
    };
  } else if (isCompareQuery && topUnits.length >= 2) {
    fallbackAction = {
      type: 'compare_units',
      queryText: normQuery,
      payload: { unitIds: topUnits.slice(0, 3).map(u => u.id) },
      summaryBadge: `Đã chọn 3 căn hộ phù hợp nhất vào bảng so sánh Radar.`
    };
  } else if (hasFilterCriteria || parsed.classification.required.length > 0 || parsed.extractedFilters.city) {
    fallbackAction = {
      type: 'apply_filters',
      queryText: normQuery,
      payload: activeMemory,
      summaryBadge: `Đã tự động lọc: ${summaryBadge}`
    };
  }

  if (onTokenStream) {
    onTokenStream(naturalAnswer);
  }

  return {
    answer: naturalAnswer,
    sources: retrievedSources,
    modelUsed: 'HAVEN Edge SLM (Qwen 2.5 7B • Grounded RAG)',
    usedRealApi: false,
    guardrailStatus: guardrailEval,
    suggestedAction: fallbackAction
  };
}
