const express = require('express');
const {
  createBatch,
  getBatchesByFarmer,
  getBatch,
  updateBatch,
  addHarvestsToBatch,
  removeHarvestFromBatch
} = require('../controllers/batchController');

const router = express.Router();

// Create new batch
router.post('/', createBatch);

// Get batches
router.get('/farmer/:farmerId', getBatchesByFarmer);
router.get('/:id', getBatch);

// Update batch
router.put('/:id', updateBatch);

// Manage harvests in a batch
router.post('/:id/harvests', addHarvestsToBatch);
router.delete('/:id/harvests/:harvestId', removeHarvestFromBatch);

module.exports = router;