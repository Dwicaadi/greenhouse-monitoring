import axios from 'axios';

// Deteksi environment
const isDevelopment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

// Tentukan base URL berdasarkan environment
const getBaseURL = () => {
    // Jika ada environment variable dari Vite (untuk production)
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    
    // Untuk development, gunakan server production juga
    // Karena backend sudah di-deploy di https://api-iot.wibudev.moe
    return 'https://api-iot.wibudev.moe';
};

const baseURL = getBaseURL();

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true, // Enable untuk session/cookies dengan CORS
    timeout: 15000 // 15 detik timeout (diperpanjang)
});

// Tambahkan log untuk debugging
console.log('🔧 Axios Configuration:', {
    baseURL: baseURL,
    isDevelopment: isDevelopment,
    environment: import.meta.env.VITE_ENVIRONMENT || 'production',
    mode: import.meta.env.MODE,
    withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Enable withCredentials untuk session support
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Variabel untuk mencegah multiple redirect
let isRedirecting = false;

// Add a response interceptor with improved handling
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Jika tidak ada response, mungkin masalah network atau CORS
        if (!error.response) {
            console.error('🔥 Network Error:', error.message);
            
            // Cek apakah ini masalah CORS
            if (error.message.includes('CORS') || error.message.includes('Network Error')) {
                console.error('🚫 CORS Error detected:', {
                    message: error.message,
                    config: error.config,
                    baseURL: baseURL
                });
            }
            
            return Promise.reject(error);
        }

        // Jika error 401 dan belum dalam proses redirect
        if (error.response.status === 401 && !isRedirecting) {
            // Dapatkan current path
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath === '/login' || 
                             currentPath === '/register' || 
                             currentPath.includes('/login') || 
                             currentPath.includes('/register');

            if (!isAuthPage) {
                isRedirecting = true;

                // Hapus data autentikasi
                localStorage.removeItem('user');

                // Redirect ke login dengan state
                const loginPath = `/login?redirect=${encodeURIComponent(currentPath)}`;
                window.location.replace(loginPath);

                // Reset flag setelah redirect
                setTimeout(() => {
                    isRedirecting = false;
                }, 1000);
            }
        }

        return Promise.reject(error);
    }
);

export default instance; 