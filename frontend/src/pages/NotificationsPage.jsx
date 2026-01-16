import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from '../components/dashboard/NotificationItem';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
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
    const fetchAndGenerateNotifications = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await response.json();

        let generatedNotes = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // --- 1. OFFICIAL DATA ALERTS (Only if Government Approved) ---
        if (user.verificationStatus === 'Approved') {
          
          // Vehicle Alerts
          if (user.linkedVehicles && Array.isArray(user.linkedVehicles)) {
            user.linkedVehicles.forEach((vehicle) => {
              const vNum = vehicle.vehicleNumber;

              // Tax Expiry
              if (vehicle.taxExpiryDate) {
                const taxExp = new Date(vehicle.taxExpiryDate);
                const diff = Math.ceil((taxExp - today) / (1000 * 60 * 60 * 24));

                if (diff < 0) {
                  generatedNotes.push({
                    id: `tax-expired-${vNum}`,
                    title: "Vehicle Tax Expired",
                    message: `Tax for ${vNum} expired ${Math.abs(diff)} days ago. Please pay immediately.`,
                    time: "Action Required",
                    type: "urgent",
                    priority: 1,
                    read: false
                  });
                } else if (diff <= 30) {
                  generatedNotes.push({
                    id: `tax-due-${vNum}`,
                    title: "Tax Renewal Due",
                    message: `Vehicle tax for ${vNum} is expiring in ${diff} days.`,
                    time: "Upcoming",
                    type: "warning",
                    priority: 2,
                    read: false
                  });
                }
              }

              // Insurance Expiry
              if (vehicle.insuranceExpiryDate) {
                const insExp = new Date(vehicle.insuranceExpiryDate);
                const diff = Math.ceil((insExp - today) / (1000 * 60 * 60 * 24));

                if (diff < 0) {
                  generatedNotes.push({
                    id: `ins-expired-${vNum}`,
                    title: "Insurance Expired",
                    message: `Insurance for ${vNum} has expired. Driving without it is illegal.`,
                    time: "Urgent",
                    type: "urgent",
                    priority: 1,
                    read: false
                  });
                }
              }
            });
          }

          // License Alerts
          if (user.linkedLicense && user.linkedLicense.expiryDate) {
            const lExp = new Date(user.linkedLicense.expiryDate);
            const diff = Math.ceil((lExp - today) / (1000 * 60 * 60 * 24));

            if (diff < 0) {
              generatedNotes.push({
                id: 'license-expired',
                title: "License Expired",
                message: "Your driving license has expired. Please apply for renewal.",
                time: "Critical",
                type: "urgent",
                priority: 1,
                read: false
              });
            }
          }
        }

        // --- 2. IDENTITY VERIFICATION STATUS (Your Specific Schema Logic) ---
        let identityNote = {};
        
        switch (user.verificationStatus) {
          case 'Approved':
            identityNote = {
              id: 'id-status',
              title: "Identity Verified",
              message: "Government Verification Successful: Your account is fully synced with transport records.",
              time: "Official",
              type: "info",
              priority: 3,
              read: true
            };
            break;
          case 'Pending':
            identityNote = {
              id: 'id-status',
              title: "Verification Pending",
              message: `Your application (Citizenship: ${user.citizenshipNumber}) is currently being reviewed by officials.`,
              time: "System",
              type: "warning",
              priority: 2,
              read: false
            };
            break;
          case 'Rejected':
            identityNote = {
              id: 'id-status',
              title: "Verification Rejected",
              message: "Your identity form was rejected. Please re-check your Citizenship/License details and resubmit.",
              time: "Action Required",
              type: "urgent",
              priority: 1,
              read: false
            };
            break;
          default: // 'None'
            identityNote = {
              id: 'id-status',
              title: "Link Documents",
              message: "Please fill the verification form to link your License and Bluebook to this account.",
              time: "System",
              type: "warning",
              priority: 2,
              read: false
            };
        }
        generatedNotes.push(identityNote);

        // Final Sort: Urgent items first
        generatedNotes.sort((a, b) => a.priority - b.priority);
        setNotifications(generatedNotes);

      } catch (err) {
        console.error("Failed to sync notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateNotifications();
  }, [userId]);

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link active">🔔 Notifications</Link>
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
          <div>
            <h1 className="h4 fw-bold m-0 text-dark">Notifications</h1>
            <p className="text-muted small m-0">Official alerts from the Department of Transport</p>
          </div>
        </header>

        <div className="content-body" style={{ maxWidth: '850px' }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Syncing official records...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(n => <NotificationItem key={n.id} note={n} />)
          ) : (
            <div className="card border-0 shadow-sm text-center p-5">
               <div className="display-4 mb-3">🛡️</div>
               <h5 className="fw-bold">No active alerts</h5>
               <p className="text-muted">You are all caught up with your transport compliance.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;