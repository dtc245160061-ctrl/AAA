# BẢNG THU THẬP & ĐẶC TẢ YÊU CẦU PHẦN MỀM (REQUIREMENTS Q&A)

**Tên ứng dụng**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
**Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A)  
**Nhóm sinh viên thực hiện**:
1. **Vũ Ngọc Sơn** (Trưởng nhóm, Kiến trúc hệ thống & Fullstack)
2. **Vũ Bảo Linh** (Kỹ sư Dữ liệu & Tích hợp AI Engine)
3. **Tô Văn Quyền** (Kiểm thử Phần mềm & Đặc tả Nghiệp vụ)
4. **Lê Bình Nguyên** (Thiết kế Giao diện UI/UX & Tài liệu Học thuật)

---

## 1. BẢNG 20 CÂU HỎI & TRẢ LỜI THU THẬP YÊU CẦU (REQUIREMENTS Q&A)

| STT | Câu hỏi khảo sát yêu cầu | Nội dung phản hồi & Thống nhất kỹ thuật | Người phụ trách |
| :---: | :--- | :--- | :--- |
| 1 | **Hệ thống HAVEN giải quyết những bất cập thực tế cốt lõi nào của thị trường cho thuê căn hộ hiện nay?** | HAVEN giải quyết triệt để 5 bất cập lớn: (1) Chi phí ẩn và mập mờ biểu giá tiền điện/nước/dịch vụ; (2) Thiếu thông tin an toàn PCCC và lịch sử ngập lụt đô thị khi mưa bão; (3) Vấn nạn tin đăng ảo, ảnh mạng không đúng thực tế; (4) Nguy cơ mất tiền cọc hoặc tranh chấp khi trả phòng; (5) Thiếu công cụ so sánh đa chiều định lượng giữa các căn hộ. | Vũ Ngọc Sơn |
| 2 | **Ai là đối tượng người dùng chính (Target Users) của nền tảng HAVEN?** | Hệ thống phục vụ 4 nhóm người dùng chính: (1) Người thuê nhà (Sinh viên, Người đi làm, Gia đình trẻ, Chuyên gia nước ngoài/Expats); (2) Chủ nhà cá nhân & Nhà quản lý căn hộ dịch vụ; (3) Cư dân đang sinh sống trong căn hộ; (4) Quản trị viên sàn thương mại bất động sản (Admin Marketplace). | Vũ Bảo Linh |
| 3 | **Tính năng 'True Cost Breakdown' giải quyết bài toán tài chính của người thuê như thế nào?** | True Cost tự động tính toán tổng chi phí sinh hoạt thực tế hàng tháng = Tiền thuê gốc + Phí quản lý tòa nhà + Tiền gửi xe máy/ô tô + Internet + Ước tính điện năng tiêu thụ (theo diện tích & số điều hòa) + Nước sinh hoạt + Tiền cọc đầu vào. Người thuê nắm rõ ngân sách thực tế trước khi đi xem phòng. | Tô Văn Quyền |
| 4 | **Làm thế nào để người dùng đánh giá an toàn PCCC và ngập lụt trước khi quyết định thuê phòng?** | Hệ thống tích hợp 'Bản đồ PCCC & Ngập lụt Đa Lớp'. Lớp PCCC hiển thị điểm an toàn (Safety Score 1-100), hồ sơ kiểm định nghiệm thu PCCC, thang thoát hiểm và đầu phun Sprinkler. Lớp Ngập lụt hiển thị lịch sử triều cường, thoát nước và độ rủi ro (Thấp/Trung bình/Cao) theo dữ liệu khí tượng. | Lê Bình Nguyên |
| 5 | **Trí tuệ nhân tạo (GenAI Engine) đóng vai trò gì trong trải nghiệm tìm kiếm của người thuê?** | GenAI xử lý ngôn ngữ tự nhiên (NLP) cho phép người dùng nhập yêu cầu tự do (ví dụ: 'Tìm căn hộ 2 phòng ngủ dưới 15 triệu gần Keangnam, có chỗ đỗ ô tô, không ngập nước'). AI tự động trích xuất các tiêu chí lọc, tính điểm tương thích Match Score (%) và đưa ra lời giải thích chi tiết vì sao căn hộ phù hợp. | Vũ Ngọc Sơn |
| 6 | **Công nghệ AI hỗ trợ chủ nhà đăng tin (Smart Listing Creator) như thế nào?** | Chủ nhà chỉ cần tải lên 3-8 ảnh thực tế của căn hộ. Hệ thống AI phân tích nhận diện loại phòng, tự động tạo tiêu đề chuẩn SEO, viết bài mô tả hấp dẫn và gợi ý mức giá thuê tối ưu dựa trên dữ liệu thị trường khu vực xung quanh. | Vũ Bảo Linh |
| 7 | **Cơ chế 'So Sánh Đa Chiều (Radar Chart)' hỗ trợ người thuê ra quyết định ra sao?** | Cho phép người dùng chọn 2-4 căn hộ vào bảng so sánh. Hệ thống vẽ biểu đồ Radar 5 trục: (1) Chi phí tổng thể, (2) An toàn PCCC, (3) Độ cao cấp nội thất, (4) Vị trí & Tiện ích, (5) Mức độ yên tĩnh. Đi kèm bảng chiết tính chi phí chênh lệch từng khoản rõ ràng. | Tô Văn Quyền |
| 8 | **Hệ thống giải quyết vấn đề tranh chấp tiền cọc khi trả phòng bằng phương thức nào?** | Hệ thống cung cấp 'Biên bản Bàn giao & Kiểm tra 15 Mục' số hóa kèm ảnh chụp hiện trạng có chữ ký số điện tử khi nhận phòng. Khi trả phòng, hai bên đối chiếu ảnh gốc. Nếu có tranh chấp, Quỹ bảo vệ ký quỹ (Deposit Escrow Protection) của HAVEN sẽ làm trung gian phân xử dựa trên chứng cứ. | Lê Bình Nguyên |
| 9 | **Làm sao để người thuê ở xa hoặc bận rộn khảo sát được không gian căn hộ?** | Hệ thống tích hợp 'Tour Tham Quan Thực Tế Ảo 360 Độ' (Virtual Tour 3D) và 'Cẩm nang khu vực kết hợp Giả lập tuyến đường đi làm (Commute Simulator)'. Người dùng có thể đo đạc kích thước phòng và tính toán thời gian di chuyển giờ cao điểm trước khi đến xem trực tiếp. | Vũ Ngọc Sơn |
| 10 | **Cơ chế Smart Chat & Đặt lịch hẹn có điểm gì khác biệt so với các sàn BĐS thông thường?** | Chat tích hợp 'Smart Action Chips' cho phép người thuê đặt câu hỏi nhanh chỉ với 1 chạm (Hỏi giá net, hỏi chỗ đỗ ô tô, hỏi giấy phép PCCC). Tích hợp lịch hẹn xem phòng đồng bộ trực tiếp với Google Calendar của chủ nhà. | Vũ Bảo Linh |
| 11 | **Phân hệ Chủ nhà (Landlord Dashboard) cung cấp những công cụ quản lý nào?** | Cung cấp: Quản lý danh mục căn hộ (trống, đang thuê, bảo trì), Sơ đồ mặt bằng tương tác (Floor Plan Layout), Quản lý Lead khách hàng tiềm năng theo phễu chuyển đổi, Tạo hợp đồng điện tử E-Sign và Theo dõi hóa đơn thu tiền hàng tháng. | Tô Văn Quyền |
| 12 | **Làm thế nào để ngăn chặn tình trạng tin ảo, lừa đảo cọc trên nền tảng?** | Hệ thống áp dụng quy trình xác minh 2 lớp (Huy hiệu Verified): Xác minh danh tính qua CCCD/Hộ chiếu và Xác minh quyền sở hữu qua Sổ đỏ/Hợp đồng mua bán. Điểm tín nhiệm Trust Score đánh giá lịch sử giao dịch. Các tin đăng sai sự thật sẽ bị AI gắn cờ và Admin hạ khỏi sàn. | Lê Bình Nguyên |
| 13 | **Phân hệ Quản trị viên (Marketplace Admin) giám sát những chỉ số sức khỏe nào của sàn?** | Admin Dashboard theo dõi: GMV (Tổng giá trị giao dịch), Doanh thu nền tảng (Take-rate 5-10% và phí gói đăng tin VIP), Tỷ lệ lấp đầy phòng (Occupancy Rate), Điểm chất lượng tin đăng trung bình và Bảng xử lý tranh chấp cọc/khiếu nại. | Vũ Ngọc Sơn |
| 14 | **Phân hệ Ứng dụng Cư dân (Resident Portal) hỗ trợ những nghiệp vụ gì trong quá trình thuê?** | Hỗ trợ: Điều khiển thiết bị IoT thông minh (khóa cửa, điều hòa, theo dõi điện nước theo thời gian thực), Gửi yêu cầu sửa chữa/bảo trì kèm ảnh chụp, Thanh toán hóa đơn 1-chạm và Đặt trước các dịch vụ tiện ích tòa nhà (Gym, Hồ bơi, Dọn vệ sinh). | Vũ Bảo Linh |
| 15 | **Hệ thống có những yêu cầu phi chức năng (Non-Functional Requirements) nào về hiệu năng?** | Thời gian phản hồi tìm kiếm < 500ms; Thời gian tải trang ban đầu (First Contentful Paint) < 1.2s; Hỗ trợ tối thiểu 1.000 người dùng đồng thời (Concurrent Users); Đạt chuẩn tối ưu SEO và Lighthouse Score > 90 điểm. | Tô Văn Quyền |
| 16 | **Yêu cầu về tính bảo mật và quyền riêng tư dữ liệu người dùng được đảm bảo ra sao?** | Toàn bộ dữ liệu truyền tải qua giao thức mã hóa HTTPS/TLS 1.3; Mật khẩu và thông tin cá nhân được băm an toàn (BCrypt/Argon2); Thông tin định danh CCCD và giấy tờ sở hữu được lưu trữ bảo mật tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân. | Lê Bình Nguyên |
| 17 | **Giao diện người dùng (UI/UX) tuân theo những chuẩn mực thiết kế nào?** | Áp dụng phong cách Dark Mode sang trọng, hiện đại với bảng màu Slate-950 kết hợp điểm nhấn Emerald-400 và Amber-400. Sử dụng Typography hiện đại (Inter, Playfair Display), hiệu ứng Glassmorphism tinh tế và tương thích hoàn hảo trên thiết bị di động (Responsive Design). | Vũ Ngọc Sơn |
| 18 | **Dữ liệu về 150 căn hộ và 16 thành phố được tổ chức như thế nào?** | Dữ liệu được mô hình hóa theo cấu trúc TypeScript chuẩn hóa với đầy đủ thông tin: ID định danh, phân khúc phòng, tọa độ khu vực, bảng chiết tính chi phí thật, chỉ số PCCC, dữ liệu cảm biến IoT và thông tin người thuê (Việt Nam và chuyên gia nước ngoài). | Vũ Bảo Linh |
| 19 | **Hệ thống hỗ trợ những quy trình thanh toán nào?** | Hỗ trợ: Chuyển khoản ngân hàng tự động (VietQR), Thẻ thanh toán quốc tế (Visa/Mastercard) và Cổng thanh toán trực tuyến bảo chứng Escrow. | Tô Văn Quyền |
| 20 | **Kế hoạch kiểm thử và bảo đảm chất lượng phần mềm được thực hiện như thế nào?** | Thực hiện kiểm thử 3 lớp: Unit Testing (kiểm thử các hàm tính toán True Cost, bộ lọc AI), Integration Testing (kiểm thử luồng tương tác giữa các phân hệ) và User Acceptance Testing (kiểm thử trải nghiệm thực tế của người dùng theo kịch bản). | Lê Bình Nguyên |

