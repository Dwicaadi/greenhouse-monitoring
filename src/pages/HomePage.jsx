import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../layouts/DashboardLayout';
import axios from '../api/axios';
import { ROOM_ENDPOINTS } from '../api/endpoints';

const HomePage = () => {
  // Ganti dengan tampilan data sensor/fan untuk room_id=1 saja
  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Greenhouse Utama</h1>
        {/* Tambahkan komponen/summary sensor/fan di sini jika perlu */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Sistem monitoring hanya untuk Greenhouse Utama (room_id=1).
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage; 