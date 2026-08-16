# HAVEN — Nghiên Cứu Sản Phẩm (Phần 3: Monetization, UX/UI, Scoring & Roadmap)

---

## 9. Mô Hình Kiếm Tiền & Bảng So Sánh

### 9.1 Phân Tích 7 Dòng Doanh Thu

| # | Dòng doanh thu | Mô tả | Người trả | Doanh thu trực tiếp | Chi phí vận hành | Độ khó triển khai | Rủi ro niềm tin | Rủi ro pháp lý | Khả năng demo | Khả năng mở rộng |
|---|---------------|-------|-----------|--------------------|--------------------|---------------------|------------------|-----------------|----------------|-------------------|
| R1 | **SaaS cho chủ nhà** | Gói công cụ quản lý hàng tháng (listing, analytics, CRM, auto-reply) | Chủ nhà | ★★★★ (recurring) | ★★ | ★★★ | ★ (thấp) | ★ | ★★★★★ | ★★★★★ |
| R2 | **Phí môi giới chốt khách** | 50-100% tiền thuê tháng đầu khi lead → hợp đồng | Chủ nhà | ★★★★★ (high ticket) | ★★★ | ★★★★ | ★★ | ★★ | ★★★★ | ★★★ |
| R3 | **Tin đăng nổi bật** | Boost tin lên top kết quả tìm kiếm (thời hạn 7/14/30 ngày) | Chủ nhà | ★★★ | ★ | ★★ | ★★★ (nếu spam quá mức) | ★ | ★★★★ | ★★★★ |
| R4 | **Phí bảo chứng (Escrow take-rate)** | 3-5% trên mỗi giao dịch thanh toán tiền thuê qua nền tảng | Chia: Chủ nhà 3% + Người thuê 2% | ★★★★ | ★★★★ | ★★★★★ | ★★ | ★★★★ (license) | ★★★ | ★★★★★ |
| R5 | **Hoa hồng VAS** | 15-20% chiết khấu từ dịch vụ đối tác (dọn dẹp, chuyển nhà, bảo hiểm) | Người thuê (gián tiếp qua giá dịch vụ) | ★★★ | ★★ | ★★★ | ★ | ★ | ★★★★ | ★★★★ |
| R6 | **Gói hội viên người thuê** | Đặc quyền: cọc 0đ, dọn dẹp miễn phí, ưu tiên xem nhà | Người thuê | ★★ | ★★★ | ★★★ | ★★★ (nếu khóa info an toàn) | ★ | ★★★★ | ★★★ |
| R7 | **B2B Relocation** | Gói cho doanh nghiệp có nhân viên chuyển địa điểm | Doanh nghiệp | ★★★★ | ★★ | ★★★★ | ★ | ★★ | ★★ | ★★★★★ |

### 9.2 Nguyên Tắc Doanh Thu

> [!IMPORTANT]
> **Nguyên tắc bất khả xâm phạm**: Thông tin liên quan đến an toàn (PCCC, ngập lụt, cảnh báo lừa đảo, badge xác minh cơ bản) **KHÔNG BAO GIỜ** nằm sau paywall. Người thuê phải được truy cập miễn phí.

**Miễn phí cho người thuê (vì liên quan an toàn/minh bạch)**:
- Xem tổng chi phí ước tính
- Bản đồ An Tâm (lớp ngập, PCCC)
- Badge xác minh chủ nhà
- Cảnh báo giá bất thường
- Tìm kiếm cơ bản + lọc đa tiêu chí
- Chat với chủ nhà
- Checklist xem nhà
- Báo cáo tin đăng

**Có thể nằm trong gói trả phí người thuê (tiết kiệm thời gian/tiện ích nâng cao)**:
- So sánh đa chiều (>2 căn)
- AI Advisor nâng cao (phân tích chi tiết, unlimited queries)
- Ưu tiên lịch xem nhà
- Kho tài liệu không giới hạn
- Thông báo tin mới trước 24h
- Giảm giá dịch vụ VAS

### 9.3 Mô Hình Phù Hợp Cho Đồ Án vs. Sản Phẩm Thật

| Giai đoạn | Mô hình chính | Lý do |
|-----------|---------------|-------|
| **Đồ án (demo)** | SaaS chủ nhà (R1) + Tin nổi bật (R3) + VAS (R5) | Dễ demo, không cần payment thật, thể hiện tư duy monetization |
| **Sau khi có user** | R1 + R2 + R3 + R5 + R6 | Thêm commission khi có transaction thật; gói người thuê khi có PMF |
| **Scale** | R1 + R2 + R4 + R5 + R7 | Escrow khi đủ license; B2B khi có data thị trường |

---

## 10. Đề Xuất Gói Thành Viên

### 10.1 Gói Cho Chủ Nhà

