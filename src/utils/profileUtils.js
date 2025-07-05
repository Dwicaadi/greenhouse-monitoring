// Fungsi untuk mendapatkan data user dari localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  return { username: 'User', email: 'user@example.com' };
};

// Cache untuk menyimpan URL foto profil yang sudah dihasilkan
let profilePictureCache = {
  userId: null,
  url: null,
  timestamp: 0
};

// Fungsi untuk mendapatkan URL foto profil yang benar
export const getProfilePictureUrl = (userData) => {
  if (!userData) {
    userData = getUserData();
  }
  
  // Gunakan cache jika user ID sama dan cache belum expired (5 menit)
  const now = Date.now();
  if (profilePictureCache.userId === userData.id && 
      profilePictureCache.url && 
      now - profilePictureCache.timestamp < 300000) {
    return profilePictureCache.url;
  }
  
  // Cek apakah userData dan profile_photo ada dan bukan null atau undefined
  if (userData && userData.profile_photo) {
    // Jika path dimulai dengan '/', tambahkan base URL
    if (userData.profile_photo.startsWith('/')) {
      // Pastikan menggunakan URL backend yang benar
      // Gunakan port 8000 untuk backend PHP
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:8000`;
      
      // Pastikan path sudah benar, file profile_photo.php menyimpan path sebagai /uploads/profile_pictures/[nama_file]
      const fullUrl = `${baseUrl}/TA/backend${userData.profile_photo}`;
      
      // Simpan ke cache
      profilePictureCache = {
        userId: userData.id,
        url: fullUrl,
        timestamp: now
      };
      
      return fullUrl;
    }
    
    // Simpan ke cache
    profilePictureCache = {
      userId: userData.id,
      url: userData.profile_photo,
      timestamp: now
    };
    
    return userData.profile_photo;
  }
  
  // Gunakan default avatar jika tidak ada foto profil
  const defaultUrl = `${window.location.origin}/avatar.png`;
  
  // Simpan ke cache
  profilePictureCache = {
    userId: userData.id,
    url: defaultUrl,
    timestamp: now
  };
  
  return defaultUrl;
};
