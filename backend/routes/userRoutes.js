const express = require('express');
const router = express.Router();
const User = require('../models/User');
const License = require('../models/License'); 
const Vehicle = require('../models/Vehicle'); 
const crypto = require('crypto');
const upload = require('../middleware/cloudinaryConfig');

/**
 * 1. GET FULL USER WALLET
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('linkedLicense')
      .populate('linkedVehicles');

    if (!user) return res.status(404).json({ message: "User not found" });

    const displayName = user.linkedLicense ? user.linkedLicense.fullName : (user.appliedName || user.fullName);
    
    res.json({
      ...user._doc, 
      fullName: displayName,
      licenseNumber: user.linkedLicense ? user.linkedLicense.licenseNumber : user.appliedLicenseNumber,
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

/**
 * 2. SUBMIT VERIFICATION FORM (Improved for Multiple Vehicles)
 */
router.put('/submit-verification/:userId', upload.fields([
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'licenseFront', maxCount: 1 },
    { name: 'bluebookPage2', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, citizenshipNumber, licenseNumber, vehicleNumber, engineNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Helper to get Cloudinary paths
    const getPath = (fieldname) => req.files[fieldname] ? req.files[fieldname][0].path : null;

    // Logic: If user is already Approved, we don't want to set their whole account to 'Pending'
    // We only set it to 'Pending' if it's their very first time (status 'None' or 'Rejected')
    if (user.verificationStatus === 'None' || user.verificationStatus === 'Rejected') {
        user.verificationStatus = 'Pending';
    }

    // 1. Always update personal info if provided (First time setup)
    if (fullName) user.appliedName = fullName;
    if (citizenshipNumber) user.citizenshipNumber = citizenshipNumber;
    if (req.files['citizenshipFront']) user.citizenshipImageUrl = getPath('citizenshipFront');
    if (req.files['profilePhoto']) user.appliedProfilePhotoUrl = getPath('profilePhoto');

    // 2. Handle License (Only if not already linked)
    if (licenseNumber && !user.linkedLicense) {
        user.appliedLicenseNumber = licenseNumber;
        if (req.files['licenseFront']) user.licenseImageUrl = getPath('licenseFront');
    }

    // 3. Handle Vehicle (Add to the pending list)
    if (vehicleNumber) {
        const newPendingVehicle = {
            vehicleNumber: vehicleNumber,
            engineNumber: engineNumber,
            bluebookImageUrl: getPath('bluebookPage2'),
            status: 'Pending'
        };
        
        // Push to the array instead of overwriting a single string
        // Note: Ensure your User Schema has 'appliedVehicles' as an array
        user.appliedVehicles.push(newPendingVehicle);
    }

    await user.save();

    res.status(200).json({ 
        message: "Verification request submitted successfully", 
        user 
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error submitting form", error: err.message });
  }
});

/**
 * 3. PUBLIC VERIFICATION (QR LINK)
 */
router.get('/verify-all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('linkedLicense').populate('linkedVehicles');

    if (!user) return res.status(404).json({ message: "Citizen record not found" });

    const officialName = user.linkedLicense ? user.linkedLicense.fullName : user.fullName;
    const taxStatus = user.linkedVehicles?.[0]?.taxExpiryDate || "NoVehicle";
    const secretKey = "EYATAYAT-SECRET-SALT"; 
    
    const hashInput = `${user._id}-${user.verificationStatus}-${taxStatus}-${secretKey}`;
    const dynamicHash = crypto.createHash('sha256').update(hashInput).digest('hex').substring(0, 32).toUpperCase();

    res.json({
      fullName: officialName,
      status: user.verificationStatus,
      license: user.linkedLicense,
      vehicles: user.linkedVehicles,
      securityHash: dynamicHash 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;