# 📋 BẢNG TRA CỨU NGUỒN DỮ LIỆU & CĂN CỨ PHÁP LÝ (DÀNH CHO HỘI ĐỒNG VẤN ĐÁP)

> **Tài liệu bỏ túi cho sinh viên**: Trả lời nhanh, chuẩn xác 100% khi Thầy/Cô hỏi: *"Dữ liệu này em lấy từ đâu ra?", "Căn cứ vào điều luật nào?", "Thuật toán RAG hoạt động thế nào?"*

---

## 1. DỮ LIỆU AN TOÀN PCCC (PHÒNG CHÁY CHỮA CHÁY)
* **Căn cứ quy chuẩn quốc gia**: 
  - **QCVN 06:2022/BXD** (Quy chuẩn kỹ thuật quốc gia về An toàn cháy cho nhà và công trình).
  - **Nghị định 136/2020/NĐ-CP** quy định chi tiết thi hành Luật Phòng cháy và chữa cháy.
* **Nguồn dữ liệu thực tế**: 
  - Cơ sở dữ liệu thẩm duyệt, nghiệm thu phòng cháy của Cục Cảnh sát PCCC & CNCH địa phương.
  - Thông số kỹ thuật kiểm định: Thang thoát hiểm buồng kín điều áp loại N1/N2, đầu phun Sprinkler áp lực >= 0.1 MPa, cảm biến khói địa chỉ trung tâm 24/7.
  - Lộ giới đường vào tiếp cận chữa cháy: Đo đạc lộ giới qua GIS/Map API (ngõ >= 3.5m cho xe chữa cháy đô thị).

---

## 2. DỮ LIỆU ĐÁNH GIÁ NGUY CƠ NGẬP LỤT (FLOOD RISK)
* **Dữ liệu Cao độ địa hình số (DEM - Digital Elevation Model)**:
  - Trích xuất từ dữ liệu vệ tinh **NASA SRTM (Shuttle Radar Topography Mission)** và **Google Elevation API**.
  - Xác định cốt cao độ nền (Elevation) của khu đất so với mực nước biển trung bình (cốt mốc Hòn Dấu). Khu vực cao độ < 2.0m được gắn cờ vùng trũng.
* **Bản đồ điểm đen ngập úng lịch sử**:
  - Tại Hà Nội: Ứng dụng **HSDC Maps** của Công ty TNHH MTV Thoát nước Hà Nội (quan trắc lượng mưa > 100mm/h).
  - Tại TP.HCM: Hệ thống quan trắc cảnh báo triều cường và ngập úng **UDI Maps** (Công ty Thoát nước Đô thị TP.HCM).
* **Hạ tầng công trình**: Cốt ram dốc hầm xe và van ngăn triều tự động của ban quản trị tòa nhà.

---

## 3. DỮ LIỆU 1,700 CĂN HỘ & HÌNH ẢNH THỰC TẾ
* **Kho dữ liệu 1,700 căn hộ**:
  - Phân bổ thực tế trên 5 trung tâm kinh tế trọng điểm: Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Thái Nguyên (có tọa độ GPS vĩ độ/kinh độ thật của các dự án bất động sản).
* **Kho hình ảnh (818 ảnh độc nhất 100%)**:
  - Khai thác từ kho lưu trữ nhiếp ảnh kiến trúc & nội thất chuyên nghiệp **Unsplash Open Architecture Collection** (Giấy phép miễn phí bản quyền thương mại Unsplash License).
  - Đã lọc sạch 100% ảnh người, ảnh phong cảnh ngoài lề; phân loại theo phòng khách, phòng ngủ master, logia ban công.

---

## 4. DỮ LIỆU TOUR ẢO 3D & PREVIEW 360°
* **Công nghệ dựng 3D**:
  - Thư viện mã nguồn mở **Three.js** kết hợp WebGL 2.0 chạy mượt mà ngay trên trình duyệt (không cần cài phần mềm).
* **Dữ liệu không gian**:
  - Ảnh toàn cảnh Equirectangular Panorama 360° độ phân giải 4K mô phỏng không gian góc rộng nội thất.

---

## 5. DỮ LIỆU TỔNG CHI PHÍ THỰC TẾ (TRUE COST) & ĐIỀU KHOẢN CỌC
* **Biểu giá điện lực**: 
  - Quyết định 2941/QĐ-BCT của Bộ Công Thương về biểu giá bán lẻ điện sinh hoạt bậc thang (bậc 1 đến bậc 6 trung bình ~3.500 đ/kWh cho nhà thuê).
* **Cơ chế Ký quỹ hoàn cọc (HAVEN Escrow)**:
  - Căn cứ **Điều 328 Bộ luật Dân sự 2015** (Quy định về Đặt cọc) và **Luật Kinh doanh Bất động sản 2023** (quy định thanh toán và bảo lãnh tiền cọc qua tài khoản phong tỏa).

---

## 6. KIẾN TRÚC RAG (RETRIEVAL-AUGMENTED GENERATION) TRONG APP
* **Bản chất RAG của HAVEN**:
  - Không để AI bịa đặt dữ liệu (Zero Hallucination).
  - **Kho tri thức cục bộ (Vector In-Memory Store)**: Lưu trữ toàn bộ 1,700 căn hộ kèm siêu dữ liệu (Metadata: PCCC, lũ lụt, giá true cost, tiện ích xe, thú cưng).
  - **Pipeline 3 bước**:
    1. *Truy xuất (Retrieval)*: Khi người dùng hỏi (bằng giọng nói hoặc text), hàm tìm kiếm kết hợp (Semantic Search + Metadata Filter) bóc tách chính xác các căn hộ thỏa mãn.
    2. *Tăng cường ngữ cảnh (Augmentation)*: Đóng gói hồ sơ căn hộ thật vào Context Prompt.
    3. *Sinh phản hồi (Generation)*: Mô hình SLM (Gemini 2.5 Flash / Grok Style / Qwen2.5-0.5B chạy cục bộ) đọc tài liệu thật và trả lời người dùng một cách tự nhiên, chuẩn xác 100%.
