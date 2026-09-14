# 📋 CẨM NANG HƯỚNG DẪN KIỂM TRA TIẾN ĐỘ BUỔI 2 (2/4)
> **Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A)  
> **Dự án**: HAVEN — Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp GenAI  
> **Nhóm thực hiện**: Nhóm 04 (Vũ Ngọc Sơn, Vũ Bảo Linh, Tô Văn Quyền, Lê Bình Nguyên)  
> **Trạng thái**: Đã chuẩn bị sẵn sàng 100%, 0 lỗi, tài liệu Word sạch sẽ.

---

## I. BUỔI KIỂM TRA 2/4 THẦY CÔ SẼ KIỂM TRA CÁI GÌ?

Trong quy trình 4 buổi kiểm tra tiến độ đồ án của môn học:
- **Buổi 1**: Khảo sát bài toán, đề xuất giải pháp có GenAI, Kế hoạch 9 tuần, Bộ 20 câu hỏi Q&A. *(Đã xong)*
- **👉 BUỔI 2 (NGÀY MAI)**: **Kiểm tra Tiến độ Xây dựng Phần mềm (Implementation Phase 1) + Tài liệu Đặc tả SRS + Demo Chạy Thực Tế.**
  - Thầy sẽ kiểm tra xem:
    1. Nhóm đã code được những gì rồi? Có chạy được thật không hay chỉ là ảnh vẽ mockup?
    2. GenAI được tích hợp vào chỗ nào trong hệ thống? (Có thật sự dùng AI không hay chỉ là chatbot chém gió?).
    3. Tài liệu SRS (`03_...docx`) đã hoàn thiện bảng Use case, Actor, Sequence Flow chưa?
    4. Thành viên trong nhóm hiểu bài toán và luồng vận hành tới đâu?
- **Buổi 3**: Kiểm tra tích hợp toàn diện (Admin, Escrow, Hợp đồng số, Cư dân IoT, Kiểm thử).
- **Buổi 4**: Báo cáo tổng kết đồ án cuối kỳ trước Hội đồng (Final Defense).

---

## II. DỰ ÁN HAVEN HIỆN TẠI ĐÃ LÀM ĐƯỢC NHỮNG GÌ?

Dự án của bạn **đang vượt trước tiến độ cả tuần so với yêu cầu của Buổi 2**:

### 1. Bộ 3 Tài liệu Học thuật Word (.docx) nộp giảng viên:
Đã được đồng bộ và điền đầy đủ 100%, **xóa sạch toàn bộ placeholder `<...>` của mẫu trường**:
- 📄 `01_GenAI_SoftwareDevelopment_project-plan.docx`: Kế hoạch 9 tuần, phân công 46 đầu việc rõ ràng cho 4 thành viên.
- 📄 `02_GenAI_SoftwareDevelopment_requirements-qa.docx`: 20 câu hỏi Q&A phỏng vấn yêu cầu, phân loại Functional/Non-functional, Sơ đồ phân cấp chức năng.
- 📄 `03_GenAI_SoftwareDevelopment_requirements-specification.docx`: Tài liệu SRS chuẩn IEEE 830, đặc tả 12 Use Case, 5 Tác nhân, Sequence Diagram, Ma trận truy vết RTM.

### 2. Sản phẩm Codebase Chạy Thực Tế (Production-Ready):
- **Build sạch sẽ**: `npm run build` thành công $100\%$, 0 lỗi TypeScript, 0 lỗi cú pháp.
- **Dữ liệu chuẩn hóa**: 150 căn hộ thực tế tại 16 thành phố lớn (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Cần Thơ...).
- **Giao diện**: Chuẩn Liquid Glass UI cao cấp, hỗ trợ Dark / Light / System Mode, Responsive 100% trên cả điện thoại lẫn laptop.
- **Tính năng cốt lõi đã chạy mượt mà**:
  - **Phân hệ Người thuê**:
    1. **Bóc tách Chi phí thực tế (True Cost Breakdown)**: Loại bỏ chi phí ẩn, tính tự động: Tiền phòng + Điện + Nước + Quản lý + Gửi xe + Net.
    2. **Bản đồ An tâm (Confidence Map)**: Trực quan 2 lớp rủi ro PCCC QCVN 06:2022 và lịch sử ngập lụt / triều cường đô thị.
    3. **Trợ lý Haven AI Housing Advisor**: Phân tích câu hỏi tiếng Việt tự nhiên (NLP) để gợi ý căn hộ chuẩn xác.
    4. **So sánh đa chiều (Radar Chart 5 trục)**: Chi phí, PCCC, nội thất, vị trí, yên tĩnh.
    5. **In-App Chat chuẩn Shopee & Smart Chips**: Tự động trả lời lịch xem phòng, tiền cọc, an toàn PCCC.
    6. **Tour 360 độ ảo**, Giả lập đường đi làm giờ cao điểm (Commute Simulator).
  - **Phân hệ Chủ nhà / Quản lý**:
    1. **Đăng tin bằng AI (Smart Listing Creator)**: Tải ảnh phòng $\rightarrow$ AI nhận diện không gian, tự viết tiêu đề SEO, tự soạn mô tả và gợi ý giá thuê tối ưu.
    2. **CRM Quản lý Khách hẹn (Leads)**: Tiếp nhận đơn xem nhà và chuyển đổi sang hợp đồng chỉ bằng 1-Click.
    3. **Ký Hợp Đồng Số E-Sign**: Vẽ chữ ký trực tiếp trên màn hình, tự động chuyển trạng thái phòng sang "Đang thuê" và cộng doanh thu.

