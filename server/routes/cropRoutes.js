const express = require('express');
const { 
  createCrop,
  getCropsByFarmer,
  updateCrop,
  deleteCrop,
  getCrop,
  getAllPendingCrops,
  getAllReviewedCrops, // Add this
  upgradeCrop,
  getAllVerifiedCrops,
  getReviewedCropsByReviewer
} = require('../controllers/cropController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Create new crop with images
router.post('/', upload.array('images', 4), createCrop);

// Get all crops for a farmer
router.get('/farmer/:farmerId', getCropsByFarmer);
router.get('/pending', getAllPendingCrops);
router.get('/reviewed', getAllReviewedCrops);
router.get('/verified', getAllVerifiedCrops); // New route for reviewed crops

// Get, update, delete specific crop
router.get('/:id', getCrop);
router.put('/:id', upload.array('images', 4), updateCrop);
router.put('/upgrade/:id', upload.array('images', 4), upgradeCrop);
router.delete('/:id', deleteCrop);

// Get crops reviewed by a specific reviewer
router.get('/reviewed/:reviewerId', getReviewedCropsByReviewer);

module.exports = router;