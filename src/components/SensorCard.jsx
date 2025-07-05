import React from 'react';
import { FaTemperatureLow, FaWater } from 'react-icons/fa';

const SensorCard = ({ value, unit, label, color, size = 'normal' }) => {
  // Warna sudah diatur langsung di JSX

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-3',
          value: 'text-3xl',
          unit: 'text-lg',
          label: 'text-xs'
        };
      case 'normal':
      default:
        return {
          container: 'p-6',
          value: 'text-5xl',
          unit: 'text-2xl',
          label: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClass();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-sm ${sizeClasses.container} flex flex-col items-center justify-center`}>
      <div className={`${sizeClasses.value} font-bold mb-2 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}>
        {value}
        <span className={`${sizeClasses.unit} ml-1`}>{unit}</span>
      </div>
      <div className="flex items-center mt-2">
        <div className={`mr-1 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}>
          {color === 'blue' ? <FaTemperatureLow className="h-5 w-5" /> : <FaWater className="h-5 w-5" />}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">{label}</div>
      </div>
    </div>
  );
};

export default SensorCard;