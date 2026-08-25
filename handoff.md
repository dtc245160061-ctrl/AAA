# HAVEN PROPTECH PLATFORM — HANDOFF DOCUMENTATION

> **Dự án**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
> **Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A) — Tuần 4/9 (Bài Kiểm tra 1)  
> **Tác giả & Nhóm thực hiện**:
> 1. **Vũ Ngọc Sơn** (Trưởng nhóm — Product Lead, Kiến trúc hệ thống tổng thể, Điều phối báo cáo)
> 2. **Vũ Bảo Linh** (Kỹ sư Dữ liệu & AI Engine NLP)
> 3. **Tô Văn Quyền** (Kiểm thử Phần mềm, Quy chuẩn PCCC QCVN 06 & Nghiệp vụ Escrow)
> 4. **Lê Bình Nguyên** (Thiết kế Giao diện UI/UX & Triển khai Hệ thống)

---

## 1. LIÊN KẾT ỨNG DỤNG & DEPLOYMENT (APP & DOMAIN LINKS)

- **Production Vercel URL**: [https://aaa-jade-two.vercel.app](https://aaa-jade-two.vercel.app)
- **Custom Domain**: [https://haven.is-a.dev](https://haven.is-a.dev)
- **GitHub Repository**: [https://github.com/dtc245160061-ctrl/AAA](https://github.com/dtc245160061-ctrl/AAA)
- **Local Dev Server**: `http://localhost:5173` (Khởi chạy bằng lệnh `npm run dev`)

---

## 2. TECH STACK & KIẾN TRÚC HỆ THỐNG (TECH STACK & ARCHITECTURE)

- **Core Frontend**: React 19, TypeScript, Vite 8 (Build siêu tốc ~1.0s, 0 lỗi biên dịch).
- **Design System & Styling**: Vanilla CSS + Tailwind CSS v4, Color Tokens OKLCH/HSL, Dark Canvas `#020617` (Slate-950), Accents Emerald-400, Amber-400 Gold Gradient, Cyan-500 Prime Gradient.
- **Typography & Assets**: Playfair Display (Editorial Serif), Inter (Sans), JetBrains Mono (Tech/Finance).
- **Hiệu ứng & Chuyển động (60FPS Animations)**:
  - Cuộn mượt tự nhiên: `html { scroll-behavior: smooth; }`.
  - Nền chuyển động: `@keyframes mesh-drift 30s` đa lớp radial-gradient.
  - Floating Action Button (FAB) Haven AI: `@keyframes spin-slow 12s` tự động pause khi hover chuột.
- **State Management**: Reactive In-Memory Store kết hợp đồng bộ `localStorage` hai chiều (`src/data/apartmentStore.ts`).
- **AI & NLP Engine**: `src/services/aiAdvisorService.ts` — Phân tích ngôn ngữ tự nhiên tiếng Việt, tách intent, trích xuất bộ lọc thông minh và tính toán điểm tương thích `% Match Score`.
- **Dữ liệu Mock Data Chuẩn Hóa**: 150 căn hộ thực tế tại 16 đô thị lớn Việt Nam (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Bình Dương, Nha Trang, Cần Thơ, Vũng Tàu, Đà Lạt, Huế, Quy Nhơn,...), 100% hình ảnh căn hộ cao cấp (không chứa ảnh rác/nhà vệ sinh), tích hợp fallback handler `onError` chống vỡ ảnh.

---

## 3. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN 100% (COMPLETED FEATURES)

### A. Phân Hệ Người Tìm Thuê (Tenant Experience)
1. **Tìm Kiếm Chi Phí Thực Tế (True Cost Search)**: Bóc tách minh bạch 6 cấu phần chi phí hàng tháng (Tiền thuê + Điện 3.500đ/kWh + Nước + Quản lý + Gửi xe + Internet).
2. **Lưới Hiển Thị 3 Cột (3-Column Grid)**: Bố cục trực quan, nhãn kiểm định "Sổ Đỏ & Ảnh Thật" không bị đè lên đánh giá sao hay nút lưu yêu thích.
3. **Bản Đồ PCCC & Ngập Lụt Đa Lớp (Confidence Map)**: Tích hợp dữ liệu kiểm định PCCC QCVN 06:2022 và lịch sử ngập triều cường tại 16 tỉnh thành.
4. **So Sánh Đa Căn Hộ (Radar Chart 5 Trục)**: Đánh giá trực quan Giá cả, PCCC, Nội thất, Tiện ích và Độ yên tĩnh.
5. **Haven AI Housing Advisor**: Trợ lý trò chuyện thông minh gợi ý căn hộ phù hợp và giải thích rõ "Lý do chọn căn hộ này".
6. **Tour Thực Tế Ảo 360° (Virtual 3D Tour)**: Xem không gian phòng khách, phòng ngủ, ban công với hotspot tương tác.
7. **Ký Hợp Đồng Điện Tử (E-Sign) & Quỹ Bảo Chứng Cọc Escrow**: Ký tay Canvas trên màn hình, mã hóa SHA-256 và bảo hiểm cọc 72h.
8. **Biên Bản Bàn Giao 15 Hạng Mục (Digital Handover Report)**: Đối chiếu hình ảnh hiện trạng nội thất và số công tơ điện nước lúc nhận phòng.

### B. Phân Hệ Quản Trị & Chủ Nhà (Landlord Operations)
1. **Dashboard Điều Hành Toàn Diện**: Theo dõi doanh thu thực nhận, tỷ lệ lấp đầy (Occupancy 94.2%), công nợ quá hạn.
2. **Quản Lý 150 Căn Hộ & Mặt Bằng (Floor Plan)**: Tra cứu nhanh mã phòng, sơ đồ tầng và trạng thái thuê.
3. **CRM Khách Thuê & Duyệt Lead 1-Chạm**: Quản lý lịch hẹn xem phòng và chuyển đổi lead thành hợp đồng ngay lập tức.
4. **Sổ Quỹ Thu Tiền & Hóa Đơn Tự Động (Payments Ledger)**: Tích hợp mã VietQR động, theo dõi lịch sử thanh toán chuẩn xác.
5. **Kho Tài Liệu Pháp Lý Số (Document Vault)**: Lưu trữ hợp đồng số, chứng nhận PCCC, biên nhận cọc với huy hiệu chống nhảy dòng.
6. **Bộ Điều Phối Thao Tác Nhanh (Quick Action Dispatcher)**: Modal kích thước lớn `max-w-2xl`, hỗ trợ 100% tiếng Việt cho 4 tác vụ: Thu tiền, Thêm cư dân, Lập hợp đồng, Báo bảo trì.
7. **Haven Operations Copilot**: AI hỗ trợ chủ nhà tra cứu nợ quá hạn, hợp đồng hết hạn 60 ngày, và sự cố bảo trì khẩn cấp.

### C. Phân Hệ Quản Trị Sàn & Mô Hình Doanh Thu (Marketplace Governance & SaaS)
1. **Bảng Sức Khỏe Sàn (Marketplace Health & Trust Monitoring)**: Giám sát tỷ lệ tin xác minh, thuật toán chống giá ảo và tỷ lệ hoàn cọc đúng hạn.
2. **Gói Thuê Bao Định Kỳ (SaaS Subscriptions)**: Phân tầng Starter, Pro, Enterprise (Metallic Gold Gradient) và Resident Prime (Cyan Gradient).

---

## 4. TÌNH TRẠNG LỖI & KIỂM THỬ (BUGS & VALIDATION)

- **Lỗi tồn đọng**: **0 bug** (Đã sửa triệt để lỗi ký tự LaTeX `$\rightarrow$`, căn chỉnh 14px menu Sidebar, chống nhảy dòng tiêu đề và badges, xóa ảnh nhà vệ sinh trong mock data, chuẩn hóa tiền tệ `XXTr/tháng`).
- **Kiểm thử biên dịch**: Lệnh `npm run build` chạy thành công `100%` (Vite build sạch không cảnh báo).
- **Trạng thái Git**: Đã đồng bộ lên nhánh `main` của repository GitHub `dtc245160061-ctrl/AAA`.

---

## 5. TÀI LIỆU HỌC THUẬT & HỒ SƠ DỰ ÁN (ACADEMIC DELIVERABLES)

1. **3 File `.docx` môn học**: Đã điền đầy đủ nội dung tại thư mục môn học:
   - `01_GenAI_SoftwareDevelopment_project-plan.docx` (Bảng phân rã 46 công việc / 9 tuần).
   - `02_GenAI_SoftwareDevelopment_requirements-qa.docx` (20 câu hỏi Q&A, 120 mẫu khảo sát người dùng).
   - `03_GenAI_SoftwareDevelopment_requirements-specification.docx` (SRS 1.0, 12 Use Cases chi tiết).
2. **Bản sao lưu Markdown**: Trong thư mục `docs/academic/`.
3. **4 Sơ đồ hệ thống chuẩn Mermaid**: Ca sử dụng tổng quát, Phân cấp chức năng, Sơ đồ hoạt động UC001 và UC009.

---

## 6. KẾ HOẠCH BƯỚC TIẾP THEO (NEXT STEPS FOR NEW CHAT)

1. **Chuẩn bị Thuyết Trình / Báo Cáo Tuần 4**: Soạn slide báo cáo tiến độ môn học, kịch bản live demo tính năng Haven AI và Escrow.
2. **Theo dõi Custom Domain**: Kiểm tra trạng thái merge PR #47786 trên GitHub repo `is-a-dev/register` để tên miền `haven.is-a.dev` hoạt động chính thức.
3. **Mở rộng tính năng (Nếu cần trong tương lai)**: Kết nối API backend thật (Node.js/Express hoặc Supabase/Firebase) để thay thế in-memory store khi chuyển sang giai đoạn Production thực tế.
