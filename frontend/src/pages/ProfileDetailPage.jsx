import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SmartCard from '../components/dashboard/SmartCard';

const ProfileDetailPage = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded ID for testing (Nirmal)
  const userId = "694cbf278e07deb8dfe00958"; 

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // 1. Get User Profile
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();
        setUserData(user);

        // 2. Get Vehicle Master only if user has a vehicleNumber
        if (user && user.vehicleNumber) {
          const vehRes = await fetch(`http://localhost:5000/api/user/vehicle-info/${user.vehicleNumber}`);
          if (vehRes.ok) {
            const vehicle = await vehRes.json();
            setVehicleData(vehicle);
          }
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Opening Digital Wallet...</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
            <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/profile-wallet" className="nav-link active">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center mb-4">
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
            
            {/* LOGIC: Render License Section only if licenseNumber exists */}
            {userData?.licenseNumber && (
              <div className="col-lg-6 mb-4">
                <h5 className="text-muted small fw-bold text-uppercase mb-3">Driver Identity</h5>
                <SmartCard 
                  type="license" 
                  data={{
                    name: userData.fullName,
                    number: userData.licenseNumber,
                    categories: "A, B", // Placeholder or fetch from DB
                    bloodGroup: "B+VE",   // Placeholder or fetch from DB
                    expiry: "2029-12-24" 
                  }} 
                  colorClass="bg-primary"
                />
              </div>
            )}
            
            {/* LOGIC: Render Vehicle Section only if vehicleData is found */}
            {vehicleData && (
              <div className="col-lg-6 mb-4">
                <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
                <SmartCard 
                    type="bluebook" 
                    data={{
                        owner: userData?.fullName || "Owner",
                        number: vehicleData.vehicleNumber,
                        model: vehicleData.model,
                        engine: vehicleData.engineNumber,
                        expiry: new Date(vehicleData.expiryDate).toLocaleDateString()
                    }} 
                    colorClass={new Date(vehicleData.expiryDate) < new Date() ? 'bg-danger' : 'bg-success'}
                />
              </div>
            )}

            {/* FALLBACK: If neither is found */}
            {!userData?.licenseNumber && !vehicleData && (
              <div className="col-12 text-center py-5">
                <div className="alert alert-light border">
                  <p className="mb-0 text-muted">No digital documents found. Please complete your verification.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetailPage;