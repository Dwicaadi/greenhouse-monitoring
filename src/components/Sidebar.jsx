import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon, BeakerIcon, ChartBarIcon, HomeModernIcon, Cog6ToothIcon, XMarkIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { getUserData } from '../utils/profileUtils';
import logoImage from '../assets/images/logo.png';
import axios from '../api/axios';
import { AUTH_ENDPOINTS, ROOM_ENDPOINTS } from '../api/endpoints';

const Sidebar = ({ onCloseSidebar }) => {
  const location = useLocation();

  const appItems = [
    { path: '/room-sensor/1', label: 'Room Sensor 1', icon: <HomeModernIcon className="w-5 h-5 text-green-500" /> },
    { path: '/pengaturan', label: 'Profil Pengguna', icon: <UserCircleIcon className="w-5 h-5 text-green-500" /> },
  ];

  const [userData, setUserData] = useState(getUserData());
  const [profilePicture, setProfilePicture] = useState(null);
  
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
  
  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      // Panggil endpoint logout
      await axios.post(AUTH_ENDPOINTS.LOGOUT);
      
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
  };
  
  // Efek untuk memperbarui data user dan room
  useEffect(() => {
    // Panggil fetchProfileData dan fetchRooms saat komponen dimount
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

  return (
    <div className="bg-white dark:bg-gray-800 h-screen w-64 shadow-md flex flex-col overflow-y-auto rounded-r-xl mx-2 my-2 relative">
      <div className="p-3 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src={logoImage} alt="Logo" className="h-8 w-8" />
          </div>
          <span className="text-base font-bold"><span className="text-green-500">GH</span> <span className="text-green-700 dark:text-green-500">Monitoring</span></span>
        </div>
        
        {/* Tombol close untuk mobile */}
        <button
          onClick={onCloseSidebar}
          className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 pb-0 pt-2">
        <div className="px-4 py-1">
          <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">Room</h2>
        </div>
        <Link
          to="/room-sensor/1"
          className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 ${
            location.pathname === '/room-sensor/1' ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' : ''
          }`}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-700">
            <HomeModernIcon className="h-5 w-5 text-green-600" />
          </div>
          <span>Room Sensor 1</span>
        </Link>
        <div className="px-4 py-1 mt-2 mb-0">
          <h2 className="text-xs text-gray-500 dark:text-gray-400 font-medium">APPS</h2>
        </div>
        <Link
          to="/pengaturan"
          className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 ${
            location.pathname === '/pengaturan' ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' : ''
          }`}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-700">
            <UserCircleIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
          <span>Profil Pengguna</span>
        </Link>
      </nav>
      
      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mx-3 mb-3 flex items-center">
        <Link to="/pengaturan" className="flex items-center flex-grow cursor-pointer">
          <img src={profilePicture} alt={userData.username} className="w-8 h-8 rounded-full mr-2" />
          <div>
            <p className="text-xs font-medium dark:text-white">{userData.name || userData.username || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout} 
          className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;