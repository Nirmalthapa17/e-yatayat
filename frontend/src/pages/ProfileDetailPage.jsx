import React from 'react';
import { Link } from 'react-router-dom'; // Required for the back button
import SmartCard from '../components/dashboard/SmartCard';

const ProfileDetailPage = () => {
  const licenseData = {
    fullName: "NIRMAL THAPA",
    licenseNo: "01-09-88776655",
    categories: "A, B",
    bloodGroup: "B+VE",
    expiry: "2029-12-24"
  };

  const myVehicles = [
    { 
        id: 1,
        owner: "NIRMAL THAPA", 
        plateNo: "BA 15 PA 1234", 
        model: "Pulsar 220F", 
        engine: "E220-998877", 
        expiry: "2025-05-10" 
    }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* 1. SIDEBAR - Keeps navigation accessible */}
      <aside className="sidebar">
        <div className="sidebar-brand">
            <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center">
            <div>
                <Link to="/" className="text-decoration-none small text-muted">← Back to Dashboard</Link>
                <h2 className="display-6 fw-bold m-0 mt-1">Digital Wallet</h2>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                🖨️ Print Documents
            </button>
        </header>

        <div className="content-body">
          <div className="row">
            {/* Driver Identity (One Card) */}
            <div className="col-lg-6 mb-4">
              <h5 className="text-muted small fw-bold text-uppercase mb-3">Driver Identity</h5>
              <SmartCard type="license" data={licenseData} />
            </div>
            
            {/* Vehicle Ownership (List of Cards) */}
            <div className="col-lg-6">
              <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
              {myVehicles.map(vehicle => (
                <SmartCard key={vehicle.id} type="bluebook" data={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetailPage;