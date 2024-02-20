import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-docgen";
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  networks: {
    /**
     * @dev Testnets
     */
    sepolia: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    mumbai: {
      url: `${process.env.MUMBAI_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    /**
     * @dev Mainnets
     */
    ethereum: {
      url: `${process.env.ETH_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    polygon: {
      url: `${process.env.MATIC_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    /**
     * @dev Localnet (Hardhat)
     */
    hardhat: {
      chainId: 31337,
      forking: {
        url: `${process.env.SEPOLIA_RPC_URL}`,
        blockNumber: 5328000,
      },
    },
  },
  defaultNetwork: "hardhat",
  docgen: {
    outputDir: "docs/solidity-docgen",
    pages: "files",
  },
  gasReporter: {
    enabled: true,
  },
  allowUnlimitedContractSize: true,
};

export default config;
