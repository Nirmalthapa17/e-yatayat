// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboardPage';
// Ensure you have created this page file as well
import MyDocumentsPage from './pages/MyDocumentsPage'; 
import VehiclesPage from './pages/VehiclesPage'; 
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import VerificationForm from './components/VerificationForm';
import UserDashboardPage from './pages/UserDashboardPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        
          <Routes>
            {/* Define the paths for your pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<UserDashboard />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/documents" element={<MyDocumentsPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile-details" element={<ProfileDetailPage />} />
            <Route path="/verification-form" element={<VerificationForm />} />
          </Routes>
    

        <footer className="footer">
          <p>&copy; 2025 e-Yatayat Project</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;