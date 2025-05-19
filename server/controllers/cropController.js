const Crop = require('../models/Crop');
const FarmProperty = require('../models/FarmProperties');
const farmer = require("../models/Farmer")

// Create a new crop
exports.createCrop = async (req, res) => {
  try {
    const {
      farmerId,
      cropName,
      plantingDate,
      expectedHarvestingDate,
      growthStage,
      preNotes
    } = req.body;

   

    // Validate required fields
    if (!farmerId || !cropName || !plantingDate || !growthStage|| !expectedHarvestingDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Verify farm property exists and belongs to this farmer
    const farmProperty = await FarmProperty.findOne({
      farmerId: farmerId
    });

    if (!farmProperty) {
      return res.status(404).json({
        success: false,
        message: 'Farm property not found or does not belong to this farmer'
      });
    }

    // Process uploaded images if any
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create new crop record
    const newCrop = new Crop({
      farmerId,
      farmPropertyId:farmProperty._id,
      cropName,
      plantingDate,
      expectedHarvestingDate,
      growthStage,
      preNotes,
      verificationStatus:"pending"
    });
    const farm = await FarmProperty.findByIdAndUpdate(newCrop.farmPropertyId, {
      $push: { crops: newCrop._id }
    });
    await newCrop.save();
    await farm.save();

    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: newCrop
    });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get crops by farmer ID
exports.getCropsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const crops = await Crop.find({ farmerId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate('farmPropertyId'); // Get farm details
    
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update crop details
exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If there are new images to add
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // Update the timestamp
    updateData.updatedAt = Date.now();
    
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedCrop
    });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
// Update crop details
exports.upgradeCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      farmerId, 
      harvestingDate,
      storageMethod,
      postNotes,
      growthStage,
      quantityHarvested,
      unit} = req.body;

      console.log(farmerId);
      // Let's validate that the farmer exists and owner of the crops
      const crop =  await Crop.findOne({_id:id});
      if(!crop){
        return res.status(404).json({message:"Cannot find crop"});
      }
      console.log(crop.farmerId ," : ",farmerId)
      if(crop.farmerId.toString() !== farmerId){
        return res.status(401).json({message:"UNAUTHORIZED"});
      }
    let images;
    // If there are new images to add
    if (req.files && req.files.length > 0) {
       images = req.files.map(file => file.path);
    }

    // Update the timestamp
    const updatedAt = Date.now();
    
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      {harvestingDate,
        storageMethod,
        postNotes,
        growthStage,
        quantityHarvested,
        unit,
        images,
        updatedAt,
        verificationStatus:"pending",
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedCrop
    });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete crop
exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await Crop.findById(id);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    await crop.remove();
    
    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single crop by ID
exports.getCrop = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await Crop.findById(id)
      .populate('farmPropertyId', 'farmName location');
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get pending crops by farmer ID
exports.getAllPendingCrops = async (req, res) => {
  try {
    
    const pendingCrops = await Crop.find({ 
      verificationStatus: 'pending' 
    })
      .sort({ createdAt: -1 })
      .populate('farmPropertyId', 'farmName location images');
    
    res.status(200).json({
      success: true,
      count: pendingCrops.length,
      data: pendingCrops
    });
  } catch (error) {
    console.error('Error fetching pending crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all reviewed crops (not pending)
exports.getAllReviewedCrops = async (req, res) => {
  try {
    const reviewedCrops = await Crop.find({ 
      verificationStatus: { $in: ['verified', 'rejected', 'toUpgrade'] } 
    })
    .sort({ updatedAt: -1 }) // Sort by last updated
    .populate('farmPropertyId', 'farmName location'); // Populate farm details
    
    res.status(200).json({
      success: true,
      count: reviewedCrops.length,
      data: reviewedCrops
    });
  } catch (error) {
    console.error('Error fetching reviewed crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};