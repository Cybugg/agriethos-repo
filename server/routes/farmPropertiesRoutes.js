const express = require("express");
const { createFarmProperty, updateFarmProperty,getFarmsByFarmer } = require("../controllers/farmPropertiesController");
const upload = require('../middlewares/upload');
const router = express.Router();

// POST route for wallet-based login
router.post("/farm-properties", upload.array('images',4), createFarmProperty);
router.put("/farm-properties/:id", updateFarmProperty);
router.get("/farm-properties/:id", getFarmsByFarmer);

module.exports = router;
