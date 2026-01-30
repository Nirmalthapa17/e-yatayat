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
import PublicVerify from './pages/PublicVerify';
import ProtectedRoute from './components/ProtectedRoute';
import LicenseRenewForm from './pages/LicenseRenewForm';
import BluebookRenewForm from './pages/BluebookRenewForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        
          <Routes>
            {/* Define the paths for your pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify/user/:userId" element={<PublicVerify />} />
            <Route path="/dashboard" element={ <ProtectedRoute> <UserDashboardPage /> </ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute> <MyDocumentsPage /> </ProtectedRoute>} />
            <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /> </ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /> </ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile-details" element={<ProfileDetailPage />} />
            <Route path="/verification-form" element={<VerificationForm />} />
            <Route path="/verify/user/:userId" element={<PublicVerify />} />
            <Route path="/renew-license" element={<LicenseRenewForm />} />
            <Route path="/renew-bluebook" element={<BluebookRenewForm />} />
          </Routes>
    

        <footer className="footer">
          <p>&copy; 2025 e-Yatayat Project</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;