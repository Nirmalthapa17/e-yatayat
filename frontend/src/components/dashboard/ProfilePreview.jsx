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

        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
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
      <div className="profile-preview-card p-3 shadow-sm border rounded bg-white text-center">
        <p className="small text-danger mb-2">Session timeout</p>
        <Link to="/" className="btn btn-sm btn-outline-primary">Login Again</Link>
      </div>
    );
  }

  // LOGIC FOR DOCUMENT SYNC
  const hasLicense = user.linkedLicense && typeof user.linkedLicense === 'object';
  const hasVehicles = user.linkedVehicles && user.linkedVehicles.length > 0;
  const isAdmin = user.role === 'admin';

  // LOGIC FOR BADGE STATUS
  let badgeText = "UNLINKED PROFILE";
  let badgeClass = "bg-secondary";

  if (user.verificationStatus === 'Approved') {
    badgeText = "CERTIFIED CITIZEN";
    badgeClass = "bg-success";
  } else if (user.verificationStatus === 'Pending') {
    badgeText = "PENDING APPROVAL";
    badgeClass = "bg-warning text-dark";
  } else if (user.verificationStatus === 'Rejected') {
    badgeText = "REJECTION ALERT";
    badgeClass = "bg-danger";
  }

  return (
    <div className="profile-preview-card shadow-sm border rounded p-3 bg-white">
      {/* 1. Header with Official Badge */}
      <div className="d-flex align-items-center border-bottom pb-3 mb-3">
        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" 
             style={{ width: '50px', height: '50px', marginRight: '15px', fontSize: '1.2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h4 className="h6 mb-0 text-dark fw-bold">{user.fullName}</h4>
          <div className="d-flex gap-1 flex-wrap">
            <span className={`badge ${badgeClass} mt-1`} style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>
              {badgeText}
            </span>
            {isAdmin && <span className="badge bg-dark mt-1" style={{ fontSize: '0.6rem' }}>OFFICIAL ADMIN</span>}
          </div>
        </div>
      </div>
      
      <div className="profile-details small">
        <h6 className="text-muted mb-3" style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px' }}>MINISTRY OF TRANSPORT RECORDS</h6>

        {/* 2. LICENSE STATUS */}
        <div className="document-status mb-2 p-2 rounded border-start border-4" style={{ backgroundColor: '#f8f9fa', borderLeftColor: hasLicense ? '#28a745' : '#dee2e6' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark">Driving License</span>
            {hasLicense ? <span className="text-success small fw-bold">Synced</span> : <span className="text-muted small">Not Linked</span>}
          </div>
        </div>

        {/* 3. VEHICLE STATUS */}
        <div className="document-status mb-3 p-2 rounded border-start border-4" style={{ backgroundColor: '#f8f9fa', borderLeftColor: hasVehicles ? '#28a745' : '#dee2e6' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark">Vehicle Bluebook</span>
            {hasVehicles ? <span className="text-success small fw-bold">{user.linkedVehicles.length} Active</span> : <span className="text-muted small">Not Linked</span>}
          </div>
        </div>

        {/* 4. DYNAMIC ACTION BUTTONS */}
        <div className="action-zone mt-3">
          {isAdmin ? (
            <Link to="/admin-panel" className="btn btn-dark btn-sm w-100 fw-bold">Open Management Console</Link>
          ) : user.verificationStatus === 'Approved' ? (
            <Link to="/profile-details" className="btn btn-primary btn-sm w-100 fw-bold">Access Digital Wallet</Link>
          ) : (
            <Link to="/verification-form" className="btn btn-outline-danger btn-sm w-100 fw-bold">
              {user.verificationStatus === 'Pending' ? 'View Submission Status' : 'Link Government ID'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;