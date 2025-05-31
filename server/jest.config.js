// filepath: /home/kingtom/Documents/blockchain/agriethos-repo/server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.js'], // Global setup file
  clearMocks: true, // Automatically clear mock calls and instances between every test
  // You might want to add a test timeout if blockchain operations (even mocked) take time
  // testTimeout: 30000, // 30 seconds
};
