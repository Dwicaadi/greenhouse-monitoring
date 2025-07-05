import React from 'react';

const FanControl = ({ label, isOn, onToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6">
      <div className="flex flex-col items-center">
        <div className="bg-white dark:bg-gray-700 rounded-full shadow-sm px-4 py-1 mb-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <div className={`h-3 w-3 ${label === 'FAN 1' ? 'bg-blue-500' : 'bg-green-500'} rounded-full mr-1`}></div>
            Ideal
          </div>
        </div>
        
        <div className="w-full flex justify-center mb-2">
          <button
            onClick={onToggle}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-300 shadow-md transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-9' : 'translate-x-1'}`}
            />
            <span className={`absolute ${isOn ? 'left-2 text-white' : 'right-2 text-gray-600 dark:text-gray-300'} text-xs font-medium`}>
              {isOn ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
        
        <div className="text-center mt-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default FanControl;