import type { ApartmentUnit, MaintenanceTicket, Amenity } from '../types/apartment';

export const MOCK_UNITS: ApartmentUnit[] = [
  {
    "id": "HN-TH-2401",
    "name": "Penthouse Hồ Tây Panorama & Sân Vườn Sinh Thái",
    "floor": 24,
    "unitNumber": "2401",
    "type": "Penthouse",
    "sqm": 380,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 350000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "58 Từ Hoa, Phường Quảng An, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Panorama Trọn Hồ Tây",
    "aiInsights": {
      "whyFit": [
        "Tầm nhìn Panorama trọn vẹn hoàng hôn Hồ Tây với sân vườn sinh thái riêng biệt",
        "Chỗ đỗ ô tô cố định dưới hầm có sẵn cổng sạc xe điện EV",
        "Tầng cao 24 cách âm hoàn hảo, tuyệt đối không tiếng ồn đường phố",
        "Máy phát điện công nghiệp 24/7 dự phòng 100% công suất toàn căn hộ"
      ],
      "worthConsidering": [
        "Mức giá phân khúc siêu sang phù hợp gia đình cao cấp hoặc chuyên gia quốc tế",
        "Khu vực đường ven hồ nhộn nhịp vào dịp lễ Tết"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón trọn gió mát tự nhiên từ mặt hồ Tây; hệ thống điều hòa VRV lọc khí tươi hai chiều.",
      "floodNotes": "Địa thế bờ hồ cao ráo; lịch sử khu vực chưa từng ghi nhận ngập úng khi mưa bão lớn.",
      "powerNotes": "Trang bị 2 máy phát Caterpillar chuyên dụng, tự động đóng điện sau 3 giây khi mất điện lưới.",
      "trafficNotes": "Kết nối nhanh ra đường Âu Cơ, Thanh Niên và cầu Nhật Tân thẳng sân bay Nội Bài."
    },
    "monthlyRentUSD": 14286,
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.75,
    "reviewCount": 15,
    "sensors": {
      "smartLockBattery": 85,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 24.5,
      "waterUsageLiters": 110,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HK-1202",
    "name": "Căn Hộ Hoàn Kiếm Heritage Executive Suite",
    "floor": 12,
    "unitNumber": "1202",
    "type": "Executive Suite",
    "sqm": 110,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 16000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "18 Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Heavy",
    "petFriendly": false,
    "viewType": "Phố Cổ & Tháp Rùa",
    "aiInsights": {
      "whyFit": [
        "Mức giá cực kỳ hợp lý chỉ 16 Triệu/tháng ngay lõi trung tâm Hoàn Kiếm",
        "Bước bộ 3 phút ra Hồ Gươm và các phố ẩm thực di sản",
        "Nội thất phong cách Indochine gỗ tự nhiên sang trọng"
      ],
      "worthConsidering": [
        "Tuyến phố đi bộ cuối tuần cấm xe ô tô vào ban đêm",
        "Không cho phép nuôi thú cưng"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Rợp bóng cây cổ thụ đường Tràng Thi, không gian mát mẻ quanh năm.",
      "floodNotes": "Khu vực trung tâm cao ráo, hệ thống cống ngầm thời Pháp thoát nước cực nhanh.",
      "powerNotes": "Ưu tiên cấp điện tuyến trung tâm hành chính quốc gia, tỷ lệ mất điện 0%.",
      "trafficNotes": "Lưu lượng xe cộ đông vào giờ tan tầm; thuận tiện đi bộ và xe máy."
    },
    "monthlyRentUSD": 653,
    "images": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.76,
    "reviewCount": 16,
    "sensors": {
      "smartLockBattery": 86,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 25.5,
      "waterUsageLiters": 111,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-CG-1405",
    "name": "Căn Hộ Cao Cấp Cầu Giấy Garden View",
    "floor": 14,
    "unitNumber": "1405",
    "type": "Deluxe Apartment",
    "sqm": 95,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 18000000,
    "city": "Hanoi",
    "district": "Cầu Giấy",
    "address": "122 Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Công Viên Cầu Giấy",
    "aiInsights": {
      "whyFit": [
        "Mức giá 18 Triệu/tháng chuẩn xác theo nhu cầu căn 2 phòng ngủ tại Cầu Giấy",
        "Có sẵn chỗ đỗ ô tô định danh tại hầm B2 và cổng sạc xe điện",
        "Tầng 14 cách âm kính hộp 2 lớp Low-E cực kỳ yên tĩnh"
      ],
      "worthConsidering": [
        "Trục đường Xuân Thủy có mật độ giao thông đông vào giờ cao điểm",
        "Cách ga Metro Nhổn - Ga Hà Nội 300m đi bộ"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Hướng ban công Đông Nam mát mẻ, đón gió lành buổi sáng.",
      "floodNotes": "Đường Xuân Thủy đoạn tòa nhà đã hoàn thiện nâng cấp cống hộp, không đọng nước.",
      "powerNotes": "Hệ thống điện dự phòng tòa nhà duy trì liên tục cho thang máy và chiếu sáng.",
      "trafficNotes": "Đi bộ 3 phút tới trạm Metro trên cao, di chuyển vào trung tâm chỉ mất 12 phút."
    },
    "monthlyRentUSD": 735,
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.77,
    "reviewCount": 17,
    "sensors": {
      "smartLockBattery": 87,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 26.5,
      "waterUsageLiters": 112,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TH-1803",
    "name": "Căn Hộ Tây Hồ Sunrise Vista",
    "floor": 18,
    "unitNumber": "1803",
    "type": "Deluxe Apartment",
    "sqm": 105,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 19500000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "699 Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Trọn View Hồ Tây & Cầu Nhật Tân",
    "aiInsights": {
      "whyFit": [
        "Chỉ 19.5 Triệu/tháng cho căn hộ 2PN tầng 18 sát Lotte Mall Tây Hồ",
        "View trực diện mặt nước Hồ Tây, không gian trong lành nhất Hà Nội",
        "Cho phép nuôi thú cưng nhỏ, khuôn viên tản bộ rộng rãi"
      ],
      "worthConsidering": [
        "Cuối tuần khách tham quan Lotte Mall đông, nên đi lối ngõ phụ"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Gió hồ mát rượi, độ ẩm ổn định, chất lượng không khí trong lành.",
      "floodNotes": "Địa hình Xuân La - Lạc Long Quân cao thoáng, không ngập úng.",
      "powerNotes": "Tòa nhà mới bàn giao 2024, máy phát điện tự động Cummins 100%.",
      "trafficNotes": "Trục đường 40m kết nối thẳng sân bay Nội Bài trong 18 phút."
    },
    "monthlyRentUSD": 796,
    "images": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.78,
    "reviewCount": 18,
    "sensors": {
      "smartLockBattery": 88,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 27.5,
      "waterUsageLiters": 113,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-BD-0902",
    "name": "Căn Hộ Ba Đình Botanical Living",
    "floor": 9,
    "unitNumber": "0902",
    "type": "Executive Suite",
    "sqm": 85,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 15500000,
    "city": "Hanoi",
    "district": "Ba Đình",
    "address": "29 Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Ngọc Khánh & Lotte Center",
    "aiInsights": {
      "whyFit": [
        "Căn hộ 2PN giá 15.5 Triệu/tháng ngay khu ngoại giao đoàn Liễu Giai - Kim Mã",
        "An ninh tuyệt đối 24/7 với hệ thống camera AI và thẻ từ phân tầng",
        "Gần các trường quốc tế và đại sứ quán Nhật Bản, Australia"
      ],
      "worthConsidering": [
        "Không cho phép nuôi thú cưng",
        "Hầm xe ưu tiên xe sedan và crossover"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Không khí thoáng đãng, nhiều cây xanh ven hồ Ngọc Khánh.",
      "floodNotes": "Khu vực Liễu Giai địa thế cao, cống ngầm hiện đại không ngập.",
      "powerNotes": "Điện lưới khu ngoại giao đoàn ổn định bậc nhất thủ đô.",
      "trafficNotes": "Ngay cạnh ga Metro ngầm Kim Mã - Cát Linh."
    },
    "monthlyRentUSD": 633,
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.79,
    "reviewCount": 19,
    "sensors": {
      "smartLockBattery": 89,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 28.5,
      "waterUsageLiters": 114,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-NTL-2104",
    "name": "Căn Hộ Mỹ Đình High-Tech Residence",
    "floor": 21,
    "unitNumber": "2104",
    "type": "Deluxe Apartment",
    "sqm": 118,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 22000000,
    "city": "Hanoi",
    "district": "Nam Từ Liêm",
    "address": "8 Lê Đức Thọ, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sân Vận Động Mỹ Đình & Skyline",
    "aiInsights": {
      "whyFit": [
        "Căn hộ 3PN rộng 118m² giá 22 Triệu/tháng phù hợp gia đình nhiều thế hệ",
        "Chỗ đỗ ô tô hầm thông minh 3 tầng rộng rãi",
        "Tiện ích nội khu đầy đủ: bể bơi bốn mùa, gym, sân chơi trẻ em"
      ],
      "worthConsidering": [
        "Vào các ngày diễn ra sự kiện thể thao lớn cần đi theo hướng Nguyễn Cơ Thạch"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Tầng 21 đón gió Tây Nam mát mẻ, tầm nhìn thoáng không bị chắn.",
      "floodNotes": "Đường Lê Đức Thọ cao ráo, hệ thống thoát nước hồ điều hòa Mỹ Đình hoạt động tốt.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất cho toàn bộ căn hộ.",
      "trafficNotes": "Kết nối trực tiếp Đại Lộ Thăng Long và Vành Đai 3."
    },
    "monthlyRentUSD": 898,
    "images": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.8,
    "reviewCount": 20,
    "sensors": {
      "smartLockBattery": 90,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 29.5,
      "waterUsageLiters": 115,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HBT-1608",
    "name": "Căn Hộ Times City Park Hill Luxury",
    "floor": 16,
    "unitNumber": "1608",
    "type": "Deluxe Apartment",
    "sqm": 80,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 16500000,
    "city": "Hanoi",
    "district": "Hai Bà Trưng",
    "address": "458 Minh Khai, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Nhạc Nước & Quảng Trường Trung Tâm",
    "aiInsights": {
      "whyFit": [
        "Giá thuê 16.5 Triệu/tháng full nội thất hiện đại sang trọng",
        "Hệ sinh thái Vinmec, Vinschool và TTTM Mega Mall ngay dưới chân tòa nhà",
        "Quần thể cây xanh và nhạc nước thư thái mỗi buổi chiều"
      ],
      "worthConsidering": [
        "Cần đăng ký sớm chỗ đỗ ô tô định kỳ với ban quản lý"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Không gian nội khu phủ rợp bóng mát, nhiệt độ thấp hơn ngoài phố 1-2°C.",
      "floodNotes": "Hầm Times City và trục Minh Khai trên cao không bị ngập.",
      "powerNotes": "Nguồn điện dự phòng tự động 24/7 tiêu chuẩn Vinhomes.",
      "trafficNotes": "Đường Vành Đai 2 trên cao thông thoáng chạy thẳng Cầu Giấy - Ngã Tư Sở."
    },
    "monthlyRentUSD": 673,
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.81,
    "reviewCount": 21,
    "sensors": {
      "smartLockBattery": 91,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 30.5,
      "waterUsageLiters": 116,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TH-0801",
    "name": "Căn Hộ Studio Tây Hồ Eco Retreat",
    "floor": 8,
    "unitNumber": "0801",
    "type": "Executive Suite",
    "sqm": 55,
    "bedrooms": 1,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 11000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "12 Đặng Thai Mai, Phường Quảng An, Quận Tây Hồ, Hà Nội",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Vườn Sen & Biệt Thự Quảng An",
    "aiInsights": {
      "whyFit": [
        "Giá chỉ 11 Triệu/tháng cực kỳ lý tưởng cho người đi làm độc thân hoặc freelancer",
        "Khu phố Tây văn minh, nhiều quán cà phê nghệ thuật và nhà hàng Âu",
        "Bếp mở hiện đại đầy đủ lò nướng và máy giặt sấy riêng"
      ],
      "worthConsidering": [
        "Chỉ có chỗ đỗ xe máy, không có chỗ đỗ xe ô tô trong nhà"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Bán đảo Quảng An ba mặt giáp hồ, vi khí hậu mát mẻ quanh năm.",
      "floodNotes": "Đồi cát Quảng An cao hơn mực nước hồ 4 mét, an toàn tuyệt đối.",
      "powerNotes": "Hệ thống điện ổn định, có máy phát dự phòng cho chiếu sáng và wifi.",
      "trafficNotes": "Đường Đặng Thai Mai yên tĩnh, không gian đi bộ đạp xe lý tưởng."
    },
    "monthlyRentUSD": 449,
    "images": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.82,
    "reviewCount": 22,
    "sensors": {
      "smartLockBattery": 92,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 31.5,
      "waterUsageLiters": 117,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-CG-2501",
    "name": "Sky Villa Cầu Giấy Penthouse Duplex",
    "floor": 25,
    "unitNumber": "2501",
    "type": "Sky Villa",
    "sqm": 290,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 68000000,
    "city": "Hanoi",
    "district": "Cầu Giấy",
    "address": "2 Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Skyline Phía Tây Hà Nội 360 Độ",
    "aiInsights": {
      "whyFit": [
        "Thiết kế thông tầng Duplex 6 mét trần kính ngắm hoàng hôn rực rỡ",
        "Có 2 chỗ đỗ ô tô cố định dưới hầm kèm trạm sạc nhanh EV riêng",
        "Hồ bơi jacuzzi nước ấm trên ban công riêng biệt"
      ],
      "worthConsidering": [
        "Phù hợp phân khúc quản lý cấp cao, CEO doanh nghiệp công nghệ"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Hệ kính hộp 3 lớp Saint-Gobain cách nhiệt cách âm tối ưu.",
      "floodNotes": "Khu công nghệ Duy Tân hạ tầng ngầm đồng bộ.",
      "powerNotes": "2 máy phát Kohler dự phòng 100% full tải.",
      "trafficNotes": "Ngay trung tâm thung lũng Silicon Hà Nội, 5 phút ra bến xe Mỹ Đình."
    },
    "monthlyRentUSD": 2776,
    "images": [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.83,
    "reviewCount": 23,
    "sensors": {
      "smartLockBattery": 93,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 32.5,
      "waterUsageLiters": 118,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-BD-1502",
    "name": "Căn Hộ Grandeur Palace Giảng Võ",
    "floor": 15,
    "unitNumber": "1502",
    "type": "Deluxe Apartment",
    "sqm": 130,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 32000000,
    "city": "Hanoi",
    "district": "Ba Đình",
    "address": "138 Giảng Võ, Phường Kim Mã, Quận Ba Đình, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Giảng Võ & Núi Ba Vì Từ Xa",
    "aiInsights": {
      "whyFit": [
        "Căn hộ 3PN đẳng cấp 5 sao tại Ba Đình với nội thất nhập khẩu Ý",
        "Sảnh thang máy riêng tới từng căn hộ, bảo mật vân tay tối tân",
        "Chỗ đỗ ô tô thông minh tự động nâng hạ hiện đại"
      ],
      "worthConsidering": [
        "Quy định nghiêm ngặt về trật tự và giờ giấc tòa nhà"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió hồ Giảng Võ trong lành, không bị nắng gắt chiếu thẳng.",
      "floodNotes": "Hệ thống bơm ngầm chống ngập công suất lớn bảo vệ hầm 24/7.",
      "powerNotes": "Nguồn điện chất lượng cao cấp riêng cho khu tổ hợp hạng A.",
      "trafficNotes": "Mặt đường Giảng Võ 6 làn xe, nối thẳng đường Cát Linh."
    },
    "monthlyRentUSD": 1306,
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.84,
    "reviewCount": 24,
    "sensors": {
      "smartLockBattery": 94,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 33.5,
      "waterUsageLiters": 119,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D1-1601",
    "name": "Căn Hộ Masterise Grand Marina Saigon View Sông",
    "floor": 16,
    "unitNumber": "1601",
    "type": "Executive Suite",
    "sqm": 92,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 38000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 1",
    "address": "2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Cầu Ba Son",
    "aiInsights": {
      "whyFit": [
        "Tầm nhìn trực diện bến du thuyền và sông Sài Gòn tuyệt mỹ",
        "Thương hiệu quản lý vận hành chuẩn Marriott International",
        "Ga Metro Ba Son nằm ngay trong khuôn viên dự án"
      ],
      "worthConsidering": [
        "Mức giá 38 Triệu/tháng thuộc phân khúc cao cấp Quận 1"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Gió sông Sài Gòn thổi mát lộng; công viên bờ sông 10ha điều hòa không khí.",
      "floodNotes": "Cốt nền bờ sông được nâng cao theo tiêu chuẩn chống triều cường thế kỷ.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất chuẩn khách sạn 5 sao quốc tế.",
      "trafficNotes": "Qua cầu Ba Son chỉ 2 phút là sang khu đô thị mới Thủ Thiêm."
    },
    "monthlyRentUSD": 1551,
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.85,
    "reviewCount": 25,
    "sensors": {
      "smartLockBattery": 95,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 34.5,
      "waterUsageLiters": 120,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D2-1104",
    "name": "Căn Hộ Thảo Điền Green Riverside Garden",
    "floor": 11,
    "unitNumber": "1104",
    "type": "Deluxe Apartment",
    "sqm": 88,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 21000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 2",
    "address": "192 Nguyễn Văn Hưởng, Phường Thảo Điền, Thành phố Thủ Đức, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Uốn Lượn Sông Sài Gòn & Bán Đảo Thanh Đa",
    "aiInsights": {
      "whyFit": [
        "Mức giá 21 Triệu/tháng cực kỳ hấp dẫn tại tâm điểm Thảo Điền",
        "Tòa nhà cao tầng mới xây với đê bao chống triều cường độc lập",
        "Cộng đồng cư dân quốc tế thân thiện, nhiều nhà hàng & trường học quốc tế"
      ],
      "worthConsidering": [
        "Tuyến đường Nguyễn Văn Hưởng đoạn ngoài có thể ngập nhẹ vào ngày rằm triều cường lớn"
      ]
    },
    "environmentalData": {
      "weatherNotes": "3 mặt sông Sài Gòn bao bọc mang lại khí hậu mát dịu quanh năm.",
      "floodNotes": "Tòa nhà sở hữu trạm bơm riêng và dốc hầm nâng cao +1.5m chống tràn tuyệt đối.",
      "powerNotes": "Máy phát điện tự động Cummins bảo đảm toàn bộ hệ thống thang máy và căn hộ.",
      "trafficNotes": "Chạy xe 5 phút ra Xa Lộ Hà Nội và trạm Metro Thảo Điền."
    },
    "monthlyRentUSD": 857,
    "images": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.86,
    "reviewCount": 26,
    "sensors": {
      "smartLockBattery": 96,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 35.5,
      "waterUsageLiters": 121,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D7-1506",
    "name": "Căn Hộ Midtown Phú Mỹ Hưng Sakura Park",
    "floor": 15,
    "unitNumber": "1506",
    "type": "Deluxe Apartment",
    "sqm": 110,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 24000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 7",
    "address": "Đường 16, Khu phức hợp Midtown, Tân Phú, Quận 7, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Công Viên Hoa Anh Đào & Dòng Sông Cảnh Quan",
    "aiInsights": {
      "whyFit": [
        "Giá thuê 24 Triệu/tháng căn hộ 2PN 110m² view trọn công viên Sakura Park",
        "Khu đô thị sinh thái xanh chuẩn quốc tế, không khói bụi",
        "Có sẵn 1 chỗ đỗ ô tô hầm cố định và hồ bơi vô cực ngắm hoàng hôn"
      ],
      "worthConsidering": [
        "Di chuyển vào Quận 1 khoảng 20-25 phút vào giờ cao điểm"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Mảng xanh bao phủ 60% diện tích, không khí trong lành mát mẻ.",
      "floodNotes": "Hạ tầng Phú Mỹ Hưng thiết kế chống ngập chuẩn Singapore, không ngập nước.",
      "powerNotes": "Trạm điện trung tâm dự phòng hoạt động tự động.",
      "trafficNotes": "Đại lộ Nguyễn Lương Bằng 8 làn xe thông thoáng, cây xanh rợp bóng."
    },
    "monthlyRentUSD": 980,
    "images": [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.87,
    "reviewCount": 27,
    "sensors": {
      "smartLockBattery": 97,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 36.5,
      "waterUsageLiters": 122,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-BT-2802",
    "name": "Căn Hộ Landmark 81 Luxury Sky Suite",
    "floor": 28,
    "unitNumber": "2802",
    "type": "Sky Villa",
    "sqm": 145,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 48000000,
    "city": "Ho Chi Minh City",
    "district": "Bình Thạnh",
    "address": "720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Toàn Cảnh Sông Sài Gòn & Landmark 81",
    "aiInsights": {
      "whyFit": [
        "Trải nghiệm sống đỉnh cao tại biểu tượng kiến trúc Landmark 81",
        "Công viên ven sông 14 hecta lớn nhất trung tâm thành phố",
        "Chỗ đỗ ô tô thông minh tầng hầm liên thông 3 tòa nhà"
      ],
      "worthConsidering": [
        "Khu vực trung tâm thương mại đông đúc vào các dịp cuối tuần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Tầng 28 view thoáng đãng, đón gió mát từ sông Sài Gòn.",
      "floodNotes": "Được tôn cao nền hoàn chỉnh, đường nội bộ chống ngập toàn diện.",
      "powerNotes": "Hệ thống điện dự phòng 100% tự động đóng cắt.",
      "trafficNotes": "Ga Metro Tân Cảng kết nối trực tiếp trong bán kính 300 mét."
    },
    "monthlyRentUSD": 1959,
    "images": [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.88,
    "reviewCount": 28,
    "sensors": {
      "smartLockBattery": 98,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 37.5,
      "waterUsageLiters": 123,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D3-0901",
    "name": "Căn Hộ Léman Luxury Paul Cézanne Suite",
    "floor": 9,
    "unitNumber": "0901",
    "type": "Executive Suite",
    "sqm": 75,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 26000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 3",
    "address": "117 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hàng Cây Dầu Cổ Thụ & Biệt Thự Cổ Quận 3",
    "aiInsights": {
      "whyFit": [
        "Vị trí tâm điểm Quận 3 yên bình, rợp bóng cây cổ thụ trăm tuổi",
        "Nội thất phong cách Thụy Sỹ tinh tế, sang trọng",
        "Hồ bơi tràn trên sân thượng nhìn trọn trung tâm Sài Gòn"
      ],
      "worthConsidering": [
        "Đường một chiều Nguyễn Đình Chiểu cần chú ý khi lái ô tô"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Những rặng cây dầu xanh mát làm dịu cái nóng nhiệt đới.",
      "floodNotes": "Khu vực gò đất cao trung tâm Quận 3 chưa bao giờ ngập nước.",
      "powerNotes": "Tòa nhà văn phòng - căn hộ cao cấp trang bị 2 nguồn điện kép.",
      "trafficNotes": "Đi bộ 7 phút sang Dinh Độc Lập và công viên Tao Đàn."
    },
    "monthlyRentUSD": 1061,
    "images": [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.89,
    "reviewCount": 29,
    "sensors": {
      "smartLockBattery": 85,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 38.5,
      "waterUsageLiters": 124,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D2-2201",
    "name": "Sky Villa Đảo Kim Cương Diamond Island",
    "floor": 22,
    "unitNumber": "2201",
    "type": "Sky Villa",
    "sqm": 260,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 95000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 2",
    "address": "1 Đường số 104, Phường Bình Trưng Tây, Thành phố Thủ Đức, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Hòn Đảo 4 Mặt Sông & Bến Du Thuyền Riêng",
    "aiInsights": {
      "whyFit": [
        "Dự án đảo tự nhiên duy nhất tại TP.HCM với 85% diện tích cây xanh mặt nước",
        "Hồ bơi khoáng muối resort 2300m² và bến đậu du thuyền sang trọng",
        "2 chỗ đỗ ô tô riêng dưới hầm thông minh có trạm sạc xe điện"
      ],
      "worthConsidering": [
        "Môi trường cực kỳ biệt lập, thích hợp nghỉ dưỡng và gia đình thượng lưu"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Được bao bọc bởi hợp lưu sông Sài Gòn và sông Giồng Ông Tố, nhiệt độ luôn thấp hơn phố.",
      "floodNotes": "Toàn bộ đảo được đắp đê bao kiên cố và hệ thống cống xả một chiều.",
      "powerNotes": "Nguồn điện dự phòng cao cấp đạt chuẩn quốc tế.",
      "trafficNotes": "Cầu Thời Đại kết nối đại lộ Mai Chí Thọ thông suốt không kẹt xe."
    },
    "monthlyRentUSD": 3878,
    "images": [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.9,
    "reviewCount": 30,
    "sensors": {
      "smartLockBattery": 86,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 24.5,
      "waterUsageLiters": 125,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-D7-0803",
    "name": "Căn Hộ Scenic Valley Phú Mỹ Hưng Garden",
    "floor": 8,
    "unitNumber": "0803",
    "type": "Deluxe Apartment",
    "sqm": 77,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 14500000,
    "city": "Ho Chi Minh City",
    "district": "Quận 7",
    "address": "Đường Tôn Dật Tiên, Tân Phú, Quận 7, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Sân Golf Nam Sài Gòn & Dòng Sông Thầy Tiêu",
    "aiInsights": {
      "whyFit": [
        "Giá chỉ 14.5 Triệu/tháng cực tốt cho căn hộ 2 phòng ngủ tại Phú Mỹ Hưng",
        "Đi bộ 3 phút sang bệnh viện FV và trung tâm thương mại Crescent Mall",
        "Khu dân cư an ninh, yên tĩnh, cộng đồng văn minh"
      ],
      "worthConsidering": [
        "Hầm xe máy giờ cao điểm cần lưu ý xếp xe gọn gàng"
      ]
    },
    "environmentalData": {
      "weatherNotes": "View sân golf xanh mướt mang đến bầu không khí trong lành.",
      "floodNotes": "Đô thị Phú Mỹ Hưng cốt nền đạt chuẩn không ngập nước.",
      "powerNotes": "Hệ thống điện tòa nhà vận hành an toàn ổn định.",
      "trafficNotes": "Đường nội khu vỉa hè rộng 6m thích hợp chạy bộ mỗi sáng."
    },
    "monthlyRentUSD": 592,
    "images": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.91,
    "reviewCount": 31,
    "sensors": {
      "smartLockBattery": 87,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 25.5,
      "waterUsageLiters": 126,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-ST-2201",
    "name": "Sky Villa Biển Mỹ Khê Sơn Trà Ocean Retreat",
    "floor": 22,
    "unitNumber": "2201",
    "type": "Sky Villa",
    "sqm": 230,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 42000000,
    "city": "Da Nang",
    "district": "Sơn Trà",
    "address": "120 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Căn hộ góc Sky Villa view ôm trọn bờ biển Mỹ Khê - một trong những bãi biển đẹp nhất hành tinh",
        "Chỗ đỗ ô tô hầm thông thoáng, chỉ mất 1 phút đi bộ ra bãi cát tắm biển",
        "Tầng 22 đón trọn gió biển trong lành, ngắm chùa Linh Ứng từ ban công"
      ],
      "worthConsidering": [
        "Mùa mưa bão miền Trung cần đóng chặt cửa sổ hướng biển theo hướng dẫn BQL"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Khí hậu biển ôn hòa, gió đông nam mát rượi suốt mùa hè.",
      "floodNotes": "Tuyến đường ven biển Võ Nguyên Giáp cao ráo thoát nước trực tiếp ra biển.",
      "powerNotes": "Trang bị máy phát điện công nghiệp chịu mặn, bảo đảm nguồn điện liên tục.",
      "trafficNotes": "Đại lộ ven biển rộng 40m kết nối nhanh qua cầu Rồng sang trung tâm Hải Châu."
    },
    "monthlyRentUSD": 1714,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.92,
    "reviewCount": 32,
    "sensors": {
      "smartLockBattery": 88,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 26.5,
      "waterUsageLiters": 127,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-HC-1102",
    "name": "Căn Hộ Bạch Đằng Riverside View Cầu Rồng",
    "floor": 11,
    "unitNumber": "1102",
    "type": "Executive Suite",
    "sqm": 86,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 17000000,
    "city": "Da Nang",
    "district": "Hải Châu",
    "address": "36 Bạch Đằng, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Sông Hàn, Cầu Quay & Cầu Rồng Phun Lửa",
    "aiInsights": {
      "whyFit": [
        "Giá thuê 17 Triệu/tháng cực kỳ hợp lý ngay trung tâm phố đi bộ Bạch Đằng",
        "Xem trực tiếp Cầu Rồng phun lửa và pháo hoa quốc tế DIFF từ phòng khách",
        "Bao quanh bởi các quán cà phê, nhà hàng và trung tâm hành chính Đà Nẵng"
      ],
      "worthConsidering": [
        "Tối cuối tuần đường Bạch Đằng đông vui náo nhiệt"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Mặt nước sông Hàn làm dịu không khí, đón gió biển từ vịnh Đà Nẵng.",
      "floodNotes": "Đường Bạch Đằng kè đá kiên cố, không bị ngập úng.",
      "powerNotes": "Tòa nhà sử dụng trạm biến áp trung tâm quận Hải Châu ổn định 100%.",
      "trafficNotes": "Thuận tiện di chuyển ra sân bay quốc tế Đà Nẵng chỉ trong 7 phút."
    },
    "monthlyRentUSD": 694,
    "images": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.93,
    "reviewCount": 33,
    "sensors": {
      "smartLockBattery": 89,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 27.5,
      "waterUsageLiters": 128,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NHS-0705",
    "name": "Căn Hộ Biển Ngũ Hành Sơn Coastal Garden",
    "floor": 7,
    "unitNumber": "0705",
    "type": "Deluxe Apartment",
    "sqm": 72,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 12500000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "55 Trường Sa, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Low",
    "petFriendly": true,
    "viewType": "Vườn Nhiệt Đới & Núi Ngũ Hành Sơn",
    "aiInsights": {
      "whyFit": [
        "Chỉ 12.5 Triệu/tháng cho căn hộ 2 phòng ngủ gần kề các resort 5 sao",
        "Khu phố An Thượng sôi động với nhiều chuyên gia nước ngoài và người du mục số",
        "Khuôn viên có hồ bơi người lớn & trẻ em, sân chơi thể thao"
      ],
      "worthConsidering": [
        "Khoảng cách vào trung tâm Hải Châu tầm 6km (10 phút đi xe máy)"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Gần núi Ngũ Hành Sơn và bãi biển Non Nước, không khí vô cùng mát mẻ.",
      "floodNotes": "Đồi cát tự nhiên địa hình cao ráo, cống thoát nước lớn.",
      "powerNotes": "Máy phát điện dự phòng vận hành êm ái khi có sự cố lưới.",
      "trafficNotes": "Trục đường Trường Sa thẳng tiến phố cổ Hội An trong 20 phút."
    },
    "monthlyRentUSD": 510,
    "images": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.94,
    "reviewCount": 34,
    "sensors": {
      "smartLockBattery": 90,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 28.5,
      "waterUsageLiters": 129,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-505",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-505",
    "floor": 5,
    "unitNumber": "505",
    "type": "Deluxe Apartment",
    "sqm": 95,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 15000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "102 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 15 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 5 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 612,
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.95,
    "reviewCount": 35,
    "sensors": {
      "smartLockBattery": 91,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 29.5,
      "waterUsageLiters": 130,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-606",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-606",
    "floor": 6,
    "unitNumber": "606",
    "type": "Deluxe Apartment",
    "sqm": 96,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 16000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "149 Trần Duy Hưng, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Trần Duy Hưng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 16 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 6 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 653,
    "images": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.96,
    "reviewCount": 36,
    "sensors": {
      "smartLockBattery": 92,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 30.5,
      "waterUsageLiters": 131,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-707",
    "name": "Căn Hộ Quận 3 Deluxe Apartment SG-QUN-707",
    "floor": 7,
    "unitNumber": "707",
    "type": "Deluxe Apartment",
    "sqm": 97,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 17000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 3",
    "address": "244 Nguyễn Hữu Thọ, Phường An Cư, Quận 3, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 3",
    "aiInsights": {
      "whyFit": [
        "Mức giá 17 Triệu/tháng tương thích hoàn hảo với khu vực Quận 3",
        "Căn hộ tầng 7 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 3",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 3.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 694,
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.97,
    "reviewCount": 37,
    "sensors": {
      "smartLockBattery": 93,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 31.5,
      "waterUsageLiters": 132,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-808",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-808",
    "floor": 8,
    "unitNumber": "808",
    "type": "Deluxe Apartment",
    "sqm": 98,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 18000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "117 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 18 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 8 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 735,
    "images": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.98,
    "reviewCount": 38,
    "sensors": {
      "smartLockBattery": 94,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 32.5,
      "waterUsageLiters": 133,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-901",
    "name": "Căn Hộ Tây Hồ Deluxe Apartment HN-TYH-901",
    "floor": 9,
    "unitNumber": "901",
    "type": "Deluxe Apartment",
    "sqm": 99,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 19000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "170 Lý Thường Kiệt, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 19 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 9 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 776,
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.99,
    "reviewCount": 39,
    "sensors": {
      "smartLockBattery": 95,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 33.5,
      "waterUsageLiters": 134,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-1302",
    "name": "Căn Hộ Quận 1 Deluxe Apartment SG-QUN-1302",
    "floor": 13,
    "unitNumber": "1302",
    "type": "Deluxe Apartment",
    "sqm": 45,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 12000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 1",
    "address": "27 Đồng Khởi, Phường An Cư, Quận 1, TP. Hồ Chí Minh",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Quận 1",
    "aiInsights": {
      "whyFit": [
        "Mức giá 12 Triệu/tháng tương thích hoàn hảo với khu vực Quận 1",
        "Căn hộ tầng 13 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 1",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 1.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 490,
    "images": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.75,
    "reviewCount": 40,
    "sensors": {
      "smartLockBattery": 96,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 34.5,
      "waterUsageLiters": 135,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-1403",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-1403",
    "floor": 14,
    "unitNumber": "1403",
    "type": "Deluxe Apartment",
    "sqm": 46,
    "bedrooms": 1,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 13000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "132 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 13 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 14 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 531,
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.76,
    "reviewCount": 41,
    "sensors": {
      "smartLockBattery": 97,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 35.5,
      "waterUsageLiters": 136,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-1504",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-1504",
    "floor": 15,
    "unitNumber": "1504",
    "type": "Deluxe Apartment",
    "sqm": 47,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 14000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "11 Xuân Diệu, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Xuân Diệu",
    "aiInsights": {
      "whyFit": [
        "Mức giá 14 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 15 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 571,
    "images": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.77,
    "reviewCount": 42,
    "sensors": {
      "smartLockBattery": 98,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 36.5,
      "waterUsageLiters": 137,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-2805",
    "name": "Căn Hộ Quận 7 Sky Villa SG-QUN-2805",
    "floor": 28,
    "unitNumber": "2805",
    "type": "Sky Villa",
    "sqm": 158,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 73000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 7",
    "address": "60 Nam Kỳ Khởi Nghĩa, Phường An Cư, Quận 7, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 7",
    "aiInsights": {
      "whyFit": [
        "Mức giá 73 Triệu/tháng tương thích hoàn hảo với khu vực Quận 7",
        "Căn hộ tầng 28 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 7",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 7.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 2980,
    "images": [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.78,
    "reviewCount": 43,
    "sensors": {
      "smartLockBattery": 85,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 37.5,
      "waterUsageLiters": 138,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-2906",
    "name": "Căn Hộ Ngũ Hành Sơn Sky Villa DN-NGH-2906",
    "floor": 29,
    "unitNumber": "2906",
    "type": "Sky Villa",
    "sqm": 159,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 74000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "147 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 74 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 29 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 3020,
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.79,
    "reviewCount": 44,
    "sensors": {
      "smartLockBattery": 86,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 38.5,
      "waterUsageLiters": 139,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-1507",
    "name": "Căn Hộ Tây Hồ Deluxe Apartment HN-TYH-1507",
    "floor": 15,
    "unitNumber": "1507",
    "type": "Deluxe Apartment",
    "sqm": 105,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 25000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "32 Trần Duy Hưng, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 25 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 15 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1020,
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.8,
    "reviewCount": 45,
    "sensors": {
      "smartLockBattery": 87,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 24.5,
      "waterUsageLiters": 140,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-1608",
    "name": "Căn Hộ Quận 2 Deluxe Apartment SG-QUN-1608",
    "floor": 16,
    "unitNumber": "1608",
    "type": "Deluxe Apartment",
    "sqm": 106,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 26000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 2",
    "address": "93 Ung Văn Khiêm, Phường An Cư, Quận 2, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Quận 2",
    "aiInsights": {
      "whyFit": [
        "Mức giá 26 Triệu/tháng tương thích hoàn hảo với khu vực Quận 2",
        "Căn hộ tầng 16 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 2",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 2.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1061,
    "images": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.81,
    "reviewCount": 46,
    "sensors": {
      "smartLockBattery": 88,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 25.5,
      "waterUsageLiters": 141,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-1701",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-1701",
    "floor": 17,
    "unitNumber": "1701",
    "type": "Deluxe Apartment",
    "sqm": 107,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 27000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "12 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 27 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 17 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1102,
    "images": [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.82,
    "reviewCount": 47,
    "sensors": {
      "smartLockBattery": 89,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 26.5,
      "waterUsageLiters": 142,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-1802",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-1802",
    "floor": 18,
    "unitNumber": "1802",
    "type": "Deluxe Apartment",
    "sqm": 108,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 28000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "53 Lý Thường Kiệt, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Lý Thường Kiệt",
    "aiInsights": {
      "whyFit": [
        "Mức giá 28 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 18 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1143,
    "images": [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.83,
    "reviewCount": 48,
    "sensors": {
      "smartLockBattery": 90,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 27.5,
      "waterUsageLiters": 143,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-BNH-1903",
    "name": "Căn Hộ Bình Thạnh Deluxe Apartment SG-BNH-1903",
    "floor": 19,
    "unitNumber": "1903",
    "type": "Deluxe Apartment",
    "sqm": 109,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 29000000,
    "city": "Ho Chi Minh City",
    "district": "Bình Thạnh",
    "address": "126 Xuân Thủy, Phường An Cư, Bình Thạnh, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Bình Thạnh",
    "aiInsights": {
      "whyFit": [
        "Mức giá 29 Triệu/tháng tương thích hoàn hảo với khu vực Bình Thạnh",
        "Căn hộ tầng 19 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Bình Thạnh",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Bình Thạnh.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1184,
    "images": [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.84,
    "reviewCount": 49,
    "sensors": {
      "smartLockBattery": 91,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 28.5,
      "waterUsageLiters": 144,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-804",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-804",
    "floor": 8,
    "unitNumber": "804",
    "type": "Deluxe Apartment",
    "sqm": 55,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 8000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "27 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 8 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 8 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 327,
    "images": [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.85,
    "reviewCount": 50,
    "sensors": {
      "smartLockBattery": 92,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 29.5,
      "waterUsageLiters": 145,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-905",
    "name": "Căn Hộ Tây Hồ Deluxe Apartment HN-TYH-905",
    "floor": 9,
    "unitNumber": "905",
    "type": "Deluxe Apartment",
    "sqm": 56,
    "bedrooms": 1,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 9000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "74 Xuân Diệu, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 9 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 9 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 367,
    "images": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.86,
    "reviewCount": 51,
    "sensors": {
      "smartLockBattery": 93,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 30.5,
      "waterUsageLiters": 146,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-1006",
    "name": "Căn Hộ Quận 3 Deluxe Apartment SG-QUN-1006",
    "floor": 10,
    "unitNumber": "1006",
    "type": "Deluxe Apartment",
    "sqm": 57,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 10000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 3",
    "address": "159 Nguyễn Thị Minh Khai, Phường An Cư, Quận 3, TP. Hồ Chí Minh",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Quận 3",
    "aiInsights": {
      "whyFit": [
        "Mức giá 10 Triệu/tháng tương thích hoàn hảo với khu vực Quận 3",
        "Căn hộ tầng 10 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 3",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 3.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 408,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.87,
    "reviewCount": 52,
    "sensors": {
      "smartLockBattery": 94,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 31.5,
      "waterUsageLiters": 147,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-2007",
    "name": "Căn Hộ Ngũ Hành Sơn Sky Villa DN-NGH-2007",
    "floor": 20,
    "unitNumber": "2007",
    "type": "Sky Villa",
    "sqm": 168,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 83000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "42 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 83 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 20 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 3388,
    "images": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.88,
    "reviewCount": 53,
    "sensors": {
      "smartLockBattery": 95,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 32.5,
      "waterUsageLiters": 148,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-2108",
    "name": "Căn Hộ Hoàn Kiếm Sky Villa HN-HON-2108",
    "floor": 21,
    "unitNumber": "2108",
    "type": "Sky Villa",
    "sqm": 169,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 84000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "95 Trần Duy Hưng, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Trần Duy Hưng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 84 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 21 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 3429,
    "images": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.89,
    "reviewCount": 54,
    "sensors": {
      "smartLockBattery": 96,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 33.5,
      "waterUsageLiters": 149,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-501",
    "name": "Căn Hộ Quận 1 Deluxe Apartment SG-QUN-501",
    "floor": 5,
    "unitNumber": "501",
    "type": "Deluxe Apartment",
    "sqm": 80,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 15000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 1",
    "address": "192 Ngô Đức Kế, Phường An Cư, Quận 1, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 1",
    "aiInsights": {
      "whyFit": [
        "Mức giá 15 Triệu/tháng tương thích hoàn hảo với khu vực Quận 1",
        "Căn hộ tầng 5 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 1",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 1.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 612,
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.9,
    "reviewCount": 15,
    "sensors": {
      "smartLockBattery": 97,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 34.5,
      "waterUsageLiters": 150,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-602",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-602",
    "floor": 6,
    "unitNumber": "602",
    "type": "Deluxe Apartment",
    "sqm": 81,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 16000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "57 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 16 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 6 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 653,
    "images": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.91,
    "reviewCount": 16,
    "sensors": {
      "smartLockBattery": 98,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 35.5,
      "waterUsageLiters": 151,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-703",
    "name": "Căn Hộ Tây Hồ Deluxe Apartment HN-TYH-703",
    "floor": 7,
    "unitNumber": "703",
    "type": "Deluxe Apartment",
    "sqm": 82,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 17000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "116 Lý Thường Kiệt, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 17 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 7 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 694,
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.92,
    "reviewCount": 17,
    "sensors": {
      "smartLockBattery": 85,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 36.5,
      "waterUsageLiters": 152,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-804",
    "name": "Căn Hộ Quận 7 Deluxe Apartment SG-QUN-804",
    "floor": 8,
    "unitNumber": "804",
    "type": "Deluxe Apartment",
    "sqm": 83,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 18000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 7",
    "address": "225 Trần Não, Phường An Cư, Quận 7, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Quận 7",
    "aiInsights": {
      "whyFit": [
        "Mức giá 18 Triệu/tháng tương thích hoàn hảo với khu vực Quận 7",
        "Căn hộ tầng 8 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 7",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 7.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 735,
    "images": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.93,
    "reviewCount": 18,
    "sensors": {
      "smartLockBattery": 86,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 37.5,
      "waterUsageLiters": 153,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-905",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-905",
    "floor": 9,
    "unitNumber": "905",
    "type": "Deluxe Apartment",
    "sqm": 84,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 19000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "72 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 19 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 9 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 776,
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.94,
    "reviewCount": 19,
    "sensors": {
      "smartLockBattery": 87,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 38.5,
      "waterUsageLiters": 154,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-306",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-306",
    "floor": 3,
    "unitNumber": "306",
    "type": "Deluxe Apartment",
    "sqm": 65,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 11000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "137 Xuân Diệu, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Xuân Diệu",
    "aiInsights": {
      "whyFit": [
        "Mức giá 11 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 3 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 449,
    "images": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.95,
    "reviewCount": 20,
    "sensors": {
      "smartLockBattery": 88,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 24.5,
      "waterUsageLiters": 155,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-407",
    "name": "Căn Hộ Quận 2 Deluxe Apartment SG-QUN-407",
    "floor": 4,
    "unitNumber": "407",
    "type": "Deluxe Apartment",
    "sqm": 66,
    "bedrooms": 1,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 12000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 2",
    "address": "8 Nguyễn Hữu Thọ, Phường An Cư, Quận 2, TP. Hồ Chí Minh",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 2",
    "aiInsights": {
      "whyFit": [
        "Mức giá 12 Triệu/tháng tương thích hoàn hảo với khu vực Quận 2",
        "Căn hộ tầng 4 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 2",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 2.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 490,
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.96,
    "reviewCount": 21,
    "sensors": {
      "smartLockBattery": 89,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 25.5,
      "waterUsageLiters": 156,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-508",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-508",
    "floor": 5,
    "unitNumber": "508",
    "type": "Deluxe Apartment",
    "sqm": 67,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 13000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "87 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Moderate",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 13 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 5 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 531,
    "images": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.97,
    "reviewCount": 22,
    "sensors": {
      "smartLockBattery": 90,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 26.5,
      "waterUsageLiters": 157,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-3001",
    "name": "Căn Hộ Tây Hồ Sky Villa HN-TYH-3001",
    "floor": 30,
    "unitNumber": "3001",
    "type": "Sky Villa",
    "sqm": 178,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 93000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "158 Trần Duy Hưng, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 93 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 30 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 3796,
    "images": [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.98,
    "reviewCount": 23,
    "sensors": {
      "smartLockBattery": 91,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 27.5,
      "waterUsageLiters": 158,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-BNH-3102",
    "name": "Căn Hộ Bình Thạnh Sky Villa SG-BNH-3102",
    "floor": 31,
    "unitNumber": "3102",
    "type": "Sky Villa",
    "sqm": 179,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 94000000,
    "city": "Ho Chi Minh City",
    "district": "Bình Thạnh",
    "address": "41 Đồng Khởi, Phường An Cư, Bình Thạnh, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Bình Thạnh",
    "aiInsights": {
      "whyFit": [
        "Mức giá 94 Triệu/tháng tương thích hoàn hảo với khu vực Bình Thạnh",
        "Căn hộ tầng 31 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Bình Thạnh",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Bình Thạnh.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 3837,
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.99,
    "reviewCount": 24,
    "sensors": {
      "smartLockBattery": 92,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 28.5,
      "waterUsageLiters": 159,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-1503",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-1503",
    "floor": 15,
    "unitNumber": "1503",
    "type": "Deluxe Apartment",
    "sqm": 90,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 25000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "102 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 25 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 15 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1020,
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da9c40f?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.75,
    "reviewCount": 25,
    "sensors": {
      "smartLockBattery": 93,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 29.5,
      "waterUsageLiters": 110,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-1604",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-1604",
    "floor": 16,
    "unitNumber": "1604",
    "type": "Deluxe Apartment",
    "sqm": 91,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 26000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "179 Lý Thường Kiệt, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Lý Thường Kiệt",
    "aiInsights": {
      "whyFit": [
        "Mức giá 26 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 16 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1061,
    "images": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.76,
    "reviewCount": 26,
    "sensors": {
      "smartLockBattery": 94,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 30.5,
      "waterUsageLiters": 111,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-1705",
    "name": "Căn Hộ Quận 3 Deluxe Apartment SG-QUN-1705",
    "floor": 17,
    "unitNumber": "1705",
    "type": "Deluxe Apartment",
    "sqm": 92,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 27000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 3",
    "address": "74 Nam Kỳ Khởi Nghĩa, Phường An Cư, Quận 3, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 3",
    "aiInsights": {
      "whyFit": [
        "Mức giá 27 Triệu/tháng tương thích hoàn hảo với khu vực Quận 3",
        "Căn hộ tầng 17 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 3",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 3.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1102,
    "images": [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.77,
    "reviewCount": 27,
    "sensors": {
      "smartLockBattery": 95,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 31.5,
      "waterUsageLiters": 112,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-1806",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-1806",
    "floor": 18,
    "unitNumber": "1806",
    "type": "Deluxe Apartment",
    "sqm": 93,
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 28000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "117 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 28 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 18 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1143,
    "images": [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.78,
    "reviewCount": 28,
    "sensors": {
      "smartLockBattery": 96,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 32.5,
      "waterUsageLiters": 113,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-TYH-1907",
    "name": "Căn Hộ Tây Hồ Deluxe Apartment HN-TYH-1907",
    "floor": 19,
    "unitNumber": "1907",
    "type": "Deluxe Apartment",
    "sqm": 94,
    "bedrooms": 2,
    "bathrooms": 2,
    "status": "vacant",
    "monthlyRentVND": 29000000,
    "city": "Hanoi",
    "district": "Tây Hồ",
    "address": "20 Xuân Diệu, Phường Trung Tâm, Quận Tây Hồ, Hà Nội",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Hồ Tây & Công Viên Cây Xanh Tây Hồ",
    "aiInsights": {
      "whyFit": [
        "Mức giá 29 Triệu/tháng tương thích hoàn hảo với khu vực Tây Hồ",
        "Căn hộ tầng 19 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Tây Hồ",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Tây Hồ.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 1184,
    "images": [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.79,
    "reviewCount": 29,
    "sensors": {
      "smartLockBattery": 97,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 33.5,
      "waterUsageLiters": 114,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-1308",
    "name": "Căn Hộ Quận 1 Deluxe Apartment SG-QUN-1308",
    "floor": 13,
    "unitNumber": "1308",
    "type": "Deluxe Apartment",
    "sqm": 50,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 14000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 1",
    "address": "107 Ung Văn Khiêm, Phường An Cư, Quận 1, TP. Hồ Chí Minh",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Khu Đô Thị Sinh Thái Quận 1",
    "aiInsights": {
      "whyFit": [
        "Mức giá 14 Triệu/tháng tương thích hoàn hảo với khu vực Quận 1",
        "Căn hộ tầng 13 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 1",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 1.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 571,
    "images": [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.8,
    "reviewCount": 30,
    "sensors": {
      "smartLockBattery": 98,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 34.5,
      "waterUsageLiters": 115,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-1401",
    "name": "Căn Hộ Ngũ Hành Sơn Deluxe Apartment DN-NGH-1401",
    "floor": 14,
    "unitNumber": "1401",
    "type": "Deluxe Apartment",
    "sqm": 51,
    "bedrooms": 1,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 8000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "132 Phan Chu Trinh, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Bờ Biển Mỹ Khê & Bán Đảo Sơn Trà",
    "aiInsights": {
      "whyFit": [
        "Mức giá 8 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 14 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 327,
    "images": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.81,
    "reviewCount": 31,
    "sensors": {
      "smartLockBattery": 85,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 35.5,
      "waterUsageLiters": 116,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "HN-HON-1502",
    "name": "Căn Hộ Hoàn Kiếm Deluxe Apartment HN-HON-1502",
    "floor": 15,
    "unitNumber": "1502",
    "type": "Deluxe Apartment",
    "sqm": 52,
    "bedrooms": 2,
    "bathrooms": 1,
    "status": "vacant",
    "monthlyRentVND": 9000000,
    "city": "Hanoi",
    "district": "Hoàn Kiếm",
    "address": "41 Trần Duy Hưng, Phường Trung Tâm, Quận Hoàn Kiếm, Hà Nội",
    "hasCarParking": false,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": false,
    "viewType": "Toàn Cảnh Thành Phố & Trục Đường Trần Duy Hưng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 9 Triệu/tháng tương thích hoàn hảo với khu vực Hoàn Kiếm",
        "Căn hộ tầng 15 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Chỗ đỗ xe máy thuận tiện, quản lý an ninh thẻ từ 24/7"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Hoàn Kiếm",
        "Thuận tiện di chuyển thang bộ khi cần"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Hoàn Kiếm.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 367,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.82,
    "reviewCount": 32,
    "sensors": {
      "smartLockBattery": 86,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 36.5,
      "waterUsageLiters": 117,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "SG-QUN-2203",
    "name": "Căn Hộ Quận 7 Executive Suite SG-QUN-2203",
    "floor": 22,
    "unitNumber": "2203",
    "type": "Executive Suite",
    "sqm": 188,
    "bedrooms": 3,
    "bathrooms": 3,
    "status": "vacant",
    "monthlyRentVND": 53000000,
    "city": "Ho Chi Minh City",
    "district": "Quận 7",
    "address": "140 Xuân Thủy, Phường An Cư, Quận 7, TP. Hồ Chí Minh",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Sông Sài Gòn & Skyline Quận 7",
    "aiInsights": {
      "whyFit": [
        "Mức giá 53 Triệu/tháng tương thích hoàn hảo với khu vực Quận 7",
        "Căn hộ tầng 22 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Quận 7",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Quận 7.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 2163,
    "images": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.83,
    "reviewCount": 33,
    "sensors": {
      "smartLockBattery": 87,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 37.5,
      "waterUsageLiters": 118,
      "securityAlarmDisarmed": true
    }
  },
  {
    "id": "DN-NGH-2304",
    "name": "Căn Hộ Ngũ Hành Sơn Executive Suite DN-NGH-2304",
    "floor": 23,
    "unitNumber": "2304",
    "type": "Executive Suite",
    "sqm": 189,
    "bedrooms": 4,
    "bathrooms": 4,
    "status": "vacant",
    "monthlyRentVND": 54000000,
    "city": "Da Nang",
    "district": "Ngũ Hành Sơn",
    "address": "147 Lê Duẩn, Phường Phước Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    "hasCarParking": true,
    "hasMotorbikeParking": true,
    "hasElevator": true,
    "hasBackupPower": true,
    "floodingRisk": "Low",
    "noiseLevel": "Quiet",
    "trafficDensity": "Moderate",
    "petFriendly": true,
    "viewType": "Cầu Sông Hàn & Vịnh Đà Nẵng",
    "aiInsights": {
      "whyFit": [
        "Mức giá 54 Triệu/tháng tương thích hoàn hảo với khu vực Ngũ Hành Sơn",
        "Căn hộ tầng 23 view thoáng đãng, đón ánh sáng tự nhiên và gió trời trong lành",
        "Có sẵn chỗ đỗ ô tô hầm thông minh và sạc xe điện EV"
      ],
      "worthConsidering": [
        "Phí dịch vụ quản lý tòa nhà tiêu chuẩn theo niêm yết ban quản trị Ngũ Hành Sơn",
        "Tầng cao thoáng mát cần lưu ý khóa chốt an toàn ban công"
      ]
    },
    "environmentalData": {
      "weatherNotes": "Đón gió đối lưu tự nhiên, không khí trong lành tại khu vực Ngũ Hành Sơn.",
      "floodNotes": "Khu vực cốt nền cao ráo, cống thoát nước ngầm vận hành ổn định không đọng nước.",
      "powerNotes": "Máy phát điện dự phòng 100% công suất đảm bảo thang máy và chiếu sáng 24/7.",
      "trafficNotes": "Đường giao thông thuận lợi, kết nối các trục đường chính và tiện ích xung quanh trong bán kính 500m."
    },
    "monthlyRentUSD": 2204,
    "images": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"
    ],
    "furnished": true,
    "balcony": true,
    "airConditioning": true,
    "washingMachine": true,
    "kitchen": true,
    "wifi": true,
    "rating": 4.84,
    "reviewCount": 34,
    "sensors": {
      "smartLockBattery": 88,
      "hvacStatus": "Optimal",
      "targetTempC": 22,
      "energyConsumptionKwh": 38.5,
      "waterUsageLiters": 119,
      "securityAlarmDisarmed": true
    }
  }
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TKT-8092',
    unitId: 'HN-TH-2401',
    residentName: 'Alexander Vance',
    category: 'Smart Lock',
    title: 'Kiểm tra pin khóa thông minh & hiệu chuẩn cảm biến thẻ từ',
    priority: 'Urgent',
    status: 'In Progress',
    reportedAt: '10 phút trước',
    assignedTechnician: 'Nguyễn Văn Minh (Chuyên viên IoT)'
  },
  {
    id: 'TKT-8088',
    unitId: 'SG-D1-1601',
    residentName: 'Elena Rostova',
    category: 'HVAC',
    title: 'Bảo dưỡng định kỳ màng lọc khí tươi điều hòa trung tâm VRV',
    priority: 'Medium',
    status: 'Open',
    reportedAt: '2 giờ trước'
  }
];

export const MOCK_AMENITIES: Amenity[] = [
  {
    id: 'am-01',
    name: 'Hồ Bơi Vô Cực Chân Mây & Lounge',
    location: 'Tầng Thượng — Tầng 25',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    capacity: 20,
    openingHours: '06:00 - 23:00',
    pricePerHourUSD: 0,
    availableSlotsToday: ['09:00 - 11:00', '14:00 - 16:00', '18:30 - 20:30', '21:00 - 23:00']
  },
  {
    id: 'am-02',
    name: 'Hầm Rượu Vang & Phòng Tiếp Khách VIP',
    location: 'Khu Điều Hành — Tầng 18',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    capacity: 12,
    openingHours: '16:00 - 02:00',
    pricePerHourUSD: 150,
    availableSlotsToday: ['17:00 - 19:00', '20:00 - 22:00', '22:30 - 00:30']
  },
  {
    id: 'am-03',
    name: 'Rạp Chiếu Phim Riêng Tư Dolby Atmos',
    location: 'Tầng Giải Trí — Tầng 2',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600',
    capacity: 16,
    openingHours: '10:00 - 00:00',
    pricePerHourUSD: 80,
    availableSlotsToday: ['13:00 - 15:30', '16:00 - 18:30', '19:00 - 21:30', '22:00 - 00:30']
  }
];
