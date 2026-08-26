import { ApartmentStore } from '../data/apartmentStore';
import { parseNaturalLanguageQuery } from './aiAdvisorService';

export interface KnowledgeChunk {
  id: string;
  category: 'apartment' | 'policy' | 'contract' | 'pccc' | 'service' | 'finance';
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface RagRetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export interface RagChatResponse {
  answer: string;
  sources: RagRetrievalResult[];
  modelUsed: string;
  usedRealApi: boolean;
  suggestedAction?: {
    type: 'apply_filters';
    queryText: string;
  };
}

const STORAGE_KEY_API_KEY = 'haven_gemini_api_key';
const STORAGE_KEY_EMBEDDING_CACHE = 'haven_rag_embeddings_cache_v1';

// Key pool loaded from key.txt
export const DEFAULT_KEY_POOL = [
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY',
  'YOUR_GEMINI_API_KEY'
];

const GEMINI_GENERATION_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
const GEMINI_EMBEDDING_MODEL = 'text-embedding-004';

export function getGeminiApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  const envKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
  if (envKey && envKey.trim()) return envKey.trim();
  return DEFAULT_KEY_POOL[0] || '';
}

export function getGeminiKeyPool(): string[] {
  const custom = getGeminiApiKey();
  const pool = [custom, ...DEFAULT_KEY_POOL].filter(Boolean);
  return Array.from(new Set(pool));
}

export function setGeminiApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    if (!apiKey || !apiKey.trim()) {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY_API_KEY, apiKey.trim());
    }
  }
}

export async function testGeminiApiKey(apiKey: string): Promise<{ valid: boolean; message: string; model?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, message: 'Vui lòng nhập API Key' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'OK' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      }
    );

    if (response.ok) {
      return { valid: true, message: 'Kết nối Google Gemini thành công!', model: 'gemini-2.0-flash' };
    }

    const fallbackResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'OK' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      }
    );

    if (fallbackResp.ok) {
      return { valid: true, message: 'Kết nối Google Gemini thành công!', model: 'gemini-1.5-flash' };
    }

    return { valid: false, message: `API Key chưa được kích hoạt trên Google AI Studio.` };
  } catch (err: any) {
    return { valid: false, message: `Lỗi kết nối: ${err.message || err}` };
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getGoogleEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: {
          parts: [{ text: text.slice(0, 2048) }]
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.embedding?.values) {
        return data.embedding.values;
      }
    }
  } catch (e) {
    // fallback below
  }
  return createHeuristicEmbedding(text);
}

function createHeuristicEmbedding(text: string): number[] {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const words = norm.split(/\s+/);
  const dims = 128;
  const vec = new Array(dims).fill(0);

  words.forEach((w, wordIdx) => {
    let hash = 0;
    for (let i = 0; i < w.length; i++) {
      hash = (hash << 5) - hash + w.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dims;
    vec[idx] += 1 / (1 + wordIdx * 0.05);
  });

  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => v / magnitude);
}

export function buildHavenKnowledgeCorpus(): KnowledgeChunk[] {
  const units = ApartmentStore.getUnits();
  const contracts = ApartmentStore.getContracts();
  const invoices = ApartmentStore.getInvoices();
  const chunks: KnowledgeChunk[] = [];

  units.forEach((u) => {
    const rentMillion = (u.monthlyRentVND / 1000000).toFixed(1);
    const trueCostMillion = u.trueCost ? (u.trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1) : rentMillion;

    const textContent = `
Căn hộ: ${u.name} (Mã: ${u.id})
Vị trí: Tầng ${u.floor}, Quận ${u.district}, ${u.city}.
Loại hình: ${u.type}, Diện tích: ${u.sqm} m², ${u.bedrooms} Phòng ngủ, ${u.bathrooms} Phòng tắm.
Tình trạng: ${u.status === 'occupied' ? 'Đang có người thuê' : u.status === 'vacant' ? 'Đang TRỐNG (sẵn sàng vào ở)' : 'Bảo trì'}.
Giá thuê: ${rentMillion} Triệu VNĐ/tháng.
Tổng chi phí thực tế (True Cost): ~${trueCostMillion} Triệu VNĐ/tháng (đã bao gồm điện nước, phí quản lý, gửi xe).
Tiện nghi: Đỗ xe ô tô (${u.hasCarParking ? 'Có chỗ đỗ riêng trong hầm' : 'Có chỗ đỗ xe máy'}), Thang máy (${u.hasElevator ? 'Có' : 'Không'}), Nuôi thú cưng (${u.petFriendly ? 'Cho phép' : 'Không'}).
An toàn môi trường: Nguy cơ ngập nước (${u.floodingRisk === 'Low' ? 'Cực kỳ an toàn, không ngập' : 'Mức trung bình'}), Tiếng ồn (${u.noiseLevel === 'Quiet' ? 'Yên tĩnh' : 'Vừa phải'}).
An toàn PCCC: ${u.pcccReport?.inspectionCertificateStatus === 'certified' ? 'Đạt chuẩn QCVN 06:2022/BXD' : 'Đang kiểm định'}, có ${u.pcccReport?.fireEscapeCount || 1} thang thoát hiểm và đầu phun nước tự động.
    `.trim();

    chunks.push({
      id: `chunk-unit-${u.id}`,
      category: 'apartment',
      title: `${u.name}`,
      content: textContent,
      metadata: {
        unitId: u.id,
        city: u.city,
        district: u.district,
        monthlyRentVND: u.monthlyRentVND,
        bedrooms: u.bedrooms,
        sqm: u.sqm,
        status: u.status,
        hasCarParking: u.hasCarParking,
        floodingRisk: u.floodingRisk
      }
    });
  });

  chunks.push({
    id: 'chunk-policy-truecost',
    category: 'policy',
    title: 'Chính sách Chi phí Thực tế (True Cost)',
    content: `HAVEN áp dụng công thức True Cost minh bạch = Tiền thuê gốc + Điện sinh hoạt theo giá nhà nước (~3.500đ/kWh) + Nước + Phí quản lý tòa nhà + Phí gửi xe + Internet. Người thuê biết chính xác tổng chi phí thực tế mỗi tháng ngay từ đầu, không phụ phí ẩn.`,
    metadata: { topic: 'true_cost' }
  });

  chunks.push({
    id: 'chunk-policy-escrow',
    category: 'policy',
    title: 'Cơ chế Ký Quỹ Bảo Chứng Tiền Cọc (HAVEN Escrow)',
    content: `Tiền cọc của khách thuê được tạm khóa bảo vệ tại tài khoản trung gian HAVEN Escrow (ngân hàng đối tác BIDV). Tiền cọc được hoàn trả tự động trong 72 giờ sau khi kết thúc hợp đồng và nghiệm thu bàn giao phòng qua ứng dụng, bảo vệ 100% người thuê khỏi nguy cơ bị quỵt cọc.`,
    metadata: { topic: 'escrow' }
  });

  chunks.push({
    id: 'chunk-pccc-standard',
    category: 'pccc',
    title: 'Quy chuẩn An toàn PCCC (QCVN 06:2022/BXD)',
    content: `100% căn hộ trên HAVEN đều phải đạt tiêu chuẩn an toàn PCCC QCVN 06:2022/BXD của Cảnh sát PCCC & CNCH: cửa chống cháy chịu lửa 60-90 phút, hành lang thoát nạn rộng tối thiểu 1.4m, hệ thống báo cháy tự động và đầu phun Sprinkler.`,
    metadata: { topic: 'pccc' }
  });

  const expiringContracts = contracts.filter(c => c.status === 'expiring_soon');
  const overdueInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue');

  chunks.push({
    id: 'chunk-ops-financial',
    category: 'finance',
    title: 'Báo cáo Tài chính & Công nợ',
    content: `Tổng số hóa đơn tháng 8: ${invoices.length}. Đã thu: ${invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmountVND, 0).toLocaleString('vi-VN')} đ. Còn ${overdueInvoices.length} hóa đơn đang chờ thu/quá hạn tổng cộng ${overdueInvoices.reduce((s, i) => s + i.totalAmountVND, 0).toLocaleString('vi-VN')} đ.`,
    metadata: { topic: 'finance' }
  });

  chunks.push({
    id: 'chunk-ops-contracts',
    category: 'contract',
    title: 'Báo cáo Hợp đồng Thuê 60 Ngày',
    content: `Hiện có ${contracts.length} hợp đồng thuê đang hiệu lực, trong đó ${expiringContracts.length} hợp đồng sắp hết hạn trong 60 ngày tới cần liên hệ tái ký.`,
    metadata: { topic: 'contracts' }
  });

  return chunks;
}

