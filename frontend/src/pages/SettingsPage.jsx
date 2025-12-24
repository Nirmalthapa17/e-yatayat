import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link active">⚙️ Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
           <h1 className="display-6 fw-bold m-0">Settings</h1>
        </header>

        <div className="content-body" style={{ maxWidth: '800px' }}>
          {/* Account Section */}
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">👤 Account Settings</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small text-muted">Full Name</label>
                  <input type="text" className="form-control" defaultValue="Nirmal Thapa" />
                </div>
                <div className="col-md-6">
                  <label className="small text-muted">Email Address</label>
                  <input type="email" className="form-control" defaultValue="nirmal@example.com" />
                </div>
                <div className="col-12 mt-3">
                  <button className="btn btn-primary px-4">Save Changes</button>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">🔔 Notification Preferences</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">Email Notifications</div>
                    <small className="text-muted">Receive expiry reminders via email</small>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-switch input" type="checkbox" defaultChecked />
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">SMS Alerts</div>
                    <small className="text-muted">Get urgent renewal alerts on your phone</small>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-switch input" type="checkbox" />
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;