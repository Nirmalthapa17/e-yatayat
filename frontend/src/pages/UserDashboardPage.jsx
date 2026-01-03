import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePreview from '../components/dashboard/ProfilePreview'; 
import RenewalButtons from '../components/dashboard/RenewalButtons';

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded ID for development
  const userId = "694cbf278e07deb8dfe00958"; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link active">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        {/* Top Header */}
        <header className="content-header">
          <div className="header-search">
            <input type="text" placeholder="Search for documents..." className="form-control" />
          </div>
          <div className="header-user">
            {/* DYNAMIC NAME */}
            <span className="me-3 fw-medium">{userData?.fullName || "Loading..."}</span>
            <div className="avatar-circle">
              {userData?.fullName ? userData.fullName.charAt(0) : "U"}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="content-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold m-0">Welcome, {userData?.fullName?.split(' ')[0] || "User"}!</h1>
              <p className="text-muted m-0">Here is what's happening with your vehicles today.</p>
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
              
              {/* LEFT COLUMN: Profile */}
              <div className="col-lg-4">
                <section className="card border-0 shadow-sm p-4 mb-4">
                  <h3 className="h5 fw-bold text-primary mb-4 text-center">User Profile</h3>
                  {/* Passing user data to the preview */}
                  <ProfilePreview user={userData} /> 
                </section>
              </div>

              {/* RIGHT COLUMN: Actions & Summary */}
              <div className="col-lg-8"> 
                <h3 className="h6 text-uppercase fw-bold text-muted mb-2">Quick Renewal Services</h3>
                <p className="small text-muted">Access to renewal forms is granted upon successful verification.</p>
                
                <section className="renewal-action-card card border-0 shadow-sm p-4 text-center mb-4">
                   <div className="renewal-buttons-wrapper">
                    {/* PASSING isVerified TO THE BUTTONS */}
                    <RenewalButtons isVerified={userData?.isVerified} />
                   </div>
                </section>

                <section className="card border-0 shadow-sm p-4 mb-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 fw-bold text-dark m-0">Status Summary</h3>
                    <Link to="/documents" className="text-primary text-decoration-none small">View All →</Link>
                  </div>
                  
                  {userData?.isVerified ? (
                    <p className="text-muted mb-0">
                      Your account is <span className="text-success fw-bold">Verified</span>. 
                      You can now use all digital services.
                    </p>
                  ) : (
                    <p className="text-muted mb-0">
                      Your account is currently <span className="text-warning fw-bold">Pending Verification</span>. 
                      Some features are restricted.
                    </p>
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

export default UserDashboardPage;