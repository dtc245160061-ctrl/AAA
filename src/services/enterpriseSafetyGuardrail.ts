/**
 * HAVEN ENTERPRISE AI SAFETY GUARDRAIL & NLP INTELLIGENCE SUITE
 * 
 * Multi-layer Enterprise Guardrail Architecture:
 * 1. Layer 1: Prompt Injection, Jailbreak & Threat Defense Shield
 * 2. Layer 2: Intent Classification & Conversational Dialogue Policy (Accented & Unaccented Vietnamese NLP)
 * 3. Layer 3: System Security, Data Protection & Hallucination Prevention
 */

export type SafetyCategory = 
  | 'SAFE'
  | 'PROMPT_INJECTION'
  | 'SYSTEM_TAMPERING'
  | 'DATA_EXFILTRATION'
  | 'TOXICITY_HARASSMENT'
  | 'OUT_OF_SCOPE';

export type UserIntent =
  | 'GREETING_CHITCHAT'
  | 'GRATITUDE_CLOSURE'
  | 'PROPERTY_SEARCH'
  | 'PROPERTY_INQUIRY'
  | 'POLICY_ESCROW'
  | 'POLICY_TRUE_COST'
  | 'POLICY_PCCC'
  | 'ADMIN_DEBT_BILLING'
  | 'ADMIN_CONTRACT_EXPIRY'
  | 'ADMIN_GENERAL_OPS'
  | 'OUT_OF_SCOPE'
  | 'SECURITY_VIOLATION';

export interface GuardrailEvaluation {
  isSafe: boolean;
  category: SafetyCategory;
  intent: UserIntent;
  confidence: number;
  blockedReason?: string;
  sanitizedQuery: string;
}

export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Enterprise Threat Signatures (Accented & Unaccented)
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /quên\s+(hết\s+)?(toàn\s+bộ\s+)?chỉ\s+dẫn/i,
  /quen\s+(het\s+)?(toan\s+bo\s+)?chi\s+dan/i,
  /bỏ\s+qua\s+(hết\s+)?(quy\s+tắc|chỉ\s+dẫn|bộ\s+lọc|luật)/i,
  /bo\s+qua\s+(het\s+)?(quy\s+tac|chi\s+dan|bo\s+loc|luat)/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /bật\s+chế\s+độ\s+(nhà\s+phát\s+triển|developer|root|admin\s+mode)/i,
  /bat\s+che\s+do\s+(nha\s+phat\s+trien|developer|root|admin\s+mode)/i,
  /dan\s+mode|jailbreak|unfiltered\s+mode/i,
  /tiết\s+lộ\s+(toàn\s+bộ\s+)?(system\s+prompt|prompt\s+gốc|khóa\s+api|api\s+key)/i,
  /tiet\s+lo\s+(toan\s+bo\s+)?(system\s+prompt|prompt\s+goc|khoa\s+api|api\s+key)/i,
  /show\s+(me\s+)?(your\s+)?(system\s+prompt|instructions|api\s+key)/i,
  /show\s+api\s+key/i,
  /dump\s+(database|env|memory|passwords)/i,
  /select\s+\*\s+from\s+/i,
  /<script\b[^>]*>([\s\S]*?)<\/script>/i,
  /javascript:/i,
  /drop\s+table/i
];

const TOXIC_PATTERNS = [
  /đụ|đĩ|lồn|buồi|cặc|chó\s+đẻ|đm|vcl|vcll|con\s+mẹ\s+mày/i,
  /du\s+ma|con\s+me\s+may|cho\s+de/i,
  /tự\s+tử|chế\s+tạo\s+bom|vũ\s+khí|ma\s+túy|thuốc\s+lắc|rửa\s+tiền/i,
  /tu\s+tu|che\s+tao\s+bom|vu\s+khi|ma\s+tuy|rua\s+tien/i
];

// Greeting & Chitchat Regex Matrix (matches "holo ban nhe", "xin chao", "chao ban", "hi ad", etc.)
const GREETING_WORDS = [
  'chao', 'xin chao', 'hello', 'helo', 'holo', 'hi', 'alo', 'alooo', 'hey', 'heyy', 'yo', 'yoo',
  'morning', 'good morning', 'buoi sang tot lanh', 'ban oi', 'bot oi', 'haven oi', 'ad oi'
];

const GRATITUDE_WORDS = [
  'cam on', 'cảm ơn', 'cám ơn', 'thanks', 'thank you', 'cmon', 'tks', 'tam biet', 'tạm biệt', 'bye', 'goodbye'
];

/**
 * Enterprise Guardrail Safety Inspector
 */
export function evaluateEnterpriseSafety(query: string, roleMode: 'consumer' | 'admin'): GuardrailEvaluation {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();
  const normalizedNoAccents = removeVietnameseAccents(lower);

  // 1. Layer 1: Prompt Injection & System Tampering Shield
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed) || pattern.test(normalizedNoAccents)) {
      return {
        isSafe: false,
        category: 'PROMPT_INJECTION',
        intent: 'SECURITY_VIOLATION',
        confidence: 0.99,
        blockedReason: 'Phát hiện câu lệnh can thiệp cấu hình hệ thống / Prompt Injection.',
        sanitizedQuery: trimmed
      };
    }
  }

  // 2. Layer 1: Toxicity & Harassment Filter
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(trimmed) || pattern.test(normalizedNoAccents)) {
      return {
        isSafe: false,
        category: 'TOXICITY_HARASSMENT',
        intent: 'SECURITY_VIOLATION',
        confidence: 0.98,
        blockedReason: 'Nội dung vi phạm tiêu chuẩn cộng đồng và an toàn thông tin.',
        sanitizedQuery: trimmed
      };
    }
  }

  // 3. Layer 2: Intent Classification - Greeting & Chitchat
  // Check if the query is primarily a greeting
  const cleanTokens = normalizedNoAccents.replace(/[^\w\s]/g, '').trim();
  const isDirectGreeting = GREETING_WORDS.some(gw => {
    return cleanTokens === gw || 
           cleanTokens.startsWith(gw + ' ') || 
           cleanTokens.endsWith(' ' + gw) ||
           cleanTokens.includes(gw + ' ban') ||
           cleanTokens.includes(gw + ' nhe') ||
           cleanTokens.includes(gw + ' nha');
  });

  if (isDirectGreeting || 
      /^(chao|xin chao|hello|helo|holo|hi|alo|hey|yo|morning)(\s+[a-z0-9]+){0,3}$/i.test(cleanTokens) ||
      cleanTokens === 'ban la ai' || cleanTokens === 'ban ten gi' || cleanTokens === 'ban lam duoc gi' ||
      cleanTokens === 'ban khoe khong') {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'GREETING_CHITCHAT',
      confidence: 0.99,
      sanitizedQuery: trimmed
    };
  }

  // 4. Layer 2: Intent Classification - Gratitude & Closure
  const isGratitude = GRATITUDE_WORDS.some(gw => cleanTokens.includes(removeVietnameseAccents(gw)));
  if (isGratitude && cleanTokens.length < 35) {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'GRATITUDE_CLOSURE',
      confidence: 0.99,
      sanitizedQuery: trimmed
    };
  }

  // 5. Layer 2: Policy & Trust Domains
  if (normalizedNoAccents.includes('coc') || normalizedNoAccents.includes('escrow') || normalizedNoAccents.includes('bao chung') || normalizedNoAccents.includes('hoan coc')) {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'POLICY_ESCROW',
      confidence: 0.95,
      sanitizedQuery: trimmed
    };
  }

  if (normalizedNoAccents.includes('true cost') || normalizedNoAccents.includes('chi phi thuc') || normalizedNoAccents.includes('dien nuoc') || normalizedNoAccents.includes('phi quan ly')) {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'POLICY_TRUE_COST',
      confidence: 0.95,
      sanitizedQuery: trimmed
    };
  }

  if (normalizedNoAccents.includes('pccc') || normalizedNoAccents.includes('chong chay') || normalizedNoAccents.includes('nghiem thu pccc') || normalizedNoAccents.includes('qcvn') || normalizedNoAccents.includes('thoat hiem')) {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'POLICY_PCCC',
      confidence: 0.95,
      sanitizedQuery: trimmed
    };
  }

  // 6. Admin Telemetry & Operations Intents
  if (roleMode === 'admin') {
    if (normalizedNoAccents.includes('no') || normalizedNoAccents.includes('hoa don') || normalizedNoAccents.includes('thu tien') || normalizedNoAccents.includes('qua han') || normalizedNoAccents.includes('overdue')) {
      return {
        isSafe: true,
        category: 'SAFE',
        intent: 'ADMIN_DEBT_BILLING',
        confidence: 0.95,
        sanitizedQuery: trimmed
      };
    }
    if (normalizedNoAccents.includes('hop dong') || normalizedNoAccents.includes('het han') || normalizedNoAccents.includes('60 ngay') || normalizedNoAccents.includes('tai ky') || normalizedNoAccents.includes('gia han')) {
      return {
        isSafe: true,
        category: 'SAFE',
        intent: 'ADMIN_CONTRACT_EXPIRY',
        confidence: 0.95,
        sanitizedQuery: trimmed
      };
    }
  }

  // 7. Unit-Specific Inquiry (by Unit ID or Apartment Name)
  if (/\b(hn|sg|dn)-[a-z0-9]+-[0-9]+\b/i.test(trimmed) || normalizedNoAccents.includes('can so') || normalizedNoAccents.includes('can ho nay') || normalizedNoAccents.includes('can phong')) {
    return {
      isSafe: true,
      category: 'SAFE',
      intent: 'PROPERTY_INQUIRY',
      confidence: 0.92,
      sanitizedQuery: trimmed
    };
  }

  // 8. General Property Search
  return {
    isSafe: true,
    category: 'SAFE',
    intent: 'PROPERTY_SEARCH',
    confidence: 0.90,
    sanitizedQuery: trimmed
  };
}

/**
 * Enterprise Guardrail Shield Response for Violations
 */
export function generateGuardrailRejection(evalResult: GuardrailEvaluation): string {
  return `🛡️ **[Hệ Thống An Toàn HAVEN Enterprise AI Guardrail]**\n\n` +
    `Yêu cầu của bạn đã được kiểm duyệt bởi **Bộ Lọc An Toàn Đa Tầng Doanh Nghiệp**.\n\n` +
    `⚠️ **Lý do từ chối**: ${evalResult.blockedReason || 'Yêu cầu không phù hợp với chính sách an toàn thông tin và bảo mật dữ liệu của nền tảng.'}\n\n` +
    `HAVEN AI được thiết kế để hỗ trợ tìm kiếm không gian sống, tra cứu tiêu chuẩn an toàn PCCC, minh bạch chi phí True Cost và quản lý vận hành BĐS an toàn. Bạn vui lòng gửi các câu hỏi liên quan đến căn hộ và dịch vụ nhé!`;
}
