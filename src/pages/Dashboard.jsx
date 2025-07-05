import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { SENSOR_ENDPOINTS, FAN_ENDPOINTS } from '../api/endpoints';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [fanStatus, setFanStatus] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Ambil data sensor
      const sensorRes = await axios.get(SENSOR_ENDPOINTS.LATEST(1));
      const fanRes = await axios.get(FAN_ENDPOINTS.STATUS(1));
      // Data chart (history) bisa diabaikan jika backend belum support, atau gunakan polling data terbaru saja
      const temp = sensorRes.data?.data?.temp || 0;
      const humy = sensorRes.data?.data?.humy || 0;
      const fan = fanRes.data?.status ?? 0;
      setTemperature(temp);
      setHumidity(humy);
      setFanStatus(fan);
      // Update chart (dummy, hanya 1 titik)
      setChartData(prev => ({
        labels: [...prev.labels, new Date().toLocaleTimeString()].slice(-10),
        datasets: [
          { ...prev.datasets[0], data: [...prev.datasets[0].data, temp].slice(-10) },
          { ...prev.datasets[1], data: [...prev.datasets[1].data, humy].slice(-10) }
        ]
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const toggleFan = async () => {
    try {
      // Tidak ada endpoint kontrol fan di sensor.php, jadi hanya update state lokal
      setFanStatus(fanStatus === 0 ? 1 : 0);
    } catch (error) {
      console.error('Error toggling fan:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="info-grid">
        <div className="info-card temperature">
          <h3>Suhu</h3>
          <div className="value">{temperature}°C</div>
          <div className="ideal-range">
            Ideal: 21-27°C
          </div>
        </div>
        <div className="info-card humidity">
          <h3>Kelembaban</h3>
          <div className="value">{humidity}%</div>
          <div className="ideal-range">
            Ideal: 60-70%
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 10,
                },
              },
            },
          }}
        />
      </div>

      <div className="fan-control">
        <h3>Kontrol Fan</h3>
        <button onClick={toggleFan} className={`fan-btn ${fanStatus === 1 ? 'on' : 'off'}`}>
          {fanStatus === 1 ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
