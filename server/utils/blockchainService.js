const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;

// Enhanced debugging
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SEPOLIA_RPC_URL exists:', !!process.env.SEPOLIA_RPC_URL);
console.log('SEPOLIA_RPC_URL value:', process.env.SEPOLIA_RPC_URL?.substring(0, 50) + '...');
console.log('SIGNER_PRIVATE_KEY exists:', !!process.env.SIGNER_PRIVATE_KEY);
console.log('SIGNER_PRIVATE_KEY length:', process.env.SIGNER_PRIVATE_KEY?.length);
console.log('CONTRACT_ADDRESS exists:', !!process.env.CONTRACT_ADDRESS);
console.log('CONTRACT_ADDRESS value:', process.env.CONTRACT_ADDRESS);
console.log('=== END DEBUG ===');

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
  console.log('=== BLOCKCHAIN SERVICE: verifyCropOnBlockchain CALLED ===');
  
  if (!contract || !signer || !provider) {
    console.error('❌ BLOCKCHAIN SERVICE: Not initialized');
    console.error(`Provider: ${provider ? 'Connected' : 'Not connected'}`);
    console.error(`Signer: ${signer ? 'Connected' : 'Not connected'}`);
    console.error(`Contract: ${contract ? 'Connected' : 'Not connected'}`);
    throw new Error("Blockchain service is not initialized. Check server logs for errors.");
  }
  
  try {
    console.log(`🔄 BLOCKCHAIN SERVICE: Attempting to verify crop on blockchain: ${cropDetails.cropId}`);
    
    // Enhanced validation logging
    console.log('=== VALIDATING CROP DETAILS ===');
    const validationChecks = {
      farmerWalletAddress: !!cropDetails.farmerWalletAddress,
      cropId: !!cropDetails.cropId,
      cropType: !!cropDetails.cropType,
      farmingMethods: !!cropDetails.farmingMethods,
      harvestDateTimestamp: cropDetails.harvestDateTimestamp !== undefined,
      geographicOrigin: !!cropDetails.geographicOrigin
    };
    
    console.log('Validation Results:', validationChecks);
    
    const failedValidations = Object.entries(validationChecks)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (failedValidations.length > 0) {
      console.error(`❌ VALIDATION FAILED: Missing required crop details: ${failedValidations.join(', ')}`);
      throw new Error(`Missing required crop details for blockchain verification: ${failedValidations.join(', ')}`);
    }
    
    console.log('✅ VALIDATION PASSED: All required crop details present');

    console.log('=== PREPARING BLOCKCHAIN TRANSACTION ===');
    const placeholderFarmAddress = await signer.getAddress();
    console.log(`Signer Address (Placeholder Farm Address): ${placeholderFarmAddress}`);
    
    console.log('Contract Parameters:');
    console.log(`  _cropId: ${cropDetails.cropId}`);
    console.log(`  _farmId: ${placeholderFarmAddress}`);
    console.log(`  _cropType: ${cropDetails.cropType}`);
    console.log(`  _farmingMethods length: ${cropDetails.farmingMethods.length} chars`);
    console.log(`  _harvestDate: ${cropDetails.harvestDateTimestamp}`);
    console.log(`  _geographicOrigin: ${cropDetails.geographicOrigin}`);
    
    console.log('🚀 BLOCKCHAIN SERVICE: Sending transaction to contract...');
    
    const tx = await contract.verifyAndStoreCrop(
      cropDetails.cropId,
      placeholderFarmAddress,
      cropDetails.cropType,
      cropDetails.farmingMethods,
      cropDetails.harvestDateTimestamp,
      cropDetails.geographicOrigin
    );

    console.log(`📤 TRANSACTION SENT: ${tx.hash}`);
    console.log(`Gas Limit: ${tx.gasLimit?.toString() || 'N/A'}`);
    console.log(`Gas Price: ${tx.gasPrice?.toString() || 'N/A'}`);
    console.log(`Nonce: ${tx.nonce || 'N/A'}`);
    console.log('⏳ Waiting for transaction confirmation...');
    
    const receipt = await tx.wait();
    
    console.log('=== TRANSACTION CONFIRMED ===');
    console.log(`✅ SUCCESS: Crop ${cropDetails.cropId} verified on blockchain`);
    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Transaction Hash: ${receipt.hash}`);
    console.log(`Gas Used: ${receipt.gasUsed?.toString() || 'N/A'}`);
    console.log(`Effective Gas Price: ${receipt.effectiveGasPrice?.toString() || 'N/A'}`);
    console.log(`Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
    
    if (receipt.logs && receipt.logs.length > 0) {
      console.log(`Event Logs Count: ${receipt.logs.length}`);
      receipt.logs.forEach((log, index) => {
        console.log(`  Log ${index}:`, log.topics);
      });
    }
    
    console.log('=== BLOCKCHAIN SERVICE COMPLETED SUCCESSFULLY ===');
    return receipt.hash;
    
  } catch (error) {
    console.error('=== BLOCKCHAIN SERVICE ERROR ===');
    console.error(`❌ CROP ID: ${cropDetails.cropId}`);
    console.error(`❌ ERROR TYPE: ${error.constructor.name}`);
    console.error(`❌ ERROR MESSAGE: ${error.message}`);
    
    // Enhanced error logging
    if (error.data) {
      console.error(`❌ ERROR DATA:`, JSON.stringify(error.data, null, 2));
    }
    
    if (error.reason) {
      console.error(`❌ ERROR REASON: ${error.reason}`);
    }
    
    if (error.code) {
      console.error(`❌ ERROR CODE: ${error.code}`);
    }
    
    if (error.transaction) {
      console.error(`❌ FAILED TRANSACTION:`, JSON.stringify(error.transaction, null, 2));
    }
    
    if (error.receipt) {
      console.error(`❌ TRANSACTION RECEIPT:`, JSON.stringify(error.receipt, null, 2));
    }
    
    // Network/Provider specific errors
    if (error.network) {
      console.error(`❌ NETWORK ERROR:`, error.network);
    }
    
    console.error(`❌ FULL ERROR OBJECT:`, JSON.stringify(error, null, 2));
    console.error(`❌ ERROR STACK:`, error.stack);
    
    let detailedMessage = error.message;
    if (error.data && error.data.message) {
        detailedMessage = error.data.message;
    } else if (error.reason) {
        detailedMessage = error.reason;
    }
    
    console.error('=== END BLOCKCHAIN SERVICE ERROR ===');
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