const express = require('express');
const router = express.Router();
const User = require('../models/User');
const License = require('../models/License'); 
const Vehicle = require('../models/Vehicle'); 



/**
 * 1. GET FULL USER WALLET
 * Path: GET /api/user/profile/:id
 * (Note: We use '/profile/:id' because '/api/user' is added in server.js)
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('linkedLicense')   // Grabs full data from 'licenses' collection
      .populate('linkedVehicles'); // Grabs full data from 'vehicles' collection

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

/**
 * 2. SUBMIT VERIFICATION FORM
 * Path: PUT /api/user/submit-verification/:userId
 */
router.put('/submit-verification/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      citizenshipNumber, 
      appliedLicenseNumber, 
      appliedVehicleNumber, 
      appliedEngineNumber, 
      appliedChassisNumber 
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        citizenshipNumber,
        appliedLicenseNumber,
        appliedVehicleNumber,
        appliedEngineNumber,
        appliedChassisNumber,
        verificationStatus: 'Pending'
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Verification request submitted to Admin", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error submitting form", error: err.message });
  }
});



module.exports = router;