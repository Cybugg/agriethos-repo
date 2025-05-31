const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');
const FarmProperty = require('../models/FarmProperties');
const Reviewer = require('../models/Reviewer');
const Admin = require('../models/Admin'); // Import the Admin model

// Mock the blockchainService
jest.mock('../utils/blockchainService');
const { verifyCropOnBlockchain, addProcessLogToBlockchain } = require('../utils/blockchainService');

describe('Crop API - Blockchain Integration', () => {
  let farmer;
  let farmProperty;
  let cropToVerify;
  let verifiedCrop; // For testing addProcessLog
  let reviewer;
  let adminUser; // Variable to hold the created admin

  beforeEach(async () => {
    // Clear mocks before each test
    verifyCropOnBlockchain.mockClear();
    addProcessLogToBlockchain.mockClear();

    // Default successful mock implementations (can be overridden per test if needed)
    verifyCropOnBlockchain.mockResolvedValue("mock_tx_hash_verify_crop");
    addProcessLogToBlockchain.mockResolvedValue("mock_tx_hash_add_log");


    // Create a dummy Admin user first
    adminUser = await Admin.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123', // Add any other required fields for Admin model
      // Ensure your Admin model has these fields or adjust accordingly
    });

    farmer = await Farmer.create({
      name: 'Test Farmer',
      email: 'farmer@test.com',
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    farmProperty = await FarmProperty.create({
      farmerId: farmer._id,
      farmName: 'Test Farm',
      location: 'Test Location, Test Country',
      farmType: 'Organic',
      soilType: 'Loamy',
      waterSource: 'Well',
    });

    cropToVerify = await Crop.create({
      farmerId: farmer._id,
      farmPropertyId: farmProperty._id,
      cropName: 'Test Tomatoes',
      plantingDate: new Date('2024-01-01'),
      expectedHarvestingDate: new Date('2024-06-01'),
      growthStage: 'pre-harvest',
      verificationStatus: 'pending',
    });

    verifiedCrop = await Crop.create({
      farmerId: farmer._id,
      farmPropertyId: farmProperty._id,
      cropName: 'Test Carrots (Verified)',
      plantingDate: new Date('2024-02-01'),
      expectedHarvestingDate: new Date('2024-07-01'),
      growthStage: 'post-harvest',
      verificationStatus: 'verified',
      blockchainTransactionHash: 'existing_mock_tx_hash',
      blockchainVerificationTimestamp: new Date(),
    });

    reviewer = await Reviewer.create({
        name: 'Test Reviewer',
        walletAddress: '0xReviewerWalletAddress000000000000000000',
        createdBy: adminUser._id, // Use the created admin's ID
        // last_transaction_stamp is not needed here as it has a default in the model
    });
  });

  describe('PUT /api/crops/:id (Update Crop for Verification)', () => {
    it('should verify a crop and call verifyCropOnBlockchain when status is "verified"', async () => {
      const response = await request(app)
        .put(`/api/crops/${cropToVerify._id}`)
        .send({
          verificationStatus: 'verified',
          reviewerId: reviewer._id.toString(), // Assuming reviewerId is a string of Mongo ObjectId
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.verificationStatus).toBe('verified');
      expect(response.body.data.blockchainTransactionHash).toBe("mock_tx_hash_verify_crop");
      expect(response.body.data).toHaveProperty('blockchainVerificationTimestamp');

      // Check if the blockchain service was called correctly
      expect(verifyCropOnBlockchain).toHaveBeenCalledTimes(1);
      expect(verifyCropOnBlockchain).toHaveBeenCalledWith(
        expect.objectContaining({
          cropId: cropToVerify._id.toString(),
          farmWalletAddress: farmer.walletAddress,
          cropType: cropToVerify.cropName,
          // Add more specific checks for farmingMethods, harvestDateTimestamp, geographicOrigin if needed
        })
      );

      const updatedCropInDb = await Crop.findById(cropToVerify._id);
      expect(updatedCropInDb.blockchainTransactionHash).toBe("mock_tx_hash_verify_crop");
    });

    it('should NOT call verifyCropOnBlockchain if farmer has no walletAddress', async () => {
      const farmerWithoutWallet = await Farmer.create({ name: 'No Wallet Farmer', email: 'nowallet@test.com' });
      const cropOfFarmerWithoutWallet = await Crop.create({
        farmerId: farmerWithoutWallet._id,
        farmPropertyId: farmProperty._id, // Re-use farm property for simplicity
        cropName: 'No Wallet Crop',
        plantingDate: new Date(),
        expectedHarvestingDate: new Date(),
        growthStage: 'pre-harvest',
        verificationStatus: 'pending',
      });

      const response = await request(app)
        .put(`/api/crops/${cropOfFarmerWithoutWallet._id}`)
        .send({
          verificationStatus: 'verified',
          reviewerId: reviewer._id.toString(),
        });

      expect(response.statusCode).toBe(200); // DB update should still succeed
      expect(response.body.data.verificationStatus).toBe('verified');
      expect(verifyCropOnBlockchain).not.toHaveBeenCalled();

      const updatedCropInDb = await Crop.findById(cropOfFarmerWithoutWallet._id);
      expect(updatedCropInDb.blockchainTransactionHash).toBeUndefined();
      // You might want to check for a blockchainVerificationError message if you implement that
    });

    it('should handle errors from verifyCropOnBlockchain gracefully', async () => {
      verifyCropOnBlockchain.mockRejectedValueOnce(new Error("Blockchain network error"));

      const response = await request(app)
        .put(`/api/crops/${cropToVerify._id}`)
        .send({
          verificationStatus: 'verified',
          reviewerId: reviewer._id.toString(),
        });

      expect(response.statusCode).toBe(200); // The API itself might still return 200 if DB update is primary
      expect(response.body.data.verificationStatus).toBe('verified'); // DB status is updated
      expect(response.body.data).toHaveProperty('blockchainVerificationError');
      expect(response.body.data.blockchainVerificationError).toBe("Blockchain network error");
      expect(response.body.data.blockchainTransactionHash).toBeUndefined();


      expect(verifyCropOnBlockchain).toHaveBeenCalledTimes(1);

      const updatedCropInDb = await Crop.findById(cropToVerify._id);
      expect(updatedCropInDb.blockchainVerificationError).toBe("Blockchain network error");
      expect(updatedCropInDb.blockchainTransactionHash).toBeUndefined();
    });

    it('should NOT call verifyCropOnBlockchain if crop already has a blockchainTransactionHash', async () => {
        const response = await request(app)
          .put(`/api/crops/${verifiedCrop._id}`) // Use the already verified crop
          .send({
            verificationStatus: 'verified', // Re-sending as verified
            reviewerId: reviewer._id.toString(),
          });

        expect(response.statusCode).toBe(200);
        expect(verifyCropOnBlockchain).not.toHaveBeenCalled();
        expect(response.body.data.blockchainTransactionHash).toBe('existing_mock_tx_hash'); // Should remain unchanged
      });
  });

  describe('PUT /api/crops/upgrade/:id (Upgrade Crop for Process Logging)', () => {
    it('should add a process log and call addProcessLogToBlockchain if crop is verified on blockchain', async () => {
      const upgradeData = {
        farmerId: farmer._id.toString(),
        storageMethod: "Cool and Dry Storage",
        postNotes: "Quality checked after harvest.",
        growthStage: "post-harvest",
        quantityHarvested: 150,
        unit: "kg"
      };

      const response = await request(app)
        .put(`/api/crops/upgrade/${verifiedCrop._id}`) // Use the crop already marked as verified with a hash
        .send(upgradeData);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.storageMethod).toBe(upgradeData.storageMethod);

      expect(addProcessLogToBlockchain).toHaveBeenCalledTimes(1);
      expect(addProcessLogToBlockchain).toHaveBeenCalledWith(
        verifiedCrop._id.toString(),
        "Post-Harvest Update",
        expect.any(String), // Description can be complex, just check it's a string
        expect.any(String), // Location
        expect.any(String)  // additionalData JSON string
      );
    });

    it('should NOT call addProcessLogToBlockchain if crop is not verified on blockchain', async () => {
      const upgradeData = {
        farmerId: farmer._id.toString(),
        storageMethod: "Cool Storage",
      };

      const response = await request(app)
        .put(`/api/crops/upgrade/${cropToVerify._id}`) // Use the crop NOT yet verified on blockchain
        .send(upgradeData);

      expect(response.statusCode).toBe(200);
      expect(addProcessLogToBlockchain).not.toHaveBeenCalled();
    });

     it('should handle errors from addProcessLogToBlockchain gracefully', async () => {
      addProcessLogToBlockchain.mockRejectedValueOnce(new Error("Log submission failed"));
      const upgradeData = {
        farmerId: farmer._id.toString(),
        storageMethod: "Test Storage",
      };

      const response = await request(app)
        .put(`/api/crops/upgrade/${verifiedCrop._id}`)
        .send(upgradeData);

      expect(response.statusCode).toBe(200); // API call itself is successful
      expect(addProcessLogToBlockchain).toHaveBeenCalledTimes(1);
      // Check server logs for the error message.
      // You might add a specific field to Crop model to store blockchainProcessLogError if needed.
    });
  });
});