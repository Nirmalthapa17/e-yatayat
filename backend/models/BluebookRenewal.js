// src/models/BluebookRenewal.js
const mongoose = require('mongoose');

const BluebookRenewalSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  previousExpiry: { type: Date, required: true },

  bluebookUrl: { type: String, required: true },
  bluebookPublicId: { type: String },
  bluebookOriginalName: { type: String },

  paymentReceiptUrl: { type: String, required: true },
  paymentReceiptPublicId: { type: String },
  paymentReceiptOriginalName: { type: String },

  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BluebookRenewal', BluebookRenewalSchema);
