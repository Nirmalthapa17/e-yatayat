const mongoose = require('mongoose');

const LicenseRenewalSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  
  // Changed these to required: false (or you can remove them)
  dob: { type: Date, required: false }, 
  previousExpiry: { type: Date, required: false },
  licenseUrl: { type: String, required: false }, 
  licensePublicId: { type: String },

  // These remain required as they are sent by your form
  medicalUrl: { type: String, required: true },
  medicalPublicId: { type: String },
  medicalOriginalName: { type: String },

  paymentReceiptUrl: { type: String, required: true },
  paymentReceiptPublicId: { type: String },
  paymentReceiptOriginalName: { type: String },

  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminRemarks: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LicenseRenewal', LicenseRenewalSchema);