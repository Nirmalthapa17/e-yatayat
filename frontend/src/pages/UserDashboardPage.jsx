// frontend/src/pages/UserDashboardPage.jsx
import { Link } from 'react-router-dom'; // <--- THIS LINE IS MISSING
import React from 'react';
import ProfilePreview from '../components/dashboard/ProfilePreview'; 
import RenewalButtons from '../components/dashboard/RenewalButtons';

const UserDashboardPage = () => {
  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
         {/* Use Link instead of a tags to enable routing */}
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
            <span className="me-3 fw-medium">Nirmal Thapa</span>
            <div className="avatar-circle">NT</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="content-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 fw-bold m-0">Dashboard Overview</h1>
            <span className="text-muted">Current Date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="row g-4 align-items-start"> 

           {/* COLUMN 2: Profile & Summary */}
            <div className="col-lg-4">
              <section className="card border-0 shadow-sm p-4 mb-4">
                <h3 className="h5 fw-bold text-primary mb-4 text-center">User Profile</h3>
                <ProfilePreview /> 
              </section>
             

            <div className="col-lg-8"> 
              {/* Simplified Status Summary Card */}
              <h3 className="h6 text-uppercase fw-bold text-muted mb-2">Quick Renewal Services</h3>
              <p>You can choose the required action by chicking the buttons</p>
              <section className="renewal-action-card card border-0 shadow-sm p-4 text-center mb-4">
                 <div className="renewal-buttons-wrapper">
                  <RenewalButtons />
                 </div>
                </section>

              <section className="card border-0 shadow-sm p-4 mb-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 fw-bold text-dark m-0">Quick Overview</h3>
                  <a href="#" className="text-primary text-decoration-none small">View All Documents →</a>
                </div>
                <p className="text-muted">You have <span className="text-danger fw-bold">1 expired document</span> that requires immediate attention. Please visit the "My Documents" tab for full details.</p>
              </section>

              
            </div>

           

            
            </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;