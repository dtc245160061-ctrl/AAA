# HAVEN — Mô Hình Doanh Thu Thương Mại (Monetization Engine)

> **Mục tiêu**: Hiện thực hóa mô hình kinh doanh PropTech bền vững, tạo dòng tiền thực tế cho nền tảng dựa trên giá trị minh bạch mà không vi phạm nguyên tắc bảo vệ quyền lợi người thuê.

---

## 1. NGUYÊN TẮC BẤT KHẢ XÂM PHẠM VỀ MONETIZATION

> [!IMPORTANT]
> **Quy tắc an toàn & minh bạch**: Toàn bộ thông tin liên quan đến an toàn tính mạng (Hồ sơ PCCC, Lớp bản đồ ngập lụt, Cảnh báo lừa đảo/giá bất thường, Huy hiệu xác minh cơ bản) **LUÔN ĐƯỢC CUNG CẤP HOÀN TOÀN MIỄN PHÍ** cho người thuê. HAVEN tuyệt đối không đặt tường phí (Paywall) lên các dữ liệu an toàn.

---

## 2. BỐN DÒNG DOANH THU THƯƠNG MẠI CHÍNH

### Dòng 1: Thuê Bao SaaS Quản Lý Cho Chủ Nhà (SaaS MRR)
Cung cấp bộ công cụ vận hành thông minh giúp chủ nhà quản lý nhiều căn hộ, tự động hóa trả lời khách và xuất hóa đơn:

| Gói dịch vụ | Mức giá | Giới hạn căn | Tính năng & Đặc quyền |
|---|---|:---:|---|
| **🆓 Starter** | **0 đ** / tháng | Tối đa 2 căn | Đăng tin cơ bản (3 ảnh), trả lời tin nhắn thủ công, xem báo cáo lượt xem đơn giản. |
| **⭐ HAVEN Pro** | **399.000 đ** / tháng | Tối đa 5 căn | AI gợi ý đăng tin thông minh (10 ảnh + video), Auto-Reply Shopee Bot, giảm 30% phí hoa hồng sàn, huy hiệu "Pro Landlord" phát quang ngọc lục bảo. |
| **🏢 Enterprise** | **1.999.000 đ** / tháng | Không giới hạn | Ủy thác vận hành, Hộp thư Multi-Agent, Ký hợp đồng số E-Sign không giới hạn, Xuất hóa đơn tự động và Báo cáo tài chính chuyên sâu. |

---

### Dòng 2: Phí Môi Giới Chốt Cọc Thành Công (Brokerage Commission)
- Khi khách gửi Inquiry $\rightarrow$ Chủ nhà chốt hợp đồng thuê thành công thông qua nền tảng HAVEN:
  - Thu từ chủ nhà **50% đến 100%** tiền thuê của tháng đầu tiên.
  - *Ví dụ*: Căn hộ giá thuê 12.000.000 đ/tháng $\rightarrow$ HAVEN thu phí hoa hồng môi giới 6.000.000 đ. Chủ nhà sử dụng gói Pro được giảm còn 4.200.000 đ.

---

### Dòng 3: Gói Hội Viên Khách Thuê (Resident Prime Club)
- **Mức phí**: **79.000 đ - 99.000 đ** / tháng (dành cho người thuê muốn nâng tầm trải nghiệm).
- **Đặc quyền**:
  - **Đặc quyền Cọc 0đ**: Bảo lãnh thanh toán thông qua đối tác tài chính (giải phóng áp lực nộp cọc 2-3 tháng).
  - **Miễn phí 02 buổi dọn dẹp buồng phòng / tháng** (tiết kiệm 240.000 đ).
  - **Giảm 20% phí chuyển nhà trọn gói** qua đối tác HAVEN Move.
  - **So sánh không giới hạn** tại Đấu trường so sánh (Comparison Arena) và quyền truy vấn AI Advisor cao cấp.

---

### Dòng 4: Hoa Hồng Chợ Tiện Ích Đời Sống (VAS Marketplace Take-Rate)
Nền tảng tích hợp các dịch vụ gia tăng kết nối với mạng lưới đối tác đã xác minh, trích hoa hồng **15% - 20%** trên mỗi đơn đặt hàng:

1. **🧹 Dọn dẹp vệ sinh buồng phòng**: 120.000 đ / 2 giờ *(Sàn nhận 24.000 đ)*.
2. **✨ Tổng vệ sinh khử khuẩn dọn vào / dọn ra**: 650.000 đ *(Sàn nhận 130.000 đ)*.
3. **🚚 Dịch vụ chuyển nhà trọn gói HAVEN Move**: 1.200.000 đ *(Sàn nhận 240.000 đ)*.
4. **🔐 Lắp đặt khóa thông minh FaceID / Vân tay IoT**: 2.800.000 đ *(Sàn nhận 420.000 đ)*.
5. **🛡️ Bảo hiểm nhà ở & rủi ro cháy nổ / rò rỉ**: 450.000 đ / năm *(Sàn nhận 90.000 đ)*.

---

## 3. CƠ CHẾ MÔ PHỎNG PHÍ BẢO CHỨNG GIAO DỊCH (ESCROW TAKE-RATE 5%)
- Trên giao diện quản lý thanh toán (`PaymentsView`), hệ thống tự động tính **5% phí bảo chứng vận hành** trên mỗi hóa đơn thu tiền nhà hàng tháng.
- Số tiền này được tự động trích vào quỹ bảo hiểm rủi ro tài sản và bảo trì khẩn cấp của HAVEN.
