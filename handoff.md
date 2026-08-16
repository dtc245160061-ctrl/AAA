# HAVEN — Project State & Architectural Handoff Context

> **Tài liệu bàn giao toàn diện dành cho phiên làm việc mới (New Chat Session)**
> Cập nhật lần cuối: 16/08/2026

---

## 1. TỔNG QUAN DỰ ÁN & PRODUCT IDENTITY

* **Tên dự án**: **HAVEN** — Nền tảng Tìm kiếm & Vận hành Căn hộ Cao cấp Chuẩn Sanctuary (High-End Living & PropTech Management Platform).
* **Vị trí thư mục gốc**: `D:\AAA`
* **Triết lý Thiết kế (Design Direction)**:
  * Chuẩn **Liquid Glass UI** (lấy cảm hứng từ *useorigin.com* và *10k-websites*), hiệu ứng mờ nhám `backdrop-blur-2xl`, viền phát quang ngọc lục bảo `border-emerald-500/30`, nền tối sâu `#0B0C0E` phối ánh sáng ambient dạ quang.
  * Hỗ trợ đầy đủ **Dark / Light / System Mode** thông qua CSS Variables (`--canvas-bg`, `--panel-bg`, `--text-primary`, v.v.).

---

## 2. TECH STACK & CƠ CẤU THƯ VIỆN

* **Core**: React 19, TypeScript 5.x, Vite 8.x.
* **Styling**: Tailwind CSS v4, Vanilla CSS Custom Design Tokens (`src/index.css`).
* **Icons**: `lucide-react`.
* **State Management**: Reactive Central Store (`src/data/apartmentStore.ts`) đồng bộ tự động với `localStorage`, đảm bảo tương tác 2 chiều mượt mà giữa khách thuê (Consumer) và ban quản lý (Admin).
* **Deployment**: GitHub `main` branch $\rightarrow$ Vercel Auto-Deployment CI/CD.

---

## 3. QUYẾT ĐỊNH KIẾN TRÚC ĐÃ CHỐT (ARCHITECTURAL DECISIONS)

### A. Phân Tách Hai Phân Hệ Sạch Sẽ (Consumer vs Admin)
1. **Giao diện Khách Thuê (HAVEN Consumer)** — `http://localhost:5173/` hoặc `?view=user`:
   * `user_home`: Hero cinematic, Bộ lọc phong cách sống (Lifestyle Tuning Dials), Thẻ thành phố & Căn hộ tiêu biểu.
   * `user_search`: Tìm kiếm & lọc đa tiêu chí (giá, số phòng, tầng, hướng ban công).
   * `user_detail`: Xem chi tiết căn hộ, thư viện ảnh, phân tích rủi ro môi trường (vi khí hậu, ngập lụt, điện dự phòng), nút Chat trực tiếp và Đặt lịch xem phòng.
   * `user_compare`: Ma trận so sánh trực quan các căn đã lưu.
   * `user_subscriptions`: Giao diện **Hội Viên Cư Dân (Resident Prime Club)** với đặc quyền 0đ tiền cọc và dọn phòng định kỳ.
   * `user_services`: **Chợ Tiện Ích Đời Sống (VAS Marketplace)** đặt dọn dẹp, chuyển nhà, khóa cửa IoT, bảo hiểm.

2. **Giao diện Quản Trị & Vận Hành (HAVEN Admin & Operations)** — `http://localhost:5173/?view=admin`:
   * `dashboard`: Báo cáo tài chính, tỷ lệ lấp đầy, biểu đồ dòng tiền & KPI vận hành.
   * `units`: Quản lý kho căn hộ và tình trạng phòng (*Trống / Đang thuê / Bảo trì*).
   * `leads`: Quản lý yêu cầu thuê & đặt lịch xem nhà từ web khách.
   * `inbox`: **Hộp thư Chat 2 chiều (Shopee-Style Messaging Hub)** với khách thuê, tích hợp mẫu trả lời nhanh và 1-Click lập hợp đồng.
   * `contracts`: Quản lý hợp đồng thuê, tính hoa hồng sàn, kích hoạt hợp đồng mới.
   * `billing`: Quản lý hóa đơn thu tiền nhà, tính phí bảo chứng take-rate 5%.
   * `subscriptions`: **Ma trận định giá SaaS** (Starter 0đ, Pro 499k, Enterprise 1.999k) và phân tích cơ cấu doanh thu.
   * `services`: Quản lý đơn dịch vụ gia tăng và lịch hẹn của cư dân.

3. **Hệ Thống Developer Preview Độc Lập**:
   * Toàn bộ logic preview được cô lập trong `src/devtools/preview/DevPreviewLauncher.tsx` (nằm gọn ở góc trái dưới màn hình), không làm ô nhiễm Topbar/Sidebar chính của sản phẩm.

---

## 4. TÍNH NĂNG ĐÃ HOÀN THÀNH & KIỂM THỬ THỰC TẾ

