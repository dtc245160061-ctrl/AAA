# HAVEN — Nghiên Cứu Sản Phẩm (Phần 2: Kho Ý Tưởng & Signature Features)

---

## 6. Kho Ý Tưởng Tính Năng (105 Ý Tưởng)

> **Quy ước**: 🟢 = Có thể làm bằng dữ liệu mẫu | 🟡 = Cần API bên ngoài/dữ liệu thật | 🔴 = Chỉ nên mô phỏng prototype | ⚖️ = Rủi ro pháp lý/vận hành

### A. Tìm Kiếm & Khám Phá Căn Hộ (18 ý tưởng)

| # | Ý tưởng | Mô tả ngắn | Người hưởng lợi | Khả thi |
|---|---------|-------------|-----------------|---------|
| A1 | **Tìm theo Tổng Chi Phí Thật (True Cost Search)** | Bộ lọc dựa trên tổng chi phí/tháng (thuê + điện + nước + internet + phí QL + gửi xe) thay vì chỉ giá thuê | Người thuê | 🟢 |
| A2 | **Tìm theo Thời Gian Di Chuyển (Commute Finder)** | Nhập địa chỉ công ty/trường → lọc căn hộ theo thời gian di chuyển thực tế (xe máy/ô tô/xe buýt) | Người thuê | 🟡 Google Maps API |
| A3 | **Tìm theo Rủi Ro Ngập (Flood-Safe Search)** | Lọc căn hộ theo mức độ ngập lụt khu vực, dựa trên dữ liệu UDI Maps/HSDC Maps | Người thuê (gia đình, người có ô tô) | 🟡 Dữ liệu ngập bên ngoài |
| A4 | **Tìm theo Pet-Friendly** | Filter căn hộ cho phép nuôi thú cưng, hiển thị policy (loại, kích thước, cọc thêm) | Người thuê có thú cưng | 🟢 |
| A5 | **Tìm theo Ngân Sách Toàn Diện** | Nhập thu nhập → HAVEN gợi ý mức thuê hợp lý (30% thu nhập), lọc phù hợp | Người thuê | 🟢 |
| A6 | **Tìm theo Mức Độ Yên Tĩnh** | Tag yên tĩnh/ồn dựa trên report cộng đồng (gần đường lớn, gần công trình, quán bar) | Người thuê WFH, gia đình | 🟢 Crowdsource |
| A7 | **Tìm theo Trường Học/Bệnh Viện** | Lọc theo khoảng cách đến trường mầm non/tiểu học hoặc bệnh viện cụ thể | Gia đình có con nhỏ | 🟡 Google Places API |
| A8 | **Tìm theo Chỗ Đỗ Ô Tô** | Filter có/không có chỗ đỗ, loại (hầm/ngoài trời), phí gửi/tháng | Người có ô tô | 🟢 |
| A9 | **Tìm theo Nội Thất** | Lọc: đầy đủ / cơ bản / trống; liệt kê danh sách nội thất cụ thể | Mọi người thuê | 🟢 |
| A10 | **Tìm theo Hướng & Tầng** | Filter hướng ban công (Đông/Tây/Nam/Bắc), tầng (cao/thấp/trung), view | Người thuê Việt Nam (hướng quan trọng văn hóa) | 🟢 |
| A11 | **Tìm theo Tình Trạng Bàn Giao** | Đang trống → vào ngay / Sắp trống (ngày cụ thể) / Đang xây → Q4/2026 | Người cần chuyển gấp vs. lên kế hoạch | 🟢 |
| A12 | **Tìm theo Ánh Sáng Tự Nhiên** | Tag dựa trên hướng + tầng + có bị che khuất không (self-report) | Người thuê WFH, yêu cầu chất lượng sống | 🟢 Crowdsource |
| A13 | **Bản Đồ Nhiều Lớp (Multi-Layer Map)** | Overlay: Ngập / Giao thông / Trường học / Bệnh viện / Bãi đỗ xe / ATM / Siêu thị | Mọi người thuê | 🟡 Multiple APIs |
| A14 | **Khu Vực Đề Xuất (Neighborhood Guide)** | Mỗi quận/phường có "profile": giá trung bình, an ninh, tiện ích, giao thông, phong cách sống | Người mới đến thành phố | 🟢 Dữ liệu mẫu + crowdsource |
| A15 | **Tìm kiếm Ngôn Ngữ Tự Nhiên (NLP Search)** | "Tìm căn hộ 2 phòng ngủ gần Vincom quận 7 dưới 12 triệu nuôi chó được" | Mọi người thuê | 🟢 AI đã có (UserAiAdvisorDrawer) |
| A16 | **Tìm theo Thời Hạn Thuê** | Filter: Ngắn hạn (<6 tháng) / 12 tháng / Dài hạn (>12 tháng) / Linh hoạt | Thực tập sinh, expat, người thuê dài hạn | 🟢 |
| A17 | **Tìm theo Nhà Mạng Internet** | Căn hộ kết nối FPT/Viettel/VNPT, tốc độ thực tế (community report) | Remote worker | 🟢 Crowdsource |
| A18 | **Tìm theo Điện Dự Phòng** | Filter có/không có máy phát điện dự phòng toàn tòa | Remote worker, gia đình có trẻ nhỏ | 🟢 |

