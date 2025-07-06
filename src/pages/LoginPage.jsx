import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { authService } from '../api/auth';
import axios from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Cek apakah user sudah login, jika sudah redirect ke dashboard
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Cek dengan server jika user terautentikasi
        console.log('LoginPage - Checking auth with server');
        const response = await axios.get('/auth/profile');
        console.log('LoginPage - Auth check response:', response.data);
        
        if (response.data && response.data.status === 'success') {
          console.log('User sudah login (server), mengarahkan ke dashboard...');
          const redirectTo = location.state?.from || '/dashboard';
          navigate(redirectTo, { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error checking auth with server:', error);
      }
      
      // Cek data lokal sebagai fallback
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('LoginPage auth check (local):', { 
        hasToken: !!token, 
        hasUserData: !!userData, 
        redirectFrom: location.state?.from,
        timestamp: location.state?.timestamp
      });
      
      // Verifikasi validitas data user
      let isValidUserData = false;
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          isValidUserData = parsedData && (parsedData.id || parsedData.email || parsedData.username);
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('user');
        }
      }
      
      // Mencegah loop redirect - periksa apakah redirect baru terjadi dalam 2 detik terakhir
      const redirectTimestamp = location.state?.timestamp || 0;
      const isRecentRedirect = (Date.now() - redirectTimestamp) < 2000;
      
      // Jika sudah login dan bukan redirect baru, arahkan ke dashboard
      if ((token || isValidUserData) && !isRecentRedirect) {
        console.log('User sudah login (lokal), mengarahkan ke dashboard...');
        const redirectTo = location.state?.from || '/dashboard';
        navigate(redirectTo, { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthentication();
  }, [navigate, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const loginData = {
        username: formData.username,
        password: formData.password
      };
      
      const response = await authService.login(loginData);
      
      // Cek status respons dari backend
      if (response.status === 'success' && response.user) {
        setSuccess('Login berhasil! Anda akan dialihkan...');
        
        // Cek apakah ada redirect URL dari query parameter
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');
        
        // Tunggu sebentar untuk memastikan session tersimpan
        setTimeout(() => {
          if (redirectPath && !redirectPath.includes('/login') && !redirectPath.includes('/register')) {
            navigate(redirectPath, { replace: true });
          } else {
            navigate('/room-sensor/1', { replace: true });
          }
        }, 1500);
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.message || 
        (err.response?.data?.message) || 
        'Username atau password salah. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tampilkan loading jika masih mengecek autentikasi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-600">
            Login
          </h2>
        </div>
        
        {/* Tampilkan pesan error jika ada */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tampilkan pesan sukses jika ada */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Masukan username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Masukan password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Masuk...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;