// utils/urlUtils.js
// Utilitas untuk menangani URL berdasarkan environment

// Deteksi environment
export const isDevelopment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

// Base URL untuk backend
export const getBackendBaseUrl = () => {
    // Jika ada environment variable dari Vite (untuk production)
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    
    // Jika development, gunakan localhost
    if (isDevelopment) {
        return 'http://localhost/TA/backend';
    }
    
    // Fallback untuk production
    return 'https://api-iot.wibudev.moe';
};

// Generate URL lengkap untuk file foto profil
export const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // Jika sudah URL lengkap, return as is
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
        return photoPath;
    }
    
    // Jika path relative, gabungkan dengan base URL
    if (photoPath.startsWith('/')) {
        return `${getBackendBaseUrl()}${photoPath}`;
    }
    
    // Jika hanya nama file, tambahkan path lengkap
    return `${getBackendBaseUrl()}/uploads/profile_pictures/${photoPath}`;
};

// Generate URL dengan cache busting untuk menghindari cache browser
export const getProfilePhotoUrlWithCacheBust = (photoPath) => {
    const url = getProfilePhotoUrl(photoPath);
    if (!url) return null;
    
    // Tambahkan timestamp untuk cache busting
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
};

// Debug info untuk troubleshooting
export const getUrlDebugInfo = () => {
    return {
        isDevelopment,
        backendBaseUrl: getBackendBaseUrl(),
        currentHostname: window.location.hostname,
        environmentMode: import.meta.env.MODE,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'not set'
    };
};
