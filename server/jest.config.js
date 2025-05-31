// filepath: /home/kingtom/Documents/blockchain/agriethos-repo/server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.js'], // Global setup file
  clearMocks: true, // Automatically clear mock calls and instances between every test
  testTimeout: 30000, // Increase timeout to 30 seconds (adjust as needed)
};
