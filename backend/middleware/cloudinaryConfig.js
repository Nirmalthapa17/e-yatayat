const cloudinary = require('cloudinary');
const CloudinaryStorage  = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Configure Cloudinary with your Credentials
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eYatayat_Verification', // Folder name in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Compresses large images
    },
});

const upload = multer({ storage: storage });

module.exports = upload;