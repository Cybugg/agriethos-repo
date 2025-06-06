const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  farmPropertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmProperty',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  plantingDate: {
    type: Date,
    required: true
  },
  harvestingDate: {
    type: Date
  },
  growthStage: {
    type: String,
    enum: ['pre-harvest', 'post-harvest'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected','toUpgrade'],
    default: 'pending'
  },
  preHarvestAgent: {
    type: String,  // Changed from ObjectId to String for wallet address
    lowercase: true // Ensure consistent casing
  },
  postHarvestAgent: {
    type: String,  // Changed from ObjectId to String for wallet address
    lowercase: true // Ensure consistent casing
  },
  images: {
    type: [String]
  },
  expectedHarvestingDate: {
    type: String
  },
  preNotes: {
    type: String
  },
  postNotes: {
    type: String
  },
  quantityHarvested: {
    type: String
  },
  unit: {
    type: String
  },
  storageMethod: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  blockchainTxHash: {
    type: String
  }
});

module.exports = mongoose.model('Crop', cropSchema);