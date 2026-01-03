const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true // Example Format: "BAGMATI-125-PA-5566"
  },
  ownerName: { type: String, required: true },
  engineNumber: { type: String, required: true, unique: true },
  chassisNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true }, // e.g., "Pulsar 220F"
  manufactureYear: Number,
  vehicleType: { type: String, enum: ['Car', 'Bike', 'Scooter', 'Bus', 'Truck'] },
  cc: Number,
  fuelType: { type: String, default: 'Petrol' },
  registrationDate: { type: Date, required: true },
  taxExpiryDate: { type: Date, required: true }, // Important for Bluebook validity
  isVerifiedByAdmin: { type: Boolean, default: false } // The "Gatekeeper" boolean
});

module.exports = mongoose.model('Vehicle', VehicleSchema);