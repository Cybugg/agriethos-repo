const mongoose = require('mongoose');

const farmPropertySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  latitude: { type: String,  },
  longitude: { type: String,  },
  farmName: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: String },
  farmType: { type: String },
  waterSource: { type: String },
  soilType: { type: String },
  irrigationType: { type: String },
  fertilizerType: { type: String },
  pesticideUsage: { type: String, default:"false" },
  coverCrops:{type: String, default:"false"},
  companionPlanting:{type:String, default:"false"},
  crops:{
    type:[String]
  },
  images: {
    type:[String]  // array of image URLs
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FarmProperty', farmPropertySchema);
