// src/models/LicenseRenewal.js
const mongoose = require('mongoose');

const LicenseRenewalSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  previousExpiry: { type: Date, required: true },

  licenseUrl: { type: String, required: true },
  licensePublicId: String,
  licenseOriginalName: { type: String },

  medicalUrl: { type: String, required: true },
  medicalPublicId: String,
  medicalOriginalName: { type: String },

  paymentReceiptUrl: { type: String, required: true },
  paymentReceiptPublicId: String,
  paymentReceiptOriginalName: { type: String },

  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LicenseRenewal', LicenseRenewalSchema);
