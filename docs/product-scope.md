# HAVEN — Phạm Vi Sản Phẩm (Product Scope)

> **Dự án**: HAVEN — Nền tảng Tìm kiếm Căn hộ Cao cấp & Vận hành PropTech Chuẩn Sanctuary
> **Trạng thái**: Kế hoạch triển khai kỹ thuật (Technical Implementation Plan)
> **Ngày cập nhật**: 16/08/2026

---

## 1. Mục Tiêu Sản Phẩm (Product Vision)

HAVEN là nền tảng PropTech đầu tiên tại Việt Nam đặt **"Sự an tâm của người thuê" (Renter Confidence)** làm trục giá trị cốt lõi. Khác với các sàn đăng tin truyền thống (tập trung số lượng tin mồi nhử), HAVEN tập trung vào **chất lượng quyết định** thông qua nguyên tắc **"Biết rõ trước khi cọc"**:
- **Minh bạch tài chính**: Bóc tách tổng chi phí thực tế hàng tháng (True Cost Breakdown) thay vì chỉ hiển thị tiền thuê nhà danh nghĩa.
- **Minh bạch an toàn**: Tích hợp Bản đồ An tâm (Confidence Map) với lớp dữ liệu rủi ro ngập lụt, PCCC và hạ tầng giáo dục/y tế.
- **Minh bạch chủ nhà**: Định lượng uy tín chủ nhà (Landlord Trust Score) và cấp chứng chỉ tin đăng 3 cấp (Verified Badges).
- **Trải nghiệm khép kín**: Nhắn tin 2 chiều tức thì Shopee-style, đặt lịch xem phòng trực tuyến, và quy trình ký hợp đồng điện tử.

---

## 2. Chân Dung Người Dùng & Thứ Tự Ưu Tiên

1. **Ưu tiên 1 — Người thuê nhà tại Việt Nam (Consumer/Tenant)**:
   - *Đối tượng*: Người đi làm văn phòng, sinh viên, gia đình trẻ, chuyên gia tại các đô thị lớn (TP.HCM, Hà Nội, Đà Nẵng).
   - *Nhu cầu*: Không bị "bẫy chi phí ẩn", không sợ lừa đảo tiền cọc, biết rõ tình trạng ngập nước và an toàn PCCC, giao tiếp nhanh chóng với chủ nhà.

2. **Ưu tiên 2 — Chủ nhà & Quản lý tòa nhà (Landlord/Host)**:
   - *Đối tượng*: Chủ căn hộ đơn lẻ (1-2 căn), chủ mini apartment (3-10 căn), ban quản lý vận hành tòa nhà.
   - *Nhu cầu*: Tiếp cận khách thuê chất lượng, giảm thời gian phòng trống, có công cụ tự động hóa trả lời chat, lập hợp đồng và quản lý dòng tiền.

3. **Ưu tiên 3 — Quản trị viên sàn (HAVEN Admin & Operations)**:
   - *Nhu cầu*: Kiểm duyệt tin đăng (Moderation Queue), giám sát chỉ số sức khỏe sàn (Marketplace Health), quản lý doanh thu và xử lý vi phạm.

---

## 3. Phạm Vi Phiên Bản Hiện Tại (Release Scope)

### 3.1 Nhóm tính năng triển khai trên Codebase (🟢 & 🟡)
- **True Cost Breakdown**: Bóc tách chi tiết: Thuê + Điện (ước tính theo biểu giá thực) + Nước + Internet + Phí quản lý + Gửi xe. Tính năng hiển thị ở cả danh sách tìm kiếm và chi tiết căn hộ.
- **Bản Đồ An Tâm (Confidence Map)**: Bản đồ tương tác nhiều lớp: Lớp rủi ro ngập lụt (tham chiếu UDI/HSDC), Lớp kiểm tra PCCC, Tiện ích giáo dục & y tế trong bán kính 1km.
- **Landlord Trust Score & 3-Tier Badges**: Hệ thống chấm điểm uy tín chủ nhà (3.0 - 5.0★) dựa trên tỷ lệ phản hồi, lịch sử giao dịch và giấy tờ xác minh (Chưa xác minh / Đã xác minh CCCD / Đầy đủ Sổ đỏ & Hiện trạng).
- **PCCC Transparency Card**: Thẻ thông tin phòng cháy chữa cháy có ngữ cảnh (Thang thoát hiểm, đầu phun sprinkler, bình chữa cháy, tình trạng nghiệm thu kèm disclaimer pháp lý).
- **Comparison Arena**: So sánh trực quan 2-3 căn hộ cạnh nhau kèm biểu đồ Radar Chart đa chiều (Chi phí, An toàn, Vị trí, Tiện ích, Không gian).
- **Smart Question Chips 2.0**: Gợi ý câu hỏi thông minh trong khung chat Shopee-style dựa trên dữ liệu còn thiếu của căn hộ.
- **Đặt lịch xem phòng tích hợp**: Chọn khung giờ trực tiếp từ chi tiết phòng và đồng bộ vào hệ thống Leads của Admin.
- **E-Signature Canvas Prototype**: Khung vẽ chữ ký điện tử trực tiếp trên màn hình hợp đồng thuê nhà.
- **SaaS & VAS Monetization View**: Bảng giá SaaS quản lý nhà và Chợ tiện ích cư dân (Dọn dẹp, Chuyển nhà, Khóa cửa thông minh, Bảo hiểm).

### 3.2 Nhóm tính năng mô phỏng Prototype Demo (🔴 & ⚖️)
- **Escrow Cọc (Cọc Bảo Chứng)**: Mô phỏng luồng tiền ký quỹ an toàn bằng sơ đồ tương tác và trạng thái giao dịch (chưa tích hợp cổng thanh toán ngân hàng thật).
- **eKYC & OCR Giấy tờ**: Mô phỏng tải lên CCCD/Sổ hồng với thanh tiến trình quét tự động và phê duyệt sau 2-3 giây.
- **Dữ liệu PCCC & Ngập lụt**: Sử dụng bộ dữ liệu mẫu có cấu trúc thực tế của TP.HCM / Hà Nội kèm nhãn *"Dữ liệu tham chiếu thử nghiệm"*.

### 3.3 Hạng mục loại trừ (Out of Scope)
- Hệ thống xử lý tranh chấp pháp lý thực tế (Dispute Center).
- Tích hợp cổng thanh toán trực tiếp đòi hỏi giấy phép trung gian thanh toán (Payment Gateway live keys).
