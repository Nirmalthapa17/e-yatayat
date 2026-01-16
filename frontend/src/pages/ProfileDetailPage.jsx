import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SmartCard from '../components/dashboard/SmartCard';
import QRModal from '../components/dashboard/QRModal';

const ProfileDetailPage = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); 

    // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear(); // Clears userId and any other session data
      navigate("/"); // Redirects to login page
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

        if (user.linkedVehicles && user.linkedVehicles.length > 0) {
          setVehicleData(user.linkedVehicles[0]);
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
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
        {/* --- LOGOUT BUTTON AT SIDEBAR BOTTOM --- */}
        <div className="mt-auto p-3 border-top">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
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
    {/* Added 'w-auto' and increased padding to 'px-5' for a longer look */}
    <button 
        className="btn btn-primary shadow-sm px-7" 
        style={{ minWidth: "180px" }}
        onClick={() => setIsModalOpen(true)}
    >
        📱 Show QR ID
    </button>
                <button className="btn btn-outline-dark shadow-sm" onClick={() => window.print()}>
                    Print
                </button>
            </div>
        </header>

        <div className="content-body">
          <div className="row">
            {/* License Card */}
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
            
            {/* Vehicle Card */}
            <div className="col-lg-6 mb-4">
              <h5 className="text-muted small fw-bold text-uppercase mb-3">Vehicle Ownership</h5>
              {vehicleData ? (
                <>
                  <SmartCard 
                      type="bluebook" 
                      data={{
                          owner: `${userData?.firstName} ${userData?.lastName}`,
                          number: vehicleData.vehicleNumber,
                          model: vehicleData.vehicleType,
                          engine: vehicleData.engineNumber,
                          expiry: vehicleData.taxExpiryDate
                      }} 
                      colorClass="bg-success shadow"
                  />
                  <div className="mt-4 text-center">
                    <Link to="/verification-form" className="btn btn-success shadow-sm px-5 fw-bold rounded-3">
                      Add
                    </Link>
                  </div>
                </>
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

      {/* Modal only renders when state is true and data is ready */}
      {isModalOpen && userData && (
        <QRModal 
          user={userData} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProfileDetailPage;