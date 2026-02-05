const BluebookRenewal = require('../models/BluebookRenewal');
const LicenseRenewal = require('../models/LicenseRenewal');
const cloudinary = require('cloudinary').v2;
const { PassThrough } = require('stream');
const { ONE_MB } = require('../middleware/upload');

// Configure Cloudinary using env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

/**
 * Helper to upload a buffer to Cloudinary using streams
 */
const uploadBufferToCloudinary = (buffer, folder = 'e-yatayat', publicIdPrefix = undefined) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: 'auto', 
        public_id: publicIdPrefix ? `${publicIdPrefix}_${Date.now()}` : undefined 
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    const passthrough = new PassThrough();
    passthrough.end(buffer);
    passthrough.pipe(uploadStream);
  });
};

/**
 * 1. SUBMIT BLUEBOOK RENEWAL
 */
const submitBluebook = async (req, res, next) => {
  try {
    const { vehicleNumber, ownerName, email } = req.body;

    if (!vehicleNumber || !ownerName || !email) {
      return res.status(400).json({ message: 'vehicleNumber, ownerName, and email are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const insuranceFile = req.files?.insuranceDoc?.[0] || req.files?.bluebook?.[0]; 
    const receiptFile = req.files?.receipt?.[0];
    const pollutionFile = req.files?.pollutionDoc?.[0];

    if (!insuranceFile || !receiptFile || !pollutionFile) {
      return res.status(400).json({ message: 'Insurance, receipt, and pollution document are required' });
    }

    let insuranceRes, receiptRes, pollutionRes;
    try {
      [insuranceRes, receiptRes, pollutionRes] = await Promise.all([
        uploadBufferToCloudinary(insuranceFile.buffer, 'e-yatayat/bluebook', 'insurance'),
        uploadBufferToCloudinary(receiptFile.buffer, 'e-yatayat/receipts', 'receipt'),
        uploadBufferToCloudinary(pollutionFile.buffer, 'e-yatayat/pollution', 'pollution')
      ]);
    } catch (upErr) {
      console.error('Cloudinary upload error (bluebook):', upErr);
      return res.status(500).json({ message: 'Failed to upload files to Cloudinary' });
    }

    const doc = new BluebookRenewal({
      vehicleNumber,
      ownerName,
      email,
      insuranceUrl: insuranceRes.secure_url,
      insurancePublicId: insuranceRes.public_id,
      insuranceOriginalName: insuranceFile.originalname,
      paymentReceiptUrl: receiptRes.secure_url,
      pollutionDocUrl: pollutionRes.secure_url,
      status: 'pending'
    });

    await doc.save();
    return res.status(201).json({ message: 'Bluebook renewal submitted', id: doc._id });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. SUBMIT LICENSE RENEWAL
 */
const submitLicense = async (req, res, next) => {
  try {
    const { licenseNumber, fullName, email } = req.body;

    if (!licenseNumber || !fullName || !email) {
      return res.status(400).json({ message: 'licenseNumber, fullName, and email are required' });
    }

    const medicalFile = req.files?.medical?.[0];
    const receiptFile = req.files?.receipt?.[0];

    if (!medicalFile || !receiptFile) {
      return res.status(400).json({ message: 'Medical clearance and payment receipt are required' });
    }

    let medicalRes, receiptRes;
    try {
      [medicalRes, receiptRes] = await Promise.all([
        uploadBufferToCloudinary(medicalFile.buffer, 'e-yatayat/medical', 'medical'),
        uploadBufferToCloudinary(receiptFile.buffer, 'e-yatayat/receipts', 'receipt')
      ]);
    } catch (upErr) {
      return res.status(500).json({ message: 'Failed to upload files to Cloudinary' });
    }

    const doc = new LicenseRenewal({
      licenseNumber,
      fullName,
      email,
      medicalUrl: medicalRes.secure_url,
      medicalPublicId: medicalRes.public_id,
      paymentReceiptUrl: receiptRes.secure_url,
      status: 'pending'
    });

    await doc.save();
    return res.status(201).json({ message: 'License renewal submitted', id: doc._id });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. UPDATE STATUS (Admin Logic for Notifications)
 */
const updateBluebookStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body; // status should be 'approved' or 'rejected'
    const doc = await BluebookRenewal.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: `Status updated to ${status}`, doc });
  } catch (err) {
    next(err);
  }
};

const updateLicenseStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;
    const doc = await LicenseRenewal.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: `Status updated to ${status}`, doc });
  } catch (err) {
    next(err);
  }
};

/**
* GET /api/renewals/my-renewals/:email
 * Fetches all renewal applications for a specific user email from separate collections
 */
const getMyRenewals = async (req, res, next) => {
  try {
    const { email } = req.params;

    // Fetch from both collections simultaneously
    const [bluebooks, licenses] = await Promise.all([
      BluebookRenewal.find({ email }).sort({ submittedAt: -1 }),
      LicenseRenewal.find({ email }).sort({ submittedAt: -1 })
    ]);
    res.json({ bluebooks, licenses });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: List All
 */
const listBluebook = async (req, res, next) => {
  try {
    const docs = await BluebookRenewal.find().sort({ submittedAt: -1 }).limit(200);
    return res.json(docs);
  } catch (err) {
    next(err);
  }
};

const listLicense = async (req, res, next) => {
  try {
    const docs = await LicenseRenewal.find().sort({ submittedAt: -1 }).limit(200);
    return res.json(docs);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitBluebook,
  submitLicense,
  updateBluebookStatus,
  updateLicenseStatus,
  getMyRenewals,
  listBluebook,
  listLicense
};