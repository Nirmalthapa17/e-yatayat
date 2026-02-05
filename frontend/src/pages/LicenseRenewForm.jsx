import React, { useState, useEffect } from "react";
import axios from "axios";

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB
const API_BASE = "http://localhost:5000";

export default function LicenseRenewForm({ onClose, onSuccess }) {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    licenseNumber: "",
    fullName: "",
    email: "",
  });

  const [files, setFiles] = useState({
    medical: null,
    receipt: null
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- AUTO-FILL LOGIC ---
  useEffect(() => {
    const fetchVerifiedData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/user/profile/${userId}`);
        const user = res.data;
        
        // Extract license (Check Official first, then Applied fallback)
        const autoLicense = user.linkedLicense?.licenseNumber || user.appliedLicenseNumber || "";
        
        setFormData({
          licenseNumber: autoLicense, 
          fullName: user.fullName || "",
          email: user.email || "",
        });
        
      } catch (err) {
        console.error("Could not pre-fill data", err);
      } finally {
        setFetching(false);
      }
    };
    if (userId) fetchVerifiedData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.medical || !files.receipt) {
      setServerError("Please upload both required documents.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("licenseNumber", formData.licenseNumber);
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("medical", files.medical);
    fd.append("receipt", files.receipt);

    try {
      const res = await fetch(`${API_BASE}/api/renewals/license`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setSuccessMsg("✅ License renewal submitted successfully!");
        if (onSuccess) onSuccess();
        setTimeout(() => onClose(), 1500);
      } else {
        setServerError("Submission failed. Check your connection.");
      }
    } catch (err) {
      setServerError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="overlay"><div className="spinner-border text-light"></div></div>;

  return (
    <div className="overlay">
      <div className="card shadow border-0 p-0 overflow-hidden" style={{ maxWidth: '500px', width: '95%', borderRadius: '15px' }}>
        
        <div className="bg-primary text-white p-4 text-center position-relative">
          <h4 className="fw-bold m-0">License Renewal</h4>
          <p className="small opacity-75 m-0">Verified Digital Profile Update</p>
          <button className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3 border-0" onClick={onClose}>✕</button>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}
          {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}

          {/* License Number Input */}
          <div className="mb-3">
            <label className="form-label extra-small fw-bold text-muted text-uppercase">License Number</label>
            <input 
              type="text" 
              className={`form-control ${formData.licenseNumber ? 'bg-primary-subtle fw-bold border-primary' : ''}`} 
              value={formData.licenseNumber} 
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              readOnly={!!formData.licenseNumber} 
              placeholder="Enter License Number"
              required
            />
            {formData.licenseNumber && <div className="extra-small text-primary mt-1">Verified from profile</div>}
          </div>

          {/* Full Name Input */}
          <div className="mb-3">
            <label className="form-label extra-small fw-bold text-muted text-uppercase">Full Name</label>
            <input type="text" className="form-control bg-light" value={formData.fullName} readOnly />
          </div>

          <hr className="my-4" />

          <h6 className="fw-bold mb-3"><i className="bi bi-file-earmark-medical me-2"></i>Required Documents</h6>
          
          <div className="mb-3">
            <label className="form-label small fw-bold">1. Medical Report (Signed)</label>
            <input 
              type="file" 
              className="form-control form-control-sm" 
              accept="image/*,application/pdf" 
              onChange={(e) => setFiles({...files, medical: e.target.files[0]})} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">2. Payment Receipt</label>
            <input 
              type="file" 
              className="form-control form-control-sm" 
              accept="image/*,application/pdf" 
              onChange={(e) => setFiles({...files, receipt: e.target.files[0]})} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 py-2 fw-bold shadow">
            {loading ? "Processing..." : "Submit Renewal"}
          </button>
        </form>
      </div>
    </div>
  );
}