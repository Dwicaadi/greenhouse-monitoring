import axios from '../api/axios';

const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth.php', credentials);
      if (response.data.status === 'success') {
        // Simpan token dan user data di localStorage
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { authenticated: false };
      }

      const response = await axios.get(`/api/auth.php?token=${token}`);
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      return { authenticated: false };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService;
