import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRModal = ({ user, onClose }) => {
  const qrRef = useRef();

  // 1. Logic: Use Official Name from Linked License, otherwise fallback to Signup Name
  const officialName = user?.linkedLicense?.fullName || `${user?.fullName || 'User'}`;
  
  // 2. Logic: Verification Status Color
  const isVerified = user?.verificationStatus === 'Approved';

  const verifyUrl = `http://172.18.91.16:5173/verify/user/${user._id}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `eYatayat_QR_${officialName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content shadow-lg bg-white p-4" style={modalContentStyle}>
        <div className="text-end">
          <button className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        
        <div className="text-center">
          {/* Status Badge */}
          <span className={`badge mb-2 ${isVerified ? 'bg-success' : 'bg-warning text-dark'}`}>
            {isVerified ? '✓ VERIFIED CITIZEN' : '⚠ PENDING VERIFICATION'}
          </span>

          <h5 className="fw-bold mb-1">eYatayat Digital ID</h5>
          <p className="small text-muted mb-3">Nepal Government Standard QR</p>
          
          <div ref={qrRef} className="bg-white p-3 d-inline-block rounded-3 mb-3 border border-2">
            <QRCodeCanvas 
              value={verifyUrl} 
              size={200}
              level={"H"} 
              includeMargin={true}
            />
          </div>

          <div className="text-start mb-3 border-top pt-3">
            <div className="small fw-bold text-uppercase text-primary">Name: {officialName}</div>
            <div className="small text-muted">License: {user?.linkedLicense?.licenseNumber || 'Not Linked'}</div>
            <div className="small text-muted" style={{fontSize: '10px'}}>System ID: {user?._id}</div>
          </div>

          <button onClick={downloadQR} className="btn btn-primary w-100 mb-2 py-2 shadow-sm">
            💾 Download QR Image
          </button>
          <button onClick={onClose} className="btn btn-outline-secondary w-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles remain the same as your previous version
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  pointerEvents: 'auto'
};

const modalContentStyle = {
  width: '90%',
  maxWidth: '380px',
  borderRadius: '24px',
  border: 'none',
  position: 'relative',
  zIndex: 10000
};

export default QRModal;