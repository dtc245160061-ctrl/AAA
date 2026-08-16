# Untitled

---

# Prompt B — Chuyển đề xuất thành kế hoạch xây dựng cho agent coding

Bạn đã nhận được kết quả nghiên cứu sản phẩm cho ứng dụng **[HAVEN]**. Bây giờ hãy đóng vai **Senior Product Engineer, UX Engineer và Technical Lead**. Mục tiêu là chuyển các ý tưởng đã được duyệt thành một kế hoạch xây dựng rõ ràng, sau đó triển khai cẩn thận trên codebase hiện có.

## Bối cảnh hiện tại

## Bối cảnh hiện tại

Stack hiện tại: Tham khảo chi tiết kiến trúc và công nghệ tại **"D:\AAA\handoff.md"** (Mục 2: Tech Stack).

Các tính năng đã có: Đọc toàn bộ tính năng và màn hình đã hoàn thành tại **"D:\AAA\TONG_KET_TINH_NANG_HAVEN.md"** và **"D:\AAA\handoff.md"** (Mục 4: Tính năng đã hoàn thành & kiểm thử)[cite: 1, 2].

Các tính năng đã được duyệt:
Toàn bộ danh sách tính năng đã được nghiên cứu, chấm điểm và phân loại chi tiết tại:

- **"D:\AAA\haven_product_research_part1.md"** (Bối cảnh, Đối thủ, Chân dung & Hành trình người dùng)
- **"D:\AAA\haven_product_research_part2.md"** (Kho 105 ý tưởng tính năng & 12 Signature Features)
- **"D:\AAA\haven_product_research_part3.md"** (Mục 12: Bảng chấm điểm P0/P1/P2 và Mục 13: Top 10 tính năng ưu tiên)
  _Quy tắc triển khai: Thực hiện các tính năng màu xanh (🟢) và vàng (🟡) trên codebase; các tính năng màu đỏ (🔴) hoặc rủi ro pháp lý (⚖️) chỉ dựng giao diện mô phỏng/prototype demo[cite: 5, 6]._

Tính năng tạo khác biệt chính: Hệ sinh thái Quản lý & Vận hành Sanctuary kết hợp **Bản Đồ An Tâm (Confidence Map)** overlay rủi ro ngập lụt/PCCC[cite: 6] và **Bảng tính Tổng Chi Phí Thực Tế (True Cost Breakdown)**[cite: 6], kèm Shopee-Style Chatbot và Ký hợp đồng điện tử bảo chứng[cite: 2].

Đối tượng ưu tiên: **người thuê tại Việt Nam** (trục giá trị "Biết rõ trước khi cọc")[cite: 4, 5]. Chủ nhà là nhóm người dùng quan trọng thứ hai[cite: 3]. Admin cần đủ khả năng kiểm duyệt và vận hành nhưng không được làm loãng trải nghiệm người thuê[cite: 3].

## Nguyên tắc triển khai

Trước khi sửa code, hãy kiểm tra cấu trúc dự án, luồng hiện có, các component dùng lại được, mô hình dữ liệu, API, trạng thái loading/error/empty, khả năng responsive và các giới hạn kỹ thuật. Không viết lại toàn bộ dự án nếu không có lý do rõ ràng.

Hãy chia việc thành từng lát cắt có thể chạy được. Mỗi lát cắt cần có mục tiêu, file hoặc module bị ảnh hưởng, trạng thái dữ liệu, tiêu chí nghiệm thu và cách kiểm thử. Nếu thiếu API hoặc dữ liệu thật, hãy tạo dữ liệu mẫu có cấu trúc rõ ràng và gắn nhãn là dữ liệu demo; không làm người xem hiểu nhầm đó là dữ liệu xác minh thật.

Ưu tiên chất lượng của các luồng sau: khám phá căn hộ, xem bản đồ hoặc thông tin khu vực, đọc trang chi tiết, kiểm tra độ tin cậy, so sánh, lưu hoặc theo dõi, chat và đặt lịch xem. Giao diện phải có hệ thống thiết kế nhất quán, nội dung tiếng Việt tự nhiên, trạng thái tương tác đầy đủ và hoạt động tốt trên màn hình nhỏ.

Không sử dụng màu sắc, thẻ, biểu đồ hoặc hiệu ứng chỉ để trang trí. Mỗi thành phần phải giúp người thuê hiểu, so sánh, kiểm tra hoặc ra quyết định. Không thêm các tính năng chưa được duyệt chỉ vì chúng dễ làm.

## Đầu ra trước khi code

Trước hết, hãy tạo một kế hoạch triển khai bao gồm: mục tiêu sản phẩm, phạm vi phiên bản này, kiến trúc thông tin, user flow, danh sách màn hình, mô hình dữ liệu, API hoặc mock data, phân quyền, trạng thái lỗi, chiến lược responsive, chiến lược kiểm thử, các rủi ro và thứ tự triển khai.

Hãy đề xuất cấu trúc tài liệu trong thư mục `docs/` nếu dự án phù hợp, gồm các tệp như `product-scope.md`, `feature-backlog.md`, `ux-flows.md`, `monetization.md`, `demo-script.md` và `technical-notes.md`. Nếu môi trường không cho phép tạo tài liệu, hãy xuất nội dung trong câu trả lời.

Sau kế hoạch, hãy dừng lại và chờ tôi xác nhận nếu còn quyết định sản phẩm quan trọng chưa rõ. Nếu yêu cầu đủ rõ và tôi cho phép triển khai, hãy thực hiện theo từng giai đoạn, kiểm thử sau mỗi giai đoạn và báo cáo những gì đã thay đổi.

## Tiêu chí nghiệm thu

Một tính năng chỉ được xem là hoàn thành khi có giao diện, dữ liệu hoặc API tương ứng, trạng thái loading, empty, error và success, phân quyền phù hợp, responsive, nội dung tiếng Việt, xử lý trường hợp dữ liệu thiếu, và có thể trình bày trong một kịch bản demo ngắn.

Sau khi triển khai, hãy tự đánh giá theo bảng sau:

| Hạng mục           | Câu hỏi kiểm tra                                                            |
| ------------------ | --------------------------------------------------------------------------- |
| Giá trị người dùng | Người thuê có hiểu tính năng giúp họ điều gì không?                         |
| Tính nhất quán     | Các màn hình có dùng cùng ngôn ngữ, màu sắc và component không?             |
| Độ tin cậy         | Dữ liệu thật, dữ liệu mẫu và dữ liệu chưa xác minh có được phân biệt không? |
| Khả năng sử dụng   | Người dùng có hoàn thành luồng chính mà không bị kẹt không?                 |
| Chất lượng demo    | Có một khoảnh khắc đáng nhớ nhưng vẫn hợp lý không?                         |
| Kỹ thuật           | Có lỗi console, lỗi responsive, lỗi phân quyền hoặc trạng thái hỏng không?  |
| Phạm vi            | Có vô tình thêm tính năng ngoài mục tiêu không?                             |

Không kết thúc bằng câu “đã hoàn thành” chung chung. Hãy báo cáo rõ các file đã thay đổi, tính năng đã làm, cách chạy, cách kiểm thử, giới hạn còn lại và đề xuất bước tiếp theo.

---
