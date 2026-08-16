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
  ServiceOrder
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
  UNITS: 'haven_units_data_v2',
  LEADS: 'haven_rental_leads_v2',
  CONTRACTS: 'haven_lease_contracts_v2',
  INVOICES: 'haven_rental_invoices_v2',
  SAVED: 'haven_saved_unit_ids_v2',
  CONVERSATIONS: 'haven_chat_conversations_v2',
  ACTIVE_SUBSCRIPTION: 'haven_active_subscription_v2',
  SERVICE_ORDERS: 'haven_service_orders_v2'
};

export class ApartmentStore {
  // Units
  static getUnits(): ApartmentUnit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNITS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return MOCK_UNITS;
  }

  static saveUnits(units: ApartmentUnit[]) {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
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

  static resetAll() {
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.CONTRACTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_ORDERS);
  }
}
