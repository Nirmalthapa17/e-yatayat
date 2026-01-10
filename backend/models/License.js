const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true, unique: true }, // Format: 01-06-00123456
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  
  // Nepal Specifics
  citizenshipNumber: { type: String, required: true },
  issuedDistrict: { type: String, required: true }, // e.g., "Kavre"
  categories: [{ type: String, enum: ['A', 'B', 'K', 'C', 'D'] }], // A=Bike, B=Car, K=Scooter
  
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  issuingOffice: { type: String, default: "Ekantakuna, Lalitpur" },
  
  profileImage: { type: String } // Link to the user's photo
});

module.exports = mongoose.model('License', LicenseSchema);