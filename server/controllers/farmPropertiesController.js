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
  


exports.getFarmsByFarmer = async (req, res) => {
  try {
    const farms = await Farm.find({ farmer: req.params.farmerId }).populate('farmer');
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};