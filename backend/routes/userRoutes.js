const express = require('express');
const router = express.Router();
const User = require('../models/User');
const License = require('../models/License'); 
const Vehicle = require('../models/Vehicle'); 

/**
 * 1. GET FULL USER WALLET
 * Path: GET /api/user/profile/:id
 */
router.get('/profile/:id', async (req, res) => {
    try {
        // Populates both license and vehicle arrays/objects
        const user = await User.findById(req.params.id)
            .populate('linkedLicense')
            .populate('linkedVehicles');

        if (!user) {
            return res.status(404).json({ msg: "User not found in Database" });
        }
        res.json(user);
    } catch (err) {
        console.error("Profile Fetch Error:", err.message);
        res.status(500).json({ msg: "Server Error: Could not retrieve wallet" });
    }
});

/**
 * 2. SUBMIT VERIFICATION FORM (Handles optional License/Vehicle)
 * Path: PUT /api/user/submit-verification/:id
 */
router.put('/submit-verification/:id', async (req, res) => {
    try {
        const { 
            vehicleNumber, 
            licenseNumber, 
            citizenshipNumber, 
            citizenshipPath 
        } = req.body;
        
        // Update user with whatever data they provided
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { 
                appliedVehicleNumber: vehicleNumber || "", 
                appliedLicenseNumber: licenseNumber || "", 
                appliedCitizenshipNumber: citizenshipNumber, 
                citizenshipPath,
                isVerified: false // Status resets to pending upon new submission
            },
            { new: true }
        );

        res.json({ msg: "Verification request submitted successfully!", updatedUser });
    } catch (err) {
        console.error("Submission Error:", err.message);
        res.status(500).json({ msg: "Server Error: Submission failed" });
    }
});

/**
 * 3. ADMIN APPROVAL (Flexible Linking Logic)
 * Path: PUT /api/user/approve/:id
 */
router.put('/approve/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // A. Link License if the user applied for it
        if (user.appliedLicenseNumber) {
            const officialLicense = await License.findOne({ 
                licenseNumber: user.appliedLicenseNumber 
            });
            if (officialLicense) {
                user.linkedLicense = officialLicense._id;
            }
        }

        // B. Link Vehicle if the user applied for it
        if (user.appliedVehicleNumber) {
            const officialVehicle = await Vehicle.findOne({ 
                vehicleNumber: user.appliedVehicleNumber 
            });
            // Ensure we don't add the same vehicle twice to the array
            if (officialVehicle && !user.linkedVehicles.includes(officialVehicle._id)) {
                user.linkedVehicles.push(officialVehicle._id);
            }
        }

        user.isVerified = true;
        await user.save();

        res.json({ 
            msg: "Verification complete. Documents linked where matches were found!", 
            user 
        });
    } catch (err) {
        console.error("Approval Error:", err.message);
        res.status(500).json({ msg: "Server Error: Approval process failed" });
    }
});

module.exports = router;