---

## 2. PHÂN LOẠI DANH MỤC YÊU CẦU CHỨC NĂNG & PHI CHỨC NĂNG

| Mã Yêu Cầu | Nội dung đặc tả yêu cầu | Phân loại | Mức độ ưu tiên |
| :---: | :--- | :---: | :---: |
| FR-01 | Tìm kiếm thông minh bằng AI (NLP Natural Query) | Chức năng | Bắt buộc (P0) |
| FR-02 | Bảng chiết tính Chi phí thực tế (True Cost Breakdown) | Chức năng | Bắt buộc (P0) |
| FR-03 | Bản đồ PCCC & Ngập lụt Đa Lớp | Chức năng | Bắt buộc (P0) |
| FR-04 | So sánh đa chiều (Radar Chart 5 trục) | Chức năng | Bắt buộc (P0) |
| FR-05 | Đăng tin tự động bằng AI (Smart Listing Creator) | Chức năng | Bắt buộc (P0) |
| FR-06 | Quản lý Hợp đồng điện tử E-Sign & Cọc Escrow | Chức năng | Quan trọng (P1) |
| FR-07 | Biên bản bàn giao 15 mục có ảnh đối chiếu | Chức năng | Quan trọng (P1) |
| FR-08 | Quản trị sàn & Bảng sức khỏe thị trường | Chức năng | Quan trọng (P1) |
| NFR-01 | Thời gian phản hồi tìm kiếm < 500ms | Phi chức năng | Bắt buộc (P0) |
| NFR-02 | Bảo mật dữ liệu định danh & mã hóa đường truyền HTTPS | Phi chức năng | Bắt buộc (P0) |
| NFR-03 | Thiết kế Responsive tương thích 100% Mobile/Tablet/Desktop | Phi chức năng | Bắt buộc (P0) |
| NFR-04 | Điểm đánh giá hiệu năng Lighthouse > 90 điểm | Phi chức năng | Quan trọng (P1) |
