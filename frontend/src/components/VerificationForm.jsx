import React, { useState, useEffect } from 'react';

const VerificationForm = ({ userId }) => {
  const [verifyLicense, setVerifyLicense] = useState(true);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  
  // Individual fields for Nepal Vehicle Format
  const [vDetails, setVDetails] = useState({
    province: 'BAGMATI',
    lot: '',
    symbol: 'PA',
    number: ''
  });

  const [formData, setFormData] = useState({
    licenseNumber: '',
    citizenshipNumber: '',
    citizenshipPath: ''
  });

  // Automatically generate the full vehicle number string
  const fullVehicleNumber = `${vDetails.province}-${vDetails.lot}-${vDetails.symbol}-${vDetails.number}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      citizenshipNumber: formData.citizenshipNumber,
      citizenshipPath: formData.citizenshipPath,
      licenseNumber: verifyLicense ? formData.licenseNumber : null,
      vehicleNumber: verifyVehicle ? fullVehicleNumber : null
    };

    try {
      const res = await fetch(`http://localhost:5000/api/user/submit-verification/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("Verification Submitted Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h3 className="fw-bold text-center mb-4">Identity Verification</h3>
      
      <form onSubmit={handleSubmit}>
        {/* SECTION 1: CITIZENSHIP */}
        <div className="mb-4 border-bottom pb-3">
          <label className="form-label fw-bold">Citizenship Number</label>
          <input 
            type="text" className="form-control" placeholder="12-01-72-XXXXX"
            onChange={(e) => setFormData({...formData, citizenshipNumber: e.target.value})} required 
          />
        </div>

        {/* SECTION 2: CHOOSE OPTION */}
        <div className="row mb-4">
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 ${verifyLicense ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setVerifyLicense(!verifyLicense)}>
                    {verifyLicense ? '✓ License' : '+ Add License'}
                </button>
            </div>
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 ${verifyVehicle ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setVerifyVehicle(!verifyVehicle)}>
                    {verifyVehicle ? '✓ Vehicle' : '+ Add Vehicle'}
                </button>
            </div>
        </div>

        {/* LICENSE INPUT */}
        {verifyLicense && (
          <div className="mb-4 p-3 border rounded bg-light">
            <label className="form-label fw-bold">Driving License Number</label>
            <input type="text" className="form-control" placeholder="01-06-XXXXXXXX"
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
          </div>
        )}

        {/* VEHICLE INPUT (NEPAL FORMAT) */}
        {verifyVehicle && (
          <div className="mb-4 p-3 border rounded bg-light">
            <label className="form-label fw-bold mb-3">Vehicle Details (Nepal Plate Format)</label>
            <div className="row g-2">
              <div className="col-md-4">
                <select className="form-select" value={vDetails.province}
                  onChange={(e) => setVDetails({...vDetails, province: e.target.value})}>
                  <option value="KOSHI">KOSHI</option>
                  <option value="MADHESH">MADHESH</option>
                  <option value="BAGMATI">BAGMATI</option>
                  <option value="GANDAKI">GANDAKI</option>
                  <option value="LUMBINI">LUMBINI</option>
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
                  <option value="PA">PA (Bike)</option>
                  <option value="KHA">KHA (Heavy)</option>
                  <option value="CHA">CHA (Car/Jeep)</option>
                  <option value="BA">BA (Bus)</option>
                  <option value="YA">YA (Scooter)</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="1234" maxLength="4"
                  onChange={(e) => setVDetails({...vDetails, number: e.target.value})} required />
              </div>
            </div>
            <div className="mt-3 p-2 bg-dark text-white text-center rounded fw-bold font-monospace">
              PREVIEW: {fullVehicleNumber}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-dark w-100 py-3 mt-3 shadow">
          Submit for Admin Verification
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;