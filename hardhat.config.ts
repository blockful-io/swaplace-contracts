import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-docgen";
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  networks: {
    /**
     * @dev Testnets
     */
    sepolia: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [
        `${
          process.env.DEPLOYER_PRIVATE_KEY
            ? process.env.DEPLOYER_PRIVATE_KEY
            : DEPLOYER_PRIVATE_KEY
        }`,
      ],
    },
    goerli: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    mumbai: {
      url: `${process.env.MUMBAI_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    fuji: {
      url: `${process.env.FUJI_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    bnbtest: {
      url: `${process.env.BNB_TESTNET_RPC_URL}`,
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
    avalanche: {
      url: `${process.env.AVAX_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    binance: {
      url: `${process.env.BNB_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    fantom: {
      url: `${process.env.FTM_RPC_URL}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
  },
  defaultNetwork: "hardhat",
  docgen: {
    outputDir: "docs",
    pages: "files",
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
