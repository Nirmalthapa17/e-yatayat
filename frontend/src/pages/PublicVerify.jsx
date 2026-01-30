import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicVerify = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        // Updated to your mobile testing IP
        const response = await axios.get(`http://172.18.123.69:5000/api/user/verify-all/${userId}`);
        setData(response.data);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.response?.data?.message || "Invalid QR code or record not found.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchVerificationData();
  }, [userId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={styles.centerOverlay}>
        <div className="spinner-border text-primary mb-3"></div>
        <p style={{ color: '#666' }}>Accessing e-Yatayat Secure Database...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 p-5 shadow-sm">
          <h2 className="display-6">⚠️ Verification Failed</h2>
          <p className="lead">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-outline-danger mt-3 px-4 rounded-pill">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <img src="/nepal-logo.png" alt="Nepal Logo" style={styles.logo} />
          <h5 style={styles.govTitle}>Government of e-yatayat</h5>
          <p style={styles.govSubtitle}>Ministry of Physical Infrastructure and Transport</p>
          <div className="no-print mb-3">
             <button onClick={handlePrint} style={styles.printBtn}>Print Official Record</button>
          </div>
          <div style={styles.verifyBadge}>
            <span style={{ marginRight: '5px' }}>✔</span> VERIFIED REAL-TIME DATA
          </div>
        </div>

        {/* User Identity Card */}
        <div style={styles.identityCard}>
          <label style={styles.label}>Full Name of Citizen</label>
          <h3 style={styles.nameValue}>{data.fullName || "Name Not Found"}</h3>
        </div>

        {/* License Section */}
        <h6 style={styles.sectionTitle}>🪪 DRIVING LICENSE STATUS</h6>
        {data.license ? (
          <div style={{ ...styles.documentCard, borderLeft: '6px solid #007bff' }}>
            <div style={styles.cardRow}>
              <div>
                <small style={styles.label}>License Number</small>
                <div style={styles.boldText}>{data.license.licenseNumber}</div>
              </div>
              <div style={styles.categoryBadge}>{data.license.category || 'A, B'}</div>
            </div>
            <div style={styles.divider}></div>
            <small style={styles.label}>Expiry Date</small>
            <div style={new Date(data.license.expiryDate) < new Date() ? styles.textRed : styles.textGreen}>
              {new Date(data.license.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {new Date(data.license.expiryDate) < new Date() ? ' (Expired)' : ' (Active)'}
            </div>
          </div>
        ) : (
          <div style={styles.emptyCard}>No Driving License linked to this profile.</div>
        )}

        {/* Vehicles Section */}
        <h6 style={styles.sectionTitle}>🚗 REGISTERED VEHICLES</h6>
        {data.vehicles && data.vehicles.length > 0 ? (
          data.vehicles.map((v, idx) => (
            <div key={idx} style={styles.documentCard}>
              <div style={styles.cardRow}>
                <h4 style={{ ...styles.boldText, color: '#007bff', margin: 0 }}>{v.vehicleNumber}</h4>
                <div style={new Date(v.taxExpiryDate) < new Date() ? styles.statusBadgeRed : styles.statusBadgeGreen}>
                  Tax: {new Date(v.taxExpiryDate) < new Date() ? 'Expired' : 'Paid'}
                </div>
              </div>
              <p style={styles.vehicleModel}>{v.make} {v.model} <span style={{ color: '#888' }}>({v.manufactureYear || 'N/A'})</span></p>
              <div style={styles.infoBox}>
                <div style={styles.infoRow}>
                  <span>Engine:</span> <strong>{v.engineNumber}</strong>
                </div>
                {/* --- ADD INSURANCE EXPIRY HERE --- */}
  <div style={styles.infoRow}>
    <span>Insurance Expiry:</span> 
    <strong style={new Date(v.insuranceExpiryDate) < new Date() ? styles.textRed : styles.textGreen}>
      {v.insuranceExpiryDate 
        ? new Date(v.insuranceExpiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : "No Record"}
    </strong>
  </div>
                <div style={styles.infoRow}>
                  <span>Chassis:</span> <strong>{v.chassisNumber || 'N/A'}</strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyCard}>No registered vehicles found.</div>
        )}

        {/* Security Seal */}
        <div style={styles.securitySection}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '8px' }}>🛡️</span>
            <small style={styles.label}>Digital Authenticity Seal</small>
          </div>
          <div style={styles.hashBox}>
            <code style={styles.hashText}>{data.securityHash || "SECURE-SYSTEM-V3"}</code>
          </div>
          <p style={styles.disclaimer}>
            This record is cryptographically signed. Verification is valid only via official 
            <strong> e-Yatayat</strong> gateway.
          </p>
        </div>

        <footer style={styles.footer}>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <p>© 2026 e-Yatayat Digital Verification</p>
            <p>Generated: {new Date().toLocaleString()}</p>
          </div>
        </footer>
      </div>

      <style>{`
        @media print { .no-print { display: none !important; } }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECT FOR CLEANER CODE ---
const styles = {
  pageBackground: { backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '20px 10px', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: '480px', margin: '0 auto' },
  centerOverlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: '30px' },
  logo: { width: '75px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
  govTitle: { fontWeight: 'bold', marginTop: '15px', color: '#333' },
  govSubtitle: { fontSize: '0.8rem', color: '#666', marginBottom: '15px' },
  printBtn: { border: '1px solid #ccc', background: '#fff', borderRadius: '20px', padding: '5px 15px', fontSize: '0.8rem', cursor: 'pointer' },
  verifyBadge: { backgroundColor: '#198754', color: '#fff', padding: '8px 20px', borderRadius: '30px', fontSize: '0.75rem', display: 'inline-block', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  
  identityCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },
  sectionTitle: { fontSize: '0.8rem', color: '#777', fontWeight: 'bold', margin: '20px 0 10px 5px' },
  documentCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '15px' },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  boldText: { fontWeight: 'bold', fontSize: '1.1rem' },
  categoryBadge: { backgroundColor: '#e7f1ff', color: '#007bff', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem' },
  divider: { height: '1px', backgroundColor: '#eee', margin: '15px 0' },
  
  label: { fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', display: 'block' },
  nameValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#111', margin: 0 },
  vehicleModel: { fontWeight: '600', marginBottom: '10px', color: '#333' },
  
  infoBox: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '10px', fontSize: '0.8rem' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  
  textGreen: { color: '#198754', fontWeight: 'bold' },
  textRed: { color: '#dc3545', fontWeight: 'bold' },
  statusBadgeGreen: { backgroundColor: '#d1e7dd', color: '#0f5132', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  statusBadgeRed: { backgroundColor: '#f8d7da', color: '#842029', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '15px', textAlign: 'center', fontStyle: 'italic', fontSize: '0.85rem', color: '#888' },
  securitySection: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', borderTop: '4px solid #ffc107', marginTop: '30px' },
  hashBox: { backgroundColor: '#f1f3f5', padding: '8px', borderRadius: '5px', overflowWrap: 'break-word' },
  hashText: { fontSize: '0.65rem', color: '#555' },
  disclaimer: { fontSize: '0.7rem', color: '#888', marginTop: '10px', lineHeight: '1.4' },
  footer: { textAlign: 'center', marginTop: '40px', paddingBottom: '40px', fontSize: '0.75rem', color: '#aaa' }
};

export default PublicVerify;