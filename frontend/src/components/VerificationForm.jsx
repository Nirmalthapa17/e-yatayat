import React, { useState } from 'react';

const VerificationForm = () => {
  const userId = localStorage.getItem("userId");
  
  const [verifyLicense, setVerifyLicense] = useState(true);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
    engineNumber: '', 
  });

  // State for image files
  const [images, setImages] = useState({
    citizenshipFront: null,
    licenseFront: null,
    bluebookPage2: null,
    profilePhoto: null
  });

  const fullVehicleNumber = `${vDetails.province}-${vDetails.lot}-${vDetails.symbol}-${vDetails.number}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Using FormData to handle both text and files
    const dataToSend = new FormData();
    
    // Basic Info
    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("citizenshipNumber", formData.citizenshipNumber);
    dataToSend.append("citizenshipFront", images.citizenshipFront);

    if (images.profilePhoto) {
    dataToSend.append("profilePhoto", images.profilePhoto); // <--- ADD THIS
  }

    // Conditional License Info
    if (verifyLicense) {
      dataToSend.append("licenseNumber", formData.licenseNumber);
      dataToSend.append("licenseFront", images.licenseFront);
    }

    // Conditional Vehicle Info
    if (verifyVehicle) {
      dataToSend.append("vehicleNumber", fullVehicleNumber);
      dataToSend.append("engineNumber", formData.engineNumber);
      dataToSend.append("bluebookPage2", images.bluebookPage2);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/user/submit-verification/${userId}`, {
        method: 'PUT',
        // Note: Do NOT set Content-Type header when sending FormData
        body: dataToSend,
      });
      
      if (res.ok) {
        alert("✅ Verification request submitted with documents! Admin will review your details.");
        window.location.href = "/dashboard";
      } else {
        alert("❌ Submission failed. Ensure all images are selected.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow border-0 p-4 mx-auto my-5" style={{ maxWidth: '650px', borderRadius: '15px' }}>
      <div className="text-center mb-4">
        <h3 className="fw-bold m-0">Government Verification</h3>
        <p className="text-muted small">Upload official documents to sync your digital profile.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* SECTION 1: PERSONAL IDENTITY */}
        <div className="bg-light p-3 rounded mb-4 border">
          <h6 className="fw-bold border-bottom pb-2 mb-3 text-secondary">1. Personal Identity & Citizenship</h6>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name (as per Citizenship)</label>
            <input type="text" className="form-control" placeholder="E.g. sumit acharya"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div className="mb-3 p-2 bg-white rounded border">
    <label className="form-label small fw-bold text-primary">
      <i className="bi bi-person-bounding-box me-2"></i>Passport Size Photo
    </label>
    <p className="extra-small text-muted mb-2"></p>
    <input 
      type="file" 
      className="form-control form-control-sm" 
      accept="image/*"
      onChange={(e) => setImages({...images, profilePhoto: e.target.files[0]})} 
      required 
    />
  </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Citizenship Number</label>
            <input type="text" className="form-control mb-2" placeholder="12-01-72-XXXXX"
              onChange={(e) => setFormData({...formData, citizenshipNumber: e.target.value})} required />
            <label className="form-label extra-small text-muted fw-bold">Upload Citizenship (Front Photo)</label>
            <input type="file" className="form-control form-control-sm" accept="image/*"
              onChange={(e) => setImages({...images, citizenshipFront: e.target.files[0]})} required />
          </div>
        </div>

        {/* SECTION 2: SELECTION TOGGLES */}
        <div className="row mb-4">
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 py-2 fw-bold ${verifyLicense ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setVerifyLicense(!verifyLicense)}>
                    {verifyLicense ? '✓ License Added' : '+ Add License'}
                </button>
            </div>
            <div className="col-6">
                <button type="button" 
                    className={`btn w-100 py-2 fw-bold ${verifyVehicle ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setVerifyVehicle(!verifyVehicle)}>
                    {verifyVehicle ? '✓ Bluebook Added' : '+ Add Bluebook'}
                </button>
            </div>
        </div>

        {/* LICENSE INPUT */}
        {verifyLicense && (
          <div className="mb-4 p-3 border rounded border-primary bg-primary-subtle">
            <label className="form-label fw-bold">Driving License Number</label>
            <input type="text" className="form-control mb-2" placeholder="01-06-XXXXXXXX"
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
            <label className="form-label extra-small text-muted fw-bold">Upload License Photo</label>
            <input type="file" className="form-control form-control-sm" accept="image/*"
              onChange={(e) => setImages({...images, licenseFront: e.target.files[0]})} required />
          </div>
        )}

        {/* VEHICLE INPUT */}
        {verifyVehicle && (
          <div className="mb-4 p-3 border rounded border-success bg-success-subtle">
            <label className="form-label fw-bold mb-3 text-success">Vehicle Verification (Bluebook)</label>
            
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <select className="form-select" value={vDetails.province}
                  onChange={(e) => setVDetails({...vDetails, province: e.target.value})}>
                  <option value="BA">BAGMATI</option>
                  <option value="GA">GANDAKI</option>
                  <option value="KO">KOSHI</option>
                  <option value="LU">LUMBINI</option>
                  <option value="MA">MADHESH</option>
                  <option value="KA">KARNALI</option>
                  <option value="SU">SUDURPASHCHIM</option>

                </select>
              </div>
              <div className="col-md-2">
                <input type="text" className="form-control" placeholder="Lot" maxLength="3"
                  onChange={(e) => setVDetails({...vDetails, lot: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={vDetails.symbol}
                  onChange={(e) => setVDetails({...vDetails, symbol: e.target.value})}>
                  <option value="PA">PA  (Bike) </option>
                  <option value="YA">YA (Scooter)</option>
                  <option value="CHA">CHA  (Car)</option>
                   <option value="KHA">KHA (Heavy)</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="1234" maxLength="4"
                  onChange={(e) => setVDetails({...vDetails, number: e.target.value})} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Engine Number</label>
              <input type="text" className="form-control mb-2" placeholder="From Bluebook "
                onChange={(e) => setFormData({...formData, engineNumber: e.target.value})} required />
              <label className="form-label extra-small text-muted fw-bold">Upload Bluebook (Owner Details Page)</label>
              <input type="file" className="form-control form-control-sm" accept="image/*"
                onChange={(e) => setImages({...images, bluebookPage2: e.target.files[0]})} required />
            </div>

            <div className="mt-2 p-2 bg-dark text-white text-center rounded fw-bold small">
              LINKING: {fullVehicleNumber}
            </div>
          </div>
        )}

         <div className="alert alert-warning x-small p-2 mt-2" style={{ fontSize: '0.75rem' }}>

          <b>Note:</b> Admin will verify your input against the DoTM Master Database. False information will lead to account suspension or rejection.

        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-3 mt-3 shadow fw-bold">
          {loading ? (
            <span><span className="spinner-border spinner-border-sm me-2"></span>Processing...</span>
          ) : "Submit Documents for Approval"}
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;