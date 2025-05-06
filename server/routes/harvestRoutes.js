const express = require('express');
const {
  createHarvest,
  getHarvestsByFarmer,
  getHarvestsByCrop,
  getHarvest,
  updateHarvest,
  deleteHarvest,
  generateQRCode
} = require('../controllers/harvestController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Create new harvest with images
router.post('/', upload.array('images', 4), createHarvest);

// Get harvests by farmer or crop
router.get('/farmer/:farmerId', getHarvestsByFarmer);
router.get('/crop/:cropId', getHarvestsByCrop);

// Get, update, delete specific harvest
router.get('/:id', getHarvest);
router.put('/:id', upload.array('images', 4), updateHarvest);
router.delete('/:id', deleteHarvest);

// Generate QR code for a harvest
router.post('/:harvestId/qrcode', generateQRCode);

module.exports = router;