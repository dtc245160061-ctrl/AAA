# HAVEN PROPTECH PLATFORM — HANDOFF DOCUMENTATION

**Dự án**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
**Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A) — Tuần 4/9 (Bài Kiểm tra 1)  
**Tác giả & Nhóm thực hiện**:
1. **Vũ Ngọc Sơn** (Trưởng nhóm — Product Lead, Kiến trúc hệ thống tổng thể, Điều phối báo cáo)
2. **Vũ Bảo Linh** (Kỹ sư Dữ liệu & AI Engine NLP)
3. **Tô Văn Quyền** (Kiểm thử Phần mềm, Quy chuẩn PCCC QCVN 06 & Nghiệp vụ Escrow)
4. **Lê Bình Nguyên** (Thiết kế Giao diện UI/UX & Triển khai Hệ thống)

---

## 1. TECH STACK & KIẾN TRÚC HỆ THỐNG

- **Frontend Core**: React 19, TypeScript, Vite 8.
- **Styling**: Tailwind CSS (Dark Mode Slate-950, Emerald-400, Amber-400), Typography Inter & Playfair Display, Lucide Icons.
- **State Management**: Central Reactive In-Memory & LocalStorage Store (`src/data/apartmentStore.ts`).
- **GenAI / NLP Engine**: `src/services/aiAdvisorService.ts` — Phân tích ngôn ngữ tự nhiên tiếng Việt, tách intent, trích xuất bộ lọc và chấm điểm % Match Score.
- **Data Scope**: 150 căn hộ chuẩn hóa phủ sóng 16 thành phố lớn nhất Việt Nam (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Bình Dương, Nha Trang, Cần Thơ, Vũng Tàu, Hạ Long, Đà Lạt, Huế, Quy Nhơn, Biên Hòa, Vinh, Thanh Hóa, Buôn Ma Thuột). Dữ liệu người thuê bao gồm cả cư dân Việt Nam và chuyên gia nước ngoài (Expats).
- **Production URL**: `https://aaa-jade-two.vercel.app` (Custom domain: `https://haven.is-a.dev`).

---

## 2. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN 100%

### A. Phân Hệ Người Thuê (Tenant Experience)
1. **Bộ lọc True Cost Search**: Bóc tách 6 khoản chi phí hàng tháng (Thuê + Điện 3.500đ/kWh + Nước + Quản lý + Gửi xe + Internet).
2. **Bản Đồ PCCC & Ngập Lụt Đa Lớp**: Bản đồ nhiệt tương tác hiển thị dữ liệu thẩm duyệt PCCC QCVN 06:2022 và lịch sử ngập lụt 16 thành phố.
3. **So Sánh Đa Chiều (Radar Chart 5 trục)**: Giá, PCCC, Nội thất, Tiện ích, Độ yên tĩnh.
4. **AI Housing Advisor**: Chatbot NLP tự động nhận diện nhu cầu tìm nhà và giải thích lý do gợi ý.
5. **Cẩm Nang Khu Vực Đô Thị & Commute Simulator**: Giả lập tuyến đường và thời gian đi làm giờ cao điểm.
6. **Tour Thực Tế Ảo 360 Độ (Virtual Tour 3D)**: Khảo sát không gian phòng khách, phòng ngủ, bếp với hotspot tương tác.
7. **Hồ Sơ Chủ Nhà & Trust Score 6 Trục**: Đánh giá độ tin cậy của chủ nhà trên thang 1.0 - 5.0★.
8. **Hợp Đồng E-Sign & Quỹ Bảo Vệ Tiền Cọc Escrow**: Ký tay Canvas, mã hóa SHA-256 và bảo lãnh cọc 72h.
9. **Biên Bản Bàn Giao Nhận Phòng 15 Mục**: Đối chiếu ảnh hiện trạng và số công tơ điện nước.

