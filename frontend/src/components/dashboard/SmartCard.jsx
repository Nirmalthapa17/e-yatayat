import React from 'react';

const SmartCard = ({ type, data, colorClass }) => {
  return (
    <div className="license-card-container mb-4">
      {/* Side Status Bar - Green for Valid */}
      <div className={`license-side-bar ${colorClass || 'bg-success'}`}>
        <span>{type === 'license' ? 'LICENSE IS VALID' : 'VEHICLE REGISTERED'}</span>
      </div>

      <div className="license-main-content p-3">
        {/* Header mimicking the screenshot */}
        <div className="text-center border-bottom pb-2 mb-3">
          <h6 className="m-0 fw-bold tiny-label">REPUBLIC OF NEPAL</h6>
          <h6 className="m-0 fw-bold tiny-label">DEPARTMENT OF TRANSPORT MANAGEMENT</h6>
          <h5 className="m-0 fw-bold text-primary" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
            {type === 'license' ? "NON-PROFESSIONAL DRIVER'S LICENSE" : "VEHICLE REGISTRATION (BLUEBOOK)"}
          </h5>
        </div>

        <div className="row g-0">
          {/* Photo/Vehicle Image Section */}
          <div className="col-4 text-center border-end pe-2">
            <div className="bg-secondary-subtle rounded mb-2 d-flex align-items-center justify-content-center" 
                 style={{ height: '110px', border: '1px dashed #999' }}>
              {type === 'license' ? 
                <span className="text-muted" style={{fontSize: '10px'}}>USER PHOTO</span> : 
                <span className="text-muted" style={{fontSize: '10px'}}>VEHICLE IMG</span>
              }
            </div>
            <p className="fw-bold mb-0" style={{fontSize: '11px'}}>{data.name || data.owner}</p>
          </div>

          {/* Details Grid Section */}
          <div className="col-8 ps-3">
            <div className="row g-2">
              <div className="col-12">
                <label className="d-block tiny-label">Registration / License No.</label>
                <span className="fw-bold small text-primary">{data.number}</span>
              </div>
              
              {type === 'license' ? (
                <>
                  <div className="col-6">
                    <label className="d-block tiny-label">Categories</label>
                    <span className="fw-bold small">{data.categories}</span>
                  </div>
                  <div className="col-6">
                    <label className="d-block tiny-label">Blood Group</label>
                    <span className="fw-bold small text-danger">{data.bloodGroup}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-6">
                    <label className="d-block tiny-label">Model</label>
                    <span className="fw-bold small">{data.model}</span>
                  </div>
                  <div className="col-6">
                    <label className="d-block tiny-label">Engine No.</label>
                    <span className="fw-bold small" style={{fontSize: '10px'}}>{data.engine}</span>
                  </div>
                </>
              )}

              <div className="col-6">
                <label className="d-block tiny-label">Expiry Date</label>
                <span className="fw-bold small">{data.expiry}</span>
              </div>

              <div className="col-6 text-end">
                 {/* Placeholder for QR Code */}
                 <div className="bg-dark d-inline-block p-1 rounded mt-1">
                    <div style={{width: '35px', height: '35px', background: 'white'}}></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCard;