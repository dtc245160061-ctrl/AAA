# HAVEN PROPTECH PLATFORM — TOÀN BỘ HỒ SƠ AUDIT HỆ THỐNG (PROJECT AUDIT)

**Dự án**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
**Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A)  
**Nhóm sinh viên thực hiện**:
1. **Vũ Ngọc Sơn** (Trưởng nhóm, Kiến trúc hệ thống & Fullstack)
2. **Vũ Bảo Linh** (Kỹ sư Dữ liệu & Tích hợp AI Engine)
3. **Tô Văn Quyền** (Kiểm thử Phần mềm & Đặc tả Nghiệp vụ)
4. **Lê Bình Nguyên** (Thiết kế Giao diện UI/UX & Tài liệu Học thuật)

**Mã nguồn**: `D:\AAA\src`  
**Trạng thái Build**: Production Ready (0 TypeScript Errors, 150 Căn Hộ / 16 Thành Phố)  
**Production URL**: Vercel Auto Deployment  

---

## 1. TỔNG QUAN CÁC CHỨC NĂNG ĐÃ TRIỂN KHAI (IMPLEMENTED FEATURES)

### A. Phân Hệ Người Thuê (Tenant Experience)
1. **Bộ lọc True Cost Search**: Bóc tách 6 khoản chi phí hàng tháng (Thuê + Điện 3.500đ + Nước + Quản lý + Gửi xe + Internet).
2. **Bản Đồ PCCC & Ngập Lụt (Environmental & Fire Safety Map)**: Bản đồ nhiệt tương tác đa tầng hiển thị Lớp thẩm duyệt PCCC QCVN 06:2022 và Lớp Ngập lụt/Triều cường đô thị tại 16 thành phố lớn.
3. **So Sánh Đa Chiều (Radar Chart 5 trục)**: Biểu đồ Radar trực quan (Chi phí tổng thể, PCCC, Độ cao cấp nội thất, Vị trí & Tiện ích, Mức độ yên tĩnh) kèm bảng chiết tính chi phí chênh lệch từng khoản.
4. **Trợ Lý AI Housing Advisor**: Phân tích câu lệnh tiếng Việt tự nhiên (NLP) thành bộ lọc tìm kiếm và giải thích lý do phù hợp.
5. **Cẩm Nang Khu Vực Đô Thị (Neighborhood Guide)**: Dữ liệu giá thuê trung bình, chỉ số an ninh, nguy cơ ngập lụt, trường học, bệnh viện cho từng khu vực.
6. **Mô Phỏng Tuyến Đường Đi Làm (Commute Simulator)**: Tính toán thời gian di chuyển giờ bình thường vs giờ cao điểm theo Xe máy, Ô tô, Tuyến công cộng.
7. **Trải Nghiệm Tour Thực Tế Ảo 360 Độ (Virtual Tour 3D)**: Khảo sát không gian phòng khách, phòng ngủ master, bếp, ban công có điểm tương tác (hotspots).
8. **Hồ Sơ Chủ Nhà & Điểm Tín Nhiệm (Landlord Trust Profile)**: Đánh giá thuật toán Trust Score 6 trục (CCCD, Review, Tốc độ trả lời, Thâm niên, Tỷ lệ hủy, Lịch sử giao dịch).
9. **Chat Thời Gian Thực & Smart Action Chips**: Gợi ý câu hỏi nhanh theo ngữ cảnh và đặt lịch xem phòng trực tiếp.
10. **Hợp Đồng Thuê Nhà Điện Tử (E-Signature)**: Ký tay HTML5 Canvas, đính kèm điều khoản và mã băm bảo chứng SHA-256.
11. **Bảo Vệ Tiền Cọc Trung Gian (HAVEN Escrow Protection)**: Quy trình 4 bước ký quỹ cọc tạm giữ trung gian và kích hoạt bảo lãnh hoàn cọc.
12. **Biên Bản Bàn Giao Nhận Phòng 15 Hạng Mục (Move-In Checklist)**: Kiểm tra hiện trạng, chụp ảnh đối chiếu và lưu trữ số công tơ điện nước.
13. **Hội Viên Prime Club & Dịch Vụ Cư Dân (VAS)**: Đặt lịch dọn dẹp, chuyển nhà, bảo hiểm nhà ở.

