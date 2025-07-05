import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Efek untuk mendeteksi ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Sembunyikan sidebar secara default pada mobile
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    // Panggil handler saat mount dan ketika ukuran window berubah
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar dengan kondisi tampil */}
      <div className={`${showSidebar ? 'block' : 'hidden'} ${isMobile ? 'fixed inset-0 z-40' : ''}`}>
        {isMobile && showSidebar && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
            onClick={toggleSidebar}
          ></div>
        )}
        <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : ''}`}>
          <Sidebar onCloseSidebar={toggleSidebar} />
        </div>
      </div>
      
      <div className="flex-1 w-full transition-all duration-300">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="p-2 md:p-4 pt-4 md:pt-8 pb-16 w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;