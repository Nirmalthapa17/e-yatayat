import React from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from '../components/dashboard/NotificationItem';

const NotificationsPage = () => {
  const notifications = [
    { id: 1, title: "Bluebook Expired", message: "Vehicle KO 03 TA 9012 bluebook expired 2 days ago.", time: "2h ago", type: "urgent", read: false },
    { id: 2, title: "Tax Payment Due", message: "Your annual vehicle tax for BA 15 PA 1234 is due in 10 days.", time: "1d ago", type: "warning", read: true },
    { id: 3, title: "System Update", message: "Digital License signatures are now being accepted online.", time: "3d ago", type: "info", read: true }
  ];

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link active">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
           <h1 className="display-6 fw-bold m-0">Notifications</h1>
           <button className="btn btn-outline-primary btn-sm">Mark all as read</button>
        </header>

        <div className="content-body" style={{ maxWidth: '800px' }}>
          {notifications.map(n => <NotificationItem key={n.id} note={n} />)}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;