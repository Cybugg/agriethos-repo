const Farm = require('../models/FarmProperties');

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
        images,
        coverCrops,
        farmType,
        companionPlanting,
        fertilizerType
      } = req.body;
  
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
        images: images || [], // optional
      });
  
      await newProperty.save();
      res.status(201).json({ message: 'Farm property created', farmProperty: newProperty });
    } catch (err) {
      console.error('Error creating farm property:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const updateFarmProperty = async (req, res) => {
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
    const farms = await Farm.find({ farmer: req.params.farmerId }).populate('farmer');
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};