import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SmartCard from '../components/dashboard/SmartCard';

const ProfileDetailPage = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // LOGIC: Get the actual logged-in user ID from localStorage
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!userId) {
        navigate("/"); // Redirect to login if no session found
        return;
      }

      try {
        // 1. Get User Profile with populated data
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();
        setUserData(user);

        // 2. Logic: Use populated linkedVehicles instead of searching by number
        if (user.linkedVehicles && user.linkedVehicles.length > 0) {
          setVehicleData(user.linkedVehicles[0]); // Display the first linked vehicle
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, [userId, navigate]);

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
      <aside className="sidebar">
        <div className="sidebar-brand">
            <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/document" className="nav-link ">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center mb-4">
            <div>
                <Link to="/dashboard" className="text-decoration-none small text-muted">← Back to Dashboard</Link>
                <h2 className="display-6 fw-bold m-0 mt-1">Digital Wallet</h2>
            </div>
            <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>
                🖨️ Print Documents
            </button>
        </header>

        <div className="content-body">
          <div className="row">
            
            {/* LOGIC: Render License if linkedLicense object exists */}
            {userData?.linkedLicense ? (
              <div className="col-lg-6 mb-4">
                <h5 className="text-muted small fw-bold text-uppercase mb-3">Driver Identity</h5>
                <SmartCard 
                  type="license" 
                  data={{
                    name: userData.linkedLicense.fullName,
                    number: userData.linkedLicense.licenseNumber,
                    categories: userData.linkedLicense.categories?.join(", ") || "A, B",
                    expiry: userData.linkedLicense.expiryDate,
                    bloodGroup:userData.linkedLicense.bloodGroup
                  }} 
                  colorClass="bg-primary shadow"
                />
            
              </div>
            ) : (
              <div className="col-lg-6 mb-4">
                <h5 className="text-muted small fw-bold text-uppercase mb-3">Driver Identity</h5>
                <div className="card p-5 text-center border-dashed bg-light">
                    <p className="text-muted small">License not verified.</p>
                    <Link to="/verification-form" className="btn btn-primary btn-sm mx-auto">Verify License</Link>
                </div>
              </div>
            )}
            
            {/* LOGIC: Render Vehicle if vehicleData is found */}
            {vehicleData ? (
              <div className="col-lg-6 mb-4">
                <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
                <SmartCard 
                    type="bluebook" 
                    data={{
                        owner: userData?.fullName || "Owner",
                        number: vehicleData.vehicleNumber,
                        model: vehicleData.vehicleType || "Motorcycle",
                        engine: vehicleData.engineNumber,
                        expiry: vehicleData.taxExpiryDate
                    }} 
                    colorClass="bg-success shadow"
                />
                <div className="mt-4 text-center">
    <Link 
        to="/verification-form" 
        className="btn btn-success btn-lg shadow-sm px-5 fw-bold" 
        style={{ 
            padding:10,
            borderRadius: '12px', 
            letterSpacing: '0.5px',
            fontSize: '1rem',
            minWidth: '200px' 
          
        }}
    >
        + Add New
    </Link>
</div>
              </div>
            ) : (
                <div className="col-lg-6 mb-4">
                    <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
                    <div className="card p-5 text-center border-dashed bg-light">
                        <p className="text-muted small">No vehicles linked.</p>
                        <Link to="/verification-form" className="btn btn-primary btn-sm mx-auto">Link Vehicle</Link>
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