import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfilePreview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // This ID will eventually be replaced by the Logged-in User's ID from your friend
        const response = await fetch('http://localhost:5000/api/user/profile/694cbf278e07deb8dfe00958');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

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
      <div className="profile-preview-card text-center p-4 shadow-sm border rounded">
        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
        <p className="small text-muted mt-2">Checking verification status...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-preview-card p-3 shadow-sm border rounded">
        <div className="alert alert-warning small py-2 mb-0">
          Connection lost. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="profile-preview-card shadow-sm border rounded p-3 bg-white">
      {/* Header Section */}
      <div className="d-flex align-items-center border-bottom pb-3 mb-3">
        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" 
             style={{ width: '50px', height: '50px', marginRight: '15px' }}>
             {user.fullName.charAt(0)}
        </div>
        <div>
          <h4 className="h6 mb-0 text-dark">{user.fullName}</h4>
          <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-secondary'} x-small`} style={{ fontSize: '0.7rem' }}>
            {user.isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
          </span>
        </div>
      </div>
      
      {/* Conditional Content based on Verification Status */}
      <div className="profile-details small">
        {user.isVerified ? (
          // STATE 1: VERIFIED (Show Vehicle Access)
          <div className="verified-content">
            <p className="mb-2 text-success fw-bold">✅ Data Access Granted</p>
            <p className="mb-1"><strong>Vehicle No:</strong> {user.vehicleNumber}</p>
            <Link to="/profile-details" className="btn btn-primary btn-sm w-100 mt-2">
              Access Digital Documents
            </Link>
          </div>
        ) : user.vehicleNumber ? (
          // STATE 2: FORM SUBMITTED, WAITING FOR ADMIN
          <div className="pending-content">
            <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: '0.8rem' }}>
              <strong>Status: Pending</strong><br />
              Admin is verifying your Citizenship ({user.citizenshipNumber}).
            </div>
          </div>
        ) : (
          // STATE 3: NEW USER, NEEDS TO FILL FORM
          <div className="unverified-content">
            <p className="text-muted mb-2">Complete your profile to unlock your data.</p>
            <Link to="/verification-form" className="btn btn-outline-danger btn-sm w-100">
              Fill Verification Form
            </Link>
          </div>
        )}
      </div>

      {/* General Link always visible */}
      <div className="mt-3 pt-2 border-top">
        
      </div>
    </div>
  );
};

export default ProfilePreview;