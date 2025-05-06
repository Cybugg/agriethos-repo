const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  harvests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HarvestRecord'
  }],
  cropType: {
    type: String,
    required: true
  },
  totalQuantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'ton', 'lb', 'bushel']
    }
  },
  status: {
    type: String,
    enum: ['created', 'processing', 'completed', 'shipped', 'delivered'],
    default: 'created'
  },
  destination: {
    name: String,
    address: String,
    contactInfo: String
  },
  history: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: String,
    notes: String
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
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

module.exports = mongoose.model('Batch', batchSchema);