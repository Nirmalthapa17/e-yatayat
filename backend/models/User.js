const mongoose = require('mongoose');

/*const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  role: { type: String, default: 'citizen' },

  // --- FIELDS FOR THE USER FORM (Submission Phase) ---
  // We keep these so the Admin knows what the user IS CLAIMING to own
  appliedVehicleNumber: { type: String, default: "" },
  appliedCitizenshipNumber: { type: String, default: "" },
  citizenshipPath: { type: String, default: "" }, 
  
  // --- STATUS CONTROL ---
  isVerified: { type: Boolean, default: false },

  // --- LINKED DATA (The "Digital Wallet" Connections) ---
  // This stores the ID of the document from the License collection
  linkedLicense: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'License', 
    default: null 
  },
  
  // This stores an array of IDs from the Vehicle collection (User can own multiple bikes/cars)
  linkedVehicles: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle' 
  }],

  registrationDate: { type: Date, default: Date.now }
  
});*/
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  verified: { type: Boolean, default: false },

  verificationCode: { type: String },
  codeExpires: { type: Date }  
});
 


module.exports = mongoose.model('User', UserSchema);