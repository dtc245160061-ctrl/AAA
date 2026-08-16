import { MOCK_UNITS } from './mockData';
import type { 
  ApartmentUnit, 
  RentalLead, 
  LeaseContract, 
  RentalInvoice, 
  UnitStatus,
  LeadStatus,
  ChatMessage,
  ChatConversation,
  SubscriptionPlan,
  SubscriptionTier,
  AddonService,
  ServiceOrder,
  NeighborhoodProfile,
  LegalDocumentItem,
  MarketplaceModerationItem,
  MarketplaceHealthKPIs,
  CommuteDestination,
  CommuteEstimate
} from '../types/apartment';

// Initial Mock Leads
const INITIAL_LEADS: RentalLead[] = [
  {
    id: 'LEAD-2026-001',
    customerName: 'Hoàng Minh Tuấn',
    phone: '0912 345 678',
    email: 'tuan.hoang@investcorp.vn',
    unitId: 'HN-TH-2401',
    unitName: 'Penthouse Hồ Tây Panorama & Sân Vườn Sinh Thái',
    unitPriceVND: 350000000,
    desiredMoveInDate: '2026-09-01',
    viewingDate: '2026-08-18 15:00',
    notes: 'Cần xem thực tế hướng ban công hoàng hôn và kiểm tra chỗ sạc xe điện EV dưới hầm.',
    createdAt: '2026-08-14 09:30',
    status: 'new'
  },
  {
    id: 'LEAD-2026-002',
    customerName: 'Elena Rostova',
    phone: '0988 234 567',
    email: 'elena.rostova@techglobal.io',
    unitId: 'SG-D1-1601',
    unitName: 'Sky Villa Bến Bạch Đằng Duplex Cao Cấp',
    unitPriceVND: 420000000,
    desiredMoveInDate: '2026-08-25',
    viewingDate: '2026-08-17 10:00',
    notes: 'Khách chuyên gia nước ngoài, yêu cầu hợp đồng song ngữ Anh - Việt và hỗ trợ hóa đơn đỏ VAT.',
    createdAt: '2026-08-15 14:15',
    status: 'viewing_scheduled'
  },
  {
    id: 'LEAD-2026-003',
    customerName: 'Trần Đình Trọng',
    phone: '0903 888 999',
    unitId: 'DN-HC-1202',
    unitName: 'Deluxe Residence Sông Hàn Ban Công Kính',
    unitPriceVND: 45000000,
    desiredMoveInDate: '2026-09-15',
    notes: 'Tìm căn hộ yên tĩnh để làm việc từ xa kết hợp nghỉ dưỡng dài hạn.',
    createdAt: '2026-08-16 08:20',
    status: 'contacted'
  }
];

// Initial Mock Contracts
const INITIAL_CONTRACTS: LeaseContract[] = [
  {
    id: 'CTR-2026-088',
    contractNumber: 'HDT-2026/SG-D1-1601',
    unitId: 'SG-D1-1601',
    unitName: 'Sky Villa Bến Bạch Đằng Duplex Cao Cấp',
    tenantName: 'Nguyễn Thành Nam',
    tenantPhone: '0909 123 456',
    tenantIdCard: '079085001234',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    monthlyRentVND: 420000000,
    depositVND: 840000000,
    paymentCycleMonths: 3,
    status: 'active',
    termsSummary: 'Hợp đồng thuê 1 năm, cọc 2 tháng, thanh toán 3 tháng/lần vào ngày 01 của quý.',
    createdAt: '2025-12-20',
    platformCommissionVND: 420000000
  },
  {
    id: 'CTR-2026-089',
    contractNumber: 'HDT-2025/HN-CG-1402',
    unitId: 'HN-CG-1402',
    unitName: 'Executive Suite Cầu Giấy Smart Living',
    tenantName: 'Phạm Thu Trang',
    tenantPhone: '0934 567 890',
    tenantIdCard: '001192004321',
    startDate: '2025-09-01',
    endDate: '2026-08-31',
    monthlyRentVND: 65000000,
    depositVND: 130000000,
    paymentCycleMonths: 1,
    status: 'expiring_soon',
    termsSummary: 'Hợp đồng sắp hết hạn trong tháng 8. Cần liên hệ gia hạn trước 15 ngày.',
    createdAt: '2025-08-25',
    platformCommissionVND: 65000000
  }
];

