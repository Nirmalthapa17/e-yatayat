// frontend/src/components/RenewalButtons.jsx

import React from 'react';

const RenewalButtons = () => {
    
    // --- Temporary Handlers ---
    // In a real application, these functions would navigate the user 
    // to the respective renewal form pages (Lokesh Saud's task).
    const handleLicenseRenewal = () => {
        alert("Navigating to License Renewal Form...");
        // Use React Router here later to navigate: navigate('/renewal/license');
    };

    const handleBluebookRenewal = () => {
        alert("Navigating to Bluebook Renewal Form...");
        // Use React Router here later to navigate: navigate('/renewal/bluebook');
    };
    // -------------------------
   return (
  /* Added 'renewal-container' class here */
  <div className="renewal-container d-grid gap-4 d-md-flex justify-content-md-center mt-4">
      <button className="btn btn-primary btn-lg" onClick={handleBluebookRenewal}>
           Renew Vehicle Bluebook
      </button>
      <button className="btn btn-success btn-lg" onClick={handleLicenseRenewal}>
          Renew Driving License
      </button>
  </div>
)
};

export default RenewalButtons; 