1. **Shopee-Style In-App Chat & Auto-Reply Bot**:
   * Nút chat trực tiếp trên trang chi tiết căn hộ [`UserUnitDetailView.tsx`](file:///d:/AAA/src/components/UserUnitDetailView.tsx).
   * Khung chat nổi [`ChatModal.tsx`](file:///d:/AAA/src/components/ChatModal.tsx) có sẵn Quick Chips (*"📅 Xem lịch phòng còn trống"*, *"💰 Tiền cọc & Điều khoản thuê"*, *"🚗 Chỗ đỗ ô tô"*).
   * Bot tự động trả lời thông minh sau 800ms dựa theo ngữ cảnh.
   * Hộp thư quản trị 2 cột [`AdminInboxView.tsx`](file:///d:/AAA/src/components/AdminInboxView.tsx) cho chủ nhà trả lời và tạo hợp đồng trực tiếp từ chat.

2. **Cơ Cấu Tạo Doanh Thu PropTech Thương Mại (Monetization Engine)**:
   * **Phí môi giới chốt khách**: 50% - 100% tiền nhà tháng đầu.
   * **Thuê bao SaaS hàng tháng (MRR)**: Gói Pro 499.000đ/tháng, Enterprise 1.999.000đ/tháng.
   * **Phí giao dịch bảo chứng (Take-Rate)**: 5% trên mỗi hóa đơn thu tiền thuê.
   * **Hoa hồng dịch vụ gia tăng (VAS)**: 15% - 20% chiết khấu từ các đối tác vệ sinh buồng phòng, HAVEN Move, khóa thông minh IoT, bảo hiểm cháy nổ.

3. **Vòng Đời Thuê Nhà 5 Trụ Cột Hoàn Chỉnh (Full Rental Lifecycle)**:
   * Khách gửi Inquiry $\rightarrow$ Tạo Lead mới $\rightarrow$ Chủ nhà duyệt lịch $\rightarrow$ Chuyển thành Hợp đồng $\rightarrow$ Căn hộ tự đổi sang trạng thái *Đang thuê* $\rightarrow$ Tự sinh Hóa đơn thu tiền.

4. **Trợ Lý AI Tìm Nhà Thông Minh (User AI Advisor)**:
   * Ngăn kéo trượt [`UserAiAdvisorDrawer.tsx`](file:///d:/AAA/src/components/UserAiAdvisorDrawer.tsx) phân tích nhu cầu bằng tiếng Việt tự nhiên và trích xuất căn hộ phù hợp nhất.

---

## 5. CẤU TRÚC FILE CHÍNH CẦN NẮM

* `src/App.tsx`: Bộ điều phối view trung tâm, quản lý state và popup modals.
* `src/types/apartment.ts`: Định nghĩa toàn bộ Data Models (Units, Leads, Contracts, Invoices, Chat, Subscriptions, Services).
* `src/data/apartmentStore.ts`: Store trung tâm quản lý CRUD và lưu trữ `localStorage`.
* `src/components/Sidebar.tsx` & `Topbar.tsx`: Thanh điều hướng phân hệ thông minh kèm badges đếm số lượng tin nhắn chưa đọc / leads mới.
* `src/components/ChatModal.tsx`: Popup chat Shopee-style dành cho khách thuê.
* `src/components/AdminInboxView.tsx`: Trung tâm xử lý tin nhắn dành cho ban quản trị.
* `src/components/SubscriptionsView.tsx`: Bảng giá SaaS và phân tích mô hình kinh doanh.
* `src/components/ServicesMarketplaceView.tsx`: Sàn tiện ích đời sống & dịch vụ cư dân.
* `src/devtools/preview/DevPreviewLauncher.tsx`: Công cụ chuyển đổi môi trường kiểm thử cho lập trình viên.

---

## 6. ĐỀ XUẤT HƯỚNG PHÁT TRIỂN TIẾP THEO (NEXT STEPS)

1. **Dynamic Code-Splitting (React.lazy / Suspense)**:
   * Tách các module lớn (`AdminInboxView`, `SubscriptionsView`, `ServicesMarketplaceView`) để tối ưu kích thước bundle JavaScript dưới 400kB.
2. **Ký Hợp Đồng Điện Tử Trực Tiếp (E-Signature Canvas)**:
   * Tích hợp khung vẽ chữ ký điện tử trực tiếp trên màn hình khi chủ nhà/khách thuê ký hợp đồng tại `ContractsView`.
3. **Xuất Bản Hợp Đồng & Hóa Đơn Ra File PDF (jsPDF / html2canvas)**:
   * Hỗ trợ tải về bản hợp đồng thuê nhà chuẩn pháp lý và phiếu thu tiền có mộc điện tử.
4. **Mô Phỏng WebSocket / Webhook Real-Time**:
   * Tạo cơ chế giả lập nhận tin nhắn từ nhiều người dùng ảo để trình diễn live-demo.

---

> 🚀 **Ghi chú**: Dự án đã được build thành công (`npm run build` pass 100%), không có lỗi TypeScript hay linter. Mọi thứ đã sẵn sàng để tiếp tục phát triển trong phiên chat mới!
