const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const SIGNER_KEY = process.env.SIGNER_PRIVATE_KEY; // Using SIGNER_PRIVATE_KEY as requested
const LEDGER_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Using CONTRACT_ADDRESS as requested

let provider;
let signer;
let contract;

if (!RPC_URL || !SIGNER_KEY || !LEDGER_CONTRACT_ADDRESS) {
  console.error(
    "CRITICAL ERROR: Missing required blockchain environment variables (SEPOLIA_RPC_URL, SIGNER_PRIVATE_KEY, CONTRACT_ADDRESS). Blockchain features will be disabled."
  );
} else {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    signer = new ethers.Wallet(SIGNER_KEY, provider);
    contract = new ethers.Contract(LEDGER_CONTRACT_ADDRESS, AgriEthosProductLedgerABI, signer);
    console.log(`Blockchain service initialized. Connected to contract at ${LEDGER_CONTRACT_ADDRESS} via ${signer.address}`);
  } catch (e) {
    console.error("CRITICAL ERROR: Failed to initialize blockchain service:", e.message);
    // Set them to null so functions can check and throw
    provider = null;
    signer = null;
    contract = null;
  }
}

// Add this at the end of the initialization
console.log('Blockchain service status:');
console.log('Provider:', provider ? 'Connected' : 'Not connected');
console.log('Signer:', signer ? 'Connected' : 'Not connected');
console.log('Contract:', contract ? 'Connected' : 'Not connected');

// hdbcd

/**
 * Verifies and stores crop details on the blockchain.
 * @param {object} cropDetails - Details of the crop.
 * @param {string} cropDetails.cropId - Unique ID for the crop (e.g., MongoDB _id).
 * @param {string} cropDetails.farmerWalletAddress - Wallet address of the farm/farmer (included in farmingMethods).
 * @param {string} cropDetails.cropType - Type of the crop (e.g., crop.cropName).
 * @param {string} cropDetails.farmingMethods - JSON string of detailed farming methods and other crop attributes.
 * @param {number} cropDetails.harvestDateTimestamp - Harvest date as a Unix timestamp.
 * @param {string} cropDetails.geographicOrigin - Location of the farm.
 * @returns {Promise<string>} Transaction hash if successful.
 * @throws {Error} If the blockchain transaction fails or service not initialized.
 */
async function verifyCropOnBlockchain(cropDetails) {
  if (!contract || !signer || !provider) {
    throw new Error("Blockchain service is not initialized. Check server logs for errors.");
  }
  try {
    console.log(`Attempting to verify crop on blockchain: ${cropDetails.cropId}`);
    
    // Ensure all required cropDetails are present
    if (!cropDetails.farmerWalletAddress || !cropDetails.cropId || !cropDetails.cropType || !cropDetails.farmingMethods || cropDetails.harvestDateTimestamp === undefined || !cropDetails.geographicOrigin) {
        throw new Error("Missing required crop details for blockchain verification.");
    }

    const placeholderFarmAddress = await signer.getAddress(); // Using signer's address as placeholder

    const tx = await contract.verifyAndStoreCrop(
      cropDetails.cropId,
      placeholderFarmAddress, // Use the placeholder address for the farmId parameter
      cropDetails.cropType,
      cropDetails.farmingMethods, // This will be the JSON string containing farmerWalletAddress and other details
      cropDetails.harvestDateTimestamp,
      cropDetails.geographicOrigin
    );

    console.log(`Transaction sent for crop verification ${cropDetails.cropId}: ${tx.hash}. Waiting for confirmation...`);
    const receipt = await tx.wait();
    console.log(`Transaction confirmed for crop ${cropDetails.cropId}. Block number: ${receipt.blockNumber}, TxHash: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    console.error(`Error verifying crop ${cropDetails.cropId} on blockchain:`, error.message);
    let detailedMessage = error.message;
    if (error.data && error.data.message) {
        detailedMessage = error.data.message;
    } else if (error.reason) {
        detailedMessage = error.reason;
    }
    console.error("Full error object:", JSON.stringify(error, null, 2));
    throw new Error(`Blockchain transaction failed for crop ${cropDetails.cropId}: ${detailedMessage}`);
  }
}

/**
 * Adds a process log entry to an already verified crop on the blockchain.
 * @param {string} cropId - The unique ID of the crop.
 * @param {string} stage - The stage of the process (e.g., "Storage Update").
 * @param {string} description - Description of the log.
 * @param {string} location - Location relevant to the log.
 * @param {string} additionalData - JSON string of additional data.
 * @returns {Promise<string>} Transaction hash if successful.
 * @throws {Error} If the blockchain transaction fails or service not initialized.
 */
async function addProcessLogToBlockchain(cropId, stage, description, location, additionalData) {
  if (!contract || !signer || !provider) {
    throw new Error("Blockchain service is not initialized. Check server logs for errors.");
  }
  try {
    console.log(`Attempting to add process log for crop: ${cropId}, stage: ${stage}`);
    const tx = await contract.addProcessLog(
      cropId,
      stage,
      description,
      location,
      additionalData
    );

    console.log(`Transaction sent for adding log to crop ${cropId}: ${tx.hash}. Waiting for confirmation...`);
    const receipt = await tx.wait();
    console.log(`Transaction confirmed for adding log to crop ${cropId}. Block number: ${receipt.blockNumber}, TxHash: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    console.error(`Error adding process log for crop ${cropId} on blockchain:`, error.message);
    let detailedMessage = error.message;
    if (error.data && error.data.message) {
        detailedMessage = error.data.message;
    } else if (error.reason) {
        detailedMessage = error.reason;
    }
    console.error("Full error object:", JSON.stringify(error, null, 2));
    throw new Error(`Blockchain transaction failed for adding log to crop ${cropId}: ${detailedMessage}`);
  }
}

module.exports = {
  verifyCropOnBlockchain,
  addProcessLogToBlockchain,
  // You can also export provider, signer, contract if needed elsewhere, but it's generally better to keep interactions via service functions.
};