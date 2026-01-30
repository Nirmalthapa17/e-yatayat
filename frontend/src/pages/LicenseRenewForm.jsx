import React, { useState } from "react";

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB
const API_BASE = "http://localhost:5000";

export default function LicenseRenewForm({ onClose, onSuccess }) {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [prevExpiry, setPrevExpiry] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [medicalFile, setMedicalFile] = useState(null);
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

  const handleFile = (setter, field) => (e) => {
    setServerError("");
    const f = e.target.files[0];
    const err = checkFileSize(f);
    if (err) {
      setErrors((s) => ({ ...s, [field]: err }));
      setter(null);
      e.target.value = "";
      return;
    }
    setErrors((s) => ({ ...s, [field]: null }));
    setter(f);
  };

  const validateEmailFormat = (v) => {
    if (!v) return "Email is required.";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    return ok ? null : "Enter a valid email.";
  };

  const validateClient = () => {
    const newErrors = {};
    if (!licenseNumber.trim()) newErrors.licenseNumber = "Required.";
    if (!fullName.trim()) newErrors.fullName = "Required.";
    const emailErr = validateEmailFormat(email);
    if (emailErr) newErrors.email = emailErr;
    if (!dob) newErrors.dob = "Required.";
    if (!prevExpiry) newErrors.prevExpiry = "Required.";
    if (!licenseFile) newErrors.licenseFile = "Upload license image (≤1MB).";
    if (!medicalFile) newErrors.medicalFile = "Upload medical clearance (≤1MB).";
    if (!receiptFile) newErrors.receiptFile = "Upload payment receipt (≤1MB).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");
    if (!validateClient()) return;

    const fd = new FormData();
    fd.append("licenseNumber", licenseNumber);
    fd.append("fullName", fullName);
    fd.append("email", email);
    fd.append("dob", dob);
    fd.append("previousExpiry", prevExpiry);
    fd.append("license", licenseFile);
    fd.append("medical", medicalFile);
    fd.append("receipt", receiptFile);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/renewals/license`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.message || data?.error || "Upload failed");
      } else {
        setSuccessMsg("License renewal submitted successfully.");
        if (onSuccess) onSuccess();
        setTimeout(() => { if (onClose) onClose(); }, 1000);
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
          <h2>License Renewal Form</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="renew-form" onSubmit={handleSubmit}>
          {serverError && <div className="error">{serverError}</div>}
          {successMsg && <div className="success">{successMsg}</div>}

          <label className="label">License Number</label>
          <input className="input" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
          {errors.licenseNumber && <div className="error">{errors.licenseNumber}</div>}

          <label className="label">Full Name</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          {errors.fullName && <div className="error">{errors.fullName}</div>}

          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value.trim())} placeholder="user@example.com" />
          {errors.email && <div className="error">{errors.email}</div>}

          <label className="label">Date of Birth</label>
          <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          {errors.dob && <div className="error">{errors.dob}</div>}

          <label className="label">Previous Expiry Date</label>
          <input className="input" type="date" value={prevExpiry} onChange={(e) => setPrevExpiry(e.target.value)} />
          {errors.prevExpiry && <div className="error">{errors.prevExpiry}</div>}

          <label className="label">Upload License Image <span className="muted">(max 1 MB)</span></label>
          <input className="input" type="file" accept="image/*" onChange={handleFile(setLicenseFile, "licenseFile")} />
          {errors.licenseFile && <div className="error">{errors.licenseFile}</div>}

          <label className="label">Medical Clearance Image <span className="muted">(max 1 MB)</span></label>
          <input className="input" type="file" accept="image/*,application/pdf" onChange={handleFile(setMedicalFile, "medicalFile")} />
          {errors.medicalFile && <div className="error">{errors.medicalFile}</div>}

          <label className="label">Upload Payment Receipt <span className="muted">(max 1 MB)</span></label>
          <input className="input" type="file" accept="image/*,application/pdf" onChange={handleFile(setReceiptFile, "receiptFile")} />
          {errors.receiptFile && <div className="error">{errors.receiptFile}</div>}

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Uploading..." : "Confirm"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
