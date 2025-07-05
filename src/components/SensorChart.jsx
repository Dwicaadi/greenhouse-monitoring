import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorChart = ({ 
  title, 
  labels, 
  data, 
  label, 
  borderColor = 'rgb(59, 130, 246)', 
  backgroundColor = 'rgba(59, 130, 246, 0.5)',
  minY = 0,
  maxY = 100,
  stepSize = 10
}) => {
  // Cek apakah tema gelap aktif
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151' // gray-200 : gray-700
        }
      },
      title: {
        display: true,
        text: title,
        color: isDarkMode ? '#e5e7eb' : '#374151' // gray-200 : gray-700
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          autoSkip: false,
          stepSize: 10,
          major: true,
          minor: false,
          precision: 0,
          suggestedMin: 0,
          suggestedMax: 100,
          callback: function(value) {
            const values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
            return values.includes(value) ? value : '';
          },
          color: isDarkMode ? '#9ca3af' : '#6b7280' // gray-400 : gray-500
        },
        grid: {
          tickLength: 10,
          display: true,
          color: isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.5)' // gray-400 alpha : gray-300 alpha
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280' // gray-400 : gray-500
        }
      }
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        tension: 0.1,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: borderColor,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" style={{ height: '300px' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default SensorChart;
