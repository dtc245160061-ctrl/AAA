import { ApartmentStore } from '../data/apartmentStore';
import { askGeminiRag, type RagChatResponse, type RagRetrievalResult } from './geminiRagService';
import { parseNaturalLanguageQuery } from './aiAdvisorService';

export interface LocalSlmStatus {
  isAvailable: boolean;
  model: string;
  endpoint: string;
  installedModels: string[];
}

const OLLAMA_BASE_URL = 'http://localhost:11434';
const PREFERRED_LOCAL_MODELS = [
  'qwen2.5:3b',
  'qwen2.5:1.5b',
  'qwen2.5:0.5b',
  'qwen2.5',
  'llama3.2:3b',
  'llama3.2:1b',
  'llama3.2',
  'gemma2:2b'
];

/**
 * Check if Local Ollama inference server is active and find available models
 */
export async function checkLocalSlmStatus(): Promise<LocalSlmStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { isAvailable: false, model: '', endpoint: OLLAMA_BASE_URL, installedModels: [] };
    }

    const data = await res.json();
    const models: string[] = (data.models || []).map((m: any) => m.name || m.model);

    if (models.length === 0) {
      return { isAvailable: false, model: '', endpoint: OLLAMA_BASE_URL, installedModels: [] };
    }

    // Pick best matched local model
    let chosenModel = models[0];
    for (const pref of PREFERRED_LOCAL_MODELS) {
      const match = models.find(m => m.toLowerCase().includes(pref.toLowerCase()));
      if (match) {
        chosenModel = match;
        break;
      }
    }

    return {
      isAvailable: true,
      model: chosenModel,
      endpoint: OLLAMA_BASE_URL,
      installedModels: models
    };
  } catch {
    return { isAvailable: false, model: '', endpoint: OLLAMA_BASE_URL, installedModels: [] };
  }
}

/**
 * Fast In-Memory Local RAG Retriever
 * Scans HAVEN's real 1,700-unit database in ~3ms without external vector database dependencies
 */
