const FarmProperty = require('../models/FarmProperties');
const Farmer = require('../models/Farmer');
const cloudinary = require('cloudinary').v2;
const fs = require("fs") ;

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
    // if (!images || images.length !== 4) {
    //   return res.status(400).json({ 
    //     success: false,
    //     message: 'Exactly 4 images are required.'
    //   });
    // }

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







// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; // e.g., abc123.jpg
    const [publicId] = filename.split(".");
    return "farm_properties/" + publicId;
  } catch (err) {
    console.error("Error extracting publicId:", err);
    return null;
  }
};

exports.updateFarmImages = async (req, res) => {
  const { id } = req.params;

  try {
    const farm = await FarmProperty.findById(id);
    if (!farm) return res.status(404).json({ error: "Farm not found" });

    // 1. Delete old images from Cloudinary
    for (const imageUrl of farm.images) {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 2. Upload new images to Cloudinary
    const files = req.files;
    const newImageUrls = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "farm_properties",
      });
      newImageUrls.push(result.secure_url);

      // Delete the local file (not the Cloudinary URL!)
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // 3. Update MongoDB
    farm.images = newImageUrls;
    await farm.save();

    return res.status(200).json({ message: "Images updated", images: newImageUrls });
  } catch (error) {
    console.error("Error updating images:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};