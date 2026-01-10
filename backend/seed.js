require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const License = require('./models/License');

// Check if URI exists
if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in .env file");
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected successfully.");

        // 1. Clear existing master data to avoid "Duplicate Key" errors
        console.log("🧹 Cleaning old records...");
        await Vehicle.deleteMany({});
        await License.deleteMany({});

        // 2. Insert Master Vehicle (The Bluebook Data)
        console.log("📦 Inserting Vehicle data...");
        const masterVehicle = await Vehicle.create({
            vehicleNumber: "BAGMATI-125-PA-5566",
            ownerName: "Aayush Bista",
            engineNumber: "ENG998877",
            chassisNumber: "CHAS112233",
            model: "Pulsar 220F",
            make: "Bajaj",
            manufactureYear: 2021,
            vehicleType: "Bike",
            cc: 220,
            fuelType: "Petrol",
            registrationDate: new Date("2021-06-20"),
            taxExpiryDate: new Date("2025-06-20"), // Valid for testing
            issuingOffice: "Gurjudhara, Kathmandu",
            insuranceCompany: "Sagarmatha Insurance",
            isVerifiedByAdmin: true
        });

        // 3. Insert Master License (The Driver Data)
        console.log("📦 Inserting License data...");
        await License.create({
            licenseNumber: "01-06-12345678",
            fullName: "Aayush Bista",
            dateOfBirth: new Date("2000-05-15"),
            bloodGroup: "O+",
            citizenshipNumber: "27-01-72-99999",
            issuedDistrict: "Kathmandu",
            categories: ["A", "B"],
            issuedDate: new Date("2020-01-10"),
            expiryDate: new Date("2030-01-10"),
            issuingOffice: "Ekantakuna, Lalitpur"
        });

        console.log("🚀 SUCCESS: Master Data Seeded Successfully!");
        console.log("Check your MongoDB Atlas 'vehicles' and 'licenses' collections now.");
        process.exit();
    } catch (err) {
        console.error("❌ SEED ERROR:", err);
        process.exit(1);
    }
};

seedDatabase();