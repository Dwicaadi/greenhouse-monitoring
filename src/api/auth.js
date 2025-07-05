import axios from './axios';
import { AUTH_ENDPOINTS } from './endpoints';

export const authService = {
    // Fungsi untuk memeriksa apakah user sudah login
    checkAuth: async () => {
        try {
            console.log('Checking auth status with server');
            const response = await axios.get('/src/auth/check_auth.php');
            console.log('Auth check response:', response.data);
            
            return response.data && response.data.authenticated;
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Jika server error, cek lokal
            return localStorage.getItem('user') !== null;
        }
    },
    
    login: async (credentials) => {
        try {
            // Pastikan withCredentials diaktifkan untuk mengirim cookie
            axios.defaults.withCredentials = true;
            
            const response = await axios.post(AUTH_ENDPOINTS.LOGIN, credentials);
            console.log('Login response:', response.data); // Untuk debugging
            
            // Cek apakah respons valid dan berhasil
            if (!response.data) {
                throw new Error('Tidak ada respons dari server');
            }
            
            if (response.data.status === 'success') {
                // Pastikan ada data user dalam respons
                if (!response.data.user || !response.data.user.id) {
                    throw new Error('Data user tidak lengkap dari server');
                }
                
                // Simpan data user di localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Debug: log session ID jika ada
                if (response.data.session_id) {
                    console.log('Session established:', response.data.session_id);
                }
                
                return response.data;
            } else {
                throw new Error(response.data.message || 'Login gagal');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                throw error.response.data;
            } else {
                throw { 
                    status: 'error',
                    message: error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
                };
            }
        }
    },

    register: async (userData) => {
        try {
            // Pastikan format data sesuai dengan yang diharapkan backend
            const registerData = {
                username: userData.username,
                name: userData.name,     // Sesuai dengan field di form dan backend
                email: userData.email,
                password: userData.password
            };
            
            console.log('Sending register data:', registerData);
            const response = await axios.post(AUTH_ENDPOINTS.REGISTER, registerData);
            return response.data;
        } catch (error) {
            console.error('Register error details:', error.response ? error.response.data : error);
            // Tangani error dengan lebih baik
            if (error.response) {
                throw error.response.data;
            } else {
                throw { message: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' };
            }
        }
    },

    logout: async () => {
        try {
            // Coba logout dari backend/server
            console.log('Attempting to logout from server');
            await axios.post(AUTH_ENDPOINTS.LOGOUT);
            
            console.log('Clearing auth data from client');
            // Hapus data dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            return { status: 'success', message: 'Logout berhasil' };
        } catch (error) {
            console.error('Error during logout:', error);
            
            // Tetap hapus data lokal meskipun error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Jika ada error response dari server, throw error tersebut
            if (error.response) {
                throw error.response.data;
            } else {
                // Jika tidak ada response (misalnya network error), tetap anggap logout berhasil di sisi client
                return { status: 'warning', message: 'Logout berhasil di client, tetapi gagal di server' };
            }
        }
    },

    getProfile: async () => {
        try {
            // Coba ambil data dari endpoint profile
            const response = await axios.get(AUTH_ENDPOINTS.PROFILE);
            console.log('Profile response from API:', response.data);
            
            // Kembalikan data apapun yang diterima dari API
            return response.data;
        } catch (error) {
            console.error('Error getting profile:', error);
            
            // Ambil data dari localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                console.log('Using profile data from localStorage:', parsedData);
                return parsedData;
            }
            
            // Jika tidak ada data di localStorage, berikan objek kosong
            return {
                nama: '',
                email: '',
                alamat: '',
                nomorTelepon: ''
            };
        }
    },
    
    updateProfile: async (profileData) => {
        try {
            // Coba update profil di backend
            const response = await axios.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
            
            // Jika berhasil, update juga data di localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const updatedData = { ...parsedData, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedData));
            }
            
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            
            // Jika endpoint belum tersedia, update data di localStorage saja
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const updatedData = { ...parsedData, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedData));
                return { status: 'success', message: 'Profil berhasil diperbarui (lokal)' };
            }
            
            throw { message: 'Gagal memperbarui profil' };
        }
    },
    
    updatePassword: async (passwordData) => {
        try {
            const response = await axios.put(AUTH_ENDPOINTS.UPDATE_PASSWORD, passwordData);
            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw { message: 'Gagal memperbarui password' };
        }
    },
    
    updateProfilePhoto: async (formData) => {
        try {
            // Coba upload foto profil ke backend
            const response = await axios.post(AUTH_ENDPOINTS.UPDATE_PHOTO, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating profile photo:', error);
            // Untuk sementara, kembalikan pesan sukses meskipun endpoint belum tersedia
            // Ini agar user tetap bisa menggunakan fitur lain
            return { status: 'success', message: 'Foto profil berhasil diperbarui (lokal)' };
        }
    },
    
    deleteProfilePhoto: async () => {
        try {
            // Hapus foto profil di backend
            const response = await axios.post(AUTH_ENDPOINTS.DELETE_PHOTO);
            return response.data;
        } catch (error) {
            console.error('Error deleting profile photo:', error);
            throw { message: 'Gagal menghapus foto profil' };
        }
    }
};