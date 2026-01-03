import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from '../components/dashboard/NotificationItem';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "694cbf278e07deb8dfe00958"; // Nirmal's ID

  useEffect(() => {
    const generateNotifications = async () => {
      try {
        setLoading(true);
        // 1. Fetch User and Vehicle data
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userRes.json();

        let generatedNotes = [];

        if (user.isVerified && user.vehicleNumber) {
          const vehRes = await fetch(`http://localhost:5000/api/user/vehicle-info/${user.vehicleNumber}`);
          const vehicle = await vehRes.json();

          // 2. CALCULATION LOGIC
          const expiry = new Date(vehicle.expiryDate);
          const today = new Date();
          const diffTime = expiry - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Logic A: If Expired
          if (diffDays < 0) {
            generatedNotes.push({
              id: 'note-1',
              title: "Bluebook Expired",
              message: `Your vehicle ${vehicle.vehicleNumber} bluebook expired ${Math.abs(diffDays)} days ago. Please renew immediately.`,
              time: "Action Required",
              type: "urgent",
              read: false
            });
          } 
          // Logic B: If Expiring Soon (within 30 days)
          else if (diffDays <= 30) {
            generatedNotes.push({
              id: 'note-1',
              title: "Renewal Approaching",
              message: `Your vehicle tax for ${vehicle.vehicleNumber} is due in ${diffDays} days.`,
              time: "Upcoming",
              type: "warning",
              read: false
            });
          }
        }

        // Add a general system notification so the page isn't empty
        generatedNotes.push({
          id: 'note-sys',
          title: "Account Status",
          message: user.isVerified ? "Your identity is fully verified. You have access to all digital features." : "Your verification is currently pending admin review.",
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
  }, []);

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
        <header className="content-header d-flex justify-content-between">
            <h1 className="h4 fw-bold m-0">Notifications</h1>
            {notifications.length > 0 && <button className="btn btn-outline-primary btn-sm">Mark all as read</button>}
        </header>

        <div className="content-body" style={{ maxWidth: '800px' }}>
          {loading ? (
            <p>Checking for updates...</p>
          ) : notifications.length > 0 ? (
            notifications.map(n => <NotificationItem key={n.id} note={n} />)
          ) : (
            <div className="text-center p-5 text-muted">
               <p>No new notifications at this time.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;