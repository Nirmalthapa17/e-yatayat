import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/dashboard/VehicleCard';

const VehiclesPage = () => {
  // Updated state to hold an array of vehicles
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        setLoading(true);
        
        // 1. Get the dynamic userId from login session
        const userId = localStorage.getItem("userId");
        
        if (!userId) {
          throw new Error("User session not found. Please login again.");
        }

        // 2. Fetch the populated profile
        // The backend 'populate' logic already brings the full Vehicle data here
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch garage records.");
        }

        const data = await response.json();

        // 3. Set the linkedVehicles array from the database
        if (data.linkedVehicles && data.linkedVehicles.length > 0) {
          setVehicles(data.linkedVehicles);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGarageData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-brand"><h2 className="text-primary fw-bold m-0">e-Yatayat</h2></div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link active">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <header className="content-header d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
           <h4 className="m-0 fw-bold">My Digital Garage</h4>
           <Link to="/verification-form" className="btn btn-primary btn-sm">+ Link New Vehicle</Link>
        </header>

        <div className="content-body p-4">
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Accessing Nepal Transport Records...</p>
              </div>
            ) : error ? (
              <div className="col-12"><div className="alert alert-danger">{error}</div></div>
            ) : vehicles.length > 0 ? (
              // 4. MAPPING: Show a card for every vehicle found in the database
              vehicles.map((v) => (
                <div className="col-md-6 col-lg-4" key={v._id}>
                  <VehicleCard 
                    vehicle={{
                      id: v._id,
                      plateNumber: v.vehicleNumber,
                      type: v.vehicleType || "Private",
                      model: v.model, 
                      fuel: v.fuelType || "Petrol",
                      engine: v.engineNumber || "SECURED",
                      taxExpiry: v.taxExpiryDate ? new Date(v.taxExpiryDate).toLocaleDateString() : "N/A"
                    }} 
                  />
                </div>
              ))
            ) : (
              // 5. EMPTY STATE: Shown if no vehicles are linked yet
              <div className="col-12 text-center p-5">
                <div className="card border-0 shadow-sm p-5 bg-white">
                  <div className="mb-3 text-muted">
                    <i className="bi bi-car-front" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>No Verified Vehicles Found</h5>
                  <p className="small text-muted">Your verified vehicles will appear here once you submit a claim and it is approved by the admin.</p>
                  <Link to="/verification-form" className="btn btn-primary btn-sm mx-auto" style={{ width: 'fit-content' }}>
                    Link My First Vehicle
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehiclesPage;