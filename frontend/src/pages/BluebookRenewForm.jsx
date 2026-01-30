import React, { useState } from "react";

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB
const API_BASE = "http://localhost:5000"; // change if your backend runs elsewhere

export default function BluebookRenewForm({ onClose, onSuccess }) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [prevExpiry, setPrevExpiry] = useState("");
  const [bluebookFile, setBluebookFile] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const checkFileSize = (file) => {
    if (!file) return null;
    if (file.size > MAX_BYTES) return "File must be 1 MB or smaller.";
    return null;
  };

  const handleBluebookFile = (e) => {
    setServerError("");
    const f = e.target.files[0];
    const err = checkFileSize(f);
    if (err) {
      setErrors((s) => ({ ...s, bluebookFile: err }));
      setBluebookFile(null);
      e.target.value = "";
      return;
    }
    setErrors((s) => ({ ...s, bluebookFile: null }));
    setBluebookFile(f);
  };

  const handleReceiptFile = (e) => {
    setServerError("");
    const f = e.target.files[0];
    const err = checkFileSize(f);
    if (err) {
      setErrors((s) => ({ ...s, receiptFile: err }));
      setReceiptFile(null);
      e.target.value = "";
      return;
    }
    setErrors((s) => ({ ...s, receiptFile: null }));
    setReceiptFile(f);
  };

  const validateEmailFormat = (v) => {
    if (!v) return "Email is required.";
    // simple email check
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    return ok ? null : "Enter a valid email.";
  };

  const validateClient = () => {
    const newErrors = {};
    if (!vehicleNumber.trim()) newErrors.vehicleNumber = "Required.";
    if (!ownerName.trim()) newErrors.ownerName = "Required.";
    const emailErr = validateEmailFormat(email);
    if (emailErr) newErrors.email = emailErr;
    if (!prevExpiry) newErrors.prevExpiry = "Required.";
    if (!bluebookFile) newErrors.bluebookFile = "Upload bluebook image (≤1MB).";
    if (!receiptFile) newErrors.receiptFile = "Upload payment receipt (≤1MB).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");
    if (!validateClient()) return;

    // Build FormData (multipart/form-data)
    const fd = new FormData();
    fd.append("vehicleNumber", vehicleNumber);
    fd.append("ownerName", ownerName);
    fd.append("email", email);
    fd.append("previousExpiry", prevExpiry);
    fd.append("bluebook", bluebookFile);
    fd.append("receipt", receiptFile);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/renewals/bluebook`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.message || data?.error || "Upload failed");
      } else {
        setSuccessMsg("Bluebook renewal submitted successfully.");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      }
    } catch (err) {
      setServerError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="form-containers" role="dialog" aria-modal="true">
        <div className="form-header">
          <h2>Bluebook Renewal Form</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="renew-form" onSubmit={handleSubmit}>
          {serverError && <div className="error">{serverError}</div>}
          {successMsg && <div className="success">{successMsg}</div>}

          <label className="label">Vehicle Number</label>
          <input
            className="input"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="e.g., BA 12 PA 1234"
          />
          {errors.vehicleNumber && <div className="error">{errors.vehicleNumber}</div>}

          <label className="label">Owner Name</label>
          <input
            className="input"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          {errors.ownerName && <div className="error">{errors.ownerName}</div>}

          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="user@example.com"
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <label className="label">Previous Expiry Date</label>
          <input
            className="input"
            type="date"
            value={prevExpiry}
            onChange={(e) => setPrevExpiry(e.target.value)}
          />
          {errors.prevExpiry && <div className="error">{errors.prevExpiry}</div>}

          <label className="label">Upload Bluebook Image <span className="muted">(max 1 MB)</span></label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={handleBluebookFile}
          />
          {errors.bluebookFile && <div className="error">{errors.bluebookFile}</div>}

          <label className="label">Upload Payment Receipt <span className="muted">(max 1 MB)</span></label>
          <input
            className="input"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleReceiptFile}
          />
          {errors.receiptFile && <div className="error">{errors.receiptFile}</div>}

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Uploading..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