| Thuộc tính | 🆓 Starter | ⭐ Pro | 💼 Business | 🏢 Enterprise |
|-----------|------------|--------|-------------|---------------|
| **Giá** | 0đ | 399.000đ/tháng | 999.000đ/tháng | 2.499.000đ/tháng |
| **Đối tượng** | Chủ nhà 1-2 căn, thử nghiệm | Chủ nhà 3-5 căn, muốn chuyên nghiệp | Chủ nhiều căn (6-15), cần hiệu quả | Môi giới/BQL tòa nhà (>15 căn) |
| **Số căn** | Tối đa 2 | Tối đa 5 | Tối đa 15 | Không giới hạn |
| **Đăng tin** | Cơ bản, 3 ảnh | AI hỗ trợ, 10 ảnh + video | AI + gợi ý giá + analytics | Tất cả + bulk upload |
| **Chat** | Manual reply | Canned replies + auto-greeting | + AI chatbot | + Multi-agent inbox |
| **Analytics** | Lượt xem cơ bản | + Tỷ lệ conversion, so sánh khu vực | + Revenue forecast, occupancy trend | + Custom report, export |
| **Badge** | Không | "Pro Landlord" | "Business Partner" | "Verified Enterprise" |
| **Hoa hồng môi giới** | 100% tháng đầu | 70% tháng đầu | 50% tháng đầu | 30% tháng đầu (hoặc flat fee) |
| **Ưu tiên duyệt** | Tiêu chuẩn (24h) | Nhanh (12h) | Ưu tiên (6h) | Tức thì (2h) + Account Manager |
| **Hợp đồng số** | Không | Template cơ bản | Template tùy chỉnh | + E-signature |
| **Nhắc thanh toán** | Không | Email | + SMS/Zalo | + Auto-generate hóa đơn |
| **Giá trị kinh doanh** | Test thử nền tảng | Tiết kiệm ~5h/tuần, tăng 30% lead chất lượng | Quản lý portfolio chuyên nghiệp, giảm 50% thời gian trống | Vận hành quy mô lớn, cam kết hiệu quả |
| **Nguy cơ lạm dụng** | Thấp | Trung bình — đăng tin spam để tận dụng AI | Trung bình — fake analytics | Thấp (có SLA + Account Manager giám sát) |
| **Kiểm chứng nhu cầu** | A/B test conversion Starter→Pro | Survey chủ nhà có 3-5 căn | Interview 10 chủ nhiều căn | Liên hệ 3-5 BQL tòa nhà |

### 10.2 Gói Cho Người Thuê

| Thuộc tính | 🆓 Free | 💎 HAVEN Plus |
|-----------|---------|---------------|
| **Giá** | 0đ | 79.000đ/tháng |
| **Đối tượng** | Mọi người thuê | Người thuê muốn tiết kiệm thời gian, trải nghiệm premium |
| **Tìm kiếm** | Đầy đủ bộ lọc + bản đồ + True Cost | + So sánh Arena (>2 căn) + AI Advisor nâng cao |
| **Thông tin an toàn** | ✅ Đầy đủ (ngập, PCCC, badge chủ nhà, cảnh báo) | ✅ Đầy đủ (không thay đổi) |
| **Chat** | Không giới hạn | + Ưu tiên xếp hàng reply |
| **Thông báo** | Tin mới cùng lúc mọi người | + Tin mới sớm hơn 24h |
| **Kho tài liệu** | 3 file | Không giới hạn |
| **VAS** | Giá gốc | Giảm 15% tất cả dịch vụ |
| **Checklist nhận nhà** | ✅ | + Bản nâng cao (so sánh ảnh in/out) |
| **Lý do không ép**: | Tất cả info an toàn vẫn free | Chỉ thu phí cho tiện ích/thời gian, KHÔNG cho an toàn |

> [!WARNING]
> **Không nên tạo gói Max/Ultra cho người thuê** — thị trường VN nhạy cảm giá, đặc biệt sinh viên và người đi làm entry-level. Một gói Plus duy nhất dễ hiểu, dễ quyết định. Nếu cần thêm tier → kiểm chứng bằng data trước.

---

## 11. Định Hướng UX/UI & Kịch Bản Demo

### 11.1 Hướng Thiết Kế

| Yếu tố | Định hướng |
|---------|-----------|
| **Phong cách** | Liquid Glass UI (đã có) — kính mờ nhám, viền phát quang, nền tối sâu sang trọng. **Giữ nguyên** nhưng bổ sung warm accent cho trang người thuê |
| **Cảm giác** | **An tâm** (không phải luxury xa cách). Warm nhưng chuyên nghiệp. Tin cậy nhưng không cứng nhắc |
| **Palette** | Dark: `#0B0C0E` (nền) · `#10B981` (emerald — trust/verified) · `#F59E0B` (amber — warning) · `#EF4444` (red — danger) · `#6366F1` (indigo — premium/interactive) · `#F8FAFC` (text) |
| **Light mode** | `#FAFAFA` (nền) · Emerald giữ nguyên · Text `#1E293B` · Card `#FFFFFF` viền `#E2E8F0` |
| **Kiểu chữ** | **Inter** (UI) + **Lexend** (heading) — cả hai hỗ trợ Vietnamese diacritics tốt, modern, clean |
| **Bản đồ** | Mapbox GL JS hoặc Google Maps embed — style tối để khớp dark mode |
| **Thẻ căn hộ** | Ảnh góc bo 12px · Badge overlay (✓ Đã xác minh / ⭐ Nổi bật) · Tổng chi phí lớn hơn giá thuê · Trust score nhỏ góc phải |
| **Biểu đồ** | Recharts — style minimal, đường cong mượt, tooltip chi tiết |
| **Huy hiệu** | Pill-shaped, viền emerald glow cho verified, amber cho warning, mờ cho unverified |
| **Khoảng trắng** | Generous padding (16-24px), card gap 16px, section gap 48px |
| **Trạng thái trống** | Illustration + text hướng dẫn: "Chưa có căn hộ nào được lưu — Bắt đầu tìm kiếm?" |
| **Thông báo lỗi** | Toast notification góc phải dưới, friendly tone: "Oops! Không tìm thấy căn nào phù hợp — thử giảm bớt bộ lọc?" |
| **Micro-interaction** | Smooth transition 300ms, card hover lift 4px + shadow, badge pulse khi mới nhận, counter animate khi giá trị thay đổi |
| **Responsive** | Mobile-first: bottom tab nav, card stack, collapsible filters, swipe between map/list |
| **Accessibility** | WCAG AA contrast minimum, focus visible, aria-labels cho icon buttons, keyboard navigation |

### 11.2 Mô Tả Các Màn Hình Quan Trọng

#### Landing / Trang Chủ
- Hero section: Background video/ảnh cinematic skyline TP.HCM → Headline: "Tìm Nơi Ở An Tâm" → Sub: "Biết rõ tổng chi phí, rủi ro khu vực, và chủ nhà uy tín — trước khi cọc"
- Quick search bar: "Nhập khu vực, quận, hoặc mô tả nhu cầu..."
- **Lifestyle Tuning Dials** (đã có): 3-4 slider: Ngân sách / Commute / Yên tĩnh / An toàn → live filter
- Khu vực nổi bật: Card quận (Q1, Q7, Thủ Đức...) với giá trung bình + trend
- Căn hộ tiêu biểu: 6-8 card có True Cost hiển thị

#### Trang Tìm Kiếm
- Layout: Trái = Bản đồ (60%) | Phải = Danh sách card (40%); toggle full-map/full-list trên mobile
- Filter bar: Giá tổng, Phòng, Diện tích, Hướng, Tầng, Pet, Commute, Ngập, PCCC, Nội thất, Thời hạn
- Card: Ảnh · Badge verified · Tên · Quận · **Tổng CP/tháng** (bold, lớn) · Giá thuê gốc (nhỏ, strikethrough) · Trust ★ · Commute time
- Sort: Phù hợp nhất / Giá thấp / Giá cao / Mới nhất / Trust cao nhất

#### Trang Chi Tiết Căn Hộ
- **Gallery**: Carousel ảnh/video, tab: Ảnh chủ nhà / Virtual tour / Community photos
- **True Cost Panel**: Animation breakdown → tổng ước tính
- **Bản Đồ An Tâm**: Inline map với toggle layers
- **PCCC Card**: Thông tin phòng cháy có ngữ cảnh
- **Chủ nhà**: Mini profile + Trust Score + CTA "Chat" (chấm xanh)
- **Review**: Timeline, tag theo mùa, filter theo chủ đề (sạch sẽ / yên tĩnh / chủ nhà)
- **Sidebar sticky**: Tổng CP + CTA "Đặt lịch xem" + "Lưu" + "So sánh"

#### So Sánh (Comparison Arena)
- 2-3 card cạnh nhau, scroll đồng bộ
- Radar chart tổng hợp
- Highlight khác biệt (giá cao hơn = đỏ, thấp hơn = xanh)
- CTA: "Căn phù hợp nhất với bạn: #2" (AI suggestion)

#### Chat
- Shopee-style (đã có): Danh sách hội thoại trái, chat window phải
- Quick chips auto-generated từ info thiếu
- Inline: Đặt lịch / Chia sẻ file / Pin thỏa thuận
- Bottom: Report + Block

#### Hồ Sơ Chủ Nhà
- Avatar + Tên + Badge + Trust Score
- Tab: Căn đang hoạt động / Review / Lịch sử hoạt động
- Metrics: Reply speed / Active since / Cancel rate / Verified ✓

#### Dashboard Chủ Nhà (Admin)
- KPI cards: Tổng thu / Tỷ lệ lấp đầy / Thời gian trống TB / Lead mới
- Biểu đồ: Revenue trend / Occupancy rate
- Quick actions: Trả lời tin nhắn / Duyệt lead / Tạo hóa đơn

#### Dashboard Admin
- Marketplace Health: Tỷ lệ verified / Report trend / Duyệt queue size
- Revenue: Breakdown theo stream + trend
- User management: Quick search + suspend/unsuspend
- Moderation: Queue với preview + action buttons

### 11.3 First Impression (30 Giây Đầu)

```
0s    → Landing page: Video background skyline TP.HCM nhìn từ trên cao
3s    → Fade in: "Tìm Nơi Ở An Tâm" (heading emerald glow)
5s    → Search bar animate mở ra
8s    → Lifestyle Tuning Dials hiện ra (Budget / Commute / Safety)
12s   → Kéo dial "Safety" lên cao → bản đồ filter live
15s   → Scroll xuống: Card căn hộ xuất hiện với stagger animation
18s   → Hover card → True Cost hiện nhanh: "8tr → Thật ra 10.6tr"
22s   → Click card → Trang chi tiết mở smooth transition
25s   → Bản Đồ An Tâm auto-mở → Overlay ngập + trường + PCCC
30s   → "Đây không phải Airbnb. Đây là nơi người Việt thuê nhà an tâm."
```

