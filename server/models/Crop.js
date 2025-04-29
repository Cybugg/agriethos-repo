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
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  images: {
    type: [String]
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Crop', cropSchema);