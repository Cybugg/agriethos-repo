const express = require("express");
const { createFarmProperty, updateFarmProperty, getFarmByFarmer, getFarmByPropertyId,updateFarmImages } = require("../controllers/farmPropertiesController"); // Add getFarmByPropertyId
const upload = require('../middlewares/upload');
const router = express.Router();

// POST route for wallet-based login
router.post("/farm-properties", upload.array('images',4), createFarmProperty);
router.put("/farm-properties/:id", updateFarmProperty);
router.get("/farm-properties/:id", getFarmByFarmer);
router.get("/farm-properties/property/:farmPropertyId", getFarmByPropertyId); // New route
router.put('/images/:id', upload.array('images', 4), updateFarmImages);
module.exports = router;
