// frontend/src/pages/MyDocumentsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <--- THIS LINE IS MISSING
import DocumentStatusTable from '../components/dashboard/DocumentStatusTable';

const MyDocumentsPage = () => {
  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
         {/* Use Link instead of a tags to enable routing */}
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link active">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-search">
            <h4 className="m-0" >MY DOCUMENTS</h4>
          </div>
          <div className="header-search">
            <input type="text" placeholder="Search for documents..." className="form-control" />
          </div>
          <div className="header-user">
            <span className="me-3 fw-medium">Nirmal Thapa</span>
            <div className="avatar-circle">NT</div>
          </div>
        </header>

        <div className="content-body">
          <div className="row">
            <div className="col-12">
              {/* REMINDERS MOVED HERE */}
              <section className="card border-0 shadow-sm p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 fw-bold text-dark m-0">🔔 Active Reminders</h3>
                  <span className="badge bg-soft-warning text-warning px-3 py-2">Action Required</span>
                </div>
                
                <div className="alert border-0 bg-soft-danger text-danger mb-0" role="alert">
                  <span className="fw-bold">🚨 Attention:</span> Your Vehicle Bluebook (KO 03 TA 9012) has expired. Please initiate renewal below.
                </div>
              </section>

              {/* TABLE MOVED HERE */}
              <section className="card border-0 shadow-sm p-4">
                <h3 className="h5 fw-bold text-dark mb-4">Document Records</h3>
                <DocumentStatusTable />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyDocumentsPage;