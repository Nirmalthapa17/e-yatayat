const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic Account Info
  fullName: { type: String }, // Name used at Signup
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // --- FORM SUBMISSION DATA (User Claims) ---
  
  appliedName: { type: String }, // Name provided in Verification Form
  appliedProfilePhotoUrl: { type: String },
  citizenshipNumber: { type: String },
  appliedLicenseNumber: { type: String },
  appliedVehicles: [{
    vehicleNumber: String,
    engineNumber: String,
    bluebookImageUrl: String,
    submittedAt: { type: Date, default: Date.now }
}],

  // --- DOCUMENT IMAGE URLS (Cloudinary Links) ---
  citizenshipImageUrl: { type: String },
  licenseImageUrl: { type: String },
  bluebookImageUrl: { type: String },

  // --- STATUS CONTROL ---
  verificationStatus: { 
    type: String, 
    enum: ['None', 'Pending', 'Approved', 'Rejected'], 
    default: 'None' 
  },
   

  // --- LINKED DATA (Digital Wallet - Connected to Master DB) ---
  linkedLicense: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    default: null 
  },
  linkedVehicles: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle' 
  }],
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);