### 11.4 Kịch Bản Demo 3-5 Phút

**Mở đầu (30s)**: *"Bạn biết không, 9/10 tin cho thuê ở VN chỉ ghi giá thuê mà không ghi tổng chi phí thật. Và năm 2024, hàng nghìn người bị lừa tiền cọc. HAVEN ra đời để thay đổi điều đó."*

**Phần 1 — Người thuê tìm nhà (90s)**:
1. Mở landing → Gõ: "2 phòng ngủ quận 7, 15 triệu, có chỗ đỗ ô tô, sợ ngập"
2. Kết quả hiện ra → Chỉ ra: **"Thấy chưa? Tổng chi phí 14.2 triệu, không phải 10 triệu như quảng cáo"**
3. Click vào căn hộ → True Cost Panel → Bản Đồ An Tâm: "Khu này ít ngập, PCCC đã xác minh, 2 trường mầm non gần"
4. So sánh 2 căn → Radar chart → "Căn B an toàn hơn nhưng đắt hơn 2 triệu — bạn chọn gì?"

**Phần 2 — Chat & Đặt lịch (60s)**:
5. Bấm "Chat" → Bot chào → Chips: "Nuôi mèo OK?" → Bot: "Được! Cọc thú cưng 500k"
6. Đặt lịch xem → Chọn slot → Xác nhận
7. **Chuyển tab admin** → Chủ nhà thấy notification → Reply → Tạo hợp đồng 1-click

**Phần 3 — Trust & Vận hành (60s)**:
8. Quay về trang chi tiết → Chỉ Landlord Trust Score: "4.7★, reply 1.2h, xác minh đầy đủ"
9. Mở admin dashboard → Marketplace Health: "98% tin xác minh, report giảm 15%/tuần"
10. Revenue breakdown: SaaS 45% / Commission 30% / VAS 25%

**Kết (30s)**: *"HAVEN không phải sàn đăng tin. HAVEN giúp người thuê biết rõ trước khi cọc, giúp chủ nhà uy tín được thưởng, và giúp thị trường thuê nhà VN minh bạch hơn mỗi ngày."*

---

## 12. Bảng Chấm Điểm & Phân Loại Ưu Tiên

### 12.1 Tiêu Chí Chấm Điểm (thang 1-5, trọng số)

| Tiêu chí | Trọng số |
|----------|---------|
| Giá trị thực tế cho người thuê | 20% |
| Phù hợp bối cảnh Việt Nam | 15% |
| Tạo niềm tin và an toàn | 15% |
| Khác biệt so với đối thủ | 15% |
| Gây ấn tượng khi demo | 15% |
| Khả năng xây dựng trong đồ án | 10% |
| Tiềm năng doanh thu | 5% |
| Khả năng mở rộng | 5% |

### 12.2 Top 30 Tính Năng Chấm Điểm (rút gọn từ 105)

