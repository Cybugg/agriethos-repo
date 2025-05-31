import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28", // Match your contract's pragma
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable the IR pipeline
    },
  },
  networks: {
    hardhat: {
      // Local development network
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "", // For contract verification
  },
  // gasReporter: { // Optional
  //  enabled: process.env.REPORT_GAS !== undefined,
  //  currency: "USD",
  // },
};

export default config;
