import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/dashboard/VehicleCard';

const VehiclesPage = () => {
  // 1. STATE: To hold real data instead of mock arrays
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded ID for Nirmal Thapa
  const userId = "694cbf278e07deb8dfe00958";

  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        setLoading(true);
        
        // STEP A: Fetch user profile to get their specific vehicleNumber
        const userResponse = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const user = await userResponse.json();

        // Check if user is verified and has a vehicle number
        if (user.isVerified && user.vehicleNumber) {
          
          // STEP B: Fetch official record from VehicleMaster collection
          const vehicleResponse = await fetch(`http://localhost:5000/api/user/vehicle-info/${user.vehicleNumber}`);
          
          if (!vehicleResponse.ok) {
            throw new Error("Official vehicle record not found.");
          }

          const officialData = await vehicleResponse.json();
          setVehicleData(officialData);
        } else {
          // User is either not verified or hasn't submitted a form
          setVehicleData(null);
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
        <header className="content-header">
           <h4 className="m-0 fw-bold">My Digital Garage</h4>
           <Link to="/verification-form" className="btn btn-primary btn-sm">+ Add/Update Vehicle</Link>
        </header>

        <div className="content-body">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Fetching official records...</p>
              </div>
            ) : error ? (
              <div className="col-12"><div className="alert alert-danger">{error}</div></div>
            ) : vehicleData ? (
              // Displaying the real data from VehicleMaster
              <VehicleCard 
                vehicle={{
                  id: vehicleData._id,
                  plateNumber: vehicleData.vehicleNumber,
                  type: vehicleData.vehicleType || "Private",
                  model: vehicleData.ownerName + "'s Vehicle", // Using Owner Name as model placeholder
                  fuel: "Petrol/Diesel",
                  engine: vehicleData.engineNumber || "SECURED",
                  taxExpiry: vehicleData.expiryDate ? new Date(vehicleData.expiryDate).toLocaleDateString() : "N/A"
                }} 
              />
            ) : (
              <div className="col-12 text-center p-5">
                <div className="alert alert-info shadow-sm">
                  <h5>No Verified Vehicles Found</h5>
                  <p className="small">Either your verification is pending or you haven't submitted your details yet.</p>
                  <Link to="/verification-form" className="btn btn-primary btn-sm">Start Verification</Link>
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