| # | Tính năng | Giá trị NT (20%) | VN (15%) | Trust (15%) | Khác biệt (15%) | Demo (15%) | Xây (10%) | DT (5%) | MR (5%) | **Điểm TH** | **Nhóm** |
|---|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| B1 | True Cost Breakdown | 5 | 5 | 4 | 5 | 5 | 5 | 2 | 4 | **4.55** | **P0** |
| SF1 | Bản Đồ An Tâm | 5 | 5 | 5 | 5 | 5 | 3 | 2 | 4 | **4.55** | **P0** |
| C5 | Landlord Trust Score | 5 | 4 | 5 | 5 | 4 | 4 | 3 | 5 | **4.50** | **P0** |
| C6 | Verified Listing Badge | 5 | 4 | 5 | 4 | 4 | 5 | 2 | 4 | **4.35** | **P0** |
| SF4 | PCCC Transparency Card | 4 | 5 | 5 | 5 | 5 | 4 | 1 | 3 | **4.35** | **P0** |
| D1 | Smart Question Chips | 4 | 4 | 3 | 4 | 4 | 5 | 1 | 3 | **3.80** | **P0** |
| SF3 | Comparison Arena | 4 | 3 | 3 | 5 | 5 | 5 | 2 | 4 | **3.95** | **P0** |
| A1 | True Cost Search Filter | 5 | 5 | 3 | 5 | 4 | 5 | 2 | 4 | **4.30** | **P0** |
| A2 | Commute Finder | 4 | 4 | 2 | 4 | 5 | 3 | 1 | 4 | **3.60** | **P1** |
| SF6 | AI Housing Advisor (nâng cấp) | 4 | 4 | 3 | 4 | 5 | 4 | 2 | 4 | **3.90** | **P1** |
| D10 | Landlord Profile Page | 4 | 3 | 5 | 4 | 4 | 5 | 3 | 4 | **4.00** | **P0** |
| E3 | Move-In Checklist | 4 | 4 | 4 | 5 | 4 | 5 | 1 | 3 | **4.00** | **P1** |
| C13 | PCCC Info Contextual | 4 | 5 | 5 | 5 | 4 | 3 | 1 | 3 | **4.10** | **P1** |
| B6 | Deposit Terms Panel | 5 | 4 | 4 | 4 | 3 | 5 | 1 | 3 | **3.90** | **P0** |
| F1 | Smart Listing Creator | 3 | 3 | 3 | 4 | 5 | 4 | 3 | 4 | **3.55** | **P1** |
| A14 | Neighborhood Guide | 4 | 5 | 3 | 4 | 4 | 4 | 2 | 4 | **3.85** | **P1** |
| B7 | Warning Badges | 4 | 4 | 5 | 4 | 3 | 5 | 1 | 3 | **3.85** | **P0** |
| C7 | Price Anomaly Alert | 4 | 4 | 5 | 4 | 3 | 5 | 1 | 3 | **3.85** | **P0** |
| D4 | Đặt Lịch Xem Tích Hợp | 4 | 3 | 3 | 3 | 4 | 5 | 2 | 3 | **3.45** | **P0** |
| SF12 | Marketplace Health Dashboard | 2 | 3 | 4 | 5 | 5 | 5 | 3 | 4 | **3.60** | **P1** |
| E1 | Document Vault | 3 | 3 | 3 | 4 | 3 | 5 | 1 | 4 | **3.25** | **P1** |
| B3 | Landlord Q&A Prompt | 4 | 4 | 3 | 4 | 3 | 5 | 1 | 2 | **3.50** | **P1** |
| F5 | Listing Analytics | 3 | 2 | 2 | 3 | 4 | 5 | 4 | 4 | **3.15** | **P1** |
| C14 | Escrow Cọc | 5 | 5 | 5 | 5 | 4 | 1 | 4 | 5 | **4.15** | **P2** |
| A3 | Flood-Safe Search | 4 | 5 | 4 | 5 | 4 | 2 | 1 | 3 | **3.75** | **P2** |
| E13 | Digital Contract | 3 | 4 | 4 | 4 | 4 | 3 | 3 | 5 | **3.65** | **P2** |
| SF8 | Deposit Safety Flow | 5 | 5 | 5 | 5 | 5 | 2 | 5 | 5 | **4.45** | **P2** (prototype only) |
| B9 | Virtual Tour | 3 | 2 | 2 | 3 | 4 | 2 | 2 | 3 | **2.70** | **P2** |
| C15 | Dispute Center | 3 | 3 | 4 | 4 | 2 | 1 | 2 | 4 | **2.90** | **Loại bỏ** |
| R4 | Escrow Take-Rate (thật) | 3 | 4 | 3 | 4 | 2 | 1 | 5 | 5 | **3.10** | **Loại bỏ** (cho đồ án) |

### 12.3 Phân Nhóm Ưu Tiên

#### P0 — Bắt Buộc (cần có để sản phẩm hợp lý và demo không khuyết)
- B1: True Cost Breakdown Panel
- A1: True Cost Search Filter
- SF1/H1: Bản Đồ An Tâm (Confidence Map)
- C5: Landlord Trust Score
- C6: Verified Listing Badge (3 cấp)
- SF4: PCCC Transparency Card
- D10: Landlord Profile Page
- D1: Smart Question Chips (nâng cấp Quick Chips hiện có)
- D4: Đặt Lịch Xem Tích Hợp
- B6: Deposit Terms Panel
- B7: Warning Badges
- C7: Price Anomaly Alert
- SF3/H4: Comparison Arena

#### P1 — Khác Biệt (tạo lợi thế và gây ấn tượng)
- A2: Commute Finder
- SF6/H5: AI Housing Advisor (nâng cấp)
- E3/SF7: Move-In Checklist
- F1/SF9: Smart Listing Creator
- A14/SF11: Neighborhood Guide
- SF12/H8: Marketplace Health Dashboard
- E1: Document Vault
- F5: Listing Analytics
- B3: Landlord Q&A Prompt

#### P2 — Mở Rộng (giá trị nhưng chưa làm ở bản đầu)
- SF8: Deposit Safety Flow (prototype/animation only)
- C14: Escrow Cọc (cần license)
- A3: Flood-Safe Search (cần API thật)
- E13: Digital Contract (cần tư vấn pháp lý)
- B9: Virtual Tour (cần infrastructure upload)
- R7: B2B Relocation

#### Loại Bỏ / Chưa Làm
- C15: Dispute Center (quá phức tạp cho đồ án, rủi ro pháp lý)
- R4: Escrow Take-Rate thật (cần license tài chính)
- C3: Address Verification (quá phức tạp, chi phí cao)

---

## 13. Top 10 Tính Năng Nên Ưu Tiên

### 1. 🏆 True Cost Breakdown Panel (B1)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Giải quyết pain point #1 (giá quảng cáo ≠ giá thật); tạo khác biệt ngay từ trang chi tiết; dễ build; gây ấn tượng mạnh khi demo |
| **Phụ thuộc** | Data model có trường: rent, electricity_rate, water, internet, management_fee, parking_fee, deposit_months |
| **Dữ liệu** | Chủ nhà nhập khi đăng tin (bắt buộc hoặc gợi ý) |
| **Demo MVP** | 5 căn hộ mẫu có True Cost khác nhau, animated counter |
| **Tiêu chí nghiệm thu** | Tổng chi phí hiển thị trên cả card lẫn trang chi tiết; animation mượt; accurate calculation |
| **Đo thành công** | % user click "Xem chi tiết chi phí" > 60%; bounce rate trang chi tiết giảm |

### 2. 🏆 Bản Đồ An Tâm — Confidence Map (SF1)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Signature feature #1; tổng hợp nhiều nguồn dữ liệu vào 1 trải nghiệm; wow khi demo; giải quyết lo ngại ngập + PCCC + tiện ích |
| **Phụ thuộc** | Mapbox/Google Maps embed; data layers (ngập, PCCC, trường, bệnh viện) |
| **Dữ liệu** | Mock nhưng realistic (5-10 quận), ghi rõ nguồn tham chiếu |
| **Demo MVP** | Toggle 4-5 layers trên bản đồ, mỗi layer có chỉ báo tin cậy |
| **Tiêu chí nghiệm thu** | ≥4 layers, toggle smooth, tin cậy indicator, responsive trên mobile |

### 3. 🏆 Comparison Arena (SF3) — *feature tạo wow*
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Không đối thủ VN nào có so sánh đa chiều; radar chart trực quan; wow demo |
| **Phụ thuộc** | True Cost data (B1), Trust Score (C5), Commute data |
| **Demo MVP** | So sánh 3 căn mẫu có profile rất khác nhau |
| **Tiêu chí nghiệm thu** | Side-by-side ≥3 căn; radar chart; highlight khác biệt; AI suggestion |

### 4. Landlord Trust Score (C5)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Tạo accountability cho chủ nhà; differentiate uy tín vs. "cò"; Shopee đã validate model |
| **Phụ thuộc** | Verified Badge (C6), Review system, Chat response tracking |
| **Demo MVP** | 5 profile chủ nhà mẫu với score khác nhau |
| **Tiêu chí nghiệm thu** | Score hiển thị trên profile + card + chat; formula transparent |

### 5. Verified Listing Badge — 3 Cấp (C6)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Visual trust signal đơn giản nhưng hiệu quả; badge là pattern quen thuộc (Shopee, Batdongsan) |
| **Phụ thuộc** | Upload document system |
| **Demo MVP** | 3 mức badge trên card và trang chi tiết |
| **Tiêu chí nghiệm thu** | 3 badge states visually distinct; tooltip giải thích mức |

### 6. PCCC Transparency Card (SF4) — *feature tạo wow*
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Giải quyết nỗi lo #1 sau Khương Hạ; không ai làm; có bằng chứng nhu cầu; phù hợp VN cực cao |
| **Phụ thuộc** | Data model PCCC fields; disclaimer framework |
| **Demo MVP** | Card hiển thị 5 mục PCCC + 3 trạng thái (xác minh/chưa/không có) |
| **Tiêu chí nghiệm thu** | Card chính xác; disclaimer hiển thị; CTA "Hỏi chủ nhà" hoạt động |

### 7. Smart Question Chips (D1 nâng cấp)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Nâng cấp feature đã có; tăng engagement chat; giúp người thuê biết hỏi gì |
| **Phụ thuộc** | ChatModal (đã có), tin đăng data |
| **Demo MVP** | Chips auto-generate dựa trên info thiếu trong tin |
| **Tiêu chí nghiệm thu** | Chips thay đổi theo từng căn hộ; bot trả lời chính xác |

### 8. Landlord Profile Page (D10)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Tạo "gương mặt" cho chủ nhà; tăng trust; nền tảng cho Trust Score |
| **Phụ thuộc** | Trust Score (C5), Badge (C6), Review system |
| **Demo MVP** | Trang profile đầy đủ với 3-5 chủ nhà mẫu |
| **Tiêu chí nghiệm thu** | Profile hiển thị từ card + chat + trang riêng; metrics accurate |

### 9. True Cost Search Filter (A1)
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Bổ trợ B1; cho phép tìm theo "tổng chi phí thật" thay vì giá thuê — unique selling point |
| **Phụ thuộc** | True Cost data (B1) |
| **Demo MVP** | Slider range filter "Tổng chi phí/tháng" trên trang tìm kiếm |
| **Tiêu chí nghiệm thu** | Filter hoạt động chính xác; kết quả sort theo tổng CP |

### 10. Marketplace Health Dashboard (SF12) — *feature tạo wow*
| Thuộc tính | Chi tiết |
|-----------|----------|
| **Lý do chọn** | Thể hiện tư duy vận hành; gây ấn tượng với giám khảo/reviewer; chứng minh "đây không phải app bài tập" |
| **Phụ thuộc** | Data aggregation từ tất cả modules |
| **Demo MVP** | Dashboard với 6-8 KPI cards + 2-3 charts + trend |
| **Tiêu chí nghiệm thu** | KPIs cập nhật real-time (hoặc near-real-time); charts interactive |

---

## 14. Bản Đồ Kỹ Thuật & Cách Mô Phỏng Dữ Liệu

### 14.1 Mapping Tính Năng → Kỹ Thuật

