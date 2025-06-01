const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const SIGNER_KEY = process.env.SIGNER_PRIVATE_KEY;
const LEDGER_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

let provider;
let signer;
let contract;

console.log("🔧 BLOCKCHAIN DEBUG: Starting blockchain service initialization...");
console.log("🔧 BLOCKCHAIN DEBUG: Environment variables check:");
console.log(`  - SEPOLIA_RPC_URL: ${RPC_URL ? '✅ SET' : '❌ MISSING'}`);
console.log(`  - SIGNER_PRIVATE_KEY: ${SIGNER_KEY ? '✅ SET' : '❌ MISSING'}`);
console.log(`  - CONTRACT_ADDRESS: ${LEDGER_CONTRACT_ADDRESS ? '✅ SET' : '❌ MISSING'}`);

if (!RPC_URL || !SIGNER_KEY || !LEDGER_CONTRACT_ADDRESS) {
  console.error("❌ BLOCKCHAIN DEBUG: CRITICAL ERROR - Missing required blockchain environment variables");
  console.error("❌ BLOCKCHAIN DEBUG: Blockchain features will be disabled");
} else {
  try {
    console.log("🔧 BLOCKCHAIN DEBUG: Creating provider...");
    provider = new ethers.JsonRpcProvider(RPC_URL);
    
    console.log("🔧 BLOCKCHAIN DEBUG: Creating signer...");
    signer = new ethers.Wallet(SIGNER_KEY, provider);
    
    console.log("🔧 BLOCKCHAIN DEBUG: Creating contract instance...");
    contract = new ethers.Contract(LEDGER_CONTRACT_ADDRESS, AgriEthosProductLedgerABI, signer);
    
    console.log(`✅ BLOCKCHAIN DEBUG: Blockchain service initialized successfully!`);
    console.log(`✅ BLOCKCHAIN DEBUG: Connected to contract at ${LEDGER_CONTRACT_ADDRESS}`);
    console.log(`✅ BLOCKCHAIN DEBUG: Using signer address: ${signer.address}`);
  } catch (e) {
    console.error("❌ BLOCKCHAIN DEBUG: CRITICAL ERROR during initialization:", e.message);
    console.error("❌ BLOCKCHAIN DEBUG: Full error:", e);
    provider = null;
    signer = null;
    contract = null;
  }
}

