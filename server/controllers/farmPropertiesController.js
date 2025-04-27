const FarmProperty = require('../models/FarmProperties');
const Farmer = require('../models/Farmer');

exports.createFarmProperty = async (req, res) => {
    try {
      const {
        farmerId,
        farmName,
        location,
        size,
        soilType,
        waterSource,
        irrigationType,
        coverCrops,
        farmType,
        companionPlanting,
        fertilizerType,
        pesticideUsage
      } = req.body;
      const images = req.files.map(file => file.path); // 🖼️ Get all uploaded Cloudinary URLs

    // Check if exactly 4 images are uploaded
    if (!images || images.length !== 4) {
      return res.status(400).json({ 
        success: false,
        message: 'Exactly 4 images are required.'
      });
    }

      if (!farmerId || !farmName || !location) {
        return res.status(400).json({ error: 'Required fields missing' });
      }
  
      const newProperty = new FarmProperty({
        farmerId,
        farmName,
        location,
        size,
        soilType,
        waterSource,
        irrigationType,
        farmType,
        companionPlanting,
        fertilizerType,
        coverCrops,
        pesticideUsage,
        images: images || [], // optional
      });

      await newProperty.save();

      let user = await Farmer.findOne({ _id: farmerId});
      user.newUser = "false";
      await user.save()

      res.status(201).json({ message: 'Farm property created', farmProperty: newProperty });
    } catch (err) {
      console.error('Error creating farm property:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.updateFarmProperty = async (req, res) => {
    try {
      const { id } = req.params; // FarmProperty ID
      const updateData = req.body; // The fields you want to update
  
      const updatedFarm = await FarmProperty.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedFarm) {
        return res.status(404).json({ success: false, message: 'Farm Property not found' });
      }
  
      res.status(200).json({ success: true, data: updatedFarm });
    } catch (error) {
      console.error('Error updating farm property:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  };

exports.getFarmsByFarmer = async (req, res) => {
  try {
    const farms = await FarmProperty.find({ farmer: req.params.farmerId }).populate('farmer');
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};