| Hạng mục kỹ thuật | Tính năng liên quan | Phân loại | Ghi chú |
|-------------------|---------------------|-----------|---------|
| **Mô hình dữ liệu** | Tất cả | ✅ Làm thật | Mở rộng `apartment.ts`: thêm fields True Cost, PCCC, Trust Score, Verification status |
| **Reactive Store + localStorage** | Tất cả | ✅ Làm thật (đã có) | Mở rộng `apartmentStore.ts` cho các entity mới |
| **API layer** | Search, filter, sort | ✅ Làm thật (client-side) | Vì dùng localStorage, API = helper functions filter/sort |
| **Bản đồ + Geocoding** | Confidence Map, Commute, Neighborhood | 🟡 Embed + Mock data | Mapbox static map hoặc Google Maps embed; tọa độ mock cho 10 căn hộ |
| **Tìm kiếm NLP** | AI Advisor | ✅ Làm thật (pattern matching) | Nâng cấp `UserAiAdvisorDrawer.tsx` với thêm context (True Cost, Safety) |
| **Thông báo** | Nhắc lịch, nhắc thanh toán | 🟢 Mô phỏng in-app | Toast notification; không cần push thật cho demo |
| **Chat thời gian thực** | Chat, Quick Chips | ✅ Làm thật (local) | Đã có ChatModal + AdminInboxView; nâng cấp Smart Chips |
| **Upload ảnh/tài liệu** | Gallery, Document Vault, Xác minh | 🟢 Mô phỏng | Dùng ảnh mẫu pre-loaded; upload UI có nhưng lưu local |
| **Xác minh (eKYC)** | C1, C2 | 🔴 Prototype UI only | Tạo UI upload → hiển thị "Đang xác minh..." → auto-approve sau 3s |
| **Thanh toán** | Escrow, Billing | 🔴 Prototype flow | Animated diagram; không cần payment gateway thật |
| **Phân quyền** | Consumer/Admin | ✅ Làm thật (đã có) | `?view=admin` đã phân tách 2 phân hệ |
| **Kiểm duyệt** | Moderation queue | 🟢 Dữ liệu mẫu | Pre-loaded queue với 3-5 tin pending |
| **Phân tích** | Analytics, Dashboard | ✅ Làm thật (tính từ data store) | Recharts; aggregate từ store data |
| **Bảo mật** | Privacy, Auth | 🟢 Mô phỏng | Không cần auth thật cho demo; role switch bằng URL param |
| **PCCC data** | PCCC Card | 🟢 Dữ liệu mẫu | **KHÔNG giả vờ là dữ liệu thật**; ghi rõ "Mock data, tham chiếu: Cục PCCC" |
| **Dữ liệu ngập** | Confidence Map | 🟢 Dữ liệu mẫu | Tham chiếu UDI Maps/HSDC Maps nhưng data là mock; ghi nguồn + disclaimer |
| **Dữ liệu trường/bệnh viện** | Map layers | 🟡 Google Places hoặc mock | Có thể embed Google Maps với nearby search; hoặc mock coordinates |

### 14.2 Dữ Liệu Mẫu Cần Tạo

| Loại | Số lượng | Chi tiết |
|------|---------|---------|
| Căn hộ | 15-20 | Đa dạng: studio, 1PN, 2PN, 3PN; 5 quận; giá 3-25 triệu; mix verified/unverified |
| Chủ nhà | 8-10 | Đa dạng: cá nhân 1 căn, nhiều căn, môi giới, BQL; trust score từ 3.5-4.9 |
| Người thuê | 5-8 | Persona-based: sinh viên, nhân viên, gia đình, expat |
| Review | 30-40 | Mix positive/neutral; tag theo mùa; nhiều chủ đề |
| Chat conversations | 5-8 | Pre-scripted nhưng realistic |
| Report/Moderation | 3-5 | Các case khác nhau: ảnh sai, giá bất thường, spam |
| Hợp đồng/Hóa đơn | 3-5 | Mẫu realistic |

---

## 15. Lộ Trình Triển Khai

### Phase 1: NỀN TẢNG (Tuần 1-2)
*Mục tiêu: Sản phẩm cơ bản hoạt động, data model đầy đủ*

- [ ] Mở rộng data model: True Cost fields, PCCC fields, Verification fields, Trust Score
- [ ] Tạo 15-20 căn hộ mẫu với dữ liệu đầy đủ
- [ ] True Cost Breakdown Panel (B1) trên trang chi tiết
- [ ] True Cost Search Filter (A1)
- [ ] Verified Listing Badge 3 cấp (C6)
- [ ] Warning Badges (B7): giá bất thường, tin cũ, chưa xác minh
- [ ] Deposit Terms Panel (B6)
- [ ] Nâng cấp Smart Question Chips (D1)
- [ ] Landlord Profile Page cơ bản (D10)
- [ ] Đặt Lịch Xem Tích Hợp (D4)

### Phase 2: KHÁC BIỆT (Tuần 3-4)
*Mục tiêu: Signature features hoạt động, tạo wow*

- [ ] 🌟 Bản Đồ An Tâm — Confidence Map (SF1) với 4 layers
- [ ] 🌟 Comparison Arena (SF3) với radar chart
- [ ] 🌟 PCCC Transparency Card (SF4)
- [ ] Landlord Trust Score tính toán + hiển thị (C5)
- [ ] Price Anomaly Alert (C7)
- [ ] AI Housing Advisor nâng cấp (SF6) — thêm context an toàn + chi phí
- [ ] Smart Listing Creator (F1) — AI gợi ý mô tả + giá + flag thiếu
- [ ] Neighborhood Guide cho 3-5 quận mẫu (A14)

