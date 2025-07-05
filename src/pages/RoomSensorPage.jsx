import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import SensorChart from '../components/SensorChart';
import axios from '../api/axios';
import { ROOM_ENDPOINTS, SENSOR_ENDPOINTS, FAN_ENDPOINTS, SETTINGS_ENDPOINTS } from '../api/endpoints';
import { WiThermometer, WiHumidity } from 'react-icons/wi';
import { IoWaterOutline } from 'react-icons/io5';
import { FaTemperatureLow, FaWater } from 'react-icons/fa';

const RoomSensorPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State untuk data sensor
  const [sensorData, setSensorData] = useState({
    temp: 0,
    humy: 0,
    fan1: false,
    lamp1: false,
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

  // Fungsi untuk mengambil data sensor
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await axios.get(SENSOR_ENDPOINTS.LATEST(1));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        
        setSensorData(prev => ({
          ...prev,
          temp: parseFloat(data.temp) || 0,
          humy: parseInt(data.humy) || 0,
          fan1: Boolean(parseInt(data.fan1 || 0)),
          lamp1: Boolean(parseInt(data.lamp1 || 0)),
          lastUpdate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        }));

        // Update chart data
        updateChartData(parseFloat(data.temp) || 0, parseInt(data.humy) || 0);
      }
    } catch (error) {
      console.error(`Error fetching sensor data:`, error);
    }
  }, [updateChartData]);

  // Fungsi untuk mengambil data historis untuk chart
  const fetchHistoricalData = useCallback(async () => {
    try {
      const response = await axios.get(SENSOR_ENDPOINTS.HISTORY(1, 10));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data.reverse(); // Balik urutan agar dari lama ke baru
        
        const labels = data.map(item => {
          const date = new Date(item.timestamp);
          return date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
        });
        
        const tempData = data.map(item => parseFloat(item.temp) || 0);
        const humyData = data.map(item => parseInt(item.humy) || 0);
        
        setChartData({ labels, tempData, humyData });
      }
    } catch (error) {
      console.error(`Error fetching historical data:`, error);
    }
  }, []);

  // Fungsi untuk mengambil status fan
  const fetchFanStatus = useCallback(async () => {
    try {
      const response = await axios.get(FAN_ENDPOINTS.STATUS(1));
      
      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;
        
        setSensorData(prev => ({
          ...prev,
          fan1: Boolean(parseInt(data.fan1 || 0)),
          lamp1: Boolean(parseInt(data.lamp1 || 0))
        }));
      }
    } catch (error) {
      console.error(`Error fetching fan status:`, error);
    }
  }, []);

  // Fungsi untuk mengambil pengaturan ideal
  const fetchSettings = useCallback(async () => {
    try {
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
      console.error(`Error fetching settings:`, error);
    }
  }, []);

  // Fungsi untuk mengontrol status fan
  const toggleFan = async (fanNumber) => {
    try {
      const newFanStatus = !sensorData[fanNumber];
      const payload = {
        room_id: 1,
        fan1: fanNumber === 'fan1' ? (newFanStatus ? 1 : 0) : (sensorData.fan1 ? 1 : 0),
        lamp1: fanNumber === 'lamp1' ? (newFanStatus ? 1 : 0) : (sensorData.lamp1 ? 1 : 0)
      };
      await axios.put(FAN_ENDPOINTS.CONTROL, payload);
      // Setelah update, langsung fetch status dari backend
      await fetchFanStatus();
    } catch (error) {
      console.error(`Error toggling ${fanNumber}:`, error);
      
      // Kembalikan state jika gagal
      setSensorData(prev => ({
        ...prev,
        [fanNumber]: !prev[fanNumber]
      }));
    }
  };

  // Effect untuk mengambil semua data awal
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        await fetchSensorData();
        await fetchHistoricalData();
        await fetchFanStatus();
        await fetchSettings();
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Terjadi kesalahan saat mengambil data awal');
        
        // Tambahkan log error lebih detail
        if (error.response) {
          console.error('Error response:', error.response.status, error.response.data);
          
          // Jika error bukan 401 unauthorized, tetap tampilkan halaman dengan pesan error
          // Error 401 akan ditangani oleh interceptor axios
          if (error.response.status !== 401) {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } finally {
        // Set loading false hanya jika tidak ada error 401
        if (!error || !error.response || error.response.status !== 401) {
          setIsLoading(false);
        }
      }
    };
    
    fetchAllData();
    
    // Set interval untuk polling data
    const sensorInterval = setInterval(fetchSensorData, 5000);
    const fanInterval = setInterval(fetchFanStatus, 5000);
    
    // Cleanup interval saat komponen unmount
    return () => {
      clearInterval(sensorInterval);
      clearInterval(fanInterval);
    };
  }, [fetchSensorData, fetchHistoricalData, fetchFanStatus, fetchSettings]);

  // Menentukan status suhu berdasarkan pengaturan ideal
  const isTempTooHigh = sensorData.temp > settings.ideal_temp_max;
  const isTempTooLow = sensorData.temp < settings.ideal_temp_min;

  // Menentukan status kelembaban berdasarkan pengaturan ideal
  const isHumidityTooHigh = sensorData.humy > settings.ideal_humy_max;
  const isHumidityTooLow = sensorData.humy < settings.ideal_humy_min;

  // Menentukan warna dan pesan untuk tampilan
  const getTempStatusColor = () => {
    if (isTempTooHigh) return 'text-red-600 dark:text-red-300';
    if (isTempTooLow) return 'text-blue-600 dark:text-blue-300';
    return 'text-green-600 dark:text-green-300';
  };

  const getTempStatusBg = () => {
    if (isTempTooHigh) return 'bg-red-100 dark:bg-red-900';
    if (isTempTooLow) return 'bg-blue-100 dark:bg-blue-900';
    return 'bg-green-100 dark:bg-green-900';
  };

  const getTempIconColor = () => {
    if (isTempTooHigh) return 'text-red-500';
    if (isTempTooLow) return 'text-blue-500';
    return 'text-green-500';
  };

  const getTempStatusText = () => {
    if (isTempTooHigh) return 'Terlalu Panas';
    if (isTempTooLow) return 'Terlalu Dingin';
    return 'Normal';
  };

  const getHumidityStatusColor = () => {
    if (isHumidityTooHigh) return 'text-blue-600 dark:text-blue-300';
    if (isHumidityTooLow) return 'text-orange-600 dark:text-orange-300';
    return 'text-green-600 dark:text-green-300';
  };

  const getHumidityStatusBg = () => {
    if (isHumidityTooHigh) return 'bg-blue-100 dark:bg-blue-900';
    if (isHumidityTooLow) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-green-100 dark:bg-green-900';
  };

  const getHumidityIconColor = () => {
    if (isHumidityTooHigh) return 'text-blue-500';
    if (isHumidityTooLow) return 'text-orange-500';
    return 'text-green-500';
  };

  const getHumidityStatusText = () => {
    if (isHumidityTooHigh) return 'Terlalu Lembab';
    if (isHumidityTooLow) return 'Terlalu Kering';
    return 'Normal';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
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
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Header dengan nama room */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 mx-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Greenhouse Utama</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sistem monitoring greenhouse utama</p>
        </div>
        
        {/* Main Content - Sensor Display */}
        <div className="flex flex-col md:flex-row mb-3 space-y-3 md:space-y-0 md:space-x-3 px-2">
          {/* Suhu Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 w-full md:w-1/4">
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-bold text-blue-500 leading-none">
                {sensorData.temp}<span className="text-2xl md:text-3xl ml-1">°C</span>
              </div>
              <div className="flex items-center mt-2">
                <div className="text-blue-500 mr-1">
                  <FaTemperatureLow className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Suhu Udara</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col w-full md:w-2/4 justify-between space-y-3 md:space-y-0">
            <div className="flex space-x-3 mb-2">
              {/* Status Suhu */}
              <div className={`${getTempStatusBg()} rounded-2xl shadow-md p-3 h-12 flex-1 flex items-center justify-center`}>
                <div className={`${getTempIconColor()} mr-2`}>
                  <FaTemperatureLow className="h-5 w-5" />
                </div>
                <div className={`text-sm font-medium ${getTempStatusColor()}`}>
                  {getTempStatusText()} ({settings.ideal_temp_min}-{settings.ideal_temp_max}°C)
                </div>
              </div>

              {/* Status Kelembapan */}
              <div className={`${getHumidityStatusBg()} rounded-2xl shadow-md p-3 h-12 flex-1 flex items-center justify-center`}>
                <div className={`${getHumidityIconColor()} mr-2`}>
                  <FaWater className="h-5 w-5" />
                </div>
                <div className={`text-sm font-medium ${getHumidityStatusColor()}`}>
                  {getHumidityStatusText()} ({settings.ideal_humy_min}-{settings.ideal_humy_max}%)
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-2">
              {/* Fan 1 Control */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <button
                      onClick={() => toggleFan('fan1')}
                      className={`relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${sensorData.fan1 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-300 shadow-md transition-transform duration-200 ease-in-out ${sensorData.fan1 ? 'translate-x-9' : 'translate-x-1'}`}
                      />
                      <span className={`absolute ${sensorData.fan1 ? 'left-1.5 text-white' : 'right-1.5 text-gray-600 dark:text-gray-300'} text-xs font-medium`}>
                        {sensorData.fan1 ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">FAN 1</div>
                  </div>
                </div>
              </div>

              {/* Fan 2 Control */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <button
                      onClick={() => toggleFan('lamp1')}
                      className={`relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${sensorData.lamp1 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-300 shadow-md transition-transform duration-200 ease-in-out ${sensorData.lamp1 ? 'translate-x-9' : 'translate-x-1'}`}
                      />
                      <span className={`absolute ${sensorData.lamp1 ? 'left-1.5 text-white' : 'right-1.5 text-gray-600 dark:text-gray-300'} text-xs font-medium`}>
                        {sensorData.lamp1 ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">LAMP 1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kelembapan Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 w-full md:w-1/4">
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-bold text-green-500 leading-none">
                {sensorData.humy}<span className="text-2xl md:text-3xl ml-1">%</span>
              </div>
              <div className="flex items-center mt-2">
                <div className="text-green-500 mr-1">
                  <FaWater className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Kelembapan Udara</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
          {/* Suhu Chart */}
          <SensorChart
            title="Grafik Suhu"
            labels={chartData.labels}
            data={chartData.tempData}
            label="Suhu (°C)"
            borderColor="rgb(59, 130, 246)"
            backgroundColor="rgba(59, 130, 246, 0.5)"
            minY={0}
            maxY={100}
            stepSize={10}
          />

          {/* Kelembapan Chart */}
          <SensorChart
            title="Grafik Kelembapan"
            labels={chartData.labels}
            data={chartData.humyData}
            label="Kelembapan (%)"
            borderColor="rgb(16, 185, 129)"
            backgroundColor="rgba(16, 185, 129, 0.5)"
            minY={0}
            maxY={100}
            stepSize={10}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoomSensorPage;
