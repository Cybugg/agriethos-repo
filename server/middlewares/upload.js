const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');




// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'farm_properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Resize
        { quality: "auto" }, // Smart compress
        { fetch_format: "auto" }, // Auto format (webp if supported)
      ],
    },
  });

const upload = multer({ storage });

module.exports = upload;
