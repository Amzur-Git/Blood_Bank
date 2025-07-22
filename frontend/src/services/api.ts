import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  User, 
  ApiResponse, 
  BloodAvailability, 
  BloodInventory,
  BloodInventoryStats,
  CityBloodSummary,
  Hospital, 
  BloodBank, 
  BloodRequest, 
  SearchFilters,
  PaginatedResponse,
  City
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: RegisterData): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> {
    return this.api.post('/auth/register', userData);
  }

  async logout(): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AxiosResponse<ApiResponse<User>>> {
    return this.api.get('/auth/me');
  }

  // Blood availability endpoints
  async getBloodAvailability(filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<BloodAvailability[]>>> {
    return this.api.get('/blood-inventory/availability', { params: filters });
  }

  async getEmergencyBloodAvailability(bloodType: string, cityId: string): Promise<AxiosResponse<ApiResponse<BloodAvailability[]>>> {
    return this.api.get('/blood-inventory/emergency/availability', { params: { blood_type: bloodType, city_id: cityId } });
  }

  // Hospital endpoints
  async getHospitals(filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Hospital>>>> {
    return this.api.get('/hospitals', { params: filters });
  }

  async getHospitalById(id: string): Promise<AxiosResponse<ApiResponse<Hospital>>> {
    return this.api.get(`/hospitals/${id}`);
  }

  async createHospital(hospitalData: Partial<Hospital>): Promise<AxiosResponse<ApiResponse<Hospital>>> {
    return this.api.post('/hospitals', hospitalData);
  }

  async updateHospital(id: string, hospitalData: Partial<Hospital>): Promise<AxiosResponse<ApiResponse<Hospital>>> {
    return this.api.put(`/hospitals/${id}`, hospitalData);
  }

  async deleteHospital(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/hospitals/${id}`);
  }

  // Blood bank endpoints
  async getBloodBanks(filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginatedResponse<BloodBank>>>> {
    return this.api.get('/blood-banks', { params: filters });
  }

  async getBloodBankById(id: string): Promise<AxiosResponse<ApiResponse<BloodBank>>> {
    return this.api.get(`/blood-banks/${id}`);
  }

  async createBloodBank(bloodBankData: Partial<BloodBank>): Promise<AxiosResponse<ApiResponse<BloodBank>>> {
    return this.api.post('/blood-banks', bloodBankData);
  }

  async updateBloodBank(id: string, bloodBankData: Partial<BloodBank>): Promise<AxiosResponse<ApiResponse<BloodBank>>> {
    return this.api.put(`/blood-banks/${id}`, bloodBankData);
  }

  async deleteBloodBank(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/blood-banks/${id}`);
  }

  // Blood request endpoints
  async getBloodRequests(filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginatedResponse<BloodRequest>>>> {
    return this.api.get('/blood-requests', { params: filters });
  }

  async getBloodRequestById(id: string): Promise<AxiosResponse<ApiResponse<BloodRequest>>> {
    return this.api.get(`/blood-requests/${id}`);
  }

  async createBloodRequest(requestData: Partial<BloodRequest>): Promise<AxiosResponse<ApiResponse<BloodRequest>>> {
    return this.api.post('/blood-requests', requestData);
  }

  async updateBloodRequest(id: string, requestData: Partial<BloodRequest>): Promise<AxiosResponse<ApiResponse<BloodRequest>>> {
    return this.api.put(`/blood-requests/${id}`, requestData);
  }

  async deleteBloodRequest(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/blood-requests/${id}`);
  }

  async updateBloodRequestStatus(id: string, status: string): Promise<AxiosResponse<ApiResponse<BloodRequest>>> {
    return this.api.patch(`/blood-requests/${id}/status`, { status });
  }

  // City endpoints
  async getCities(): Promise<AxiosResponse<ApiResponse<City[]>>> {
    return this.api.get('/cities');
  }

  async getCityById(id: string): Promise<AxiosResponse<ApiResponse<City>>> {
    return this.api.get(`/cities/${id}`);
  }

  // Blood inventory endpoints
  async updateBloodInventory(inventoryId: string, updateData: { quantity: number; cost_per_unit?: number; is_free?: boolean; expiry_date?: string }): Promise<AxiosResponse<ApiResponse<BloodInventory>>> {
    return this.api.put(`/blood-inventory/${inventoryId}`, updateData);
  }

  async getBloodInventory(bloodBankId: string): Promise<AxiosResponse<ApiResponse<BloodInventory[]>>> {
    return this.api.get(`/blood-inventory/blood-bank/${bloodBankId}`);
  }

  async createBloodInventory(inventoryData: { blood_bank_id: string; blood_type: string; quantity: number; cost_per_unit?: number; is_free?: boolean; expiry_date?: string }): Promise<AxiosResponse<ApiResponse<BloodInventory>>> {
    return this.api.post('/blood-inventory', inventoryData);
  }

  async getBloodBankStats(bloodBankId: string): Promise<AxiosResponse<ApiResponse<BloodInventoryStats>>> {
    return this.api.get(`/blood-inventory/blood-bank/${bloodBankId}/stats`);
  }

  async getCityBloodSummary(cityId: string): Promise<AxiosResponse<ApiResponse<CityBloodSummary>>> {
    return this.api.get(`/blood-inventory/city/${cityId}/summary`);
  }

  async getExpiredBloodInventory(bloodBankId?: string): Promise<AxiosResponse<ApiResponse<BloodInventory[]>>> {
    return this.api.get('/blood-inventory/expired', { params: { blood_bank_id: bloodBankId } });
  }

  async getLowStockAlerts(): Promise<AxiosResponse<ApiResponse<BloodInventory[]>>> {
    return this.api.get('/blood-inventory/low-stock');
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export individual API services
export const authAPI = {
  login: apiService.login.bind(apiService),
  register: apiService.register.bind(apiService),
  logout: apiService.logout.bind(apiService),
  getCurrentUser: apiService.getCurrentUser.bind(apiService),
};

export const bloodAvailabilityAPI = {
  getBloodAvailability: apiService.getBloodAvailability.bind(apiService),
  getEmergencyBloodAvailability: apiService.getEmergencyBloodAvailability.bind(apiService),
};

export const hospitalAPI = {
  getHospitals: apiService.getHospitals.bind(apiService),
  getHospitalById: apiService.getHospitalById.bind(apiService),
  createHospital: apiService.createHospital.bind(apiService),
  updateHospital: apiService.updateHospital.bind(apiService),
  deleteHospital: apiService.deleteHospital.bind(apiService),
};

export const bloodBankAPI = {
  getBloodBanks: apiService.getBloodBanks.bind(apiService),
  getBloodBankById: apiService.getBloodBankById.bind(apiService),
  createBloodBank: apiService.createBloodBank.bind(apiService),
  updateBloodBank: apiService.updateBloodBank.bind(apiService),
  deleteBloodBank: apiService.deleteBloodBank.bind(apiService),
  updateBloodInventory: apiService.updateBloodInventory.bind(apiService),
  getBloodInventory: apiService.getBloodInventory.bind(apiService),
};

export const bloodInventoryAPI = {
  updateBloodInventory: apiService.updateBloodInventory.bind(apiService),
  getBloodInventory: apiService.getBloodInventory.bind(apiService),
  createBloodInventory: apiService.createBloodInventory.bind(apiService),
  getBloodBankStats: apiService.getBloodBankStats.bind(apiService),
  getCityBloodSummary: apiService.getCityBloodSummary.bind(apiService),
  getExpiredBloodInventory: apiService.getExpiredBloodInventory.bind(apiService),
  getLowStockAlerts: apiService.getLowStockAlerts.bind(apiService),
};

export const bloodRequestAPI = {
  getBloodRequests: apiService.getBloodRequests.bind(apiService),
  getBloodRequestById: apiService.getBloodRequestById.bind(apiService),
  createBloodRequest: apiService.createBloodRequest.bind(apiService),
  updateBloodRequest: apiService.updateBloodRequest.bind(apiService),
  deleteBloodRequest: apiService.deleteBloodRequest.bind(apiService),
  updateBloodRequestStatus: apiService.updateBloodRequestStatus.bind(apiService),
};

export const cityAPI = {
  getCities: apiService.getCities.bind(apiService),
  getCityById: apiService.getCityById.bind(apiService),
};

export default apiService;
