// src/routes/renewals.js
const express = require('express');
const router = express.Router();
const { bluebookUpload, licenseUpload } = require('../middleware/upload');
const controller = require('../controllers/renewalController');

// Public endpoints to submit renewals
router.post('/bluebook', (req, res, next) => {
  // run multer, then controller
  bluebookUpload(req, res, function (err) {
    if (err) return next(err);
    controller.submitBluebook(req, res, next);
  });
});

router.post('/license', (req, res, next) => {
  licenseUpload(req, res, function (err) {
    if (err) return next(err);
    controller.submitLicense(req, res, next);
  });
});

// Admin endpoints to list pending renewals (later protect with auth)

module.exports = router;
