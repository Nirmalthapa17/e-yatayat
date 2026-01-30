// src/middleware/upload.js
const multer = require('multer');

const ONE_MB = 1 * 1024 * 1024;

// Use memory storage so we can upload file buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/PNG images and PDF are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: ONE_MB } // per-file limit
});

// fields expected for bluebook and license endpoints
const bluebookUpload = upload.fields([
  { name: 'bluebook', maxCount: 1 },
  { name: 'receipt', maxCount: 1 }
]);

const licenseUpload = upload.fields([
  { name: 'license', maxCount: 1 },
  { name: 'medical', maxCount: 1 },
  { name: 'receipt', maxCount: 1 }
]);

module.exports = { bluebookUpload, licenseUpload, ONE_MB };
