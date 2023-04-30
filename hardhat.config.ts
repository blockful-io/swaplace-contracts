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

const { GOERLI, ETH, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  // gasReporter: {
  //   enabled: true,
  // },
  etherscan: {
    apiKey: "U5CSWDUSV4PWJXAK23SUK6MVITQSVYZXV7",
  },
  networks: {
    hardhat: {
      forking: {
        url: `${ETH}`,
        blockNumber: 16031313,
      },
    },
    goerli: {
      url: `${GOERLI}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
};

export default config;
