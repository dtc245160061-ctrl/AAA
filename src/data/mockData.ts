import type { ApartmentUnit, MaintenanceTicket, Amenity } from '../types/apartment';

export const MOCK_UNITS: ApartmentUnit[] = [
  {
    id: 'HN-TH-2401',
    name: 'Tay Ho Residence & Lakeview Penthouse',
    floor: 24,
    unitNumber: '2401',
    type: 'Penthouse',
    sqm: 380,
    bedrooms: 4,
    bathrooms: 4.5,
    status: 'vacant',
    monthlyRentUSD: 14500,
    monthlyRentVND: 350000000,
    city: 'Hanoi',
    district: 'Tay Ho',
    address: '58 Tu Hoa, Tay Ho District, Hanoi',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Low',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.98,
    reviewCount: 34,
    viewType: 'West Lake Panorama',
    aiInsights: {
      whyFit: [
        'Panoramic West Lake sunset view with private botanical terrace',
        'Dedicated basement car parking spot with EV charging',
        'High elevation (Floor 24) eliminates street traffic noise',
        '24/7 power generator protects against seasonal power cuts'
      ],
      worthConsidering: [
        'Premium price point reflecting luxury finishes',
        'Tay Ho narrow entry lane can experience minor weekend congestion'
      ]
    },
    environmentalData: {
      weatherNotes: 'Cooled by natural lake breezes; dual VRV climate system minimizes summer heat.',
      floodNotes: 'Elevated terrain along West Lake bank; zero historical street flooding recorded.',
      powerNotes: 'Equipped with dual Caterpillar backup generators guaranteeing 100% continuous power.',
      trafficNotes: 'Direct access to Au Co & Thanh Nien main arterial avenues.'
    },
    sensors: {
      smartLockBattery: 92,
      hvacStatus: 'Optimal',
      targetTempC: 21.5,
      energyConsumptionKwh: 42.8,
      waterUsageLiters: 180,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'HN-HK-1202',
    name: 'Hoan Kiem Modern Heritage Executive Suite',
    floor: 12,
    unitNumber: '1202',
    type: 'Executive Suite',
    sqm: 110,
    bedrooms: 2,
    bathrooms: 2,
    status: 'vacant',
    monthlyRentUSD: 650,
    monthlyRentVND: 16000000,
    city: 'Hanoi',
    district: 'Hoan Kiem',
    address: '18 Trang Thi, Hoan Kiem, Hanoi',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Moderate',
    trafficDensity: 'Heavy',
    petFriendly: false,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.88,
    reviewCount: 19,
    viewType: 'Hanoi Skyline',
    aiInsights: {
      whyFit: [
        'Fits target budget of ~16M VND/month in central Hoan Kiem',
        'Includes reserved basement car parking space',
        'Floor 12 provides insulation from Old Quarter ground traffic',
        'Within 5 minutes walk to Hoan Kiem Lake & financial tower'
      ],
      worthConsidering: [
        'Street traffic heavy during peak morning & evening hours',
        'Pets not permitted by building management policy'
      ]
    },
    environmentalData: {
      weatherNotes: 'Triple-glazed acoustic glass keeps interior silent and temperature controlled.',
      floodNotes: 'Main road drainage updated in 2024; well-drained during heavy monsoon rains.',
      powerNotes: 'Grid reliability high in central diplomatic sector; back-up power auto-triggers in 3s.',
      trafficNotes: 'Expect peak hour slowdowns near Trang Thi intersection.'
    },
    sensors: {
      smartLockBattery: 95,
      hvacStatus: 'Standby',
      targetTempC: 23.0,
      energyConsumptionKwh: 1.8,
      waterUsageLiters: 0,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'SG-D1-1601',
    name: 'District 1 Saigon River Executive Residence',
    floor: 16,
    unitNumber: '1601',
    type: 'Executive Suite',
    sqm: 155,
    bedrooms: 2,
    bathrooms: 2,
    status: 'vacant',
    monthlyRentUSD: 2200,
    monthlyRentVND: 54000000,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    address: '2 Ton Duc Thang, District 1, HCMC',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Moderate',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.95,
    reviewCount: 42,
    viewType: 'Saigon River',
    aiInsights: {
      whyFit: [
        'Direct frontage onto Saigon River with floor-to-ceiling glass',
        '24/7 security concierge & automated car lift system',
        'Walkable to Bitexco, Opera House & Metro Line 1 station'
      ],
      worthConsidering: [
        'Ton Duc Thang boulevard can be busy during rush hours'
      ]
    },
    environmentalData: {
      weatherNotes: 'Breeze from Saigon river reduces AC load; double low-E glass blocks tropical UV.',
      floodNotes: 'Built on anti-flood embankment infrastructure elevated 3 meters above high tide.',
      powerNotes: 'Dual-feed commercial power grid plus 100% backup diesel generators.',
      trafficNotes: 'Convenient riverfront access with underground parking portal.'
    },
    sensors: {
      smartLockBattery: 88,
      hvacStatus: 'Cooling',
      targetTempC: 22.0,
      energyConsumptionKwh: 24.5,
      waterUsageLiters: 110,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'SG-D2-0802',
    name: 'Thao Dien Botanical Garden Loft',
    floor: 8,
    unitNumber: '0802',
    type: 'Deluxe Apartment',
    sqm: 125,
    bedrooms: 2,
    bathrooms: 2,
    status: 'vacant',
    monthlyRentUSD: 1100,
    monthlyRentVND: 27000000,
    city: 'Ho Chi Minh City',
    district: 'Thu Duc / District 2',
    address: '15 Xuan Thuy, Thao Dien, Thu Duc City, HCMC',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Moderate',
    noiseLevel: 'Quiet',
    trafficDensity: 'Moderate',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.87,
    reviewCount: 28,
    viewType: 'Park Horizon',
    aiInsights: {
      whyFit: [
        'Spacious 125 sqm layout surrounded by lush Thao Dien greenery',
        'Pet-friendly residence with private dog park nearby',
        'Full car parking slot included'
      ],
      worthConsidering: [
        'Thao Dien lower streets can experience tidal water logging during king tides & heavy rain',
        'Check specific street entry route during September-October rainy season'
      ]
    },
    environmentalData: {
      weatherNotes: 'Surrounded by villa gardens; shaded and naturally cooler micro-climate.',
      floodNotes: 'Xuan Thuy street has newly upgraded pump station; parking garage elevated +1.5m.',
      powerNotes: 'Substation backed by dedicated transformer.',
      trafficNotes: '10 mins to Saigon Bridge and Metro Station #7.'
    },
    sensors: {
      smartLockBattery: 91,
      hvacStatus: 'Optimal',
      targetTempC: 22.5,
      energyConsumptionKwh: 14.2,
      waterUsageLiters: 90,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'DN-ST-2001',
    name: 'My Khe Beachfront Sky Villa',
    floor: 20,
    unitNumber: '2001',
    type: 'Sky Villa',
    sqm: 240,
    bedrooms: 3,
    bathrooms: 3,
    status: 'vacant',
    monthlyRentUSD: 1800,
    monthlyRentVND: 44000000,
    city: 'Da Nang',
    district: 'Son Tra',
    address: '298 Vo Nguyen Giap, Son Tra, Da Nang',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Low',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.99,
    reviewCount: 51,
    viewType: 'Ocean Skyline',
    aiInsights: {
      whyFit: [
        'Unobstructed ocean view directly facing My Khe Beach sand',
        'Large balcony with private jacuzzi and coastal breeze',
        'Very calm traffic and pristine coastal environment'
      ],
      worthConsidering: [
        'High humidity during coastal monsoon months (Nov-Dec)'
      ]
    },
    environmentalData: {
      weatherNotes: 'Fresh sea air; ocean breeze cools residence naturally.',
      floodNotes: 'Coastal sandy soil structure absorbs heavy downpours rapidly; no flood risk.',
      powerNotes: 'Grid supplemented by rooftop solar array & automatic backup generator.',
      trafficNotes: 'Wide coastal boulevard with smooth traffic year-round.'
    },
    sensors: {
      smartLockBattery: 97,
      hvacStatus: 'Optimal',
      targetTempC: 22.0,
      energyConsumptionKwh: 19.8,
      waterUsageLiters: 105,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'PH-2401',
    name: 'Grand Tower Ocean Penthouse PH-2401',
    floor: 24,
    unitNumber: '2401',
    type: 'Penthouse',
    sqm: 380,
    bedrooms: 4,
    bathrooms: 4.5,
    status: 'occupied',
    monthlyRentUSD: 14500,
    monthlyRentVND: 355000000,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    address: '1 Grand Promenade, District 1, HCMC',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Low',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.96,
    reviewCount: 18,
    viewType: 'Ocean Skyline',
    aiInsights: {
      whyFit: ['Penthouse luxury', 'Private elevator', '4 car spots'],
      worthConsidering: ['Currently occupied until lease cycle completes']
    },
    environmentalData: {
      weatherNotes: 'Optimal temperature regulation.',
      floodNotes: 'Zero flood risk.',
      powerNotes: '100% redundant generator.',
      trafficNotes: 'Dedicated VIP vehicle ramp.'
    },
    resident: {
      id: 'res-01',
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: '+84 90 234 8901',
      email: 'a.vance@vanceholdings.com',
      moveInDate: '2023-01-15',
      leaseEnd: '2027-01-14',
      monthlyRentUSD: 14500,
      autoPayActive: true,
      occupantsCount: 2
    },
    sensors: {
      smartLockBattery: 92,
      hvacStatus: 'Optimal',
      targetTempC: 21.5,
      energyConsumptionKwh: 42.8,
      waterUsageLiters: 180,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'PH-2402',
    name: 'Grand Tower Sunset Sky Villa PH-2402',
    floor: 24,
    unitNumber: '2402',
    type: 'Penthouse',
    sqm: 410,
    bedrooms: 5,
    bathrooms: 5,
    status: 'vacant',
    monthlyRentUSD: 16800,
    monthlyRentVND: 410000000,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    address: '1 Grand Promenade, District 1, HCMC',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Low',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.92,
    reviewCount: 14,
    viewType: 'City Sunset',
    aiInsights: {
      whyFit: ['Largest penthouse unit in tower', '5 master suites', 'Panoramic city sunset'],
      worthConsidering: ['High monthly energy footprint']
    },
    environmentalData: {
      weatherNotes: 'Sunset heat absorbed by Smart Tint glass.',
      floodNotes: 'Zero flood risk.',
      powerNotes: 'Dual grid input.',
      trafficNotes: 'VIP valet service available.'
    },
    sensors: {
      smartLockBattery: 98,
      hvacStatus: 'Standby',
      targetTempC: 23.0,
      energyConsumptionKwh: 5.2,
      waterUsageLiters: 0,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'SV-2001',
    name: 'Sky Villa Skyline SV-2001',
    floor: 20,
    unitNumber: '2001',
    type: 'Sky Villa',
    sqm: 240,
    bedrooms: 3,
    bathrooms: 3,
    status: 'occupied',
    monthlyRentUSD: 8900,
    monthlyRentVND: 218000000,
    city: 'Ho Chi Minh City',
    district: 'District 7',
    address: '100 Nguyen Luong Bang, District 7, HCMC',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    ],
    hasCarParking: true,
    hasMotorbikeParking: true,
    hasElevator: true,
    hasBackupPower: true,
    floodingRisk: 'Low',
    noiseLevel: 'Quiet',
    trafficDensity: 'Low',
    petFriendly: true,
    furnished: true,
    balcony: true,
    airConditioning: true,
    washingMachine: true,
    kitchen: true,
    wifi: true,
    rating: 4.89,
    reviewCount: 22,
    viewType: 'Ocean Skyline',
    aiInsights: {
      whyFit: ['Quiet Phu My Hung expat district', 'International school proximity'],
      worthConsidering: ['Bridge commute during rush hours']
    },
    environmentalData: {
      weatherNotes: 'Cool breeze from Saigon River.',
      floodNotes: 'Elevated district infrastructure.',
      powerNotes: 'Reliable substation.',
      trafficNotes: 'Wide avenues.'
    },
    resident: {
      id: 'res-02',
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      phone: '+84 98 889 1204',
      email: 'sophia.chen@techdesign.io',
      moveInDate: '2023-08-01',
      leaseEnd: '2026-07-31',
      monthlyRentUSD: 8900,
      autoPayActive: true,
      occupantsCount: 1
    },
    sensors: {
      smartLockBattery: 85,
      hvacStatus: 'Cooling',
      targetTempC: 20.0,
      energyConsumptionKwh: 28.4,
      waterUsageLiters: 120,
      securityAlarmDisarmed: true
    }
  }
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TKT-8092',
    unitId: 'HN-TH-2401',
    residentName: 'Alexander Vance',
    category: 'Smart Lock',
    title: 'Smart lock battery below 45% & keycard sensor calibration',
    priority: 'Urgent',
    status: 'In Progress',
    reportedAt: '10 mins ago',
    assignedTechnician: 'Carlos Diaz (Master IoT Specialist)'
  },
  {
    id: 'TKT-8088',
    unitId: 'SG-D1-1601',
    residentName: 'Elena Rostova',
    category: 'HVAC',
    title: 'Annual VRV climate filter replacement',
    priority: 'Medium',
    status: 'Open',
    reportedAt: '2 hours ago'
  }
];

export const MOCK_AMENITIES: Amenity[] = [
  {
    id: 'am-01',
    name: 'Skyline Infinity Pool & Lounge',
    location: 'Rooftop — 25th Floor',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    capacity: 20,
    openingHours: '06:00 - 23:00',
    pricePerHourUSD: 0,
    availableSlotsToday: ['09:00 - 11:00', '14:00 - 16:00', '18:30 - 20:30', '21:00 - 23:00']
  },
  {
    id: 'am-02',
    name: 'Private Sommelier Wine Cellar',
    location: 'Executive Hub — 18th Floor',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    capacity: 12,
    openingHours: '16:00 - 02:00',
    pricePerHourUSD: 150,
    availableSlotsToday: ['17:00 - 19:00', '20:00 - 22:00', '22:30 - 00:30']
  },
  {
    id: 'am-03',
    name: 'Dolby Atmos Private Theater',
    location: 'Entertainment Level — 2nd Floor',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600',
    capacity: 16,
    openingHours: '10:00 - 00:00',
    pricePerHourUSD: 80,
    availableSlotsToday: ['13:00 - 15:30', '16:00 - 18:30', '19:00 - 21:30', '22:00 - 00:30']
  }
];
