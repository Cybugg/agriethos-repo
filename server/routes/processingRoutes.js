const express = require('express');
const {
  createProcessingEvent,
  getAllProcessingEvents,
  getProcessingEventsByHarvest,
  getProcessingEventsByBatch,
  getProcessingEvent,
  updateProcessingEvent,
  updateVerificationStatus
} = require('../controllers/processingController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Create new processing event with images
router.post('/', upload.array('images', 4), createProcessingEvent);

// Get processing events
router.get('/', getAllProcessingEvents);
router.get('/harvest/:harvestId', getProcessingEventsByHarvest);
router.get('/batch/:batchId', getProcessingEventsByBatch);
router.get('/:id', getProcessingEvent);

// Update processing event
router.put('/:id', upload.array('images', 4), updateProcessingEvent);

// Update verification status
router.patch('/:id/verification', updateVerificationStatus);

module.exports = router;