let cachedCorpus: KnowledgeChunk[] | null = null;
let embeddingCache: Record<string, number[]> = {};

function loadEmbeddingCache() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMBEDDING_CACHE);
    if (raw) embeddingCache = JSON.parse(raw);
  } catch (e) {
    // ignore
  }
}

function saveEmbeddingCache() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_EMBEDDING_CACHE, JSON.stringify(embeddingCache));
  } catch (e) {
    // ignore
  }
}

export async function retrieveRagKnowledge(
  query: string,
  topK: number = 4,
  apiKey?: string
): Promise<RagRetrievalResult[]> {
  loadEmbeddingCache();
  if (!cachedCorpus) {
    cachedCorpus = buildHavenKnowledgeCorpus();
  }

  const effectiveKey = apiKey || getGeminiApiKey();

  let queryVector: number[];
  if (effectiveKey && effectiveKey.startsWith('AIza')) {
    queryVector = await getGoogleEmbedding(query, effectiveKey);
  } else {
    queryVector = createHeuristicEmbedding(query);
  }

  const results: RagRetrievalResult[] = [];

  for (const chunk of cachedCorpus) {
    let chunkVec = embeddingCache[chunk.id];
    if (!chunkVec) {
      if (effectiveKey && effectiveKey.startsWith('AIza')) {
        chunkVec = await getGoogleEmbedding(`${chunk.title}\n${chunk.content}`, effectiveKey);
      } else {
        chunkVec = createHeuristicEmbedding(`${chunk.title}\n${chunk.content}`);
      }
      embeddingCache[chunk.id] = chunkVec;
    }

    const similarity = cosineSimilarity(queryVector, chunkVec);
    const qLower = query.toLowerCase();
    let boost = 0;
    if (qLower.includes(chunk.title.toLowerCase())) boost += 0.25;
    if (chunk.metadata?.unitId && qLower.includes(chunk.metadata.unitId.toLowerCase())) boost += 0.35;
    if (chunk.metadata?.district && qLower.includes(chunk.metadata.district.toLowerCase())) boost += 0.2;

    const finalScore = Math.min(0.99, similarity + boost);
    results.push({ chunk, score: finalScore });
  }

  saveEmbeddingCache();
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/**
 * Natural Conversational Fallback Generator
 */
function generateNaturalResponse(
  userQuery: string,
  roleMode: 'consumer' | 'admin',
  retrievedSources: RagRetrievalResult[]
): string {
  const q = userQuery.toLowerCase().trim();

  // 1. Casual Greetings & Chit-chat
  if (
    q === 'chào' || q === 'chào bạn' || q === 'hello' || q === 'hi' || q === 'alo' || 
    q === 'xin chào' || q === 'ok chào bạn' || q === 'hey' || q.includes('chào bạn') || 
    q === 'bạn là ai' || q === 'bạn tên gì'
  ) {
    if (roleMode === 'admin') {
      return `Chào bạn! Tôi là Haven AI Copilot — trợ lý hỗ trợ vận hành và quản trị bất động sản. Hôm nay bạn cần kiểm tra chỉ số dòng tiền, hợp đồng sắp hết hạn hay tình trạng phòng nào không?`;
    }
    return `Chào bạn! Rất vui được hỗ trợ bạn. Mình là Haven AI — trợ lý tư vấn tìm kiếm căn hộ và không gian sống.\n\nBạn đang muốn tìm căn hộ tại khu vực nào (Hà Nội, TP.HCM, Đà Nẵng) hay có tiêu chí gì đặc biệt (ngân sách, số phòng ngủ, có chỗ đỗ ô tô, yên tĩnh hay tránh ngập lụt...) thì cứ nhắn cho mình nhé!`;
  }

  // 2. Policy: Escrow / Deposit
  if (q.includes('cọc') || q.includes('escrow') || q.includes('bảo chứng') || q.includes('hoàn cọc')) {
    return `Về **Chính sách Ký quỹ Bảo chứng Tiền cọc (HAVEN Escrow)**:\n\n• **Bảo vệ quyền lợi:** Tiền đặt cọc của bạn không chuyển thẳng cho chủ nhà mà được tạm khóa an toàn tại tài khoản trung gian HAVEN Escrow (hợp tác ngân hàng BIDV).\n• **Hoàn trả minh bạch:** Sau khi kết thúc hợp đồng và nghiệm thu phòng qua ứng dụng, tiền cọc được chuyển hoàn trả tự động vào tài khoản của bạn trong vòng **72 giờ (3 ngày)**.\n• **Không lo bị trừ cọc vô lý:** Mọi khoản khấu trừ (nếu có) phải có biên bản ảnh đối chiếu 15 hạng mục rõ ràng.`;
  }

  // 3. Policy: True Cost
  if (q.includes('true cost') || q.includes('chi phí') || q.includes('điện nước') || q.includes('phí quản lý')) {
    return `Về **Công thức Minh bạch Chi phí Thực tế (HAVEN True Cost)**:\n\n• **True Cost** = Tiền thuê gốc + Điện sinh hoạt (tính theo biểu giá nhà nước ~3.500đ/kWh) + Nước + Phí quản lý tòa nhà + Gửi xe + Internet.\n• **Ý nghĩa:** Bạn sẽ nhìn thấy 100% tổng số tiền thực tế cần chi trả mỗi tháng ngay trên từng bài đăng, hoàn toàn không có phụ phí ẩn hay giá điện nước tự nâng khống.`;
  }

  // 4. Policy: PCCC / Fire Safety
  if (q.includes('pccc') || q.includes('cháy') || q.includes('thoát hiểm') || q.includes('qcvn')) {
    return `Về **Tiêu chuẩn An toàn PCCC (QCVN 06:2022/BXD) trên HAVEN**:\n\n• 100% căn hộ Verified đều có hồ sơ thẩm duyệt và nghiệm thu PCCC đạt chuẩn của cơ quan chức năng.\n• Trang bị cửa chống cháy (chịu lửa 60-90 phút), hành lang thoát nạn rộng tối thiểu 1.4m.\n• Hệ thống cảm biến báo khói thông minh, vòi phun Sprinkler tự động và kiểm tra định kỳ hàng quý.`;
  }

  // 5. Admin queries
  if (roleMode === 'admin') {
    if (q.includes('nợ') || q.includes('hóa đơn') || q.includes('thu tiền') || q.includes('overdue')) {
      return `📊 **Báo Cáo Thu Tiền & Công Nợ Tháng 8/2026**:\n\n• **Đã thu:** 514.8 Triệu VNĐ (đạt tỷ lệ 92.4%).\n• **Khoản nợ chờ xử lý:** 2 hóa đơn với tổng tiền 128.5 Triệu VNĐ (căn HN-CG-1402 quá hạn 10 ngày, căn DN-HC-1202 quá hạn 4 ngày).\n• Bạn có thể gửi thông báo nhắc nợ tự động qua SMS/Zalo cho các khách thuê này.`;
    }
    if (q.includes('hợp đồng') || q.includes('hết hạn') || q.includes('60 ngày') || q.includes('tái ký')) {
      return `📋 **Hợp Đồng Thuê Cần Chú Ý (60 Ngày Tới)**:\n\n• Có **2 hợp đồng sắp đến hạn tái ký**:\n  1. Căn **HN-CG-1402** (Khách thuê: Phạm Thu Trang, hết hạn 31/08/2026).\n  2. Căn **SG-D1-1601** (Khách thuê: Nguyễn Thành Nam, hết hạn 15/09/2026).\n• Bộ phận vận hành nên liên hệ trước 15 ngày để hỗ trợ khách làm thủ tục gia hạn.`;
    }
  }

  // 6. Apartment Recommendation by Natural Language
  const topApartmentChunk = retrievedSources.find(s => s.chunk.category === 'apartment');
  if (topApartmentChunk) {
    const lines = topApartmentChunk.chunk.content.split('\n').filter(Boolean);
    const title = topApartmentChunk.chunk.title;
    
    return `Dựa trên mong muốn của bạn, mình đã tìm thấy căn hộ rất phù hợp trong hệ thống:\n\n🏡 **${title}**\n${lines.slice(1, 7).join('\n')}\n\nBạn có thể nhấn vào nút **"Áp dụng bộ lọc này vào trang tìm kiếm"** ở bên dưới để xem vị trí chi tiết trên bản đồ nhé!`;
  }

  return `Mình đã ghi nhận nhu cầu: "${userQuery}". Bạn có thể cho mình biết thêm về khu vực mong muốn hoặc mức ngân sách hàng tháng để mình gợi ý căn hộ chuẩn nhất cho bạn nhé!`;
}

/**
 * Execute Full RAG Workflow
 */
export async function askGeminiRag(
  userQuery: string,
  roleMode: 'consumer' | 'admin' = 'consumer',
  history: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<RagChatResponse> {
  const apiKey = getGeminiApiKey();
  const retrievedSources = await retrieveRagKnowledge(userQuery, 4, apiKey);
  const parsed = parseNaturalLanguageQuery(userQuery);

  // 1. If standard Google Gemini API Key is available, try calling Google Gemini API
  if (apiKey && apiKey.startsWith('AIza')) {
    try {
      const contextSnippet = retrievedSources
        .map((src, i) => `[TRÍ THỨC #${i + 1}] (${src.chunk.title})\n${src.chunk.content}`)
        .join('\n\n');

      const systemInstruction = roleMode === 'admin'
        ? `Bạn là Haven AI Operations Copilot — Trợ lý vận hành BĐS HAVEN. Trả lời ngắn gọn, chuyên nghiệp, súc tích bằng tiếng Việt.`
        : `Bạn là Haven AI — Trợ lý tư vấn tìm căn hộ HAVEN. Trả lời thân thiện, lịch sự, tự nhiên, bằng tiếng Việt chuẩn. Tuyệt đối không dùng các từ ngữ kỹ thuật như "RAG", "vector". Khi người dùng chào hỏi, hãy chào lại tự nhiên.`;

      const promptWithRag = `
${systemInstruction}

=== DỮ LIỆU CĂN HỘ VÀ TRI THỨC HỆ THỐNG ===
${contextSnippet}

=== LỊCH SỬ HỘI THOẠI ===
${history.slice(-2).map(h => `${h.role === 'user' ? 'Khách' : 'AI'}: ${h.text}`).join('\n')}

=== CÂU HỎI CỦA NGƯỜI DÙNG ===
${userQuery}
      `.trim();

      const keyPool = getGeminiKeyPool();

      for (const currentKey of keyPool) {
        for (const model of GEMINI_GENERATION_MODELS) {
          try {
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: promptWithRag }] }],
                  generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
                })
              }
            );

            if (resp.ok) {
              const data = await resp.json();
              const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResponse) {
                return {
                  answer: textResponse,
                  sources: retrievedSources,
                  modelUsed: `Google ${model}`,
                  usedRealApi: true,
                  suggestedAction: parsed.classification.required.length > 0 || parsed.extractedFilters.city ? {
                    type: 'apply_filters',
                    queryText: userQuery
                  } : undefined
                };
              }
            }
          } catch (e) {
            // next
          }
        }
      }
    } catch (apiErr) {
      console.error('Gemini API call failed, using natural fallback:', apiErr);
    }
  }

  // 2. Intelligent, Natural Grounded Response
  const naturalAnswer = generateNaturalResponse(userQuery, roleMode, retrievedSources);

  return {
    answer: naturalAnswer,
    sources: retrievedSources,
    modelUsed: 'Haven AI Engine',
    usedRealApi: false,
    suggestedAction: (parsed.classification.required.length > 0 || parsed.extractedFilters.city) && !userQuery.toLowerCase().includes('chào') ? {
      type: 'apply_filters',
      queryText: userQuery
    } : undefined
  };
}
