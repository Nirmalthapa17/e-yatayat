import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentStatusTable from '../components/dashboard/DocumentStatusTable';

const MyDocumentsPage = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using your specific user ID
  const userId = "694cbf278e07deb8dfe00958"; 

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch User Profile
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();
        setUserData(user);

        // 2. If user is verified and has a vehicle, fetch the official master data
        if (user.isVerified && user.vehicleNumber) {
          const vehRes = await fetch(`http://localhost:5000/api/user/vehicle-info/${user.vehicleNumber}`);
          const vehicle = await vehRes.json();
          setVehicleData(vehicle);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Logic to trigger the reminder box based on database dates
  const isBluebookExpired = vehicleData && new Date(vehicleData.expiryDate) < new Date();

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link active">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header d-flex justify-content-between">
          <h4 className="m-0 fw-bold">MY DOCUMENTS</h4>
          <div className="header-user d-flex align-items-center">
            <span className="me-3 fw-medium">{userData?.fullName || "User"}</span>
            <div className="avatar-circle">NT</div>
          </div>
        </header>

        <div className="content-body">
          {loading ? (
            <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="row">
              <div className="col-12">
                
                {/* DYNAMIC REMINDER: Only shows if the database expiry date has passed */}
                {isBluebookExpired ? (
                  <section className="card border-0 shadow-sm p-4 mb-4 bg-danger-subtle border-start border-danger border-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 fw-bold text-danger m-0">🔔 Active Reminders</h3>
                      <span className="badge bg-danger px-3 py-2">Action Required</span>
                    </div>
                    <div className="alert border-0 bg-white text-danger mb-0">
                      <span className="fw-bold">🚨 Attention:</span> Your Bluebook for <strong>{vehicleData.vehicleNumber}</strong> expired on {new Date(vehicleData.expiryDate).toLocaleDateString()}.
                    </div>
                  </section>
                ) : null}

                {/* DOCUMENT TABLE: Pass real data to the table component */}
                <section className="card border-0 shadow-sm p-4">
                  <h3 className="h5 fw-bold text-dark mb-4">Official Document Records</h3>
                  {userData?.isVerified ? (
                    <DocumentStatusTable user={userData} vehicle={vehicleData} />
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No verified documents available. Please complete verification.</p>
                      <Link to="/verification-form" className="btn btn-primary btn-sm">Verify Now</Link>
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