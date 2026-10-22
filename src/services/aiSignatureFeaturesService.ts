import { ApartmentStore, normalizeCity } from '../data/apartmentStore';
import type { ApartmentUnit } from '../types/apartment';

// ============================================================================
// ENGINE 1: AI CONTRACT RED-FLAG & LEGAL SHIELD SCANNER (#12)
// ============================================================================

export type RedFlagSeverity = 'Critical' | 'Warning' | 'Fair';

export interface ContractRedFlag {
  id: string;
  clauseTitle: string;
  originalExcerpt: string;
  severity: RedFlagSeverity;
  legalCitation: string;
  financialRiskVND: number;
  riskExplanation: string;
  rewrittenFairClause: string;
}

export interface ContractScanResult {
  contractText: string;
  legalSafetyScore: number; // 0 - 100
  verdict: 'high_risk' | 'medium_risk' | 'legally_sound';
  verdictTitle: string;
  summary: string;
  totalFinancialRiskVND: number;
  redFlags: ContractRedFlag[];
  remediedContractFullText: string;
}

/**
 * Common predatory lease contract sample used for live demonstration and testing.
 * Contains 5 standard traps commonly seen in unauthorized Vietnamese private rentals.
 */
export const SAMPLE_PREDATORY_CONTRACT_TEXT = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---***---

HỢP ĐỒNG THUÊ CĂN HỘ NHÀ Ở
(Mẫu hợp đồng lưu hành tự do)

Hôm nay, ngày 15 tháng 08 năm 2026, tại Hà Nội, chúng tôi gồm có:
BÊN CHO THUÊ (BÊN A): Ông Nguyễn Văn Bạo — SĐT: 0912.888.xxx
BÊN THUÊ (BÊN B): Bà Trần Thị Thu — CCCD: 00119900xxxx

Hai bên đồng ý ký kết hợp đồng thuê căn hộ với các điều khoản đặc biệt sau:

Điều 1: GIÁ THUÊ VÀ ĐẶT CỌC
- Giá thuê nhà: 12.000.000 VNĐ/tháng, thanh toán kỳ hạn 3 tháng/lần vào ngày 01 đầu quý.
- Tiền đặt cọc: 24.000.000 VNĐ (tương đương 02 tháng tiền nhà).
- Bên B cam kết thuê tối thiểu 12 tháng. Nếu Bên B chấm dứt hợp đồng trước thời hạn vì bất kỳ lý do gì (dù có báo trước 30 ngày), Bên A có quyền tịch thu toàn bộ 100% tiền đặt cọc và không hoàn trả lại bất kỳ khoản nào.
- Trong thời hạn hợp đồng, nếu giá cả thị trường biến động, Bên A có toàn quyền điều chỉnh tăng giá thuê thêm 20% sau 6 tháng mà không cần có sự đồng thuận bằng văn bản của Bên B.

Điều 2: CHI PHÍ ĐIỆN, NƯỚC VÀ DỊCH VỤ
- Tiền điện sinh hoạt tính khoán cố định: 4.500 VNĐ / 1 kWh (chưa bao gồm VAT).
- Tiền nước sinh hoạt tính: 35.000 VNĐ / 1 m3.
- Tiền dịch vụ vệ sinh và quản lý chung: 500.000 VNĐ / tháng.

Điều 3: QUYỀN KIỂM TRA PHÒNG CỦA BÊN CHO THUÊ
- Do là tài sản sở hữu của Bên A, Bên A có quyền giữ chìa khóa phụ và được phép vào căn hộ kiểm tra cơ sở vật chất bất kỳ thời điểm nào trong ngày mà không cần thông báo trước hoặc có sự đồng ý của Bên B.

Điều 4: TRÁCH NHIỆM BẢO TRÌ VÀ HỎNG HÓC
- Bên B có nghĩa vụ chịu toàn bộ chi phí sửa chữa, thay thế mọi trang thiết bị hư hỏng phát sinh trong quá trình ở, bao gồm cả sự cố nứt tường kết cấu, rò rỉ đường ống nước ngầm âm tường và chập cháy hệ thống dây điện âm của tòa nhà.

Điều 5: ĐƠN PHƯƠNG CHẤM DỨT HỢP ĐỒNG
- Nếu Bên B chậm nộp tiền thuê nhà quá 02 ngày so với thời hạn quy định, Bên A có quyền cắt điện nước ngay lập tức, đơn phương hủy hợp đồng và yêu cầu Bên B di dời toàn bộ tài sản ra khỏi căn hộ trong vòng 03 ngày; toàn bộ tiền cọc và tiền thừa bị tịch thu sung quỹ Bên A.`;

/**
 * Scan lease contract against Vietnamese Housing Law 2023, Civil Code 2015, and EVN tariffs.
 */
export function scanLeaseContractRedFlags(contractText: string): ContractScanResult {
  const flags: ContractRedFlag[] = [];
  const text = contractText || SAMPLE_PREDATORY_CONTRACT_TEXT;

  // Trap 1: Illegal Electricity markup (> 3,500đ or 4,000 - 4,500đ)
  const elecMatch = text.match(/điện.*?(\d[\d.,]*)\s*(?:vnđ|đ|đồng)\s*\/\s*(?:1\s*)?kwh/i) ||
                    text.match(/(\d[\d.,]*)\s*(?:vnđ|đ|đồng)\s*(?:cho|mỗi|\/)\s*(?:1\s*)?kwh/i);
  const elecPrice = elecMatch ? parseInt(elecMatch[1].replace(/[.,]/g, ''), 10) : 4500;
  if (elecPrice > 3200 || /4\.500|4500|4\.000|4000/i.test(text)) {
    const diffPerKwh = Math.max(1200, elecPrice - 2300);
    const estimatedRisk = diffPerKwh * 350 * 12; // 350kWh/mo for 12 months
    flags.push({
      id: 'rf-elec-markup',
      clauseTitle: 'Kê khống giá điện sinh hoạt trái quy định pháp luật',
      originalExcerpt: elecMatch ? elecMatch[0] : 'Tiền điện sinh hoạt tính khoán cố định: 4.500 VNĐ / 1 kWh',
      severity: 'Critical',
      legalCitation: 'Quyết định số 2941/QĐ-BCT & Khoản 6 Điều 12 Nghị định 134/2013/NĐ-CP (sửa đổi NĐ 17/2022/NĐ-CP)',
      financialRiskVND: estimatedRisk,
      riskExplanation: `Chủ nhà thu ${elecPrice.toLocaleString('vi-VN')}đ/kWh cao hơn khung giá bán lẻ điện sinh hoạt bậc thang của EVN (~2.300đ - 3.151đ/kWh). Hành vi thu chênh lệch tiền điện của người thuê nhà bị phạt tiền từ 20.000.000đ đến 30.000.000đ.`,
      rewrittenFairClause: 'Tiền điện sinh hoạt: Bên B thanh toán theo đúng chỉ số công tơ điện riêng nhân với biểu giá bán lẻ điện sinh hoạt bậc thang thực tế do Tập đoàn Điện lực Việt Nam (EVN) ban hành hoặc nộp trực tiếp qua ứng dụng EVN.'
    });
  }

  // Trap 2: Unfair Deposit Forfeiture & Unilateral Rent Hike
  if (/tịch thu toàn bộ 100% tiền đặt cọc|mất toàn bộ tiền cọc|không hoàn trả lại bất kỳ khoản nào/i.test(text) ||
      /tăng giá thuê.*?(?:15%|20%|sau 6 tháng)/i.test(text)) {
    flags.push({
      id: 'rf-deposit-penalty',
      clauseTitle: 'Tịch thu 100% tiền cọc dù báo trước & Quyền tăng giá 20% vô căn cứ',
      originalExcerpt: 'Nếu Bên B chấm dứt hợp đồng trước thời hạn vì bất kỳ lý do gì (dù có báo trước 30 ngày), Bên A có quyền tịch thu toàn bộ 100% tiền đặt cọc... tăng giá thuê thêm 20% sau 6 tháng',
      severity: 'Critical',
      legalCitation: 'Điều 328, 422 & 428 Bộ luật Dân sự 2015; Khoản 2 Điều 132 Luật Nhà ở 2023',
      financialRiskVND: 24000000,
      riskExplanation: 'Khi người thuê thông báo trước hợp lý (tối thiểu 30 ngày), việc tịch thu 100% cọc và áp đặt tăng giá thuê giữa kỳ hợp đồng mà không có thỏa thuận là điều khoản vô hiệu do vi phạm nguyên tắc công bằng.',
      rewrittenFairClause: 'Nếu Bên B có nhu cầu chấm dứt hợp đồng trước hạn và thông báo bằng văn bản cho Bên A trước ít nhất 30 ngày, Bên A có trách nhiệm hoàn trả lại 100% tiền đặt cọc sau khi trừ các khoản phí dịch vụ đã sử dụng thực tế. Giá thuê nhà được giữ ổn định trong suốt 12 tháng của thời hạn hợp đồng.'
    });
  }

  // Trap 3: Landlord Unannounced Entry (Violating Privacy & Sanctity of Residence)
  if (/được phép vào.*?kiểm tra.*?không cần thông báo trước|không cần sự đồng ý của Bên B|giữ chìa khóa phụ và được phép vào/i.test(text)) {
    flags.push({
      id: 'rf-privacy-trespass',
      clauseTitle: 'Xâm phạm chỗ ở hợp pháp & tự ý vào phòng không báo trước',
      originalExcerpt: 'Bên A có quyền giữ chìa khóa phụ và được phép vào căn hộ kiểm tra cơ sở vật chất bất kỳ thời điểm nào trong ngày mà không cần thông báo trước',
      severity: 'Critical',
      legalCitation: 'Điều 22 Hiến pháp 2013 & Điều 158 Bộ luật Hình sự 2015 (Tội xâm phạm chỗ ở của người khác)',
      financialRiskVND: 5000000,
      riskExplanation: 'Người thuê nhà đã thanh toán tiền thuê có quyền bất khả xâm phạm về chỗ ở. Chủ nhà tự ý mở cửa vào nhà khi chưa được sự đồng ý của khách thuê là hành vi vi phạm pháp luật nghiêm trọng.',
      rewrittenFairClause: 'Bên A cam kết tôn trọng quyền riêng tư và quyền bất khả xâm phạm về chỗ ở của Bên B. Trong trường hợp cần kiểm tra bảo dưỡng định kỳ hoặc sửa chữa, Bên A phải thông báo trước bằng tin nhắn/văn bản cho Bên B ít nhất 24 giờ và chỉ được vào khi có sự hiện diện hoặc chấp thuận của Bên B.'
    });
  }

  // Trap 4: Shifting Structural Repair & Underground Plumbing onto Tenant
  if (/sự cố nứt tường kết cấu|rò rỉ đường ống nước ngầm|chập cháy hệ thống dây điện âm/i.test(text) ||
      /chịu toàn bộ chi phí sửa chữa.*?mọi trang thiết bị/i.test(text)) {
    flags.push({
      id: 'rf-structural-repairs',
      clauseTitle: 'Ép khách thuê chịu chi phí sửa kết cấu nứt tường & điện ngầm',
      originalExcerpt: 'Bên B có nghĩa vụ chịu toàn bộ chi phí sửa chữa... bao gồm cả sự cố nứt tường kết cấu, rò rỉ đường ống nước ngầm âm tường và chập cháy hệ thống dây điện âm của tòa nhà',
      severity: 'Warning',
      legalCitation: 'Điều 477 Bộ luật Dân sự 2015 & Điều 133 Luật Nhà ở 2023',
      financialRiskVND: 15000000,
      riskExplanation: 'Theo luật, bên cho thuê nhà có nghĩa vụ bảo dưỡng và sửa chữa các hư hỏng kết cấu, hao mòn tự nhiên hoặc lỗi ngầm của công trình. Khách thuê chỉ chịu trách nhiệm với hư hại do lỗi sử dụng trực tiếp của mình.',
      rewrittenFairClause: 'Bên A chịu trách nhiệm bảo dưỡng, sửa chữa lớn và chi trả toàn bộ chi phí đối với các hư hỏng thuộc về kết cấu tòa nhà, hệ thống cấp thoát nước ngầm, dây điện âm tường và hao mòn tự nhiên. Bên B chỉ chịu trách nhiệm sửa chữa các hư hỏng nhỏ do thao tác sử dụng cá nhân gây ra.'
    });
  }

  // Trap 5: Extremely Short Eviction Notice (< 7 days) and Instant Power Cut
  if (/cắt điện nước ngay lập tức|di dời toàn bộ tài sản.*?trong vòng 03 ngày|trong vòng 3 ngày|chậm nộp.*?quá 02 ngày/i.test(text)) {
    flags.push({
      id: 'rf-short-eviction',
      clauseTitle: 'Cắt điện nước tùy tiện & Ép dọn nhà trong vòng 3 ngày',
      originalExcerpt: 'Bên A có quyền cắt điện nước ngay lập tức, đơn phương hủy hợp đồng và yêu cầu Bên B di dời toàn bộ tài sản ra khỏi căn hộ trong vòng 03 ngày',
      severity: 'Critical',
      legalCitation: 'Khoản 4 Điều 132 Luật Nhà ở 2023 (Thời hạn báo trước tối thiểu 30 ngày)',
      financialRiskVND: 8000000,
      riskExplanation: 'Luật Nhà ở quy định rõ bên đơn phương chấm dứt hợp đồng thuê phải thông báo cho bên kia biết trước ít nhất 30 ngày. Hành vi cắt điện nước tự ý và cưỡng chế thu giữ đồ đạc trong 3 ngày là trái pháp luật dân sự.',
      rewrittenFairClause: 'Trong trường hợp một bên muốn đơn phương chấm dứt hợp đồng do bên kia vi phạm nghĩa vụ thanh toán hoặc quy tắc chung, phải thông báo bằng văn bản trước ít nhất 30 ngày. Không bên nào được tự ý cắt tiện ích sinh hoạt (điện, nước) mà không có sự phán quyết của cơ quan có thẩm quyền.'
    });
  }

  // Compute overall score
  let deduction = 0;
  flags.forEach(f => {
    if (f.severity === 'Critical') deduction += 22;
    else if (f.severity === 'Warning') deduction += 12;
    else deduction += 5;
  });

  const legalSafetyScore = Math.max(18, 100 - deduction);
  const totalFinancialRiskVND = flags.reduce((acc, f) => acc + f.financialRiskVND, 0);

  let verdict: 'high_risk' | 'medium_risk' | 'legally_sound' = 'legally_sound';
  let verdictTitle = 'Hợp Đồng Minh Bạch & An Toàn Pháp Lý';
  if (legalSafetyScore < 50) {
    verdict = 'high_risk';
    verdictTitle = 'HỢP ĐỒNG NGUY HIỂM — CÀI ĐẶT NHIỀU ĐIỀU KHOẢN BẪY BẤT LỢI';
  } else if (legalSafetyScore < 80) {
    verdict = 'medium_risk';
    verdictTitle = 'CẦN CHỈNH SỬA — CÓ ĐIỀU KHOẢN CHÊNH LỆCH VÀ BẤT LỢI CHO KHÁCH THUÊ';
  }

  // Generate remedied fair contract text
  let remediedContractFullText = text;
  flags.forEach(f => {
    if (f.originalExcerpt && f.rewrittenFairClause) {
      remediedContractFullText = remediedContractFullText.replace(f.originalExcerpt, `[ĐÃ SỬA THEO LUẬT NHÀ Ở 2023]: ${f.rewrittenFairClause}`);
    }
  });

  const summary = `Máy quét phát hiện ${flags.length} điều khoản rủi ro lớn (tổng rủi ro tài chính ước tính ~${(totalFinancialRiskVND / 1000000).toFixed(1)} triệu VNĐ). Đã chuẩn bị các điều khoản thay thế chuẩn hóa theo Luật Nhà ở 2023 và Bộ luật Dân sự 2015.`;

  return {
    contractText: text,
    legalSafetyScore,
    verdict,
    verdictTitle,
    summary,
    totalFinancialRiskVND,
    redFlags: flags,
    remediedContractFullText
  };
}


// ============================================================================
// ENGINE 2: PCCC QCVN 06:2022/BXD FIRE SURVIVAL & COMPLIANCE AUDITOR (#15)
// ============================================================================

export interface PcccSurvivalAuditResult {
  survivalScore: number; // 0 - 100
  verdict: 'fully_compliant' | 'warning_high_rise' | 'critical_non_compliant';
  verdictTitle: string;
  verdictBadgeText: string;
  estimatedEvacuationSeconds: number; // floor * 14 + 25
  evacuationMinutesLabel: string;
  stairwellPressurizationOk: boolean;
  corridorExitWidthMeters: number;
  qcvnComplianceDetails: {
    ruleCode: string;
    title: string;
    passed: boolean;
    standardReq: string;
    currentValue: string;
    advice: string;
  }[];
  survivalRecommendations: string[];
  equipmentSummary: {
    fireEscapeCount: number;
    hasAutomaticSprinklers: boolean;
    hasSmokeDetectors: boolean;
    hasFireExtinguishers: boolean;
    hasBackupPower: boolean;
    certificateStatus: string;
  };
}

/**
 * Audit unit fire survival and safety compliance according to QCVN 06:2022/BXD.
 */
export function auditUnitPcccSafety(unit: ApartmentUnit): PcccSurvivalAuditResult {
  const pccc = unit.pcccReport || {
    hasFireEscapes: true,
    fireEscapeCount: unit.floor > 15 ? 2 : 1,
    hasAutomaticSprinklers: unit.floor > 10,
    hasSmokeDetectors: true,
    hasFireExtinguishers: true,
    inspectionCertificateStatus: 'certified' as const,
    emergencyExitWidthMeters: 1.4,
    disclaimer: 'Căn cứ hồ sơ tòa nhà'
  };

  const floor = Math.max(1, unit.floor || 5);
  // Evacuation velocity: ~14 seconds per floor downward stair navigation + 25 seconds corridor buffer
  const estimatedEvacuationSeconds = Math.round(floor * 14 + 25);
  const evacuationMinutes = (estimatedEvacuationSeconds / 60).toFixed(1);

  // Pressurization check: for high rises (>9 floors), QCVN 06:2022 requires pressurized smoke-free stairwells (buồng thang N1/N2/N3)
  const isHighRise = floor >= 10;
  const stairwellPressurizationOk = isHighRise
    ? pccc.fireEscapeCount >= 2 && pccc.hasSmokeDetectors
    : pccc.hasFireEscapes;

  const corridorExitWidthMeters = pccc.emergencyExitWidthMeters || (isHighRise ? 1.4 : 1.2);

  const complianceDetails = [
    {
      ruleCode: 'QCVN 06:2022 - Mục 3.2.1',
      title: 'Số lượng thang thoát nạn độc lập',
      passed: floor > 15 ? pccc.fireEscapeCount >= 2 : pccc.fireEscapeCount >= 1,
      standardReq: floor > 15 ? 'Tối thiểu 02 buồng thang thoát hiểm độc lập' : 'Tối thiểu 01 buồng thang thoát hiểm',
      currentValue: `${pccc.fireEscapeCount} buồng thang hiện hữu`,
      advice: pccc.fireEscapeCount < 2 && floor > 15 
        ? 'Cảnh báo: Căn hộ tầng cao >15 bắt buộc phải có ít nhất 2 hướng thoát nạn độc lập.' 
        : 'Đạt chuẩn số lượng hướng thoát hiểm theo quy định.'
    },
    {
      ruleCode: 'QCVN 06:2022 - Mục 3.3.4',
      title: 'Chiều rộng thông thủy lối thoát nạn hành lang',
      passed: corridorExitWidthMeters >= 1.2,
      standardReq: '≥ 1.2m (công trình dưới 50 người) hoặc ≥ 1.4m',
      currentValue: `${corridorExitWidthMeters.toFixed(1)}m`,
      advice: corridorExitWidthMeters >= 1.4 ? 'Đạt chuẩn cao cấp thông thoáng cho xe đẩy cứu thương' : 'Đạt chuẩn tối thiểu'
    },
    {
      ruleCode: 'QCVN 06:2022 - Mục 5.1',
      title: 'Hệ thống chữa cháy tự động Sprinkler',
      passed: pccc.hasAutomaticSprinklers,
      standardReq: 'Đầu phun Sprinkler tự động tại phòng khách và khu vực sảnh',
      currentValue: pccc.hasAutomaticSprinklers ? 'Đã trang bị đầu phun tự động' : 'Chưa có đầu phun tự động',
      advice: pccc.hasAutomaticSprinklers ? 'Tự động kích hoạt dập lửa trong 30 giây đầu' : 'Cần bổ sung bình bọt chữa cháy khí CO2/FM200'
    },
    {
      ruleCode: 'QCVN 06:2022 - Mục 5.3',
      title: 'Đầu báo khói nối tủ trung tâm & Điện dự phòng bơm áp',
      passed: pccc.hasSmokeDetectors && unit.hasBackupPower,
      standardReq: 'Cảm biến báo khói 24/7 và máy phát điện dự phòng bơm PCCC',
      currentValue: unit.hasBackupPower ? 'Có điện dự phòng 100% tòa nhà' : 'Không có điện dự phòng khẩn cấp',
      advice: unit.hasBackupPower ? 'Đảm bảo quạt hút khói hành lang hoạt động khi mất điện lưới' : 'Cần kiểm tra máy phát điện dự phòng thang thoát hiểm'
    }
  ];

  // Scoring
  let score = 50;
  if (pccc.hasFireEscapes) score += 15;
  if (pccc.fireEscapeCount >= 2) score += 10;
  if (pccc.hasAutomaticSprinklers) score += 12;
  if (pccc.hasSmokeDetectors) score += 8;
  if (unit.hasBackupPower) score += 10;
  if (pccc.inspectionCertificateStatus === 'certified') score += 5;
  if (floor > 20 && pccc.fireEscapeCount < 2) score -= 15;

  const survivalScore = Math.min(100, Math.max(30, score));

  let verdict: 'fully_compliant' | 'warning_high_rise' | 'critical_non_compliant' = 'fully_compliant';
  let verdictTitle = 'ĐẠT CHUẨN AN TOÀN SINH TỒN QCVN 06:2022/BXD';
  let verdictBadgeText = 'An Toàn Sinh Tồn Cao';

  if (survivalScore < 60) {
    verdict = 'critical_non_compliant';
    verdictTitle = 'CẢNH BÁO: CHƯA ĐẠT CHUẨN PCCC TOÀN DIỆN CHO TẦNG CAO';
    verdictBadgeText = 'Cần Kiểm Tra Lại';
  } else if (survivalScore < 85) {
    verdict = 'warning_high_rise';
    verdictTitle = 'ĐẠT TIÊU CHUẨN CƠ BẢN — LƯU Ý KẾT NỐI ĐIỀU ÁP THANG BỘ';
    verdictBadgeText = 'Đạt Chuẩn Cơ Bản';
  }

  const survivalRecommendations: string[] = [];
  if (floor > 12) {
    survivalRecommendations.push(`Tầng ${floor} cách mặt đất ~${floor * 3.3}m: Chuẩn bị sẵn mặt nạ phòng độc khói chuyên dụng trong tủ đầu giường.`);
  }
  if (!pccc.hasAutomaticSprinklers) {
    survivalRecommendations.push('Căn hộ chưa có đầu phun Sprinkler: Trang bị thêm 02 bình cứu hỏa mini CO2 tại cửa chính và bếp.');
  }
  survivalRecommendations.push(`Thời gian ước tính di chuyển cầu thang bộ xuống sảnh: ~${evacuationMinutes} phút (${estimatedEvacuationSeconds} giây).`);
  survivalRecommendations.push('Cửa thoát nạn buồng thang phải luôn ở trạng thái đóng tự động để ngăn khói độc xâm nhập.');

  return {
    survivalScore,
    verdict,
    verdictTitle,
    verdictBadgeText,
    estimatedEvacuationSeconds,
    evacuationMinutesLabel: `${evacuationMinutes} phút`,
    stairwellPressurizationOk,
    corridorExitWidthMeters,
    qcvnComplianceDetails: complianceDetails,
    survivalRecommendations,
    equipmentSummary: {
      fireEscapeCount: pccc.fireEscapeCount,
      hasAutomaticSprinklers: pccc.hasAutomaticSprinklers,
      hasSmokeDetectors: pccc.hasSmokeDetectors,
      hasFireExtinguishers: pccc.hasFireExtinguishers,
      hasBackupPower: unit.hasBackupPower,
      certificateStatus: pccc.inspectionCertificateStatus
    }
  };
}


// ============================================================================
// ENGINE 3: HYPER-REALISTIC TRUE COST OF LIVING & COMMUTE FUEL CALCULATOR (#14)
// ============================================================================

export type CommuteVehicleType = 'motorbike' | 'car_gas' | 'car_ev';

export interface CommuteDestinationPreset {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  category: 'office' | 'university' | 'hub' | 'landmark';
}

export const COMMUTE_DESTINATION_PRESETS: CommuteDestinationPreset[] = [
  // Hà Nội
  { id: 'dest-hn-keangnam', name: 'Keangnam Landmark 72 (Cầu Giấy IT Hub)', city: 'Hanoi', address: 'Phạm Hùng, Nam Từ Liêm, Hà Nội', lat: 21.0169, lng: 105.7838, category: 'office' },
  { id: 'dest-hn-hoankiem', name: 'Hồ Hoàn Kiếm & Trung Tâm Hoàn Kiếm', city: 'Hanoi', address: 'Hoàn Kiếm, Hà Nội', lat: 21.0285, lng: 105.8542, category: 'landmark' },
  { id: 'dest-hn-bachkhoa', name: 'Cụm Đại Học Bách Khoa - KTQD - Xây Dựng', city: 'Hanoi', address: 'Đại Cồ Việt, Hai Bà Trưng, Hà Nội', lat: 21.0044, lng: 105.8432, category: 'university' },
  { id: 'dest-hn-lotte', name: 'Lotte Center Liễu Giai (Khu Ngoại Giao Ba Đình)', city: 'Hanoi', address: '54 Liễu Giai, Ba Đình, Hà Nội', lat: 21.0333, lng: 105.8139, category: 'office' },

  // TP. Hồ Chí Minh
  { id: 'dest-hcm-bitexco', name: 'Saigon Centre & Bitexco Financial Tower', city: 'Ho Chi Minh City', address: 'Quận 1, TP. Hồ Chí Minh', lat: 10.7719, lng: 106.7044, category: 'office' },
  { id: 'dest-hcm-thaodien', name: 'Thảo Điền & BIS International School', city: 'Ho Chi Minh City', address: 'TP. Thủ Đức, TP. Hồ Chí Minh', lat: 10.8066, lng: 106.7328, category: 'hub' },
  { id: 'dest-hcm-shtp', name: 'Khu Công Nghệ Cao TP.HCM (SHTP Tech Park)', city: 'Ho Chi Minh City', address: 'Xa Lộ Hà Nội, TP. Thủ Đức', lat: 10.8544, lng: 106.7865, category: 'office' },
  { id: 'dest-hcm-phumyhung', name: 'Trung Tâm Phú Mỹ Hưng & Crescent Mall', city: 'Ho Chi Minh City', address: 'Quận 7, TP. Hồ Chí Minh', lat: 10.7292, lng: 106.7219, category: 'landmark' },

  // Thái Nguyên
  { id: 'dest-tn-ictu', name: 'ĐH CNTT & Truyền Thông (ICTU Thái Nguyên)', city: 'Thái Nguyên', address: 'Đường Z115, Xã Quyết Thắng, TP. Thái Nguyên', lat: 21.5833, lng: 105.7972, category: 'university' },
  { id: 'dest-tn-samsung', name: 'Tổ Hợp KCN Samsung Electronics Yên Bình', city: 'Thái Nguyên', address: 'KCN Yên Bình, Phổ Yên, Thái Nguyên', lat: 21.4325, lng: 105.8642, category: 'office' },
  { id: 'dest-tn-center', name: 'Quảng Trường Võ Nguyên Giáp (Trung Tâm TP. Thái Nguyên)', city: 'Thái Nguyên', address: 'Đội Cấn, TP. Thái Nguyên', lat: 21.5942, lng: 105.8450, category: 'landmark' },

  // Đà Nẵng
  { id: 'dest-dn-bridge', name: 'Cầu Rồng & Trung Tâm Tài Chính Bạch Đằng', city: 'Da Nang', address: 'Hải Châu, Đà Nẵng', lat: 16.0614, lng: 108.2238, category: 'landmark' },
  { id: 'dest-dn-fpt', name: 'Khu Đô Thị Công Nghệ FPT City Đà Nẵng', city: 'Da Nang', address: 'Ngũ Hành Sơn, Đà Nẵng', lat: 15.9867, lng: 108.2619, category: 'office' }
];

export interface HyperRealisticLivingCostResult {
  baseRentVND: number;
  electricityVND: number;
  waterVND: number;
  managementFeeVND: number;
  internetFeeVND: number;
  parkingFeeVND: number;
  baseTrueCostVND: number;

  destination: CommuteDestinationPreset;
  vehicleType: CommuteVehicleType;
  commuteOneWayKm: number;
  monthlyRoundTripKm: number;
  monthlyCommuteFuelCostVND: number;
  trafficCongestionMultiplier: number;
  monthlyHoursLostInTraffic: number;
  monetaryValueOfTimeLostVND: number;
  floodRiskExposureVND: number;

  grandTotalTrueLivingCostVND: number;
  incomeRatioPercent: number;
  financialHealthVerdict: 'safe' | 'balanced' | 'burden';
  financialHealthVerdictText: string;
}

/**
 * Haversine distance formula between two lat/lng coordinates in kilometers.
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Hyper-Realistic Living Cost Calculation Engine.
 */
export function calculateHyperRealisticLivingCost(
  unit: ApartmentUnit,
  destinationIdOrCoords?: string | { lat: number; lng: number },
  vehicleType: CommuteVehicleType = 'motorbike',
  monthlyIncomeVND: number = 35000000
): HyperRealisticLivingCostResult {
  const baseRent = unit.monthlyRentVND || 15000000;
  const trueCost = unit.trueCost || {
    baseRentVND: baseRent,
    estimatedElectricityVND: 850000,
    waterFeeVND: 140000,
    internetFeeVND: 250000,
    managementFeeVND: Math.round((unit.sqm || 65) * 18000),
    parkingFeeVND: unit.hasCarParking ? 1200000 : 120000,
    totalMonthlyEstimatedVND: baseRent + 850000 + 140000 + 250000 + Math.round((unit.sqm || 65) * 18000) + (unit.hasCarParking ? 1200000 : 120000),
    depositMonths: 1,
    depositVND: baseRent,
    moveInTotalRequiredVND: baseRent * 2
  };

  // Find destination preset
  const presetsForCity = COMMUTE_DESTINATION_PRESETS.filter(
    p => normalizeCity(p.city) === normalizeCity(unit.city)
  );
  let dest = typeof destinationIdOrCoords === 'string'
    ? COMMUTE_DESTINATION_PRESETS.find(p => p.id === destinationIdOrCoords)
    : null;

  if (!dest && presetsForCity.length > 0) {
    dest = presetsForCity[0];
  }
  if (!dest) {
    dest = COMMUTE_DESTINATION_PRESETS[0];
  }

  // Calculate distance
  const unitLat = unit.coordinates?.lat || 21.035;
  const unitLng = unit.coordinates?.lng || 105.825;
  const targetLat = typeof destinationIdOrCoords === 'object' && destinationIdOrCoords?.lat ? destinationIdOrCoords.lat : dest.lat;
  const targetLng = typeof destinationIdOrCoords === 'object' && destinationIdOrCoords?.lng ? destinationIdOrCoords.lng : dest.lng;

  const rawKm = calculateHaversineDistanceKm(unitLat, unitLng, targetLat, targetLng);
  // Add 25% urban road routing coefficient
  const commuteOneWayKm = Math.max(1.8, Math.round(rawKm * 1.25 * 10) / 10);
  const monthlyRoundTripKm = Math.round(commuteOneWayKm * 2 * 22); // 22 working days/mo

  // Traffic density multiplier
  let trafficMultiplier = 1.0;
  if (unit.trafficDensity === 'Moderate') trafficMultiplier = 1.25;
  if (unit.trafficDensity === 'Heavy') trafficMultiplier = 1.6;

  // Monthly fuel / electricity charging cost
  let monthlyCommuteFuelCostVND = 0;
  if (vehicleType === 'motorbike') {
    // 2.3L RON 95 per 100km @ ~23,800 VND/L
    const litersUsed = (monthlyRoundTripKm / 100) * 2.3 * trafficMultiplier;
    monthlyCommuteFuelCostVND = Math.round(litersUsed * 23800);
  } else if (vehicleType === 'car_gas') {
    // 8.5L RON 95 per 100km in city @ 23,800 VND/L
    const litersUsed = (monthlyRoundTripKm / 100) * 8.5 * trafficMultiplier;
    monthlyCommuteFuelCostVND = Math.round(litersUsed * 23800);
  } else {
    // EV: 16 kWh / 100km @ 3,850 VND/kWh (VinFast public charger / EVN Tier 5)
    const kwhUsed = (monthlyRoundTripKm / 100) * 16.0;
    monthlyCommuteFuelCostVND = Math.round(kwhUsed * 3850);
  }

  // Hours lost in traffic: Avg 30km/h normal, drops to 16km/h in peak
  const peakSpeedKmH = vehicleType === 'motorbike' ? 22 : 16;
  const dailyCommuteHours = (commuteOneWayKm * 2) / (peakSpeedKmH / trafficMultiplier);
  const monthlyHoursLostInTraffic = Math.round(dailyCommuteHours * 22 * 10) / 10;

  // Time value based on user monthly income (assuming 176 work hours per month)
  const hourlyRateVND = monthlyIncomeVND / 176;
  const monetaryValueOfTimeLostVND = Math.round(monthlyHoursLostInTraffic * hourlyRateVND * 0.5); // 50% leisure discount

  // Flooding risk provision
  let floodRiskExposureVND = 0;
  if (unit.floodingRisk === 'High') {
    floodRiskExposureVND = vehicleType.includes('car') ? 1500000 : 450000;
  } else if (unit.floodingRisk === 'Moderate') {
    floodRiskExposureVND = vehicleType.includes('car') ? 500000 : 150000;
  }

  const baseTrueCostVND = trueCost.totalMonthlyEstimatedVND || (
    baseRent + trueCost.estimatedElectricityVND + trueCost.waterFeeVND + trueCost.internetFeeVND + trueCost.managementFeeVND + trueCost.parkingFeeVND
  );

  const grandTotalTrueLivingCostVND = Math.round(
    baseTrueCostVND + monthlyCommuteFuelCostVND + floodRiskExposureVND
  );

  const incomeRatioPercent = Math.round((grandTotalTrueLivingCostVND / monthlyIncomeVND) * 100);

  let financialHealthVerdict: 'safe' | 'balanced' | 'burden' = 'safe';
  let financialHealthVerdictText = 'Khỏe mạnh & Bền vững (< 35% thu nhập)';
  if (incomeRatioPercent > 50) {
    financialHealthVerdict = 'burden';
    financialHealthVerdictText = 'Cảnh báo gánh nặng tài chính (> 50% thu nhập)';
  } else if (incomeRatioPercent > 35) {
    financialHealthVerdict = 'balanced';
    financialHealthVerdictText = 'Cân bằng, nằm trong ngưỡng chi trả cho phép (35% - 50%)';
  }

  return {
    baseRentVND: baseRent,
    electricityVND: trueCost.estimatedElectricityVND,
    waterVND: trueCost.waterFeeVND,
    managementFeeVND: trueCost.managementFeeVND,
    internetFeeVND: trueCost.internetFeeVND,
    parkingFeeVND: trueCost.parkingFeeVND,
    baseTrueCostVND,

    destination: dest,
    vehicleType,
    commuteOneWayKm,
    monthlyRoundTripKm,
    monthlyCommuteFuelCostVND,
    trafficCongestionMultiplier: trafficMultiplier,
    monthlyHoursLostInTraffic,
    monetaryValueOfTimeLostVND,
    floodRiskExposureVND,

    grandTotalTrueLivingCostVND,
    incomeRatioPercent,
    financialHealthVerdict,
    financialHealthVerdictText
  };
}


// ============================================================================
// ENGINE 4: AI DYNAMIC NEGOTIATION WAR-ROOM & AUTO-BARGAINING AGENT (#13)
// ============================================================================

export interface NegotiationPackage {
  id: 'package_commitment' | 'package_service_waiver' | 'package_price_match';
  title: string;
  badge: string;
  targetDiscountPercent: number;
  monthlySavingVND: number;
  annualSavingVND: number;
  landlordValueProposition: string;
  recommendedCounterPriceVND: number;
  proposedMessageToLandlord: string;
}

export interface NegotiationWarRoomStrategy {
  unit: ApartmentUnit;
  districtMedianRentVND: number;
  unitPricePercentile: number; // 0 - 100
  marketLeverage: 'high_tenant_leverage' | 'neutral' | 'high_landlord_leverage';
  leverageExplanation: string;
  packages: NegotiationPackage[];
}

/**
 * Generate AI-calculated counter-offer strategies and market leverage analysis
 * across all units in the same district and bedroom count.
 */
export function buildNegotiationWarRoomStrategy(
  unit: ApartmentUnit,
  allUnitsPool?: ApartmentUnit[]
): NegotiationWarRoomStrategy {
  const all = allUnitsPool && allUnitsPool.length > 0 ? allUnitsPool : ApartmentStore.getUnits();
  const sameDistrictUnits = all.filter(
    u => u.district.toLowerCase() === unit.district.toLowerCase() &&
         Math.abs(u.bedrooms - unit.bedrooms) <= 1
  );

  const pricePool = sameDistrictUnits.length >= 3 ? sameDistrictUnits : all;
  const sortedPrices = pricePool.map(u => u.monthlyRentVND).sort((a, b) => a - b);
  const districtMedianRentVND = sortedPrices[Math.floor(sortedPrices.length / 2)] || unit.monthlyRentVND;

  // Calculate percentile
  const lowerCount = sortedPrices.filter(p => p < unit.monthlyRentVND).length;
  const unitPricePercentile = Math.round((lowerCount / sortedPrices.length) * 100);

  let marketLeverage: 'high_tenant_leverage' | 'neutral' | 'high_landlord_leverage' = 'neutral';
  let leverageExplanation = 'Mức giá căn hộ bám sát trung bình thị trường khu vực. Khách thuê có đòn bẩy thương lượng ở gói thanh toán dài hạn.';

  if (unitPricePercentile > 65) {
    marketLeverage = 'high_tenant_leverage';
    leverageExplanation = `Giá căn hộ đang cao hơn ${unitPricePercentile}% các căn cùng phân khúc tại ${unit.district}. Khách thuê có đòn bẩy rất lớn để đàm phán giảm từ 7% - 12%.`;
  } else if (unitPricePercentile < 35) {
    marketLeverage = 'high_landlord_leverage';
    leverageExplanation = `Căn hộ này đã có giá tốt (thấp hơn ${100 - unitPricePercentile}% thị trường). Nên đàm phán ưu đãi phí dịch vụ thay vì ép giá thuê trực tiếp.`;
  }

  const currentRent = unit.monthlyRentVND;

  // Package 1: Long-term commitment & Prepayment
  const p1DiscountPct = marketLeverage === 'high_tenant_leverage' ? 10 : 7;
  const p1CounterPrice = Math.round((currentRent * (100 - p1DiscountPct)) / 100 / 100000) * 100000;
  const p1MonthlySaving = currentRent - p1CounterPrice;

  // Package 2: Parking & Service waiver (saving ~1.2M - 1.8M/mo)
  const p2MonthlySaving = unit.hasCarParking ? 1500000 : 600000;
  const p2CounterPrice = currentRent; // Keep base rent, waive fee

  // Package 3: Price match to District Median
  const p3CounterPrice = Math.min(currentRent, Math.round(districtMedianRentVND / 100000) * 100000);
  const p3MonthlySaving = Math.max(500000, currentRent - p3CounterPrice);

  const packages: NegotiationPackage[] = [
    {
      id: 'package_commitment',
      title: 'Gói 1: Cam Kết Thuê 2 Năm & Đóng Cọc 3 Tháng (Chiết Khấu Cao)',
      badge: `Giảm ${p1DiscountPct}% (${(p1MonthlySaving / 1000000).toFixed(1)}Tr/tháng)`,
      targetDiscountPercent: p1DiscountPct,
      monthlySavingVND: p1MonthlySaving,
      annualSavingVND: p1MonthlySaving * 12,
      landlordValueProposition: 'Giúp chủ nhà tránh chu kỳ phòng trống (vacancy risk) và có sẵn dòng tiền lớn đầu kỳ.',
      recommendedCounterPriceVND: p1CounterPrice,
      proposedMessageToLandlord: `Chào anh/chị chủ nhà căn ${unit.name || unit.id}! Em rất thích căn hộ của mình và sẵn sàng ký hợp đồng thuê dài hạn 24 tháng, thanh toán trước 3 tháng ngay tuần này. Với cam kết dài hạn và giữ gìn nhà cẩn thận, em xin phép đề xuất mức giá thuê hữu nghị là ${(p1CounterPrice / 1000000).toFixed(1)} triệu/tháng được không anh/chị?`
    },
    {
      id: 'package_service_waiver',
      title: 'Gói 2: Giữ Nguyên Giá Thuê — Miễn Phí Gửi Xe & Dịch Vụ',
      badge: `Tiết kiệm ${(p2MonthlySaving / 1000000).toFixed(1)}Tr/tháng`,
      targetDiscountPercent: Math.round((p2MonthlySaving / currentRent) * 100),
      monthlySavingVND: p2MonthlySaving,
      annualSavingVND: p2MonthlySaving * 12,
      landlordValueProposition: 'Chủ nhà không bị hạ giá niêm yết trên hợp đồng (giữ giá trị căn hộ) nhưng vẫn làm hài lòng khách.',
      recommendedCounterPriceVND: p2CounterPrice,
      proposedMessageToLandlord: `Chào anh/chị! Em đồng ý mức giá thuê niêm yết ${(currentRent / 1000000).toFixed(1)} triệu/tháng của anh/chị. Tuy nhiên để thuận tiện dọn vào sớm, nhờ anh/chị hỗ trợ miễn phí vé gửi xe ${unit.hasCarParking ? 'ô tô' : 'xe máy'} và phí quản lý tòa nhà trong năm đầu tiên giúp em nhé!`
    },
    {
      id: 'package_price_match',
      title: 'Gói 3: Đối Chiếu Giá Trung Bình Khu Vực (District Benchmark)',
      badge: `Giảm ${(p3MonthlySaving / 1000000).toFixed(1)}Tr/tháng`,
      targetDiscountPercent: Math.round((p3MonthlySaving / currentRent) * 100),
      monthlySavingVND: p3MonthlySaving,
      annualSavingVND: p3MonthlySaving * 12,
      landlordValueProposition: 'Đưa giá thuê về đúng mặt bằng chung thực tế để ký hợp đồng ngay trong 24 giờ.',
      recommendedCounterPriceVND: p3CounterPrice,
      proposedMessageToLandlord: `Dạ em chào anh/chị! Em đã tham khảo khảo sát thị trường tại khu vực ${unit.district}, mặt bằng chung các căn cùng diện tích hiện đang dao động quanh mức ${(districtMedianRentVND / 1000000).toFixed(1)} triệu/tháng. Em thiện chí muốn thuê nhanh, nếu anh/chị hỗ trợ giá ${(p3CounterPrice / 1000000).toFixed(1)} triệu/tháng thì em xin phép qua đặt cọc luôn trong hôm nay ạ!`
    }
  ];

  return {
    unit,
    districtMedianRentVND,
    unitPricePercentile,
    marketLeverage,
    leverageExplanation,
    packages
  };
}

/**
 * Autonomous AI-vs-Landlord Bargaining Execution:
 * Dispatches the counter-offer directly into the unit's chat thread in ApartmentStore.
 */
export function runAutoBargainingTurn(
  unit: ApartmentUnit,
  pkg: NegotiationPackage,
  tenantName: string = 'Khách Thuê HAVEN',
  tenantPhone: string = '0988 888 888'
): { success: boolean; conversationId: string; messageText: string; responseNotice: string } {
  const conv = ApartmentStore.getOrCreateConversation(
    unit.id,
    unit.name || unit.id,
    tenantName,
    tenantPhone
  );

  const sentMessage = ApartmentStore.sendMessage(
    conv.id,
    'user',
    tenantName,
    pkg.proposedMessageToLandlord
  );

  // Simulate landlord response if bot reply is enabled
  setTimeout(() => {
    const landlordName = unit.landlord?.name || 'Chủ Nhà HAVEN';
    let replyText = `Chào bạn! Cảm ơn bạn đã quan tâm. Mình ghi nhận thiện chí thuê dài hạn của bạn. Mình đồng ý chốt mức giá ${(pkg.recommendedCounterPriceVND / 1000000).toFixed(1)} triệu/tháng nhé! Bạn gửi CCCD để mình lên hợp đồng luôn nha.`;
    if (pkg.id === 'package_service_waiver') {
      replyText = `Chào bạn! Mình đồng ý giữ giá thuê và tặng bạn 01 suất gửi xe miễn phí suốt năm đầu tiên. Hẹn bạn chiều mai ký hợp đồng nhé!`;
    }
    ApartmentStore.sendMessage(conv.id, 'landlord', landlordName, replyText);
  }, 1200);

  return {
    success: true,
    conversationId: conv.id,
    messageText: sentMessage.text,
    responseNotice: `Đã tự động gửi lời đề nghị đàm phán "${pkg.title}" vào hộp thoại của Chủ nhà căn ${unit.id}.`
  };
}


// ============================================================================
// ENGINE 5: AI DYNAMIC PRICING & LANDLORD YIELD ROI OPTIMIZER (#16)
// ============================================================================

export interface CapExUpgradeRecommendation {
  id: string;
  title: string;
  estimatedCostVND: number;
  monthlyRentIncreaseVND: number;
  paybackPeriodMonths: number;
  occupancyBoostPercent: number;
  description: string;
}

export interface UnitPricingAndYieldOptimizationResult {
  unitId: string;
  currentRentVND: number;
  districtMedianVND: number;
  pricingDifferencePercent: number;

  fastOccupancyPriceVND: number; // 3-5 days
  optimalYieldPriceVND: number; // Best annual revenue curve
  premiumTargetPriceVND: number; // High-end staging

  currentAnnualRevenueVND: number;
  optimalAnnualRevenueVND: number;
  additionalAnnualYieldVND: number;

  capExUpgrades: CapExUpgradeRecommendation[];
}

/**
 * Optimize pricing curve and return CapEx micro-upgrade recommendations for landlords.
 */
export function optimizeUnitPricingAndYield(
  unit: ApartmentUnit,
  allUnitsPool?: ApartmentUnit[]
): UnitPricingAndYieldOptimizationResult {
  const all = allUnitsPool && allUnitsPool.length > 0 ? allUnitsPool : ApartmentStore.getUnits();
  const districtUnits = all.filter(u => u.district.toLowerCase() === unit.district.toLowerCase());
  const pool = districtUnits.length >= 3 ? districtUnits : all;

  const medianRent = Math.round(
    pool.reduce((sum, u) => sum + u.monthlyRentVND, 0) / pool.length
  );

  const currentRent = unit.monthlyRentVND;
  const diffPercent = Math.round(((currentRent - medianRent) / medianRent) * 100);

  // Fast occupancy: 6% below median / current
  const fastOccupancyPriceVND = Math.round((medianRent * 0.94) / 100000) * 100000;
  // Optimal yield: balancing occupancy probability (94%) with healthy margin
  const optimalYieldPriceVND = Math.round((Math.max(currentRent, medianRent * 1.05)) / 100000) * 100000;
  // Premium target: top 15% pricing
  const premiumTargetPriceVND = Math.round((medianRent * 1.18) / 100000) * 100000;

  const currentAnnualRevenueVND = currentRent * 12;
  const optimalAnnualRevenueVND = optimalYieldPriceVND * 12;
  const additionalAnnualYieldVND = Math.max(0, optimalAnnualRevenueVND - currentAnnualRevenueVND);

  // CapEx micro-upgrades
  const capExUpgrades: CapExUpgradeRecommendation[] = [
    {
      id: 'capex-smart-lock',
      title: 'Lắp Khóa Cửa Vân Tay & Mã Số Smart Lock 5 Trong 1',
      estimatedCostVND: 3500000,
      monthlyRentIncreaseVND: 500000,
      paybackPeriodMonths: 7.0,
      occupancyBoostPercent: 25,
      description: 'Giúp khách thuê tự do check-in không cần chìa khóa vật lý, tăng tính an ninh và hiện đại.'
    },
    {
      id: 'capex-pet-friendly',
      title: 'Trang Bị Lưới An Toàn Ban Công & Quy Chuẩn Pet-Friendly',
      estimatedCostVND: 2200000,
      monthlyRentIncreaseVND: 1000000,
      paybackPeriodMonths: 2.2,
      occupancyBoostPercent: 40,
      description: 'Nhu cầu thuê nhà nuôi chó mèo tại các đô thị tăng 300%. Cho phép thú cưng giúp lấp đầy phòng trong 48 giờ.'
    },
    {
      id: 'capex-backup-inverter',
      title: 'Bộ Lưu Điện Dự Phòng Inverter Khẩn Cấp (Wifi + Đèn Led)',
      estimatedCostVND: 6500000,
      monthlyRentIncreaseVND: 800000,
      paybackPeriodMonths: 8.1,
      occupancyBoostPercent: 30,
      description: 'Bảo đảm internet và ánh sáng không bao giờ gián đoạn cho khách làm việc từ xa (Work from Home).'
    },
    {
      id: 'capex-wfh-desk',
      title: 'Bàn Làm Việc Công Thái Học & Đường Truyền Cáp Quang 500Mbps',
      estimatedCostVND: 4000000,
      monthlyRentIncreaseVND: 700000,
      paybackPeriodMonths: 5.7,
      occupancyBoostPercent: 35,
      description: 'Thu hút trực tiếp nhóm khách chuyên gia công nghệ, lập trình viên và người nước ngoài expat.'
    }
  ];

  return {
    unitId: unit.id,
    currentRentVND: currentRent,
    districtMedianVND: medianRent,
    pricingDifferencePercent: diffPercent,
    fastOccupancyPriceVND,
    optimalYieldPriceVND,
    premiumTargetPriceVND,
    currentAnnualRevenueVND,
    optimalAnnualRevenueVND,
    additionalAnnualYieldVND,
    capExUpgrades
  };
}

/**
 * Apply the optimized price to ApartmentStore
 */
export function applyOptimizedPriceToUnit(unitId: string, newPriceVND: number): boolean {
  try {
    ApartmentStore.updateUnit(unitId, {
      monthlyRentVND: newPriceVND,
      monthlyRentUSD: Math.round(newPriceVND / 25400)
    });
    return true;
  } catch (err) {
    console.error('Failed to update unit rent price:', err);
    return false;
  }
}
