const multer = require('multer');

const FIVE_MB = 5 * 1024 * 1024;

// Use memory storage for Cloudinary buffer uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FIVE_MB } 
});

/**
 * Matches BluebookRenewForm: 
 * fd.append("insuranceDoc", ...), fd.append("receipt", ...), fd.append("pollutionDoc", ...)
 */
const bluebookUpload = upload.fields([
  { name: 'insuranceDoc', maxCount: 1 }, // Changed from 'bluebook' to 'insuranceDoc'
  { name: 'receipt', maxCount: 1 },
  { name: 'pollutionDoc', maxCount: 1 }
]);

/**
 * Matches LicenseRenewForm:
 * fd.append("medical", ...), fd.append("receipt", ...)
 */
const licenseUpload = upload.fields([
  { name: 'medical', maxCount: 1 },
  { name: 'receipt', maxCount: 1 },
  // Optional: keep 'license' here but don't require it in frontend
  { name: 'license', maxCount: 1 } 
]);

module.exports = { bluebookUpload, licenseUpload, FIVE_MB };