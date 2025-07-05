import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { SENSOR_ENDPOINTS, FAN_ENDPOINTS, SETTINGS_ENDPOINTS } from '../api/endpoints';

/**
 * Custom hook untuk mengambil dan mengelola data sensor
 * @param {number} roomId - ID ruangan dari database
 * @param {number} pollingInterval - Interval polling dalam milidetik (default: 5000)
 * @returns {Object} - Data sensor dan fungsi untuk mengelolanya
 */
const useSensorData = (roomId, pollingInterval = 5000) => {
  // State untuk data sensor
  const [sensorData, setSensorData] = useState({
    temp: 0,
    humy: 0,
    fan1: false,
    fan2: false,
    lastUpdate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  });

  // State untuk data chart
  const [chartData, setChartData] = useState({
    labels: [],
    tempData: [],
    humyData: []
  });

  // State untuk pengaturan ideal
  const [settings, setSettings] = useState({
    ideal_temp_min: 21.0,
    ideal_temp_max: 27.0,
    ideal_humy_min: 60,
    ideal_humy_max: 70
  });

  // State untuk error
  const [error, setError] = useState(null);

  // Fungsi untuk mengupdate data chart
  const updateChartData = useCallback((temp, humy) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
    
    setChartData(prev => {
      const labels = [...prev.labels, timeStr];
      const tempData = [...prev.tempData, temp];
      const humyData = [...prev.humyData, humy];

      // Hanya tampilkan 10 data terakhir
      if (labels.length > 10) {
        labels.shift();
        tempData.shift();
        humyData.shift();
      }

      return { labels, tempData, humyData };
    });
  }, []);

  // Fungsi untuk mengambil data sensor dari API
  const fetchSensorData = useCallback(async () => {
    try {
      // Menggunakan endpoint baru untuk mendapatkan data sensor terbaru
      const response = await axios.get(SENSOR_ENDPOINTS.LATEST(1));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        
        setSensorData(prev => ({
          ...prev,
          temp: parseFloat(data.temp) || 0,
          humy: parseInt(data.humy) || 0,
          lastUpdate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        }));

        // Update chart data
        updateChartData(parseFloat(data.temp) || 0, parseInt(data.humy) || 0);
        
        // Reset error jika sebelumnya error
        if (error) setError(null);
      }
    } catch (error) {
      // Hanya tampilkan error jika bukan 401 (karena 401 ditangani oleh interceptor)
      if (!error.response || error.response.status !== 401) {
        console.error(`Error fetching room ${1} sensor data:`, error);
        setError(`Gagal mengambil data sensor: ${error.message}`);
      }
    }
  }, [updateChartData, error]);

  // Fungsi untuk mengambil status fan dari API
  const fetchFanStatus = useCallback(async () => {
    try {
      // Menggunakan endpoint baru untuk mendapatkan status fan terbaru
      const response = await axios.get(FAN_ENDPOINTS.STATUS(1));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        
        setSensorData(prev => ({
          ...prev,
          fan1: Boolean(parseInt(data.fan1 || 0)),
          fan2: Boolean(parseInt(data.fan2 || 0))
        }));
      }
    } catch (error) {
      // Hanya log error jika bukan 401
      if (!error.response || error.response.status !== 401) {
        console.error(`Error fetching room ${1} fan status:`, error);
      }
    }
  }, []);

  // Fungsi untuk mengambil pengaturan ideal dari API
  const fetchSettings = useCallback(async () => {
    try {
      // Menggunakan endpoint baru untuk mendapatkan pengaturan room
      const response = await axios.get(SETTINGS_ENDPOINTS.GET(1));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        
        setSettings({
          ideal_temp_min: parseFloat(data.ideal_temp_min) || 21.0,
          ideal_temp_max: parseFloat(data.ideal_temp_max) || 27.0,
          ideal_humy_min: parseInt(data.ideal_humy_min) || 60,
          ideal_humy_max: parseInt(data.ideal_humy_max) || 70
        });
      }
    } catch (error) {
      // Hanya log error jika bukan 401
      if (!error.response || error.response.status !== 401) {
        console.error(`Error fetching room ${1} settings:`, error);
      }
    }
  }, []);

  // Fungsi untuk mengontrol status fan
  const toggleFan = useCallback(async (fanNumber) => {
    try {
      const newFanStatus = !sensorData[fanNumber];
      
      // Update local state dulu untuk UI yang responsif
      setSensorData(prev => ({
        ...prev,
        [fanNumber]: newFanStatus
      }));

      // Kirim ke API menggunakan axios dengan metode PUT (sesuai RESTful API)
      const payload = {
        room_id: 1,
        fan1: fanNumber === 'fan1' ? (newFanStatus ? 1 : 0) : (sensorData.fan1 ? 1 : 0),
        fan2: fanNumber === 'fan2' ? (newFanStatus ? 1 : 0) : (sensorData.fan2 ? 1 : 0)
      };

      await axios.put(FAN_ENDPOINTS.CONTROL, payload);
    } catch (error) {
      console.error(`Error toggling ${fanNumber}:`, error);
      
      // Kembalikan state jika gagal
      setSensorData(prev => ({
        ...prev,
        [fanNumber]: !prev[fanNumber]
      }));
    }
  }, [sensorData]);

  // Effect untuk polling data sensor
  useEffect(() => {
    console.log(`useSensorData hook initialized for room ${1}`);
    
    // Ambil data pertama kali
    fetchSensorData();
    fetchFanStatus();
    fetchSettings();

    // Set interval untuk polling
    const sensorInterval = setInterval(fetchSensorData, pollingInterval);
    const fanInterval = setInterval(fetchFanStatus, pollingInterval);

    // Cleanup interval saat komponen unmount
    return () => {
      console.log(`Cleaning up intervals for room ${1}`);
      clearInterval(sensorInterval);
      clearInterval(fanInterval);
    };
  }, [pollingInterval, fetchSensorData, fetchFanStatus, fetchSettings, 1]);

  return {
    sensorData,
    chartData,
    settings,
    toggleFan,
    error
  };
};

export default useSensorData;