async function verifyCropOnBlockchain(cropDetails) {
  console.log("🚀 BLOCKCHAIN DEBUG: verifyCropOnBlockchain called with:", {
    cropId: cropDetails.cropId,
    farmWalletAddress: cropDetails.farmWalletAddress,
    cropType: cropDetails.cropType,
    hasGeographicOrigin: !!cropDetails.geographicOrigin,
    hasFarmingMethods: !!cropDetails.farmingMethods
  });

  if (!contract || !signer || !provider) {
    console.error("❌ BLOCKCHAIN DEBUG: Service not initialized - contract, signer, or provider is null");
    throw new Error("Blockchain service is not initialized. Check server logs for errors.");
  }

  try {
    console.log(`🔧 BLOCKCHAIN DEBUG: Checking signer balance...`);
    const balance = await provider.getBalance(signer.address);
    console.log(`🔧 BLOCKCHAIN DEBUG: Signer balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance === 0n) {
      console.error("❌ BLOCKCHAIN DEBUG: Signer has no ETH for gas fees!");
    }

    console.log(`🔧 BLOCKCHAIN DEBUG: Checking if signer is authorized reviewer...`);
    const isAuthorized = await contract.authorizedReviewers(signer.address);
    console.log(`🔧 BLOCKCHAIN DEBUG: Signer authorized: ${isAuthorized}`);
    
    if (!isAuthorized) {
      console.error("❌ BLOCKCHAIN DEBUG: Signer is not an authorized reviewer on the contract!");
    }

    console.log(`🚀 BLOCKCHAIN DEBUG: Attempting to verify crop on blockchain: ${cropDetails.cropId}`);
    console.log(`🚀 BLOCKCHAIN DEBUG: Contract function parameters:`, {
      _cropId: cropDetails.cropId,
      _farmId: cropDetails.farmWalletAddress,
      _cropType: cropDetails.cropType,
      _farmingMethods: cropDetails.farmingMethods,
      _harvestDate: cropDetails.harvestDateTimestamp,
      _geographicOrigin: cropDetails.geographicOrigin
    });

    const tx = await contract.verifyAndStoreCrop(
      cropDetails.cropId,
      cropDetails.farmWalletAddress,
      cropDetails.cropType,
      cropDetails.farmingMethods,
      cropDetails.harvestDateTimestamp,
      cropDetails.geographicOrigin
    );

    console.log(`✅ BLOCKCHAIN DEBUG: Transaction sent for crop verification ${cropDetails.cropId}`);
    console.log(`✅ BLOCKCHAIN DEBUG: Transaction hash: ${tx.hash}`);
    console.log(`🔧 BLOCKCHAIN DEBUG: Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    
    console.log(`🎉 BLOCKCHAIN DEBUG: Transaction confirmed for crop ${cropDetails.cropId}!`);
    console.log(`🎉 BLOCKCHAIN DEBUG: Block number: ${receipt.blockNumber}`);
    console.log(`🎉 BLOCKCHAIN DEBUG: Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`🎉 BLOCKCHAIN DEBUG: Final transaction hash: ${receipt.hash}`);
    console.log(`🔗 BLOCKCHAIN DEBUG: View on Etherscan: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    
    return receipt.hash;
  } catch (error) {
    console.error(`❌ BLOCKCHAIN DEBUG: Error verifying crop ${cropDetails.cropId} on blockchain`);
    console.error(`❌ BLOCKCHAIN DEBUG: Error message: ${error.message}`);
    console.error(`❌ BLOCKCHAIN DEBUG: Error code: ${error.code}`);
    
    let detailedMessage = error.message;
    if (error.data && error.data.message) {
      console.error(`❌ BLOCKCHAIN DEBUG: Contract revert reason: ${error.data.message}`);
      detailedMessage = error.data.message;
    } else if (error.reason) {
      console.error(`❌ BLOCKCHAIN DEBUG: Error reason: ${error.reason}`);
      detailedMessage = error.reason;
    }
    
    console.error("❌ BLOCKCHAIN DEBUG: Full error object:", JSON.stringify(error, null, 2));
    throw new Error(`Blockchain transaction failed for crop ${cropDetails.cropId}: ${detailedMessage}`);
  }
}

async function addProcessLogToBlockchain(cropId, stage, description, location, additionalData) {
  console.log("🚀 BLOCKCHAIN DEBUG: addProcessLogToBlockchain called with:", {
    cropId,
    stage,
    description: description?.substring(0, 50) + '...',
    location,
    additionalDataLength: additionalData?.length || 0
  });

  if (!contract || !signer || !provider) {
    console.error("❌ BLOCKCHAIN DEBUG: Service not initialized for process logging");
    throw new Error("Blockchain service is not initialized. Check server logs for errors.");
  }

  try {
    console.log(`🔧 BLOCKCHAIN DEBUG: Checking if crop ${cropId} exists on blockchain...`);
    const product = await contract.products(cropId);
    console.log(`🔧 BLOCKCHAIN DEBUG: Product verified status: ${product.isVerified}`);
    
    if (!product.isVerified) {
      console.error(`❌ BLOCKCHAIN DEBUG: Crop ${cropId} is not verified on blockchain!`);
      throw new Error(`Crop ${cropId} is not verified on blockchain`);
    }

    console.log(`🔧 BLOCKCHAIN DEBUG: Checking signer balance for process log...`);
    const balance = await provider.getBalance(signer.address);
    console.log(`🔧 BLOCKCHAIN DEBUG: Signer balance: ${ethers.formatEther(balance)} ETH`);

    console.log(`🚀 BLOCKCHAIN DEBUG: Attempting to add process log for crop: ${cropId}, stage: ${stage}`);
    
    const tx = await contract.addProcessLog(
      cropId,
      stage,
      description,
      location,
      additionalData
    );

    console.log(`✅ BLOCKCHAIN DEBUG: Process log transaction sent for crop ${cropId}`);
    console.log(`✅ BLOCKCHAIN DEBUG: Transaction hash: ${tx.hash}`);
    console.log(`🔧 BLOCKCHAIN DEBUG: Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    
    console.log(`🎉 BLOCKCHAIN DEBUG: Process log transaction confirmed for crop ${cropId}!`);
    console.log(`🎉 BLOCKCHAIN DEBUG: Block number: ${receipt.blockNumber}`);
    console.log(`🎉 BLOCKCHAIN DEBUG: Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`🔗 BLOCKCHAIN DEBUG: View on Etherscan: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    
    return receipt.hash;
  } catch (error) {
    console.error(`❌ BLOCKCHAIN DEBUG: Error adding process log for crop ${cropId}`);
    console.error(`❌ BLOCKCHAIN DEBUG: Error message: ${error.message}`);
    
    let detailedMessage = error.message;
    if (error.data && error.data.message) {
      console.error(`❌ BLOCKCHAIN DEBUG: Contract revert reason: ${error.data.message}`);
      detailedMessage = error.data.message;
    } else if (error.reason) {
      console.error(`❌ BLOCKCHAIN DEBUG: Error reason: ${error.reason}`);
      detailedMessage = error.reason;
    }
    
    console.error("❌ BLOCKCHAIN DEBUG: Full error object:", JSON.stringify(error, null, 2));
    throw new Error(`Blockchain transaction failed for adding log to crop ${cropId}: ${detailedMessage}`);
  }
}

module.exports = {
  verifyCropOnBlockchain,
  addProcessLogToBlockchain,
};