// frontend/src/components/DocumentStatusTable.jsx

import React from 'react';

// *** MOCK DATA *** // 
// This array simulates the documents associated with the user, 
// which would be fetched from the backend.
const mockDocuments = [
    {
        id: 1,
        type: "Driving License",
        number: "BA 10 KA 1234",
        expiryDate: "2026/03/15", // Next year
        status: "Active",
    },
    {
        id: 2,
        type: "Vehicle Bluebook",
        number: "LU 15 PA 5678",
        expiryDate: "2025/12/30", // Close to expiration!
        status: "Active",
    },
    {
        id: 3,
        type: "Vehicle Bluebook",
        number: "KO 03 TA 9012",
        expiryDate: "2024/07/20", // Expired
        status: "Expired",
    },
];

// Helper function to check if a document is close to expiring (within 90 days)
const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Highlight if expiring in less than 90 days but is NOT already expired
    return diffDays > 0 && diffDays <= 90;
};

const DocumentStatusTable = () => {

    return (
        // Use 'table-responsive' to ensure table scrolls horizontally on small screens
        <div className="table-responsive"> 
            {/* table-striped adds alternating row colors, table-hover highlights rows on mouseover */}
            <table className="table  table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Document Type</th>
                        <th>Number</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Days Left</th>
                    </tr>
                </thead>
                <tbody>
                    {mockDocuments.map((doc) => {
                        const isSoon = isExpiringSoon(doc.expiryDate);
                        const daysLeft = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                        
                        let rowClass = '';
                        let statusBadgeClass = 'bg-secondary';
                        
                        if (daysLeft <= 0) {
                            rowClass = 'table-danger'; // Bootstrap's red for expired
                            statusBadgeClass = 'bg-danger';
                            doc.status = 'Expired';
                        } else if (isSoon) {
                            rowClass = 'table-warning'; // Bootstrap's yellow for warning
                            statusBadgeClass = 'bg-warning text-dark';
                        } else {
                            statusBadgeClass = 'bg-success'; // Bootstrap's green for active
                        }

                        return (
                            <tr key={doc.id} className={rowClass}>
                                <td>{doc.type}</td>
                                <td>{doc.number}</td>
                                <td>
                                    <strong>{doc.expiryDate}</strong>
                                </td>
                                <td>
                                    {/* Use Bootstrap Badge class: 'badge' */}
                                    <span className={`badge ${statusBadgeClass}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td>
                                    {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {/* Simple Legend using Bootstrap utility colors */}
            <div className="text-muted small mt-3">
                <span className="badge bg-warning text-dark me-2">Warning</span> Expiring in &lt; 90 days |
                <span className="badge bg-danger ms-3 me-2">Danger</span> Expired 
            </div>
        </div>
    );
};

export default DocumentStatusTable;