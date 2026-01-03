import React from 'react';

const VehicleCard = ({ vehicle }) => {
  // Logic to check if tax is expired
  const isExpired = new Date(vehicle.taxExpiry) < new Date();

  return (
    <div className="col-md-6 mb-4">
      <div className="card vehicle-card border-0 shadow-sm p-4 h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Blue plate style header */}
          <h3 className="h5 fw-bold m-0 text-primary">🇳🇵 {vehicle.plateNumber}</h3>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3">
            {vehicle.type}
          </span>
        </div>
        
        <div className="vehicle-data-box p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="row g-3">
            <div className="col-6">
              <label className="d-block small text-muted text-uppercase fw-semibold">Owner Record</label>
              <span className="fw-medium text-truncate d-block">{vehicle.model}</span>
            </div>
            <div className="col-6">
              <label className="d-block small text-muted text-uppercase fw-semibold">Fuel Type</label>
              <span className="fw-medium">{vehicle.fuel}</span>
            </div>
            <div className="col-6">
              <label className="d-block small text-muted text-uppercase fw-semibold">Engine No.</label>
              <span className="fw-medium text-truncate d-block">{vehicle.engine}</span>
            </div>
            <div className="col-12">
              <hr className="my-2 opacity-50" />
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Tax Paid Until:</small>
                {/* Use the expiry logic to change color to red if expired */}
                <span className={`small fw-bold ${isExpired ? 'text-danger' : 'text-success'}`}>
                  {vehicle.taxExpiry} {isExpired && "(Expired)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;