---

### B. Trang Chi Tiết & Tính Minh Bạch (14 ý tưởng)

| # | Ý tưởng | Mô tả ngắn | Người hưởng lợi | Khả thi |
|---|---------|-------------|-----------------|---------|
| B1 | **Bảng Tổng Chi Phí Ước Tính (Cost Breakdown Panel)** | Hiển thị: Tiền thuê + Điện (ước tính) + Nước + Internet + Phí QL + Gửi xe + Cọc = **Tổng ước tính/tháng** và **tổng cần trả khi vào** | Người thuê | 🟢 |
| B2 | **Checklist Xem Nhà (Viewing Checklist)** | Danh sách 15-20 mục cần kiểm tra khi đến xem (nước nóng, ổ điện, signal wifi, cửa khóa, mùi, thoát hiểm) | Người thuê lần đầu | 🟢 |
| B3 | **Bộ Câu Hỏi Gợi Ý Cho Chủ Nhà (Landlord Q&A Prompt)** | Gợi ý 10 câu hỏi quan trọng nên hỏi (hoàn cọc, tăng giá, sửa chữa ai chịu, thú cưng, khách ở qua đêm) | Người thuê (đặc biệt trẻ) | 🟢 |
| B4 | **Lịch Sử Cập Nhật Tin (Edit History)** | Hiển thị timeline: "Giá thay đổi từ 8tr → 9tr ngày 15/7" hoặc "Ảnh cập nhật ngày 10/8" | Người thuê | 🟢 |
| B5 | **Mức Khớp Ảnh-Mô Tả (Photo Accuracy Score)** | Điểm crowdsource từ người đã xem nhà: "Ảnh đúng 85% thực tế" | Người thuê | 🟢 Crowdsource |
| B6 | **Điều Kiện Hoàn Cọc (Deposit Terms Panel)** | Hiển thị rõ: Cọc bao nhiêu tháng, điều kiện hoàn, thời gian hoàn, trường hợp giữ cọc | Mọi người thuê | 🟢 |
| B7 | **Thẻ Cảnh Báo (Warning Badges)** | "Giá thấp bất thường so với khu vực" / "Tin 90 ngày chưa cập nhật" / "Chủ nhà chưa xác minh" | Người thuê | 🟢 |
| B8 | **Timeline Đánh Giá Theo Mùa (Seasonal Review)** | Review từ người đã ở, tag theo mùa: "Mùa mưa: hơi ẩm tầng 2" / "Mùa hè: nóng chiều Tây" | Người thuê | 🟢 |
| B9 | **Virtual Tour / Video Tour** | Hỗ trợ video 360° hoặc walkthrough video do chủ nhà upload | Mọi người thuê, expat | 🟡 Cần upload infrastructure |
| B10 | **So Sánh Giá Khu Vực (Area Price Benchmark)** | "Căn này giá 10tr/tháng — trung bình khu vực: 9.5tr" (dựa trên data nền tảng) | Người thuê | 🟢 Dữ liệu nội bộ |
| B11 | **Thông Tin Quy Tắc Tòa Nhà** | Giờ giới nghiêm, quy định ban công, quy định thú cưng, quy định nấu ăn | Mọi người thuê | 🟢 |
| B12 | **Bảng Tiện Ích Xung Quanh** | Bán kính 500m-1km: siêu thị, trạm xăng, ATM, quán cà phê, phòng gym, công viên | Mọi người thuê | 🟡 Google Places |
| B13 | **Chỉ Số Chất Lượng Sống (Living Score)** | Điểm tổng hợp: Giao thông (A) + An ninh (B) + Tiện ích (C) + Yên tĩnh (B+) = **Sống tốt: 8.2/10** | Mọi người thuê | 🟢 Thuật toán nội bộ |
| B14 | **Thông Tin Hàng Xóm Ẩn Danh** | "Tòa này chủ yếu: 60% gia đình, 30% đi làm, 10% sinh viên" (aggregate, không cá nhân) | Gia đình, người yên tĩnh | 🟢 Aggregate data |

---

### C. Niềm Tin, Chống Lừa Đảo & An Toàn (16 ý tưởng)

| # | Ý tưởng | Mô tả ngắn | Người hưởng lợi | Khả thi |
|---|---------|-------------|-----------------|---------|
| C1 | **Xác Minh Danh Tính Chủ Nhà (ID Verification)** | Upload CCCD + selfie đối chiếu → badge "Đã xác minh danh tính" | Người thuê | 🟡 eKYC API |
| C2 | **Xác Minh Quyền Cho Thuê** | Upload sổ đỏ / hợp đồng ủy quyền → badge "Có quyền cho thuê" | Người thuê | 🟡 Manual review + OCR |
| C3 | **Xác Minh Địa Chỉ (Address Verification)** | Đối chiếu ảnh/video tại căn hộ thật vs. địa chỉ đăng | Người thuê | 🔴 Phức tạp |
| C4 | **Xác Minh Ảnh Gốc (Photo Authenticity)** | Kiểm tra EXIF, reverse image search, phát hiện ảnh stock/lấy từ nguồn khác | Người thuê | 🟡 AI + reverse search |
| C5 | **Điểm Uy Tín Chủ Nhà (Landlord Trust Score)** | Tổng hợp: xác minh + tỷ lệ phản hồi + thời gian hoạt động + review + tỷ lệ hủy + số report | Người thuê | 🟢 |
| C6 | **Nhãn Tin Đã Kiểm Tra (Verified Listing Badge)** | 3 cấp: ☐ Chưa xác minh / ✓ Cơ bản (CCCD) / ✓✓ Đầy đủ (CCCD + Sổ đỏ + Ảnh gốc) | Người thuê | 🟢 |
| C7 | **Cảnh Báo Giá Bất Thường (Price Anomaly Alert)** | Tự động flag tin có giá thấp hơn ≥30% so với trung bình khu vực | Người thuê + Admin | 🟢 |
| C8 | **Phát Hiện Tin Trùng Lặp (Duplicate Detection)** | AI so sánh ảnh + mô tả → flag tin trùng (cùng căn đăng bởi nhiều người) | Admin | 🟢 Hash + AI |
| C9 | **Lịch Sử Phản Hồi & Thời Gian Hoạt Động** | Hiển thị: "Trung bình reply trong 2 giờ" / "Hoạt động 8 tháng trên HAVEN" | Người thuê | 🟢 |
| C10 | **Tỷ Lệ Hủy/Thay Đổi** | "Chủ nhà này: 0% hủy lịch xem, 5% thay đổi giá sau đăng" | Người thuê | 🟢 |
| C11 | **Cơ Chế Báo Cáo Đa Lớp** | Báo cáo: Ảnh sai / Giá sai / Lừa đảo / Quấy rối / Khác → workflow khác nhau | Người thuê + Admin | 🟢 |
| C12 | **Chặn Người Dùng** | Người thuê chặn chủ nhà (không thấy tin) hoặc ngược lại | Mọi người | 🟢 |
| C13 | **Thông Tin PCCC Có Ngữ Cảnh** | Hiển thị dạng: "Tòa nhà có 2 cầu thang thoát hiểm / Hệ thống sprinkler / Giấy nghiệm thu: [Có/Chưa xác minh/Không có thông tin]" thay vì icon xanh/đỏ | Người thuê, gia đình | 🟡 Tự khai + xác minh ⚖️ |
| C14 | **Escrow Cọc (Cọc Bảo Chứng)** | Tiền cọc giữ tại HAVEN, chỉ chuyển cho chủ nhà khi người thuê confirm nhận phòng | Mọi người | 🔴 Cần license tài chính ⚖️ |
| C15 | **Hệ Thống Giải Quyết Tranh Chấp (Dispute Center)** | Quy trình: Nộp bằng chứng → Review → Phán quyết → Thực hiện | Mọi người | 🔴 Phức tạp ⚖️ |
| C16 | **Privacy Controls** | Chủ nhà chọn info nào hiển thị công khai vs. chỉ hiển thị sau khi xác minh người thuê | Chủ nhà | 🟢 |

---

### D. Chat, Theo Dõi & Quan Hệ Với Chủ Nhà (12 ý tưởng)

| # | Ý tưởng | Mô tả ngắn | Người hưởng lợi | Khả thi |
|---|---------|-------------|-----------------|---------|
| D1 | **Mẫu Câu Hỏi Thông Minh (Smart Question Chips)** | Chips auto-generate dựa trên info thiếu: nếu tin chưa ghi pet policy → chip "Nuôi thú cưng OK?" | Người thuê | 🟢 (mở rộng từ Quick Chips hiện có) |
| D2 | **Trả Lời Nhanh Chủ Nhà (Canned Replies 2.0)** | Template: "Cọc 2 tháng, hoàn 100% nếu..." / "Lịch xem: T2-T6 9h-17h" — auto-fill từ tin đăng | Chủ nhà | 🟢 (đã có cơ bản) |
| D3 | **Chia Sẻ Tài Liệu Trong Chat** | Gửi ảnh hợp đồng mẫu, biên nhận, ảnh hiện trạng phòng → lưu trong thread | Cả hai | 🟢 |
| D4 | **Đặt Lịch Xem Tích Hợp** | Chọn slot từ lịch chủ nhà ngay trong chat → nhắc SMS/Zalo trước 2 giờ | Cả hai | 🟢 |
| D5 | **Nhắc Lịch & Xác Nhận** | 24h trước xem nhà: "Bạn có đến không?" → Confirm / Hủy / Đổi giờ | Cả hai (giảm "khách ma") | 🟢 |
| D6 | **Trạng Thái Đã Xem + Chống Spam** | Seen marker + Giới hạn: 1 tin nhắn đầu tiên/căn hộ (phải chờ reply mới gửi tiếp) | Cả hai | 🟢 |
| D7 | **Lọc Tin Quan Trọng** | Auto-tag: "Thỏa thuận" / "Lịch hẹn" / "Tài liệu" → filter nhanh | Cả hai | 🟢 |
| D8 | **Lưu Lịch Sử Thỏa Thuận** | Highlight + pin thỏa thuận trong chat → reference khi ký hợp đồng | Cả hai | 🟢 |
| D9 | **Theo Dõi Chủ Nhà (Follow Landlord)** | Follow → nhận thông báo khi chủ nhà đăng căn mới | Người thuê | 🟢 |
| D10 | **Trang Hồ Sơ Chủ Nhà (Landlord Profile)** | Hồ sơ công khai: Xác minh ✓, 12 căn đang hoạt động, reply trung bình 1.5h, rating 4.7/5, "Hoạt động từ 03/2025" | Người thuê | 🟢 |
| D11 | **Huy Hiệu Chủ Nhà** | "Phản hồi nhanh" (<2h) / "Uy tín cao" (>4.5 sao, >10 review) / "Chủ nhà mới" | Cả hai | 🟢 |
| D12 | **Report & Block Trong Chat** | Báo cáo quấy rối/spam ngay trong conversation → auto-escalate nếu >3 report | Mọi người | 🟢 |

**Lý do người thuê muốn Follow chủ nhà (D9)**:
1. Chủ nhà uy tín hay có nhiều căn → khi hết hợp đồng muốn tìm căn khác của cùng chủ
2. Chủ nhà sắp có căn mới (đang sửa/xây) → muốn đặt trước
3. Giá căn hiện tại hơi cao → chờ chủ nhà đăng căn rẻ hơn

**Chống biến Follow thành spam**: Giới hạn notification 1 lần/tuần tổng hợp; unfollow 1 click; chủ nhà không biết ai follow cụ thể (chỉ thấy tổng số)

---

### E. Sau Khi Thuê & Quản Lý Đời Sống (13 ý tưởng)

| # | Ý tưởng | Mô tả | Nền tảng / Mở rộng | Khả thi |
|---|---------|-------|---------------------|---------|
| E1 | **Kho Tài Liệu Số (Document Vault)** | Lưu hợp đồng, biên nhận cọc, ảnh hiện trạng, biên bản bàn giao | Nền tảng | 🟢 |
| E2 | **Nhắc Hạn Thanh Toán** | Push notification / SMS trước 3 ngày đến hạn tiền thuê | Nền tảng | 🟢 |
| E3 | **Checklist Nhận Nhà** | 20 mục + upload ảnh hiện trạng → bằng chứng khi hoàn cọc | Nền tảng | 🟢 |
| E4 | **Ghi Nhận Hiện Trạng (Condition Log)** | Chụp ảnh + ghi chú tình trạng từng phòng khi nhận nhà | Nền tảng | 🟢 |
| E5 | **Yêu Cầu Sửa Chữa (Maintenance Request)** | Gửi yêu cầu + ảnh/video → chủ nhà xác nhận → theo dõi trạng thái | Nền tảng | 🟢 |
| E6 | **Theo Dõi Xử Lý Sự Cố** | Timeline: Báo → Xác nhận → Lên lịch thợ → Hoàn thành → Đánh giá | Nền tảng | 🟢 |
| E7 | **Đánh Giá Sau Khi Ở (Post-Stay Review)** | Review sau 3 tháng / 6 tháng / khi rời đi — có ngữ cảnh thời gian ở | Nền tảng | 🟢 |
| E8 | **Nhắc Gia Hạn Hợp Đồng** | 60 ngày trước hết hạn: "Hợp đồng sắp hết — Gia hạn / Tìm mới?" | Nền tảng | 🟢 |
| E9 | **Hỗ Trợ Chuyển Đi** | Checklist chuyển đi + kết nối dịch vụ chuyển nhà + hủy đăng ký tạm trú | Mở rộng | 🟢 |
| E10 | **Hoàn Cọc Minh Bạch** | Quy trình: Checklist ra → So sánh hiện trạng vào/ra → Tính khấu trừ → Hoàn | Mở rộng | 🟢 |
| E11 | **Chia Sẻ Hóa Đơn (Bill Split)** | Chia tiền điện/nước giữa roommate → mỗi người thấy phần mình | Mở rộng | 🟢 |
| E12 | **Kết Nối Dịch Vụ Chuyển Nhà** | Đối tác: dọn dẹp, chuyển nhà, lắp internet, bảo hiểm | Mở rộng (VAS) | 🟢 (đã có VAS Marketplace) |
| E13 | **Hợp Đồng Số (Digital Contract)** | Template hợp đồng chuẩn, điền auto từ info tin đăng + người thuê | Nền tảng | 🟢 ⚖️ Cần tư vấn pháp lý |

---

### F. Tính Năng Dành Cho Chủ Nhà (12 ý tưởng)

| # | Ý tưởng | Mô tả | Khả thi |
|---|---------|-------|---------|
| F1 | **AI Hỗ Trợ Đăng Tin (Smart Listing Creator)** | Upload ảnh → AI gợi ý mô tả, highlight, giá, thông tin còn thiếu | 🟢 |
| F2 | **Gợi Ý Giá Thị Trường (Market Price Suggestion)** | Dựa trên quận, diện tích, số phòng, tầng → "Giá đề xuất: 8-10 triệu" | 🟢 Dữ liệu nội bộ |
| F3 | **Quản Lý Lịch Xem (Viewing Calendar)** | Drag-drop slots trống → khách tự đặt → auto-confirm hoặc manual | 🟢 |
| F4 | **Quản Lý Nhiều Căn (Multi-Unit Dashboard)** | Tổng quan: Căn 1 (Đang thuê) / Căn 2 (Trống 5 ngày) / Căn 3 (Bảo trì) | 🟢 (đã có cơ bản) |
| F5 | **Phân Tích Tin Đăng (Listing Analytics)** | Lượt xem, lượt lưu, lượt chat, tỷ lệ xem→lead, so sánh với căn tương tự | 🟢 |
| F6 | **Gợi Ý Cải Thiện Tin (Listing Optimizer)** | "Thêm ảnh phòng tắm (+20% engagement)" / "Ghi rõ phí gửi xe (+15% trust)" | 🟢 |
| F7 | **Lọc Lead Theo Tiêu Chí Công Bằng** | Chủ nhà set: ngân sách tối thiểu, thời hạn thuê, số người ở — KHÔNG được lọc theo giới, tuổi, dân tộc | 🟢 |
| F8 | **Quản Lý Tài Liệu** | Lưu sổ đỏ, hợp đồng ủy quyền, giấy nghiệm thu PCCC — mã hóa, chỉ chủ nhà và admin xem | 🟢 |
| F9 | **Nhắc Bảo Trì Định Kỳ** | "Bảo dưỡng điều hòa: 6 tháng kể từ lần cuối" / "Hợp đồng hết hạn trong 30 ngày" | 🟢 |
| F10 | **Tự Động Hóa Có Kiểm Soát** | Auto-reply "Căn này đã cho thuê" khi status = occupied; Auto-ẩn tin hết hạn | 🟢 |
| F11 | **Dashboard Doanh Thu** | Tổng thu/tháng, chi phí bảo trì, thời gian trống trung bình, ROI/căn | 🟢 |
| F12 | **Xuất Báo Cáo Thuế** | Tổng thu nhập cho thuê/năm, chi phí, lợi nhuận — hỗ trợ kê khai thuế | 🟡 Cần tư vấn thuế |

---

### G. Tính Năng Admin & Vận Hành (10 ý tưởng)

| # | Ý tưởng | Mô tả | Khả thi |
|---|---------|-------|---------|
| G1 | **Bảng Kiểm Duyệt Tin (Moderation Queue)** | Tin mới → Auto-check (ảnh trùng, giá bất thường, từ khóa spam) → Manual review | 🟢 |
| G2 | **Xử Lý Báo Cáo (Report Management)** | Workflow: Nhận → Phân loại → Điều tra → Xử lý → Thông báo | 🟢 |
| G3 | **Phát Hiện Tin Trùng & Spam** | AI scan ảnh + mô tả → flag trùng lặp hoặc spam pattern | 🟢 |
| G4 | **Quản Lý Gói Trả Phí** | Danh sách subscriber, billing cycle, revenue, churn rate | 🟢 |
| G5 | **Nhật Ký Hành Động (Admin Audit Log)** | Mọi action admin: ẩn tin, khóa tài khoản, duyệt xác minh → timestamp + reason | 🟢 |
| G6 | **Thống Kê Marketplace Health** | KPI: Tỷ lệ tin xác minh, thời gian duyệt TB, report/tuần, user retention | 🟢 |
| G7 | **Quản Lý Nội Dung (Content Management)** | Quản lý Neighborhood Guide, FAQ, trang hướng dẫn | 🟢 |
| G8 | **Hỗ Trợ Tranh Chấp (Dispute Dashboard)** | Timeline tranh chấp, bằng chứng 2 bên, quyết định, follow-up | 🔴 |
| G9 | **User Management** | Danh sách user, trạng thái xác minh, lịch sử report, suspend/ban | 🟢 |
| G10 | **Revenue Dashboard** | Tổng doanh thu theo stream (SaaS / Commission / VAS / Ads), trend, forecast | 🟢 |

---

### H. Tính Năng Tạo Ấn Tượng Khi Trình Bày (10 ý tưởng)

| # | Ý tưởng | Wow factor | Khả thi |
|---|---------|------------|---------|
| H1 | **Bản Đồ An Tâm (Confidence Map)** | Overlay: ngập + PCCC + trường + bệnh viện + an ninh + giao thông trên một bản đồ → "swipe để so sánh 2 khu vực" | 🟢🟡 |
| H2 | **True Cost Calculator** | Animation: "Bạn nghĩ trả 10tr? Thực ra bạn trả 13.5tr" → breakdown từng khoản | 🟢 |
| H3 | **Commute Simulator** | "Từ căn hộ này đến công ty: 25 phút xe máy (giờ bình thường), 55 phút (giờ cao điểm)" | 🟡 |
| H4 | **Apartment Comparison Arena** | So sánh 3 căn side-by-side với radar chart (giá, an toàn, tiện ích, commute, chất lượng sống) | 🟢 |
| H5 | **AI Housing Advisor Demo** | Chat bằng tiếng Việt: "Tôi có con nhỏ, ngân sách 15tr, sợ ngập" → AI recommend top 3 | 🟢 (đã có) |
| H6 | **Live Landlord Response Demo** | Demo 2 tab: Khách gửi tin → Tab admin thấy notification → Reply → Khách thấy ngay | 🟢 (đã có) |
| H7 | **Deposit Safety Flow** | Demo: Cọc → Giữ tại HAVEN → Khách confirm nhận phòng → Tiền chuyển cho chủ | 🟢 Prototype |
| H8 | **Marketplace Health Dashboard** | Admin thấy real-time: "98% tin đã xác minh, report/tuần giảm 15%, avg reply 1.2h" | 🟢 |
| H9 | **Smart Listing Creation** | Chủ nhà upload 5 ảnh → AI auto-generate mô tả + gợi ý giá + flag thiếu info | 🟢 |
| H10 | **Move-In Checklist Demo** | Demo app: Tick từng mục + chụp ảnh hiện trạng → auto-save → reference khi ra | 🟢 |

