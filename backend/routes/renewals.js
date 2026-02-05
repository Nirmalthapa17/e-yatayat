const express = require('express');
const router = express.Router();
const { bluebookUpload, licenseUpload } = require('../middleware/upload');
const controller = require('../controllers/renewalController');

/**
 * 1. BLUEBOOK RENEWAL
 * Fields expected: insuranceDoc, receipt, pollutionDoc
 */
router.post('/bluebook', bluebookUpload, (req, res, next) => {
    // Multer adds files to req.files and text fields to req.body
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No documents uploaded" });
    }
    controller.submitBluebook(req, res, next);
});

/**
 * 2. LICENSE RENEWAL
 * Fields expected: medical, receipt
 */
router.post('/license', licenseUpload, (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Required documents (Medical/Receipt) are missing" });
    }
    controller.submitLicense(req, res, next);
});

module.exports = router;