### Phase 3: HOÀN THIỆN DEMO (Tuần 5-6)
*Mục tiêu: Demo mượt, polish UI, test flow E2E*

- [ ] 🌟 Marketplace Health Dashboard (SF12)
- [ ] Move-In Checklist + Condition Log (E3, E4)
- [ ] Document Vault cơ bản (E1)
- [ ] Listing Analytics cho chủ nhà (F5)
- [ ] Deposit Safety Flow prototype (SF8) — animation diagram
- [ ] Commute Finder (A2) — nếu kịp, embed Google Maps directions
- [ ] Polish: animations, micro-interactions, responsive, error states, empty states
- [ ] Kịch bản demo hoàn chỉnh, test 3 lần end-to-end
- [ ] Build production, deploy Vercel

---

## 16. Rủi Ro, Giả Định & Câu Hỏi Cần Kiểm Chứng

### 16.1 Rủi Ro

| Rủi ro | Mức độ | Giảm thiểu |
|--------|--------|-----------|
| **Dữ liệu PCCC/ngập không chính xác** → sai lệch quyết định | Cao | Luôn ghi nguồn + ngày + mức tin cậy + disclaimer; KHÔNG gán nhãn "An toàn/Không an toàn" |
| **Trust Score bị game** → chủ nhà tạo review giả | Trung bình | Chỉ cho review sau khi có giao dịch thật (hoặc mock verified); weight review theo thời gian ở |
| **Scope creep** → không hoàn thành trong thời gian | Cao | Tuân thủ nghiêm Phase 1→2→3; cut P2 nếu trễ |
| **UI quá phức tạp** → overwhelm người thuê | Trung bình | Progressive disclosure; hide advanced features sau "Xem thêm" |
| **Escrow cọc cần license** → không thể làm thật | Thấp (cho đồ án) | Prototype/animation flow; ghi chú "Trong sản phẩm thật: partner với MoMo/VNPay" |
| **PCCC card bị hiểu sai** → trách nhiệm pháp lý | Trung bình | ⚖️ Disclaimer rõ ràng; không dùng từ "chứng nhận" hoặc "đánh giá"; chỉ "thông tin tham khảo" |

### 16.2 Giả Định Cần Kiểm Chứng

| Giả định | Cách kiểm chứng |
|----------|-----------------|
| "Người thuê sẵn sàng trả 79k/tháng cho HAVEN Plus" | Khảo sát 50 người thuê về WTP (willingness to pay) |
| "Chủ nhà 3-5 căn sẵn sàng trả 399k/tháng cho Pro" | Interview 10 chủ nhà, demo prototype, hỏi WTP |
| "True Cost là tính năng quan trọng nhất với người thuê" | A/B test: trang có True Cost vs. không → so sánh engagement |
| "PCCC là yếu tố quyết định thứ 2 (sau giá)" | Khảo sát 100 người về 5 yếu tố quan trọng nhất khi chọn nhà |
| "Người thuê VN tin badge xác minh (như Shopee)" | User test: cho 20 người xem 2 version (có/không badge) → đo click-through |
| "Chủ nhà uy tín muốn được phân biệt với 'cò'" | Interview 5 chủ nhà uy tín, hỏi về pain point hiện tại |
| "Follow chủ nhà tạo giá trị (không chỉ spam)" | Track follow→conversion rate; survey người follow về lý do |

### 16.3 Câu Hỏi Mở

1. **Pháp lý escrow**: Giữ tiền cọc hộ có cần license gì tại VN? Partnership với fintech nào khả thi nhất?
2. **Dữ liệu ngập**: UDI Maps/HSDC Maps có API public không? Nếu không, crowd-sourcing là đủ tin cậy không?
3. **PCCC data**: Cục PCCC có open data về kết quả nghiệm thu chung cư không? Nếu không, self-report + community verification có giá trị không?
4. **Giá bậc thang điện**: Có thể tính ước tính dựa trên diện tích + số người không? Accuracy chấp nhận được ở mức nào?
5. **Thị trường mục tiêu**: Bắt đầu với TP.HCM hay Hà Nội? Hay cả hai?
6. **Ngôn ngữ**: Hỗ trợ tiếng Anh cho expat từ đầu hay phase sau?

---

## 17. Kết Luận

> **Đề xuất sản phẩm cô đọng trong một câu:**
>
> *HAVEN nên trở thành nền tảng cho thuê căn hộ đầu tiên tại Việt Nam đặt "biết rõ trước khi cọc" làm lời hứa cốt lõi — nơi Tổng Chi Phí Thật, Bản Đồ An Tâm, và Điểm Uy Tín Chủ Nhà biến hành trình thuê nhà từ canh bạc may rủi thành quyết định thông minh có dữ liệu.*

---

> [!IMPORTANT]
> **Bước tiếp theo**: Xin hãy review toàn bộ 3 phần nghiên cứu và xác nhận:
> 1. Top 10 tính năng ưu tiên — có muốn thay đổi/bổ sung không?
> 2. Lộ trình 3 phase — timeline có phù hợp không?
> 3. Mô hình monetization — gói nào cần điều chỉnh?
> 4. Signature features — feature wow nào cần thêm/bớt?
>
> **Tôi sẽ KHÔNG viết code hoặc thay đổi codebase cho đến khi bạn xác nhận danh sách tính năng.**
