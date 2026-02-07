import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePreview from '../components/dashboard/ProfilePreview'; 
import RenewalButtons from '../components/dashboard/RenewalButtons';
import LicenseRenewForm from './LicenseRenewForm'; // Ensure path is correct
import BluebookRenewForm from './BluebookRenewForm';
import Chatbot from '../components/chatbot';
const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    let isMounted = true; // Prevents updating state on unmounted component
    const fetchDashboardData = async () => {
      // Only navigate away if we are 100% sure there is no userId
    const storedId = localStorage.getItem("userId");
    if (!storedId) {
      navigate("/");
      return;
    }

      try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        if (response.ok) {
        const data = await response.json();
        if (isMounted) setUserData(data);
      } else if (response.status === 401) {
        // Only kick out if the token/session is actually invalid
        localStorage.clear();
        navigate("/");
      }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboardData();
  return () => { isMounted = false; }; // Cleanup
}, [navigate]); // Only runs once on load

  // CSS for button alignment and overflow prevention
  const styles = {
    buttonsWrapper: {
      display: 'flex',
      flexWrap: 'wrap', // Allows buttons to move to the next line on small screens
      justifyContent: 'center',
      gap: '15px', // Adds even spacing between buttons
      width: '100%',
      padding: '10px 0'
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Info and Rate</Link>
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
        <header className="content-header">
          <div className="header-search">
            <input type="text" placeholder="Search for documents..." className="form-control" />
          </div>
          <div className="header-user">
            <span className="me-3 fw-medium">{userData?.fullName || "Loading..."}</span>
            <div className="avatar-circle">
              {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold m-0">Welcome, {userData?.fullName?.split(' ')[0] || "User"}!</h1>
              <p className="text-muted m-0 small">Here is what's happening with your vehicles today.</p>
            </div>
            <span className="badge bg-light text-dark border p-2">
              📅 {new Date().toLocaleDateString()}
            </span>
          </div>

          {loading ? (
            <div className="text-center p-5">
               <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4 align-items-start"> 
              
              <div className="col-lg-4">
                <section className="card border-0 shadow-sm p-4 mb-4">
                  <h3 className="h5 fw-bold text-primary mb-4 text-center">User Profile</h3>
                  <ProfilePreview user={userData} /> 
                </section>
              </div>

              <div className="col-lg-8"> 
                <h3 className="h6 text-uppercase fw-bold text-muted mb-2">Quick Renewal Services</h3>
                <p className="small text-muted">Access to renewal forms is granted upon successful verification.</p>
                
                <section className="renewal-action-card card border-0 shadow-sm p-4 text-center mb-4">
                   <div className="renewal-buttons-wrapper">
              <RenewalButtons 
                verificationStatus={userData?.verificationStatus} 
                hasLicense={!!userData?.linkedLicense} // The !! converts the object/null to a true/false
                hasVehicle={userData?.linkedVehicles?.length > 0}
              />
            </div>
                </section>

                <section className="card border-0 shadow-sm p-4 mb-4 bg-white">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h3 className="h5 fw-bold text-dark m-0">Official Status Summary</h3>
    <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '0.65rem' }}>
      REF: {userData?.citizenshipNumber || 'MASTER-DB'}
    </span>
  </div>

  {userData?.verificationStatus === "Approved" ? (
    <div className="p-3 rounded-3" style={{ backgroundColor: '#f0fff4', borderLeft: '4px solid #28a745' }}>
      <p className="text-dark mb-1 fw-bold small">✅ Account Fully Certified</p>
      <p className="text-muted mb-0 small">
        Your identity is verified. Digital documents for your license and linked vehicles are now active and synced with the national transport records.
      </p>
    </div>
  ) : userData?.verificationStatus === "Pending" ? (
    <div className="p-3 rounded-3" style={{ backgroundColor: '#fffaf0', borderLeft: '4px solid #ffc107' }}>
      <p className="text-dark mb-1 fw-bold small">⏳ Verification in Progress</p>
      <p className="text-muted mb-0 small">
        Your application is currently under review by the department officials. Please check back later for updates on your document syncing.
      </p>
    </div>
  ) : userData?.verificationStatus === "Rejected" ? (
    <div className="p-3 rounded-3" style={{ backgroundColor: '#fff5f5', borderLeft: '4px solid #dc3545' }}>
      <p className="text-danger mb-1 fw-bold small">❌ Verification Rejected</p>
      <p className="text-muted mb-0 small">
        The information provided does not match the government database. Please visit the settings or verification section to correct your details.
      </p>
    </div>
  ) : (
    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #6c757d' }}>
      <p className="text-dark mb-1 fw-bold small">🛡️ Identity Unlinked</p>
      <p className="text-muted mb-0 small">
        No government identity has been linked to this account. Please initiate the verification process to access your digital license and bluebook.
      </p>
    </div>
  )}
</section>
              </div>

            </div>
          )}
        </div>
      </main>
      <Chatbot /> 
    </div>
  );
};

export default UserDashboardPage;