// Initial Invoices
const INITIAL_INVOICES: RentalInvoice[] = [
  {
    id: 'INV-2026-08-01',
    invoiceCode: 'HD-202608-01',
    unitId: 'SG-D1-1601',
    unitName: 'Sky Villa Bến Bạch Đằng Duplex',
    tenantName: 'Nguyễn Thành Nam',
    monthYear: '08/2026',
    rentAmountVND: 420000000,
    serviceFeeVND: 15000000,
    electricityWaterVND: 8500000,
    totalAmountVND: 443500000,
    dueDate: '2026-08-05',
    paidDate: '2026-08-03',
    status: 'paid',
    platformTakeRateVND: 22175000 // 5%
  },
  {
    id: 'INV-2026-08-02',
    invoiceCode: 'HD-202608-02',
    unitId: 'HN-CG-1402',
    unitName: 'Executive Suite Cầu Giấy',
    tenantName: 'Phạm Thu Trang',
    monthYear: '08/2026',
    rentAmountVND: 65000000,
    serviceFeeVND: 3500000,
    electricityWaterVND: 2800000,
    totalAmountVND: 71300000,
    dueDate: '2026-08-10',
    paidDate: '2026-08-08',
    status: 'paid',
    platformTakeRateVND: 3565000
  },
  {
    id: 'INV-2026-08-03',
    invoiceCode: 'HD-202608-03',
    unitId: 'DN-HC-1202',
    unitName: 'Deluxe Residence Sông Hàn',
    tenantName: 'Vũ Đức Đam',
    monthYear: '08/2026',
    rentAmountVND: 45000000,
    serviceFeeVND: 2500000,
    electricityWaterVND: 1900000,
    totalAmountVND: 49400000,
    dueDate: '2026-08-15',
    status: 'pending',
    platformTakeRateVND: 2470000
  }
];

// Initial Chat Conversations (Shopee Style)
const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-hn-th-2401-1',
    unitId: 'HN-TH-2401',
    unitName: 'Penthouse Hồ Tây Panorama & Sân Vườn',
    customerName: 'Trần Hải Đăng',
    customerPhone: '0988 776 655',
    lastMessage: 'Căn này có chỗ đỗ ô tô dưới hầm không ban quản lý?',
    lastTimestamp: '10:45 Hôm nay',
    unreadCount: 1,
    status: 'active',
    messages: [
      {
        id: 'm-1',
        conversationId: 'conv-hn-th-2401-1',
        sender: 'bot',
        senderName: 'HAVEN Assistant Bot',
        text: 'Chào bạn Trần Hải Đăng! Cảm ơn bạn đã quan tâm căn Penthouse Hồ Tây Panorama. Căn hộ hiện đang TRỐNG và sẵn sàng dọn vào ngay. Bạn có thể chọn xem nhà trực tiếp hoặc gửi câu hỏi tại đây.',
        timestamp: '10:42',
        isQuickReply: true
      },
      {
        id: 'm-2',
        conversationId: 'conv-hn-th-2401-1',
        sender: 'user',
        senderName: 'Trần Hải Đăng',
        text: 'Căn này có chỗ đỗ ô tô dưới hầm không ban quản lý?',
        timestamp: '10:45'
      }
    ]
  },
  {
    id: 'conv-sg-d1-1601-2',
    unitId: 'SG-D1-1601',
    unitName: 'Sky Villa Bến Bạch Đằng Duplex',
    customerName: 'Lê Minh Quân',
    customerPhone: '0918 999 111',
    lastMessage: 'Đã hẹn xem nhà vào 15:00 chiều Thứ Bảy nhé.',
    lastTimestamp: 'Hôm qua',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'm-3',
        conversationId: 'conv-sg-d1-1601-2',
        sender: 'bot',
        senderName: 'HAVEN Assistant Bot',
        text: 'Chào mừng quý khách đến với Sky Villa Bến Bạch Đằng! Bạn có cần hỗ trợ thông tin gì về hợp đồng hoặc chi phí dịch vụ không?',
        timestamp: '14:20',
        isQuickReply: true
      },
      {
        id: 'm-4',
        conversationId: 'conv-sg-d1-1601-2',
        sender: 'user',
        senderName: 'Lê Minh Quân',
        text: 'Mình muốn xem nhà cuối tuần này được không?',
        timestamp: '14:22'
      },
      {
        id: 'm-5',
        conversationId: 'conv-sg-d1-1601-2',
        sender: 'landlord',
        senderName: 'Ban Quản Lý HAVEN',
        text: 'Dạ được ạ! Đã hẹn xem nhà vào 15:00 chiều Thứ Bảy nhé anh Quân.',
        timestamp: '14:25'
      }
    ]
  }
];

// Subscription Plans (SaaS Pricing Matrix)
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    targetAudience: 'landlord',
    name: 'Gói Cơ Bản (Starter)',
    tagline: 'Dành cho chủ nhà cá nhân quản lý từ 1 - 5 căn hộ',
    priceVND: 0,
    billingCycle: 'monthly',
    features: [
      'Quản lý tối đa 5 căn hộ',
      'Tạo và lưu trữ hợp đồng thuê cơ bản',
      'Nhận thông báo đặt lịch xem phòng qua Web',
      'Phí hoa hồng chốt cọc tiêu chuẩn: 100% tháng đầu',
      'Hỗ trợ qua email trong 48 giờ'
    ],
    badge: 'Miễn Phí'
  },
  {
    id: 'pro',
    targetAudience: 'landlord',
    name: 'HAVEN Pro (Chuyên Nghiệp)',
    tagline: 'Tự động hóa quản trị, nhắc nợ Zalo & ưu tiên tìm khách',
    priceVND: 499000,
    billingCycle: 'monthly',
    isPopular: true,
    features: [
      'Quản lý không giới hạn số lượng căn hộ',
      'Tự động tính điện nước & gửi hóa đơn qua Zalo/SMS',
      'Giảm 50% phí hoa hồng sàn (chỉ còn 0.5 tháng tiền nhà)',
      'Gắn huy hiệu Verified Sanctuary tăng 300% lượt click',
      'Hộp thư Chat Shopee-style trả lời tự động cho khách',
      'Hỗ trợ kỹ thuật 24/7 qua Hotline VIP'
    ],
    badge: 'Khuyên Dùng'
  },
  {
    id: 'enterprise',
    targetAudience: 'landlord',
    name: 'HAVEN Enterprise (Trọn Gói)',
    tagline: 'Ủy thác vận hành toàn diện & cam kết tỷ lệ lấp đầy >92%',
    priceVND: 1999000,
    billingCycle: 'monthly',
    features: [
      'Bao gồm toàn bộ tính năng của HAVEN Pro',
      'Chuyên viên HAVEN trực tiếp dẫn khách xem nhà 24/7',
      'AI Dynamic Pricing tối ưu giá thuê theo mùa',
      'Bảo hiểm nội thất & bảo trì định kỳ trọn gói',
      'Cam kết bù doanh thu nếu tỷ lệ lấp đầy < 90%',
      'Báo cáo kiểm toán dòng tiền hàng quý'
    ],
    badge: 'Doanh Nghiệp'
  },
  {
    id: 'resident_prime',
    targetAudience: 'tenant',
    name: 'HAVEN Resident Prime',
    tagline: 'Đặc quyền phong cách sống thượng lưu cho khách thuê',
    priceVND: 99000,
    billingCycle: 'monthly',
    features: [
      'Thuê nhà 0đ Tiền Cọc (Bảo lãnh cọc ngân hàng)',
      'Tặng 02 buổi dọn dẹp buồng phòng miễn phí mỗi tháng',
      'Ưu tiên xử lý sự cố bảo trì trong 2 giờ',
      'Giảm 25% phí dịch vụ chuyển nhà HAVEN Move',
      'Thẻ ra vào tích hợp Smart App mở khóa không chạm'
    ],
    badge: 'Dành Cho Cư Dân'
  }
];

// Add-on Services (VAS Marketplace)
export const ADDON_SERVICES: AddonService[] = [
  {
    id: 'vas-clean-hourly',
    title: 'Dọn Dẹp Vệ Sinh Buồng Phòng Theo Giờ',
    category: 'cleaning',
    description: 'Nhân viên chuyên nghiệp dọn dẹp, lau sàn, thay ga giường và hút bụi sofa.',
    priceVND: 120000,
    unitLabel: 'buổi / 2 giờ',
    duration: '2 giờ',
    iconName: 'Sparkles',
    popular: true
  },
  {
    id: 'vas-clean-deep',
    title: 'Tổng Vệ Sinh & Khử Khuẩn Khi Dọn Vào/Ra',
    category: 'cleaning',
    description: 'Vệ sinh chuyên sâu toàn bộ căn hộ, xịt khử khuẩn không khí, đánh bóng kính ban công.',
    priceVND: 650000,
    unitLabel: 'lần trọn gói',
    duration: '4-6 giờ',
    iconName: 'ShieldCheck'
  },
  {
    id: 'vas-move-truck',
    title: 'Dịch Vụ Chuyển Nhà Trọn Gói HAVEN Move',
    category: 'moving',
    description: 'Xe tải chuyên dụng 1.5 tấn kèm 2 nhân công bọc lót chống sốc và vận chuyển lên tận phòng.',
    priceVND: 1200000,
    unitLabel: 'chuyến',
    duration: 'Nửa ngày',
    iconName: 'Truck',
    popular: true
  },
  {
    id: 'vas-smart-lock',
    title: 'Lắp Đặt Khóa Cửa Thông Minh Vân Tay & FaceID',
    category: 'smart_home',
    description: 'Khóa cửa bảo mật cao cấp tích hợp ứng dụng mở khóa từ xa và cấp mã OTP cho khách.',
    priceVND: 2800000,
    unitLabel: 'bộ + công lắp',
    iconName: 'KeyRound'
  },
  {
    id: 'vas-insurance',
    title: 'Bảo Hiểm Nhà Ở & Trách Nhiệm Dân Sự Toàn Diện',
    category: 'insurance',
    description: 'Bảo vệ tài sản, phòng chống cháy nổ và đền bù thiệt hại rò rỉ nước lên tới 500 triệu.',
    priceVND: 450000,
    unitLabel: 'năm',
    iconName: 'Shield'
  }
];

const STORAGE_KEYS = {
  UNITS: 'haven_units_data_v3',
  LEADS: 'haven_rental_leads_v3',
  CONTRACTS: 'haven_lease_contracts_v3',
  INVOICES: 'haven_rental_invoices_v3',
  SAVED: 'haven_saved_unit_ids_v3',
  CONVERSATIONS: 'haven_chat_conversations_v3',
  ACTIVE_SUBSCRIPTION: 'haven_active_subscription_v3',
  SERVICE_ORDERS: 'haven_service_orders_v3',
  DOCUMENTS: 'haven_documents_v3'
};

export function enrichUnit(unit: ApartmentUnit): ApartmentUnit {
  const baseRent = unit.monthlyRentVND || 15000000;
  const bedrooms = unit.bedrooms || 2;
  const sqm = unit.sqm || 80;
  const isHighEnd = baseRent >= 25000000 || unit.floor >= 15;

  const estimatedElectricity = unit.trueCost?.estimatedElectricityVND ?? (
    bedrooms === 1 ? 550000 : bedrooms === 2 ? 850000 : bedrooms === 3 ? 1450000 : 2500000
  );
  const waterFee = unit.trueCost?.waterFeeVND ?? (bedrooms * 70000);
  const internetFee = unit.trueCost?.internetFeeVND ?? 250000;
  const managementFee = unit.trueCost?.managementFeeVND ?? Math.round(sqm * (isHighEnd ? 22000 : 16000));
  const parkingFee = unit.trueCost?.parkingFeeVND ?? (unit.hasCarParking ? 1200000 : 120000);
  const depositMonths = unit.trueCost?.depositMonths ?? (baseRent > 30000000 ? 2 : 1);
  const depositVND = baseRent * depositMonths;
  const totalMonthlyEstimated = baseRent + estimatedElectricity + waterFee + internetFee + managementFee + parkingFee;
  const moveInTotalRequired = totalMonthlyEstimated + depositVND;

  const trueCost = unit.trueCost || {
    baseRentVND: baseRent,
    estimatedElectricityVND: estimatedElectricity,
    waterFeeVND: waterFee,
    internetFeeVND: internetFee,
    managementFeeVND: managementFee,
    parkingFeeVND: parkingFee,
    totalMonthlyEstimatedVND: totalMonthlyEstimated,
    depositMonths: depositMonths,
    depositVND: depositVND,
    moveInTotalRequiredVND: moveInTotalRequired,
    electricityRatePerKwh: 3500
  };

  const pcccReport = unit.pcccReport || {
    hasFireEscapes: true,
    fireEscapeCount: unit.floor > 15 ? 3 : 2,
    hasAutomaticSprinklers: isHighEnd,
    hasSmokeDetectors: true,
    hasFireExtinguishers: true,
    inspectionCertificateStatus: isHighEnd ? ('certified' as const) : ('pending_renewal' as const),
    lastInspectionDate: '2025-11-15',
    emergencyExitWidthMeters: 1.4,
    disclaimer: 'Dữ liệu tham chiếu hồ sơ nghiệm thu PCCC tòa nhà. Khuyến nghị kiểm tra thực tế khi xem phòng.'
  };

  const verificationLevel = unit.verificationLevel || (
    unit.isVerifiedPlus ? 'full_ownership_verified' as const : (baseRent > 20000000 ? 'full_ownership_verified' as const : 'id_verified' as const)
  );

  const landlord = unit.landlord || {
    id: `host-${unit.district ? unit.district.replace(/\s+/g, '').toLowerCase() : 'haven'}`,
    name: unit.city === 'Hanoi' ? 'Nguyễn Văn Minh' : unit.city === 'Ho Chi Minh City' ? 'Lê Hoàng Sơn' : 'Phạm Đức Anh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    phone: '0909 888 777',
    verificationLevel: verificationLevel,
    trustScore: unit.rating ? Number(Math.min(5, Math.max(3.8, unit.rating)).toFixed(1)) : 4.8,
    reviewCount: unit.reviewCount || 18,
    responseRatePercent: 98,
    averageResponseMinutes: 15,
    activeListingsCount: 4,
    joinedDate: 'Tháng 03/2024',
    isSuperHost: true,
    badges: ['Chủ nhà uy tín', 'Phản hồi trong 15p', 'Xác minh Sổ đỏ']
  };

  const depositTerms = unit.depositTerms || {
    months: depositMonths,
    amountVND: depositVND,
    refundTimelineDays: 3,
    deductionRules: [
      'Hoàn 100% nếu thông báo trước 30 ngày kết thúc hợp đồng',
      'Trừ chi phí sửa chữa hỏng hóc nếu có theo biên bản bàn giao ban đầu',
      'Hoàn tiền qua chuyển khoản trong vòng 72 giờ sau khi trả phòng'
    ],
    depositProtectionActive: true
  };

  return {
    ...unit,
    trueCost,
    pcccReport,
    landlord,
    depositTerms,
    verificationLevel
  };
}

export class ApartmentStore {
  // Units
  static getUnits(): ApartmentUnit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNITS);
      if (data) {
        const parsed: ApartmentUnit[] = JSON.parse(data);
        return parsed.map(enrichUnit);
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_UNITS.map(enrichUnit);
  }

  static saveUnits(units: ApartmentUnit[]) {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }

  static addUnit(unitData: Omit<ApartmentUnit, 'id'> & { id?: string }): ApartmentUnit {
    const units = this.getUnits();
    const newId = unitData.id || `UNIT-${Date.now().toString().slice(-4)}`;
    const newUnit: ApartmentUnit = enrichUnit({
      ...unitData,
      id: newId
    } as ApartmentUnit);
    units.unshift(newUnit);
    this.saveUnits(units);
    return newUnit;
  }

  static updateUnitStatus(unitId: string, status: UnitStatus) {
    const units = this.getUnits();
    const idx = units.findIndex(u => u.id === unitId);
    if (idx !== -1) {
      units[idx].status = status;
      this.saveUnits(units);
    }
  }

  // Leads
  static getLeads(): RentalLead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LEADS;
  }

  static saveLeads(leads: RentalLead[]) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }

  static addLead(lead: Omit<RentalLead, 'id' | 'createdAt' | 'status'>): RentalLead {
    const leads = this.getLeads();
    const newLead: RentalLead = {
      ...lead,
      id: `LEAD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new'
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadStatus) {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      leads[idx].status = status;
      this.saveLeads(leads);
    }
  }

  // Contracts
  static getContracts(): LeaseContract[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONTRACTS;
  }

  static saveContracts(contracts: LeaseContract[]) {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  }

  static addContract(contract: Omit<LeaseContract, 'id' | 'createdAt'>): LeaseContract {
    const contracts = this.getContracts();
    const commission = contract.monthlyRentVND; // Standard 1 month commission
    const newContract: LeaseContract = {
      ...contract,
      id: `CTR-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      platformCommissionVND: commission
    };
    contracts.unshift(newContract);
    this.saveContracts(contracts);

    // Automatically flip unit status to occupied
    this.updateUnitStatus(contract.unitId, 'occupied');
    return newContract;
  }

  // Invoices
  static getInvoices(): RentalInvoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVOICES;
  }

  static saveInvoices(invoices: RentalInvoice[]) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  static markInvoicePaid(id: string) {
    const invoices = this.getInvoices();
    const idx = invoices.findIndex(i => i.id === id);
    if (idx !== -1) {
      invoices[idx].status = 'paid';
      invoices[idx].paidDate = new Date().toISOString().split('T')[0];
      invoices[idx].platformTakeRateVND = Math.round(invoices[idx].totalAmountVND * 0.05); // 5% SaaS take rate
      this.saveInvoices(invoices);
    }
  }

  // Chat Conversations & Messages (Shopee-Style)
  static getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONVERSATIONS;
  }

  static saveConversations(convs: ChatConversation[]) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
  }

  static getOrCreateConversation(unitId: string, unitName: string, customerName: string, customerPhone: string): ChatConversation {
    const convs = this.getConversations();
    let conv = convs.find(c => c.unitId === unitId && c.customerPhone === customerPhone);
    
    if (!conv) {
      conv = {
        id: `conv-${unitId}-${Date.now().toString().slice(-4)}`,
        unitId,
        unitName,
        customerName: customerName || 'Khách Thuê HAVEN',
        customerPhone: customerPhone || '0988 888 888',
        lastMessage: 'Đã bắt đầu cuộc trò chuyện',
        lastTimestamp: 'Vừa xong',
        unreadCount: 0,
        status: 'active',
        messages: [
          {
            id: `msg-${Date.now()}-bot`,
            conversationId: `conv-${unitId}`,
            sender: 'bot',
            senderName: 'Trợ Lý Tự Động HAVEN',
            text: `Chào bạn! Mình là Trợ lý phụ trách căn ${unitName}. Căn này hiện đang sẵn sàng dọn vào. Bạn có muốn đặt lịch xem nhà trực tiếp không?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isQuickReply: true
          }
        ]
      };
      convs.unshift(conv);
      this.saveConversations(convs);
    }
    return conv;
  }

  static sendMessage(conversationId: string, sender: 'user' | 'landlord', senderName: string, text: string): ChatMessage {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessage = text;
      conv.lastTimestamp = 'Vừa xong';
      if (sender === 'user') {
        conv.unreadCount += 1;
      }
      this.saveConversations(convs);
    }
    return newMsg;
  }

  // Active Subscription
  static getActiveSubscription(): SubscriptionTier {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SUBSCRIPTION);
      if (data) return data as SubscriptionTier;
    } catch (e) {
      console.error(e);
    }
    return 'pro'; // Default Pro for rich demo
  }

  static setSubscription(tier: SubscriptionTier) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SUBSCRIPTION, tier);
  }

  // Service Orders (VAS)
  static getServiceOrders(): ServiceOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICE_ORDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ORD-VAS-01',
        serviceId: 'vas-clean-hourly',
        serviceTitle: 'Dọn Dẹp Vệ Sinh Buồng Phòng Theo Giờ',
        customerName: 'Nguyễn Thành Nam',
        customerPhone: '0909 123 456',
        unitId: 'SG-D1-1601',
        scheduledDate: '2026-08-20 09:00',
        priceVND: 120000,
        status: 'confirmed',
        createdAt: '2026-08-15'
      },
      {
        id: 'ORD-VAS-02',
        serviceId: 'vas-move-truck',
        serviceTitle: 'Dịch Vụ Chuyển Nhà Trọn Gói HAVEN Move',
        customerName: 'Hoàng Minh Tuấn',
        customerPhone: '0912 345 678',
        unitId: 'HN-TH-2401',
        scheduledDate: '2026-09-01 08:00',
        priceVND: 1200000,
        status: 'pending',
        createdAt: '2026-08-16'
      }
    ];
  }

  static addServiceOrder(order: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>): ServiceOrder {
    const orders = this.getServiceOrders();
    const newOrder: ServiceOrder = {
      ...order,
      id: `ORD-VAS-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.SERVICE_ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  // Saved Unit IDs
  static getSavedUnitIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return ['HN-TH-2401', 'SG-D1-1601'];
  }

  static saveSavedUnitIds(ids: string[]) {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(ids));
  }

  // Legal Documents Vault
  static getLegalDocuments(): LegalDocumentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS || 'haven_documents_v3');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'DOC-2026-001',
        title: 'Hợp Đồng Thuê Nhà Điện Tử (E-Signed)',
        category: 'contract',
        unitId: 'HN-TH-2401',
        unitName: 'Penthouse Hồ Tây Panorama',
        fileSizeKb: 840,
        uploadedAt: '2026-08-14',
        verified: true,
        hashSignature: 'HAVEN-ESIGN-SHA256-78AF81B92C',
        downloadUrl: '#'
      },
      {
        id: 'DOC-2026-002',
        title: 'Biên Nhận Ký Quỹ Cọc Bảo Chứng (HAVEN Escrow)',
        category: 'deposit_escrow',
        unitId: 'SG-D1-1601',
        unitName: 'Sky Villa Bến Bạch Đằng',
        fileSizeKb: 420,
        uploadedAt: '2026-08-15',
        verified: true,
        hashSignature: 'HAVEN-ESCROW-SHA256-43DE29FA11',
        downloadUrl: '#'
      },
      {
        id: 'DOC-2026-003',
        title: 'Giấy Chứng Nhận Thẩm Duyệt & Nghiệm Thu PCCC Tòa Nhà',
        category: 'pccc_cert',
        unitId: 'HN-TH-2401',
        unitName: 'Penthouse Hồ Tây Panorama',
        fileSizeKb: 1250,
        uploadedAt: '2025-11-20',
        verified: true,
        hashSignature: 'CUC-PCCC-QCVN06-2022-HN098',
        downloadUrl: '#'
      },
      {
        id: 'DOC-2026-004',
        title: 'Biên Bản Bàn Giao Hiện Trạng 15 Hạng Mục Kèm Ảnh',
        category: 'handover_report',
        unitId: 'SG-D1-1601',
        unitName: 'Sky Villa Bến Bạch Đằng',
        fileSizeKb: 3400,
        uploadedAt: '2026-08-16',
        verified: true,
        hashSignature: 'BB-HAVEN-HANDOVER-2026-9912',
        downloadUrl: '#'
      }
    ];
  }

  static addLegalDocument(doc: Omit<LegalDocumentItem, 'id' | 'uploadedAt' | 'hashSignature'>): LegalDocumentItem {
    const docs = this.getLegalDocuments();
    const newDoc: LegalDocumentItem = {
      ...doc,
      id: `DOC-2026-${Date.now().toString().slice(-4)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      hashSignature: `HAVEN-HASH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    docs.unshift(newDoc);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS || 'haven_documents_v3', JSON.stringify(docs));
    return newDoc;
  }

  // Neighborhood Profiles (Cẩm nang khu vực)
  static getNeighborhoods(): NeighborhoodProfile[] {
    return [
      {
        id: 'nh-q1',
        name: 'Quận 1 — Trái Tim Tài Chính & Đô Thị Sôi Động',
        city: 'Ho Chi Minh City',
        district: 'Quận 1',
        averageRentVND: 28000000,
        priceTrendPercent: 5.2,
        securityScore: 9.5,
        floodRiskLevel: 'Low',
        lifestyleTags: ['Expat', 'Trung tâm', 'Ẩm thực', 'Cao cấp'],
        schoolsCount: 18,
        hospitalsCount: 6,
        metroDistanceKm: 0.2,
        description: 'Tập trung các tòa tháp văn phòng hạng A, lãnh sự quán, nhà hàng Michelin và tuyến Metro số 1 Bến Thành - Suối Tiên.',
        coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
        highlights: ['Gần phố đi bộ Nguyễn Huệ & Bến Bạch Đằng', 'An ninh 24/7 với camera AI toàn quận', 'Địa hình cao ráo, hệ thống thoát nước hoàn chỉnh']
      },
      {
        id: 'nh-q7',
        name: 'Quận 7 (Phú Mỹ Hưng) — Đô Thị Xanh & Giáo Dục Quốc Tế',
        city: 'Ho Chi Minh City',
        district: 'Quận 7',
        averageRentVND: 18500000,
        priceTrendPercent: 3.8,
        securityScore: 9.8,
        floodRiskLevel: 'Medium',
        lifestyleTags: ['Gia đình', 'Trường quốc tế', 'Yên tĩnh', 'Không khí sạch'],
        schoolsCount: 24,
        hospitalsCount: 4,
        description: 'Quy hoạch chuẩn quốc tế với mật độ cây xanh cao, tập trung các trường quốc tế (SSIS, CIS, VFIS) và bệnh viện FV, Tâm Đức.',
        coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
        highlights: ['Môi trường lý tưởng cho gia đình có con nhỏ', 'Đường rộng có làn xe đạp và công viên ven sông', 'Lưu ý triều cường ở các tuyến đường Huỳnh Tấn Phát']
      },
      {
        id: 'nh-thuduc',
        name: 'TP. Thủ Đức (Thảo Điền & An Phú) — Phong Cách Sống Đa Văn Hóa',
        city: 'Ho Chi Minh City',
        district: 'Thành phố Thủ Đức',
        averageRentVND: 22000000,
        priceTrendPercent: 6.0,
        securityScore: 9.1,
        floodRiskLevel: 'Medium',
        lifestyleTags: ['Expat', 'Nghệ thuật', 'Nhà hàng ven sông', 'Villa'],
        schoolsCount: 15,
        hospitalsCount: 3,
        metroDistanceKm: 0.5,
        description: 'Khu phố biệt thự và căn hộ cao cấp ven sông Sài Gòn, tập trung cộng đồng chuyên gia quốc tế và các quán cà phê boutique.',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        highlights: ['Nối liền Quận 1 qua cầu Ba Son trong 8 phút', 'Tuyến Metro số 1 trạm Thảo Điền', 'Nhiều không gian sáng tạo và ẩm thực Âu - Á']
      },
      {
        id: 'nh-tayho',
        name: 'Quận Tây Hồ — Không Gian Hồ Nước & Khí Hậu Trong Lành',
        city: 'Hanoi',
        district: 'Quận Tây Hồ',
        averageRentVND: 24000000,
        priceTrendPercent: 4.0,
        securityScore: 9.6,
        floodRiskLevel: 'Low',
        lifestyleTags: ['Expat', 'View hồ', 'Yên tĩnh', 'Cà phê'],
        schoolsCount: 12,
        hospitalsCount: 3,
        description: 'Vùng đệm sinh thái tuyệt đẹp ôm trọn Hồ Tây 500ha, không khí mát mẻ quanh năm và tập trung các căn hộ phong cách resort.',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        highlights: ['Không khí trong lành nhất nội thành Hà Nội', 'Mật độ xây dựng thoáng đãng, nhiều cây xanh', 'Hệ thống căn hộ dịch vụ cao cấp có bể bơi 4 mùa']
      },
      {
        id: 'nh-caugiay',
        name: 'Quận Cầu Giấy — Trung Tâm Công Nghệ & Giáo Dục Đại Học',
        city: 'Hanoi',
        district: 'Quận Cầu Giấy',
        averageRentVND: 15000000,
        priceTrendPercent: 4.8,
        securityScore: 9.0,
        floodRiskLevel: 'Low',
        lifestyleTags: ['Văn phòng IT', 'Đại học', 'Gia đình trẻ'],
        schoolsCount: 32,
        hospitalsCount: 5,
        metroDistanceKm: 0.3,
        description: 'Thủ phủ công nghệ của Hà Nội với cụm Duy Tân - Tôn Thất Thuyết, tập trung hàng chục trường đại học danh tiếng.',
        coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
        highlights: ['Gần trụ sở các tập đoàn công nghệ FPT, Viettel, CMC', 'Tuyến đường sắt đô thị Nhổn - Ga Hà Nội', 'Hạ tầng dịch vụ ăn uống và mua sắm phong phú 24/7']
      },
      {
        id: 'nh-haichau',
        name: 'Quận Hải Châu — Đô Thị Biển Đáng Sống Bên Sông Hàn',
        city: 'Da Nang',
        district: 'Quận Hải Châu',
        averageRentVND: 12000000,
        priceTrendPercent: 3.2,
        securityScore: 9.7,
        floodRiskLevel: 'Low',
        lifestyleTags: ['Ven sông Hàn', 'Du lịch', 'Ẩm thực biển', 'Thư thái'],
        schoolsCount: 14,
        hospitalsCount: 4,
        description: 'Trung tâm hành chính và tài chính Đà Nẵng, trải dài dọc bờ Tây sông Hàn với các cây cầu biểu tượng Rồng, Trần Thị Lý.',
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        highlights: ['Thành phố sạch đẹp và an ninh hàng đầu Việt Nam', 'Chỉ 7 phút ra bãi biển Mỹ Khê', 'Chi phí sinh hoạt hợp lý, tiện ích đầy đủ']
      }
    ];
  }

  // Commute Destinations Simulator
  static getCommuteDestinations(city: string): CommuteDestination[] {
    if (city === 'Hanoi') {
      return [
        { id: 'hn-hoankiem', name: 'Hồ Hoàn Kiếm & Trung Tâm Hoàn Kiếm', city: 'Hanoi', address: 'Hoàn Kiếm, Hà Nội', category: 'landmark' },
        { id: 'hn-keangnam', name: 'Keangnam Landmark 72 (Khu IT Cầu Giấy)', city: 'Hanoi', address: 'Phạm Hùng, Cầu Giấy', category: 'office' },
        { id: 'hn-lotte', name: 'Lotte Center Ba Đình (Khu Ngoại Giao)', city: 'Hanoi', address: 'Liễu Giai, Ba Đình', category: 'office' },
        { id: 'hn-noi-bai', name: 'Sân Bay Quốc Tế Nội Bài', city: 'Hanoi', address: 'Sóc Sơn, Hà Nội', category: 'airport' },
        { id: 'hn-bach-khoa', name: 'Cụm Đại Học Bách Khoa - Xây Dựng - KTQD', city: 'Hanoi', address: 'Hai Bà Trưng, Hà Nội', category: 'university' }
      ];
    }
    return [
      { id: 'hcm-bitexco', name: 'Saigon Centre & Bitexco Financial Tower', city: 'Ho Chi Minh City', address: 'Quận 1, TP.HCM', category: 'office' },
      { id: 'hcm-thao-dien', name: 'Khu Thảo Điền & Trường Quốc Tế BIS', city: 'Ho Chi Minh City', address: 'Thủ Đức, TP.HCM', category: 'university' },
      { id: 'hcm-fpt-park', name: 'Khu Công Nghệ Cao TP.HCM (SHTP)', city: 'Ho Chi Minh City', address: 'Thủ Đức, TP.HCM', category: 'office' },
      { id: 'hcm-tan-son-nhat', name: 'Sân Bay Quốc Tế Tân Sơn Nhất', city: 'Ho Chi Minh City', address: 'Tân Bình, TP.HCM', category: 'airport' },
      { id: 'hcm-phu-my-hung', name: 'Trung Tâm Phú Mỹ Hưng & Crescent Mall', city: 'Ho Chi Minh City', address: 'Quận 7, TP.HCM', category: 'landmark' }
    ];
  }

  static calculateCommute(unit: ApartmentUnit, destId: string): CommuteEstimate {
    // Generate realistic travel times based on city and district
    const isSameDistrict = unit.district.toLowerCase().includes('1') || unit.district.toLowerCase().includes('tây hồ');
    const baseDist = isSameDistrict ? 3.5 : 8.5;
    
    return {
      destinationId: destId,
      destinationName: destId.includes('bitexco') ? 'Saigon Centre (Quận 1)' : destId.includes('hoankiem') ? 'Hồ Hoàn Kiếm' : 'Trung Tâm Thành Phố',
      distanceKm: baseDist,
      motorbikeNormalMins: Math.round(baseDist * 2.2),
      motorbikePeakMins: Math.round(baseDist * 4.2),
      carNormalMins: Math.round(baseDist * 2.8),
      carPeakMins: Math.round(baseDist * 5.8),
      busLine: 'Tuyến số 03 / Tuyến Metro Bến Thành'
    };
  }

  // Marketplace Moderation Queue & Health KPIs (SF12 / G1 / G6)
  static getModerationQueue(): MarketplaceModerationItem[] {
    try {
      const data = localStorage.getItem('haven_moderation_queue_v3');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'MOD-2026-101',
        unitId: 'SG-D1-1601',
        unitName: 'Sky Villa Bến Bạch Đằng Duplex',
        landlordName: 'Lê Hoàng Sơn',
        landlordPhone: '0909 888 777',
        submittedAt: '2026-08-16 08:30',
        status: 'approved',
        priceAnomalyPercent: 0,
        duplicateScorePercent: 4,
        autoCheckResult: {
          photoAuthenticityScore: 98,
          priceWithinRange: true,
          noSpamKeywords: true,
          pcccDocAttached: true
        }
      },
      {
        id: 'MOD-2026-102',
        unitId: 'HN-TH-2401',
        unitName: 'Penthouse Hồ Tây Panorama',
        landlordName: 'Nguyễn Văn Minh',
        landlordPhone: '0912 345 678',
        submittedAt: '2026-08-16 09:15',
        status: 'approved',
        priceAnomalyPercent: 0,
        duplicateScorePercent: 2,
        autoCheckResult: {
          photoAuthenticityScore: 95,
          priceWithinRange: true,
          noSpamKeywords: true,
          pcccDocAttached: true
        }
      },
      {
        id: 'MOD-2026-103',
        unitId: 'SG-Q7-SUSPECT-01',
        unitName: 'Studio Phú Mỹ Hưng Giá Siêu Rẻ (Nghi vấn mồi nhử)',
        landlordName: 'Trần Văn Cò',
        landlordPhone: '0933 999 111',
        submittedAt: '2026-08-16 10:45',
        status: 'flagged',
        flagReason: 'Giá thấp bất thường (-42% so với trung bình khu vực); Ảnh trùng lặp nguồn Chợ Tốt',
        priceAnomalyPercent: -42,
        duplicateScorePercent: 88,
        autoCheckResult: {
          photoAuthenticityScore: 22,
          priceWithinRange: false,
          noSpamKeywords: false,
          pcccDocAttached: false
        }
      }
    ];
  }

  static updateModerationStatus(id: string, status: MarketplaceModerationItem['status']) {
    const queue = this.getModerationQueue();
    const item = queue.find(q => q.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem('haven_moderation_queue_v3', JSON.stringify(queue));
    }
  }

  static getMarketplaceHealthKPIs(): MarketplaceHealthKPIs {
    return {
      verifiedListingsPercent: 98.2,
      averageApprovalHours: 3.8,
      weeklyReportsTrendPercent: -24.5,
      depositDisputeResolutionPercent: 99.1,
      totalActiveListings: 148,
      totalVerifiedLandlords: 64,
      revenueByStream: {
        saasPercent: 45,
        commissionPercent: 30,
        vasPercent: 15,
        escrowPercent: 10
      }
    };
  }

  static resetAll() {
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.CONTRACTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_ORDERS);
    localStorage.removeItem('haven_documents_v3');
    localStorage.removeItem('haven_moderation_queue_v3');
  }
}

