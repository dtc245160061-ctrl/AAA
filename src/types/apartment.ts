export type UnitStatus = 'occupied' | 'vacant' | 'maintenance' | 'reserved';
export type UnitType = 'Penthouse' | 'Sky Villa' | 'Executive Suite' | 'Deluxe Apartment';

export interface Resident {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  moveInDate: string;
  leaseEnd: string;
  monthlyRentUSD: number;
  autoPayActive: boolean;
  occupantsCount: number;
}

export interface IoTSensors {
  smartLockBattery: number; // percentage
  hvacStatus: 'Optimal' | 'Cooling' | 'Heating' | 'Standby';
  targetTempC: number;
  energyConsumptionKwh: number;
  waterUsageLiters: number;
  securityAlarmDisarmed: boolean;
}

export interface EnvironmentalData {
  weatherNotes: string;
  floodNotes: string;
  powerNotes: string;
  trafficNotes: string;
}

export interface AIInsights {
  whyFit: string[];
  worthConsidering: string[];
}

export interface ApartmentUnit {
  id: string; // e.g. "HN-PH-01", "PH-2401", "SG-EX-02"
  name?: string; // Title e.g. "Tay Ho Westlake Botanical Penthouse"
  floor: number;
  unitNumber: string;
  type: UnitType;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  status: UnitStatus;
  monthlyRentUSD: number;
  monthlyRentVND: number;
  city: 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang';
  district: string;
  address?: string;
  images: string[];
  hasCarParking: boolean;
  hasMotorbikeParking: boolean;
  hasElevator: boolean;
  hasBackupPower: boolean;
  floodingRisk: 'Low' | 'Moderate' | 'High';
  noiseLevel: 'Quiet' | 'Moderate' | 'Busy';
  trafficDensity: 'Low' | 'Moderate' | 'Heavy';
  petFriendly: boolean;
  furnished: boolean;
  balcony: boolean;
  airConditioning: boolean;
  washingMachine: boolean;
  kitchen: boolean;
  wifi: boolean;
  rating: number;
  reviewCount: number;
  aiInsights: AIInsights;
  environmentalData: EnvironmentalData;
  resident?: Resident;
  sensors: IoTSensors;
  viewType: 'Ocean Skyline' | 'City Sunset' | 'Park Horizon' | 'River Bend' | 'West Lake Panorama' | 'Hanoi Skyline' | 'Saigon River';
}

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  residentName: string;
  category: 'HVAC' | 'Plumbing' | 'Electrical' | 'Smart Lock' | 'Appliance';
  title: string;
  priority: 'Urgent' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedAt: string;
  assignedTechnician?: string;
}

export interface Amenity {
  id: string;
  name: string;
  location: string;
  image: string;
  capacity: number;
  openingHours: string;
  pricePerHourUSD: number;
  availableSlotsToday: string[];
}

