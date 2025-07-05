import React from 'react';
import SensorCard from './SensorCard';
import FanControl from './FanControl';

const SensorDisplay = ({ sensorData, onToggleFan }) => {
  const { temp, humy, fan1, fan2, lastUpdate } = sensorData;

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Terakhir diperbarui: {lastUpdate}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Suhu Card */}
        <SensorCard
          value={temp}
          unit="°C"
          label="Suhu Udara"
          color="blue"
        />

        {/* Kelembapan Card */}
        <SensorCard
          value={humy}
          unit="%"
          label="Kelembapan Udara"
          color="green"
        />

        {/* Fan Controls */}
        <FanControl
          label="FAN 1"
          isOn={fan1}
          onToggle={() => onToggleFan('fan1')}
        />
        <FanControl
          label="FAN 2"
          isOn={fan2}
          onToggle={() => onToggleFan('fan2')}
        />
      </div>
    </>
  );
};

export default SensorDisplay;
