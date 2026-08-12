import type { ApartmentUnit, MaintenanceTicket, Amenity } from '../types/apartment';

export const MOCK_UNITS: ApartmentUnit[] = [
  {
    id: 'PH-2401',
    floor: 24,
    unitNumber: '2401',
    type: 'Penthouse',
    sqm: 380,
    bedrooms: 4,
    bathrooms: 4.5,
    status: 'occupied',
    monthlyRentUSD: 14500,
    viewType: 'Ocean Skyline',
    resident: {
      id: 'res-01',
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 234-8901',
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
    floor: 24,
    unitNumber: '2402',
    type: 'Penthouse',
    sqm: 410,
    bedrooms: 5,
    bathrooms: 5,
    status: 'vacant',
    monthlyRentUSD: 16800,
    viewType: 'City Sunset',
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
    floor: 20,
    unitNumber: '2001',
    type: 'Sky Villa',
    sqm: 240,
    bedrooms: 3,
    bathrooms: 3,
    status: 'occupied',
    monthlyRentUSD: 8900,
    viewType: 'Ocean Skyline',
    resident: {
      id: 'res-02',
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 889-1204',
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
  },
  {
    id: 'SV-2002',
    floor: 20,
    unitNumber: '2002',
    type: 'Sky Villa',
    sqm: 235,
    bedrooms: 3,
    bathrooms: 3,
    status: 'maintenance',
    monthlyRentUSD: 8750,
    viewType: 'Park Horizon',
    resident: {
      id: 'res-03',
      name: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 432-9900',
      email: 'm.sterling@capital.com',
      moveInDate: '2024-03-10',
      leaseEnd: '2026-03-09',
      monthlyRentUSD: 8750,
      autoPayActive: false,
      occupantsCount: 3
    },
    sensors: {
      smartLockBattery: 42,
      hvacStatus: 'Optimal',
      targetTempC: 22.0,
      energyConsumptionKwh: 18.2,
      waterUsageLiters: 90,
      securityAlarmDisarmed: false
    }
  },
  {
    id: 'EX-1601',
    floor: 16,
    unitNumber: '1601',
    type: 'Executive Suite',
    sqm: 160,
    bedrooms: 2,
    bathrooms: 2,
    status: 'occupied',
    monthlyRentUSD: 5600,
    viewType: 'River Bend',
    resident: {
      id: 'res-04',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 671-0099',
      email: 'elena.rostova@ballet.org',
      moveInDate: '2024-01-01',
      leaseEnd: '2026-12-31',
      monthlyRentUSD: 5600,
      autoPayActive: true,
      occupantsCount: 2
    },
    sensors: {
      smartLockBattery: 76,
      hvacStatus: 'Cooling',
      targetTempC: 21.0,
      energyConsumptionKwh: 21.3,
      waterUsageLiters: 95,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'EX-1602',
    floor: 16,
    unitNumber: '1602',
    type: 'Executive Suite',
    sqm: 155,
    bedrooms: 2,
    bathrooms: 2,
    status: 'reserved',
    monthlyRentUSD: 5450,
    viewType: 'City Sunset',
    sensors: {
      smartLockBattery: 99,
      hvacStatus: 'Standby',
      targetTempC: 24.0,
      energyConsumptionKwh: 2.1,
      waterUsageLiters: 0,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'DL-1201',
    floor: 12,
    unitNumber: '1201',
    type: 'Deluxe Apartment',
    sqm: 110,
    bedrooms: 1,
    bathrooms: 1.5,
    status: 'occupied',
    monthlyRentUSD: 3900,
    viewType: 'Park Horizon',
    resident: {
      id: 'res-05',
      name: 'David & Hannah Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 902-1144',
      email: 'david.m@architects.com',
      moveInDate: '2023-11-15',
      leaseEnd: '2026-11-14',
      monthlyRentUSD: 3900,
      autoPayActive: true,
      occupantsCount: 2
    },
    sensors: {
      smartLockBattery: 91,
      hvacStatus: 'Optimal',
      targetTempC: 22.0,
      energyConsumptionKwh: 15.6,
      waterUsageLiters: 80,
      securityAlarmDisarmed: true
    }
  },
  {
    id: 'DL-1202',
    floor: 12,
    unitNumber: '1202',
    type: 'Deluxe Apartment',
    sqm: 115,
    bedrooms: 1,
    bathrooms: 1.5,
    status: 'vacant',
    monthlyRentUSD: 4100,
    viewType: 'Ocean Skyline',
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
    id: 'DL-0801',
    floor: 8,
    unitNumber: '0801',
    type: 'Deluxe Apartment',
    sqm: 105,
    bedrooms: 1,
    bathrooms: 1,
    status: 'occupied',
    monthlyRentUSD: 3600,
    viewType: 'River Bend',
    resident: {
      id: 'res-06',
      name: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 304-9812',
      email: 'kenji@robotics-ai.jp',
      moveInDate: '2024-04-01',
      leaseEnd: '2027-03-31',
      monthlyRentUSD: 3600,
      autoPayActive: true,
      occupantsCount: 1
    },
    sensors: {
      smartLockBattery: 88,
      hvacStatus: 'Heating',
      targetTempC: 22.5,
      energyConsumptionKwh: 19.4,
      waterUsageLiters: 70,
      securityAlarmDisarmed: true
    }
  }
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TKT-8092',
    unitId: 'SV-2002',
    residentName: 'Marcus Sterling',
    category: 'Smart Lock',
    title: 'Smart lock battery below 45% & occasional keycard latency',
    priority: 'Urgent',
    status: 'In Progress',
    reportedAt: '10 mins ago',
    assignedTechnician: 'Carlos Diaz (Master IoT Specialist)'
  },
  {
    id: 'TKT-8088',
    unitId: 'EX-1601',
    residentName: 'Elena Rostova',
    category: 'HVAC',
    title: 'Annual filter replacement & climate sensor recalibration',
    priority: 'Medium',
    status: 'Open',
    reportedAt: '2 hours ago'
  },
  {
    id: 'TKT-8075',
    unitId: 'PH-2401',
    residentName: 'Alexander Vance',
    category: 'Appliance',
    title: 'Wine cooler ambient temperature fine-tuning request',
    priority: 'Low',
    status: 'Resolved',
    reportedAt: 'Yesterday',
    assignedTechnician: 'Lucas Vance'
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