### B. Phân Hệ Chủ Nhà & Ban Quản Lý (Landlord Operations)
1. **Đăng Tin Tự Động Bằng AI (Smart Listing Creator)**: AI nhận diện phòng, soạn tiêu đề chuẩn SEO, mô tả hấp dẫn và gợi ý khung giá thị trường.
2. **Dashboard Vận Hành & KPI**: Theo dõi doanh thu, tỷ lệ lấp đầy phòng, thời gian trống trung bình và khách thuê mới.
3. **Quản Lý Kho Căn Hộ (Units Inventory)**: Quản lý 150 căn hộ theo 16 thành phố và 5 trạng thái (Trống, Đang thuê, Đã cọc, Chờ bàn giao, Bảo trì).
4. **CRM Khách Thuê & Duyệt Lead**: Tiếp nhận đơn hẹn xem phòng, phê duyệt và chuyển đổi thành hợp đồng cho thuê 1-chạm.
5. **Quản Lý Hợp Đồng & Thu Hóa Đơn**: Theo dõi hợp đồng hiệu lực, tạo hóa đơn điện nước và ghi nhận thanh toán.
6. **Kho Tài Liệu Pháp Lý Số (Document Vault)**: Lưu trữ hợp đồng số, hồ sơ nghiệm thu PCCC và biên lai cọc có mã băm bảo mật.

### C. Phân Hệ Quản Trị Sàn (Governance & Marketplace Health)
1. **Bảng Sức Khỏe Thị Trường (Marketplace Health KPIs)**: Tỷ lệ tin xác minh, thời gian duyệt tin, báo cáo gian lận và tỷ lệ hoàn cọc đúng hạn.
2. **Hàng Đợi Kiểm Duyệt AI (Moderation Queue)**: AI chấm điểm tính chân thực của ảnh, phát hiện ảnh trùng lặp và cảnh báo giá bất thường.
3. **Cơ Cấu 4 Dòng Doanh Thu (Revenue Breakdown)**: SaaS B2B Chủ nhà, Phí môi giới, Dịch vụ cư dân VAS và Phí bảo chứng Escrow.

---

## 2. KIẾN TRÚC MÃ NGUỒN (CODEBASE STRUCTURE)

```text
D:/AAA/src/
├── types/apartment.ts                -> Domain Data Models (150 units, 16 cities, UnitStatus)
├── data/
│   ├── mockData.ts                   -> Dữ liệu 150 căn hộ chuẩn hóa tại 16 thành phố
│   └── apartmentStore.ts             -> Central Reactive Store (CRUD & LocalStorage)
├── components/
│   ├── UserHomeView.tsx              -> Trang chủ người thuê & Lifestyle Tuning Dials
│   ├── UserSearchView.tsx            -> Bộ lọc True Cost Search & Selector 16 Thành Phố
│   ├── UserUnitDetailView.tsx        -> Trang chi tiết, bóc tách chi phí & PCCC
│   ├── UserCompareView.tsx           -> So Sánh Đa Chiều Radar Chart 5 trục
│   ├── ConfidenceMapView.tsx         -> Bản đồ PCCC & Ngập lụt Đa Lớp
│   ├── NeighborhoodGuideView.tsx     -> Cẩm nang khu vực đô thị
│   ├── CommuteSimulatorModal.tsx     -> Mô phỏng di chuyển giờ cao điểm
│   ├── LandlordProfileModal.tsx      -> Hồ sơ chủ nhà toàn diện & Trust Score
│   ├── DepositEscrowModal.tsx        -> Quy trình cọc bảo chứng Escrow
│   ├── DocumentVaultView.tsx         -> Kho lưu trữ tài liệu pháp lý số
│   ├── HandoverChecklistView.tsx     -> Biên bản bàn giao nhận phòng 15 mục
│   ├── ValueAddedServicesView.tsx    -> Dịch vụ cư dân VAS & Prime Club
│   ├── LandlordSmartListingModal.tsx -> Đăng tin tự động bằng AI
│   ├── LandlordDashboardView.tsx     -> Dashboard chủ nhà & Sơ đồ tầng
│   ├── AdminDashboardView.tsx        -> Dashboard quản trị sàn & Sức khỏe thị trường
│   ├── ResidentPortalView.tsx        -> Cổng cư dân IoT & Yêu cầu bảo trì
│   ├── ChatDrawer.tsx                -> Nhắn tin thời gian thực & Smart Chips
│   └── Header.tsx / Sidebar.tsx      -> Điều hướng đa phân hệ
```
