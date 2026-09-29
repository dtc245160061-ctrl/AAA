import json
import re
import os
import sys
import zipfile
import shutil

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

MOCK_DATA_PATH = r"d:\HAVEN\src\data\mockData.ts"
OUTPUT_DIR = r"d:\HAVEN\data"
UNITS_JSON_PATH = os.path.join(OUTPUT_DIR, "mock_units_1260.json")
OUTPUT_JSONL = os.path.join(OUTPUT_DIR, "01_haven_qa_dataset.jsonl")
OUTPUT_ZIP = os.path.join(OUTPUT_DIR, "01_haven_qa_dataset.zip")
GDRIVE_COLAB_DIR = r"G:\My Drive\COLAB"

os.makedirs(OUTPUT_DIR, exist_ok=True)

if os.path.exists(UNITS_JSON_PATH):
    print(f"Dang doc truc tiep tu {UNITS_JSON_PATH}...")
    with open(UNITS_JSON_PATH, "r", encoding="utf-8") as f:
        units = json.load(f)
    print(f"Doc thanh cong {len(units)} can ho tu mock_units_1260.json!")
else:
    print("Dang doc mockData.ts de trich xuat can ho...")
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    all_chunks = re.findall(r'const\s+_UNITS_PART_\d+:\s*ApartmentUnit\[\]\s*=\s*(\[.*?\]);', content, re.DOTALL)
    if all_chunks:
        units = []
        for c in all_chunks:
            c_clean = re.sub(r',\s*([\]}])', r'\1', c)
            units.extend(json.loads(c_clean))
        print(f"Doc thanh cong {len(units)} can ho tu cac chunks cua mockData.ts!")
    else:
        print("Khong tim thay chunk hoac JSON dataset")
        exit(1)

SYSTEM_PROMPT = "Bạn là HAVEN AI - Trợ lý Trí tuệ Nhân tạo Độc quyền của Nền tảng PropTech HAVEN (Sanctuary Living), chuyên tư vấn không gian sống, căn hộ cho thuê cao cấp, pháp lý và lối sống tại Việt Nam."

dataset = []

for i, u in enumerate(units):
    unit_id = u.get("id", f"HN-{i:04d}")
    name = u.get("name", unit_id)
    sqm = u.get("sqm", 60)
    beds = u.get("bedrooms", 1)
    baths = u.get("bathrooms", 1)
    rent_vnd = u.get("monthlyRentVND", 10000000)
    rent_m = rent_vnd / 1_000_000
    city = u.get("city", "Hà Nội")
    district = u.get("district", "Cầu Giấy")
    address = u.get("address", "")
    pet = "Có cho phép nuôi thú cưng" if u.get("petFriendly") else "Không cho phép nuôi thú cưng"
    car = "Có hầm đỗ xe ô tô" if u.get("hasCarParking") else "Chỉ có chỗ đỗ xe máy"
    noise = u.get("noiseLevel", "Moderate")
    floor = u.get("floor", 5)
    orientation = u.get("orientation", "Đông Nam")
    why_fit = u.get("aiInsights", {}).get("whyFit", [])
    fit_desc = " ".join(why_fit[:2]) if why_fit else "Không gian sống thoáng đãng, an ninh thẻ từ 3 lớp."

    # Mau 1: Hoi thong tin chi tiet can ho
    q1 = f"Cho tôi biết thông tin chi tiết về căn hộ {name} ({unit_id})?"
    a1 = (
        f"Căn hộ {name} (Mã căn: {unit_id}) nằm tại tầng {floor}, {address or f'{district}, {city}'}. "
        f"Căn hộ có diện tích {sqm}m² với kết cấu {beds} phòng ngủ, {baths} vệ sinh, hướng {orientation}. "
        f"Giá thuê hiện tại là {rent_m:.1f} triệu VNĐ/tháng. "
        f"Về tiện ích: {car}, {pet.lower()}. "
        f"Đánh giá AI: {fit_desc}"
    )
    dataset.append({
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": q1},
            {"role": "assistant", "content": a1}
        ]
    })

    # Mau 2: Tu van tim kiem theo quan & gia
    if i % 2 == 0:
        q2 = f"Tôi đang tìm căn hộ {beds} phòng ngủ tại {district} với ngân sách khoảng {int(rent_m + 3)} triệu, bạn có căn nào phù hợp?"
        a2 = (
            f"HAVEN xin đề xuất căn hộ {name} ({unit_id}) tại khu vực {district}, {city}. "
            f"Thông số căn: diện tích {sqm}m², {beds} phòng ngủ, giá thuê {rent_m:.1f} triệu VNĐ/tháng. "
            f"Căn hộ này sở hữu ưu điểm: {car} và {pet.lower()}. Rất thích hợp với ngân sách và nhu cầu sống của bạn."
        )
        dataset.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": q2},
                {"role": "assistant", "content": a2}
            ]
        })

    # Mau 3: Tu van theo loi song (chay bo, nuoi thu cung, o to)
    if u.get("petFriendly") and u.get("hasCarParking"):
        q3 = f"Tôi nuôi chó và có xe ô tô, muốn tìm căn hộ tại {district}, {city}, HAVEN gợi ý căn nào?"
        a3 = (
            f"Căn hộ lý tưởng cho bạn là {name} ({unit_id}) tại {district}, {city}. "
            f"Căn hộ vừa có hầm đỗ xe ô tô thông minh, vừa thuộc tòa nhà thân thiện cho phép nuôi thú cưng, "
            f"diện tích {sqm}m² rộng rãi, giá thuê {rent_m:.1f} triệu VNĐ/tháng. "
            f"Ban công thoáng đãng đảm bảo không gian thoải mái cho thú cưng của bạn."
        )
        dataset.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": q3},
                {"role": "assistant", "content": a3}
            ]
        })

# Them bo tri thuc tong quan ve he thong HAVEN
knowledge_samples = [
    (
        "Hệ thống HAVEN Lifestyle Matchmaker hoạt động như thế nào?",
        "HAVEN Lifestyle Matchmaker là thuật toán khảo sát đa chiều độc quyền phân tích 5 trục phong cách sống: Thân thiện thú cưng, Nhu cầu đỗ xe ô tô/xe điện, Thói quen thể thao chạy bộ/công viên, Mức độ nhạy cảm tiếng ồn (tầng cao, kính cách âm) và Vi khí hậu đón nắng ban mai. AI sẽ tổng hợp và vẽ biểu đồ Radar tương thích, chỉ định chính xác các căn hộ đạt điểm số Match Index cao nhất."
    ),
    (
        "Lợi ích của việc tính toán True Cost trên HAVEN là gì?",
        "True Cost giúp người thuê nhà nhìn thấy toàn bộ chi phí thực tế phát sinh hàng tháng (giá thuê, phí dịch vụ quản lý, phí gửi xe, điện nước dự toán, internet) trước khi ký hợp đồng. Điều này xóa bỏ hoàn toàn bẫy chi phí ẩn thường gặp trên các nền tảng bất động sản truyền thống."
    ),
    (
        "Mô hình AI Local của HAVEN có ưu điểm gì so với Cloud API thông thường?",
        "Mô hình AI Local của HAVEN (dựa trên kiến trúc SLM Qwen2.5 lượng tử hóa 4-bit) được huấn luyện riêng biệt trên dữ liệu căn hộ và luật nhà ở thực tế. Mô hình chạy trực tiếp trên máy chủ cục bộ hoặc thiết bị người dùng, đảm bảo tốc độ phản hồi cực nhanh, bảo mật dữ liệu tuyệt đối và hoạt động ổn định 100% kể cả khi mất kết nối Internet."
    )
]

for q, a in knowledge_samples:
    for _ in range(5):
        dataset.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": q},
                {"role": "assistant", "content": a}
            ]
        })

print(f"Tong so luong mau huan luyen tao thanh: {len(dataset)}")

# Ghi ra file JSONL
with open(OUTPUT_JSONL, "w", encoding="utf-8") as f:
    for item in dataset:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"Da xuat dataset JSONL tai: {OUTPUT_JSONL}")

# Nen thanh file zip
with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write(OUTPUT_JSONL, arcname="01_haven_qa_dataset.jsonl")

print(f"Da nen dataset thanh file zip tai: {OUTPUT_ZIP}")

# Sao chep sang G:\My Drive\COLAB neu co
if os.path.exists(GDRIVE_COLAB_DIR):
    dst = os.path.join(GDRIVE_COLAB_DIR, "01_haven_qa_dataset.zip")
    shutil.copy2(OUTPUT_ZIP, dst)
    print(f"Da sao chep thanh cong sang Google Drive tai: {dst}")
else:
    print(f"Khong tim thay thu muc: {GDRIVE_COLAB_DIR}")
