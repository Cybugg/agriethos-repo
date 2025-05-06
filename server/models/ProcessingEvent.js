const mongoose = require('mongoose');

const processingEventSchema = new mongoose.Schema({
  harvestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HarvestRecord',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  processingType: {
    type: String,
    required: true,
    enum: ['washing', 'sorting', 'packaging', 'drying', 'milling', 'freezing', 'canning', 'other']
  },
  processingDate: {
    type: Date,
    required: true
  },
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  processorInfo: {
    name: String,
    contactInfo: String,
    certifications: [String]
  },
  qualityChecks: {
    passed: {
      type: Boolean,
      default: true
    },
    notes: String,
    inspector: String
  },
  images: [String],
  verificationStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'verified', 'rejected'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProcessingEvent', processingEventSchema);