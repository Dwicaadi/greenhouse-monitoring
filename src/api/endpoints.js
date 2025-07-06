export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/profile',
    UPDATE_PHOTO: '/auth/profile-photo',
    DELETE_PHOTO: '/auth/profile-photo',
};

export const USER_ENDPOINTS = {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
};

// Endpoint untuk room sensor dinamis
export const ROOM_ENDPOINTS = {
    // Daftar semua room
    GET_ALL: '/api/rooms',
    // Tambah room baru
    ADD: '/api/rooms',
    // Update room
    UPDATE: '/api/rooms',
    // Nonaktifkan room
    DEACTIVATE: '/api/rooms/deactivate',
    // Hapus room
    DELETE: '/api/rooms',
    // Dashboard data (semua room)
    DASHBOARD: '/api/dashboard'
};

// Endpoint untuk data sensor
export const SENSOR_ENDPOINTS = {
    // Data sensor terbaru berdasarkan room_id
    LATEST: (roomId = 1) => `/src/api/sensor.php?action=sensor&room_id=${roomId}`,
    // Kirim data sensor baru (POST)
    POST_DATA: (roomId = 1) => `/src/api/sensor.php?action=sensor&room_id=${roomId}`,
    // Ambil data historis sensor
    HISTORY: (roomId = 1, limit = 10) => `/src/api/sensor.php?action=history&room_id=${roomId}&limit=${limit}`
};

// Endpoint untuk kontrol fan
export const FAN_ENDPOINTS = {
    // Status fan berdasarkan room_id
    STATUS: (roomId = 1) => `/src/api/sensor.php?action=fan&room_id=${roomId}`,
    // Toggle fan/lamp status
    TOGGLE: (roomId = 1) => `/src/api/sensor.php?action=toggle&room_id=${roomId}`
};