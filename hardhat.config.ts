import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const {
	DEPLOYER_PRIVATE_KEY,
	SWAP_CREATOR_PRIVATE_KEY,
	SWAP_ACCEPTEE_PRIVATE_KEY,
} = process.env;

const config: HardhatUserConfig = {
	solidity: "0.8.17",
	defaultNetwork: "hardhat",
	gasReporter: {
		enabled: true,
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
	},
};

export default config;
