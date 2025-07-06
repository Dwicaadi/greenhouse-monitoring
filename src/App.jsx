import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import RoomSensorPage from './pages/RoomSensorPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        {/* Home Page / Dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Navigate to="/room-sensor/1" replace />
          </PrivateRoute>
        } />
        
        {/* Room Sensor Routes - Dinamis */}
        <Route path="/room-sensor/:roomId" element={
          <PrivateRoute>
            <RoomSensorPage />
          </PrivateRoute>
        } />
        
        {/* Kompatibilitas untuk URL lama */}
        <Route path="/room-sensor-1" element={
          <PrivateRoute>
            <RoomSensorPage roomId={1} />
          </PrivateRoute>
        } />
        
        {/* Manage Rooms */}
        {/* <Route path="/manage-rooms" element={
          <PrivateRoute>
            <ManageRoomsPage />
          </PrivateRoute>
        } /> */}
        
        {/* Profile Routes */}
        <Route path="/pengaturan" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        
        {/* Redirect root to login instead of dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all other routes and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
