# 🚀 Frontend Deployment ke Vercel

## 📋 **Persiapan Frontend untuk Vercel**

### **1. Environment Variables untuk API**

Buat file `.env` di root project frontend:
```bash
# .env
VITE_API_BASE_URL=https://api-iot.wibudev.moe
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=production
```

Buat file `.env.local` untuk development:
```bash
# .env.local
VITE_API_BASE_URL=http://localhost/TA/backend
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=development
```

### **2. API Configuration File**

Buat `src/config/api.js`:
```javascript
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-iot.wibudev.moe',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  environment: import.meta.env.VITE_ENVIRONMENT || 'production'
};

// API endpoints
export const API_ENDPOINTS = {
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
  return config.apiBaseUrl + endpoint;
};

export default config;
```

### **3. API Service/Client**

Buat `src/services/api.js`:
```javascript
import axios from 'axios';
import config, { createApiUrl } from '../config/api.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important untuk CORS dengan cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Test connection
  test: () => apiClient.get('/api/test'),
  
  // Sensor data
  getSensorLatest: (roomId = 1) => apiClient.get(`/api/sensor/latest?room_id=${roomId}`),
  getSensorHistory: (roomId = 1, limit = 10) => apiClient.get(`/api/sensor/history?room_id=${roomId}&limit=${limit}`),
  postSensorData: (data) => apiClient.post('/api/sensor/data', data),
  
  // Fan control
  getFanStatus: (roomId = 1) => apiClient.get(`/api/fan/status?room_id=${roomId}`),
  setFanControl: (data) => apiClient.put('/api/fan/control', data),
  getFanForArduino: (roomId = 1) => apiClient.get(`/api/fan/arduino?room_id=${roomId}`),
  
  // Settings
  getSettings: (roomId = 1) => apiClient.get(`/api/settings?room_id=${roomId}`),
  updateSettings: (data) => apiClient.put('/api/settings', data),
  
  // Dashboard
  getDashboard: () => apiClient.get('/api/dashboard'),
  
  // Auth
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  checkAuth: () => apiClient.get('/api/auth/check')
};

export default apiClient;
```

### **4. Vercel Configuration**

Buat `vercel.json` di root project:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://api-iot.wibudev.moe"
  }
}
```

### **5. Package.json Scripts**

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:vercel": "vite build",
    "preview": "vite preview",
    "deploy": "vercel --prod"
  }
}
```

### **6. Vite Config untuk Production**

Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'https://api-iot.wibudev.moe')
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost/TA/backend',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
```

## 🌐 **CORS Configuration untuk Backend**

Update `config/cors.php` di backend untuk mendukung Vercel:
```php
$allowedOrigins = [
    'http://localhost:5173',     // Development
    'http://localhost:3000',     // Alternative dev
    'https://your-app.vercel.app', // Ganti dengan domain Vercel Anda
    'https://greenhouse-monitor.vercel.app', // Contoh nama
    'https://*.vercel.app'       // Semua subdomain Vercel
];
```

## 🚀 **Deploy ke Vercel**

### **Method 1: Vercel CLI**
```bash
npm install -g vercel
cd /path/to/frontend
vercel login
vercel --prod
```

### **Method 2: GitHub Integration**
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy automatically

### **Environment Variables di Vercel:**
```
VITE_API_BASE_URL=https://api-iot.wibudev.moe
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=production
```

## 🧪 **Testing Integration**

Buat component test di `src/components/ApiTest.jsx`:
```jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.test();
      setTestResult({
        status: 'success',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="api-test">
      <h2>API Connection Test</h2>
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {testResult && (
        <div className={`result ${testResult.status}`}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
```

## 📋 **Checklist Deployment**

### ✅ **Frontend Preparation:**
- [ ] Environment variables configured
- [ ] API service setup
- [ ] CORS domains updated in backend
- [ ] Build configuration optimized
- [ ] Vercel config file created

### ✅ **Vercel Setup:**
- [ ] Vercel account ready
- [ ] Environment variables set
- [ ] Custom domain (optional)
- [ ] SSL certificate (automatic)

### ✅ **Testing:**
- [ ] API connection test
- [ ] CORS working
- [ ] All endpoints accessible
- [ ] Mobile responsive

## 🎯 **Expected Results:**

### Production URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://api-iot.wibudev.moe`
- **API Test**: `https://your-app.vercel.app` → calls → `https://api-iot.wibudev.moe/api/test`

API backend Anda sudah siap! Sekarang tinggal setup frontend dengan konfigurasi di atas dan deploy ke Vercel! 🚀
