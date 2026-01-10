import React, { useState } from 'react';

const VerificationForm = () => {
  // Get dynamic userId from storage
  const userId = localStorage.getItem("userId");
  
  const [verifyLicense, setVerifyLicense] = useState(true);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  
  const [vDetails, setVDetails] = useState({
    province: 'BAGMATI',
    lot: '',
    symbol: 'PA',
    number: ''
  });

  const [formData, setFormData] = useState({
    fullName: '',
    citizenshipNumber: '',
    licenseNumber: '',
    engineNumber: '',  // Security Check
    chassisNumber: '', // Security Check
    profileImage: null
  });

  const fullVehicleNumber = `${vDetails.province}-${vDetails.lot}-${vDetails.symbol}-${vDetails.number}`;

  const handleSubmit = async (e) => {
  e.preventDefault();

  
    // We send a combined payload that includes the "claims"
    const payload = {
      appliedName: formData.fullName,
      citizenshipNumber: formData.citizenshipNumber,
      appliedLicenseNumber: verifyLicense ? formData.licenseNumber : null,
      appliedVehicleNumber: verifyVehicle ? fullVehicleNumber : null,
      appliedEngineNumber: verifyVehicle ? formData.engineNumber : null,
      appliedChassisNumber: verifyVehicle ? formData.chassisNumber : null,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/user/submit-verification/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        alert("✅ Verification request submitted! Admin will match your engine/chassis details with master records.");
        window.location.href = "/dashboard";
      } else {
        alert("❌ Submission failed. Please check your connection.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error. Please try again later.");
    }
  };

  return (
    <div className="card shadow border-0 p-4 mx-auto my-5" style={{ maxWidth: '650px', borderRadius: '15px' }}>
      <h3 className="fw-bold text-center mb-2">Government Verification</h3>
      <p className="text-center text-muted small mb-4">Provide details exactly as they appear on your official documents.</p>
      
      <form onSubmit={handleSubmit}>
        {/* SECTION 1: PERSONAL IDENTITY */}
        <div className="bg-light p-3 rounded mb-4">
          <h6 className="fw-bold border-bottom pb-2 mb-3">1. Personal Identity</h6>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name (as per Citizenship)</label>
            <input type="text" className="form-control" placeholder="E.g. Nirmal Thapa"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Citizenship Number</label>
            <input type="text" className="form-control" placeholder="12-01-72-XXXXX"
              onChange={(e) => setFormData({...formData, citizenshipNumber: e.target.value})} required />
          </div>
        </div>

        {/* SECTION 2: SELECTION */}
        <div className="row mb-4">
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 py-2 ${verifyLicense ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setVerifyLicense(!verifyLicense)}>
                    {verifyLicense ? '✓ Verifying License' : '+ Add License'}
                </button>
            </div>
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 py-2 ${verifyVehicle ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setVerifyVehicle(!verifyVehicle)}>
                    {verifyVehicle ? '✓ Verifying Bluebook' : '+ Add Bluebook'}
                </button>
            </div>
        </div>

        {/* LICENSE INPUT */}
        {verifyLicense && (
          <div className="mb-4 p-3 border rounded border-primary bg-primary-subtle">
            <label className="form-label fw-bold">Driving License Number</label>
            <input type="text" className="form-control" placeholder="01-06-XXXXXXXX"
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
          </div>
        )}

        {/* VEHICLE INPUT (NEPAL BLUEBOOK FORMAT) */}
        {verifyVehicle && (
          <div className="mb-4 p-3 border rounded border-success bg-success-subtle">
            <label className="form-label fw-bold mb-3 text-success">Vehicle Verification (Bluebook)</label>
            
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <select className="form-select" value={vDetails.province}
                  onChange={(e) => setVDetails({...vDetails, province: e.target.value})}>
                  <option value="BAGMATI">BAGMATI</option>
                  <option value="GANDAKI">GANDAKI</option>
                  <option value="KOSHI">KOSHI</option>
                  <option value="LUMBINI">LUMBINI</option>
                  <option value="MADHESH">MADHESH</option>
                  <option value="KARNALI">KARNALI</option>
                  <option value="SUDURPASHCHIM">SUDURPASHCHIM</option>
                </select>
              </div>
              <div className="col-md-2">
                <input type="text" className="form-control" placeholder="Lot" maxLength="3"
                  onChange={(e) => setVDetails({...vDetails, lot: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={vDetails.symbol}
                  onChange={(e) => setVDetails({...vDetails, symbol: e.target.value})}>
                  <option value="PA">PA (Two Wheeler)</option>
                  <option value="CHA">CHA (Four Wheeler)</option>
                  <option value="YA">YA (Scooter)</option>
                  <option value="KHA">KHA (Heavy)</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="1234" maxLength="4"
                  onChange={(e) => setVDetails({...vDetails, number: e.target.value})} required />
              </div>
            </div>

            {/* SECURITY FIELDS: Engine & Chassis */}
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small fw-bold">Engine Number</label>
                <input type="text" className="form-control form-control-sm" placeholder="Found in Bluebook"
                  onChange={(e) => setFormData({...formData, engineNumber: e.target.value})} required />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold">Chassis Number</label>
                <input type="text" className="form-control form-control-sm" placeholder="Found in Bluebook"
                  onChange={(e) => setFormData({...formData, chassisNumber: e.target.value})} required />
              </div>
            </div>

            <div className="mt-3 p-2 bg-dark text-white text-center rounded fw-bold small">
              LINKING: {fullVehicleNumber}
            </div>
          </div>
        )}

        <div className="alert alert-warning x-small p-2 mt-2" style={{ fontSize: '0.75rem' }}>
          <b>Note:</b> Admin will verify your input against the DoTM Master Database. False information will lead to account suspension.
        </div>

        <button type="submit" className="btn btn-dark w-100 py-3 mt-3 shadow fw-bold">
          Submit Documents for Approval
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;