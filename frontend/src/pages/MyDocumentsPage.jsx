import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentStatusTable from '../components/dashboard/DocumentStatusTable';

const MyDocumentsPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic User ID Logic
  const userId = localStorage.getItem("userId") || "694cbf278e07deb8dfe00958"; 

    // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear(); // Clears userId and any other session data
      navigate("/"); // Redirects to login page
    }
  };
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // FETCH: Get User Profile (Backend must .populate('linkedLicense').populate('linkedVehicles'))
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();
        
        if (userRes.ok) {
          setUserData(user);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [userId]);

  // LOGIC: Check for any expired vehicles in the linked array
  const expiredVehicles = userData?.linkedVehicles?.filter(v => 
    v.bluebookExpiry && new Date(v.bluebookExpiry) < new Date()
  ) || [];

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link active">📄 My Documents</Link>
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

      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0 fw-bold">MY DOCUMENTS</h4>
          <div className="header-user d-flex align-items-center">
            <span className="me-3 fw-medium text-uppercase small">
              {userData?.fullName || "User"}
            </span>
            <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
              {userData?.fullName ? userData.fullName.charAt(0) : "U"}
            </div>
          </div>
        </header>

        <div className="content-body">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Loading secure vault...</p>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                
                {/* DYNAMIC REMINDER: List all expired vehicles */}
                {expiredVehicles.length > 0 && (
                  <section className="card border-0 shadow-sm p-4 mb-4 bg-danger-subtle border-start border-danger border-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 fw-bold text-danger m-0">🔔 Active Reminders</h3>
                      <span className="badge bg-danger px-3 py-2">
                        {expiredVehicles.length} Overdue
                      </span>
                    </div>
                    {expiredVehicles.map((veh, idx) => (
                      <div key={idx} className="alert border-0 bg-white text-danger mb-2 py-2 shadow-sm">
                        <span className="fw-bold">🚨 Attention:</span> Bluebook for <strong>{veh.vehicleNumber}</strong> expired on {new Date(veh.bluebookExpiry).toLocaleDateString()}.
                      </div>
                    ))}
                  </section>
                )}

                {/* DOCUMENT TABLE: Passing full user object which contains license and vehicle arrays */}
                <section className="card border-0 shadow-sm p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h5 fw-bold text-dark m-0">Official Document Records</h3>
                    
                  </div>
                  
                  {/* Logic: Show table if any document data exists */}
                  {userData?.linkedLicense || userData?.linkedVehicles?.length > 0 || userData?.citizenshipNumber ? (
                    <DocumentStatusTable user={userData} />
                  ) : (
                    <div className="text-center py-5">
                      <p className="text-muted">No verified documents found.</p>
                      <Link to="/verification-form" className="btn btn-primary btn-sm">Start Verification</Link>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyDocumentsPage;