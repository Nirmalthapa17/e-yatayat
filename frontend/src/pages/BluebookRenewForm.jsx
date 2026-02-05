import React, { useState, useEffect } from "react";
import axios from "axios";

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB
const API_BASE = "http://localhost:5000";

export default function BluebookRenewForm({ onClose, onSuccess }) {
  const userId = localStorage.getItem("userId");
  
  // Store all vehicles found in user profile
  const [vehicles, setVehicles] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0); // Default to first vehicle

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
  });

  const [files, setFiles] = useState({
    insurance: null,
    receipt: null,
    pollution: null
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchVerifiedData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/user/profile/${userId}`);
        const user = res.data;
        
        setFormData({
          ownerName: user.fullName || "",
          email: user.email || "",
        });

        // Set the list of vehicles (e.g., Bike and Car)
        if (user.linkedVehicles && user.linkedVehicles.length > 0) {
          setVehicles(user.linkedVehicles);
        }
      } catch (err) {
        console.error("Auto-fill error:", err);
      } finally {
        setFetching(false);
      }
    };
    if (userId) fetchVerifiedData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const currentVehicle = vehicles[selectedIdx]?.vehicleNumber;

    const fd = new FormData();
    fd.append("vehicleNumber", currentVehicle);
    fd.append("ownerName", formData.ownerName);
    fd.append("email", formData.email);
    fd.append("insuranceDoc", files.insurance); 
    fd.append("receipt", files.receipt);
    fd.append("pollutionDoc", files.pollution);

    try {
      const res = await fetch(`${API_BASE}/api/renewals/bluebook`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        alert(`✅ Renewal submitted for ${currentVehicle}`);
        onSuccess && onSuccess();
        onClose();
      }
    } catch (err) {
      alert("Submission error.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="overlay">Loading...</div>;

  return (
    <div className="overlay">
      <div className="card shadow border-0 p-0 overflow-hidden" style={{ maxWidth: '500px', width: '95%', borderRadius: '15px' }}>
        
        <div className="bg-dark text-white p-4 text-center position-relative">
          <h4 className="fw-bold m-0">Vehicle Renewal</h4>
          <p className="small opacity-75 m-0">Select a vehicle to renew</p>
          <button className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3 border-0" onClick={onClose}>✕</button>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          
          {/* VEHICLE SELECTOR - This handles 1, 2, or more vehicles */}
          <div className="mb-4">
            <label className="form-label extra-small fw-bold text-muted text-uppercase">Select Vehicle</label>
            <select 
              className="form-select fw-bold border-success bg-success-subtle"
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(e.target.value)}
            >
              {vehicles.map((v, index) => (
                <option key={index} value={index}>
                  {v.vehicleNumber} ({v.symbol === 'PA' ? 'Bike' : 'Car/Other'})
                </option>
              ))}
            </select>
            <div className="extra-small text-muted mt-1">Only verified vehicles are listed here.</div>
          </div>

          <div className="p-3 bg-light rounded border mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="extra-small fw-bold text-muted text-uppercase">Owner Name</span>
              <span className="small fw-bold">{formData.ownerName}</span>
            </div>
          </div>

          <h6 className="fw-bold mb-3"><i className="bi bi-upload me-2 text-primary"></i>Upload Documents</h6>
          
          <div className="mb-3">
            <label className="form-label small fw-bold">Insurance Policy</label>
            <input type="file" className="form-control form-control-sm" required
              onChange={(e) => setFiles({...files, insurance: e.target.files[0]})} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Tax Payment Receipt</label>
            <input type="file" className="form-control form-control-sm" required
              onChange={(e) => setFiles({...files, receipt: e.target.files[0]})} />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Pollution Certificate</label>
            <input type="file" className="form-control form-control-sm" required
              onChange={(e) => setFiles({...files, pollution: e.target.files[0]})} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            {loading ? "Processing..." : "Submit Renewal Request"}
          </button>
        </form>
      </div>
    </div>
  );
}