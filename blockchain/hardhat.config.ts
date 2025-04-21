import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Local network configuration
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 0
      }
    },
    // Local node configuration
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    // Keep testnet configs for later use
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD"
  }
};

export default config;
