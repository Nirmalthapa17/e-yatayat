import React from 'react';

// Helper function to check if a document is close to expiring (within 90 days)
const isExpiringSoon = (expiryDate) => {
    if (!expiryDate || expiryDate === "Permanent") return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays <= 90;
};

const DocumentStatusTable = ({ user, vehicle }) => {

    // *** DATABASE DATA MAPPING *** // 
    // We transform the props from the database into a list the table can loop through
    const realDocuments = [
        {
            id: 'citizenship',
            type: "Citizenship Certificate",
            number: user?.citizenshipNumber || "Pending",
            expiryDate: "Permanent", 
            status: user?.isVerified ? "Verified" : "Under Review",
        },
        {
            id: 'bluebook',
            type: "Vehicle Bluebook",
            number: vehicle?.vehicleNumber || user?.vehicleNumber || "N/A",
            expiryDate: vehicle?.expiryDate ? new Date(vehicle.expiryDate).toISOString().split('T')[0] : "N/A",
            status: vehicle ? "Active" : "Pending Approval",
        }
    ];

    return (
        <div className="table-responsive"> 
            <table className="table table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Document Type</th>
                        <th>Number</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Days Left / Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {realDocuments.map((doc) => {
                        const isSoon = isExpiringSoon(doc.expiryDate);
                        
                        // Calculate days left only for dated documents
                        let daysLeft = null;
                        if (doc.expiryDate !== "Permanent" && doc.expiryDate !== "N/A") {
                            daysLeft = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                        }
                        
                        // Dynamic Styling Logic
                        let rowClass = '';
                        let statusBadgeClass = 'bg-secondary';
                        
                        if (daysLeft !== null && daysLeft <= 0) {
                            rowClass = 'table-danger'; 
                            statusBadgeClass = 'bg-danger';
                            doc.status = 'Expired';
                        } else if (isSoon) {
                            rowClass = 'table-warning'; 
                            statusBadgeClass = 'bg-warning text-dark';
                        } else if (doc.status === 'Verified' || doc.status === 'Active') {
                            statusBadgeClass = 'bg-success';
                        }

                        return (
                            <tr key={doc.id} className={rowClass}>
                                <td>{doc.type}</td>
                                <td><code className="text-dark fw-bold">{doc.number}</code></td>
                                <td>
                                    <strong>{doc.expiryDate}</strong>
                                </td>
                                <td>
                                    <span className={`badge ${statusBadgeClass}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td>
                                    {doc.expiryDate === "Permanent" ? (
                                        <span className="text-muted">No Expiry</span>
                                    ) : daysLeft !== null ? (
                                        daysLeft > 0 ? `${daysLeft} days left` : <span className="fw-bold text-danger">Overdue</span>
                                    ) : (
                                        <span className="text-muted">N/A</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            <div className="text-muted small mt-3 d-flex align-items-center">
                <span className="badge bg-warning text-dark me-2">Warning</span> Expiring in &lt; 90 days |
                <span className="badge bg-danger ms-3 me-2">Danger</span> Expired 
                <span className="ms-auto text-primary italic">Source: Digital Yatayat Official Records</span>
            </div>
        </div>
    );
};

export default DocumentStatusTable;