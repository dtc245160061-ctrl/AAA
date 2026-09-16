# -*- coding: utf-8 -*-
"""
Generate apartment units for all 63 provinces of Vietnam.
Appends to MOCK_UNITS in src/data/mockData.ts if not already present.
"""
import re
import json

PROVINCES_63 = [
    ("An Giang", "Long Xuyên", "Khu đô thị Golden City Long Xuyên, Đường Nguyễn Hoàng, TP. Long Xuyên"),
    ("Bà Rịa - Vũng Tàu", "Vũng Tàu", "Chung cư Gateway Vũng Tàu, Đường 3 Tháng 2, Phường Nguyễn An Ninh, TP. Vũng Tàu"),
    ("Bắc Giang", "Bắc Giang", "Tòa nhà Saigontel Central Park, Phường Ngô Quyền, TP. Bắc Giang"),
    ("Bắc Kạn", "Bắc Kạn", "Khu phức hợp Bắc Kạn Riverview, Phường Sông Cầu, TP. Bắc Kạn"),
    ("Bạc Liêu", "Bạc Liêu", "Khu dân cư Tràng An, Phường 7, TP. Bạc Liêu"),
    ("Bắc Ninh", "Bắc Ninh", "Chung cư Vinhomes Bắc Ninh, Ngã 6 Đường Trần Hưng Đạo, Phường Suối Hoa, TP. Bắc Ninh"),
    ("Bến Tre", "Bến Tre", "Khu đô thị Việt Sinh An Bình, Phường Bến Tre, TP. Bến Tre"),
    ("Bình Định", "Quy Nhơn", "Tổ hợp FLC SeaTower Quy Nhơn, Đường An Dương Vương, TP. Quy Nhơn"),
    ("Bình Dương", "Thủ Dầu Một", "Căn hộ Sora Gardens II, Khu đô thị Tokyu Bình Dương, Phường Hòa Phú, TP. Thủ Dầu Một"),
    ("Bình Phước", "Đồng Xoài", "Khu đô thị Cát Tường Phú Hưng, Tiến Hưng, TP. Đồng Xoài"),
    ("Bình Thuận", "Phan Thiết", "Căn hộ Ocean Dunes Resort, Đường Tôn Đức Thắng, TP. Phan Thiết"),
    ("Cà Mau", "Cà Mau", "Khu đô thị Hoàng Tâm, Xã Lý Văn Lâm, TP. Cà Mau"),
    ("Cần Thơ", "Ninh Kiều", "Tổ hợp Vincom Shophouse & Căn hộ Cao cấp Xuân Khánh, Đường 30 Tháng 4, Q. Ninh Kiều"),
    ("Cao Bằng", "Cao Bằng", "Khu dân cư Sông Hiến Park, Phường Sông Hiến, TP. Cao Bằng"),
    ("Đà Nẵng", "Hải Châu", "Haven Horizon Bay, Đường Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng"),
    ("Đắk Lắk", "Buôn Ma Thuột", "Khu đô thị EcoCity Premia, Đường Nguyễn Chí Thanh, TP. Buôn Ma Thuột"),
    ("Đắk Nông", "Gia Nghĩa", "Khu phức hợp Green Valley Đắk Nông, Phường Nghĩa Đức, TP. Gia Nghĩa"),
    ("Điện Biên", "Điện Biên Phủ", "Chung cư Mường Thanh Luxury Điện Biên, Phường Him Lam, TP. Điện Biên Phủ"),
    ("Đồng Nai", "Biên Hòa", "Topaz Twins Biên Hòa, Đường Võ Thị Sáu, Phường Thống Nhất, TP. Biên Hòa"),
    ("Đồng Tháp", "Cao Lãnh", "Khu dân cư Vincom Plaza Cao Lãnh, Phường 1, TP. Cao Lãnh"),
    ("Gia Lai", "Pleiku", "Khu phức hợp FLC Pleiku Tower, Phường Hội Thương, TP. Pleiku"),
    ("Hà Giang", "Hà Giang", "Khu căn hộ sinh thái Lô Gô Riverside, Phường Trần Phú, TP. Hà Giang"),
    ("Hà Nam", "Phủ Lý", "Chung cư Mường Thanh Grand Hà Nam, Đường Lê Hoàn, Phường Hai Bà Trưng, TP. Phủ Lý"),
    ("Hà Nội", "Ba Đình", "Tòa tháp Haven Ba Đình Skyview, Liễu Giai, Quận Ba Đình, Hà Nội"),
    ("Hà Tĩnh", "Hà Tĩnh", "Tổ hợp Vinhomes New Center Hà Tĩnh, Đường Hàm Nghi, TP. Hà Tĩnh"),
    ("Hải Dương", "Hải Dương", "Tổ hợp Căn hộ Ecorivers Hải Dương, Phường Hải Tân, TP. Hải Dương"),
    ("Hải Phòng", "Hồng Bàng", "Vinhomes Imperia Sky Residence, Phường Thượng Lý, Quận Hồng Bàng, Hải Phòng"),
    ("Hậu Giang", "Vị Thanh", "Khu đô thị Cát Tường Western Pearl, Đường Trần Hưng Đạo, TP. Vị Thanh"),
    ("Hòa Bình", "Hòa Bình", "Khu đô thị Dạ Hợp Riverside, Phường Tân Thịnh, TP. Hòa Bình"),
    ("Hưng Yên", "Hưng Yên", "Khu đô thị Ecopark Grand The Island, Văn Giang / TP. Hưng Yên"),
    ("Khánh Hòa", "Nha Trang", "Tòa tháp The Aston Luxury Residence, Đường Xóm Cồn, TP. Nha Trang"),
    ("Kiên Giang", "Rạch Giá", "Khu đô thị Phú Cường Kiên Giang, Đường Tôn Đức Thắng, TP. Rạch Giá"),
    ("Kon Tum", "Kon Tum", "Khu dân cư Mega City Kon Tum, Phường Quyết Thắng, TP. Kon Tum"),
    ("Lai Châu", "Lai Châu", "Khu tổ hợp Green Park Lai Châu, Phường Tân Phong, TP. Lai Châu"),
    ("Lâm Đồng", "Đà Lạt", "Dalat Panorama Residence, Đường Trần Hưng Đạo, Phường 10, TP. Đà Lạt"),
    ("Lạng Sơn", "Lạng Sơn", "Tổ hợp Apec Diamond Park Lạng Sơn, Đường Hùng Vương, TP. Lạng Sơn"),
    ("Lào Cai", "Lào Cai", "Chung cư The Manor Tower Lào Cai, Đại lộ Trần Hưng Đạo, TP. Lào Cai"),
    ("Long An", "Tân An", "Khu căn hộ Waterpoint Nam Long, Huyện Bến Lức / TP. Tân An"),
    ("Nam Định", "Nam Định", "Tổ hợp Nam Định Tower, Đường Điện Biên, Phường Cửa Bắc, TP. Nam Định"),
    ("Nghệ An", "Vinh", "Căn hộ Cao cấp T&T Victoria, Số 1 Đường Quang Trung, TP. Vinh"),
    ("Ninh Bình", "Ninh Bình", "Khu phức hợp Xuân Thành Heritage, Phường Ninh Khánh, TP. Ninh Bình"),
    ("Ninh Thuận", "Phan Rang - Tháp Chàm", "Tổ hợp SunBay Park Hotel & Resort, Đường Yên Ninh, TP. Phan Rang"),
    ("Phú Thọ", "Việt Trì", "Chung cư Vicentra Việt Trì, Đường Hùng Vương, Phường Tiên Cát, TP. Việt Trì"),
    ("Phú Yên", "Tuy Hòa", "Khu căn hộ Apec Mandala Wyndham Phú Yên, Đại lộ Hùng Vương, TP. Tuy Hòa"),
    ("Quảng Bình", "Đồng Hới", "Tổ hợp Regal Legend Quảng Bình, Đường Võ Nguyên Giáp, TP. Đồng Hới"),
    ("Quảng Nam", "Tam Kỳ", "Khu đô thị Vịnh An Hòa City, Tam Kỳ / Núi Thành"),
    ("Quảng Ngãi", "Quảng Ngãi", "Tòa nhà Phú Mỹ Center Point, Đường Hùng Vương, TP. Quảng Ngãi"),
    ("Quảng Ninh", "Hạ Long", "The Sapphire Residence Hạ Long, Bến Đoan, Phường Hồng Gai, TP. Hạ Long"),
    ("Quảng Trị", "Đông Hà", "Khu phức hợp Vincom Shophouse Đông Hà, Đường Hùng Vương, TP. Đông Hà"),
    ("Sóc Trăng", "Sóc Trăng", "Khu đô thị Mekong Smart City, Phường 2, TP. Sóc Trăng"),
    ("Sơn La", "Sơn La", "Khu căn hộ cao cấp Vincom Plaza Sơn La, Đường Giảng Lắc, TP. Sơn La"),
    ("Tây Ninh", "Tây Ninh", "Chung cư Golden City Tây Ninh, Đường Yết Kiêu, Phường 2, TP. Tây Ninh"),
    ("Thái Bình", "Thái Bình", "Chung cư Eden Garden Thái Bình, Phường Lê Hồng Phong, TP. Thái Bình"),
    ("Thái Nguyên", "Thành phố Thái Nguyên", "Tổ hợp Tháp Đôi Tecco Elite City, Đường Quang Trung, Phường Thịnh Đán, TP. Thái Nguyên"),
    ("Thanh Hóa", "Thanh Hóa", "Tòa tháp Vinhomes Star City, Đại lộ Lê Lợi, Phường Đông Hải, TP. Thanh Hóa"),
    ("Thừa Thiên Huế", "Huế", "The Manor Crown Huế, Đại lộ Tố Hữu, Phường Xuân Phú, TP. Huế"),
    ("Tiền Giang", "Mỹ Tho", "Khu căn hộ Green Pearl Mỹ Tho, Đường Hùng Vương, Phường 1, TP. Mỹ Tho"),
    ("TP. Hồ Chí Minh", "Quận 1", "Haven The Marq Residence, Đường Nguyễn Đình Chiểu, Quận 1, TP. Hồ Chí Minh"),
    ("Trà Vinh", "Trà Vinh", "Khu đô thị Hoàng Quân Trà Vinh, Đường Chu Văn An, Phường 4, TP. Trà Vinh"),
    ("Tuyên Quang", "Tuyên Quang", "Khu dân cư Vincom Plaza Tuyên Quang, Đường Quang Trung, TP. Tuyên Quang"),
    ("Vĩnh Long", "Vĩnh Long", "Tổ hợp Căn hộ Vĩnh Long Riverside, Phường 1, TP. Vĩnh Long"),
    ("Vĩnh Phúc", "Vĩnh Yên", "Chung cư The City Light Vĩnh Yên, Ngã 4 Nguyễn Tất Thành, TP. Vĩnh Yên"),
    ("Yên Bái", "Yên Bái", "Khu đô thị Melinh Plaza Yên Bái, Đường Điện Biên, Phường Minh Tân, TP. Yên Bái")
]

