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
  getAllVerifiedCrops
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
router.get('/reviewed/:reviewerId', async (req, res) => {
  try {
    const { reviewerId } = req.params;
    
    // Find crops reviewed by this specific reviewer
    const crops = await Crop.find({
      reviewedBy: reviewerId,
      verificationStatus: { $in: ['verified', 'rejected', 'toUpgrade'] }
    })
    .populate('farmerId')
    .populate('farmPropertyId')
    .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    console.error('Error fetching reviewed crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;