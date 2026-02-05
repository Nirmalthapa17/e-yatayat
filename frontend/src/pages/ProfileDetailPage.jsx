import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SmartCard from '../components/dashboard/SmartCard';
import QRModal from '../components/dashboard/QRModal';

const ProfileDetailPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); 

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!userId) {
        navigate("/"); 
        return;
      }
      try {
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();
        setUserData(user);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, [userId, navigate]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted fw-bold">Opening Digital Wallet...</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand p-3">
            <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/document" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Info and Rate</Link>
        </nav>
        <div className="mt-auto p-3 border-top">
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
            <span>Logout</span>
            <i className="bi bi-box-arrow-right"></i> 
          </button>
        </div>
      </aside>

      <main className="main-content p-4">
        <header className="content-header d-flex justify-content-between align-items-center mb-4">
            <div>
                <Link to="/dashboard" className="text-decoration-none small text-muted">← Back to Dashboard</Link>
                <h2 className="display-6 fw-bold m-0 mt-1">Digital Wallet</h2>
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-primary shadow-sm px-4" style={{ minWidth: "180px" }} onClick={() => setIsModalOpen(true)}>
                    📱 Show QR ID
                </button>
                <button className="btn btn-outline-dark shadow-sm" onClick={() => window.print()}>Print</button>
            </div>
        </header>

        <div className="content-body">
          <div className="row">
            {/* --- LICENSE SECTION --- */}
            <div className="col-lg-6 mb-4">
              <h5 className="text-muted small fw-bold text-uppercase mb-3">Driver Identity</h5>
              {userData?.linkedLicense ? (
                <SmartCard 
                  type="license" 
                  data={{
                    name: userData.linkedLicense.fullName,
                    number: userData.linkedLicense.licenseNumber,
                    categories: userData.linkedLicense.categories?.join(", ") || "A, B",
                    expiry: userData.linkedLicense.expiryDate,
                    bloodGroup: userData.linkedLicense.bloodGroup
                  }} 
                  colorClass="bg-primary shadow"
                />
              ) : (
                <div className="card p-5 text-center border-dashed bg-white rounded-4 shadow-sm">
                    <p className="text-muted mb-2">License not verified.</p>
                    <Link to="/verification-form" className="btn btn-outline-primary btn-sm mx-auto rounded-pill px-4">Link Now</Link>
                </div>
              )}
            </div>
            
            {/* --- VEHICLES SECTION --- */}
            <div className="col-lg-6 mb-4">
              <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
              
              {userData?.linkedVehicles && userData.linkedVehicles.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {/* Map through all linked vehicles */}
                  {userData.linkedVehicles.map((vehicle, index) => (
                    <SmartCard 
                      key={vehicle.vehicleNumber || index}
                      type="bluebook" 
                      data={{
                        name: vehicle.ownerName,
                        number: vehicle.vehicleNumber,
                        model: vehicle.vehicleType,
                        engine: vehicle.engineNumber,
                        expiry: vehicle.taxExpiryDate
                      }} 
                      colorClass="bg-success shadow"
                    />
                  ))}
                  
                  <div className="mt-2 text-center">
                    <Link 
  to="/verification-form" 
  className="btn btn-outline-success border-2 shadow-sm fw-bold rounded-3 d-flex align-items-center justify-content-center"
  style={{ 
    padding: '15px',      // Equal padding creates a better box shape
    fontSize: '1.1rem', 
    width: '20%',        // Fills the column width
    minHeight: '50px',   // Ensures it feels like a substantial box
     // Optional: standard UI look for "Add" slots
  }}
>
  + Add
</Link>
                  </div>
                </div>
              ) : (
                <div className="card p-5 text-center border-dashed bg-white rounded-4 shadow-sm">
                    <p className="text-muted mb-2">No vehicle linked.</p>
                    <Link to="/verification-form" className="btn btn-outline-success btn-sm mx-auto rounded-pill px-4">Link Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && userData && (
        <QRModal user={userData} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfileDetailPage;