export type UnitStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';
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
  monthlyRentVND: number;
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
  id: string; // e.g. "HN-TH-2401", "SG-D1-1601"
  name?: string;
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
  viewType: string;
  isVerifiedPlus?: boolean; // VIP Boosted
}

export type LeadStatus = 'new' | 'contacted' | 'viewing_scheduled' | 'approved' | 'rejected' | 'converted';

export interface RentalLead {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  unitId: string;
  unitName: string;
  unitPriceVND: number;
  desiredMoveInDate: string;
  viewingDate?: string;
  notes?: string;
  createdAt: string;
  status: LeadStatus;
}

export type ContractStatus = 'active' | 'expiring_soon' | 'pending_signature' | 'terminated';

export interface LeaseContract {
  id: string;
  contractNumber: string;
  unitId: string;
  unitName: string;
  tenantName: string;
  tenantPhone: string;
  tenantIdCard: string;
  startDate: string;
  endDate: string;
  monthlyRentVND: number;
  depositVND: number;
  paymentCycleMonths: number;
  status: ContractStatus;
  termsSummary: string;
  createdAt: string;
  platformCommissionVND?: number; // HAVEN 50-100% first month
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface RentalInvoice {
  id: string;
  invoiceCode: string;
  unitId: string;
  unitName: string;
  tenantName: string;
  monthYear: string;
  rentAmountVND: number;
  serviceFeeVND: number;
  electricityWaterVND: number;
  totalAmountVND: number;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  platformTakeRateVND?: number; // 5% SaaS management fee
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

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency' | 'Urgent';
  createdAt?: string;
  reportedAt?: string;
  category: string;
  residentName?: string;
  assignedTechnician?: string;
}

// ----------------------------------------------------
// NEW PROPTECH MODELS: CHAT, SAAS SUBSCRIPTION, VAS
// ----------------------------------------------------

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'landlord' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  isQuickReply?: boolean;
}

export interface ChatConversation {
  id: string;
  unitId: string;
  unitName: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  status: 'active' | 'archived';
  messages: ChatMessage[];
}

export type SubscriptionTier = 'starter' | 'pro' | 'enterprise' | 'resident_prime';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  targetAudience: 'landlord' | 'tenant';
  name: string;
  tagline: string;
  priceVND: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface AddonService {
  id: string;
  title: string;
  category: 'cleaning' | 'moving' | 'smart_home' | 'insurance';
  description: string;
  priceVND: number;
  unitLabel: string;
  duration?: string;
  iconName: string;
  popular?: boolean;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
  unitId: string;
  scheduledDate: string;
  priceVND: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
