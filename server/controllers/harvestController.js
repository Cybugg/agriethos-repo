const HarvestRecord = require('../models/HarvestRecord');
const Crop = require('../models/Crop');
const QRCode = require('qrcode');
const HarvestQRCode = require('../models/HarvestQRCode');

// Create a new harvest record
exports.createHarvest = async (req, res) => {
  try {
    const {
      cropId,
      farmerId,
      harvestDate,
      quantity,
      qualityMetrics,
      location,
      weatherConditions
    } = req.body;

    // Validate required fields
    if (!cropId || !farmerId || !harvestDate || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Check if crop exists and belongs to the farmer
    const crop = await Crop.findOne({
      _id: cropId,
      farmerId: farmerId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or does not belong to this farmer'
      });
    }

    // Process uploaded images if any
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create new harvest record
    const newHarvest = new HarvestRecord({
      cropId,
      farmerId,
      harvestDate,
      quantity,
      qualityMetrics,
      location,
      weatherConditions,
      images
    });

    await newHarvest.save();

    // Update crop's growth stage if it's harvested
    if (crop.growthStage === 'pre-harvest') {
      crop.growthStage = 'post-harvest';
      crop.harvestingDate = harvestDate;
      await crop.save();
    }

    res.status(201).json({
      success: true,
      message: 'Harvest recorded successfully',
      data: newHarvest
    });
  } catch (error) {
    console.error('Error creating harvest record:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all harvests for a farmer
exports.getHarvestsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const harvests = await HarvestRecord.find({ farmerId })
      .sort({ harvestDate: -1 })
      .populate('cropId', 'cropName');
    
    res.status(200).json({
      success: true,
      count: harvests.length,
      data: harvests
    });
  } catch (error) {
    console.error('Error fetching harvests:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get harvests for a specific crop
exports.getHarvestsByCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const harvests = await HarvestRecord.find({ cropId })
      .sort({ harvestDate: -1 });
    
    res.status(200).json({
      success: true,
      count: harvests.length,
      data: harvests
    });
  } catch (error) {
    console.error('Error fetching harvests by crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single harvest by ID
exports.getHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const harvest = await HarvestRecord.findById(id)
      .populate('cropId', 'cropName')
      .populate('farmerId', 'walletAddress');
    
    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: harvest
    });
  } catch (error) {
    console.error('Error fetching harvest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a harvest record
exports.updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If there are new images to add
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // Update the timestamp
    updateData.updatedAt = Date.now();
    
    const updatedHarvest = await HarvestRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedHarvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedHarvest
    });
  } catch (error) {
    console.error('Error updating harvest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete a harvest record
exports.deleteHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const harvest = await HarvestRecord.findById(id);
    
    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest record not found'
      });
    }
    
    await HarvestRecord.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Harvest record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting harvest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Generate QR code for a harvest
exports.generateQRCode = async (req, res) => {
  try {
    const { harvestId } = req.params;
    
    const harvest = await HarvestRecord.findById(harvestId)
      .populate('cropId')
      .populate('farmerId');
    
    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest record not found'
      });
    }
    
    // Generate QR code data (JSON string with harvest info)
    const qrData = JSON.stringify({
      harvestId: harvest._id,
      cropId: harvest.cropId._id,
      cropName: harvest.cropId.cropName,
      farmerId: harvest.farmerId._id,
      harvestDate: harvest.harvestDate,
      timestamp: new Date().toISOString()
    });
    
    // Generate QR code as base64 string
    const qrCodeImage = await QRCode.toDataURL(qrData);
    
    // Save QR code to database
    const harvestQRCode = new HarvestQRCode({
      harvestId: harvest._id,
      cropId: harvest.cropId._id,
      farmerId: harvest.farmerId._id,
      qrCodeData: qrData,
      qrImageUrl: qrCodeImage
    });
    
    await harvestQRCode.save();
    
    res.status(201).json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrCode: harvestQRCode,
        qrImage: qrCodeImage
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};