const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;
require('dotenv').config();

async function addSpecificReviewer() {
  try {
    const RPC_URL = process.env.SEPOLIA_RPC_URL;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
    
    if (!RPC_URL || !CONTRACT_ADDRESS || !OWNER_PRIVATE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AgriEthosProductLedgerABI, ownerSigner);
    
    // The specific wallet address to add as reviewer
    const reviewerWalletAddress = "0x6542034145F96b8F244716F37Cd0e337D1fCDa08";
    
    console.log(`Adding wallet ${reviewerWalletAddress} as authorized reviewer...`);
    console.log(`Using owner wallet: ${ownerSigner.address}`);
    console.log(`Contract address: ${CONTRACT_ADDRESS}`);
    
    // Check if already authorized
    const isAuthorized = await contract.authorizedReviewers(reviewerWalletAddress);
    if (isAuthorized) {
      console.log(`Wallet ${reviewerWalletAddress} is already authorized!`);
      return;
    }
    
    // Add the reviewer
    const tx = await contract.addReviewer(reviewerWalletAddress);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Wallet ${reviewerWalletAddress} successfully added as authorized reviewer!`);
    console.log(`Transaction confirmed: ${receipt.hash}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    
    // Verify the addition
    const isNowAuthorized = await contract.authorizedReviewers(reviewerWalletAddress);
    console.log(`Verification: Is now authorized? ${isNowAuthorized}`);
    
  } catch (error) {
    console.error('Error adding reviewer:', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
  }
}

// Run the script
addSpecificReviewer();