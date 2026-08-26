import { ApartmentStore } from '../data/apartmentStore';
import { parseNaturalLanguageQuery } from './aiAdvisorService';
import { 
  evaluateEnterpriseSafety, 
  generateGuardrailRejection,
  type GuardrailEvaluation 
} from './enterpriseSafetyGuardrail';

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
  guardrailStatus?: GuardrailEvaluation;
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
  } catch (err) {
    // silently fallback
  }
  return createHeuristicEmbedding(text);
}

export function createHeuristicEmbedding(text: string): number[] {
  const EMBED_DIM = 64;
  const vector = new Array(EMBED_DIM).fill(0);
  const words = text.toLowerCase().replace(/[^\w\s\u00C0-\u1EF9]/g, ' ').split(/\s+/).filter(Boolean);

  if (words.length === 0) return vector;

  words.forEach((word, idx) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const dim = Math.abs(hash) % EMBED_DIM;
    const weight = 1 + (1 / (idx + 1));
    vector[dim] += weight;
  });

  let norm = 0;
  for (let i = 0; i < EMBED_DIM; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < EMBED_DIM; i++) vector[i] /= norm;
  }

  return vector;
}

export function buildHavenKnowledgeCorpus(): KnowledgeChunk[] {
  const units = ApartmentStore.getUnits();
  const chunks: KnowledgeChunk[] = [];

  units.forEach(unit => {
    const trueCostTotal = unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND;
    chunks.push({
      id: `unit-${unit.id}`,
      category: 'apartment',
      title: `${unit.name || unit.id} — ${unit.district}, ${unit.city}`,
      content: `
Căn hộ: ${unit.name || unit.id} (Mã: ${unit.id})
Loại hình: ${unit.type || 'Căn hộ tiêu chuẩn'}, Diện tích: ${unit.sqm} m², ${unit.bedrooms} Phòng ngủ, ${unit.bathrooms} Phòng tắm.
Vị trí: Tầng ${unit.floor}, ${unit.address || unit.district}, Quận ${unit.district}, ${unit.city}.
Giá thuê niêm yết: ${(unit.monthlyRentVND / 1000000).toFixed(1)} Triệu VNĐ/tháng.
Tổng chi phí thực tế (True Cost): ${(trueCostTotal / 1000000).toFixed(1)} Triệu VNĐ/tháng (Bao gồm tiền điện nước, phí quản lý tòa nhà, gửi xe).
Tình trạng hiện tại: ${unit.status === 'occupied' ? 'Đã cho thuê' : unit.status === 'maintenance' ? 'Đang bảo trì' : 'Đang trống / Sẵn sàng vào ở'}.
Tiện ích & Đặc điểm nổi bật: Đỗ ô tô: ${unit.hasCarParking ? 'Có chỗ riêng trong hầm' : 'Chỉ đỗ xe máy'}. Thang máy: ${unit.hasElevator ? 'Có' : 'Không'}. Nuôi thú cưng: ${unit.petFriendly ? 'Cho phép' : 'Không cho phép'}. Nội thất: ${unit.furnished ? 'Đầy đủ' : 'Cơ bản'}. Ban công: ${unit.balcony ? 'Có' : 'Không'}.
Chỉ số Môi trường & PCCC: Nguy cơ ngập lụt: ${unit.floodingRisk || 'Thấp'}. An toàn PCCC: ${unit.pcccReport?.inspectionCertificateStatus === 'certified' ? 'Chuẩn QCVN 06 (Đã nghiệm thu)' : 'Đang kiểm định'}. Độ ồn: ${unit.noiseLevel || 'Quiet'}.
      `.trim(),
      metadata: {
        unitId: unit.id,
        city: unit.city,
        district: unit.district,
        monthlyRentVND: unit.monthlyRentVND,
        bedrooms: unit.bedrooms,
        hasCarParking: unit.hasCarParking,
        floodingRisk: unit.floodingRisk
      }
    });
  });

  chunks.push({
    id: 'policy-escrow',
    category: 'policy',
    title: 'Chính sách Ký Quỹ Cọc Bảo Chứng (HAVEN Escrow)',
    content: `
HAVEN Escrow là cơ chế ký quỹ bảo vệ quyền lợi 100% cho người thuê nhà và chủ nhà:
1. Toàn bộ tiền đặt cọc (thường là 1 - 2 tháng tiền thuê) được giữ an toàn tại tài khoản bảo chứng HAVEN Escrow hợp tác cùng ngân hàng BIDV, không chuyển trực tiếp cho chủ nhà khi chưa bàn giao.
2. Tiền cọc được giải ngân hoàn trả tự động cho khách thuê trong vòng 72 giờ (3 ngày) sau khi kết thúc hợp đồng thuê và hoàn tất biên bản nghiệm thu điện tử qua ứng dụng.
3. Không bị khấu trừ tiền cọc vô lý: Mọi khoản trừ tiền hỏng hóc đều phải có ảnh chụp trước - sau đối chiếu qua Biên Bản Bàn Giao 15 hạng mục tiêu chuẩn.
    `.trim(),
    metadata: { topic: 'escrow', tags: ['cọc', 'tiền cọc', 'bảo chứng', 'hoàn cọc', 'escrow'] }
  });

  chunks.push({
    id: 'policy-true-cost',
    category: 'policy',
    title: 'Công thức Chi phí Thực tế Toàn diện (HAVEN True Cost)',
    content: `
Công thức HAVEN True Cost giúp loại bỏ 100% phụ phí ẩn khi thuê căn hộ:
True Cost = Tiền thuê niêm yết + Tiền điện sinh hoạt (tính theo biểu giá nhà nước EVN ~3.500đ/kWh) + Tiền nước + Phí quản lý tòa nhà + Phí gửi xe (ô tô / xe máy) + Phí Internet cáp quang.
Mọi bài đăng trên HAVEN bắt buộc phải hiển thị True Cost chi tiết từng khoản mục, đảm bảo người thuê biết chính xác số tiền thực tế phải chi trả hàng tháng trước khi ký hợp đồng.
    `.trim(),
    metadata: { topic: 'true_cost', tags: ['true cost', 'chi phí', 'giá điện', 'giá nước', 'phí quản lý'] }
  });

  chunks.push({
    id: 'policy-pccc',
    category: 'pccc',
    title: 'Quy chuẩn An Toàn PCCC QCVN 06:2022/BXD trên HAVEN',
    content: `
Toàn bộ căn hộ trên nền tảng HAVEN đều được xác thực theo Quy chuẩn Kỹ thuật Quốc gia QCVN 06:2022/BXD về An toàn Cháy cho Nhà và Công trình:
1. 100% căn hộ đạt chứng nhận thẩm duyệt và nghiệm thu PCCC của Cảnh sát PCCC & CNCH.
2. Trang bị hệ thống báo cháy tự động, vòi phun Sprinkler tự động trong từng căn hộ.
3. Cửa chính căn hộ là cửa ngăn cháy đạt giới hạn chịu lửa tối thiểu EI 60 (60 phút).
4. Thang thoát hiểm buồng thang kín loại N1/N2 có áp suất dương chống tụ khói độc.
    `.trim(),
    metadata: { topic: 'pccc', tags: ['pccc', 'phòng cháy', 'chữa cháy', 'an toàn', 'qcvn 06', 'thoát hiểm'] }
  });

  chunks.push({
    id: 'ops-admin-overview',
    category: 'finance',
    title: 'Báo Cáo Quản Trị Vận Hành & Dòng Tiền Sàn HAVEN (Tháng 8/2026)',
    content: `
Tổng số căn hộ quản lý: 150 căn hộ tại Hà Nội, TP.HCM và Đà Nẵng.
Tỷ lệ lấp đầy: 94.2% (141/150 căn đang có khách thuê, 9 căn trống/bảo trì).
Tổng doanh thu tháng 8/2026: 514.8 Triệu VNĐ (Đạt 92.4% tiến độ thu tiền).
Công nợ quá hạn: 2 hợp đồng chậm thanh toán với tổng số tiền 128.5 Triệu VNĐ (Căn HN-CG-1402 quá hạn 10 ngày, Căn DN-HC-1202 quá hạn 4 ngày).
Hợp đồng cần tái ký trong 60 ngày tới: 2 hợp đồng (HN-CG-1402 hết hạn 31/08/2026, SG-D1-1601 hết hạn 15/09/2026).
    `.trim(),
    metadata: { topic: 'admin_ops', tags: ['doanh thu', 'công nợ', 'hợp đồng', 'lấp đầy', 'quản trị'] }
  });

  return chunks;
}

let cachedCorpus: KnowledgeChunk[] | null = null;
let embeddingCache: Record<string, number[]> = {};

function loadEmbeddingCache(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMBEDDING_CACHE);
    if (raw) embeddingCache = JSON.parse(raw);
  } catch (e) {
    embeddingCache = {};
  }
}

function saveEmbeddingCache(): void {
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
  if (!cachedCorpus) {
    cachedCorpus = buildHavenKnowledgeCorpus();
    loadEmbeddingCache();
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
    if (qLower.includes(chunk.title.toLowerCase())) boost += 0.3;
    if (chunk.metadata?.unitId && qLower.includes(chunk.metadata.unitId.toLowerCase())) boost += 0.4;
    if (chunk.metadata?.district && qLower.includes(chunk.metadata.district.toLowerCase())) boost += 0.25;

    const finalScore = Math.min(0.99, similarity + boost);
    results.push({ chunk, score: finalScore });
  }

  saveEmbeddingCache();
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/**
 * Natural Conversational Response Generator backed by Enterprise Intent Classification
 */
function generateNaturalResponse(
  userQuery: string,
  roleMode: 'consumer' | 'admin',
  retrievedSources: RagRetrievalResult[],
  guardrail: GuardrailEvaluation
): string {
  // 1. Casual Greetings & Chit-chat (Intelligent NLP handling)
  if (guardrail.intent === 'GREETING_CHITCHAT') {
    if (roleMode === 'admin') {
      return `Xin chào! Tôi là **Haven AI Operations Copilot** — trợ lý điều hành và quản trị sàn bất động sản HAVEN.\n\nHôm nay bạn cần hỗ trợ kiểm tra báo cáo dòng tiền, tình trạng phòng trống, hợp đồng sắp hết hạn hay gửi thông báo công nợ nào không?`;
    }
    return `Xin chào bạn! Rất vui được đồng hành cùng bạn trên **HAVEN** 🌿\n\nTôi là **Haven AI** — Trợ lý Không Gian Sống Thông Minh. Tôi có thể hỗ trợ bạn:\n\n• **Tìm kiếm căn hộ lý tưởng:** Lọc theo thành phố (Hà Nội, TP.HCM, Đà Nẵng), ngân sách hàng tháng, số phòng ngủ, chỗ đỗ xe ô tô, view thoáng, yên tĩnh...\n• **Kiểm tra an toàn & môi trường:** Đánh giá nguy cơ ngập lụt mùa mưa, tiêu chuẩn nghiệm thu PCCC QCVN 06:2022/BXD.\n• **Minh bạch tài chính:** Báo giá trọn gói True Cost và cơ chế bảo chứng cọc HAVEN Escrow.\n\nBạn đang có mong muốn hoặc tiêu chí tìm nhà như thế nào, hãy chia sẻ cho tôi biết nhé!`;
  }

  // 2. Gratitude & Closure
  if (guardrail.intent === 'GRATITUDE_CLOSURE') {
    return `Rất sẵn lòng được hỗ trợ bạn! Nếu bạn cần tìm thêm căn hộ hoặc có bất kỳ thắc mắc nào về hợp đồng và dịch vụ, cứ nhắn cho mình bất kỳ lúc nào nhé. Chúc bạn một ngày tuyệt vời! ✨`;
  }

  // 3. Policy: Escrow
  if (guardrail.intent === 'POLICY_ESCROW') {
    return `Về **Chính sách Ký quỹ Bảo chứng Tiền cọc (HAVEN Escrow)**:\n\n• **Bảo vệ quyền lợi 100%:** Tiền đặt cọc của bạn không chuyển thẳng cho chủ nhà mà được tạm khóa an toàn tại tài khoản trung gian HAVEN Escrow (hợp tác ngân hàng BIDV).\n• **Hoàn trả minh bạch:** Sau khi kết thúc hợp đồng và nghiệm thu phòng qua ứng dụng, tiền cọc được chuyển hoàn trả tự động vào tài khoản của bạn trong vòng **72 giờ (3 ngày)**.\n• **Không lo bị trừ cọc vô lý:** Mọi khoản khấu trừ (nếu có) bắt buộc phải có biên bản ảnh đối chiếu 15 hạng mục rõ ràng.`;
  }

  // 4. Policy: True Cost
  if (guardrail.intent === 'POLICY_TRUE_COST') {
    return `Về **Công thức Minh bạch Chi phí Thực tế (HAVEN True Cost)**:\n\n• **True Cost** = Tiền thuê gốc + Điện sinh hoạt (tính theo biểu giá nhà nước ~3.500đ/kWh) + Nước + Phí quản lý tòa nhà + Gửi xe (ô tô/xe máy) + Internet.\n• **Ý nghĩa:** Bạn sẽ nhìn thấy 100% tổng số tiền thực tế cần chi trả mỗi tháng ngay trên từng bài đăng, hoàn toàn không có phụ phí ẩn hay giá điện nước tự nâng khống.`;
  }

  // 5. Policy: PCCC / Fire Safety
  if (guardrail.intent === 'POLICY_PCCC') {
    return `Về **Tiêu chuẩn An toàn PCCC (QCVN 06:2022/BXD) trên HAVEN**:\n\n• 100% căn hộ Verified đều có hồ sơ thẩm duyệt và nghiệm thu PCCC đạt chuẩn của cơ quan chức năng.\n• Trang bị cửa chống cháy (chịu lửa 60-90 phút), hành lang thoát nạn rộng tối thiểu 1.4m.\n• Hệ thống cảm biến báo khói thông minh, vòi phun Sprinkler tự động và kiểm tra định kỳ hàng quý.`;
  }

  // 6. Admin Telemetry
  if (roleMode === 'admin') {
    if (guardrail.intent === 'ADMIN_DEBT_BILLING') {
      return `📊 **Báo Cáo Thu Tiền & Công Nợ Tháng 8/2026**:\n\n• **Đã thu:** 514.8 Triệu VNĐ (đạt tỷ lệ 92.4%).\n• **Khoản nợ chờ xử lý:** 2 hóa đơn với tổng tiền 128.5 Triệu VNĐ (căn HN-CG-1402 quá hạn 10 ngày, căn DN-HC-1202 quá hạn 4 ngày).\n• Bạn có thể gửi thông báo nhắc nợ tự động qua SMS/Zalo cho các khách thuê này từ mục Quản Lý Thu Tiền.`;
    }
    if (guardrail.intent === 'ADMIN_CONTRACT_EXPIRY') {
      return `📋 **Hợp Đồng Thuê Cần Chú Ý (60 Ngày Tới)**:\n\n• Có **2 hợp đồng sắp đến hạn tái ký**:\n  1. Căn **HN-CG-1402** (Khách thuê: Phạm Thu Trang, hết hạn 31/08/2026).\n  2. Căn **SG-D1-1601** (Khách thuê: Nguyễn Thành Nam, hết hạn 15/09/2026).\n• Bộ phận vận hành nên liên hệ trước 15 ngày để hỗ trợ khách làm thủ tục gia hạn.`;
    }
  }

  // 7. Property Search & Inquiry
  const topApartmentChunk = retrievedSources.find(s => s.chunk.category === 'apartment');
  if (topApartmentChunk) {
    const lines = topApartmentChunk.chunk.content.split('\n').filter(Boolean);
    const title = topApartmentChunk.chunk.title;
    
    return `Dựa trên yêu cầu của bạn, HAVEN đã phân tích kho dữ liệu và đề xuất căn hộ phù hợp nhất:\n\n🏡 **${title}**\n${lines.slice(1, 7).join('\n')}\n\nBạn có thể nhấn vào nút **"Áp dụng bộ lọc này vào trang tìm kiếm"** ở bên dưới để xem vị trí chi tiết trên bản đồ nhé!`;
  }

  return `HAVEN AI đã ghi nhận nhu cầu của bạn: "${userQuery}". Bạn có thể chia sẻ cụ thể hơn về khu vực mong muốn (Hà Nội, TP.HCM, Đà Nẵng) hoặc mức ngân sách hàng tháng để mình tìm căn chuẩn nhất cho bạn nhé!`;
}

/**
 * Execute Full RAG Workflow with Enterprise Safety Guardrail
 */
export async function askGeminiRag(
  userQuery: string,
  roleMode: 'consumer' | 'admin' = 'consumer',
  history: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<RagChatResponse> {
  // 1. Enterprise Guardrail Safety Inspection
  const guardrailEval = evaluateEnterpriseSafety(userQuery, roleMode);

  // If unsafe / security violation, block immediately and return corporate guardrail refusal
  if (!guardrailEval.isSafe) {
    return {
      answer: generateGuardrailRejection(guardrailEval),
      sources: [],
      modelUsed: 'HAVEN Enterprise Guardrail Shield v2.5',
      usedRealApi: false,
      guardrailStatus: guardrailEval,
      suggestedAction: undefined
    };
  }

  const apiKey = getGeminiApiKey();
  const parsed = parseNaturalLanguageQuery(userQuery);

  // If greeting or smalltalk, respond immediately without forcing apartment recommendations
  if (guardrailEval.intent === 'GREETING_CHITCHAT' || guardrailEval.intent === 'GRATITUDE_CLOSURE') {
    const responseText = generateNaturalResponse(userQuery, roleMode, [], guardrailEval);
    return {
      answer: responseText,
      sources: [],
      modelUsed: 'HAVEN AI Natural Intelligence',
      usedRealApi: false,
      guardrailStatus: guardrailEval,
      suggestedAction: undefined
    };
  }

  const retrievedSources = await retrieveRagKnowledge(userQuery, 4, apiKey);

  // 2. If standard Google Gemini API Key is available, try calling Google Gemini API
  if (apiKey && apiKey.startsWith('AIza')) {
    try {
      const contextSnippet = retrievedSources
        .map((src, i) => `[TRÍ THỨC #${i + 1}] (${src.chunk.title})\n${src.chunk.content}`)
        .join('\n\n');

      const systemInstruction = roleMode === 'admin'
        ? `Bạn là Haven AI Operations Copilot — Trợ lý vận hành BĐS HAVEN. Trả lời ngắn gọn, chuyên nghiệp, súc tích bằng tiếng Việt.`
        : `Bạn là Haven AI — Trợ lý tư vấn tìm căn hộ HAVEN. Trả lời thân thiện, lịch sự, tự nhiên, bằng tiếng Việt chuẩn. Tuyệt đối không dùng các từ ngữ kỹ thuật như "RAG", "vector". Khi người dùng chào hỏi, hãy chào lại tự nhiên mà không ép buộc gợi ý căn hộ khi chưa có tiêu chí.`;

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
                  guardrailStatus: guardrailEval,
                  suggestedAction: parsed.classification.required.length > 0 || parsed.extractedFilters.city ? {
                    type: 'apply_filters',
                    queryText: userQuery
                  } : undefined
                };
              }
            }
          } catch (e) {
            // next key/model
          }
        }
      }
    } catch (apiErr) {
      console.error('Gemini API call failed, using natural fallback:', apiErr);
    }
  }

  // 3. Intelligent, Natural Grounded Response
  const naturalAnswer = generateNaturalResponse(userQuery, roleMode, retrievedSources, guardrailEval);

  const shouldSuggestAction = 
    guardrailEval.intent === 'PROPERTY_SEARCH' && 
    (parsed.classification.required.length > 0 || parsed.extractedFilters.city);

  return {
    answer: naturalAnswer,
    sources: retrievedSources,
    modelUsed: 'HAVEN Enterprise AI Engine',
    usedRealApi: false,
    guardrailStatus: guardrailEval,
    suggestedAction: shouldSuggestAction ? {
      type: 'apply_filters',
      queryText: userQuery
    } : undefined
  };
}
