import React from 'react';

const DocumentStatusTable = ({ user }) => {
  // Logic: Create a list of all documents to display
  const documents = [];

  // 1. Add License if it exists in the linkedLicense object
  if (user?.linkedLicense) {
    documents.push({
      name: "Driving License",
      id: user.linkedLicense.licenseNumber,
      status: user.isVerified ? "Verified" : "Pending",
      type: "Personal"
    });
  }

  // 2. Add Citizenship (assuming it's directly on the user object)
  if (user?.citizenshipNumber) {
    documents.push({
      name: "Citizenship Card",
      id: user.citizenshipNumber,
      status: "Verified", // Usually verified during signup
      type: "Personal"
    });
  }

  // 3. Add all Bluebooks from the linkedVehicles array
  if (user?.linkedVehicles && user.linkedVehicles.length > 0) {
    user.linkedVehicles.forEach(veh => {
      documents.push({
        name: `Bluebook (${veh.vehicleType || 'Vehicle'})`,
        id: veh.vehicleNumber,
        status: veh.isVerified ? "Verified" : "Under Review",
        type: "Property"
      });
    });
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Document Name</th>
            <th>Registration number No.</th>
            <th>Type</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? documents.map((doc, index) => (
            <tr key={index}>
              <td className="fw-bold">{doc.name}</td>
              <td className="text-muted small">{doc.id}</td>
              <td><span className="badge bg-light text-dark border">{doc.type}</span></td>
              <td>
                <span className={`badge ${doc.status === 'Verified' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {doc.status}
                </span>
              </td>
              
            
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-muted">
                No documents found. Please complete the verification form.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentStatusTable;