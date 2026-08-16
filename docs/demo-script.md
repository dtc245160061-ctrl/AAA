# HAVEN — Kịch Bản Trình Diễn Sản Phẩm (Demo Script: 3-5 Phút)

> **Mục tiêu**: Thuyết phục Hội đồng đánh giá / Nhà đầu tư về giá trị khác biệt vượt trội của HAVEN: Không chỉ là một sàn đăng tin, mà là một nền tảng PropTech định lượng niềm tin và vận hành toàn diện.

---

## 1. TỔNG QUAN DÒNG CHẢY TRÌNH DIỄN (FLOW OVERVIEW)

```
[0:00 - 0:45] ➔ MỞ ĐẦU: Nỗi đau thị trường & Lời hứa "Biết rõ trước khi cọc"
[0:45 - 2:00] ➔ WOW #1: Tìm kiếm theo Tổng Chi Phí Thật & Bản Đồ An Tâm
[2:00 - 3:00] ➔ WOW #2: Đấu trường so sánh (Radar Chart) & Chat Shopee Auto-Bot
[3:00 - 4:00] ➔ WOW #3: Chốt Hợp Đồng 1-Click, Ký Số E-Sign & Quản Trị Vận Hành
[4:00 - 4:30] ➔ KẾT LUẬN: Động cơ tạo doanh thu (Monetization) & Tầm nhìn tương lai
```

---

## 2. KỊCH BẢN CHI TIẾT TỪNG BƯỚC (STEP-BY-STEP ACTIONS)

