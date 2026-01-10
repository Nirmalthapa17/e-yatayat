require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Ensure this path is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 2. API Routes

// --- DIRECT SIGNUP (No OTP) ---
app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

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
      verified: true // Setting to true immediately since OTP is removed
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// --- DIRECT LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ 
      message: 'Login successful',
      user: { id: user._id, fullName: user.fullName } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.use('/api/user', require('./routes/userRoutes'));

// 3. Test Route
app.get('/', (req, res) => {
  res.send("Backend is running!");
});

// 4. CATCH-ALL ERROR ROUTE (Must be at the very bottom)
app.use((req, res) => {
    res.status(404).send(`Route not found: ${req.originalUrl}`);
});
// Get user profile with populated linked data
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'linkedLicense',
        model: 'License' // Ensure this matches your License model name
      })
      .populate({
        path: 'linkedVehicles',
        model: 'Vehicle' // Ensure this matches your Vehicle model name
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the full user object (now containing actual license/vehicle details)
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});