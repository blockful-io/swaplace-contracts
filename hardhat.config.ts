import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-gas-reporter";
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const TRADE_CREATOR_PRIVATE_KEY = process.env.TRADE_CREATOR_PRIVATE_KEY || "";
const TRADE_ACCEPTEE_PRIVATE_KEY = process.env.TRADE_ACCEPTEE_PRIVATE_KEY || "";

// const { MUMBAI, SEPOLIA, PKEY_DEPLOYER, POLYSCAN } = process.env;

const config: HardhatUserConfig = {
	solidity: "0.8.17",
	defaultNetwork: "hardhat",
	// gasReporter: {
	//   enabled: true,
	// },
	// etherscan: {
	// 	apiKey: `${POLYSCAN}`,
	// },
	networks: {
		// hardhat: {
		//   forking: {
		//     url: `${ETH}`,
		//     blockNumber: 16031313,
		//   },
		// },
		// mumbai: {
		// 	url: `${MUMBAI}`,
		// 	accounts: [`${PKEY_DEPLOYER}`],
		// },
		// sepolia: {
		// 	url: `${SEPOLIA}`,
		// 	accounts: [`${PKEY_DEPLOYER}`],
		// },
		
	BNB: {
		url: process.env.BNB,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	MATIC: {
		url: process.env.MATIC,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	ETH: {
		url: process.env.ETH,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	AVAX: {
		url: process.env.AVAX,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	FTM: {
		url: process.env.FTM,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	ASTR: {
		url: process.env.ASTR,
		accounts: [DEPLOYER_PRIVATE_KEY, TRADE_CREATOR_PRIVATE_KEY, TRADE_ACCEPTEE_PRIVATE_KEY],
	},

	},
};

export default config;