CURATED_IMAGES = [
    [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    ],
    [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200"
    ],
    [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200"
    ]
]

# Read mockData.ts
with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Check existing cities
existing_cities = set(re.findall(r'"city":\s*"([^"]+)"', content))
print(f"Existing cities in mockData: {len(existing_cities)}")

# We will generate units for any province not yet represented, OR ensure every province in PROVINCES_63 is present with canonical Vietnamese name!
new_units = []
idx = 9001

for prov_name, district_name, address in PROVINCES_63:
    # Check if prov_name is already a city or represented
    # If not present or only present in English, let's create a verified standard unit with the exact Vietnamese province name
    if prov_name in existing_cities:
        print(f"Skipping already existing province: {prov_name}")
        continue
    
    unit_id = f"VN-{idx}"
    idx += 1
    
    # Custom realistic details for this province
    rent_vnd = 7500000 if "Thái Nguyên" in prov_name or "Bắc Ninh" in prov_name or "Hải Dương" in prov_name else 6000000
    if "Thái Nguyên" in prov_name:
        unit_name = f"Căn Hộ Tecco Elite City — Phường Thịnh Đán, TP. Thái Nguyên"
        rent_vnd = 8000000
        sqm = 72
        beds = 2
        baths = 2
        unit_type = "Deluxe Apartment"
    elif "Bắc Ninh" in prov_name:
        unit_name = f"Căn Hộ Vinhomes Bắc Ninh — Ngã 6 Suối Hoa, TP. Bắc Ninh"
        rent_vnd = 11000000
        sqm = 75
        beds = 2
        baths = 2
        unit_type = "Deluxe Apartment"
    else:
        unit_name = f"Căn Hộ Cao Cấp Haven Garden — {district_name}, {prov_name}"
        sqm = 65
        beds = 2
        baths = 1
        unit_type = "Deluxe Apartment"

    elec = int(rent_vnd * 0.08)
    water = 120000
    internet = 250000
    mgmt = int(sqm * 10000)
    parking = 800000
    total_est = rent_vnd + elec + water + internet + mgmt + parking
    deposit_vnd = rent_vnd
    move_in = total_est + deposit_vnd
    rent_usd = round(rent_vnd / 24500)

    unit_dict = {
        "id": unit_id,
        "name": unit_name,
        "floor": 8,
        "unitNumber": f"08{idx % 20 + 1:02d}",
        "type": unit_type,
        "sqm": sqm,
        "bedrooms": beds,
        "bathrooms": baths,
        "status": "vacant",
        "monthlyRentUSD": rent_usd,
        "monthlyRentVND": rent_vnd,
        "city": prov_name,
        "district": district_name,
        "address": address,
        "images": CURATED_IMAGES[idx % 3],
        "hasCarParking": True,
        "hasMotorbikeParking": True,
        "hasElevator": True,
        "hasBackupPower": True,
        "floodingRisk": "Low",
        "noiseLevel": "Quiet",
        "trafficDensity": "Moderate",
        "petFriendly": True,
        "furnished": True,
        "balcony": True,
        "airConditioning": True,
        "washingMachine": True,
        "kitchen": True,
        "wifi": True,
        "rating": 4.85,
        "reviewCount": 28,
        "viewType": f"View Trung Tâm {district_name}",
        "isVerifiedPlus": True,
        "verificationLevel": "full_ownership_verified",
        "trueCost": {
            "baseRentVND": rent_vnd,
            "estimatedElectricityVND": elec,
            "waterFeeVND": water,
            "internetFeeVND": internet,
            "managementFeeVND": mgmt,
            "parkingFeeVND": parking,
            "totalMonthlyEstimatedVND": total_est,
            "depositMonths": 1,
            "depositVND": deposit_vnd,
            "moveInTotalRequiredVND": move_in,
            "electricityRatePerKwh": 3500
        },
        "pcccReport": {
            "hasFireEscapes": True,
            "fireEscapeCount": 2,
            "hasAutomaticSprinklers": True,
            "hasSmokeDetectors": True,
            "hasFireExtinguishers": True,
            "inspectionCertificateStatus": "certified",
            "lastInspectionDate": "2026-04-15",
            "emergencyExitWidthMeters": 1.4,
            "disclaimer": "Đạt thẩm duyệt PCCC QCVN 06:2022/BXD bởi Cảnh sát PCCC & CNCH."
        },
        "aiInsights": {
            "whyFit": [
                f"Vị trí đắc địa tại {district_name}, kết nối nhanh toàn bộ tiện ích của tỉnh {prov_name}",
                "Trang bị chỗ đỗ ô tô định danh, camera an ninh và khóa cửa thông minh IoT",
                "Tiêu chuẩn PCCC và hệ thống điện dự phòng tự động hoạt động 24/7"
            ],
            "worthConsidering": [
                "Căn hộ thuộc quỹ nhà kiểm định Verified Plus có lượng khách săn đón cao",
                "Hợp đồng thuê tối thiểu từ 6 tháng trở lên"
            ]
        },
        "environmentalData": {
            "weatherNotes": "Không khí trong lành, đón gió tươi tự nhiên thông thoáng quanh năm.",
            "floodNotes": "Cốt nền cao ráo kiên cố; không ngập úng khi triều cường hoặc mưa giông.",
            "powerNotes": "Hệ thống điện lưới kép và trạm phát điện dự phòng tự động 100% tải.",
            "trafficNotes": f"Tọa lạc trên trục đường lớn tại {district_name}, thuận tiện di chuyển."
        },
        "sensors": {
            "smartLockBattery": 92,
            "hvacStatus": "Optimal",
            "targetTempC": 24,
            "energyConsumptionKwh": 18.5,
            "waterUsageLiters": 95,
            "securityAlarmDisarmed": True
        }
    }
    new_units.append(unit_dict)

print(f"Generated {len(new_units)} new units for missing provinces.")

# Inject new units before `export const MOCK_TICKETS`
units_json_str = ",\n" + ",\n".join(json.dumps(u, ensure_ascii=False, indent=2) for u in new_units)

# Find the end of MOCK_UNITS = [ ... ];
pattern = r'(export const MOCK_UNITS:\s*ApartmentUnit\[\]\s*=\s*\[[\s\S]*?)(\n\];)'
match = re.search(pattern, content)
if not match:
    print("ERROR: Could not locate MOCK_UNITS array closing")
else:
    new_content = content[:match.end(1)] + units_json_str + content[match.start(2):]
    with open('src/data/mockData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: mockData.ts updated with all 63 provinces!")
