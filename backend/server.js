require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <-- ADD THIS
const renewalsRoutes = require('./routes/renewals');
const User = require('./models/User'); 
const app = express();
const nodemailer = require('nodemailer'); // <--- ADD THIS for mail verification
const crypto = require('crypto');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// Configure the Email Sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// --- DIRECT SIGNUP 
app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  // Create a unique token for the verification link
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // --- SIMPLE BACKEND CHECK ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Security violation: Password does not meet strength requirements." 
        });
    }

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      fullName,
      email,
      password, // In a real app, hash this with bcrypt!
      verified: false, // User starts as unverified
      verificationToken
    });

    await newUser.save();
    // 3. Send the Verification Email
    const url = `http://172.18.123.69:5000/verify/${verificationToken}`;
    
    await transporter.sendMail({
      to: email,
      subject: 'Verify your e-Yatayat Account',
      html: `<h3>Welcome to e-Yatayat, ${fullName}!</h3>
             <p>Please click the link below to verify your email:</p>
             <a href="${url}">${url}</a>`
    });


    res.status(201).json({ message: "Signup successful! Check your email to verify account." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// 4. The Verification Route (When they click the link)
app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) return res.status(400).send("Invalid or expired token.");

  user.isVerified = true;
  user.verificationToken = undefined; // Clear token after use
  await user.save();

  res.send("<h1>Email Verified!</h1><p>You can now close this and login.</p>");
});

// --- DIRECT LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. NEW: Check if the user has verified their email
    // This blocks unverified users from entering the dashboard
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Your account is not verified. Please check your Gmail for the verification link.' 
      });
    }

    res.status(200).json({ 
      message: 'Login successful',
      user: { id: user._id, fullName: user.fullName } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});


// 3. Renewal Routes (The New Part from your friend)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// routes
app.use('/api/renewals', renewalsRoutes);


app.use('/api/user', require('./routes/userRoutes'));

// 3. Test Route
app.get('/', (req, res) => {
  res.send("Backend is running!");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});