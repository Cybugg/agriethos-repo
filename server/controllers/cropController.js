const Crop = require('../models/Crop');
const FarmProperty = require('../models/FarmProperties');
const Farmer = require('../models/Farmer');
const Reviewer = require('../models/Reviewer'); // Added: Import the Reviewer model
const { verifyCropOnBlockchain, addProcessLogToBlockchain } = require('../utils/blockchainService');
const mongoose = require('mongoose');

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
    // Assuming reviewerId (agent's _id) is passed in the body when a review action occurs
    const { verificationStatus, reviewerId, farmerId, ...otherUpdateData } = req.body; 

    let updateData = { ...otherUpdateData, updatedAt: Date.now() };

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus;
    }

    const existingCrop = await Crop.findById(id).populate('farmPropertyId').populate({ path: 'farmerId', select: 'walletAddress email name' }); // Populate for details
    if (!existingCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // If a reviewerId is provided, it means a reviewer is actioning this update.
    // We need to fetch their walletAddress to store it.
    if (reviewerId) {
      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer || !reviewer.walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Reviewer not found or reviewer does not have a wallet address.'
        });
      }
      
      // Update appropriate reviewer field based on growth stage
      if (existingCrop.growthStage === 'pre-harvest' && verificationStatus) { // Ensure verification is happening
        updateData.preHarvestAgent = reviewer.walletAddress; // Store wallet address
      } else if (existingCrop.growthStage === 'post-harvest' && verificationStatus) { // Ensure verification is happening
        updateData.postHarvestAgent = reviewer.walletAddress; // Store wallet address
      }
    }
    
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('farmPropertyId').populate({ path: 'farmerId', select: 'walletAddress email name' });
    
    if (!updatedCrop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    // Add blockchain verification when crop is verified and has necessary data
    // Condition updated: Proceed if farmerId exists, walletAddress can be a placeholder.
    if (verificationStatus === 'verified' && updatedCrop.harvestingDate && updatedCrop.farmerId) {
      try {
        console.log('=== BLOCKCHAIN VERIFICATION PROCESS STARTED ===');
        console.log(`Crop ID: ${updatedCrop._id}`);
        console.log(`Crop Name: ${updatedCrop.cropName}`);
        console.log(`Growth Stage: ${updatedCrop.growthStage}`);
        console.log(`Farmer ID: ${updatedCrop.farmerId._id}`);
        console.log(`Farm Property ID: ${updatedCrop.farmPropertyId?._id}`);
        console.log(`Pre-Harvest Agent: ${updatedCrop.preHarvestAgent || 'N/A'}`);
        console.log(`Post-Harvest Agent: ${updatedCrop.postHarvestAgent || 'N/A'}`);
        console.log(`Harvesting Date: ${updatedCrop.harvestingDate}`);
        console.log('=== PREPARING FARMING DETAILS ===');
        
        const farmingDetails = {
          preNotes: updatedCrop.preNotes || 'N/A',
          postNotes: updatedCrop.postNotes || 'N/A',
          storageMethod: updatedCrop.storageMethod || 'N/A',
          plantingDate: updatedCrop.plantingDate ? new Date(updatedCrop.plantingDate).toISOString() : 'N/A',
          expectedHarvestingDate: updatedCrop.expectedHarvestingDate ? new Date(updatedCrop.expectedHarvestingDate).toISOString() : 'N/A',
          quantityHarvested: updatedCrop.quantityHarvested || 'N/A',
          unit: updatedCrop.unit || 'N/A',
          preHarvestAgent: updatedCrop.preHarvestAgent || 'N/A',
          postHarvestAgent: updatedCrop.postHarvestAgent || 'N/A',
          images: updatedCrop.images || [],
          growthStageAtVerification: updatedCrop.growthStage,
          farmName: updatedCrop.farmPropertyId?.farmName || 'N/A',
          farmType: updatedCrop.farmPropertyId?.farmType || 'N/A',
        };
        
        console.log('Farming Details Prepared:', JSON.stringify(farmingDetails, null, 2));
        const farmingMethodsJSON = JSON.stringify(farmingDetails);
        console.log(`Farming Methods JSON Length: ${farmingMethodsJSON.length} characters`);

        const cropDetails = {
          farmerWalletAddress: updatedCrop.preHarvestAgent || updatedCrop.postHarvestAgent || "REVIEWER_WALLET_NOT_FOUND", 
          cropId: updatedCrop._id.toString(),
          cropType: updatedCrop.cropName,
          farmingMethods: farmingMethodsJSON,
          harvestDateTimestamp: Math.floor(new Date(updatedCrop.harvestingDate).getTime() / 1000),
          geographicOrigin: updatedCrop.farmPropertyId?.location || 'Unknown location'
        };
        
        console.log('=== CROP DETAILS FOR BLOCKCHAIN ===');
        console.log(`Farmer Wallet Address (Placeholder): ${cropDetails.farmerWalletAddress}`);
        console.log(`Crop ID: ${cropDetails.cropId}`);
        console.log(`Crop Type: ${cropDetails.cropType}`);
        console.log(`Harvest Date Timestamp: ${cropDetails.harvestDateTimestamp}`);
        console.log(`Geographic Origin: ${cropDetails.geographicOrigin}`);
        console.log(`Farming Methods JSON Size: ${cropDetails.farmingMethods.length} bytes`);
        
        console.log('=== CALLING BLOCKCHAIN SERVICE ===');
        const txHash = await verifyCropOnBlockchain(cropDetails);
        console.log(`✅ BLOCKCHAIN SUCCESS: Crop ${updatedCrop._id} successfully added to blockchain`);
        console.log(`Transaction Hash: ${txHash}`);
        
        console.log('=== UPDATING DATABASE WITH TX HASH ===');
        const dbUpdateResult = await Crop.findByIdAndUpdate(id, { 
          blockchainTxHash: txHash,
        });
        
        if (dbUpdateResult) {
          console.log(`✅ DATABASE SUCCESS: Transaction hash stored in database for crop ${id}`);
        } else {
          console.error(`❌ DATABASE ERROR: Failed to store transaction hash for crop ${id}`);
        }
        
        console.log('=== BLOCKCHAIN VERIFICATION PROCESS COMPLETED SUCCESSFULLY ===');
        
      } catch (blockchainError) {
        console.error('=== BLOCKCHAIN VERIFICATION PROCESS FAILED ===');
        console.error(`❌ CROP ID: ${updatedCrop._id}`);
        console.error(`❌ ERROR MESSAGE: ${blockchainError.message}`);
        console.error(`❌ ERROR STACK:`, blockchainError.stack);
        
        // Try to parse and log more detailed error information
        if (blockchainError.data) {
          console.error(`❌ ERROR DATA:`, JSON.stringify(blockchainError.data, null, 2));
        }
        
        if (blockchainError.reason) {
          console.error(`❌ ERROR REASON: ${blockchainError.reason}`);
        }
        
        if (blockchainError.code) {
          console.error(`❌ ERROR CODE: ${blockchainError.code}`);
        }
        
        // Log the current state of crop data for debugging
        console.error('❌ CROP DATA AT TIME OF ERROR:', {
          cropId: updatedCrop._id,
          cropName: updatedCrop.cropName,
          growthStage: updatedCrop.growthStage,
          verificationStatus: updatedCrop.verificationStatus,
          preHarvestAgent: updatedCrop.preHarvestAgent,
          postHarvestAgent: updatedCrop.postHarvestAgent,
          harvestingDate: updatedCrop.harvestingDate,
          farmPropertyLocation: updatedCrop.farmPropertyId?.location
        });
        
        // Optionally, store the error in database for later analysis
        try {
          await Crop.findByIdAndUpdate(id, { 
            blockchainError: blockchainError.message,
            blockchainErrorTimestamp: new Date(),
            blockchainStatus: 'failed'
          });
          console.log(`📝 ERROR LOG: Blockchain error stored in database for crop ${id}`);
        } catch (dbError) {
          console.error(`❌ DB ERROR LOG FAILED: Could not store blockchain error in database:`, dbError.message);
        }
        
        console.error('=== END BLOCKCHAIN ERROR LOG ===');
      }
    } else {
      console.log('=== BLOCKCHAIN VERIFICATION SKIPPED ===');
      console.log(`Verification Status: ${verificationStatus}`);
      console.log(`Has Harvesting Date: ${!!updatedCrop.harvestingDate}`);
      console.log(`Has Farmer ID: ${!!updatedCrop.farmerId}`);
      console.log('Conditions not met for blockchain verification');
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
        // Clear post-harvest agent when upgrading (new review needed)
        postHarvestAgent: null
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

      const secCrop = await Crop.findById(id)
      .populate('farmerId');
      const email = await secCrop.farmerId.email;
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Populate agent details using aggregation for wallet addresses
    // const cropWithAgents = await Crop.aggregate([
    //   { $match: { _id: crop._id } },
    //   {
    //     $lookup: {
    //       from: 'reviewers',
    //       localField: 'preHarvestAgent',
    //       foreignField: 'walletAddress',
    //       as: 'preHarvestAgentInfo'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'reviewers',
    //       localField: 'postHarvestAgent',
    //       foreignField: 'walletAddress',
    //       as: 'postHarvestAgentInfo'
    //     }
    //   },
    //   {
    //     $addFields: {
    //       preHarvestAgentInfo: { $arrayElemAt: ['$preHarvestAgentInfo', 0] },
    //       postHarvestAgentInfo: { $arrayElemAt: ['$postHarvestAgentInfo', 0] }
    //     }
    //   }
    // ]);
    
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


// Update getReviewedCropsByReviewer to query by wallet address
exports.getReviewedCropsByReviewer = async (req,res)=>{
  try{
    const { reviewerId } = req.params; // This is the agent's _id

    const reviewer = await Reviewer.findById(reviewerId).select('walletAddress'); // Only fetch walletAddress
    if (!reviewer || !reviewer.walletAddress) {
      return res.status(404).json({
        success: false,
        message: 'Reviewer not found or reviewer does not have a wallet address.'
      });
    }

    const reviewerWalletAddress = reviewer.walletAddress;
    
    // Find crops reviewed by this specific reviewer's wallet address
    const crops = await Crop.find({
      $or: [
        { preHarvestAgent: reviewerWalletAddress },
        { postHarvestAgent: reviewerWalletAddress }
      ],
      verificationStatus: { $in: ['verified', 'rejected', 'toUpgrade'] } 
    })
    .populate({ path: 'farmerId', select: 'name email walletAddress' }) // Select specific fields
    .populate({ path: 'farmPropertyId', select: 'farmName location farmAddress' }) // Select specific fields
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
};