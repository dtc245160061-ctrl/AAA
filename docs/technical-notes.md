# HAVEN — Ghi Chú Kỹ Thuật & Kiến Trúc Phần Mềm (Technical Notes)

> **Dành cho**: Engineering Team, Technical Lead & Code Reviewers
> **Tech Stack**: React 19, TypeScript 5.x, Vite 8.x, Tailwind CSS v4, Lucide Icons, Central Reactive Store (`localStorage`).

---

## 1. KIẾN TRÚC MÔ HÌNH DỮ LIỆU (DATA MODEL EXTENSIONS)

Để hỗ trợ đầy đủ các tính năng P0/P1 từ tài liệu nghiên cứu sản phẩm, file [`src/types/apartment.ts`](file:///D:/AAA/src/types/apartment.ts) sẽ được mở rộng có cấu trúc như sau:

### 1.1 Chi Tiết Chi Phí Thực Tế (True Cost Structure)
```typescript
export interface TrueCostBreakdown {
  baseRentVND: number;         // Tiền thuê phòng danh nghĩa
  estimatedElectricityVND: number; // Ước tính điện sinh hoạt (ví dụ: 3.500đ/kWh x ~250kWh)
  waterFeeVND: number;         // Tiền nước (cố định hoặc theo đầu người)
  internetFeeVND: number;      // Phí mạng cáp quang tốc độ cao
  managementFeeVND: number;    // Phí quản lý tòa nhà & bảo vệ 24/7
  parkingFeeVND: number;       // Phí gửi xe máy/ô tô
  totalMonthlyEstimatedVND: number; // Tổng chi phí thực tế hàng tháng
  moveInTotalRequiredVND: number;   // Tổng số tiền cần nộp khi dọn vào (Cọc + Tháng đầu)
}
```

### 1.2 Minh Bạch An Toàn PCCC & Rủi Ro Ngập (Safety & PCCC Structure)
```typescript
export interface PcccSafetyReport {
  hasFireEscapes: boolean;
  fireEscapeCount: number;
  hasAutomaticSprinklers: boolean;
  hasSmokeDetectors: boolean;
  hasFireExtinguishers: boolean;
  inspectionCertificateStatus: 'certified' | 'pending_renewal' | 'unverified';
  lastInspectionDate?: string;
  disclaimer: string;
}

export interface FloodRiskProfile {
  riskLevel: 'Low' | 'Moderate' | 'High';
  historicalRainNotes: string;
  highTideVulnerable: boolean;
  referenceSource: string; // "Tham chiếu dữ liệu thoát nước đô thị TP.HCM (UDI)"
}
```

### 1.3 Điểm Uy Tín Chủ Nhà & Xác Minh (Landlord Trust & Verification)
```typescript
export type VerificationLevel = 'unverified' | 'id_verified' | 'full_ownership_verified';

export interface LandlordProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  verificationLevel: VerificationLevel;
  trustScore: number; // 3.0 to 5.0
  reviewCount: number;
  responseRatePercent: number; // e.g. 98%
  averageResponseMinutes: number; // e.g. 15 minutes
  activeListingsCount: number;
  joinedDate: string;
  badges: string[];
}
```

---

## 2. CHIẾN LƯỢC QUẢN LÝ STATE & PHÂN QUYỀN (STATE & ROUTING STRATEGY)

1. **Central Reactive Store (`src/data/apartmentStore.ts`)**:
   - Sử dụng mô hình Pub/Sub nội bộ đồng bộ trực tiếp với `localStorage`.
   - Mọi thay đổi dữ liệu từ phía Khách thuê (Gửi tin nhắn, Đặt lịch xem) ngay lập tức kích hoạt sự kiện cập nhật để phía Quản trị (Admin) nhận dữ liệu không cần F5 tải lại trang.

2. **Phân Tách Phân Hệ (Consumer vs Admin Navigation)**:
   - **Consumer View**: `?view=user` (hoặc root `/`): Luồng khám phá căn hộ, tìm kiếm True Cost, Bản đồ An tâm, So sánh Arena, Đặt lịch xem phòng.
   - **Admin View**: `?view=admin`: Bảng điều khiển quản trị, Hộp thư Shopee 2 cột, Quản lý Leads, Lập hợp đồng & Ký số E-Sign, Báo cáo dòng tiền.
   - **Dev Launcher**: Nằm cô lập tại `src/devtools/preview/DevPreviewLauncher.tsx` giúp chuyển đổi tức thì giữa các màn hình mà không làm ô nhiễm thanh menu sản phẩm.

---

## 3. CHIẾN LƯỢC KIỂM THỬ & BẢO ĐẢM CHẤT LƯỢNG (QA STRATEGY)

1. **Kiểm thử biên dịch TypeScript & Lint**:
   - Chạy lệnh `npm run build` để kiểm tra độ tương thích kiểu dữ liệu (Strict Type Checking) và không có biến/import rác.
2. **Kiểm thử luồng dữ liệu 2 chiều (E2E User Flow Test)**:
   - *Test Case 1*: Khách gửi câu hỏi từ `ChatModal` $\rightarrow$ Kiểm tra tin nhắn xuất hiện ngay trong `AdminInboxView`.
   - *Test Case 2*: Khách đặt lịch xem $\rightarrow$ Kiểm tra Lead mới xuất hiện trong `LeadsView` kèm đúng mã căn và giờ hẹn.
   - *Test Case 3*: Chủ nhà bấm "Lập hợp đồng" từ Chat $\rightarrow$ Hợp đồng được kích hoạt $\rightarrow$ Căn hộ đổi sang `occupied` $\rightarrow$ Sinh hóa đơn tại `PaymentsView`.
3. **Kiểm thử Responsive & Trạng Thái UI**:
   - Kiểm tra hiển thị chuẩn trên màn hình di động (375px), iPad (768px) và màn hình rộng (1440px).
   - Đảm bảo 100% các thành phần đều có trạng thái Loading Shimmer, Empty State minh họa và Error Handling thân thiện.

---

## 4. QUẢN TRỊ RỦI RO & KHUYẾN NGHỊ PHÁP LÝ (LEGAL & RISK MITIGATION)

1. **Rủi ro dữ liệu PCCC & Ngập lụt**:
   - Bắt buộc đính kèm ghi chú miễn trừ trách nhiệm (Disclaimer) trên mọi thẻ PCCC và Bản đồ: *"Dữ liệu mang tính chất tham khảo tổng hợp, không thay thế văn bản thẩm duyệt chính thức của cơ quan PCCC có thẩm quyền."*
2. **Rủi ro tiền ký quỹ Escrow**:
   - Trên giao diện thanh toán, ghi chú rõ: *"Hệ thống mô phỏng quy trình bảo chứng giao dịch chuẩn bị tích hợp cổng thanh toán đối tác ngân hàng."*
