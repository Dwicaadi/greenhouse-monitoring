import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { authService } from '../api/auth';
import DashboardLayout from '../layouts/DashboardLayout';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    name: '',
    password: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://api-iot.wibudev.moe/uploads/profile_pictures/default-avatar.png');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fungsi fetchProfileData di dalam useEffect untuk menghindari dependency issues
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getProfile();
        console.log('Profile response:', response);
        
        // Periksa struktur data yang dikembalikan oleh backend
        const userData = response.data || response;
        
        setProfileData(prevData => ({
          ...prevData,
          username: userData.username || '',
          email: userData.email || '',
          name: userData.name || ''
        }));
        
        // Periksa apakah ada profile_photo
        if (userData.profile_photo) {
          // Buat URL lengkap untuk foto profil
          const photoUrl = `https://api-iot.wibudev.moe/uploads/profile_pictures/${userData.profile_photo}`;
          setPreviewUrl(photoUrl);
        } else {
          setPreviewUrl('https://api-iot.wibudev.moe/uploads/profile_pictures/default-avatar.png');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Gagal memuat data profil');
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);  // Menggunakan functional update untuk setProfileData sehingga tidak perlu dependency

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Debug: tampilkan user data
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);

    try {
      // Update profil
      const profileResponse = await authService.updateProfile({
        username: profileData.username,
        email: profileData.email,
        name: profileData.name
      });
      
      console.log('Profile update response:', profileResponse);

      // Update password jika diisi
      if (profileData.password && profileData.password.trim() !== '') {
        const passwordResponse = await authService.updatePassword({
          new_password: profileData.password
        });
        console.log('Password update response:', passwordResponse);
      }

      // Update foto profil jika ada
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);
        const response = await authService.updateProfilePhoto(formData);
        
        console.log('Profile photo update response:', response);
        
        // Jika berhasil update foto, perbarui data user di localStorage
        if (response && response.status === 'success') {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.profile_photo = response.profile_photo;
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update preview URL langsung dengan URL dari response
          const newPhotoUrl = `https://api-iot.wibudev.moe/uploads/profile_pictures/${response.profile_photo}?t=${Date.now()}`;
          setPreviewUrl(newPhotoUrl);
          
          // Kirim event untuk memberitahu komponen lain bahwa profil telah diperbarui
          window.dispatchEvent(new Event('profileUpdated'));
          
          // Refresh data profil dari server untuk memastikan sinkronisasi
          setTimeout(() => {
            window.dispatchEvent(new Event('profileUpdated'));
          }, 500);
        }
      }

      setSuccessMessage('Profil berhasil diperbarui');
      // Reset password field
      setProfileData({
        ...profileData,
        password: ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Tangani error dengan lebih spesifik
      if (error.response) {
        setErrorMessage(error.response.data?.message || 'Gagal memperbarui profil');
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Gagal memperbarui profil. Periksa koneksi internet Anda.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeletePhoto = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Panggil API untuk menghapus foto profil
      const response = await authService.deleteProfilePhoto();
      
      if (response && response.status === 'success') {
        // Update preview ke default avatar
        setPreviewUrl('https://api-iot.wibudev.moe/uploads/profile_pictures/default-avatar.png');
        setSelectedFile(null);
        
        // Update data user di localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.profile_photo = null;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Kirim event untuk memberitahu komponen lain bahwa profil telah diperbarui
        window.dispatchEvent(new Event('profileUpdated'));
        
        setSuccessMessage('Foto profil berhasil dihapus');
      } else {
        setErrorMessage(response.message || 'Gagal menghapus foto profil');
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      setErrorMessage(error.message || 'Gagal menghapus foto profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Pengaturan Profil</h2>
          </div>

          {/* Pesan error/sukses */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto Profil */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isSaving}
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    File terpilih: {selectedFile.name}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
                  disabled={isSaving}
                >
                  Hapus Foto
                </button>
              </div>

              {/* Grid untuk form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan nama lengkap"
                    disabled={isSaving}
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan username"
                    disabled={isSaving}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan email"
                    disabled={isSaving}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={profileData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Kosongkan jika tidak ingin mengubah"
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tombol aksi */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
