import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from '../components/dashboard/NotificationItem';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "694cbf278e07deb8dfe00958";

  useEffect(() => {
    const generateNotifications = async () => {
      try {
        setLoading(true);
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();

        let generatedNotes = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time for accurate day calculation

        if (user.linkedVehicles && user.linkedVehicles.length > 0) {
          user.linkedVehicles.forEach((vehicle, index) => {
            
            // --- 1. TAX EXPIRY LOGIC ---
            if (vehicle.taxExpiryDate) {
              const taxExp = new Date(vehicle.taxExpiryDate);
              const taxDiff = Math.ceil((taxExp - today) / (1000 * 60 * 60 * 24));

              if (taxDiff < 0) {
                generatedNotes.push({
                  id: `tax-exp-${index}`,
                  title: "Vehicle Tax Expired",
                  message: `Tax for ${vehicle.vehicleNumber} expired ${Math.abs(taxDiff)} days ago. Please pay at the nearest Yatayat office or online.`,
                  time: "Action Required",
                  type: "urgent",
                  read: false
                });
              } else if (taxDiff <= 30) {
                generatedNotes.push({
                  id: `tax-soon-${index}`,
                  title: "Tax Renewal Due",
                  message: `Vehicle tax for ${vehicle.vehicleNumber} is expiring in ${taxDiff} days.`,
                  time: "Upcoming",
                  type: "warning",
                  read: false
                });
              }
            }

            // --- 2. INSURANCE EXPIRY LOGIC ---
            if (vehicle.insuranceExpiryDate) {
              const insExp = new Date(vehicle.insuranceExpiryDate);
              const insDiff = Math.ceil((insExp - today) / (1000 * 60 * 60 * 24));

              if (insDiff < 0) {
                generatedNotes.push({
                  id: `ins-exp-${index}`,
                  title: "Insurance Expired",
                  message: `Insurance for ${vehicle.vehicleNumber} has expired. Driving without insurance is illegal.`,
                  time: "Urgent",
                  type: "urgent",
                  read: false
                });
              } else if (insDiff <= 15) {
                generatedNotes.push({
                  id: `ins-soon-${index}`,
                  title: "Insurance Expiring Soon",
                  message: `Your insurance policy for ${vehicle.vehicleNumber} expires in ${insDiff} days.`,
                  time: "Reminder",
                  type: "warning",
                  read: false
                });
              }
            }
          });
        }

        // 3. LICENSE NOTIFICATIONS
        if (user.linkedLicense && user.linkedLicense.expiryDate) {
          const lExpiry = new Date(user.linkedLicense.expiryDate);
          const lDiff = Math.ceil((lExpiry - today) / (1000 * 60 * 60 * 24));

          if (lDiff < 0) {
            generatedNotes.push({
              id: 'lic-exp',
              title: "License Expired",
              message: "Your driving license is no longer valid. Apply for renewal immediately.",
              time: "Critical",
              type: "urgent",
              read: false
            });
          } else if (lDiff <= 60) {
            generatedNotes.push({
              id: 'lic-soon',
              title: "License Renewal",
              message: `Your driving license will expire in ${lDiff} days.`,
              time: "Reminder",
              type: "warning",
              read: false
            });
          }
        }

        // 4. SYSTEM STATUS
        generatedNotes.push({
          id: 'note-sys',
          title: "Account Status",
          message: user.isVerified 
            ? "Identity Verified: All digital documents are synced with government records." 
            : "Verification Pending: Some documents may not be visible until approved.",
          time: "System",
          type: "info",
          read: true
        });

        setNotifications(generatedNotes);
      } catch (err) {
        console.error("Notification Error:", err);
      } finally {
        setLoading(false);
      }
    };

    generateNotifications();
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
      </aside>

      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h4 fw-bold m-0 text-dark">Notifications</h1>
            <p className="text-muted small m-0">Official compliance and renewal alerts</p>
          </div>
          {notifications.length > 0 && (
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
              Mark all as read
            </button>
          )}
        </header>

        <div className="content-body" style={{ maxWidth: '850px' }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Syncing with Department of Transport...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(n => <NotificationItem key={n.id} note={n} />)
          ) : (
            <div className="card border-0 shadow-sm text-center p-5">
               <div className="display-4 mb-3">🛡️</div>
               <h5 className="fw-bold">Your documents are secure</h5>
               <p className="text-muted">No pending renewals or alerts at this time.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;