---

## III. NGÀY MAI ĐI KIỂM TRA BẠN CẦN LÀM GÌ?

Bạn **KHÔNG CẦN PHẢI CODE THÊM GÌ CẢ**. Mọi thứ đã có sẵn. Hãy làm theo đúng 3 bước sau:

### Bước 1: Khởi động hệ thống trước khi vào lớp
1. Mở Terminal trong thư mục `d:\HAVEN`:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt vào link: `http://localhost:5173/`
3. Kiểm tra mạng internet (để load ảnh Unsplash mượt mà).

### Bước 2: Kịch bản trình bày Demo với Thầy (3 Phút - Gây ấn tượng mạnh)

- **Phút 1: Mở trang chủ & Nói vấn đề thực tế**
  - Giữ màn hình `http://localhost:5173/`.
  - Nói: *"Thưa thầy, hệ thống HAVEN giải quyết 2 nỗi đau lớn nhất của người thuê nhà hiện nay: **Chi phí ẩn** (điện nước, phí dịch vụ bị đội giá) và **Nỗi lo an toàn** (nguy cơ cháy nổ PCCC sau vụ Khương Hạ và ngập lụt đô thị mùa mưa)."*
- **Phút 2: Bấm vào trang Tìm kiếm & Chi tiết căn hộ**
  - Bấm sang tab **Tìm Kiếm** $\rightarrow$ Kéo thanh trượt **Tổng chi phí True Cost**.
  - Chọn căn **HN-TH-2401** $\rightarrow$ Chỉ cho thầy xem:
    - *"Đây là bảng **True Cost Breakdown**: Giá thuê 11 triệu nhưng tổng thực tế là 13.6 triệu gồm cả điện, nước, gửi ô tô, phí dịch vụ."*
    - Bật tab **Bản Đồ An Tâm**: *"Hệ thống tích hợp dữ liệu thẩm duyệt PCCC QCVN 06:2022 và lịch sử ngập nước khu vực."*
    - Bấm nút **Haven AI** góc dưới phải: Gõ thử *"Tìm căn hộ 2 phòng ngủ yên tĩnh có chỗ đỗ ô tô"* $\rightarrow$ AI lọc ngay ra kết quả kèm điểm Match Score.
- **Phút 3: Sang Phân hệ Chủ nhà & Đăng tin bằng AI**
  - Mở link: `http://localhost:5173/?view=admin` (hoặc bấm nút Switcher góc trái dưới).
  - Bấm vào mục **Căn Hộ** $\rightarrow$ Bấm nút **"Đăng Tin Mới Bằng AI"**:
    - *"Chủ nhà chỉ cần tải ảnh thực tế lên, AI của hệ thống sẽ tự động nhận diện phòng khách/phòng ngủ, tự sinh tiêu đề chuẩn SEO, viết mô tả hấp dẫn và gợi ý khoảng giá thị trường."*
  - Mở mục **Hợp Đồng** $\rightarrow$ Mở form ký hợp đồng điện tử **E-Sign** vẽ chữ ký tay trực tiếp.

---

## IV. BỘ 5 CÂU HỎI "TỦ" THẦY CÔ HAY HỎI & CÁCH TRẢ LỜI ĐẠT ĐIỂM TỐI ĐA

### Câu 1: "Sản phẩm này làm cho ai dùng? Khác gì Batdongsan.com.vn hay Chợ Tốt?"
> **Trả lời**: *"Batdongsan.com.vn và Chợ Tốt chỉ là sàn rao vặt đăng tin quảng cáo, dẫn đến vấn nạn tin ảo, mập mờ chi phí và thiếu thông tin an toàn. HAVEN là nền tảng **PropTech khép kín** tập trung vào trục giá trị **'Biết rõ trước khi cọc'**: Bóc tách 100% chi phí thật (True Cost), kiểm định PCCC và ngập lụt, đồng thời cung cấp công cụ vận hành cho chủ nhà từ chat, quản lý lịch hẹn đến ký hợp đồng điện tử E-Sign."*

### Câu 2: "AI trong dự án này đóng vai trò gì? Có phải chỉ gắn ChatGPT vào không?"
> **Trả lời**: *"Dạ không ạ. GenAI trong HAVEN được tích hợp sâu vào 2 phân hệ cốt lõi:  
> 1. **Phân hệ Người thuê (Haven AI Advisor)**: Sử dụng mô hình NLP trích xuất Intent và tiêu chí lọc (ngân sách, số phòng, tiện ích, an toàn) từ câu nói tự nhiên của người dùng để tính điểm khớp nhu cầu (Match Score %).  
> 2. **Phân hệ Chủ nhà (Smart Listing Creator)**: Sử dụng AI phân tích hình ảnh không gian căn hộ, tự động sinh tiêu đề chuẩn SEO, bài mô tả chi tiết và thuật toán gợi ý mức giá cho thuê cạnh tranh dựa trên dữ liệu khu vực."*

### Câu 3: "Dữ liệu PCCC và ngập lụt lấy từ đâu, có đáng tin không?"
> **Trả lời**: *"Dữ liệu PCCC được chuẩn hóa theo quy chuẩn **QCVN 06:2022/BXD** của Bộ Xây Dựng (kiểm tra hồ sơ nghiệm thu, thang thoát hiểm, đầu phun sprinkler). Lớp ngập lụt được lập bản đồ dựa trên dữ liệu các điểm ngập lịch sử theo mùa mưa và triều cường đô thị tại 16 thành phố. Hệ thống luôn gắn nhãn nguồn gốc và ngày cập nhật minh bạch cho người thuê."*

### Câu 4: "Kiến trúc hệ thống và công nghệ nhóm sử dụng là gì?"
> **Trả lời**: *"Hệ thống sử dụng **React 19 + TypeScript** với trình đóng gói **Vite**, giao diện được thiết kế trên **Tailwind CSS v4** chuẩn Liquid Glass UI. Quản lý trạng thái bằng Reactive Store tập trung có lưu trữ LocalStorage. Dịch vụ AI tích hợp qua API xử lý thời gian thực, đảm bảo tốc độ phản hồi tìm kiếm dưới 300ms."*

### Câu 5: "Hiện tại nhóm đã hoàn thành đến đâu và kế hoạch cho buổi kiểm tra tiếp theo là gì?"
> **Trả lời**: *"Dạ thưa thầy, nhóm em đã hoàn thành 100% tài liệu SRS, Kế hoạch 9 tuần, Bộ câu hỏi Q&A và đã code chạy hoàn chỉnh 2 phân hệ cốt lõi là Người thuê và Chủ nhà. Cho buổi kiểm tra số 3 tiếp theo, nhóm sẽ tập trung vào phân hệ Quản trị sàn (Marketplace Health & chống gian lận), Cổng cư dân IoT và quy trình bảo vệ tiền cọc trung gian (Escrow Protection)."*

---

## V. TỌA ĐỘ CÁC FILE ĐÃ CHUẨN BỊ SẴN SÀNG

1. **Thư mục tài liệu Word (.docx) nộp môn học**:
   `d:\HAVEN\Ứng dụng trí tuệ nhân tạo KHMT K23A-20260805T083400Z-1-001\`
   - `01_GenAI_SoftwareDevelopment_project-plan.docx`
   - `02_GenAI_SoftwareDevelopment_requirements-qa.docx`
   - `03_GenAI_SoftwareDevelopment_requirements-specification.docx`
2. **Lệnh chạy demo**:
   ```bash
   npm run dev
   # Truy cập http://localhost:5173/ (Người thuê)
   # Truy cập http://localhost:5173/?view=admin (Quản trị / Chủ nhà)
   ```
