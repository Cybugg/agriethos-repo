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
      user.farmId = newProperty._id;
      await user.save()

      res.status(201).json({ message: 'Farm property created', data: newProperty });
    } catch (err) {
      console.error('Error creating farm property:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.updateFarmProperty = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      console.log('Updating farm with ID:', id);
      console.log('Incoming update data:', updateData);
  
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
  

exports.getFarmByFarmer = async (req, res) => {
  try {
    const farms = await FarmProperty.findOne({ farmer: req.params.farmerId }).populate('farmerId');
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
