import React from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/dashboard/VehicleCard';

const VehiclesPage = () => {
  // Mock data representing the user's vehicles
  const myVehicles = [
    { id: 1, plateNumber: "BA 15 PA 1234", type: "Private Car", model: "Hyundai i10", fuel: "Petrol", engine: "G4HG-123456", taxExpiry: "2025/10/12" },
    { id: 2, plateNumber: "PRO-3-02-001 PA 9999", type: "Motorbike", model: "NS 200", fuel: "Petrol", engine: "BJX-987654", taxExpiry: "2024/11/05" }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link active">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <header className="content-header">
           <h4 className="m-0  fw-bold ">My Digital Garage</h4>
           <button className="btn btn-primary btn-sm">+ Add Vehicle</button>
        </header>

        <div className="content-body">
          <div className="row">
            {myVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehiclesPage;