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


      // Update user status
      let user = await Farmer.findOne({ _id: farmerId });
      user.newUser = "false";
      user.farmId = newProperty._id;
      await user.save();
    
      // Return updated user status along with farm property
      res.status(201).json({ 
        message: 'Farm property created', 
        data: newProperty,
        user: {
          _id: user._id,
          newUser: user.newUser
        }
      });
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
  const { id } = req.params;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    const farm = await FarmProperty.findOne({ farmerId: farmer._id })
      .populate('farmerId')
      .populate('crops');

    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found for this farmer" });
    }

    res.status(200).json(farm);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// New controller function to get a farm property by its own ID
exports.getFarmByPropertyId = async (req, res) => {
  try {
    const { farmPropertyId } = req.params;
    const farm = await FarmProperty.findById(farmPropertyId).populate('crops'); // Optionally populate other refs if needed

    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm property not found" });
    }
    res.status(200).json(farm); // Send the full farm property object
  } catch (err) {
    console.error('Error fetching farm property by ID:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};



