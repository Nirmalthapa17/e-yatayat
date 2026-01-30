import React, { useState } from 'react';
import LicenseRenewForm from '../../pages/LicenseRenewForm'; 
import BluebookRenewForm from '../../pages/BluebookRenewForm';

const RenewalButtons = ({ verificationStatus, hasLicense, hasVehicle }) => {
    const [activeForm, setActiveForm] = useState(null);
    const closeForm = () => setActiveForm(null);

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

    return (
        <div className="mt-4">
            <h5 className="text-center fw-bold mb-3 text-primary">Available Services</h5>
            <div className="renewal-container d-grid gap-3 d-md-flex justify-content-md-center">
                
                {hasVehicle ? (
                    <button className="btn btn-primary btn-lg px-4 shadow-sm fw-bold" onClick={() => setActiveForm("bluebook")}>
                        🚗 Renew Bluebook
                    </button>
                ) : (
                    <button className="btn btn-outline-secondary btn-lg px-4 disabled">🚫 No Vehicle Found</button>
                )}
                
                {hasLicense ? (
                    <button className="btn btn-success btn-lg px-4 shadow-sm fw-bold" onClick={() => setActiveForm("license")}>
                        💳 Renew License
                    </button>
                ) : (
                    <button className="btn btn-outline-secondary btn-lg px-4 disabled">🚫 No License Found</button>
                )}
            </div>

            {/* MODAL OVERLAYS */}
            {activeForm === "bluebook" && (
                <div className="form-modal-container">
                    <BluebookRenewForm onClose={closeForm} />
                </div>
            )}

            {activeForm === "license" && (
                <div className="form-modal-container">
                    <LicenseRenewForm onClose={closeForm} />
                </div>
            )}
        </div>
    );
};

export default RenewalButtons;