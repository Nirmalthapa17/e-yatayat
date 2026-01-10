const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  // --- IDENTIFICATION ---
  vehicleNumber: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true // Format: BAGMATI-125-PA-5566
  },
  ownerName: { type: String, required: true },
  
  // --- TECHNICAL SPECS (Required for Nepal Bluebook) ---
  engineNumber: { type: String, required: true, unique: true },
  chassisNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true }, // e.g., "Pulsar 220F"
  make: { type: String }, // e.g., "Bajaj"
  manufactureYear: Number,
  vehicleType: { type: String, enum: ['Car', 'Bike', 'Scooter', 'Bus', 'Truck'] },
  cc: Number,
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
  color: { type: String },

  // --- REGISTRATION DETAILS ---
  registrationDate: { type: Date, required: true },
  issuingOffice: { type: String, default: "Gurjudhara, Kathmandu" }, // Specific Nepal Transport Office
  
  // --- BLUEBOOK VALIDITY & TAX ---
  taxExpiryDate: { type: Date, required: true }, // The "Renew Date" in the Bluebook
  insuranceCompany: { type: String },
  insurancePolicyNumber: { type: String },
  insuranceExpiryDate: { type: Date },

  // --- STATUS ---
  isBlacklisted: { type: Boolean, default: false }, // If the vehicle is stolen or has unpaid fines
  isVerifiedByAdmin: { type: Boolean, default: true } // Since this is master data, it's true by default
});

module.exports = mongoose.model('Vehicle', VehicleSchema);