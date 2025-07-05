# 🌱 Greenhouse Monitoring System

Aplikasi monitoring IoT untuk sistem greenhouse dengan sensor suhu, kelembaban, dan kontrol kipas otomatis.

## 🚀 Live Demo

- **Frontend**: https://greenhouse-monitoring.vercel.app (akan tersedia setelah deploy)
- **Backend API**: https://api-iot.wibudev.moe
- **API Test**: https://greenhouse-monitoring.vercel.app/api-test

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React-ChartJS-2
- **HTTP Client**: Axios
- **Icons**: React Icons + Heroicons
- **Deployment**: Verceluse Monitoring - Frontend

Aplikasi monitoring IoT untuk greenhouse dengan sensor suhu, kelembaban, dan kontrol kipas.

## �️ Technology Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React-ChartJS-2
- **HTTP Client**: Axios
- **Icons**: React Icons + Heroicons
- **Backend API**: https://api-iot.wibudev.moe

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Production Deployment

### Deploy to Vercel

1. **Via Vercel CLI:**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to production
vercel --prod
```

2. **Via GitHub Integration:**
- Connect your repository to Vercel
- Set environment variables in Vercel dashboard
- Deploy automatically on push

### Environment Variables

Set these in your Vercel dashboard or `.env` file:

```env
VITE_API_BASE_URL=https://api-iot.wibudev.moe
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=production
```

## 🔧 Configuration

### API Configuration

API automatically switches between:
- **Development**: `http://localhost/TA/backend` (via Vite proxy)
- **Production**: `https://api-iot.wibudev.moe`

### CORS Settings

Backend is configured to allow:
- `localhost:5173` (development)
- `*.vercel.app` (production)
- Custom domains

## 📝 Features

- Real-time sensor data monitoring
- Temperature and humidity charts
- Fan control system
- User authentication
- Profile management
- Multi-room support
- Responsive design

## 🎯 API Endpoints

- `GET /api/test` - API health check
- `GET /api/sensor/latest` - Latest sensor data
- `GET /api/sensor/history` - Historical data
- `GET /api/fan/status` - Fan status
- `POST /api/sensor/data` - Submit sensor data
- `PUT /api/fan/control` - Control fan

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if backend is running
   - Verify CORS settings
   - Check network connectivity

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for syntax errors
   - Verify environment variables

3. **Authentication Issues**
   - Check session cookies
   - Verify login credentials
   - Check auth token expiration

### Debug Commands

```bash
# Check API connectivity
curl https://api-iot.wibudev.moe/api/test

# Check build output
npm run build

# Test production build locally
npm run preview
```

## 📈 Performance

- Code splitting with Vite
- Lazy loading for routes
- Optimized bundle size
- CDN deployment via Vercel

## 🧪 Testing

```bash
# Run linting
npm run lint

# Test API connection
# Navigate to /api-test in the application
```

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- PWA capabilities (can be added)

## � Security

- Environment variables for sensitive data
- HTTPS in production
- CORS protection
- Session-based authentication

## 📊 Monitoring

- Real-time data updates
- Error handling and logging
- Performance tracking
- API response monitoring

---

**Live Demo**: https://your-app.vercel.app (setelah deploy)
**API Backend**: https://api-iot.wibudev.moe
**Documentation**: See `FRONTEND_VERCEL_GUIDE.md`
- React Router DOM
- React Query
- Chart.js

## ✨ Fitur
- 📊 Dashboard monitoring realtime
- 🌡️ Tampilan data sensor suhu & kelembaban
- 🎛️ Kontrol perangkat (kipas, pompa, dll)
- 👤 Manajemen profil pengguna
- 📱 Responsive design
- 🔐 Autentikasi & otorisasi

## ⚙️ Instalasi

### Prasyarat
- Node.js 16+
- NPM/Yarn
- Git

### Langkah Instalasi
```bash
# Clone repository
git clone [url-repository]

# Masuk ke direktori
cd frontend

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

## 📁 Struktur Project
```
frontend/
├── public/          # Asset statis
│   ├── api/        # Integrasi API
│   ├── assets/     # Gambar & font
│   ├── components/ # Komponen reusable
│   ├── hooks/      # Custom hooks
│   ├── layouts/    # Layout aplikasi
│   ├── pages/      # Halaman utama
│   ├── styles/     # CSS & styling
│   └── utils/      # Helper & utilities
└── package.json    # Dependensi & script
```

## 🚀 Penggunaan

### Environment Variables
Buat file `.env` di root project:
```env
VITE_API_URL=http://localhost/TA/backend
VITE_WS_URL=ws://localhost:8080
```

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Type Checking
```bash
npm run typecheck
```

## 👨‍💻 Development

### Coding Standards
- Gunakan TypeScript untuk type safety
- Ikuti ESLint configuration
- Gunakan Prettier untuk formatting
- Implementasikan error handling
- Buat komponen yang reusable

### State Management
- Gunakan React Query untuk server state
- Context API untuk global state
- Local state untuk UI state

### Performance
- Implementasi lazy loading
- Optimasi bundle size
- Gunakan memo & useMemo dengan bijak
- Optimalkan re-rendering

### Testing
```bash
# Unit testing
npm run test

# E2E testing
npm run test:e2e
```

## 🔧 Troubleshooting

### Hot Module Replacement (HMR)
Jika HMR tidak berfungsi:
1. Restart development server
2. Hapus cache browser
3. Periksa konfigurasi vite.config.ts

### Build Issues
- Periksa versi Node.js
- Hapus node_modules & package-lock.json
- Jalankan instalasi ulang

## 📞 Bantuan
Jika mengalami masalah:
- Buat issue di repository
- Hubungi tim development
- Cek dokumentasi React & Vite