export function retrieveLocalContext(query: string, limit: number = 4): { snippet: string; sources: RagRetrievalResult[] } {
  const allUnits = ApartmentStore.getUnits();
  if (!allUnits || allUnits.length === 0) {
    return { snippet: 'Không có dữ liệu căn hộ.', sources: [] };
  }

  const parsed = parseNaturalLanguageQuery(query);
  const qLower = query.toLowerCase();
  const qTokens = qLower
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);

  // Score units based on city, district, price, bedrooms, and keyword relevance
  const scored = allUnits.map(unit => {
    let score = 0;

    // City match (Highest priority)
    if (parsed.extractedFilters.city) {
      const targetCity = parsed.extractedFilters.city.toLowerCase();
      if (unit.city.toLowerCase().includes(targetCity)) score += 50;
    } else {
      for (const token of qTokens) {
        if (unit.city.toLowerCase().includes(token)) score += 15;
      }
    }

    // District match
    if (parsed.extractedFilters.district) {
      if (unit.district.toLowerCase().includes(parsed.extractedFilters.district.toLowerCase())) score += 30;
    }

    // Bedrooms match
    if (parsed.extractedFilters.minBedrooms) {
      if (unit.bedrooms === parsed.extractedFilters.minBedrooms) score += 25;
      else if (unit.bedrooms > parsed.extractedFilters.minBedrooms) score += 10;
    }

    // Budget match
    if (parsed.extractedFilters.maxRentVND) {
      if (unit.monthlyRentVND <= parsed.extractedFilters.maxRentVND) score += 20;
      else score -= 30; // penalize over budget
    }

    // Amenities / Environmental filters
    if (parsed.extractedFilters.hasCarParking && unit.hasCarParking) score += 15;
    if (parsed.extractedFilters.petFriendly && unit.petFriendly) score += 15;
    if (parsed.extractedFilters.floodingRisk === 'Low' && unit.floodingRisk === 'Low') score += 15;

    // Project name or address token matches
    const textCorpus = `${unit.name || ''} ${unit.address || ''} ${unit.district} ${unit.id}`.toLowerCase();
    for (const token of qTokens) {
      if (textCorpus.includes(token)) score += 5;
    }

    return { unit, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topUnits = scored.slice(0, limit);

  const sources: RagRetrievalResult[] = topUnits.map(s => ({
    score: s.score,
    chunk: {
      id: s.unit.id,
      category: 'apartment',
      title: `${s.unit.name ? s.unit.name + ' - ' : ''}${s.unit.id} (${s.unit.bedrooms}PN, ${s.unit.sqm}m²)`,
      content: `${s.unit.address || ''}, ${s.unit.district}, ${s.unit.city}. Giá ${(s.unit.monthlyRentVND / 1000000).toFixed(1)} tr/tháng`,
      metadata: {
        unitId: s.unit.id,
        priceVND: s.unit.monthlyRentVND,
        city: s.unit.city,
        bedrooms: s.unit.bedrooms
      }
    }
  }));

  const snippet = topUnits.map((item, i) => {
    const u = item.unit;
    const trueCost = u.trueCost?.totalMonthlyEstimatedVND 
      ? `${(u.trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1)} triệu VNĐ` 
      : 'Đang cập nhật';
    return `[Căn ${i + 1}] Mã: ${u.id} | Tên: ${u.name || 'Căn hộ HAVEN'} | Đ/C: ${u.address || ''}, ${u.district}, ${u.city}
• Giá thuê gốc: ${(u.monthlyRentVND / 1000000).toFixed(1)} triệu/tháng | True Cost ước tính: ${trueCost}
• Thông số: ${u.bedrooms} phòng ngủ, ${u.bathrooms} WC, diện tích ${u.sqm} m²
• Tiện ích: Đỗ ô tô: ${u.hasCarParking ? 'Có' : 'Không'} | Thú cưng: ${u.petFriendly ? 'Cho phép' : 'Không'} | Rủi ro ngập: ${u.floodingRisk || 'Thấp'}
• An toàn PCCC: ${u.pcccReport?.inspectionCertificateStatus === 'certified' ? 'Đạt chuẩn QCVN 06' : 'Đang kiểm định'} | Bảo chứng Escrow: ${u.depositTerms?.depositProtectionActive ? 'Có' : 'Không'}`;
  }).join('\n\n');

  return { snippet, sources };
}

/**
 * Builds Haven System Persona with Agentic Tool Calling capability
 */
function buildHavenSystemPrompt(roleMode: 'consumer' | 'admin', contextSnippet: string): string {
  if (roleMode === 'admin') {
    return `Bạn là HAVEN AI Copilot - Trợ lý Quản trị & Vận hành Bất động sản cấp cao.
Nhiệm vụ: Hỗ trợ ban quản trị giám sát 1,700 căn hộ, tài chính tiền thuê, bảo chứng cọc Escrow, cảm biến IoT và quy chuẩn an toàn PCCC QCVN 06.
Phong cách trả lời: Chuyên nghiệp, ngắn gọn, dùng gạch đầu dòng, đưa ra con số chính xác và khuyến nghị hành động dứt khoát.

=== TRI THỨC VẬN HÀNH THỜI GIAN THỰC ===
${contextSnippet}`;
  }

  return `Bạn là HAVEN Residential Intelligence — Trợ lý Không gian sống & Căn hộ thông minh của hệ thống HAVEN (Vận hành tại thiết bị biên).
Nhiệm vụ: Tư vấn căn hộ cho người thuê, giải thích chi phí sinh hoạt minh bạch, bảo chứng cọc an toàn và hỗ trợ người dùng tìm kiếm không gian sống lý tưởng.

=== TRI THỨC ĐỘC QUYỀN HỆ THỐNG HAVEN ===
1. Bảo chứng cọc Escrow (HAVEN Escrow Shield): Tiền cọc được khóa trong tài khoản ký quỹ trung gian an toàn, chỉ giải ngân cho chủ nhà khi cư dân ký biên bản nghiệm thu bàn giao căn hộ.
2. Chỉ số Chi Phí Thực Tế (True Cost Index): Không chỉ có tiền thuê gốc, HAVEN tính toán đầy đủ: Tiền thuê + Điện nước sinh hoạt + Phí quản lý dịch vụ + Phí gửi xe (ô tô/xe máy) + Internet.
3. Tiêu chuẩn PCCC QCVN 06: Tất cả căn hộ chuẩn hóa đều có thang thoát hiểm áp suất dương, hệ thống báo cháy tự động IoT và cửa chống khói 90 phút.
4. Lifestyle Match Index: Khảo sát tương thích 5 trục (Thú cưng, Phương tiện/Ô tô, Thể thao & Công viên, Yên tĩnh cách âm, Vi khí hậu đón nắng sớm).

=== DỮ LIỆU CĂN HỘ THỰC TẾ TRONG HỆ THỐNG (LOCAL RAG GROUNDING) ===
${contextSnippet}

=== QUY TẮC PHẢN HỒI & TOOL CALLING ===
- Luôn ưu tiên trả lời dựa trên các căn hộ thực tế trong dữ liệu ở trên. Trả lời thân thiện, lịch sự bằng tiếng Việt, đưa ra số liệu giá tiền và tiện ích rõ ràng.
- NẾU người dùng có ý định tìm nhà, lọc căn hộ hoặc muốn xem danh sách căn hộ theo tiêu chí (thành phố, số phòng ngủ, mức giá, ô tô...), HÃY KÈM THEO một khối JSON ở cuối câu trả lời theo đúng định dạng sau để hệ thống tự động lọc giao diện:
\`\`\`json
{
  "action": "apply_filters",
  "city": "Thái Nguyên hoặc Hà Nội hoặc TP.HCM...",
  "maxRentVND": 8000000,
  "bedrooms": 2,
  "hasCarParking": true
}
\`\`\`
Nếu không cần lọc giao diện, không cần tạo khối JSON này.`;
}

/**
 * Detects if query requires real-time world knowledge (external news, live currency, live weather)
 */
function shouldRouteToCloud(query: string): boolean {
  const q = query.toLowerCase();
  const worldKeywords = [
    'tỷ giá', 'usd', 'đô la', 'dollar', 'giá vàng', 'chứng khoán', 'vnindex',
    'thời tiết hôm nay', 'dự báo thời tiết', 'tin tức mới nhất', 'tin tức hôm nay',
    'tin thời sự', 'bầu cử', 'ai thắng', 'kết quả bóng đá'
  ];
  return worldKeywords.some(kw => q.includes(kw));
}

/**
 * Main Hybrid Agentic SLM Entry Point
 * 1. Checks for real-time external queries -> Routes to Cloud API (Gemini 3.5/3.1 Flash-Lite)
 * 2. Checks Local Ollama Server -> Executes 100% offline Edge SLM with Local RAG & Tool Calling
 * 3. Fallback to Cloud API if Local Server is offline
 */
export async function askHavenLocalSlm(
  userQuery: string,
  history: { role: 'user' | 'assistant'; text: string }[] = [],
  roleMode: 'consumer' | 'admin' = 'consumer'
): Promise<RagChatResponse> {
  const normQuery = userQuery.trim();

  // 1. Semantic Router: Route external world queries directly to Cloud API
  if (shouldRouteToCloud(normQuery)) {
    try {
      const cloudRes = await askGeminiRag(normQuery, roleMode, history);
      return {
        ...cloudRes,
        modelUsed: `Cloud Gateway (${cloudRes.modelUsed || 'Gemini Flash-Lite'})`
      };
    } catch {
      // Fall through to local
    }
  }

  // 2. Perform Local RAG Retrieval over 1,700 apartments
  const { snippet: contextSnippet, sources: retrievedSources } = retrieveLocalContext(normQuery, 4);
  const systemPrompt = buildHavenSystemPrompt(roleMode, contextSnippet);

  // 3. Ping Local Inference Engine (Ollama)
  const status = await checkLocalSlmStatus();

  if (status.isAvailable && status.model) {
    try {
      const ollamaMessages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4).map(h => ({ role: h.role, content: h.text })),
        { role: 'user', content: normQuery }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const resp = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: status.model,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.3,
            num_ctx: 3072
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const rawContent = data?.message?.content || '';

        // Extract JSON tool call if present
        let cleanText = rawContent;
        let suggestedAction: any = undefined;

        const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const parsedJson = JSON.parse(jsonMatch[1]);
            if (parsedJson.action === 'apply_filters') {
              suggestedAction = {
                type: 'apply_filters',
                queryText: normQuery,
                filters: parsedJson
              };
            }
            cleanText = rawContent.replace(/```json[\s\S]*?```/, '').trim();
          } catch {
            // Keep raw if JSON parse fails
          }
        }

        return {
          answer: cleanText || rawContent,
          sources: retrievedSources,
          modelUsed: `Local SLM (${status.model} • Edge Inference)`,
          usedRealApi: false,
          suggestedAction
        };
      }
    } catch (ollamaErr) {
      console.warn('Ollama Local SLM request failed, falling back to Cloud API:', ollamaErr);
    }
  }

  // 4. Cloud Fallback when Local SLM is not running or encountered error
  try {
    const cloudRes = await askGeminiRag(normQuery, roleMode, history);
    return {
      ...cloudRes,
      sources: retrievedSources.length > 0 ? retrievedSources : cloudRes.sources,
      modelUsed: cloudRes.modelUsed ? `Cloud Fallback (${cloudRes.modelUsed})` : 'Cloud Fallback (Gemini Flash-Lite)'
    };
  } catch (err: any) {
    // Ultimate graceful offline fallback
    return {
      answer: `Chào bạn, hệ thống HAVEN AI đã tiếp nhận câu hỏi của bạn: "${normQuery}".\n\nDựa trên dữ liệu 1,700 căn hộ, chúng tôi tìm thấy ${retrievedSources.length} căn hộ tương thích nhất trong hệ thống. Bạn có thể bấm vào các căn hộ đề xuất bên dưới để xem chi tiết nhé!`,
      sources: retrievedSources,
      modelUsed: 'HAVEN Fallback Engine',
      usedRealApi: false,
      suggestedAction: {
        type: 'apply_filters',
        queryText: normQuery
      }
    };
  }
}
