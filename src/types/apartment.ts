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

export interface ApartmentUnit {
  id: string; // e.g. "PH-2401", "SK-2002", "EX-1403"
  floor: number;
  unitNumber: string;
  type: UnitType;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  status: UnitStatus;
  monthlyRentUSD: number;
  resident?: Resident;
  sensors: IoTSensors;
  viewType: 'Ocean Skyline' | 'City Sunset' | 'Park Horizon' | 'River Bend';
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
