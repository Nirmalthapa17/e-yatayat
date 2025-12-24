// frontend/src/components/ProfilePreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// *** MOCK DATA *** // This object simulates the data we will get from the backend API after a user logs in.
const mockUserProfile = {
    fullName: "Nirmal Thapa", // Replace with your name for testing!
    email: "nirmal.thapa@ku.edu.np",
    mobile: "98XXXXXXXX",
    registrationDate: "2025/11/20", 
    // Add a mock photo URL for later, but for now, we use a placeholder
    profilePhotoUrl: null,
};

const ProfilePreview = () => {
  const user = mockUserProfile; // Use the mock data

  return (
    <div className="profile-preview-card">
      <div className="d-flex align-items-center border-bottom pb-3 mb-3">
        
        {/* CIRCULAR PHOTO PLACEHOLDER */}
        <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" 
             style={{ width: '60px', height: '60px', marginRight: '15px' }}>
             {/* This will remain empty */}
        </div>
        
        <h4 className="h5 mb-0 text-dark">{user.fullName}</h4>
      </div>
      
      <div className="profile-details small">
        <p className="mb-1"><strong>Email:</strong> {user.email}</p>
        <p className="mb-1"><strong>Mobile:</strong> {user.mobile}</p>
        <p className="mb-1"><strong>Member Since:</strong> {user.registrationDate}</p>
      </div>

      <div className="mt-3">
       <Link 
            to="/profile-details" 
            className="btn btn-outline-primary btn-sm w-100"
          >
            View Profile Details
          </Link>
          </div>
    </div>
  );
};

export default ProfilePreview;