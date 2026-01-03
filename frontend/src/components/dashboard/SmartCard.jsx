import React from 'react';

const SmartCard = ({ type, data, colorClass }) => {
  // Safety check: If no data is passed, don't render anything to avoid crashes
  if (!data) return null;

  return (
    <div className="license-card-container mb-4 shadow-sm border rounded overflow-hidden bg-white">
      {/* Side Status Bar */}
      <div className={`license-side-bar ${colorClass || 'bg-success'}`} style={{ minWidth: '40px' }}>
        <span>{type === 'license' ? 'LICENSE IS VALID' : 'VEHICLE REGISTERED'}</span>
      </div>

      <div className="license-main-content p-3 flex-grow-1">
        {/* Header */}
        <div className="text-center border-bottom pb-2 mb-3">
          <h6 className="m-0 fw-bold tiny-label">REPUBLIC OF NEPAL</h6>
          <h6 className="m-0 fw-bold tiny-label">DEPARTMENT OF TRANSPORT MANAGEMENT</h6>
          <h5 className="m-0 fw-bold text-primary" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            {type === 'license' ? "NON-PROFESSIONAL DRIVER'S LICENSE" : "VEHICLE REGISTRATION (BLUEBOOK)"}
          </h5>
        </div>

        <div className="row g-0">
          {/* Photo Section */}
          <div className="col-4 text-center border-end pe-2">
            <div className="bg-secondary-subtle rounded mb-2 d-flex align-items-center justify-content-center" 
                 style={{ height: '100px', border: '1px dashed #ccc' }}>
              <span className="text-muted" style={{fontSize: '9px'}}>
                {type === 'license' ? 'USER PHOTO' : 'VEHICLE IMG'}
              </span>
            </div>
            <p className="fw-bold mb-0 text-uppercase" style={{fontSize: '10px'}}>
              {data.name || data.owner || "NAME NOT FOUND"}
            </p>
          </div>

          {/* Details Section */}
          <div className="col-8 ps-3">
            <div className="row g-2">
              <div className="col-12">
                <label className="d-block tiny-label">Registration / License No.</label>
                <span className="fw-bold small text-primary">{data.number || "PENDING"}</span>
              </div>
              
              {type === 'license' ? (
                <>
                  <div className="col-6">
                    <label className="d-block tiny-label">Categories</label>
                    <span className="fw-bold small">{data.categories || "N/A"}</span>
                  </div>
                  <div className="col-6">
                    <label className="d-block tiny-label">Blood Group</label>
                    <span className="fw-bold small text-danger">{data.bloodGroup || "N/A"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-6">
                    <label className="d-block tiny-label">Model</label>
                    <span className="fw-bold small">{data.model || "N/A"}</span>
                  </div>
                  <div className="col-6">
                    <label className="d-block tiny-label">Engine No.</label>
                    <span className="fw-bold small" style={{fontSize: '9px'}}>{data.engine || "N/A"}</span>
                  </div>
                </>
              )}

              <div className="col-6">
                <label className="d-block tiny-label">Expiry Date</label>
                <span className="fw-bold small">{data.expiry || "N/A"}</span>
              </div>

              <div className="col-6 text-end">
                 <div className="bg-dark d-inline-block p-1 rounded mt-1">
                    <div style={{width: '32px', height: '32px', background: 'white'}}></div>
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