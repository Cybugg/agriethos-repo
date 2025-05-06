const ProcessingEvent = require('../models/ProcessingEvent');
const HarvestRecord = require('../models/HarvestRecord');
const Batch = require('../models/Batch');

// Create a new processing event
exports.createProcessingEvent = async (req, res) => {
  try {
    const {
      harvestId,
      batchId,
      processingType,
      processingDate,
      location,
      processorInfo,
      qualityChecks,
      notes
    } = req.body;

    // Validate required fields
    if (!harvestId || !processingType || !processingDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Check if harvest record exists
    const harvest = await HarvestRecord.findById(harvestId);
    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest record not found'
      });
    }

    // If batch is specified, check if it exists
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({
          success: false,
          message: 'Batch not found'
        });
      }
    }

    // Process uploaded images if any
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create new processing event
    const newProcessingEvent = new ProcessingEvent({
      harvestId,
      batchId,
      processingType,
      processingDate,
      location,
      processorInfo,
      qualityChecks,
      notes,
      images
    });

    await newProcessingEvent.save();

    // Update the batch status if a batch is associated
    if (batchId) {
      await Batch.findByIdAndUpdate(batchId, {
        status: 'processing',
        updatedAt: Date.now(),
        $push: {
          history: {
            action: `Processing event: ${processingType}`,
            notes: notes || 'Processing started',
            performedBy: processorInfo?.name || 'Unknown processor'
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Processing event created successfully',
      data: newProcessingEvent
    });
  } catch (error) {
    console.error('Error creating processing event:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all processing events
exports.getAllProcessingEvents = async (req, res) => {
  try {
    const events = await ProcessingEvent.find()
      .sort({ processingDate: -1 })
      .populate('harvestId', 'harvestDate quantity')
      .populate('batchId', 'batchNumber');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching processing events:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get processing events by harvest ID
exports.getProcessingEventsByHarvest = async (req, res) => {
  try {
    const { harvestId } = req.params;
    
    const events = await ProcessingEvent.find({ harvestId })
      .sort({ processingDate: -1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching processing events by harvest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get processing events by batch ID
exports.getProcessingEventsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const events = await ProcessingEvent.find({ batchId })
      .sort({ processingDate: -1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching processing events by batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single processing event
exports.getProcessingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await ProcessingEvent.findById(id)
      .populate('harvestId')
      .populate('batchId');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Processing event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching processing event:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a processing event
exports.updateProcessingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If there are new images to add
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // Update the timestamp
    updateData.updatedAt = Date.now();
    
    const updatedEvent = await ProcessingEvent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Processing event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating processing event:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update verification status of a processing event
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus, verificationNotes } = req.body;
    
    if (!['pending', 'in-progress', 'verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }
    
    const updatedEvent = await ProcessingEvent.findByIdAndUpdate(
      id,
      {
        verificationStatus,
        'qualityChecks.notes': verificationNotes || 'Status updated',
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Processing event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};