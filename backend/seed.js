require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const License = require('./models/License');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Vehicle.deleteMany({});
        await License.deleteMany({});

        // --- VEHICLE DATA (11 Records) ---
        const vehicles = [
            {
                vehicleNumber: "BAGMATI-125-PA-5566", ownerName: "Nirmal Thapa", category: "Private",
                engineNumber: "ENG-B-998877", chassisNumber: "CHAS-B-112233",
                model: "Pulsar 220F", make: "Bajaj", manufactureYear: 2021,
                vehicleType: "Bike", cc: 220, fuelType: "Petrol", color: "Black",
                registrationDate: new Date("2021-06-20"), taxExpiryDate: new Date("2025-06-20"),
                issuingOffice: "Gurjudhara, Kathmandu", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b1.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v1.jpg"
            },
            {
                vehicleNumber: "BA-2-CHA-1020", ownerName: "Sita Sharma", category: "Private",
                engineNumber: "ENG-C-112233", chassisNumber: "CHAS-C-998877",
                model: "Swift VXI", make: "Suzuki", manufactureYear: 2022,
                vehicleType: "Car", cc: 1200, fuelType: "Petrol", color: "White",
                registrationDate: new Date("2022-01-15"), taxExpiryDate: new Date("2026-01-15"),
                issuingOffice: "Ekantakuna, Lalitpur", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b2.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v2.jpg"
            },
            {
                vehicleNumber: "PRO-3-02-001-BA-4455", ownerName: "Ram Bahadur Thapa", category: "Private",
                engineNumber: "ENG-BUS-5566", chassisNumber: "CHAS-BUS-7788",
                model: "LP 1512", make: "Tata", manufactureYear: 2019,
                vehicleType: "Bus", cc: 5000, fuelType: "Diesel", color: "Blue",
                registrationDate: new Date("2019-11-10"), taxExpiryDate: new Date("2023-11-10"),
                issuingOffice: "Sano Bharyang, Kathmandu", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b3.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v3.jpg"
            },
            {
                vehicleNumber: "BA-1-PA-9988", ownerName: "Binod Chaudhary", category: "Public",
                engineNumber: "ENG-EV-001", chassisNumber: "CHAS-EV-001",
                model: "450X", make: "Ather", manufactureYear: 2023,
                vehicleType: "Scooter", cc: 0, fuelType: "Electric", color: "Grey",
                registrationDate: new Date("2023-05-20"), taxExpiryDate: new Date("2027-05-20"),
                issuingOffice: "Gurjudhara, Kathmandu", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b4.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v4.jpg"
            },
            {
                vehicleNumber: "LU-2-CHA-5060", ownerName: "Sunita Rai", category: "Private",
                engineNumber: "ENG-SUV-4433", chassisNumber: "CHAS-SUV-2211",
                model: "Scorpio S11", make: "Mahindra", manufactureYear: 2020,
                vehicleType: "Car", cc: 2200, fuelType: "Diesel", color: "Silver",
                registrationDate: new Date("2020-03-12"), taxExpiryDate: new Date("2025-03-12"),
                issuingOffice: "Butwal, Rupandehi", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b5.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v5.jpg"
            },
            {
                vehicleNumber: "BA-3-PA-1234", ownerName: "Deepak Raj", category: "Private",
                engineNumber: "ENG-BK-7722", chassisNumber: "CHAS-BK-8833",
                model: "Classic 350", make: "Royal Enfield", manufactureYear: 2018,
                vehicleType: "Bike", cc: 350, fuelType: "Petrol", color: "Black",
                registrationDate: new Date("2018-08-05"), taxExpiryDate: new Date("2024-08-05"),
                issuingOffice: "Ekantakuna, Lalitpur", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b6.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v6.jpg"
            },
            {
                vehicleNumber: "BA-01-KHA-9876", ownerName: "Madan Krishna", category: "Private",
                engineNumber: "ENG-TR-111", chassisNumber: "CHAS-TR-222",
                model: "Signa 2823", make: "Tata", manufactureYear: 2021,
                vehicleType: "Truck", cc: 5600, fuelType: "Diesel", color: "Yellow",
                registrationDate: new Date("2021-04-10"), taxExpiryDate: new Date("2026-04-10"),
                issuingOffice: "Hetauda, Makwanpur", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b7.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v7.jpg"
            },
            {
                vehicleNumber: "BA-12-PA-1122", ownerName: "Nabin K Bhatta", category: "Private",
                engineNumber: "ENG-S-0099", chassisNumber: "CHAS-S-0088",
                model: "Ntorq 125", make: "TVS", manufactureYear: 2022,
                vehicleType: "Scooter", cc: 125, fuelType: "Petrol", color: "Red",
                registrationDate: new Date("2022-09-30"), taxExpiryDate: new Date("2026-09-30"),
                issuingOffice: "Gurjudhara, Kathmandu", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b8.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v8.jpg"
            },
            {
                vehicleNumber: "KO-1-PA-3344", ownerName: "Sushila Karki",category: "Private",
                engineNumber: "ENG-B-5544", chassisNumber: "CHAS-B-3322",
                model: "Splendor Plus", make: "Hero", manufactureYear: 2017,
                vehicleType: "Bike", cc: 100, fuelType: "Petrol", color: "Blue",
                registrationDate: new Date("2017-02-20"), taxExpiryDate: new Date("2025-02-20"),
                issuingOffice: "Itahari, Sunsari", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b9.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v9.jpg"
            },
            {
                vehicleNumber: "PRO-03-01-CHA-1199", ownerName: "Ganesh Thapa", category: "Private",
                engineNumber: "ENG-C-776655", chassisNumber: "CHAS-C-443322",
                model: "Creta SX", make: "Hyundai", manufactureYear: 2023,
                vehicleType: "Car", cc: 1500, fuelType: "Petrol", color: "Black",
                registrationDate: new Date("2023-11-12"), taxExpiryDate: new Date("2027-11-12"),
                issuingOffice: "Ekantakuna, Lalitpur", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b10.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v10.jpg"
            },
            {
                vehicleNumber: "BA-2-PA-8899", ownerName: "Rahul Verma", category: "Private",
                engineNumber: "ENG-EV-009", chassisNumber: "CHAS-EV-009",
                model: "Nexon EV", make: "Tata", manufactureYear: 2022,
                vehicleType: "Car", cc: 0, fuelType: "Electric", color: "Teal",
                registrationDate: new Date("2022-07-25"), taxExpiryDate: new Date("2026-07-25"),
                issuingOffice: "Ekantakuna, Lalitpur", isVerifiedByAdmin: true,
                bluebookPhoto: "https://res.cloudinary.com/demo/image/upload/v1/bluebooks/b11.jpg",
                vehiclePhoto: "https://res.cloudinary.com/demo/image/upload/v1/vehicles/v11.jpg"
            }
        ];

        // --- LICENSE DATA (11 Records) ---
        const licenses = [
  {
    licenseNumber: "01-06-12345678",
    fullName: "Nirmal Thapa",
    dateOfBirth: new Date("2000-05-15"),
    bloodGroup: "O+",
    gender: "Male",
    fatherName: "Nabaraj Thapa",
    citizenshipNumber: "27-01-72-99999",
    issuedDistrict: "Kathmandu",
    categories: ["A", "B"],
    issuedDate: new Date("2020-01-10"),
    expiryDate: new Date("2030-01-10"),
    issuingOffice: "Gurjudhara, Kathmandu",
    status: "Active",
    permanentAddress: "Koteshwor, Kathmandu",
    contactNumber: "9841000000",
    licensePhoto: "https://res.cloudinary.com/dsb36cwhp/image/upload/v1768236897/Smart-license-Card-2_s5bjxn.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_01.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_01.jpg"
  },
  {
    licenseNumber: "02-10-88776655",
    fullName: "Sita Sharma",
    dateOfBirth: new Date("1995-12-20"),
    bloodGroup: "A+",
    gender: "Female",
    fatherName: "Ram Chandra Sharma",
    citizenshipNumber: "21-02-70-11223",
    issuedDistrict: "Lalitpur",
    categories: ["B", "K"],
    issuedDate: new Date("2018-05-15"),
    expiryDate: new Date("2028-05-15"),
    issuingOffice: "Ekantakuna, Lalitpur",
    status: "Active",
    permanentAddress: "Jhamsikhel, Lalitpur",
    contactNumber: "9851011223",
    licensePhoto: "https://res.cloudinary.com/dsb36cwhp/image/upload/v1768236890/nepal-new-driving-license_lcoaen.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_02.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_02.jpg"
  },
  {
    licenseNumber: "05-01-00998877",
    fullName: "Ram Bahadur Thapa",
    dateOfBirth: new Date("1980-02-25"),
    bloodGroup: "B-",
    gender: "Male",
    fatherName: "Krishna Bahadur Thapa",
    citizenshipNumber: "15-05-65-00123",
    issuedDistrict: "Kaski",
    categories: ["C", "D"],
    issuedDate: new Date("2010-03-20"),
    expiryDate: new Date("2025-03-20"),
    issuingOffice: "Pokhara, Kaski",
    status: "Active",
    permanentAddress: "Lakeside, Pokhara",
    contactNumber: "9801234567",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_03.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_03.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_03.jpg"
  },
  {
    licenseNumber: "08-12-44556677",
    fullName: "Binod Chaudhary",
    dateOfBirth: new Date("1990-07-30"),
    bloodGroup: "AB+",
    gender: "Male",
    fatherName: "Laxman Chaudhary",
    citizenshipNumber: "10-10-80-55667",
    issuedDistrict: "Chitwan",
    categories: ["A", "K"],
    issuedDate: new Date("2021-09-12"),
    expiryDate: new Date("2031-09-12"),
    issuingOffice: "Bharatpur, Chitwan",
    status: "Active",
    permanentAddress: "Narayanghat, Chitwan",
    contactNumber: "9811223344",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_04.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_04.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_04.jpg"
  },
  {
    licenseNumber: "03-04-11223344",
    fullName: "Sunita Rai",
    dateOfBirth: new Date("1998-11-05"),
    bloodGroup: "O-",
    gender: "Female",
    fatherName: "Harka Bahadur Rai",
    citizenshipNumber: "05-03-75-88990",
    issuedDistrict: "Morang",
    categories: ["K", "B"],
    issuedDate: new Date("2022-02-10"),
    expiryDate: new Date("2032-02-10"),
    issuingOffice: "Biratnagar, Morang",
    status: "Active",
    permanentAddress: "Mahendra Chowk, Biratnagar",
    contactNumber: "9842111222",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_05.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_05.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_05.jpg"
  },
  {
    licenseNumber: "01-01-11112222",
    fullName: "Deepak Raj",
    dateOfBirth: new Date("1985-04-10"),
    bloodGroup: "A+",
    gender: "Male",
    fatherName: "Madan Raj Giri",
    citizenshipNumber: "25-01-62-11111",
    issuedDistrict: "Kathmandu",
    categories: ["A"],
    issuedDate: new Date("2015-06-05"),
    expiryDate: new Date("2025-06-05"),
    issuingOffice: "Ekantakuna, Lalitpur",
    status: "Expired",
    permanentAddress: "Baneshwor, Kathmandu",
    contactNumber: "9851099887",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_06.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_06.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_06.jpg"
  },
  {
    licenseNumber: "06-02-99990000",
    fullName: "Madan Krishna",
    dateOfBirth: new Date("1975-01-01"),
    bloodGroup: "O+",
    gender: "Male",
    fatherName: "Shiva Krishna Shrestha",
    citizenshipNumber: "22-01-50-00001",
    issuedDistrict: "Makwanpur",
    categories: ["C", "D"],
    issuedDate: new Date("2005-01-01"),
    expiryDate: new Date("2025-01-01"),
    issuingOffice: "Hetauda, Makwanpur",
    status: "Active",
    permanentAddress: "Hetauda-4, Makwanpur",
    contactNumber: "9801112233",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_07.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_07.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_07.jpg"
  },
  {
    licenseNumber: "01-05-44332211",
    fullName: "Nabin K Bhatta",
    dateOfBirth: new Date("1992-03-14"),
    bloodGroup: "B+",
    gender: "Male",
    fatherName: "Ganesh K Bhatta",
    citizenshipNumber: "27-01-70-22334",
    issuedDistrict: "Kathmandu",
    categories: ["A", "B", "K"],
    issuedDate: new Date("2014-05-20"),
    expiryDate: new Date("2024-05-20"),
    issuingOffice: "Gurjudhara, Kathmandu",
    status: "Expired",
    permanentAddress: "Kalanki, Kathmandu",
    contactNumber: "9841334455",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_08.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_08.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_08.jpg"
  },
  {
    licenseNumber: "10-02-77665544",
    fullName: "Sushila Karki",
    dateOfBirth: new Date("1988-10-22"),
    bloodGroup: "AB-",
    gender: "Female",
    fatherName: "Man Bahadur Karki",
    citizenshipNumber: "06-02-65-88776",
    issuedDistrict: "Sunsari",
    categories: ["K"],
    issuedDate: new Date("2017-02-10"),
    expiryDate: new Date("2027-02-10"),
    issuingOffice: "Itahari, Sunsari",
    status: "Active",
    permanentAddress: "Dharan, Sunsari",
    contactNumber: "9808877665",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_09.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_09.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_09.jpg"
  },
  {
    licenseNumber: "01-09-55667788",
    fullName: "Ganesh Thapa",
    dateOfBirth: new Date("1994-06-05"),
    bloodGroup: "O+",
    gender: "Male",
    fatherName: "Dil Bahadur Thapa",
    citizenshipNumber: "30-01-71-11223",
    issuedDistrict: "Kathmandu",
    categories: ["B"],
    issuedDate: new Date("2020-11-12"),
    expiryDate: new Date("2030-11-12"),
    issuingOffice: "Ekantakuna, Lalitpur",
    status: "Active",
    permanentAddress: "Lazimpat, Kathmandu",
    contactNumber: "9851055443",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_10.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_10.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_10.jpg"
  },
  {
    licenseNumber: "01-12-00001111",
    fullName: "Rahul Verma",
    dateOfBirth: new Date("1997-02-28"),
    bloodGroup: "A-",
    gender: "Male",
    fatherName: "Sanjay Verma",
    citizenshipNumber: "27-01-74-00112",
    issuedDistrict: "Lalitpur",
    categories: ["A", "B"],
    issuedDate: new Date("2019-07-25"),
    expiryDate: new Date("2029-07-25"),
    issuingOffice: "Ekantakuna, Lalitpur",
    status: "Active",
    permanentAddress: "Patan, Lalitpur",
    contactNumber: "9860112233",
    licensePhoto: "https://res.cloudinary.com/demo/image/upload/v1/licenses/lic_11.jpg",
    citizenshipPhoto: "https://res.cloudinary.com/demo/image/upload/v1/citizenship/cit_11.jpg",
    profilePhoto: "https://res.cloudinary.com/demo/image/upload/v1/profiles/user_11.jpg"
  }
];

        await Vehicle.insertMany(vehicles);
        await License.insertMany(licenses, { strict: false });

        console.log("🚀 SUCCESS: Database Seeded with Photo Fields!");
        process.exit();
    } catch (err) {
        console.error("❌ ERROR:", err);
        process.exit(1);
    }
};

seedDatabase();