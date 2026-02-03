const express = require('express');
const router = express.Router();
const User = require('../models/User');
const License = require('../models/License'); 
const Vehicle = require('../models/Vehicle'); 
const crypto = require('crypto');
const upload = require('../middleware/cloudinaryConfig');


/**
 * 1. GET FULL USER WALLET
 * Path: GET /api/user/profile/:id
 * (Note: We use '/profile/:id' because '/api/user' is added in server.js)
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('linkedLicense')
      .populate('linkedVehicles');

    if (!user) return res.status(404).json({ message: "User not found" });

    // logic: Use License Name if available, otherwise Signup Name
    const displayName = user.linkedLicense ? user.linkedLicense.fullName : user.fullName;
    

    
    // We send a spread of the user data but overwrite the fullName for the UI
    res.json({
      ...user._doc, 
      fullName: displayName 
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

/**
 * 2. SUBMIT VERIFICATION FORM (With Cloudinary Images)
 * Path: PUT /api/user/submit-verification/:userId
 */
router.put('/submit-verification/:userId', upload.fields([
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'licenseFront', maxCount: 1 },
    { name: 'bluebookPage2', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Extract text data from req.body
    const { 
      fullName,
      citizenshipNumber, 
      licenseNumber, 
      vehicleNumber, 
      engineNumber 
    } = req.body;

    // Extract Cloudinary URLs from req.files
    const citizenshipImageUrl = req.files['citizenshipFront'] ? req.files['citizenshipFront'][0].path : null;
    const licenseImageUrl = req.files['licenseFront'] ? req.files['licenseFront'][0].path : null;
    const bluebookImageUrl = req.files['bluebookPage2'] ? req.files['bluebookPage2'][0].path : null;
    const profilePhotoUrl = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;

    // Build update object
    const updateData = {
      appliedName: fullName,
      citizenshipNumber: citizenshipNumber,
      citizenshipImageUrl: citizenshipImageUrl,
      appliedProfilePhotoUrl: profilePhotoUrl,
      verificationStatus: 'Pending'
    };

    // If license info was provided, add it to update
    if (licenseNumber) {
        updateData.appliedLicenseNumber = licenseNumber;
        updateData.licenseImageUrl = licenseImageUrl;
    }

    // If vehicle info was provided, add it to update
    if (vehicleNumber) {
        updateData.appliedVehicleNumber = vehicleNumber;
        updateData.appliedEngineNumber = engineNumber;
        updateData.bluebookImageUrl = bluebookImageUrl;;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ 
        message: "Verification request submitted with images to Admin", 
        user: updatedUser 
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error submitting form", error: err.message });
  }
});

/**
 /**
 * 3. VERIFY ALL DATA (Public Verification Link)
 */
const verifyAllData = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('linkedLicense')
      .populate('linkedVehicles');

    if (!user) return res.status(404).json({ message: "Citizen record not found" });

    const officialName = user.linkedLicense ? user.linkedLicense.fullName : user.fullName;

    // --- NEW DYNAMIC HASH LOGIC ---
    // We combine the UserID with their Verification Status and the Tax Expiry 
    // of their first vehicle. If any of these change, the hash changes!
    const taxStatus = user.linkedVehicles?.[0]?.taxExpiryDate || "NoVehicle";
    const secretKey = "EYATAYAT-SECRET-SALT"; // In production, use process.env.HASH_SECRET
    
    const hashInput = `${user._id}-${user.verificationStatus}-${taxStatus}-${secretKey}`;
    const dynamicHash = crypto.createHash('sha256').update(hashInput).digest('hex').substring(0, 32).toUpperCase();

    const verificationData = {
      fullName: officialName,
      license: user.linkedLicense ? {
        licenseNumber: user.linkedLicense.licenseNumber,
        category: user.linkedLicense.categories?.join(", ") || "A, B",
        expiryDate: user.linkedLicense.expiryDate,
        status: user.verificationStatus === "Approved" ? "Active" : "Pending Verification"
      } : null,
      vehicles: user.linkedVehicles ? user.linkedVehicles.map(v => ({
        vehicleNumber: v.vehicleNumber,
        vehicleType: v.vehicleType || "N/A",
        engineNumber: v.engineNumber,
        chassisNumber: v.chassisNumber,
        taxExpiryDate: v.taxExpiryDate,
        insuranceExpiryDate: v.insuranceExpiryDate, // Added insurance as requested earlier
        make: v.make || "N/A",
        model: v.model || "N/A"
      })) : [],
      securityHash: dynamicHash // Using the new dynamic hash
    };

    res.json(verificationData);
  } catch (error) {
    console.error("Verification API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

router.get('/verify-all/:userId', verifyAllData);

module.exports = router;