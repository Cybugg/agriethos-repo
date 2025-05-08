// const mongoose = require('mongoose');

// const harvestRecordSchema = new mongoose.Schema({
//   cropId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Crop',
//     required: true
//   },
//   farmerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Farmer',
//     required: true
//   },
//   harvestDate: {
//     type: Date,
//     required: true
//   },
//   quantity: {
//     value: {
//       type: Number,
//       required: true
//     },
//     unit: {
//       type: String,
//       required: true,
//       enum: ['kg', 'ton', 'lb', 'bushel']
//     }
//   },
//   qualityMetrics: {
//     appearance: {
//       type: String,
//       enum: ['excellent', 'good', 'average', 'poor'],
//       default: 'good'
//     },
//     size: {
//       type: String,
//       enum: ['large', 'medium', 'small'],
//       default: 'medium'
//     },
//     color: String,
//     moisture: Number,
//     notes: String
//   },
//   location: {
//     coordinates: {
//       latitude: Number,
//       longitude: Number
//     },
//     description: String
//   },
//   weatherConditions: {
//     temperature: Number,
//     humidity: Number,
//     conditions: String
//   },
//   images: [String],
//   verificationStatus: {
//     type: String,
//     enum: ['pending', 'verified', 'rejected'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('HarvestRecord', harvestRecordSchema);