const Crop = require('../models/Crop');
const FarmProperty = require('../models/FarmProperties');
const Farmer = require('../models/Farmer');
const { verifyCropOnBlockchain, addProcessLogToBlockchain } = require('../utils/blockchainService'); // Ensure both are imported

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

// Update crop details (typically by a reviewer/admin)
exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus, reviewerId } = req.body;

    const updateData = {
      verificationStatus,
      updatedAt: Date.now()
    };

    if (reviewerId) {
      updateData.reviewedBy = reviewerId;
    }

    const originalCrop = await Crop.findById(id).populate('farmPropertyId').populate('farmerId');
    if (!originalCrop) {
      return res.status(404).json({ success: false, message: 'Crop not found for update' });
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('farmPropertyId').populate('farmerId');

    if (!updatedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found after update attempt'
      });
    }

    // If crop is marked as 'verified' and not already on the blockchain, trigger transaction
    if (updatedCrop.verificationStatus === 'verified' && !originalCrop.blockchainTransactionHash && !updatedCrop.blockchainTransactionHash) {
      try {
        const farmProperty = updatedCrop.farmPropertyId;
        const farmer = updatedCrop.farmerId;

        if (!farmProperty || !farmer) {
          console.error(`Blockchain Ver.: Farm property or farmer details missing for crop ${updatedCrop._id}.`);
          throw new Error('Farm property or farmer details missing for blockchain verification.');
        }
        if (!farmer.walletAddress) {
          console.error(`Blockchain Ver.: Farmer ${farmer._id} (name: ${farmer.name}) does not have a walletAddress. Skipping blockchain verification for crop ${updatedCrop._id}.`);
          // Not throwing an error here, but logging it. The crop is verified in DB.
          // You might want to add a specific status or note to the crop in this case.
        } else {
          let farmingMethodsDescription = `Farm Type: ${farmProperty.farmType || 'N/A'}. Soil: ${farmProperty.soilType || 'N/A'}. Water: ${farmProperty.waterSource || 'N/A'}.`;
          if (farmProperty.fertilizerType) farmingMethodsDescription += ` Fertilizer: ${farmProperty.fertilizerType}.`;
          if (farmProperty.pesticideUsage) farmingMethodsDescription += ` Pesticides: ${farmProperty.pesticideUsage}.`;
          // Add other relevant farmProperty fields to farmingMethodsDescription

          const harvestDate = updatedCrop.harvestingDate || updatedCrop.expectedHarvestingDate;
          if (!harvestDate) {
            console.error(`Blockchain Ver.: Harvest date is missing for crop ${updatedCrop._id}.`);
            throw new Error('Harvest date is missing for blockchain verification.');
          }

          const cropDetailsForBlockchain = {
            cropId: updatedCrop._id.toString(),
            farmWalletAddress: farmer.walletAddress, // This is the farmer's wallet, not the farm's if they differ
            cropType: updatedCrop.cropName,
            farmingMethods: farmingMethodsDescription.substring(0, 500), // Be mindful of string length limits & gas
            harvestDateTimestamp: Math.floor(new Date(harvestDate).getTime() / 1000),
            geographicOrigin: farmProperty.location || farmProperty.address || 'N/A', // Use available location info
          };

          console.log(`Blockchain Ver.: Preparing to send crop ${updatedCrop._id} to blockchain with details:`, cropDetailsForBlockchain);
          const txHash = await verifyCropOnBlockchain(cropDetailsForBlockchain);
          updatedCrop.blockchainTransactionHash = txHash;
          updatedCrop.blockchainVerificationTimestamp = new Date();
          updatedCrop.blockchainVerificationError = null; // Clear any previous error
          await updatedCrop.save();
          console.log(`Blockchain Ver.: Crop ${updatedCrop._id} successfully verified on blockchain. TxHash: ${txHash}`);
        }

      } catch (blockchainError) {
        console.error(`Blockchain Ver.: Blockchain verification FAILED for crop ${updatedCrop._id}: ${blockchainError.message}`);
        updatedCrop.blockchainVerificationError = blockchainError.message.substring(0, 1000); // Store error message
        await updatedCrop.save(); // Save the error
        // Continue with the successful DB update response, but the error is logged.
        // Optionally, you could return a specific error to the client if blockchain part is critical.
        // For example:
        // return res.status(207).json({ // Multi-Status
        //   success: true, // DB update was successful
        //   message: 'Crop updated in DB, but blockchain verification failed.',
        //   blockchainError: blockchainError.message,
        //   data: updatedCrop
        // });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully.',
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
// Update crop details (post-harvest by farmer)
exports.upgradeCrop = async (req, res) => {
  try {
    const { id } = req.params; // This is crop._id
    const {
      farmerId,
      harvestingDate,
      storageMethod,
      postNotes,
      growthStage,
      quantityHarvested,
      unit
    } = req.body;

    const originalCrop = await Crop.findById(id).populate('farmPropertyId'); // Populate for location
    if (!originalCrop) {
      return res.status(404).json({ success: false, message: "Crop not found" });
    }
    if (originalCrop.farmerId.toString() !== farmerId) {
      return res.status(403).json({ success: false, message: "UNAUTHORIZED: Farmer does not own this crop" });
    }

    let imagePaths;
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path);
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      {
        harvestingDate: harvestingDate || originalCrop.harvestingDate, // Keep original if not provided
        storageMethod,
        postNotes,
        growthStage,
        quantityHarvested,
        unit,
        ...(imagePaths && { $push: { images: { $each: imagePaths } } }),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('farmPropertyId'); // Ensure farmPropertyId is populated for location

    if (!updatedCrop) {
      return res.status(404).json({ success: false, message: 'Crop not found after upgrade attempt' });
    }

    // If the crop was previously verified on the blockchain, add a process log
    // Ensure it's still considered 'verified' if your workflow allows status changes post-verification
    if (updatedCrop.blockchainTransactionHash && updatedCrop.verificationStatus === 'verified') {
      try {
        const stage = "Post-Harvest Update";
        let description = `Farmer updated post-harvest details.`;
        if (postNotes) description += ` Notes: ${postNotes}.`;
        if (storageMethod) description += ` Storage: ${storageMethod}.`;
        if (quantityHarvested && unit) description += ` Quantity: ${quantityHarvested} ${unit}.`;
        else if (quantityHarvested) description += ` Quantity: ${quantityHarvested}.`;


        const farmProperty = updatedCrop.farmPropertyId;
        const location = farmProperty?.location || farmProperty?.address || 'Farm Location';

        const additionalDataPayload = {
          actualHarvestingDate: updatedCrop.harvestingDate ? new Date(updatedCrop.harvestingDate).toISOString() : 'N/A',
          storageMethod: updatedCrop.storageMethod || 'N/A',
          postNotes: updatedCrop.postNotes || 'N/A',
          quantityHarvested: updatedCrop.quantityHarvested || 'N/A',
          unit: updatedCrop.unit || 'N/A',
        };
        const additionalData = JSON.stringify(additionalDataPayload);
        
        console.log(`Blockchain Log: Preparing to add log for crop ${updatedCrop._id} with details:`, { stage, description, location, additionalData });
        const logTxHash = await addProcessLogToBlockchain(
            updatedCrop._id.toString(),
            stage,
            description.substring(0, 500), // Keep descriptions concise for gas
            location,
            additionalData
        );
        console.log(`Blockchain Log: Process log added to blockchain for crop ${updatedCrop._id}. TxHash: ${logTxHash}`);
        
        // Optionally, store this new transaction hash, perhaps in an array on the Crop model:
        // updatedCrop.blockchainProcessLogHashes = updatedCrop.blockchainProcessLogHashes || [];
        // updatedCrop.blockchainProcessLogHashes.push(logTxHash);
        // await updatedCrop.save(); // Save if you add the above field

      } catch (blockchainError) {
        console.error(`Blockchain Log: Failed to add process log to blockchain for crop ${updatedCrop._id}: ${blockchainError.message}`);
        // Log this error, potentially store it on the crop document
        // updatedCrop.blockchainProcessLogError = blockchainError.message; // You might need a separate field for log errors
        // await updatedCrop.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Crop upgraded successfully',
      data: updatedCrop
    });
  } catch (error) {
    console.error('Error upgrading crop:', error);
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

      const secCrop = await Crop.findById(id)
      .populate('farmerId');
      const email = await secCrop.farmerId.email;
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: crop,
      email:email
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

exports.getAllVerifiedCrops = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const regex = new RegExp(search, 'i'); // Case-insensitive
    const verifiedCrops = await Crop.find({ 
      verificationStatus: { $in: ['verified'] } ,cropName: regex
    })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ plantingDate: -1 })
    .populate('farmPropertyId', 'farmName farmType location images'); // Populate farm details
    
    const total = await Crop.countDocuments({ cropName: regex });
    res.status(200).json({
      success: true,
      count: verifiedCrops.length,
      data: verifiedCrops,
      total,
      hasMore: (page * limit) < total
    });
  } catch (error) {
    console.error('Error fetching verified crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};


exports.getReviewedCropsByReviewer = async (req,res)=>{
  try{

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
}