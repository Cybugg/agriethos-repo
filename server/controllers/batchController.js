const Batch = require('../models/Batch');
const HarvestRecord = require('../models/HarvestRecord');

// Generate a unique batch number
const generateBatchNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const prefix = `B${year}${month}${day}`;
  
  // Find the latest batch with this prefix
  const latestBatch = await Batch.findOne({ 
    batchNumber: new RegExp(`^${prefix}`) 
  }).sort({ batchNumber: -1 });
  
  let counter = 1;
  if (latestBatch) {
    const latestCounter = parseInt(latestBatch.batchNumber.slice(-3));
    counter = latestCounter + 1;
  }
  
  return `${prefix}-${counter.toString().padStart(3, '0')}`;
};

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const {
      farmerId,
      harvests,
      cropType,
      totalQuantity,
      destination,
      notes
    } = req.body;

    // Validate required fields
    if (!farmerId || !cropType || !totalQuantity || !harvests || !harvests.length) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Check if all harvests exist and belong to the farmer
    const harvestRecords = await HarvestRecord.find({
      _id: { $in: harvests },
      farmerId
    });

    if (harvestRecords.length !== harvests.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more harvest records not found or do not belong to this farmer'
      });
    }

    // Generate a batch number
    const batchNumber = await generateBatchNumber();

    // Create new batch
    const newBatch = new Batch({
      batchNumber,
      farmerId,
      harvests,
      cropType,
      totalQuantity,
      destination,
      history: [{
        action: 'Batch created',
        notes: notes || 'Initial batch creation'
      }]
    });

    await newBatch.save();

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: newBatch
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all batches for a farmer
exports.getBatchesByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const batches = await Batch.find({ farmerId })
      .sort({ createdAt: -1 })
      .populate('harvests', 'harvestDate quantity');
    
    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single batch by ID
exports.getBatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const batch = await Batch.findById(id)
      .populate('harvests')
      .populate('farmerId', 'walletAddress');
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Update the timestamp and add to history
    updateData.updatedAt = Date.now();
    
    // Add to history if action is provided
    if (updateData.action) {
      updateData.$push = {
        history: {
          action: updateData.action,
          notes: updateData.actionNotes || 'Batch updated'
        }
      };
      // Remove action and actionNotes from updateData
      delete updateData.action;
      delete updateData.actionNotes;
    }
    
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBatch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedBatch
    });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Add harvests to a batch
exports.addHarvestsToBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { harvests, updateQuantity } = req.body;
    
    if (!harvests || !harvests.length) {
      return res.status(400).json({
        success: false,
        message: 'No harvests specified'
      });
    }
    
    // Check if batch exists
    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Check if harvests exist and belong to the farmer
    const harvestRecords = await HarvestRecord.find({
      _id: { $in: harvests },
      farmerId: batch.farmerId
    });
    
    if (harvestRecords.length !== harvests.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more harvest records not found or do not belong to this farmer'
      });
    }
    
    // Add harvests to batch
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      {
        $addToSet: { harvests: { $each: harvests } },
        updatedAt: Date.now(),
        $push: {
          history: {
            action: 'Harvests added',
            notes: `${harvests.length} harvests added to batch`
          }
        }
      },
      { new: true }
    );
    
    // Update total quantity if requested
    if (updateQuantity) {
      // Calculate new quantity based on all harvests in the batch
      const allHarvests = await HarvestRecord.find({
        _id: { $in: updatedBatch.harvests }
      });
      
      const totalValue = allHarvests.reduce((sum, harvest) => {
        return sum + harvest.quantity.value;
      }, 0);
      
      // Use the unit from the first harvest if they're the same
      const unit = allHarvests[0].quantity.unit;
      
      await Batch.findByIdAndUpdate(
        id,
        {
          'totalQuantity.value': totalValue,
          'totalQuantity.unit': unit
        }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Harvests added to batch successfully',
      data: updatedBatch
    });
  } catch (error) {
    console.error('Error adding harvests to batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Remove a harvest from a batch
exports.removeHarvestFromBatch = async (req, res) => {
  try {
    const { id, harvestId } = req.params;
    
    // Check if batch exists
    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Check if harvest is in the batch
    if (!batch.harvests.includes(harvestId)) {
      return res.status(400).json({
        success: false,
        message: 'Harvest not found in this batch'
      });
    }
    
    // Remove harvest from batch
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      {
        $pull: { harvests: harvestId },
        updatedAt: Date.now(),
        $push: {
          history: {
            action: 'Harvest removed',
            notes: `Harvest ${harvestId} removed from batch`
          }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Harvest removed from batch successfully',
      data: updatedBatch
    });
  } catch (error) {
    console.error('Error removing harvest from batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};