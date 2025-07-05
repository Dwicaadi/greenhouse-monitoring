// API Configuration for Frontend
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-iot.wibudev.moe',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  environment: import.meta.env.VITE_ENVIRONMENT || 'production',
  appName: import.meta.env.VITE_APP_NAME || 'Greenhouse Monitoring',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

// API endpoints
export const API_ENDPOINTS = {
  // Base
  root: '/',
  apiGateway: '/api',
  
  // Test
  test: '/api/test',
  
  // Sensor data
  sensorLatest: '/api/sensor/latest',
  sensorHistory: '/api/sensor/history', 
  sensorData: '/api/sensor/data',
  
  // Fan control
  fanStatus: '/api/fan/status',
  fanControl: '/api/fan/control',
  fanArduino: '/api/fan/arduino',
  
  // Settings
  settings: '/api/settings',
  
  // Dashboard
  dashboard: '/api/dashboard',
  
  // Auth (jika diperlukan)
  authLogin: '/api/auth/login',
  authRegister: '/api/auth/register', 
  authCheck: '/api/auth/check'
};

// Create full URL
export const createApiUrl = (endpoint) => {
  const baseUrl = config.apiBaseUrl.endsWith('/') 
    ? config.apiBaseUrl.slice(0, -1) 
    : config.apiBaseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return baseUrl + cleanEndpoint;
};

// Helper to check if API is available
export const checkApiHealth = async () => {
  try {
    const response = await fetch(createApiUrl(API_ENDPOINTS.test), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      healthy: true,
      data: data,
      url: createApiUrl(API_ENDPOINTS.test)
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      url: createApiUrl(API_ENDPOINTS.test)
    };
  }
};

console.log('🔧 API Configuration:', {
  baseUrl: config.apiBaseUrl,
  environment: config.environment,
  testEndpoint: createApiUrl(API_ENDPOINTS.test)
});

export default config;