---

## 7. Signature Features (12 Ý Tưởng Chi Tiết)

### SF1: BẢN ĐỒ AN TÂM (CONFIDENCE MAP)

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Bản Đồ An Tâm (Confidence Map) |
| **Vấn đề giải quyết** | Người thuê phải kiểm tra 5-7 nguồn rời rạc (Google Maps, UDI Maps, báo chí, hỏi hàng xóm) để đánh giá khu vực — tốn 2-3 giờ mỗi căn hộ |
| **Câu chuyện người dùng** | Anh Tuấn có con nhỏ, sợ ngập và PCCC. Hiện tại phải mở UDI Maps kiểm tra ngập, Google Maps xem trường gần đây, rồi gọi điện ban quản lý hỏi PCCC. Trên HAVEN, anh mở Bản Đồ An Tâm và thấy tất cả trong 30 giây |
| **Luồng tương tác** | Bấm icon "Bản đồ An Tâm" trên trang chi tiết → Bản đồ mở với căn hộ ở trung tâm → Toggle các lớp: Ngập / PCCC / Trường / Bệnh viện / An ninh → Mỗi lớp có chỉ báo mức độ tin cậy + ngày cập nhật |
| **Dữ liệu cần** | Tọa độ căn hộ, dữ liệu ngập (UDI Maps/HSDC Maps), vị trí trường/bệnh viện (Google Places), info PCCC (self-report + crowd), dữ liệu an ninh (crowd) |
| **Demo bằng dữ liệu mẫu** | Tạo 5-10 căn hộ mẫu ở các quận có đặc điểm khác nhau; dữ liệu ngập/PCCC là mock nhưng ghi rõ "Dữ liệu mẫu — nguồn thật: UDI Maps" |
| **Rủi ro** | Dữ liệu không chính xác → người thuê quyết định sai → trách nhiệm pháp lý. **Giải pháp**: Luôn ghi nguồn, ngày cập nhật, mức tin cậy, disclaimer "Thông tin tham khảo, kiểm tra thực tế trước khi quyết định" |
| **Phù hợp VN vì** | VN có vấn đề ngập nghiêm trọng (TP.HCM, Hà Nội), PCCC chung cư là nỗi ám ảnh sau các vụ cháy lớn (Khương Hạ 2023), khoảng cách trường/bệnh viện rất quan trọng với gia đình VN |

### SF2: TỔNG CHI PHÍ THẬT (TRUE COST REVEAL)

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | True Cost Reveal — "Bạn nghĩ trả bao nhiêu? Đây mới là con số thật" |
| **Vấn đề** | 9/10 tin đăng chỉ ghi giá thuê, không ghi điện bậc thang, nước, internet, phí quản lý, phí gửi xe → shock tài chính khi vào ở |
| **Câu chuyện** | Hương thấy tin "8 triệu/tháng" → hào hứng cọc → vào ở mới biết: điện 1.5tr (bậc thang), nước 200k, phí QL 700k, gửi xe 200k = **10.6 triệu** |
| **Luồng tương tác** | Trên trang chi tiết: animated counter "Giá thuê: 8.000.000đ" → expand → từng khoản hiện ra với animation → tổng: "**Ước tính chi phí thật: 10.600.000đ/tháng**" + "Cần trả khi vào: **29.200.000đ** (cọc 2 tháng + tháng đầu + phí)" |
| **Dữ liệu** | Giá thuê, giá điện (bậc thang hoặc đồng giá), giá nước, internet, phí QL, phí gửi xe, tiền cọc |
| **Demo** | Hoàn toàn bằng dữ liệu mẫu, tạo 3-5 ví dụ có mức chênh lệch khác nhau |
| **Phù hợp VN** | Giá điện bậc thang là đặc thù VN (EVN); phí dịch vụ chung cư VN rất đa dạng (5k-25k/m²); phí gửi xe là chi phí ẩn lớn |

### SF3: APARTMENT COMPARISON ARENA

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Comparison Arena — So sánh 3 căn hộ trong 1 màn hình |
| **Vấn đề** | Người thuê mở 5 tab trình duyệt, ghi ra giấy để so sánh → quên, nhầm lẫn |
| **Luồng tương tác** | Lưu 3 căn vào "So sánh" → Mở Arena → Ma trận: Tổng chi phí / Rủi ro / Commute / Tiện ích / Chủ nhà (rating) → Radar chart tổng hợp → CTA: "Căn #2 phù hợp nhất với bạn" |
| **Demo** | 3 căn mẫu có profile rất khác nhau (rẻ nhưng xa / đắt nhưng an toàn / trung bình) |
| **Phù hợp VN** | Người Việt thường thuê qua giới thiệu/cảm tính → công cụ so sánh data-driven tạo lợi thế |

### SF4: PCCC TRANSPARENCY CARD

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Thẻ An Toàn PCCC — Biến thông tin phòng cháy thành ngôn ngữ người thuê hiểu được |
| **Vấn đề** | Sau vụ Khương Hạ (2023), 4.112 vụ cháy năm 2024, PCCC là nỗi lo #1 nhưng người thuê không có cách kiểm tra |
| **Luồng tương tác** | Card hiển thị: ① Số cầu thang thoát hiểm ② Có hệ thống sprinkler? ③ Có giấy nghiệm thu PCCC? ④ Lần kiểm tra gần nhất ⑤ Nguồn: [Chủ nhà tự khai / Đã xác minh / Chưa có thông tin] |
| **Khi chưa xác minh** | Hiển thị: "⚠️ Thông tin PCCC chưa được xác minh — Hãy hỏi chủ nhà về giấy nghiệm thu PCCC trước khi cọc" + nút "Gửi câu hỏi PCCC cho chủ nhà" |
| **Rủi ro** | ⚖️ Không được gán nhãn "An toàn" hoặc "Không an toàn" — chỉ trình bày thông tin có sẵn + nguồn + mức tin cậy |
| **Phù hợp VN** | Luật PCCC & CNCH mới siết chặt; người thuê VN rất lo sau các vụ cháy — feature này giải quyết gap thông tin nghiêm trọng |

### SF5: LANDLORD TRUST SCORE

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Điểm Uy Tín Chủ Nhà — Xây dựng, không mua được |
| **Vấn đề** | Không có cách phân biệt chủ nhà uy tín vs. "cò mồi" vs. kẻ lừa đảo |
| **Luồng tương tác** | Profile chủ nhà hiển thị: ★ 4.7/5 (23 reviews) · ✓ Xác minh CCCD · Phản hồi TB: 1.2h · Hoạt động 14 tháng · 0% hủy · 3 căn đang quản lý |
| **Công thức** | Weighted average: Xác minh (25%) + Review (25%) + Tốc độ phản hồi (20%) + Thời gian hoạt động (15%) + Tỷ lệ hủy (10%) + Report (5%) |
| **Demo** | 5 profile chủ nhà mẫu: Rất tốt / Tốt / Trung bình / Mới / Bị cảnh báo |
| **Phù hợp VN** | Shopee Preferred Seller đã chứng minh người Việt tin badge — áp dụng cho chủ nhà |

### SF6: AI HOUSING ADVISOR (NÂNG CẤP)

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Trợ Lý Tìm Nhà AI — "Kể cho tôi nghe về cuộc sống của bạn" |
| **Nâng cấp từ hiện tại** | Hiện đã có UserAiAdvisorDrawer → nâng cấp: hiểu context rủi ro + tổng chi phí + chủ nhà uy tín |
| **Luồng** | "Tôi có con 2 tuổi, ngân sách 15tr, sợ ngập, cần gần trường mầm non" → AI trả về top 3 căn với lý do: "Căn A: không ngập, 2 trường mầm non trong 800m, tổng chi phí 14.2tr, chủ nhà 4.8★" |
| **Demo** | Kịch bản pre-scripted với 3-5 câu hỏi phổ biến → response ấn tượng |

### SF7: MOVE-IN CHECKLIST & CONDITION LOG

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Checklist Nhận Nhà — Bằng chứng của bạn, không ai chối được |
| **Vấn đề** | Khi rời đi, chủ nhà nói "trầy tường, giữ cọc" — người thuê không có bằng chứng |
| **Luồng** | Ngày nhận phòng: Mở checklist → Từng phòng: chụp ảnh + ghi chú → Submit → Timestamp + hash → Cả 2 bên ký xác nhận digital → Khi trả phòng: so sánh ảnh vào/ra |
| **Demo** | Demo flow nhận phòng 1 căn mẫu, so sánh với ảnh "ra" có vết trầy → hệ thống highlight khác biệt |

### SF8: DEPOSIT SAFETY (CỌC AN TÂM)

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Cọc An Tâm — Tiền cọc được bảo vệ |
| **Vấn đề** | Lừa đảo tiền cọc là pain point #1 (có bằng chứng); cọc 2 tháng = 20-30 triệu |
| **Luồng prototype** | Người thuê cọc → Tiền vào escrow HAVEN → Chủ nhà thấy "Cọc đang giữ" → Người thuê nhận phòng + confirm → Tiền chuyển cho chủ nhà |
| **Demo** | Prototype flow không cần payment thật; animated flow diagram |
| **Rủi ro** | ⚖️ Cần license tài chính để giữ tiền hộ; Giải pháp prototype: partnership với ví điện tử (MoMo, VNPay) hoặc ngân hàng |

### SF9: SMART LISTING CREATION

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Đăng Tin Thông Minh — AI giúp chủ nhà tạo tin đăng chất lượng cao |
| **Luồng** | Upload 5 ảnh → AI nhận diện phòng (phòng ngủ, bếp, WC) → Auto-generate mô tả tiếng Việt + suggest giá + flag "Thiếu ảnh phòng tắm" + "Chưa ghi phí gửi xe" |
| **Demo** | Upload ảnh mẫu → AI response pre-scripted nhưng trông tự nhiên |

### SF10: LIVE DUAL-VIEW DEMO

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Live Demo 2 Màn Hình — Thấy cả 2 phía trong thời gian thực |
| **Vấn đề demo** | Khó diễn tả marketplace 2 mặt trên 1 màn hình |
| **Luồng** | Split screen hoặc 2 tab: Trái = Người thuê tìm + chat; Phải = Chủ nhà nhận notification + reply → Cả 2 cập nhật real-time |
| **Đã có cơ bản** | Consumer (`/`) vs Admin (`?view=admin`) + ChatModal + AdminInboxView |

### SF11: NEIGHBORHOOD GUIDE

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Cẩm Nang Khu Vực — "Sống ở đây như thế nào?" |
| **Vấn đề** | Người mới đến thành phố không biết quận nào phù hợp |
| **Luồng** | Mỗi quận/khu vực có trang riêng: Giá trung bình · Phong cách sống · Giao thông · An ninh · Tiện ích · Review cộng đồng · "Phù hợp với: Gia đình / Đi làm / Sinh viên" |
| **Demo** | 3-5 quận mẫu TP.HCM (Q1, Q7, Thủ Đức, Bình Thạnh, Gò Vấp) với data mock chi tiết |

### SF12: MARKETPLACE HEALTH DASHBOARD

| Thuộc tính | Chi tiết |
|-----------|----------|
| **Tên** | Bảng Sức Khỏe Marketplace — Chứng minh tư duy vận hành |
| **Vấn đề demo** | Admin dashboard thường chỉ là bảng CRUD — không gây ấn tượng |
| **Luồng** | Dashboard admin hiển thị: ① Tỷ lệ tin xác minh (98%) ② Thời gian duyệt TB (4.2h) ③ Report/tuần (trend giảm) ④ User satisfaction (4.6/5) ⑤ Revenue breakdown (SaaS 45%, Commission 30%, VAS 25%) |
| **Gây ấn tượng vì** | Cho thấy người xây sản phẩm hiểu rằng marketplace cần vận hành, không chỉ cần tính năng |

---

## 8. Danh Sách Tính Năng Niềm Tin, An Toàn, Chống Lừa Đảo & Chống Spam

### 8.1 Chống Lừa Đảo (Anti-Fraud)

| Cơ chế | Mô tả | Thời điểm |
|--------|-------|-----------|
| Xác minh CCCD + selfie | eKYC đối chiếu ảnh thật | Đăng ký chủ nhà |
| Xác minh quyền cho thuê | Upload sổ đỏ / ủy quyền | Đăng tin (optional, tạo badge) |
| Cảnh báo giá bất thường | Auto-flag giá thấp ≥30% so với khu vực | Đăng tin |
| Phát hiện ảnh trùng | Hash + reverse search | Đăng tin |
| Escrow cọc | Giữ cọc tại nền tảng | Giao dịch |
| Badge xác minh 3 cấp | Trực quan hóa mức độ tin cậy | Hiển thị tin |

### 8.2 Chống Spam (Anti-Spam)

| Cơ chế | Mô tả |
|--------|-------|
| Rate limiting chat | Tin nhắn đầu tiên/căn: 1 tin; phải chờ reply mới gửi tiếp |
| Giới hạn lead/ngày | Người thuê: tối đa 10 yêu cầu xem/ngày |
| Template detection | Phát hiện tin nhắn copy-paste gửi hàng loạt |
| Notification digest | Follow chủ nhà: tổng hợp 1 lần/tuần, không push từng tin |
| Cooldown báo cáo | Tối đa 3 report/ngày/user để tránh abuse |

### 8.3 Quyền Riêng Tư (Privacy)

| Cơ chế | Mô tả |
|--------|-------|
| SĐT ẩn | Số điện thoại chủ nhà chỉ hiện sau khi người thuê xác minh email |
| Chặn user | 2 chiều: người thuê chặn chủ nhà và ngược lại |
| Data minimization | Chỉ thu thập thông tin cần thiết cho từng bước |
| Thông tin hàng xóm ẩn danh | Chỉ aggregate statistics, không tiết lộ cá nhân |
| Ẩn thông tin nhạy cảm | Sổ đỏ, CCCD chỉ admin + chủ nhà xem; người thuê chỉ thấy badge |

### 8.4 An Toàn Nội Dung (Content Safety)

| Cơ chế | Mô tả |
|--------|-------|
| Moderation queue | Tin mới qua auto-check trước khi publish |
| Report workflow | Phân loại: Ảnh sai / Giá sai / Lừa đảo / Quấy rối → SLA xử lý khác nhau |
| Tin cũ auto-expire | Tin >90 ngày không cập nhật → auto-ẩn + nhắc chủ nhà |
| Audit log | Mọi hành động admin được ghi log với lý do |
| Escalation | Report > threshold → auto-ẩn tin + thông báo admin |
