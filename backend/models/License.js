const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
  // --- IDENTIFICATION ---
  licenseNumber: { type: String, required: true, unique: true }, // Format: 01-06-00123456
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // --- FAMILY & CITIZENSHIP ---
  fatherName: { type: String, required: true },
  citizenshipNumber: { type: String, required: true },
  issuedDistrict: { type: String, required: true }, // e.g., "Kavre", "Kathmandu"

  // --- LICENSE SPECIFICS ---
  categories: [{ 
    type: String, 
    enum: ['A', 'B', 'K', 'C', 'C1', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] 
    // A=Motorcycle, B=Car, K=Scooter, etc.
  }],
  
  // --- VALIDITY & OFFICE ---
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  issuingOffice: { type: String, default: "Ekantakuna, Lalitpur" },
  
  // --- STATUS & SECURITY ---
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Suspended', 'Duplicate'], 
    default: 'Active' 
  },
  profileImage: { type: String }, // Official photo from DOTM
  
  // --- CONTACT (For Emergency) ---
  permanentAddress: { type: String },
  contactNumber: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('License', LicenseSchema);