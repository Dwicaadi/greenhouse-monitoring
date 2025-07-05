import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'chart.js'],
          charts: ['react-chartjs-2']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    // Ensure history API fallback for SPA routing
    historyApiFallback: true,
    // Add CORS headers
    cors: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost/TA/backend',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔥 Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 Proxy Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Proxy Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy auth requests to backend
      '/src/auth': {
        target: 'http://localhost/TA/backend',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔥 Auth Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 Auth Proxy Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Auth Proxy Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
