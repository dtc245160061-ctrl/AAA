# HAVEN PROPTECH PLATFORM — HANDOFF CONTEXT

> **Dự án**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
> **Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A)  
> **Phiên bản**: v2.5.0-RAG-Production  
> **Ngày bàn giao**: 26/08/2026  

---

## 1. LIÊN KẾT HỆ THỐNG & DEPLOYMENT

- **Production Vercel URL**: [https://aaa-jade-two.vercel.app](https://aaa-jade-two.vercel.app)
- **Custom Domain**: [https://haven.is-a.dev](https://haven.is-a.dev)
- **GitHub Repository**: [https://github.com/dtc245160061-ctrl/AAA](https://github.com/dtc245160061-ctrl/AAA) (Branch: `main`)
- **Local Dev Server**: `http://localhost:5173/` (Khởi chạy bằng `npm run dev`)

---

## 2. TECH STACK & CÔNG NGHỆ CỐT LÕI

- **Frontend**: React 19, TypeScript, Vite 8.2.1 (Build siêu tốc ~400ms, 0 lỗi biên dịch).
- **Styling & Design System**: Tailwind CSS v4 + Vanilla CSS Tokens (`src/index.css`), phong cách **Midnight Navy (`rgba(15, 23, 42)`) + Emerald Accent (`#10B981`)**, hiệu ứng **Atmospheric Panel** và **Liquid Glass** với blur 24px/16px.
- **AI & RAG Engine**:
  - **Mô hình sinh ngôn ngữ**: Google Gemini 2.0 Flash (`gemini-2.0-flash`), Google Gemini 1.5 Flash (`gemini-1.5-flash`).
  - **Mô hình Vector Embedding**: `text-embedding-004` (Google Generative AI) kết hợp thuật toán **Cosine Similarity** và bộ nhớ đệm Embedding Cache (`localStorage`).
  - **Cơ sở dữ liệu tri thức (RAG Corpus)**: Tự động trích xuất và vector hoá toàn bộ 150 căn hộ, chính sách minh bạch True Cost, quy chuẩn an toàn PCCC QCVN 06:2022/BXD, cơ chế bảo chứng cọc Escrow và dữ liệu vận hành dòng tiền / hợp đồng.
  - **Quản lý Key & Key Pool**: Hỗ trợ `.env` (`VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEYS`), nạp tự động danh sách key từ `C:\Users\zeecu\OneDrive\Tài liệu\key.txt`, hỗ trợ xoay vòng key và cơ chế Natural Semantic Fallback mượt mà khi offline.
- **State Management**: Reactive Central Store `ApartmentStore` (`src/data/apartmentStore.ts`) đồng bộ hai chiều với `localStorage`.

---

## 3. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN 100%

### A. Phân Hệ Khách Thuê (Consumer / Tenant Experience)
1. **Trang Chủ Lắng Đọng (UserHomeView)**: Hero section nghệ thuật, bộ tinh chỉnh phong cách sống (10 dials), khám phá thành phố trọng điểm (Hà Nội, TP.HCM, Đà Nẵng) với lớp phủ gradient sáng/tối tự thích ứng, Featured Properties và Guided Path ribbon.
2. **Tìm Kiếm & Lọc Toàn Diện (UserSearchView)**: Lưới 3 cột cao cấp, bộ lọc True Cost, khoảng tầng, tiện ích, PCCC, chống ngập lụt.
3. **Chi Tiết Căn Hộ (UserUnitDetailView)**: Chiết tính chi phí minh bạch True Cost, hồ sơ PCCC QCVN 06, chỉ số IoT thời gian thực, đặt lịch xem phòng.
4. **So Sánh Đa Chiều (UserCompareView)**: Biểu đồ Radar 5 trục trực quan (Giá cả, PCCC, Vị trí, Tiện ích, Độ yên tĩnh).
5. **Haven AI Housing Advisor (RAG Chatbot)**:
   - Khung chat nổi bo tròn (`rounded-3xl`), dịch chuyển sang trái tạo khoảng cách thoáng đãng.
   - Giao tiếp ngôn ngữ tự nhiên, trả lời chào hỏi thân thiện, tư vấn căn hộ có trích dẫn chi tiết và nút "Áp dụng bộ lọc này vào trang tìm kiếm".
   - Không chứa các nhãn rác kỹ thuật trên giao diện người dùng.
6. **Bản Đồ An Toàn & Ngập Lụt (ConfidenceMapView)**: Đồ thị rủi ro ngập lụt và nghiệm thu PCCC.
7. **Biên Bản Bàn Giao (MoveInChecklistView)** & **Kho Hồ Sơ (DocumentVaultView)** & **Chợ Dịch Vụ VAS (ServicesMarketplaceView)**.

### B. Phân Hệ Quản Trị Vận Hành (Admin Operations)
1. **Dashboard Điều Hành**: Tỷ lệ lấp đầy (94.2%), doanh thu thực nhận, công nợ quá hạn và danh sách yêu cầu thuê mới.
2. **Quản Lý 150 Căn Hộ (UnitsView)** & **Sơ Đồ Tầng**: Cập nhật trạng thái phòng tức thì.
3. **Quản Lý Yêu Cầu Thuê & Lead CRM (LeadsView)**: Chuyển đổi Lead sang Hợp đồng thuê 1-chạm.
4. **Hộp Thư Tin Nhắn Khách Hàng (AdminInboxView)** & **Hợp Đồng Thuê (ContractsView)** & **Sổ Quỹ Hóa Đơn (PaymentsView)**.
5. **Haven Operations Copilot (Admin AI Chatbot)**: Tra cứu nhanh nợ quá hạn, hợp đồng sắp hết hạn trong 60 ngày và sự cố bảo trì.

---

## 4. QUY TẮC LÀM VIỆC & LƯU Ý CHO PHIÊN LÀM VIỆC MỚI

1. **Quy tắc về API Key**: Khi cần nạp hoặc cập nhật key, luôn tự động lấy từ đường dẫn `C:\Users\zeecu\OneDrive\Tài liệu\key.txt` để cập nhật vào `.env` và `geminiRagService.ts` mà không cần hỏi lại người dùng.
2. **Nguyên tắc giao diện**:
   - Bảo toàn phong cách Dark Mode Midnight Navy + Green / Light Mode Sage Gray `#E6EBE8`.
   - Giữ giao diện Chatbot sạch sẽ, không hiển thị các từ ngữ/nút bấm kỹ thuật của nhà phát triển trên giao diện người dùng cuối.
3. **Ý tưởng đang chờ triển khai tiếp (Backlog)**:
   - Video nền chuyển động 6FPS màu gradient cho trang chủ (người dùng đã đề xuất để sau).
   - Tiếp tục hoàn thiện các phần thuyết trình / slide môn học nếu có yêu cầu mới.

---

## 5. TÌNH TRẠNG LỖI & KIỂM THỬ (STATUS: CLEAN)
- **Lỗi tồn đọng**: **0 bug**.
- **Build Status**: `npm run build` thành công 100% trong ~400ms.
- **Git Status**: Toàn bộ mã nguồn đã được commit và đồng bộ lên branch `main` GitHub.
