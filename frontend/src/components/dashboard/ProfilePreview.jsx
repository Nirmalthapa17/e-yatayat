import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfilePreview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error('User not logged in');

        // This route should use .populate('linkedLicense').populate('linkedVehicles')
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        
        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-preview-card text-center p-4 shadow-sm border rounded bg-white">
        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
        <p className="small text-muted mt-2">Connecting to e-Yatayat Master Records...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-preview-card p-3 shadow-sm border rounded bg-white">
        <div className="alert alert-warning small py-2 mb-0">
          Session expired. Please <Link to="/">Login</Link> again.
        </div>
      </div>
    );
  }

  // LOGIC CHECK: Are the documents actually linked from Master DB?
  const hasLicense = user.linkedLicense && typeof user.linkedLicense === 'object';
  const hasVehicles = user.linkedVehicles && user.linkedVehicles.length > 0;
  const isFullyVerified = hasLicense || hasVehicles;
  const isAdmin = user.role === 'admin';

  return (
    <div className="profile-preview-card shadow-sm border rounded p-3 bg-white">
      {/* 1. Header with Identity & Role */}
      <div className="d-flex align-items-center border-bottom pb-3 mb-3">
        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" 
             style={{ width: '50px', height: '50px', marginRight: '15px', fontSize: '1.2rem' }}>
             {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h4 className="h6 mb-0 text-dark">{user.fullName}</h4>
          <div className="d-flex gap-1">
            <span className={`badge ${isFullyVerified ? 'bg-success' : 'bg-warning text-dark'} mt-1`} style={{ fontSize: '0.6rem' }}>
              {isFullyVerified ? 'FULLY VERIFIED' : 'PARTIAL ACCESS'}
            </span>
            {isAdmin && <span className="badge bg-danger mt-1" style={{ fontSize: '0.6rem' }}>ADMIN</span>}
          </div>
        </div>
      </div>
      
      <div className="profile-details small">
        <h6 className="text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>DIGITAL WALLET STATUS</h6>

        {/* 2. LICENSE SECTION (Showing Real Data) */}
        <div className="document-status mb-3 p-2 rounded" style={{ backgroundColor: hasLicense ? '#f0fff4' : '#f8f9fa' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Driving License</span>
            {hasLicense ? (
              <span className="text-success fw-bold">✅ Linked</span>
            ) : (
              <span className="text-muted">❌ Missing</span>
            )}
          </div>
          {hasLicense && (
            <div className="mt-1 text-muted" style={{ fontSize: '0.7rem' }}>
              No: {user.linkedLicense.licenseNumber} | Exp: {user.linkedLicense.expiryDate}
            </div>
          )}
        </div>

        {/* 3. VEHICLE SECTION (Showing Real Data) */}
        <div className="document-status mb-3 p-2 rounded" style={{ backgroundColor: hasVehicles ? '#f0fff4' : '#f8f9fa' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Vehicle Bluebook</span>
            {hasVehicles ? (
              <span className="text-success fw-bold">✅ {user.linkedVehicles.length} Linked</span>
            ) : (
              <span className="text-muted">❌ Missing</span>
            )}
          </div>
          {hasVehicles && (
            <div className="mt-1 text-muted" style={{ fontSize: '0.7rem' }}>
              Primary: {user.linkedVehicles[0].vehicleNumber}
            </div>
          )}
        </div>

        <hr />

        {/* 4. DYNAMIC ACTION BUTTONS */}
        <div className="action-zone">
          {isAdmin ? (
            // ADMIN VIEW
            <Link to="/admin-panel" className="btn btn-dark btn-sm w-100 fw-bold shadow-sm">
              Manage User Requests
            </Link>
          ) : !isFullyVerified ? (
            // UNVERIFIED USER VIEW
            <>
              <p className="text-muted italic mb-2" style={{ fontSize: '0.75rem' }}>
                Status: <span className="text-primary fw-bold">{user.verificationStatus}</span>
              </p>
              <Link to="/verification-form" className="btn btn-danger btn-sm w-100 fw-bold shadow-sm">
                Complete Verification
              </Link>
            </>
          ) : (
            // VERIFIED USER VIEW
            <Link to="/profile-details" className="btn btn-primary btn-sm w-100 fw-bold shadow-sm">
              View Digital Documents
            </Link>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 border-top text-center">
        <Link to="/settings" className="text-decoration-none text-muted" style={{ fontSize: '0.7rem' }}>
          Account Settings & Security
        </Link>
      </div>
    </div>
  );
};

export default ProfilePreview;