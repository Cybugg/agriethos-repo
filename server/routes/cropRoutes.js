const express = require('express');
const { 
  createCrop,
  getCropsByFarmer,
  updateCrop,
  deleteCrop,
  getCrop,
  getPendingCropsByFarmer
} = require('../controllers/cropController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Create new crop with images
router.post('/', upload.array('images', 4), createCrop);

// Get all crops for a farmer
router.get('/farmer/:farmerId', getCropsByFarmer);
router.get('/pending/:farmerId', getPendingCropsByFarmer);

// Get, update, delete specific crop
router.get('/:id', getCrop);
router.put('/:id', upload.array('images', 4), updateCrop);
router.delete('/:id', deleteCrop);

module.exports = router;