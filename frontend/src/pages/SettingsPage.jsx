import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link active">⚙️ Info and Rates</Link>
        </nav>
        <div className="mt-auto p-3 border-top">
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1 className="display-6 fw-bold m-0">Tax & Renewal Rates (Nepal)</h1>
          <p className="text-muted">Official annual rates  (2080/81)</p>
        </header>

        <div className="content-body" style={{ maxWidth: '900px' }}>
          
          {/* --- BIKE/SCOOTER TAX SECTION --- */}
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-primary">🏍️ Two-Wheeler Annual Tax (Private)</h5>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Engine Capacity (CC)</th>
                      <th>Annual Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Up to 125cc</td><td>रु 3,000</td></tr>
                    <tr><td>126cc to 160cc</td><td>रु 5,000</td></tr>
                    <tr><td>161cc to 250cc</td><td>रु 9,000</td></tr>
                    <tr><td>251cc to 400cc</td><td>रु 20,000</td></tr>
                    <tr><td>401cc and above</td><td>रु 35,000</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* --- CAR/JEEP TAX SECTION --- */}
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-success">🚗 Four-Wheeler Annual Tax (Private)</h5>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Engine Capacity (CC)</th>
                      <th>Annual Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Up to 1000cc</td><td>रु 22,000</td></tr>
                    <tr><td>1001cc to 1500cc</td><td>रु 25,000</td></tr>
                    <tr><td>1501cc to 2000cc</td><td>रु 34,000</td></tr>
                    <tr><td>2001cc to 2500cc</td><td>रु 56,000</td></tr>
                    <tr><td>2501cc to 2900cc</td><td>रु 75,000</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="alert alert-info mt-2 py-2 small">
                <strong>Note:</strong> Third-party insurance (रु 1,700 - रु 8,000 approx.) and Environment Tax may apply separately.
              </div>
            </div>
          </section>

          {/* --- LICENSE RENEWAL SECTION --- */}
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-warning">🆔 Smart License Fees</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <h6 className="fw-bold">Renewal (5 Years)</h6>
                    <h3 className="text-primary mb-0">रु 1,500</h3>
                    <small className="text-muted">+ रु 500 for Card Fee</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <h6 className="fw-bold">Fine for Late Renewal</h6>
                    <ul className="small m-0 ps-3">
                      <li>Up to 1 Year: No Fine</li>
                      <li>1 to 2 Years: 20% Extra</li>
                      <li>Over 5 Years: License Cancelled</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- 4. OFFICIAL PAYMENT CHANNELS --- */}
<section className="card border-0 shadow-sm mb-5">
  <div className="card-body p-4">
    <h5 className="fw-bold mb-3 text-danger">🏦 Official Payment Methods</h5>
    <p className="small text-muted mb-4">You can pay your taxes and fees through the following official channels. Please keep your transaction ID for verification.</p>
    
    <div className="row g-4">
      {/* Bank Transfer Details */}
      <div className="col-md-6">
        <div className="p-3 border rounded h-100 bg-white shadow-sm">
          <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Bank Transfer (RBB)</h6>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Bank Name:</span>
              <span className="fw-medium">Rastriya Banijya Bank</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Account Name:</span>
              <span className="fw-medium">DOTM Revenue Account</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Account Number:</span>
              <span className="fw-bold text-primary">123000987654321</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Office Code:</span>
              <span className="fw-medium">35-001-01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Wallet / QR Details */}
      <div className="col-md-6">
        <div className="p-3 border rounded h-100 bg-white shadow-sm">
          <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Digital Wallets</h6>
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="badge bg-success p-2">eSewa</span>
            <span className="badge bg-primary p-2">Khalti</span>
            <span className="badge bg-info p-2">ConnectIPS</span>
          </div>
          <p className="small m-0">
            1. Open your Wallet app.<br/>
            2. Search for <strong>"Government Services"</strong>.<br/>
            3. Select <strong>"Traffic Fine / Vehicle Tax"</strong>.<br/>
            4. Enter your <strong>Vehicle Number</strong> to fetch the amount.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-4 p-3 bg-light border-start border-danger border-4 rounded">
      <h6 className="fw-bold mb-1 small text-danger">Heads Up!</h6>
      <p className="small m-0">Always verify the <strong>Office Code</strong> before transferring. Wrong transfers may lead to delays in Bluebook renewal.</p>
    </div>
  </div>
</section>

          {/* Important Notice */}
          <div className="card border-warning bg-light mb-5">
            <div className="card-body">
              <h6 className="fw-bold text-danger">⚠️ Late Payment Fines (Bluebook)</h6>
              <p className="small mb-0">
                If the Bluebook is not renewed within the expiry date, a fine of <strong>5% (first 30 days)</strong>, 
                <strong>10% (next 45 days)</strong>, and <strong>20% (after that)</strong> is levied on the tax amount.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;