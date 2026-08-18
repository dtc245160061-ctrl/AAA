# -*- coding: utf-8 -*-
import json
import random

# Seed for reproducible realistic data
random.seed(42)

CITIES_DATA = [
    {
        "city": "Hanoi",
        "cityVN": "Hà Nội",
        "count": 30,
        "prefix": "HN",
        "districts": [
            ("Tây Hồ", ["Quảng An", "Xuân La", "Nhật Tân", "Yên Phụ"], "Hồ Tây Panorama"),
            ("Hoàn Kiếm", ["Tràng Tiền", "Hàng Bài", "Lý Thái Tổ", "Phan Chu Trinh"], "Phố Cổ & Tràng Tiền"),
            ("Ba Đình", ["Kim Mã", "Giảng Võ", "Ngọc Khánh", "Liễu Giai"], "Lotte Center & Ngoại Giao Đoàn"),
            ("Cầu Giấy", ["Dịch Vọng Hậu", "Nghĩa Đô", "Trung Hòa", "Yên Hòa"], "Khu Công Nghệ Duy Tân & Keangnam"),
            ("Nam Từ Liêm", ["Mỹ Đình 1", "Mỹ Đình 2", "Mễ Trì"], "The Manor & Mỹ Đình Stadium"),
            ("Hai Bà Trưng", ["Minh Khai", "Bạch Đằng", "Lê Đại Hành"], "Times City & Vincom Bà Triệu"),
            ("Đống Đa", ["Ô Chợ Dừa", "Láng Hạ", "Cát Linh"], "Hoàng Cầu & Giảng Võ")
        ]
    },
    {
        "city": "Ho Chi Minh City",
        "cityVN": "TP. Hồ Chí Minh",
        "count": 40,
        "prefix": "SG",
        "districts": [
            ("Quận 1", ["Bến Nghé", "Bến Thành", "Đa Kao", "Nguyễn Thái Bình"], "Trung Tâm Landmark & Phố Đi Bộ"),
            ("Thủ Đức (Quận 2)", ["Thảo Điền", "An Phú", "Thủ Thiêm", "Bình An"], "Thảo Điền Expat Village & Empire City"),
            ("Quận 7", ["Tân Phong", "Tân Phú", "Phú Mỹ"], "Phú Mỹ Hưng & Crescent Mall"),
            ("Bình Thạnh", ["Phường 22", "Phường 19", "Phường 25"], "Vinhomes Central Park & Landmark 81"),
            ("Quận 3", ["Võ Thị Sáu", "Phường 6", "Phường 7"], "Biệt Thự Cổ & Hồ Con Rùa"),
            ("Quận 4", ["Phường 1", "Phường 12", "Phường 13"], "Bến Vân Đồn View Bitexco"),
            ("Phú Nhuận", ["Phường 2", "Phường 7", "Phường 9"], "Phan Xích Long Gourmet Street")
        ]
    },
    {
        "city": "Da Nang",
        "cityVN": "Đà Nẵng",
        "count": 15,
        "prefix": "DN",
        "districts": [
            ("Sơn Trà", ["An Hải Bắc", "Phước Mỹ", "Mân Thái"], "Biển Mỹ Khê & Bán Đảo Sơn Trà"),
            ("Hải Châu", ["Bình Hiên", "Hòa Cường Bắc", "Thạch Thang"], "Bạch Đằng Sông Hàn & Cầu Rồng"),
            ("Ngũ Hành Sơn", ["Khuê Mỹ", "Mỹ An", "Hòa Hải"], "An Thượng Foreign Quarter & Non Nước"),
            ("Thanh Khê", ["Vĩnh Trung", "Chính Gián"], "Vịnh Đà Nẵng & Nguyễn Tất Thành")
        ]
    },
    {
        "city": "Hai Phong",
        "cityVN": "Hải Phòng",
        "count": 10,
        "prefix": "HP",
        "districts": [
            ("Hồng Bàng", ["Hoàng Văn Thụ", "Minh Khai"], "Trung Tâm Nhà Hát Lớn & Dải Vườn Hoa"),
            ("Ngô Quyền", ["Lạc Viên", "Cầu Đất", "Lạch Tray"], "Lạch Tray & Vinhomes Marina"),
            ("Lê Chân", ["Vĩnh Niệm", "Kênh Dương"], "Aeon Mall Lê Chân & Hồ Sen"),
            ("Thủy Nguyên", ["Núi Đèo", "Hoa Động"], "Khu Đô Thị Bắc Sông Cấm")
        ]
    },
    {
        "city": "Binh Duong",
        "cityVN": "Bình Dương",
        "count": 10,
        "prefix": "BD",
        "districts": [
            ("Thủ Dầu Một", ["Chánh Nghĩa", "Phú Hòa", "Hiệp Thành"], "Becamex Tower & Phố Tây Chánh Nghĩa"),
            ("Thuận An", ["Lái Thiêu", "Bình Hòa", "An Phú"], "VSIP 1 & Sân Golf Sông Bé"),
            ("Dĩ An", ["Đông Hòa", "Tân Đông Hiệp"], "Làng Đại Học & Ga Sóng Thần")
        ]
    },
    {
        "city": "Nha Trang",
        "cityVN": "Nha Trang",
        "count": 8,
        "prefix": "NT",
        "districts": [
            ("Lộc Thọ", ["Trần Phú", "Hùng Vương"], "Mặt Biển Trần Phú"),
            ("Vĩnh Hòa", ["Phạm Văn Đồng", "Ba Làng"], "Bến Du Thuyền Ana Marina"),
            ("Phước Hải", ["Văn Tiến Dũng", "Lê Hồng Phong"], "Khu Đô Thị Mới Ven Sông Quán Trường")
        ]
    },
    {
        "city": "Can Tho",
        "cityVN": "Cần Thơ",
        "count": 6,
        "prefix": "CT",
        "districts": [
            ("Ninh Kiều", ["Tân An", "An Khánh", "Xuân Khánh"], "Bến Ninh Kiều & Cầu Đi Bộ Ánh Sao"),
            ("Cái Răng", ["Hưng Phú", "Lê Bình"], "Khu Nam Cần Thơ Ven Sông Hậu")
        ]
    },
    {
        "city": "Vung Tau",
        "cityVN": "Vũng Tàu",
        "count": 6,
        "prefix": "VT",
        "districts": [
            ("Thắng Tam", ["Thùy Vân", "Hoàng Hoa Thám"], "Bãi Sau Biển Đông"),
            ("Phường 1", ["Hạ Long", "Quang Trung"], "Bãi Trước & Mũi Nghinh Phong"),
            ("Phường 2", ["Phan Chu Trinh", "Võ Thị Sáu"], "Ngọn Hải Đăng Vũng Tàu")
        ]
    },
    {
        "city": "Ha Long",
        "cityVN": "Hạ Long",
        "count": 5,
        "prefix": "HL",
        "districts": [
            ("Bãi Cháy", ["Hạ Long", "Hoàng Quốc Việt"], "Sun World & View Vịnh Di Sản"),
            ("Hòn Gai", ["Bạch Đằng", "Hồng Gai"], "Đường Bao Biển Cột 5 - Cột 8")
        ]
    },
    {
        "city": "Da Lat",
        "cityVN": "Đà Lạt",
        "count": 4,
        "prefix": "DL",
        "districts": [
            ("Phường 1", ["Nguyễn Chí Thanh", "Khu Hòa Bình"], "Trung Tâm Hồ Xuân Hương & Chợ Đêm"),
            ("Phường 10", ["Trần Hưng Đạo", "Hùng Vương"], "Biệt Thự Rừng Thông & Cung Điện Cổ"),
            ("Phường 3", ["Đống Đa", "Đường 3 Tháng 4"], "Đèo Prenn & Cáp Treo Đồi Robin")
        ]
    },
    {
        "city": "Hue",
        "cityVN": "Huế",
        "count": 4,
        "prefix": "HUE",
        "districts": [
            ("Phú Hội", ["Lê Lợi", "Hùng Vương"], "Bờ Nam Sông Hương & Cầu Tràng Tiền"),
            ("Vĩnh Ninh", ["Nguyễn Huệ", "Hai Bà Trưng"], "Khu Ngoại Giao & Đại Học Y Dược"),
            ("Thuận Hòa", ["Lê Duẩn", "Đặng Thái Thân"], "Khu Vực Hoàng Thành Đại Nội")
        ]
    },
    {
        "city": "Quy Nhon",
        "cityVN": "Quy Nhơn",
        "count": 3,
        "prefix": "QN",
        "districts": [
            ("Ghềnh Ráng", ["An Dương Vương", "Hàn Mặc Tử"], "Khu Du Lịch Ghềnh Ráng & Bãi Trứng"),
            ("Nguyễn Văn Cừ", ["Tây Sơn", "Chương Dương"], "Biển Quy Nhơn & Quảng Trường Trung Tâm")
        ]
    },
    {
        "city": "Bien Hoa",
        "cityVN": "Biên Hòa",
        "count": 3,
        "prefix": "BH",
        "districts": [
            ("Quyết Thắng", ["Cách Mạng Tháng 8", "Hà Huy Giáp"], "Trung Tâm Hành Chính & Bờ Sông Đồng Nai"),
            ("Tân Phong", ["Nguyễn Ái Quốc", "Đồng Khởi"], "Quảng Trường Tỉnh & Pegasus Plaza")
        ]
    },
    {
        "city": "Vinh",
        "cityVN": "Vinh",
        "count": 2,
        "prefix": "VINH",
        "districts": [
            ("Quang Trung", ["Quang Trung", "Lê Lợi"], "Trung Tâm Thương Mại & Quảng Trường Hồ Chí Minh"),
            ("Hưng Bình", ["Lê Hồng Phong", "Nguyễn Thị Minh Khai"], "Khu Dân Cư Cao Cấp Hưng Bình")
        ]
    },
    {
        "city": "Thanh Hoa",
        "cityVN": "Thanh Hóa",
        "count": 2,
        "prefix": "TH",
        "districts": [
            ("Đông Hải", ["Đại Lộ Lê Lợi", "Nguyễn Hoàng"], "Vinhomes Star City"),
            ("Điện Biên", ["Phan Chu Trinh", "Trần Phú"], "Trung Tâm Thành Phố")
        ]
    },
    {
        "city": "Buon Ma Thuot",
        "cityVN": "Buôn Ma Thuột",
        "count": 2,
        "prefix": "BMT",
        "districts": [
            ("Tân Lợi", ["Ngô Quyền", "Hà Huy Tập"], "Làng Cà Phê Trung Nguyên & Eco City"),
            ("Thắng Lợi", ["Lê Duẩn", "Phan Bội Châu"], "Trung Tâm Ngã Sáu Ban Mê")
        ]
    }
]

