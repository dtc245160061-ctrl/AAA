# HAVEN — Danh Sách Tính Năng & Backlog (Feature Backlog)

> **Phân loại**: P0 (Bắt buộc cốt lõi) · P1 (Khác biệt & Wow) · P2 (Mở rộng/Mô phỏng)
> **Quy ước trạng thái**: 🟢 Dữ liệu mẫu hoàn chỉnh | 🟡 API / Embed | 🔴 Mô phỏng Prototype

---

## 1. PHÂN HỆ P0 — BẮT BUỘC CỐT LÕI (MUST-HAVE)

| Mã | Tên tính năng | Phân loại | Component bị ảnh hưởng | Mô tả & Tiêu chí nghiệm thu |
|---|---|:---:|---|---|
| **B1** | **True Cost Breakdown Panel** | 🟢 | `UserUnitDetailView.tsx`, `UnitDetailModal.tsx` | Bảng tính phân rã chi tiết tiền thuê, điện (ước tính theo số phòng), nước, internet, phí dịch vụ, gửi xe. Hiển thị tổng chi phí/tháng và tổng tiền cọc + tháng đầu cần nộp lúc dọn vào. Có animation counter mượt mà. |
| **A1** | **True Cost Search & Filter** | 🟢 | `UserSearchView.tsx`, `UserHomeView.tsx` | Cho phép người dùng trượt thanh lọc theo "Tổng chi phí/tháng" thay vì chỉ giá thuê phòng. Thẻ căn hộ (Card) hiển thị số tiền tổng nổi bật màu Emerald. |
| **SF1** | **Bản Đồ An Tâm (Confidence Map)** | 🟡 | `ConfidenceMapView.tsx` (Mới), `BuildingTowerMap.tsx` | Bản đồ tương tác nhiều lớp toggle: Lớp rủi ro ngập lụt, Lớp an toàn PCCC, Tiện ích lân cận (Trường học, Bệnh viện). Có huy hiệu chỉ báo độ tin cậy và nguồn tham chiếu. |
| **C5** | **Landlord Trust Score System** | 🟢 | `LandlordProfileModal.tsx` (Mới), `UserUnitDetailView.tsx` | Chấm điểm uy tín chủ nhà từ 3.0 - 5.0★ dựa trên 4 chỉ số: Tốc độ phản hồi chat, Tỷ lệ hủy lịch xem, Đánh giá của cư dân, Mức độ xác minh danh tính. |
| **C6** | **Verified Listing Badge 3 Cấp** | 🟢 | `UserSearchView.tsx`, `UserHomeView.tsx`, `UserUnitDetailView.tsx` | Badge hiển thị 3 cấp: Cấp 1 (Chưa xác minh), Cấp 2 (Xác minh CCCD/SĐT), Cấp 3 (Xác minh Sổ đỏ & Ảnh gốc tại căn hộ). Tooltip giải thích rõ từng cấp. |
| **SF4** | **PCCC Transparency Card** | 🟢 | `UserUnitDetailView.tsx` | Thẻ thông tin an toàn PCCC gồm: Số thang thoát hiểm, Hệ thống chữa cháy tự động, Bình cứu hỏa, Giấy chứng nhận PCCC, kèm Disclaimer khuyến nghị kiểm tra thực tế. |
| **D1** | **Smart Question Chips 2.0** | 🟢 | `ChatModal.tsx` | Nâng cấp popup chat Shopee: Hệ thống tự động phân tích dữ liệu còn thiếu của căn phòng (ví dụ: chưa có thông tin nuôi thú cưng, chưa rõ chỗ đỗ ô tô) để đưa ra chip hỏi nhanh chính xác. |
| **D4** | **Đặt Lịch Xem Phòng Tích Hợp** | 🟢 | `UserUnitDetailView.tsx`, `LeadsView.tsx` | Người thuê chọn ngày & khung giờ xem phòng. Dữ liệu tự động đẩy vào hệ thống Leads của chủ nhà kèm trạng thái `viewing_scheduled`. |
| **B6** | **Deposit Terms Panel** | 🟢 | `UserUnitDetailView.tsx` | Bảng điều khoản cọc: Số tháng cọc, thời gian hoàn cọc (ví dụ: trong vòng 3 ngày sau khi trả phòng), điều kiện khấu trừ minh bạch. |
| **B7** | **Warning Badges & Cảnh Báo Giá** | 🟢 | `UserSearchView.tsx`, `UserUnitDetailView.tsx` | Tự động gắn nhãn cảnh báo nếu: Giá thấp hơn 30% so với khu vực (nghi vấn tin ảo), hoặc tin đăng không cập nhật quá 60 ngày. |

---

## 2. PHÂN HỆ P1 — TÍNH NĂNG KHÁC BIỆT & TẠO WOW (DIFFERENTIATORS)

| Mã | Tên tính năng | Phân loại | Component bị ảnh hưởng | Mô tả & Tiêu chí nghiệm thu |
|---|---|:---:|---|---|
| **SF3** | **Comparison Arena (Đấu trường so sánh)** | 🟢 | `UserCompareView.tsx` | Màn hình so sánh 2-3 căn hộ đặt cạnh nhau, tích hợp biểu đồ Radar Chart 5 chiều (Chi phí, An toàn, Tiện ích, Vị trí, Không gian) và gợi ý căn hộ phù hợp nhất từ AI. |
| **SF6** | **AI Housing Advisor 2.0** | 🟢 | `UserAiAdvisorDrawer.tsx` | Nâng cấp trợ lý AI tiếng Việt: Hiểu yêu cầu phức tạp kết hợp rủi ro ngập và chi phí thực tế (Ví dụ: "Tìm căn 2PN dưới 15tr tổng chi phí, không bao giờ ngập ở Quận 7"). |
| **D10** | **Trang Hồ Sơ Chủ Nhà (Landlord Profile)** | 🟢 | `LandlordProfileModal.tsx` (Mới) | Màn hình popup/trang chi tiết thông tin chủ nhà: Danh sách các căn đang cho thuê, đánh giá của khách thuê trước, tỷ lệ phản hồi, thời gian tham gia sàn. |
| **E13** | **Ký Hợp Đồng Điện Tử (E-Sign Canvas)** | 🟢 | `ContractsView.tsx`, `SignContractModal.tsx` (Mới) | Khung vẽ chữ ký trực tiếp trên màn hình, tạo mã hash bảo chứng hợp đồng và xuất file hợp đồng có chữ ký số mô phỏng. |
| **SF12**| **Marketplace Health Dashboard** | 🟢 | `DashboardView.tsx`, `AnalyticsOverview.tsx` | Bảng điều khiển quản trị theo dõi: Tỷ lệ tin xác minh, Thời gian chốt hợp đồng trung bình, Cơ cấu doanh thu theo từng dòng (SaaS, Phí sàn, VAS). |
| **E3** | **Checklist Nhận Phòng (Move-In Checklist)**| 🟢 | `MoveInChecklistView.tsx` (Mới) | Bộ công cụ 15 tiêu chí kiểm tra hiện trạng bàn giao phòng (điện, nước, vết xước tường, khóa cửa) để lưu làm bằng chứng hoàn cọc sau này. |

---

## 3. PHÂN HỆ P2 — MỞ RỘNG & MÔ PHỎNG PROTOYPE (EXPANSION)

| Mã | Tên tính năng | Phân loại | Component bị ảnh hưởng | Mô tả & Tiêu chí nghiệm thu |
|---|---|:---:|---|---|
| **SF8** | **Deposit Escrow Safety Flow** | 🔴 | `EscrowModal.tsx` (Mới) | Sơ đồ động trực quan mô phỏng luồng tiền cọc được giữ an toàn tại tài khoản bảo chứng HAVEN, chỉ giải ngân cho chủ nhà khi khách ký biên bản nhận phòng. |
| **C1**  | **eKYC & OCR Xác Minh Chủ Nhà** | 🔴 | `KycModal.tsx` (Mới) | Giao diện mô phỏng chụp mặt trước/sau CCCD và Sổ hồng với hiệu ứng quét quang học (Scanning Laser Animation) và tự động phê duyệt sau 2.5 giây. |
| **A2**  | **Commute Distance Finder** | 🟡 | `UserSearchView.tsx` | Tính toán thời gian di chuyển ước tính đến các địa điểm trọng yếu (Quận 1, Khu Công nghệ Cao, Sân bay Tân Sơn Nhất). |
