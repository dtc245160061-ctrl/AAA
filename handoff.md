# HAVEN PROPTECH PLATFORM — HANDOFF CONTEXT

> **Dự án**: Hệ thống Nền tảng PropTech Cho Thuê & Quản Lý Căn Hộ Tích Hợp Trí Tuệ Nhân Tạo (HAVEN)  
> **Môn học**: Ứng dụng Trí tuệ Nhân tạo trong Phát triển Phần mềm (KHMT K23A)  
> **Phiên bản**: v2.7.0 — Light Mode Architectural Overhaul & Dual-Theme Luminous Optics  
> **Cập nhật gần nhất**: 02/10/2026  

---

## 1. LIÊN KẾT HỆ THỐNG & DEPLOYMENT

- **Production Vercel URL**: [https://aaa-jade-two.vercel.app](https://aaa-jade-two.vercel.app)
- **Custom Domain**: [https://haven.is-a.dev](https://haven.is-a.dev)
- **GitHub Repository**: [https://github.com/dtc245160061-ctrl/AAA](https://github.com/dtc245160061-ctrl/AAA) (Branch: `main`)
- **Local Dev Server**: `http://localhost:5173/` (Khởi chạy bằng `HAVEN.exe` 1-click hoặc `npm run dev`)

---

## 2. TECH STACK & FILE CẤU HÌNH CỐT LÕI

- **Frontend Core**: React 19, TypeScript, Vite 8.2.1 (`vite.config.ts`, `tsconfig.json`, `package.json`).
- **Styling & Design System**:
  - `src/styles/tokens.css`: Hệ thống biến màu semantic tokens hai chế độ Dark/Light ("Tĩnh Lặng" - Serene Instrument).
  - `src/index.css`: Toàn bộ quy chuẩn layout, kính mờ atmospheric panel, thẻ chuẩn hóa, mesh drift gradient, và scrim protection.
  - `src/styles/beamEffects.css`: Hiệu ứng viền xoay 2 chùm tia đối xứng 180° GPU-accelerated (`.animate-spin-beam`, `.haven-btn-beam`).
  - `src/styles/borderGlow.css`: Hiệu ứng viền LED thở đa tầng và phát quang theo con trỏ chuột (`haven-ambient-glow-box`, `border-glow-card`).
- **Dataset & Central Reactive Store**:
  - `src/data/apartmentStore.ts`: Quản lý 1,260 căn hộ độc bản trên 11 tỉnh thành theo kiến trúc Delta Storage (dữ liệu chính trong RAM, delta chỉnh sửa lưu `localStorage`).
  - `src/data/mockData.ts`: 1,260 căn hộ chia 6 chunk chống lỗi TS2590 union complexity.
- **AI Engines**:
  - `src/services/localAiService.ts` & `src/services/geminiRagService.ts`: Hỗ trợ cả 100% Local SLM Qwen2.5-0.5B (80ms offline) và Cloud Gemini 2.0 / 1.5 Flash RAG.
  - `src/data/visualEmbeddings.ts`: 818 vector đặc trưng phục vụ Visual Vibe Search qua Cosine Similarity.
- **Native Launcher Engine**:
  - `HAVEN.exe`: Trình khởi chạy Windows GUI Subsystem C# (`/target:winexe`).
  - `launcher/serve.js` & `launcher/haven.ico`: Chạy ngầm Vite server trên port 5173.

---

## 3. VIỆC ĐÃ XONG TRONG PHIÊN NÀY

Đã giải quyết triệt để vấn đề "Giao diện sáng (Light Mode) bị nhạt nhòa, thiếu chiều sâu và bẫy vật lý ánh sáng trên nền sáng" theo phản ánh trực tiếp từ User:

1. **Khắc phục Bẫy Vật Lý Ánh Sáng trên Nền Sáng (Additive Blending Trap)**:
   - [src/styles/beamEffects.css](file:///d:/HAVEN/src/styles/beamEffects.css): Đổi màu beam Light Mode từ neon nhạt sang sắc ngọc bích đậm **Imperial Jade (`#047857`)** và **Saturated Emerald (`rgba(5, 150, 105, 0.75)`)** kèm bóng đổ quang học `drop-shadow(0 2px 8px rgba(4, 120, 87, 0.32))`.
   - [src/styles/borderGlow.css](file:///d:/HAVEN/src/styles/borderGlow.css): Đổi `mix-blend-mode: screen` sang `normal` trong Light Mode, ngăn hiệu ứng ánh sáng viền bị triệt tiêu trên nền sáng.

2. **Tái Thiết Kế Nền Canvas Đá Vôi Xúc Giác (Warm Architectural Limestone Canvas)**:
   - [src/styles/tokens.css](file:///d:/HAVEN/src/styles/tokens.css): Đổi `--haven-bg` sang `#EAEFEA` (Đá vôi ấm / Vải lanh kiến trúc), tăng độ tương phản typography chữ chính lên `#0A1120`, bổ sung biến `--guided-beam-*` cho cả hai theme.
   - [src/index.css](file:///d:/HAVEN/src/index.css): Thay thế nền phẳng `#F8FAFC` bằng `mesh-drift 26s` với 4 điểm màu hữu cơ (Ngọc bích, Cerulean, Hổ phách ấm), giúp các thẻ màu trắng tinh (`#FFFFFF`) nổi bật khối 3D rõ nét. Tái kích hoạt ambient glow mềm mại trong Light Mode.

3. **Bảo Vệ Tương Phản Hero Section & Luminous Conduit**:
   - [src/components/home/HeroSection.tsx](file:///d:/HAVEN/src/components/home/HeroSection.tsx): Thêm class `.hero-scrim-container` vào khung chứa Hero.
   - [src/index.css](file:///d:/HAVEN/src/index.css): Thêm rule miễn trừ đảo màu cho `.hero-scrim-container`, giữ chữ tiêu đề, phụ đề và chip gợi ý luôn trắng sáng tinh khôi trên nền ảnh kiến trúc tối.
   - [src/components/home/GuidedPath.tsx](file:///d:/HAVEN/src/components/home/GuidedPath.tsx): Thay thế các mã màu hex cố định bằng CSS variables `--guided-beam-*`, biến dây dẫn dữ liệu SVG thành dải ngọc lục bảo sắc nét uốn lượn xuống dải minh chứng môi trường.

4. **Kiểm Định Trực Quan & Triển Khai**:
   - Browser Subagent kiểm thử end-to-end trên `http://localhost:5173/#user_home`: 100% các khu vực (Hero, Lifestyle Tuner, Featured Properties, GuidedPath, FeatureStrip) đạt tương phản cao, không còn chỗ nào bị nhợt nhạt hay lỗi chữ đen trên nền đen.
   - Biên dịch `npx tsc --noEmit` đạt 0 lỗi.
   - Đã commit (`0618255`) và push thành công lên GitHub remote branch `main`.

---

## 4. VIỆC ĐANG DỞ DANG / BUG CHƯA FIX

- **Trạng thái Codebase**: **0 bug, 0 lỗi TypeScript**. Toàn bộ hệ thống chạy mượt mà ở cả hai theme Dark và Light.
- **Kế hoạch tiếp theo**: Sẵn sàng đón nhận yêu cầu mới từ User (chuẩn bị nội dung bảo vệ đồ án, kiểm tra module quản trị Admin, tinh chỉnh thêm các kịch bản AI SLM, hoặc xuất tài liệu báo cáo).

---

## 5. VÙNG NHẠY CẢM CẤM CHẠM VÀO (FRAGILE AREAS)

1. **Rule Đảo Màu Typography Trong `src/index.css` (`text-white:not(.always-white)`)**:
   - Các phần tử text nằm trên nền ảnh tối hoặc scrims bắt buộc phải có class `always-white` hoặc nằm trong `.hero-scrim-container`. Tuyệt đối không xóa `:not(.always-white)` hay `.hero-scrim-container` vì sẽ làm đen chữ trên nền tối trong Light Mode.
2. **Kiến Trúc Delta Storage Của `ApartmentStore` (`src/data/apartmentStore.ts`)**:
   - Không được ghi toàn bộ 1,260 căn hộ vào `localStorage` (sẽ dính lỗi `QuotaExceededError` 5MB). Chỉ lưu trữ delta căn hộ tạo mới hoặc chỉnh sửa.
3. **Cấu Trúc Chunk Mảng Trong `src/data/mockData.ts`**:
   - 1,260 căn hộ được phân thành 6 chunk nội bộ (`MOCK_UNITS_CHUNK_1` đến `_6`) rồi nối lại để tránh lỗi trình biên dịch TypeScript `TS2590: Expression produces a union type that is too complex to represent`. Không gộp chung thành một mảng literal khổng lồ duy nhất.
4. **Cổng Cố Định Port 5173 (`vite.config.ts` & `launcher/Program.cs`)**:
   - Launcher `HAVEN.exe` và file lối tắt `HAVEN.lnk` được cấu hình gắn chặt với cổng 5173. Không tự ý đổi port Vite.

---

## 6. QUYẾT ĐỊNH KIẾN TRÚC VỪA THỐNG NHẤT

- **Dual-Theme Luminous Optics**: 
  - Dark Mode: Sử dụng phát sáng cộng (`mix-blend-mode: screen`, tia laser neon sáng rực rỡ trên nền đen).
  - Light Mode: Chuyển sang khúc xạ thấu kính ngọc bích (`mix-blend-mode: normal`, màu Imperial Jade `#047857` đậm đà, đổ bóng quang học drop-shadow trên nền đá vôi ấm `#EAEFEA`).
- **Nền Light Mode không bao giờ dùng trắng toát `#FFFFFF`**: Luôn dùng chất liệu đá vôi/vải lanh ấm `#EAEFEA` để tạo nền cho các thẻ card trắng `#FFFFFF` nổi bật hiệu ứng 3D xúc giác.

---

## 7. BƯỚC CHÍNH XÁC TIẾP THEO KHI MỞ CHAT MỚI

1. Kiểm tra ứng dụng qua trình duyệt tại `http://localhost:5173/#user_home` (hoặc nhấp 1-click icon HAVEN trên màn hình Desktop).
2. Lắng nghe và thực hiện chính xác chỉ đạo tiếp theo của User (yêu cầu phát triển module mới, tinh chỉnh dữ liệu báo cáo, hoặc chuẩn bị slide thuyết trình demo).
