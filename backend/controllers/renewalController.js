// src/controllers/renewalController.js
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

const uploadBufferToCloudinary = (buffer, folder = 'e-yatayat', publicIdPrefix = undefined) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', public_id: publicIdPrefix ? `${publicIdPrefix}_${Date.now()}` : undefined },
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

// POST /api/renewals/bluebook
const submitBluebook = async (req, res, next) => {
  try {
    const { vehicleNumber, ownerName, previousExpiry, email } = req.body;

    if (!vehicleNumber || !ownerName || !previousExpiry || !email) {
      return res.status(400).json({ message: 'vehicleNumber, ownerName, previousExpiry and email are required' });
    }

    // basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const bluebookFile = req.files?.bluebook?.[0];
    const receiptFile = req.files?.receipt?.[0];

    if (!bluebookFile || !receiptFile) {
      return res.status(400).json({ message: 'bluebook image and payment receipt are required (multipart/form-data with files)' });
    }

    if (bluebookFile.size > ONE_MB || receiptFile.size > ONE_MB) {
      return res.status(400).json({ message: 'One or more files exceed 1 MB' });
    }

    let bluebookRes, receiptRes;
    try {
      [bluebookRes, receiptRes] = await Promise.all([
        uploadBufferToCloudinary(bluebookFile.buffer, 'e-yatayat/bluebook', 'bluebook'),
        uploadBufferToCloudinary(receiptFile.buffer, 'e-yatayat/receipts', 'receipt')
      ]);
    } catch (upErr) {
      console.error('Cloudinary upload error (bluebook):', upErr);
      return res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: upErr.message || upErr });
    }

    const doc = new BluebookRenewal({
      vehicleNumber,
      ownerName,
      email,
      previousExpiry: new Date(previousExpiry),
      bluebookUrl: bluebookRes.secure_url,
      bluebookPublicId: bluebookRes.public_id,
      bluebookOriginalName: bluebookFile.originalname,
      paymentReceiptUrl: receiptRes.secure_url,
      paymentReceiptPublicId: receiptRes.public_id,
      paymentReceiptOriginalName: receiptFile.originalname,
      status: 'pending'
    });

    await doc.save();
    console.log('Bluebook renewal saved:', doc._id);
    return res.status(201).json({ message: 'Bluebook renewal submitted', id: doc._id, doc });
  } catch (err) {
    console.error('submitBluebook error:', err);
    next(err);
  }
};

// POST /api/renewals/license
const submitLicense = async (req, res, next) => {
  try {
    const { licenseNumber, fullName, dob, previousExpiry, email } = req.body;

    if (!licenseNumber || !fullName || !dob || !previousExpiry || !email) {
      return res.status(400).json({ message: 'licenseNumber, fullName, dob, previousExpiry and email are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const licenseFile = req.files?.license?.[0];
    const medicalFile = req.files?.medical?.[0];
    const receiptFile = req.files?.receipt?.[0];

    if (!licenseFile || !medicalFile || !receiptFile) {
      return res.status(400).json({ message: 'license image, medical clearance and payment receipt are required (multipart/form-data with files)' });
    }

    if (licenseFile.size > ONE_MB || medicalFile.size > ONE_MB || receiptFile.size > ONE_MB) {
      return res.status(400).json({ message: 'One or more files exceed 1 MB' });
    }

    let licenseRes, medicalRes, receiptRes;
    try {
      [licenseRes, medicalRes, receiptRes] = await Promise.all([
        uploadBufferToCloudinary(licenseFile.buffer, 'e-yatayat/license', 'license'),
        uploadBufferToCloudinary(medicalFile.buffer, 'e-yatayat/medical', 'medical'),
        uploadBufferToCloudinary(receiptFile.buffer, 'e-yatayat/receipts', 'receipt')
      ]);
    } catch (upErr) {
      console.error('Cloudinary upload error (license):', upErr);
      return res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: upErr.message || upErr });
    }

    const doc = new LicenseRenewal({
      licenseNumber,
      fullName,
      email,
      dob: new Date(dob),
      previousExpiry: new Date(previousExpiry),
      licenseUrl: licenseRes.secure_url,
      licensePublicId: licenseRes.public_id,
      licenseOriginalName: licenseFile.originalname,
      medicalUrl: medicalRes.secure_url,
      medicalPublicId: medicalRes.public_id,
      medicalOriginalName: medicalFile.originalname,
      paymentReceiptUrl: receiptRes.secure_url,
      paymentReceiptPublicId: receiptRes.public_id,
      paymentReceiptOriginalName: receiptFile.originalname,
      status: 'pending'
    });

    await doc.save();
    console.log('License renewal saved:', doc._id);
    return res.status(201).json({ message: 'License renewal submitted', id: doc._id, doc });
  } catch (err) {
    console.error('submitLicense error:', err);
    next(err);
  }
};

// Admin listing endpoints unchanged
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
  listBluebook,
  listLicense
};
