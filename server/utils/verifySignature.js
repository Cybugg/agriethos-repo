const { ethers } = require('ethers');

module.exports = function verifySignature(walletAddress, message, signature) {
  try {
    const recovered = ethers.utils.verifyMessage(message, signature);
    return recovered.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};
