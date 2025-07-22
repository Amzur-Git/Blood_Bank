// Types for the application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'HOSPITAL_STAFF' | 'BLOOD_BANK_STAFF' | 'DOCTOR' | 'PATIENT';
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: City;
  contactNumber: string[];
  email: string;
  emergencyNumber: string;
  licenseNumber: string;
  websiteUrl?: string;
  totalBeds: number;
  availableBeds: number;
  hasBloodBank: boolean;
  hasEmergencyServices: boolean;
  has24x7Service: boolean;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'CLOSED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  city: City;
  hospital?: Hospital;
  contactNumber: string[];
  email: string;
  emergencyNumber: string;
  licenseNumber: string;
  operatingHours: string;
  isFreeService: boolean;
  isGovtCertified: boolean;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'CLOSED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BloodInventory {
  id: string;
  bloodBank: BloodBank;
  bloodType: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  unitsAvailable: number;
  unitPrice: number;
  expiryDate: string;
  lastUpdated: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  hospital: Hospital;
  consultationFee: number;
  experience: number;
  availableTimings: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bloodType: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  email?: string;
  address: string;
  city: City;
  emergencyContact: string;
  emergencyContactRelation: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  patient: Patient;
  bloodType: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  unitsRequired: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hospital: Hospital;
  requestingDoctor: Doctor;
  requiredByDate: string;
  medicalReason: string;
  additionalNotes?: string;
  status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface BloodInventory {
  id: string;
  blood_bank_id: string;
  blood_type: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  quantity: number;
  cost_per_unit: number;
  is_free: boolean;
  expiry_date?: string;
  availability_status: 'AVAILABLE' | 'LIMITED' | 'CRITICAL' | 'UNAVAILABLE';
  last_updated: string;
  updated_by?: string;
  blood_bank?: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface BloodInventoryStats {
  totalBloodTypes: number;
  inventoryByType: Record<string, {
    quantity: number;
    status: string;
  }>;
  lastUpdated: string;
}

export interface CityBloodSummary {
  cityId: string;
  totalBloodBanks: number;
  bloodTypesSummary: Record<string, {
    total_quantity: number;
    blood_banks: number;
    available_count: number;
  }>;
  lastUpdated: string;
}

export interface BloodAvailability {
  id: string;
  name: string;
  address: string;
  phone: string;
  emergency_phone?: string;
  is_24x7: boolean;
  distance?: number;
  blood_inventory: {
    blood_type: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
    quantity: number;
    cost_per_unit: number;
    is_free: boolean;
    availability_status: 'AVAILABLE' | 'LIMITED' | 'CRITICAL' | 'UNAVAILABLE';
    last_updated: string;
  }[];
  hospital?: {
    name: string;
    phone: string;
    is_government: boolean;
  };
  city: {
    name: string;
    state: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'HOSPITAL_STAFF' | 'BLOOD_BANK_STAFF' | 'DOCTOR' | 'PATIENT';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface BloodAvailabilityState {
  availabilities: BloodAvailability[];
  isLoading: boolean;
  error: string | null;
}

export interface HospitalState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  isLoading: boolean;
  error: string | null;
}

export interface BloodBankState {
  bloodBanks: BloodBank[];
  selectedBloodBank: BloodBank | null;
  isLoading: boolean;
  error: string | null;
}

export interface BloodRequestState {
  requests: BloodRequest[];
  selectedRequest: BloodRequest | null;
  isLoading: boolean;
  error: string | null;
}

export interface SearchFilters {
  cityId?: string;
  bloodType?: string;
  urgencyLevel?: string;
  availabilityStatus?: string;
  isFreeService?: boolean;
  hasEmergencyServices?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface RootState {
  auth: AuthState;
  bloodAvailability: BloodAvailabilityState;
  hospitals: HospitalState;
  bloodBanks: BloodBankState;
  bloodRequests: BloodRequestState;
  notifications: NotificationState;
}
