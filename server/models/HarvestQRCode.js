const mongoose = require('mongoose');

const harvestQRCodeSchema = new mongoose.Schema({
  harvestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HarvestRecord',
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  qrCodeData: {
    type: String,
    required: true
  },
  qrImageUrl: {
    type: String
  },
  verificationHash: {
    type: String
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('HarvestQRCode', harvestQRCodeSchema);