const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;
require('dotenv').config();

async function addServiceWalletAsReviewer() {
  try {
    const RPC_URL = process.env.SEPOLIA_RPC_URL;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY; // Contract owner's private key
    
    if (!RPC_URL || !CONTRACT_ADDRESS || !OWNER_PRIVATE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AgriEthosProductLedgerABI, ownerSigner);
    
    // The service wallet address that needs to be authorized
    const serviceWalletAddress = "0x2Ed32Af34d80ADB200592e7e0bD6a3F761677591";
    
    console.log(`Adding service wallet ${serviceWalletAddress} as authorized reviewer...`);
    console.log(`Using owner wallet: ${ownerSigner.address}`);
    console.log(`Contract address: ${CONTRACT_ADDRESS}`);
    
    // Check if already authorized
    const isAuthorized = await contract.authorizedReviewers(serviceWalletAddress);
    if (isAuthorized) {
      console.log(`Service wallet ${serviceWalletAddress} is already authorized!`);
      return;
    }
    
    // Add the reviewer
    const tx = await contract.addReviewer(serviceWalletAddress);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Service wallet ${serviceWalletAddress} successfully added as authorized reviewer!`);
    console.log(`Transaction confirmed: ${receipt.hash}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    
    // Verify the addition
    const isNowAuthorized = await contract.authorizedReviewers(serviceWalletAddress);
    console.log(`Verification: Is now authorized? ${isNowAuthorized}`);
    
  } catch (error) {
    console.error('Error adding service wallet as reviewer:', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
  }
}

// Run the script
addServiceWalletAsReviewer();