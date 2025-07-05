import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({
    backend: null,
    api: null,
    cors: null
  });
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    try {
      const response = await axios.get('https://api-iot.wibudev.moe/api/test', {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return {
        status: 'success',
        data: response.data,
        statusCode: response.status,
        url: 'https://api-iot.wibudev.moe/api/test'
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        statusCode: error.response?.status || 'Network Error',
        url: 'https://api-iot.wibudev.moe/api/test'
      };
    }
  };

  const testApiEndpoints = async () => {
    const endpoints = [
      { name: 'Test', url: '/api/test' },
      { name: 'Sensor Latest', url: '/api/sensor/latest' },
      { name: 'Fan Status', url: '/api/fan/status' },
      { name: 'Dashboard', url: '/api/dashboard' }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`https://api-iot.wibudev.moe${endpoint.url}`, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        results.push({
          name: endpoint.name,
          status: 'success',
          statusCode: response.status,
          url: endpoint.url,
          data: response.data
        });
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          url: endpoint.url,
          error: error.message
        });
      }
    }
    
    return results;
  };

  const testCorsSettings = async () => {
    try {
      const response = await fetch('https://api-iot.wibudev.moe/api/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      };
      
      return {
        status: 'success',
        statusCode: response.status,
        corsHeaders: corsHeaders,
        origin: window.location.origin
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        origin: window.location.origin
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    
    try {
      const [backendResult, apiResults, corsResult] = await Promise.all([
        testBackendConnection(),
        testApiEndpoints(),
        testCorsSettings()
      ]);
      
      setTestResults({
        backend: backendResult,
        api: apiResults,
        cors: corsResult
      });
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              🔍 API Connection Test
            </h1>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '⏳ Testing...' : '🔄 Refresh Tests'}
            </button>
          </div>

          {/* Backend Connection Test */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">🌐 Backend Connection</h2>
            {testResults.backend ? (
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.backend.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {testResults.backend.status === 'success' ? '✅ Connected' : '❌ Failed'}
                  </span>
                  <span className="text-sm">
                    Status: {testResults.backend.statusCode}
                  </span>
                </div>
                <p className="text-sm mb-2">URL: {testResults.backend.url}</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.backend.data || testResults.backend.error, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">Loading...</div>
            )}
          </div>

          {/* API Endpoints Test */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">🎯 API Endpoints</h2>
            {testResults.api ? (
              <div className="grid gap-4">
                {testResults.api.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {result.status === 'success' ? '✅' : '❌'} {result.name}
                      </span>
                      <span className="text-sm">
                        Status: {result.statusCode}
                      </span>
                    </div>
                    <p className="text-sm mb-2">URL: {result.url}</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">Loading...</div>
            )}
          </div>

          {/* CORS Test */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">🛡️ CORS Configuration</h2>
            {testResults.cors ? (
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.cors.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {testResults.cors.status === 'success' ? '✅ CORS OK' : '❌ CORS Failed'}
                  </span>
                  <span className="text-sm">
                    Status: {testResults.cors.statusCode}
                  </span>
                </div>
                <p className="text-sm mb-2">Origin: {testResults.cors.origin}</p>
                {testResults.cors.corsHeaders && (
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.cors.corsHeaders, null, 2)}
                  </pre>
                )}
                {testResults.cors.error && (
                  <p className="text-sm text-red-600 mt-2">Error: {testResults.cors.error}</p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">Loading...</div>
            )}
          </div>

          {/* Configuration Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Configuration</h3>
            <div className="text-sm text-blue-700">
              <p><strong>Frontend URL:</strong> {window.location.origin}</p>
              <p><strong>Backend URL:</strong> https://api-iot.wibudev.moe</p>
              <p><strong>Environment:</strong> {import.meta.env.VITE_ENVIRONMENT || 'production'}</p>
              <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://api-iot.wibudev.moe'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