IMAGE_POOL = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502005229762-ee1b2b93e08f?auto=format&fit=crop&q=80&w=1200"
]

VN_RESIDENTS = [
    ("Nguyễn Minh Hoàng", "0903124567", "hoang.nm@gmail.com", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"),
    ("Trần Thị Mai Anh", "0912456789", "maianh.tran@techcorp.vn", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"),
    ("Lê Quốc Bảo", "0987654321", "bao.le@fintech.io", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"),
    ("Phạm Thu Trang", "0938112233", "trang.pham@vng.com.vn", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"),
    ("Hoàng Đức Anh", "0944556677", "ducanh.hoang@shopee.vn", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"),
    ("Vũ Hải Đăng", "0968998877", "dang.vu@misa.vn", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"),
    ("Đỗ Phương Linh", "0977223344", "phuonglinh.do@vietcombank.com.vn", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"),
    ("Bùi Tiến Dũng", "0918776655", "tiendung.bui@vingroup.net", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"),
    ("Ngô Bảo Châu", "0908334455", "chau.ngo@fpt.com", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"),
    ("Đinh Trọng Hưng", "0982334455", "hung.dinh@crypto.global", "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200")
]

EXPAT_RESIDENTS = [
    ("David Miller", "+84 934 112 890", "david.miller@singtel.com", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"),
    ("Sarah Jenkins", "+84 909 234 567", "sarah.j@unicef.org", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"),
    ("Kenji Sato", "+84 918 345 678", "sato.kenji@mitsubishi.co.jp", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"),
    ("Emily Watson", "+84 976 456 789", "emily.watson@grab.com", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"),
    ("Michael Chang", "+84 902 567 890", "mchang@standardchartered.com", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"),
    ("Alex Dubois", "+84 933 678 901", "alex.dubois@totalenergies.fr", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"),
    ("Elena Rostova", "+84 988 789 012", "elena.rostova@kaspersky.com", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"),
    ("Oliver Hansen", "+84 917 890 123", "o.hansen@lego.com", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"),
    ("Chloe Martin", "+84 966 901 234", "chloe.m@loreal.com", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"),
    ("Liam Tanaka", "+84 905 012 345", "liam.tanaka@rakuten.com", "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200")
]

UNIT_TYPES = [
    ("Studio", 42, 1, 1, 15000000, 35000000),
    ("Deluxe Apartment", 75, 2, 2, 25000000, 55000000),
    ("Executive Suite", 110, 3, 2, 45000000, 95000000),
    ("Sky Villa", 180, 3, 3, 90000000, 180000000),
    ("Penthouse", 320, 4, 4, 160000000, 380000000),
    ("Duplex", 140, 3, 3, 60000000, 120000000)
]

STATUS_WEIGHTS = [
    ('occupied', 0.50),
    ('vacant', 0.30),
    ('reserved', 0.10),
    ('pending_handover', 0.06),
    ('maintenance', 0.04)
]

def choose_status():
    r = random.random()
    cumulative = 0.0
    for status, weight in STATUS_WEIGHTS:
        cumulative += weight
        if r <= cumulative:
            return status
    return 'vacant'

all_units = []
unit_global_idx = 1

for city_info in CITIES_DATA:
    city_key = city_info["city"]
    city_vn = city_info["cityVN"]
    prefix = city_info["prefix"]
    count = city_info["count"]
    districts = city_info["districts"]
    
    for i in range(count):
        dist_tuple = districts[i % len(districts)]
        district_name = dist_tuple[0]
        wards = dist_tuple[1]
        dist_theme = dist_tuple[2]
        ward_name = wards[i % len(wards)]
        
        # Pick type
        u_type, base_sqm, beds, baths, min_price, max_price = UNIT_TYPES[i % len(UNIT_TYPES)]
        sqm = base_sqm + random.randint(-5, 15)
        floor = random.randint(3, 38)
        unit_num = f"{floor:02d}{random.randint(1, 8):02d}"
        unit_id = f"{prefix}-{district_name[:2].upper()}-{unit_num}"
        
        # Price scaled by city tier
        tier_multiplier = 1.0
        if city_key in ["Hanoi", "Ho Chi Minh City"]:
            tier_multiplier = 1.25
        elif city_key in ["Da Nang", "Hai Phong", "Nha Trang", "Binh Duong"]:
            tier_multiplier = 0.9
        else:
            tier_multiplier = 0.7
            
        rent_vnd = int(random.randint(min_price, max_price) * tier_multiplier // 500000 * 500000)
        rent_usd = round(rent_vnd / 24500)
        
        status = choose_status()
        
        # Name
        unit_title = f"{u_type} {dist_theme} — {district_name}"
        address_str = f"Tầng {floor}, Tòa tháp Haven Luxury, Đường {ward_name}, Quận {district_name}, {city_vn}"
        
        # Resident
        resident_obj = None
        if status in ['occupied', 'pending_handover']:
            is_expat = random.random() < 0.38
            if is_expat:
                res_data = random.choice(EXPAT_RESIDENTS)
                nationality = 'Foreigner'
            else:
                res_data = random.choice(VN_RESIDENTS)
                nationality = 'Vietnamese'
                
            resident_obj = {
                "id": f"RES-{1000 + unit_global_idx}",
                "name": res_data[0],
                "avatar": res_data[3],
                "phone": res_data[1],
                "email": res_data[2],
                "nationality": nationality,
                "moveInDate": f"2025-{random.randint(1, 12):02d}-15",
                "leaseEnd": f"2026-{random.randint(6, 12):02d}-15",
                "monthlyRentUSD": rent_usd,
                "monthlyRentVND": rent_vnd,
                "autoPayActive": random.choice([True, True, False]),
                "occupantsCount": random.randint(1, beds + 1)
            }
            
        # PCCC & Flood
        flood_level = random.choice(["Low", "Low", "Low", "Moderate"])
        noise_level = random.choice(["Quiet", "Quiet", "Moderate"])
        pccc_score = random.randint(88, 99) if floor > 10 else random.randint(85, 96)
        
        # TrueCost
        mgmt_fee = int(sqm * 22000)
        parking_fee = 1800000 if u_type in ["Penthouse", "Sky Villa", "Executive Suite"] else 1200000
        internet_fee = 350000
        elec_est = int(sqm * 25000)
        water_est = 150000
        total_monthly = rent_vnd + mgmt_fee + parking_fee + internet_fee + elec_est + water_est
        deposit_months = 2 if rent_vnd > 50000000 else 1
        deposit_vnd = rent_vnd * deposit_months
        move_in_total = total_monthly + deposit_vnd
        
        true_cost = {
            "baseRentVND": rent_vnd,
            "estimatedElectricityVND": elec_est,
            "waterFeeVND": water_est,
            "internetFeeVND": internet_fee,
            "managementFeeVND": mgmt_fee,
            "parkingFeeVND": parking_fee,
            "totalMonthlyEstimatedVND": total_monthly,
            "depositMonths": deposit_months,
            "depositVND": deposit_vnd,
            "moveInTotalRequiredVND": move_in_total,
            "electricityRatePerKwh": 3500
        }
        
        # PCCC Report
        pccc_report = {
            "hasFireEscapes": True,
            "fireEscapeCount": 2 if sqm > 100 else 1,
            "hasAutomaticSprinklers": True,
            "hasSmokeDetectors": True,
            "hasFireExtinguishers": True,
            "inspectionCertificateStatus": "certified",
            "lastInspectionDate": "2026-03-01",
            "emergencyExitWidthMeters": 1.4,
            "disclaimer": "Hồ sơ nghiệm thu PCCC đạt chuẩn QCVN 06:2022/BXD bởi Cảnh sát PCCC & CNCH."
        }
        
        # Pick 3 images
        img_start = unit_global_idx % len(IMAGE_POOL)
        unit_images = [
            IMAGE_POOL[img_start],
            IMAGE_POOL[(img_start + 1) % len(IMAGE_POOL)],
            IMAGE_POOL[(img_start + 2) % len(IMAGE_POOL)]
        ]
        
        unit_item = {
            "id": unit_id,
            "name": unit_title,
            "floor": floor,
            "unitNumber": unit_num,
            "type": u_type,
            "sqm": sqm,
            "bedrooms": beds,
            "bathrooms": baths,
            "status": status,
            "monthlyRentUSD": rent_usd,
            "monthlyRentVND": rent_vnd,
            "city": city_key,
            "district": district_name,
            "address": address_str,
            "images": unit_images,
            "hasCarParking": True if u_type in ["Penthouse", "Sky Villa", "Executive Suite"] else random.choice([True, False]),
            "hasMotorbikeParking": True,
            "hasElevator": True,
            "hasBackupPower": True,
            "floodingRisk": flood_level,
            "noiseLevel": noise_level,
            "trafficDensity": "Moderate",
            "petFriendly": random.choice([True, False]),
            "furnished": True,
            "balcony": True,
            "airConditioning": True,
            "washingMachine": True,
            "kitchen": True,
            "wifi": True,
            "rating": round(random.uniform(4.65, 4.98), 2),
            "reviewCount": random.randint(12, 68),
            "viewType": f"View {dist_theme}",
            "isVerifiedPlus": random.random() < 0.45,
            "trueCost": true_cost,
            "pcccReport": pccc_report,
            "aiInsights": {
                "whyFit": [
                    f"Căn hộ thuộc phân khúc {u_type} tại vị trí đắc địa {district_name}, kết nối nhanh trung tâm",
                    "Hệ thống PCCC nghiệm thu chuẩn hóa, camera an ninh 2 lớp và kiểm soát cửa thông minh IoT",
                    "Tầm nhìn thoáng đãng, luồng gió tự nhiên đón trọn sinh khí đô thị"
                ],
                "worthConsidering": [
                    f"Phí dịch vụ quản lý tòa nhà tiêu chuẩn 5 sao ({mgmt_fee:,} đ/tháng)",
                    "Giờ cao điểm giao thông khu vực có thể đông đúc"
                ]
            },
            "environmentalData": {
                "weatherNotes": f"Đón gió hướng mát; điều hòa biến tần tiết kiệm điện năng.",
                "floodNotes": f"Cốt nền xây dựng cao ráo; không ghi nhận ngập úng trong mùa mưa bão lớn.",
                "powerNotes": "Hệ thống điện lưới kép và máy phát điện dự phòng 100% công suất.",
                "trafficNotes": f"Mặt tiền đường lớn, thuận tiện di chuyển trong bán kính 10 phút."
            },
            "sensors": {
                "smartLockBattery": random.randint(78, 98),
                "hvacStatus": "Optimal",
                "targetTempC": random.choice([22, 23, 24, 25]),
                "energyConsumptionKwh": round(random.uniform(22.0, 58.0), 1),
                "waterUsageLiters": random.randint(85, 160),
                "securityAlarmDisarmed": True
            }
        }
        
        if resident_obj:
            unit_item["resident"] = resident_obj
            
        all_units.append(unit_item)
        unit_global_idx += 1

print(f"Generated total {len(all_units)} units across {len(CITIES_DATA)} cities.")

# Write to mockData.ts
ts_content = f"""import type {{ ApartmentUnit, MaintenanceTicket, Amenity }} from '../types/apartment';

export const MOCK_UNITS: ApartmentUnit[] = {json.dumps(all_units, indent=2, ensure_ascii=False)};

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {{
    id: 'TKT-8092',
    unitId: 'HN-TA-2401',
    residentName: 'Alexander Vance',
    category: 'Smart Lock',
    title: 'Kiểm tra pin khóa thông minh & hiệu chuẩn cảm biến thẻ từ',
    priority: 'Urgent',
    status: 'In Progress',
    reportedAt: '10 phút trước',
    assignedTechnician: 'Nguyễn Văn Minh (Chuyên viên IoT)'
  }},
  {{
    id: 'TKT-8088',
    unitId: 'SG-QU-1601',
    residentName: 'Elena Rostova',
    category: 'HVAC',
    title: 'Bảo dưỡng định kỳ màng lọc khí tươi điều hòa trung tâm VRV',
    priority: 'Medium',
    status: 'Open',
    reportedAt: '2 giờ trước'
  }},
  {{
    id: 'TKT-8075',
    unitId: 'DN-SO-1202',
    residentName: 'Kenji Sato',
    category: 'Plumbing',
    title: 'Hiệu chuẩn cảm biến lưu lượng nước thông minh',
    priority: 'Low',
    status: 'Resolved',
    reportedAt: '1 ngày trước'
  }}
];

export const MOCK_AMENITIES: Amenity[] = [
  {{
    id: 'am-01',
    name: 'Hồ Bơi Vô Cực Chân Mây & Lounge',
    location: 'Tầng Thượng — Tầng 25',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    capacity: 20,
    openingHours: '06:00 - 23:00',
    pricePerHourUSD: 0,
    availableSlotsToday: ['09:00 - 11:00', '14:00 - 16:00', '18:30 - 20:30', '21:00 - 23:00']
  }},
  {{
    id: 'am-02',
    name: 'Hầm Rượu Vang & Phòng Tiếp Khách VIP',
    location: 'Khu Điều Hành — Tầng 18',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    capacity: 12,
    openingHours: '16:00 - 02:00',
    pricePerHourUSD: 150,
    availableSlotsToday: ['17:00 - 19:00', '20:00 - 22:00', '22:30 - 00:30']
  }},
  {{
    id: 'am-03',
    name: 'Rạp Chiếu Phim Riêng Tư Dolby Atmos',
    location: 'Tầng Giải Trí — Tầng 2',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600',
    capacity: 16,
    openingHours: '10:00 - 00:00',
    pricePerHourUSD: 80,
    availableSlotsToday: ['13:00 - 15:30', '16:00 - 18:30', '19:00 - 21:30', '22:00 - 00:30']
  }}
];
"""

with open("src/data/mockData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Saved 150 units successfully to src/data/mockData.ts!")
