const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  // --- IDENTIFICATION ---
  vehicleNumber: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true // Example: BAGMATI-125-PA-5566
  },
  ownerName: { type: String, required: true },
  ownerAddress: { type: String }, // As per the Bluebook record

  // --- TECHNICAL SPECS (Bluebook Page 3) ---
  engineNumber: { type: String, required: true, unique: true },
  chassisNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  make: { type: String }, // e.g., Bajaj, Toyota
  manufactureYear: { type: Number },
  vehicleType: { type: String, enum: ['Car', 'Bike', 'Scooter', 'Bus', 'Truck', 'Tractor'] },
  category: { 
    type: String, 
    required: true, 
    enum: ['Private', 'Public', 'Government', 'Diplomatic'], 
    default: 'Private' 
  },
  
  // Advanced Specs for Tax Calculation
  cc: { type: Number }, // Required for tax brackets in Nepal
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
  cylinders: { type: Number, default: 1 },
  seatingCapacity: { type: Number },
  unladenWeight: { type: String }, // e.g., "150 kg"

  // --- REGISTRATION DETAILS ---
  registrationDate: { type: Date, required: true },
  issuingOffice: { type: String, default: "Gurjudhara, Kathmandu" }, 
  
  // --- BLUEBOOK VALIDITY & TAX (The most important part for Renewals) ---
  taxExpiryDate: { type: Date, required: true }, // Yearly tax renewal date
  insuranceCompany: { type: String },
  insuranceExpiryDate: { type: Date },
  
  // Digital Copy Reference
  officialBluebookPhoto: { type: String }, // Link to official master image

  // --- STATUS ---
  isBlacklisted: { type: Boolean, default: false }, // Stolen or high fines
  status: { 
    type: String, 
    enum: ['Active', 'Transferred', 'Scrapped'], 
    default: 'Active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);