### B. Phân Hệ Chủ Nhà & Ban Quản Lý (Landlord Operations)
1. **Smart Listing Creator (AI Soạn tin)**: Nhận diện phòng từ ảnh, tự sinh tiêu đề SEO, mô tả và gợi ý giá thuê.
2. **Dashboard Vận Hành & KPI**: Doanh thu, tỷ lệ lấp đầy phòng, thời gian trống.
3. **Quản Lý Kho 150 Căn Hộ & Sơ Đồ Mặt Bằng (Floor Plan)**.
4. **CRM Khách Thuê & Duyệt Lead 1-Chạm**.
5. **Hóa Đơn Thu Tiền & Nhắc Nợ Tự Động**.
6. **Kho Tài Liệu Pháp Lý Số (Document Vault)**.

### C. Phân Hệ Quản Trị Sàn (Marketplace Governance)
1. **Marketplace Health KPIs**: Tỷ lệ xác minh tin, thời gian duyệt tin, tỷ lệ hoàn cọc đúng hạn.
2. **Hàng Đợi AI Kiểm Duyệt Tin Đăng & Báo Cáo Gian Lận**.
3. **Báo Cáo Cơ Cấu 4 Dòng Doanh Thu**: SaaS B2B, Phí môi giới, Dịch vụ VAS, Phí bảo chứng Escrow.

### D. Phân Hệ Cư Dân (Resident Portal)
1. **Điều Khiển Thiết Bị IoT Smart Home**: Khóa vân tay, điều hòa, đồng hồ điện nước.
2. **Gửi Yêu Cầu Sửa Chữa / Bảo Trì Kèm Ảnh Chụp**.
3. **Thanh Toán Hóa Đơn & Đặt Lịch Dịch Vụ Tiện Ích**.

---

## 3. TÀI LIỆU HỌC THUẬT & SƠ ĐỒ ĐÃ BÀN GIAO

1. **3 File `.docx` môn học (Đã điền tự động)**:
   - `01_GenAI_SoftwareDevelopment_project-plan.docx` (46 việc / 9 tuần).
   - `02_GenAI_SoftwareDevelopment_requirements-qa.docx` (20 Q&A, 120 mẫu khảo sát & 4 Personas).
   - `03_GenAI_SoftwareDevelopment_requirements-specification.docx` (SRS 1.0, 12 Use Cases).
2. **4 File Markdown sao lưu**: trong `docs/academic/` (`01_PROJECT_PLAN_9_WEEKS.md`, `02_REQUIREMENTS_QA_20.md`, `03_SOFTWARE_REQUIREMENTS_SPECIFICATION_SRS.md`, `PROJECT_AUDIT.md`).
3. **4 Sơ đồ hệ thống (Mermaid / Draw.io)**: Lưu tại `C:\Users\zeecu\Downloads\học\TONG_HOP_4_SO_DO_MERMAID.txt`:
   - Sơ đồ Ca sử dụng tổng quát (General Use Case Diagram).
   - Sơ đồ Phân cấp chức năng (Function Hierarchy Tree).
   - Sơ đồ Hoạt động UC001 (Tìm kiếm True Cost & Bản đồ PCCC).
   - Sơ đồ Hoạt động UC009 (Đăng tin tự động bằng AI).

---

## 4. TRẠNG THÁI DEPLOY & TÊN MIỀN

- **Vercel Production**: `https://aaa-jade-two.vercel.app` (Build sạch 0 lỗi).
- **Custom Domain**: `haven.is-a.dev` (Đã nộp PR #47786 trên repo `is-a-dev/register`, đã thêm domain vào Vercel Settings).

---

## 5. BƯỚC TIẾP THEO (NEXT STEPS)

1. Theo dõi thông báo merge PR #47786 trên GitHub để xác nhận tên miền `haven.is-a.dev` chuyển sang `Valid Configuration`.
2. Khi đến buổi thuyết trình / báo cáo: Chuẩn bị nội dung slide thuyết trình (dựa trên dàn ý đã soạn trong prompt Manus).
