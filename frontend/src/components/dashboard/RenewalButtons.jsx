import React from 'react';

// We now accept hasLicense and hasVehicle as props
const RenewalButtons = ({ verificationStatus, hasLicense, hasVehicle }) => {
    
    // --- Handlers ---
    const handleLicenseRenewal = () => {
        alert("Navigating to License Renewal Form...");
    };

    const handleBluebookRenewal = () => {
        alert("Navigating to Bluebook Renewal Form...");
    };

    // 1. If the user hasn't been Approved by Admin, keep everything locked
    if (verificationStatus !== 'Approved') {
        return (
            <div className="mt-4 p-4 border rounded bg-light text-center shadow-sm">
                <div className="mb-2"><span className="fs-3">🔒</span></div>
                <h5 className="text-muted fw-bold">No Services </h5>
                <p className="small text-secondary mb-0">
                    Verification Status: <strong>{verificationStatus || 'None'}</strong>. <br />
                    Complete your profile verification to unlock renewal services.
                </p>
            </div>
        );
    }

    // 2. If Verified, but NO documents are linked at all
    if (!hasLicense && !hasVehicle) {
        return (
            <div className="mt-4 p-4 border rounded bg-white text-center shadow-sm">
                <div className="mb-2"><span className="fs-3">📄</span></div>
                <h6 className="fw-bold">No Documents Linked</h6>
                <p className="small text-muted">
                    Your identity is verified, but we couldn't find any linked License or Bluebook in the Master Database.
                </p>
            </div>
        );
    }

    // 3. Logic: Show only what is available
    return (
        <div className="mt-4">
            <h5 className="text-center fw-bold mb-3 text-primary">Available Services</h5>
            <div className="renewal-container d-grid gap-3 d-md-flex justify-content-md-center">
                
                {/* BLUEBOOK BUTTON: Only show if they have a linked vehicle */}
                {hasVehicle ? (
                    <button 
                        className="btn btn-primary btn-lg px-4 shadow-sm fw-bold" 
                        onClick={handleBluebookRenewal}
                    >
                        🚗 Renew Bluebook
                    </button>
                ) : (
                    <button className="btn btn-outline-secondary btn-lg px-4 disabled" title="No vehicle linked">
                        🚫 No Vehicle Found
                    </button>
                )}
                
                {/* LICENSE BUTTON: Only show if they have a linked license */}
                {hasLicense ? (
                    <button 
                        className="btn btn-success btn-lg px-4 shadow-sm fw-bold" 
                        onClick={handleLicenseRenewal}
                    >
                        💳 Renew License
                    </button>
                ) : (
                    <button className="btn btn-outline-secondary btn-lg px-4 disabled" title="No license linked">
                        🚫 No License Found
                    </button>
                )}
                
            </div>
        </div>
    );
};

export default RenewalButtons;