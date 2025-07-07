import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

// Komponen untuk proteksi rute yang membutuhkan autentikasi
const PrivateRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    lastChecked: 0
  });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // Enable withCredentials untuk session support
        axios.defaults.withCredentials = true;
        
         // Cek autentikasi dengan server menggunakan endpoint yang benar
        const response = await axios.get('/auth/profile');
        
        if (isMounted) {
          if (response.data && response.data.status === 'success') {
            // Update user data jika ada perubahan dari server
            if (response.data.data) {
              localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              lastChecked: Date.now()
            });
          } else {
            throw new Error('Not authenticated');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        
        if (isMounted) {
          // Hapus data autentikasi lokal jika terjadi error
          localStorage.removeItem('user');
          
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            lastChecked: Date.now()
          });
        }
      }
    };

    // Cek autentikasi setiap kali route berubah atau setiap 5 menit
    const shouldRecheck = Date.now() - authState.lastChecked > 5 * 60 * 1000;
    if (authState.isLoading || shouldRecheck) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [location.pathname, authState.lastChecked, authState.isLoading]);
  
  // Tampilkan loading jika masih memeriksa autentikasi
  if (authState.isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }
  
  // Jika belum login, redirect ke halaman login
  if (!authState.isAuthenticated) {
    console.log('User tidak terautentikasi, redirect ke login dari:', location.pathname);
    
    // Gunakan state untuk memberi tahu komponen login tentang redirect
    return <Navigate to="/login" replace state={{ 
      from: location.pathname, 
      reason: 'unauthenticated',
      timestamp: Date.now() // Tambahkan timestamp untuk mencegah redirect loop
    }} />;
  }
  
  // Jika sudah login, tampilkan konten halaman
  return children;
};

export default PrivateRoute;
