import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-chai-matchers'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-truffle5'
import 'hardhat-gas-reporter'
import dotenv from 'dotenv'
dotenv.config()

const { ETH_MAINNET_ALCHEMY } = process.env

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      forking: {
        url: `${ETH_MAINNET_ALCHEMY}`,
        blockNumber: 16031313,
      },
    },
    // ethereum: {
    //   url: `${ETH}`,
    //   accounts: [`${ETH_ACC_1}`],
    // },
  },
}

export default config
