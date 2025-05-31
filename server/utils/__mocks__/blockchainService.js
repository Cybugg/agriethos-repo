// filepath: /home/kingtom/Documents/blockchain/agriethos-repo/server/utils/__mocks__/blockchainService.js
const verifyCropOnBlockchain = jest.fn();
const addProcessLogToBlockchain = jest.fn();

// Default mock implementations (can be overridden in tests)
verifyCropOnBlockchain.mockResolvedValue("mock_tx_hash_verify_crop");
addProcessLogToBlockchain.mockResolvedValue("mock_tx_hash_add_log");

module.exports = {
  verifyCropOnBlockchain,
  addProcessLogToBlockchain,
};