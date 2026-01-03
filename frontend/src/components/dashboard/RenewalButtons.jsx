import React from 'react';

const RenewalButtons = ({ isVerified }) => {
    
    // --- Handlers ---
    const handleLicenseRenewal = () => {
        alert("Navigating to License Renewal Form...");
    };

    const handleBluebookRenewal = () => {
        alert("Navigating to Bluebook Renewal Form...");
    };

    // LOGIC: If the user is NOT verified, we show a "Locked" placeholder 
    // instead of the buttons.
    if (!isVerified) {
        return (
            <div className="mt-4 p-4 border rounded bg-light text-center">
                <div className="mb-2">
                    <span className="fs-3">🔒</span>
                </div>
                <h5 className="text-muted fw-bold">Renewal Services Locked</h5>
                <p className="small text-secondary mb-0">
                    Please complete your identity verification to unlock Bluebook and License renewal services.
                </p>
            </div>
        );
    }

    // LOGIC: If verified is TRUE, this part of the code runs and shows the buttons.
    return (
        <div className="mt-4">
            <h5 className="text-center fw-bold mb-3 text-primary">Available Services</h5>
            <div className="renewal-container d-grid gap-4 d-md-flex justify-content-md-center">
                <button 
                    className="btn btn-primary btn-lg px-4 shadow-sm" 
                    onClick={handleBluebookRenewal}
                >
                    Renew Vehicle Bluebook
                </button>
                
                <button 
                    className="btn btn-success btn-lg px-4 shadow-sm" 
                    onClick={handleLicenseRenewal}
                >
                    Renew Driving License
                </button>
            </div>
        </div>
    );
};

export default RenewalButtons;