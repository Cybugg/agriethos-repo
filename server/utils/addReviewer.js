const { ethers } = require('ethers');
const AgriEthosProductLedgerABI = require('../abi/AgriEthosProductLedger.json').abi;

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY; // Contract owner's private key
const LEDGER_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function addReviewerToContract(reviewerAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(LEDGER_CONTRACT_ADDRESS, AgriEthosProductLedgerABI, ownerSigner);
    
    console.log(`Adding reviewer ${reviewerAddress} to smart contract...`);
    
    const tx = await contract.addReviewer(reviewerAddress);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Reviewer ${reviewerAddress} added successfully. TxHash: ${receipt.hash}`);
    
    return receipt.hash;
  } catch (error) {
    console.error(`Error adding reviewer:`, error.message);
    throw error;
  }
}

// Add the current service wallet as an authorized reviewer
async function main() {
  const serviceWalletAddress = "0x2Ed32Af34d80ADB200592e7e0bD6a3F761677591";
  await addReviewerToContract(serviceWalletAddress);
}

// Run this script once to authorize the service wallet
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addReviewerToContract };