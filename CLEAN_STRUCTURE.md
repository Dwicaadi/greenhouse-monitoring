# Frontend Structure (Cleaned)

## ✅ File Struktur Bersih

### Root Files
- `index.html` - HTML entry point
- `package.json` - Dependencies & scripts
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `vercel.json` - Vercel deployment config
- `.env.development` - Development environment
- `.env.production` - Production environment

### Source Code (`src/`)
- `main.jsx` - React entry point
- `App.jsx` - Main App component with routing
- `App.css` - Global styles
- `index.css` - Base styles

### Components (`src/components/`)
- `Login.jsx` - Login form
- `Register.jsx` - Register form
- `PrivateRoute.jsx` - Route protection
- `Navbar.jsx` - Navigation bar
- `Sidebar.jsx` - Side navigation
- `Footer.jsx` - Footer component
- `SensorCard.jsx` - Sensor data card
- `SensorChart.jsx` - Sensor chart display
- `SensorDisplay.jsx` - Sensor data display
- `FanControl.jsx` - Fan control component

### Pages (`src/pages/`)
- `HomePage.jsx` - Dashboard home
- `LoginPage.jsx` - Login page
- `RegisterPage.jsx` - Register page
- `ProfilePage.jsx` - User profile page
- `RoomSensorPage.jsx` - Room sensor monitoring

### API Services (`src/api/`)
- `axios.js` - Axios configuration
- `auth.js` - Authentication API
- `endpoints.js` - API endpoints

### Utils (`src/utils/`)
- `auth.js` - Auth utilities
- `profileUtils.js` - Profile utilities
- `urlUtils.js` - URL utilities

### Layouts (`src/layouts/`)
- `DashboardLayout.jsx` - Dashboard layout wrapper

### Hooks (`src/hooks/`)
- `useSensorData.js` - Sensor data custom hook

### Assets (`src/assets/`)
- `images/logo.png` - App logo
- `images/favicon.png` - Favicon

## 🗑️ File yang Dihapus
- File dokumentasi duplikat (DEPLOYMENT_GUIDE.md, FRONTEND_VERCEL_GUIDE copy*.md, dll)
- File script deploy (deploy.ps1, deploy.sh)
- File environment duplikat (.env)
- API config duplikat (api.config.js, api.service.js di root)
- Komponen testing (ApiTest.jsx)
- File build output (dist/, .vercel/)
- Asset tidak terpakai (react.svg)

## 🎯 Fungsi yang Tetap Berfungsi
- ✅ Login/Register/Logout
- ✅ Profile CRUD & upload foto
- ✅ Sensor monitoring (room_id=1)
- ✅ Fan control
- ✅ Chart display
- ✅ Responsive design
- ✅ Dark mode
- ✅ API integration

## 📝 Notes
- Struktur sekarang lebih clean dan mudah maintenance
- Semua fungsi utama tetap berfungsi
- Build size lebih kecil karena tidak ada file duplikat
- Easier deployment karena tidak ada file konflik
