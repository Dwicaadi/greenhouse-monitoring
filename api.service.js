// API Service using Axios
import axios from 'axios';
import config, { createApiUrl, API_ENDPOINTS } from './api.config.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important untuk session/cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// API service methods
export const api = {
  // Health check
  test: () => apiClient.get(API_ENDPOINTS.test),
  
  // Sensor data methods
  sensor: {
    getLatest: (roomId = 1) => 
      apiClient.get(`${API_ENDPOINTS.sensorLatest}?room_id=${roomId}`),
    
    getHistory: (roomId = 1, limit = 10) => 
      apiClient.get(`${API_ENDPOINTS.sensorHistory}?room_id=${roomId}&limit=${limit}`),
    
    postData: (data) => 
      apiClient.post(API_ENDPOINTS.sensorData, data)
  },
  
  // Fan control methods
  fan: {
    getStatus: (roomId = 1) => 
      apiClient.get(`${API_ENDPOINTS.fanStatus}?room_id=${roomId}`),
    
    setControl: (data) => 
      apiClient.put(API_ENDPOINTS.fanControl, data),
    
    getForArduino: (roomId = 1) => 
      apiClient.get(`${API_ENDPOINTS.fanArduino}?room_id=${roomId}`)
  },
  
  // Settings methods
  settings: {
    get: (roomId = 1) => 
      apiClient.get(`${API_ENDPOINTS.settings}?room_id=${roomId}`),
    
    update: (data) => 
      apiClient.put(API_ENDPOINTS.settings, data)
  },
  
  // Dashboard
  dashboard: {
    getData: () => apiClient.get(API_ENDPOINTS.dashboard)
  },
  
  // Auth methods (jika diperlukan)
  auth: {
    login: (credentials) => 
      apiClient.post(API_ENDPOINTS.authLogin, credentials),
    
    register: (userData) => 
      apiClient.post(API_ENDPOINTS.authRegister, userData),
    
    check: () => 
      apiClient.get(API_ENDPOINTS.authCheck)
  }
};

// Utility function untuk error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      type: 'response_error',
      status: error.response.status,
      message: error.response.data?.message || error.response.statusText,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      type: 'network_error', 
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      originalError: error.message
    };
  } else {
    // Something else happened
    return {
      type: 'unknown_error',
      message: error.message || 'Terjadi kesalahan yang tidak diketahui'
    };
  }
};

// Export default
export default apiClient;
