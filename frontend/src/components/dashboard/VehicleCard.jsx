import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  // Logic to check if tax is expired
  const isExpired = new Date(vehicle.taxExpiry) < new Date();

  return (
    /* Removed the col-md-6 wrapper here so the parent page handles the grid */
    <div className="card vehicle-card border-0 shadow-sm p-4 h-100 transition-hover">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Modern Nepali Plate Style */}
        <div className="plate-header">
          <span className="small text-muted d-block mb-1" style={{ fontSize: '10px' }}>NEPAL TRANSPORT</span>
          <h3 className="h5 fw-bold m-0 text-dark font-monospace" style={{ letterSpacing: '1px' }}>
            🇳🇵 {vehicle.plateNumber}
          </h3>
        </div>
        <span className={`badge ${isExpired ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} border px-3`}>
          {isExpired ? 'Action Required' : 'Active'}
        </span>
      </div>
      
      <div className="vehicle-data-box p-3 rounded-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #eee' }}>
        <div className="row g-3">
          <div className="col-6">
            <label className="d-block small text-muted text-uppercase fw-bold" style={{ fontSize: '9px' }}>Vehicle Model</label>
            <span className="fw-semibold text-truncate d-block text-dark">{vehicle.model}</span>
          </div>
          <div className="col-6">
            <label className="d-block small text-muted text-uppercase fw-bold" style={{ fontSize: '9px' }}>Category</label>
            <span className="badge bg-white text-primary border border-primary-subtle w-100">{vehicle.type}</span>
          </div>
          <div className="col-6">
            <label className="d-block small text-muted text-uppercase fw-bold" style={{ fontSize: '9px' }}>Fuel / Engine</label>
            <span className="fw-medium small d-block">{vehicle.fuel} | {vehicle.engine}</span>
          </div>
          <div className="col-6 text-end">
            <label className="d-block small text-muted text-uppercase fw-bold" style={{ fontSize: '9px' }}>Tax Status</label>
            <span className={`small fw-bold ${isExpired ? 'text-danger' : 'text-success'}`}>
               {isExpired ? '● Expired' : '● Up to date'}
            </span>
          </div>
          
          <div className="col-12">
            <hr className="my-2 opacity-25" />
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted d-block" style={{ fontSize: '10px' }}>VALID UNTIL</small>
                <span className={`small fw-bold ${isExpired ? 'text-danger' : 'text-dark'}`}>
                  {vehicle.taxExpiry}
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