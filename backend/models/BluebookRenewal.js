const mongoose = require('mongoose');

const BluebookRenewalSchema = new mongoose.Schema({
  vehicleNumber: { 
    type: String, 
    required: true,
    trim: true 
  },
  ownerName: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true 
  },
  // Set to false because we are now pulling/calculating this or 
  // letting admin handle it based on the uploaded bluebook.
  previousExpiry: { 
    type: Date, 
    required: false 
  },

 // --- UPDATED: Changed Bluebook fields to Insurance ---
  insuranceUrl: { 
    type: String, 
    required: true 
  },
  insurancePublicId: { type: String },
  insuranceOriginalName: { type: String },

  // Document 2: Payment Receipt
  paymentReceiptUrl: { type: String, required: true },
  paymentReceiptPublicId: { type: String },
  paymentReceiptOriginalName: { type: String },

  // Document 3: Pollution Certificate
  pollutionDocUrl: { type: String, required: true }, 
  pollutionDocPublicId: { type: String },
  pollutionDocOriginalName: { type: String },

  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('BluebookRenewal', BluebookRenewalSchema);