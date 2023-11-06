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

// const { MUMBAI, SEPOLIA, PKEY_DEPLOYER, POLYSCAN } = process.env;

const { 
	DEPLOYER_PRIVATE_KEY, 
	TRADE_CREATOR_PRIVATE_KEY, 
	TRADE_ACCEPTEE_PRIVATE_KEY, 
	} = process.env;

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
	},
};

export default config;
