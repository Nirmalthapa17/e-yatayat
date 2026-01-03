const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  categories: [{ type: String }], // e.g., ["A", "B"]
  fatherName: String,
  address: String,
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  issuingOffice: String, // e.g., "Ekantakuna, Lalitpur"
  isVerifiedByAdmin: { type: Boolean, default: false } // The "Gatekeeper" boolean
});

module.exports = mongoose.model('License', LicenseSchema);