import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { getUserData } from '../utils/profileUtils';
import logoImage from '../assets/images/logo.png';
import axios from '../api/axios';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import { authService } from '../api/auth';

const Navbar = ({ onToggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [userData, setUserData] = useState(getUserData());
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Fungsi untuk mengambil data profil dari API
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(AUTH_ENDPOINTS.PROFILE);
      
      if (response.data && response.data.status === 'success') {
        const profileData = response.data.user || response.data.data || response.data;
        setUserData(profileData);
        
        // Periksa apakah ada profile_photo
        if (profileData.profile_photo) {
          // Jika path dimulai dengan '/', tambahkan base URL
          if (profileData.profile_photo.startsWith('/')) {
            setProfilePicture(`http://localhost/TA/backend${profileData.profile_photo}`);
          } else {
            setProfilePicture(profileData.profile_photo);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Fallback ke data dari localStorage jika API gagal
      const localUserData = getUserData();
      setUserData(localUserData);
    }
  };
  
  // Efek untuk memperbarui data user
  useEffect(() => {
    // Panggil fetchProfileData saat komponen dimount
    fetchProfileData();
    
    // Tambahkan event listener untuk perubahan localStorage
    window.addEventListener('storage', fetchProfileData);
    
    // Custom event untuk refresh profil setelah update
    window.addEventListener('profileUpdated', fetchProfileData);
    
    return () => {
      window.removeEventListener('storage', fetchProfileData);
      window.removeEventListener('profileUpdated', fetchProfileData);
    };
  }, []);

  // Efek untuk memperbarui waktu secara real-time
  useEffect(() => {
    // Perbarui waktu setiap 1 detik
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Bersihkan interval saat komponen unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Efek untuk mengelola tema gelap
  useEffect(() => {
    // Menerapkan tema gelap ke element HTML
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Fungsi untuk beralih tema
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Format waktu dengan zona waktu Indonesia
  const formattedTime = () => {
    // Array nama hari dalam bahasa Indonesia
    const hariArray = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    // Array nama bulan dalam bahasa Indonesia
    const bulanArray = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    // Ambil informasi waktu dengan zona waktu Indonesia
    const timeOptions = { timeZone: 'Asia/Jakarta' };
    const jakartaTime = new Date(currentTime.toLocaleString('en-US', timeOptions));
    
    // Mendapatkan komponen waktu
    const hari = hariArray[jakartaTime.getDay()];
    const tanggal = jakartaTime.getDate();
    const bulan = bulanArray[jakartaTime.getMonth()];
    const tahun = jakartaTime.getFullYear();
    const jam = String(jakartaTime.getHours()).padStart(2, '0');
    const menit = String(jakartaTime.getMinutes()).padStart(2, '0');
    const detik = String(jakartaTime.getSeconds()).padStart(2, '0');
    
    // Format: Hari, Tanggal Bulan Tahun, Jam:Menit:Detik
    return `${hari}, ${tanggal} ${bulan} ${tahun}, ${jam}:${menit}:${detik}`;
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center rounded-xl mt-2 mx-2">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="flex flex-col space-y-1 items-start w-6 h-6"
            aria-label="Toggle sidebar"
          >
            <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
            <div className="w-3.5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
            <div className="w-2.5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
          </button>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <img src={logoImage} alt="Logo" className="h-8 mr-2" />
            <span className="text-green-500 font-bold">Dashboard</span>
            <span className="ml-1 text-green-700 dark:text-green-500">Monitoring</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center overflow-hidden">
                <img
                  src={profilePicture}
                  alt={userData.username || 'Profile'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{userData.username || 'Administrator'}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/pengaturan"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profil Saya
                </Link>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={async () => {
                    try {
                      // Panggil authService logout
                      await authService.logout();
                      
                      // Tampilkan notifikasi sukses
                      const notif = document.createElement('div');
                      notif.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50';
                      notif.innerHTML = `
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                          </div>
                          <div class="ml-3">
                            <p>Logout berhasil! Mengalihkan ke halaman login...</p>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(notif);
                      
                      // Hapus data dari localStorage
                      localStorage.clear();
                      
                      // Hapus token dari axios headers
                      delete axios.defaults.headers.common['Authorization'];
                      
                      // Tunggu 1.5 detik sebelum redirect
                      setTimeout(() => {
                        // Redirect ke halaman login
                        window.location.replace('/login');
                      }, 1500);
                    } catch (error) {
                      console.error('Error during logout:', error);
                      // Tetap hapus data lokal dan redirect meskipun API error
                      localStorage.clear();
                      delete axios.defaults.headers.common['Authorization'];
                      window.location.replace('/login');
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-center py-2 text-sm text-gray-500 dark:text-gray-400 shadow-sm rounded-xl mx-2 mt-2">
        Last update: {formattedTime()} WIB
      </div>
    </div>
  );
};

export default Navbar;