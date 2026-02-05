import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from '../components/dashboard/NotificationItem';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
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
        
        // 1. Fetch User Profile
        const profileRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await profileRes.json();

        // 2. Fetch Renewal Applications (using user email)
        let renewalData = { bluebooks: [], licenses: [] };
        if (user.email) {
          try {
            const renewalRes = await fetch(`http://localhost:5000/api/renewals/my-renewals/${user.email}`);
            const rData = await renewalRes.json();
            renewalData = rData;
          } catch (e) {
            console.error("Renewal fetch failed", e);
          }
        }

        let generatedNotes = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // --- SECTION A: OFFICIAL DATA ALERTS (Tax/Insurance Expiry) ---
        if (user.verificationStatus === 'Approved') {
          if (user.linkedVehicles && Array.isArray(user.linkedVehicles)) {
            user.linkedVehicles.forEach((vehicle) => {
              const vNum = vehicle.vehicleNumber;

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

        // --- SECTION B: IDENTITY VERIFICATION STATUS ---
        let identityNote = null;
        switch (user.verificationStatus) {
          case 'Approved':
            identityNote = { id: 'id-status', title: "Identity Verified", message: "Government Verification Successful: Your account is synced.", time: "Official", type: "info", priority: 3, read: true };
            break;
          case 'Pending':
            identityNote = { id: 'id-status', title: "Verification Pending", message: `Application (ID: ${user.citizenshipNumber}) is under review.`, time: "System", type: "warning", priority: 2, read: false };
            break;
          case 'Rejected':
            identityNote = { id: 'id-status', title: "Verification Rejected", message: "Identity form rejected. Please re-check Citizenship/License details.", time: "Action Required", type: "urgent", priority: 1, read: false };
            break;
          default:
            identityNote = { id: 'id-status', title: "Link Documents", message: "Please fill verification form to link your documents.", time: "System", type: "warning", priority: 2, read: false };
        }
        if (identityNote) generatedNotes.push(identityNote);

        // --- SECTION C: RENEWAL APPLICATION ALERTS (REJECTIONS) ---
        
        // Check License Renewals
        renewalData.licenses?.forEach((renewal) => {
          if (renewal.status === 'rejected') {
            generatedNotes.push({
              id: `renewal-lic-${renewal._id}`,
              title: "License Renewal Rejected",
              message: `Rejected for License ${renewal.licenseNumber}. Reason: ${renewal.adminRemarks || 'Document clarity issues.'}`,
              time: "Action Required",
              type: "urgent",
              priority: 1,
              read: false
            });
          } else if (renewal.status === 'approved') {
             generatedNotes.push({
              id: `renewal-lic-ok-${renewal._id}`,
              title: "Renewal Approved",
              message: `Your License ${renewal.licenseNumber} renewal request has been approved.`,
              time: "Official",
              type: "info",
              priority: 3,
              read: false
            });
          }
        });

        // Check Bluebook/Insurance Renewals
        renewalData.bluebooks?.forEach((renewal) => {
          if (renewal.status === 'rejected') {
            generatedNotes.push({
              id: `renewal-bb-${renewal._id}`,
              title: "Insurance Renewal Rejected",
              message: `Rejected for Vehicle ${renewal.vehicleNumber}. Reason: ${renewal.adminRemarks || 'Invalid payment receipt.'}`,
              time: "Action Required",
              type: "urgent",
              priority: 1,
              read: false
            });
          }
        });

        // Final Sort: Priority 1 (Urgent) always at the top
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
          <Link to="/settings" className="nav-link">⚙️ Info and Rate</Link>
        </nav>
        <div className="mt-auto p-3 border-top">
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
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