### Bước 1: Mở Đầu — Đặt Vấn Đề (0:00 - 0:45)
- **Thao tác**: Mở màn hình trang chủ [`UserHomeView.tsx`](file:///D:/AAA/src/components/UserHomeView.tsx) (`http://localhost:5173/`).
- **Lời thoại trình bày**:
  > *"Tại Việt Nam, 9 trên 10 người đi thuê nhà từng gặp tình trạng 'giá đăng một đằng, trả tiền một nẻo' do hàng loạt chi phí ẩn về điện nước, phí dịch vụ và gửi xe. Thậm chí sau vụ cháy Khương Hạ, nỗi lo về PCCC và ngập lụt trở thành nỗi ám ảnh. HAVEN ra đời với sứ mệnh: 'Biết rõ trước khi cọc' thông qua dữ liệu minh bạch và công nghệ Sanctuary."*
- **Hành động trên UI**: Di chuột qua các thẻ Lifestyle Tuning Dials (Ngân sách, Yên tĩnh, An toàn).

---

### Bước 2: Wow Moment #1 — True Cost & Bản Đồ An Tâm (0:45 - 2:00)
- **Thao tác**:
  1. Chuyển sang trang Tìm kiếm [`UserSearchView.tsx`](file:///D:/AAA/src/components/UserSearchView.tsx).
  2. Kéo thanh trượt **"Tổng Chi Phí Thực Tế / Tháng"** (ví dụ: mức 15.000.000 đ).
  3. Chọn xem một căn hộ cụ thể $\rightarrow$ Mở màn hình Chi Tiết [`UserUnitDetailView.tsx`](file:///D:/AAA/src/components/UserUnitDetailView.tsx).
- **Lời thoại trình bày**:
  > *"Hãy nhìn vào Bảng tính Tổng chi phí thực tế (True Cost Breakdown): Căn hộ đăng giá 11 triệu, nhưng HAVEN bóc tách chính xác: Điện ước tính 800k, Nước 150k, Internet 250k, Phí dịch vụ và gửi ô tô 1.4tr ➔ Tổng tiền thực trả là 13.6 triệu/tháng. Người thuê không bao giờ bị sốc tài chính."*
  > *"Kế bên là Bản Đồ An Tâm (Confidence Map) với lớp dữ liệu rủi ro ngập lụt theo mùa mưa và Thẻ minh bạch PCCC với kiểm định thang thoát hiểm và vòi sprinkler tự động."*
- **Hành động trên UI**: Bật/tắt các lớp rủi ro trên bản đồ, chỉ vào huy hiệu **"Verified Listing Level 3"** và điểm **Landlord Trust Score 4.8★**.

---

### Bước 3: Wow Moment #2 — Đấu Trường So Sánh & Chat Shopee (2:00 - 3:00)
- **Thao tác**:
  1. Bấm nút **"So sánh"** tại 2 căn hộ $\rightarrow$ Mở màn hình [`UserCompareView.tsx`](file:///D:/AAA/src/components/UserCompareView.tsx).
  2. Chỉ vào biểu đồ **Radar Chart** 5 chiều.
  3. Quay lại trang chi tiết, bấm nút **"Chat Trực Tiếp Với Chủ Nhà"** $\rightarrow$ Mở popup [`ChatModal.tsx`](file:///D:/AAA/src/components/ChatModal.tsx).
  4. Bấm chip hỏi nhanh: *"📅 Xem lịch phòng còn trống"* hoặc *"💰 Tiền cọc & Điều khoản thuê"*.
- **Lời thoại trình bày**:
  > *"Với Đấu trường so sánh (Comparison Arena), người thuê dễ dàng cân đo giữa căn hộ giá rẻ nhưng rủi ro ngập cao vs. căn hộ cao cấp chuẩn PCCC. Đồng thời, khung chat Shopee-style tự động phân tích câu hỏi thiếu và bot phản hồi tức thì sau 800ms, giúp giải đáp thắc mắc không có độ trễ."*

---

### Bước 4: Wow Moment #3 — Chốt Hợp Đồng 1-Click & E-Sign (3:00 - 4:00)
- **Thao tác**:
  1. Bấm vào Dev Launcher góc trái dưới hoặc gõ URL `http://localhost:5173/?view=admin` để chuyển sang phân hệ Quản trị.
  2. Mở Hộp thư [`AdminInboxView.tsx`](file:///D:/AAA/src/components/AdminInboxView.tsx) $\rightarrow$ Xem tin nhắn của khách vừa gửi.
  3. Bấm nút **"Lập Hợp Đồng Thuê" 1-Click** $\rightarrow$ Chuyển sang màn hình [`ContractsView.tsx`](file:///D:/AAA/src/components/ContractsView.tsx).
  4. Mở modal ký hợp đồng $\rightarrow$ Thực hiện vẽ chữ ký trên **E-Sign Canvas** và bấm *"Kích hoạt hợp đồng"*.
  5. Mở [`DashboardView.tsx`](file:///D:/AAA/src/components/DashboardView.tsx) xem biểu đồ doanh thu và phí hoa hồng sàn vừa tự động cộng dồn.
- **Lời thoại trình bày**:
  > *"Chủ nhà quản lý tập trung toàn bộ khách thuê từ Chat. Chỉ với 1 click, thông tin từ cuộc trò chuyện tự động chuyển thành Hợp đồng thuê số, khách ký chữ ký điện tử trực tiếp trên màn hình. Ngay lập tức, căn hộ chuyển sang trạng thái Đang thuê, sinh hóa đơn thu tiền và tự động trích hoa hồng môi giới 50% cho nền tảng."*

---

### Bước 5: Động Cơ Doanh Thu & Kết Luận (4:00 - 4:30)
- **Thao tác**: Mở màn hình [`SubscriptionsView.tsx`](file:///D:/AAA/src/components/SubscriptionsView.tsx) và [`ServicesMarketplaceView.tsx`](file:///D:/AAA/src/components/ServicesMarketplaceView.tsx).
- **Lời thoại kết thúc**:
  > *"HAVEN tạo ra 4 dòng doanh thu bền vững: Thuê bao SaaS cho chủ nhà, Phí môi giới chốt cọc, Gói cư dân Prime Club cọc 0đ, và Hoa hồng Chợ dịch vụ buồng phòng chuyển nhà. HAVEN không chỉ là một ứng dụng tìm nhà, mà là chuẩn mực mới cho thị trường thuê bất động sản minh bạch tại Việt Nam."*
