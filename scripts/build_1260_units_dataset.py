import json
import random
import re
import os
import sys

# Ensure UTF-8 output on Windows terminal
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

print("--- KHOI DONG BO SINH DU LIEU BAT DONG SAN HAVEN V8 (1260 CAN HO) ---")

# 1. Tải và hợp nhất kho ảnh kiến trúc sạch
photo_pool = []
seen_photos = set()

# Nạp từ clean_working_master_pool.json
clean_pool_path = 'scripts/clean_working_master_pool.json'
if os.path.exists(clean_pool_path):
    with open(clean_pool_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for u in data:
            if u not in seen_photos:
                seen_photos.add(u)
                photo_pool.append(u)

# Nạp thêm từ all_verified_unique_pool.json
unique_pool_path = 'scripts/all_verified_unique_pool.json'
if os.path.exists(unique_pool_path):
    with open(unique_pool_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for u in data:
            if u not in seen_photos:
                seen_photos.add(u)
                photo_pool.append(u)

# Loại bỏ triệt để các ID ảnh chân dung hoặc hỏng
BAD_IDS = [
    '1507003211169-0a1dd7228f2d', # Avatar người có râu
    '1635107510862-53886e926b74', # Ảnh rạp phim
    '1489599849927-2ee91cede3ba'  # Ảnh hỏng
]

photo_pool = [u for u in photo_pool if not any(bad in u for bad in BAD_IDS)]
print(f"Tổng số ảnh kiến trúc sạch, chuẩn nén: {len(photo_pool)} ảnh.")

# Đảm bảo tính nhất quán qua seed
random.seed(20260929)

REGIONS = [
    # 1. THÁI NGUYÊN (150 units - Trọng điểm theo yêu cầu)
    {
        "city": "Thái Nguyên",
        "count": 150,
        "base_lat": 21.5942,
        "base_lng": 105.8482,
        "districts": [
            ("TP. Thái Nguyên", [
                ("Tecco Elite City Thịnh Đán", "Khu Đô Thị Tecco Elite City, Phường Thịnh Đán, TP. Thái Nguyên"),
                ("Danko City Thượng Lưu", "Khu Đô Thị Châu Âu Danko City, Xã Cao Ngạn, TP. Thái Nguyên"),
                ("TBCO Riverside Quang Vinh", "Khu Đô Thị Sinh Thái TBCO Riverside, Phường Quang Vinh, TP. Thái Nguyên"),
                ("Crown Villas Gia Sàng", "Khu Đô Thị Sinh Thái Crown Villas, Phường Gia Sàng, TP. Thái Nguyên"),
                ("Prime Thái Nguyên Tower", "Số 1 Đường Hoàng Văn Thụ, Phường Phan Đình Phùng, TP. Thái Nguyên"),
                ("Mỏ Bạch Central Park", "Đường Mỏ Bạch, Phường Quang Trung, TP. Thái Nguyên"),
                ("Khu Đô Thị Hồ Xương Rồng", "Đường Phan Đình Phùng, Phường Phan Đình Phùng, TP. Thái Nguyên"),
                ("TNG Village Minh Cầu", "Số 206 Đường Minh Cầu, Phường Phan Đình Phùng, TP. Thái Nguyên"),
                ("Thái Hưng Eco City", "Đường Cách Mạng Tháng 8, Phường Gia Sàng, TP. Thái Nguyên"),
                ("Sông Cầu Residence Bến Tượng", "Đường Bến Tượng, Phường Trưng Vương, TP. Thái Nguyên")
            ]),
            ("Sông Công", [
                ("Sông Công Central Park", "Đường Thắng Lợi, Phường Thắng Lợi, TP. Sông Công"),
                ("Khu Đô Thị Cải Đan", "Đường Cách Mạng Tháng 10, Phường Cải Đan, TP. Sông Công"),
                ("Vạn Phúc City Sông Công", "Phường Bách Quang, TP. Sông Công"),
                ("Khu Dân Cư Mỏ Chè", "Đường 3/2, Phường Mỏ Chè, TP. Sông Công")
            ]),
            ("Phổ Yên", [
                ("Samsung Residence Phổ Yên", "Khu Đô Thị Nam Thái, Gần Tổ Hợp Samsung Yên Bình, TP. Phổ Yên"),
                ("Yên Bình Smart Complex", "Đường Vành Đai 5, Phường Đồng Tiến, TP. Phổ Yên"),
                ("Phổ Yên Central City", "Đường Lý Nam Đế, Phường Ba Hàng, TP. Phổ Yên"),
                ("Việt Hàn Eco Urban Phổ Yên", "Xã Hồng Tiến, Nút Giao Yên Bình, TP. Phổ Yên")
            ]),
            ("Đại Từ", [
                ("La Bằng Eco Retreat", "Khu Du Lịch Đồi Chè La Bằng, Huyện Đại Từ"),
                ("Hồ Núi Cốc View Villa", "Khu Du Lịch Sinh Thái Hồ Núi Cốc, Xã Tân Thái, Huyện Đại Từ"),
                ("Hùng Sơn Green Valley", "Thị Trấn Hùng Sơn, Huyện Đại Từ, Thái Nguyên")
            ]),
            ("Phú Bình", [
                ("Điềm Thụy Industrial Complex", "Khu Đô Thị Dịch Vụ Công Nghiệp Điềm Thụy, Huyện Phú Bình"),
                ("Hương Sơn Central Town", "Thị Trấn Hương Sơn, Huyện Phú Bình, Thái Nguyên")
            ]),
            ("Đồng Hỷ", [
                ("Hóa Thượng Eco Park", "Trung Tâm Hành Chính Huyện Đồng Hỷ, Xã Hóa Thượng"),
                ("Trại Cau Green Residence", "Thị Trấn Trại Cau, Huyện Đồng Hỷ, Thái Nguyên")
            ]),
            ("Định Hóa", [
                ("Chợ Chu Cultural Suite", "Thị Trấn Chợ Chu, Huyện Định Hóa, Thái Nguyên"),
                ("ATK Định Hóa Eco Lodge", "Khu Sinh Thái ATK Định Hóa, Huyện Định Hóa")
            ]),
            ("Võ Nhai", [
                ("Hang Phượng Hoàng Scenic Suite", "Khu Thắng Cảnh Hang Phượng Hoàng, Xã Phú Thượng, Huyện Võ Nhai"),
                ("Đình Cả Central House", "Thị Trấn Đình Cả, Huyện Võ Nhai, Thái Nguyên")
            ])
        ]
    },

    # 2. HÀ NỘI (360 units)
    {
        "city": "Hà Nội",
        "count": 360,
        "base_lat": 21.0285,
        "base_lng": 105.8542,
        "districts": [
            ("Tây Hồ", [
                ("Sun Grand City Thụy Khuê", "Số 69B Đường Thụy Khuê, Phường Thụy Khuê, Tây Hồ"),
                ("D'. Le Roi Soleil Quảng An", "Số 59 Đường Xuân Diệu, Phường Quảng An, Tây Hồ"),
                ("Khu Đô Thị Ciputra Hà Nội", "Khu Đô Thị Nam Thăng Long Ciputra, Phường Phú Thượng, Tây Hồ"),
                ("Kosmo Tây Hồ Xuân La", "Số 101 Đường Xuân La, Phường Xuân Tảo, Tây Hồ"),
                ("Watermark Hồ Tây Lạc Long Quân", "Số 395 Đường Lạc Long Quân, Phường Nghĩa Đô, Tây Hồ"),
                ("Heritage West Lake Lạc Long Quân", "Số 677 Đường Lạc Long Quân, Phường Phú Thượng, Tây Hồ")
            ]),
            ("Cầu Giấy", [
                ("The Nine Tower Phạm Văn Đồng", "Số 9 Đường Phạm Văn Đồng, Phường Mai Dịch, Cầu Giấy"),
                ("Mipec Rubik 360 Xuân Thủy", "Số 122 Đường Xuân Thủy, Phường Dịch Vọng Hậu, Cầu Giấy"),
                ("Indochina Plaza Hà Nội (IPH)", "Số 241 Đường Xuân Thủy, Phường Dịch Vọng Hậu, Cầu Giấy"),
                ("D'.Capitale Trần Duy Hưng", "Số 119 Đường Trần Duy Hưng, Phường Trung Hòa, Cầu Giấy"),
                ("Discovery Complex Cầu Giấy", "Số 302 Đường Cầu Giấy, Phường Dịch Vọng, Cầu Giấy"),
                ("Golden Park Tower Dương Đình Nghệ", "Số 2 Đường Phạm Văn Bạch, Phường Yên Hòa, Cầu Giấy")
            ]),
            ("Nam Từ Liêm", [
                ("Vinhomes Smart City Tây Mỗ", "Đại Lộ Thăng Long, Phường Tây Mỗ, Nam Từ Liêm"),
                ("The Matrix One Mễ Trì", "Ngã tư Lê Quang Đạo & Mễ Trì, Phường Mễ Trì, Nam Từ Liêm"),
                ("Keangnam Hanoi Landmark Tower", "Đường Phạm Hùng, Phường Mễ Trì, Nam Từ Liêm"),
                ("Mỹ Đình Pearl Châu Văn Liêm", "Số 1 Đường Châu Văn Liêm, Phường Phú Đô, Nam Từ Liêm"),
                ("Vinhomes West Point Đỗ Đức Dục", "Đường Phạm Hùng, Phường Mễ Trì, Nam Từ Liêm")
            ]),
            ("Ba Đình", [
                ("Vinhomes Metropolis Liễu Giai", "Số 29 Đường Liễu Giai, Phường Ngọc Khánh, Ba Đình"),
                ("The Golden Lake Giảng Võ", "B7 Phố Giảng Võ, Phường Giảng Võ, Ba Đình"),
                ("Discovery Central 67 Trần Phú", "Số 67 Đường Trần Phú, Phường Điện Biên, Ba Đình"),
                ("Lancaster Hà Nội Núi Trúc", "Số 20 Phố Núi Trúc, Phường Giảng Võ, Ba Đình")
            ]),
            ("Hoàn Kiếm", [
                ("Pacific Place Lý Thường Kiệt", "Số 83B Đường Lý Thường Kiệt, Phường Trần Hưng Đạo, Hoàn Kiếm"),
                ("Tràng Tiền Heritage Suite", "Số 24 Phố Tràng Tiền, Phường Tràng Tiền, Hoàn Kiếm"),
                ("Hà Nội T&T Hàng Bông", "Số 120 Đường Hàng Bông, Phường Hàng Bông, Hoàn Kiếm")
            ]),
            ("Thanh Xuân", [
                ("Royal City Nguyễn Trãi", "Số 72A Đường Nguyễn Trãi, Phường Thượng Đình, Thanh Xuân"),
                ("Imperia Garden Nguyễn Huy Tưởng", "Số 203 Đường Nguyễn Huy Tưởng, Phường Thanh Xuân Trung, Thanh Xuân"),
                ("The Legend Ngụy Như Kon Tum", "Số 109 Đường Ngụy Như Kon Tum, Phường Nhân Chính, Thanh Xuân"),
                ("Stellar Garden Lê Văn Thiêm", "Số 35 Đường Lê Văn Thiêm, Phường Thanh Xuân Trung, Thanh Xuân")
            ]),
            ("Hai Bà Trưng", [
                ("Vinhomes Times City Minh Khai", "Số 458 Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng"),
                ("Hinode City Kim Ngưu", "Số 201 Đường Minh Khai, Phường Minh Khai, Hai Bà Trưng"),
                ("Imperia Sky Park Minh Khai", "Số 423 Đường Minh Khai, Phường Vĩnh Tuy, Hai Bà Trưng")
            ]),
            ("Đống Đa", [
                ("Vinhomes Nguyễn Chí Thanh", "Số 54A Đường Nguyễn Chí Thanh, Phường Láng Thượng, Đống Đa"),
                ("D'. Le Pont D'or Hoàng Cầu", "Số 36 Phố Hoàng Cầu, Phường Ô Chợ Dừa, Đống Đa"),
                ("Lancaster Luminaire Đường Láng", "Số 1152 Đường Láng, Phường Láng Thượng, Đống Đa")
            ]),
            ("Bắc Từ Liêm", [
                ("Ngoại Giao Đoàn Complex", "Khu Đô Thị Ngoại Giao Đoàn, Phường Xuân Đỉnh, Bắc Từ Liêm"),
                ("Starlake Tây Hồ Tây", "Khu Đô Thị Starlake, Phường Xuân Tảo, Bắc Từ Liêm"),
                ("Goldmark City Hồ Tùng Mậu", "Số 136 Đường Hồ Tùng Mậu, Phường Phú Diễn, Bắc Từ Liêm")
            ]),
            ("Hoàng Mai", [
                ("Haven Park Linh Đàm", "Bán Đảo Linh Đàm, Phường Hoàng Liệt, Hoàng Mai"),
                ("Rose Town Ngọc Hồi", "Số 79 Đường Ngọc Hồi, Phường Hoàng Liệt, Hoàng Mai"),
                ("Gelexia Riverside Tam Trinh", "Số 885 Đường Tam Trinh, Phường Yên Sở, Hoàng Mai")
            ]),
            ("Long Biên", [
                ("Vinhomes Riverside The Harmony", "Đường Chu Huy Mân, Phường Phúc Đồng, Long Biên"),
                ("Mipec Riverside Long Biên", "Số 2 Phố Long Biên 2, Phường Ngọc Lâm, Long Biên"),
                ("Le Grand Jardin Sài Đồng", "Đường Huỳnh Văn Nghệ, Phường Sài Đồng, Long Biên")
            ]),
            ("Hà Đông", [
                ("Seasons Avenue Mỗ Lao", "Khu Đô Thị Mỗ Lao, Phường Mộ Lao, Hà Đông"),
                ("Mulberry Lane Hà Đông", "Khu Đô Thị Mỗ Lao, Phường Mộ Lao, Hà Đông"),
                ("Roman Plaza Tố Hữu", "Đường Tố Hữu, Phường Đại Mỗ, Hà Đông")
            ])
        ]
    },

    # 3. TP. HỒ CHÍ MINH (340 units)
    {
        "city": "TP. Hồ Chí Minh",
        "count": 340,
        "base_lat": 10.7769,
        "base_lng": 106.7009,
        "districts": [
            ("Quận 1", [
                ("Vinhomes Golden River Ba Son", "Số 2 Đường Tôn Đức Thắng, Phường Bến Nghé, Quận 1"),
                ("Grand Marina Saigon", "Số 2 Đường Tôn Đức Thắng, Phường Bến Nghé, Quận 1"),
                ("The Marq Nguyễn Đình Chiểu", "Số 29B Đường Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1"),
                ("Lancaster Legacy Nguyễn Trãi", "Số 230 Đường Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1")
            ]),
            ("TP. Thủ Đức", [
                ("Empire City Thủ Thiêm", "Khu Đô Thị Mới Thủ Thiêm, Phường An Khánh, TP. Thủ Đức"),
                ("The Metropole Thủ Thiêm", "Khu Đô Thị Mới Thủ Thiêm, Phường An Khánh, TP. Thủ Đức"),
                ("Masteri Thảo Điền", "Số 159 Xa Lộ Hà Nội, Phường Thảo Điền, TP. Thủ Đức"),
                ("Gateway Thảo Điền", "Số 2 Đường Lê Thước, Phường Thảo Điền, TP. Thủ Đức"),
                ("The Vista An Phú", "Số 628C Xa Lộ Hà Nội, Phường An Phú, TP. Thủ Đức"),
                ("Vinhomes Grand Park", "Đường Nguyễn Xiển, Phường Long Thạnh Mỹ, TP. Thủ Đức")
            ]),
            ("Bình Thạnh", [
                ("Vinhomes Central Park Tân Cảng", "Số 208 Đường Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh"),
                ("Sunwah Pearl Nguyễn Hữu Cảnh", "Số 90 Đường Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh"),
                ("Saigon Pearl Nguyễn Hữu Cảnh", "Số 92 Đường Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh"),
                ("City Garden Ngô Tất Tố", "Số 59 Đường Ngô Tất Tố, Phường 21, Bình Thạnh")
            ]),
            ("Quận 7", [
                ("Midtown Phú Mỹ Hưng The Peak", "Đường Nguyễn Lương Bằng, Phường Tân Phú, Quận 7"),
                ("Scenic Valley Phú Mỹ Hưng", "Đường Tôn Dật Tiên, Phường Tân Phú, Quận 7"),
                ("Sunrise City Nguyễn Hữu Thọ", "Số 23-27 Đường Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7"),
                ("Eco Green Saigon Nguyễn Văn Linh", "Số 39/8B Đại Lộ Nguyễn Văn Linh, Phường Tân Thuận Tây, Quận 7")
            ]),
            ("Quận 4", [
                ("The Tresor Bến Vân Đồn", "Số 39 Đường Bến Vân Đồn, Phường 13, Quận 4"),
                ("Saigon Royal Residence", "Số 34-35 Đường Bến Vân Đồn, Phường 12, Quận 4"),
                ("Masteri Millennium Bến Vân Đồn", "Số 132 Đường Bến Vân Đồn, Phường 6, Quận 4")
            ]),
            ("Phú Nhuận", [
                ("Novotel Suites Phan Xích Long", "Khu Đô Thị Rạch Miễu, Phường 7, Phú Nhuận"),
                ("Golden Mansion Phổ Quang", "Số 119 Đường Phổ Quang, Phường 9, Phú Nhuận"),
                ("Kingston Residence Nguyễn Văn Trỗi", "Số 146 Đường Nguyễn Văn Trỗi, Phường 8, Phú Nhuận")
            ]),
            ("Tân Bình", [
                ("Sky Center Phổ Quang", "Số 5B Đường Phổ Quang, Phường 2, Tân Bình"),
                ("Botanica Premier Hồng Hà", "Số 108 Đường Hồng Hà, Phường 2, Tân Bình")
            ]),
            ("Quận 3", [
                ("Léman Luxury Apartments", "Số 117 Đường Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3"),
                ("Serenity Sky Villas", "Số 259 Đường Điện Biên Phủ, Phường Võ Thị Sáu, Quận 3")
            ])
        ]
    },

    # 4. ĐÀ NẴNG (110 units)
    {
        "city": "Đà Nẵng",
        "count": 110,
        "base_lat": 16.0544,
        "base_lng": 108.2022,
        "districts": [
            ("Hải Châu", [
                ("The Filmore Da Nang Bạch Đằng", "Đường Bạch Đằng, Phường Bình Thuận, Hải Châu"),
                ("Bach Dang Complex", "Số 50 Đường Bạch Đằng, Phường Hải Châu 1, Hải Châu"),
                ("F.Home Da Nang Lý Thường Kiệt", "Số 16 Đường Lý Thường Kiệt, Phường Thạch Thang, Hải Châu"),
                ("Shantira Beach & River", "Đường Như Nguyệt, Phường Thuận Phước, Hải Châu")
            ]),
            ("Sơn Trà", [
                ("Hiyori Garden Tower Võ Văn Kiệt", "Đường Võ Văn Kiệt, Phường An Hải Đông, Sơn Trà"),
                ("The Monarchy Trần Hưng Đạo", "Đường Trần Hưng Đạo, Phường An Hải Tây, Sơn Trà"),
                ("Wyndham Soleil Danang", "Giao lộ Phạm Văn Đồng & Võ Nguyên Giáp, Phường Phước Mỹ, Sơn Trà"),
                ("Azura Danang Luxury", "Số 339 Đường Trần Hưng Đạo, Phường An Hải Bắc, Sơn Trà")
            ]),
            ("Ngũ Hành Sơn", [
                ("Ocean Suites Danang Trường Sa", "Đường Trường Sa, Phường Hòa Hải, Ngũ Hành Sơn"),
                ("Hyatt Regency Residences", "Số 5 Đường Trường Sa, Phường Hòa Hải, Ngũ Hành Sơn"),
                ("The Point Danang Golf View", "Đường Trường Sa, Phường Hòa Hải, Ngũ Hành Sơn")
            ]),
            ("Thanh Khê", [
                ("Blooming Tower Danang", "Khu Đô Thị Đa Phước, Phường Thanh Bình, Thanh Khê")
            ])
        ]
    },

    # 5. HẢI PHÒNG (60 units)
    {
        "city": "Hải Phòng",
        "count": 60,
        "base_lat": 20.8449,
        "base_lng": 106.6881,
        "districts": [
            ("Lê Chân", [
                ("Vinhomes Marina Cầu Rào 2", "Đường Võ Nguyên Giáp, Phường Vĩnh Niệm, Lê Chân"),
                ("The Minato Residence Waterfront", "Khu Đô Thị Waterfront City, Phường Vĩnh Niệm, Lê Chân"),
                ("Hoàng Huy Commerce", "Đường Võ Nguyên Giáp, Phường Kênh Dương, Lê Chân")
            ]),
            ("Hồng Bàng", [
                ("Vinhomes Imperia Thượng Lý", "Số 1 Đường Bạch Đằng, Phường Thượng Lý, Hồng Bàng"),
                ("Grand Pacific Hải Phòng", "Đường Hùng Vương, Phường Sở Dầu, Hồng Bàng")
            ]),
            ("Ngô Quyền", [
                ("Diamond Crown Hai Phong", "Ngã tư Lê Hồng Phong & Nguyễn Bỉnh Khiêm, Ngô Quyền"),
                ("SHP Plaza Lạch Tray", "Số 12 Đường Lạch Tray, Phường Lạch Tray, Ngô Quyền")
            ])
        ]
    },

    # 6. BẮC NINH (50 units)
    {
        "city": "Bắc Ninh",
        "count": 50,
        "base_lat": 21.1861,
        "base_lng": 106.0763,
        "districts": [
            ("TP. Bắc Ninh", [
                ("Vinhomes Bắc Ninh Ngã 6", "Ngã 6 Trần Hưng Đạo, Phường Suối Hoa, TP. Bắc Ninh"),
                ("Royal Park Bắc Ninh Kinh Dương Vương", "Đường Kinh Dương Vương, Phường Vũ Ninh, TP. Bắc Ninh"),
                ("Phoenix Tower Lý Thái Tổ", "Đường Lý Thái Tổ, Phường Đại Phúc, TP. Bắc Ninh"),
                ("Green Pearl Võ Cường", "Đường Lê Thái Tổ, Phường Võ Cường, TP. Bắc Ninh")
            ]),
            ("Từ Sơn", [
                ("Centavillage Từ Sơn", "Đại Lộ Hữu Nghị, Phường Phù Chẩn, TP. Từ Sơn"),
                ("BelHomes VSIP Bắc Ninh", "Khu Công Nghiệp VSIP, Phường Phù Chẩn, TP. Từ Sơn")
            ])
        ]
    },

    # 7. BÌNH DƯƠNG (50 units)
    {
        "city": "Bình Dương",
        "count": 50,
        "base_lat": 10.9804,
        "base_lng": 106.6519,
        "districts": [
            ("TP. Thủ Dầu Một", [
                ("Sora Gardens II Tokyu", "Đại Lộ Hùng Vương, Phường Hòa Phú, TP. Thủ Dầu Một"),
                ("Midori Park The View Tokyu", "Đường Lý Thái Tổ, Phường Hòa Phú, TP. Thủ Dầu Một"),
                ("Bcons Plaza Thống Nhất", "Đường Thống Nhất, TP. Thủ Dầu Một")
            ]),
            ("Thuận An", [
                ("Habitat Bình Dương Phase 3", "Số 8 Đại Lộ Hữu Nghị, Phường Bình Hòa, TP. Thuận An"),
                ("Astral City Quốc Lộ 13", "Mặt tiền Quốc Lộ 13, Phường Bình Hòa, TP. Thuận An")
            ]),
            ("Dĩ An", [
                ("Opal Boulevard Đất Xanh", "Số 10 Đường Kha Vạn Cân, Phường An Bình, TP. Dĩ An"),
                ("Green Square Dĩ An", "Đường Quốc Lộ 1K, Phường Đông Hòa, TP. Dĩ An")
            ])
        ]
    },

    # 8. KHÁNH HÒA / NHA TRANG (50 units)
    {
        "city": "Khánh Hòa",
        "count": 50,
        "base_lat": 12.2388,
        "base_lng": 109.1967,
        "districts": [
            ("Nha Trang", [
                ("Panorama Nha Trang Luxury Suite", "Số 2 Đường Nguyễn Thị Minh Khai, Phường Lộc Thọ, Nha Trang"),
                ("Gold Coast Nha Trang", "Số 1 Đường Trần Hưng Đạo, Phường Lộc Thọ, Nha Trang"),
                ("Scenia Bay Nha Trang Phạm Văn Đồng", "Số 25-26 Đường Phạm Văn Đồng, Phường Vĩnh Hải, Nha Trang"),
                ("Mường Thanh Luxury Viễn Triều", "Đường Phạm Văn Đồng, Phường Vĩnh Phước, Nha Trang")
            ])
        ]
    },

    # 9. QUẢNG NINH / HẠ LONG (40 units)
    {
        "city": "Quảng Ninh",
        "count": 40,
        "base_lat": 20.9505,
        "base_lng": 107.0734,
        "districts": [
            ("Hạ Long", [
                ("The Sapphire Residence Bến Đoan", "Số 1 Đường Bến Đoan, Phường Hồng Gai, Hạ Long"),
                ("Green Bay Premium Bãi Cháy", "Đường Hoàng Quốc Việt, Phường Bãi Cháy, Hạ Long"),
                ("Á La Carte Halong Bay Marina", "Bán Đảo 2 Khu Đô Thị Marina Halong, Phường Hùng Thắng, Hạ Long")
            ])
        ]
    },

    # 10. LÂM ĐỒNG / ĐÀ LẠT (25 units)
    {
        "city": "Lâm Đồng",
        "count": 25,
        "base_lat": 11.9404,
        "base_lng": 108.4583,
        "districts": [
            ("Đà Lạt", [
                ("Dalat Panorama Heritage Trần Hưng Đạo", "Số 37 Đường Trần Hưng Đạo, Phường 10, TP. Đà Lạt"),
                ("Dalat Wonder Resort Hồ Tuyền Lâm", "Khu Du Lịch Hồ Tuyền Lâm, Phường 4, TP. Đà Lạt"),
                ("Boutique Pine Hill Residence", "Đường Khởi Nghĩa Bắc Sơn, Phường 10, TP. Đà Lạt")
            ])
        ]
    },

    # 11. CẦN THƠ (25 units)
    {
        "city": "Cần Thơ",
        "count": 25,
        "base_lat": 10.0452,
        "base_lng": 105.7469,
        "districts": [
            ("Ninh Kiều", [
                ("Vinpearl Cần Thơ Luxury Residence", "Số 209 Đường 30/4, Phường Xuân Khánh, Ninh Kiều"),
                ("Tây Đô Plaza Hưng Thạnh", "Đường Quốc Lộ 1A, Phường Hưng Thạnh, Cái Răng, Cần Thơ"),
                ("Cần Thơ River View Hai Bà Trưng", "Đường Hai Bà Trưng, Phường Tân An, Ninh Kiều")
            ])
        ]
    }
]

# Total units calculation:
total_target = sum(r["count"] for r in REGIONS)
print(f"Mục tiêu sinh: {total_target} căn hộ (> 1200 căn).")

all_units = []
photo_index = 0
photo_count = len(photo_pool)

UNIT_TYPES = ['Deluxe Apartment', 'Penthouse', 'Executive Suite', 'Studio', 'Duplex', 'Sky Villa']
VIEW_TYPES = ['City Skyline', 'Lake View', 'River View', 'Sea View', 'Pine Forest View', 'Mountain Panoramic View', 'Internal Garden']
ORIENTATIONS = ['Đông Nam (Mát mẻ quanh năm)', 'Nam (Đón gió sinh khí)', 'Đông (Đón bình minh)', 'Bắc (Yên tĩnh, mát)', 'Tây Nam']

LANDLORDS = [
    { "name": "Nguyễn Hoàng Minh", "phone": "0912 345 678", "trustScore": 4.9, "isSuperHost": True, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { "name": "Trần Thùy Linh", "phone": "0988 765 432", "trustScore": 4.8, "isSuperHost": True, "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" },
    { "name": "Lê Quang Đạt", "phone": "0903 112 233", "trustScore": 4.7, "isSuperHost": False, "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
    { "name": "Phạm Thị Hương", "phone": "0977 445 566", "trustScore": 4.9, "isSuperHost": True, "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
    { "name": "Đặng Quốc Cường", "phone": "0936 998 877", "trustScore": 4.6, "isSuperHost": False, "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" }
]

unit_counter = 1

for reg in REGIONS:
    city_name = reg["city"]
    target_count = reg["count"]
    districts = reg["districts"]
    base_lat = reg["base_lat"]
    base_lng = reg["base_lng"]

    created_in_region = 0
    while created_in_region < target_count:
        dist_idx = created_in_region % len(districts)
        dist_name, buildings = districts[dist_idx]
        bldg_name, bldg_addr = buildings[created_in_region % len(buildings)]

        floor_num = (unit_counter % 33) + 3
        room_idx = (unit_counter % 12) + 1
        block_letter = chr(65 + ((unit_counter // 8) % 6))
        unit_number = f"{block_letter}{floor_num:02d}-{room_idx:02d}-#{unit_counter:04d}"

        # Assign unique ID with clear city code
        city_code = "TN" if city_name == "Thái Nguyên" else "HN" if city_name == "Hà Nội" else "SG" if city_name == "TP. Hồ Chí Minh" else "DN" if city_name == "Đà Nẵng" else "HP" if city_name == "Hải Phòng" else "BN" if city_name == "Bắc Ninh" else "BD" if city_name == "Bình Dương" else "KH" if city_name == "Khánh Hòa" else "QN" if city_name == "Quảng Ninh" else "LD" if city_name == "Lâm Đồng" else "CT"
        unit_id = f"{city_code}-{unit_counter:04d}"

        # Unique name & typology
        type_choice = random.choice(UNIT_TYPES) if floor_num < 30 else random.choice(['Penthouse', 'Sky Villa', 'Duplex'])
        bedrooms = 1 if type_choice == 'Studio' else random.randint(2, 4) if 'Penthouse' in type_choice or 'Villa' in type_choice else random.randint(1, 3)
        bathrooms = max(1, bedrooms - (0 if bedrooms == 1 else 1 if random.random() > 0.5 else 0))
        sqm = 42 if type_choice == 'Studio' else random.randint(65, 95) if bedrooms == 2 else random.randint(105, 160) if bedrooms == 3 else random.randint(180, 320)

        name_modifiers = [
            "View Panorama Thoáng Đãng",
            "Ban Công Kính Đón Gió Tự Nhiên",
            "Nội Thất Gỗ Óc Chó Cao Cấp",
            "Trần Cao Hiện Đại & Tối Giản",
            "Smart Home Tự Động Hóa Toàn Diện",
            "Khuôn Viên Sinh Thái Yên Tĩnh",
            "Tầm Nhìn Trọn Vẹn Cảnh Quan",
            "Không Gian Mở Tràn Ngập Ánh Sáng",
            "Thiết Kế Tinh Tế Chuẩn Châu Âu",
            "Khu Vực Riêng Tư & An Ninh Đa Tầng",
            "Phòng Khách View Hồ Khoáng Đạt",
            "Ban Công Rộng Rào Lưới An Toàn Thú Cưng",
            "Gần Công Viên & Không Gian Chạy Bộ",
            "Hầm Đỗ Xe Ô Tô Thông Minh 2 Tầng",
            "Đón Nắng Ban Mai Hướng Đông Nam"
        ]
        modifier = name_modifiers[(unit_counter + created_in_region) % len(name_modifiers)]
        unit_name = f"Căn Hộ {bldg_name} #{unit_number} — {modifier}"

        # Pricing
        if city_name in ["Thái Nguyên", "Bắc Ninh", "Hải Phòng", "Bình Dương", "Cần Thơ"]:
            monthly_vnd = random.choice([6500000, 7500000, 8500000, 9500000, 11000000, 13500000, 16000000, 19000000, 24000000, 32000000])
        elif city_name in ["Đà Nẵng", "Khánh Hòa", "Quảng Ninh", "Lâm Đồng"]:
            monthly_vnd = random.choice([11000000, 14000000, 18000000, 22000000, 28000000, 35000000, 48000000, 65000000])
        else: # Hà Nội & TP.HCM
            monthly_vnd = random.choice([13000000, 17000000, 22000000, 28000000, 36000000, 50000000, 75000000, 105000000, 150000000])

        monthly_usd = round(monthly_vnd / 25400)

        # True cost components
        elec_est = round(sqm * 18000 + random.randint(150000, 400000))
        water_est = round(random.randint(90000, 220000))
        net_est = 250000
        mgmt_est = round(sqm * 14000)
        parking_est = 1200000 if random.random() > 0.3 else 150000
        true_cost_total = monthly_vnd + elec_est + water_est + net_est + mgmt_est + parking_est

        # Images (4 clean images per unit)
        primary_photo = photo_pool[photo_index % photo_count]
        sec_photo1 = photo_pool[(photo_index + 47) % photo_count]
        sec_photo2 = photo_pool[(photo_index + 113) % photo_count]
        sec_photo3 = photo_pool[(photo_index + 227) % photo_count]
        photo_index += 1

        # Real micro GPS coordinates with small jitter
        lat_offset = (random.random() - 0.5) * 0.05
        lng_offset = (random.random() - 0.5) * 0.05
        lat_coord = round(base_lat + lat_offset, 6)
        lng_coord = round(base_lng + lng_offset, 6)

        landlord_data = LANDLORDS[unit_counter % len(LANDLORDS)]

        unit_obj = {
            "id": unit_id,
            "name": unit_name,
            "floor": floor_num,
            "unitNumber": unit_number,
            "type": type_choice,
            "sqm": sqm,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "status": "vacant" if random.random() > 0.35 else random.choice(["occupied", "reserved"]),
            "monthlyRentUSD": monthly_usd,
            "monthlyRentVND": monthly_vnd,
            "city": city_name,
            "district": dist_name,
            "address": f"Căn {unit_number}, Tầng {floor_num}, {bldg_addr}",
            "coordinates": {
                "lat": lat_coord,
                "lng": lng_coord
            },
            "images": [
                primary_photo,
                sec_photo1,
                sec_photo2,
                sec_photo3
            ],
            "hasCarParking": random.random() > 0.25,
            "hasMotorbikeParking": True,
            "hasElevator": True,
            "hasBackupPower": random.random() > 0.15,
            "floodingRisk": "Low" if random.random() > 0.12 else "Moderate",
            "noiseLevel": random.choice(["Quiet", "Quiet", "Moderate"]),
            "trafficDensity": random.choice(["Low", "Moderate", "Moderate"]),
            "petFriendly": random.random() > 0.35,
            "furnished": True,
            "balcony": True,
            "airConditioning": True,
            "washingMachine": True,
            "kitchen": True,
            "wifi": True,
            "rating": round(4.5 + random.random() * 0.5, 1),
            "reviewCount": random.randint(15, 85),
            "aiInsights": {
                "whyFit": [
                    f"Khu vực {dist_name} thoáng đãng, kết nối nhanh các trục giao thông chính.",
                    "Hệ thống khóa thông minh IoT, camera an ninh 3 lớp 24/7.",
                    "Thẩm duyệt an toàn PCCC QCVN 06:2022/BXD với lối thoát hiểm chuẩn hóa."
                ],
                "worthConsidering": [
                    "Lượng phương tiện lưu thông đông đúc vào giờ cao điểm buổi sáng."
                ]
            },
            "environmentalData": {
                "weatherNotes": "Hướng gió đối lưu tự nhiên, đón sáng dịu mát, không bị hắt nắng gắt hướng Tây.",
                "floodNotes": "Cốt nền công trình cao ráo, hệ thống thoát nước ngầm đồng bộ, an toàn tuyệt đối mùa mưa.",
                "powerNotes": "Hòa lưới điện ưu tiên khu vực đô thị trọng điểm, có máy phát điện tự động 100% công suất.",
                "trafficNotes": "Đường nội bộ rộng rãi, ô tô 2 chiều di chuyển thuận tiện, có hầm để xe thông minh."
            },
            "sensors": {
                "smartLockBattery": random.randint(82, 99),
                "hvacStatus": "Optimal",
                "targetTempC": 24,
                "energyConsumptionKwh": round(14.0 + random.random() * 8.0, 1),
                "waterUsageLiters": random.randint(70, 130),
                "securityAlarmDisarmed": True
            },
            "viewType": random.choice(VIEW_TYPES),
            "orientation": random.choice(ORIENTATIONS),
            "isVerifiedPlus": random.random() > 0.3,
            "verificationLevel": "full_ownership_verified" if random.random() > 0.3 else "id_verified",
            "trueCost": {
                "baseRentVND": monthly_vnd,
                "estimatedElectricityVND": elec_est,
                "waterFeeVND": water_est,
                "internetFeeVND": net_est,
                "managementFeeVND": mgmt_est,
                "parkingFeeVND": parking_est,
                "totalMonthlyEstimatedVND": true_cost_total,
                "depositMonths": 1,
                "depositVND": monthly_vnd,
                "moveInTotalRequiredVND": true_cost_total + monthly_vnd
            },
            "pcccReport": {
                "hasFireEscapes": True,
                "fireEscapeCount": 2,
                "hasAutomaticSprinklers": True,
                "hasSmokeDetectors": True,
                "hasFireExtinguishers": True,
                "inspectionCertificateStatus": "certified",
                "lastInspectionDate": "2026-06-15",
                "disclaimer": "Đã được kiểm định thực địa theo Tiêu chuẩn PCCC QCVN 06:2022/BXD."
            },
            "landlord": {
                "id": f"LL-{unit_counter:04d}",
                "name": landlord_data["name"],
                "avatar": landlord_data["avatar"],
                "phone": landlord_data["phone"],
                "verificationLevel": "full_ownership_verified",
                "trustScore": landlord_data["trustScore"],
                "reviewCount": random.randint(24, 75),
                "responseRatePercent": 99,
                "averageResponseMinutes": 10,
                "activeListingsCount": random.randint(3, 9),
                "joinedDate": "2024-03-15",
                "isSuperHost": landlord_data["isSuperHost"],
                "badges": ["Chủ nhà uy tín", "Xác thực danh tính", "Bảo chứng HAVEN"]
            },
            "depositTerms": {
                "months": 1,
                "amountVND": monthly_vnd,
                "refundTimelineDays": 3,
                "deductionRules": [
                    "Hoàn trả 100% nếu căn hộ được bàn giao đúng hiện trạng cam kết.",
                    "Bảo chứng cọc qua tài khoản Escrow an toàn của HAVEN."
                ],
                "depositProtectionActive": True
            }
        }

        all_units.append(unit_obj)
        created_in_region += 1
        unit_counter += 1

print(f"\n[OK] SINH THÀNH CÔNG {len(all_units)} CĂN HỘ!")

# Kiểm tra tính duy nhất (Uniqueness verification)
ids = [u["id"] for u in all_units]
names = [u["name"] for u in all_units]
addresses = [u["address"] for u in all_units]

print("--- BÁO CÁO KIỂM ĐỊNH TÍNH DUY NHẤT ---")
print(f"Tổng số căn hộ: {len(all_units)}")
print(f"Mã định danh (ID) duy nhất: {len(set(ids))} / {len(all_units)}")
print(f"Tên căn hộ duy nhất: {len(set(names))} / {len(all_units)}")
print(f"Địa chỉ duy nhất: {len(set(addresses))} / {len(all_units)}")

assert len(set(ids)) == len(all_units), "Phát hiện ID trùng lặp!"
assert len(set(names)) == len(all_units), "Phát hiện Tên trùng lặp!"
assert len(set(addresses)) == len(all_units), "Phát hiện Địa chỉ trùng lặp!"

# Đọc mockData.ts gốc để bảo tồn MOCK_TICKETS và MOCK_AMENITIES
with open("src/data/mockData.ts", "r", encoding="utf-8") as f:
    orig = f.read()

m_tickets = re.search(r'export const MOCK_TICKETS: MaintenanceTicket\[\] = .*', orig, re.DOTALL)
if not m_tickets:
    print("Lỗi: Không tìm thấy MOCK_TICKETS trong mockData.ts")
    exit(1)

tickets_and_rest = m_tickets.group(0)

# Luu file JSON thuan de cac script AI doc truc tiep cuc nhanh
os.makedirs("data", exist_ok=True)
with open("data/mock_units_1260.json", "w", encoding="utf-8") as f:
    json.dump(all_units, f, indent=2, ensure_ascii=False)
print(f"[OK] Da luu data/mock_units_1260.json ({len(all_units)} can ho)!")

# Chia nho thanh cac chunk 250 can ho de TypeScript tranh loi TS2590: Expression produces a union type that is too complex to represent
chunk_size = 250
chunks = [all_units[i:i + chunk_size] for i in range(0, len(all_units), chunk_size)]

chunk_declarations = []
chunk_names = []
for idx, chunk in enumerate(chunks):
    c_name = f"_UNITS_PART_{idx + 1}"
    chunk_names.append(c_name)
    c_json = json.dumps(chunk, indent=2, ensure_ascii=False)
    chunk_declarations.append(f"const {c_name}: ApartmentUnit[] = {c_json};")

all_chunks_code = "\n\n".join(chunk_declarations)
concat_expression = f"export const MOCK_UNITS: ApartmentUnit[] = {chunk_names[0]}.concat({', '.join(chunk_names[1:])});"

new_mock_data_content = f"""import type {{ ApartmentUnit, MaintenanceTicket, Amenity }} from '../types/apartment';

{all_chunks_code}

{concat_expression}

{tickets_and_rest}"""

with open("src/data/mockData.ts", "w", encoding="utf-8") as f:
    f.write(new_mock_data_content)

print(f"\n[OK] ĐÃ LƯU {len(all_units)} CĂN HỘ (CHIA {len(chunks)} CHUNKS AN TOÀN CHO TS) VÀO src/data/mockData.ts THÀNH CÔNG!")
