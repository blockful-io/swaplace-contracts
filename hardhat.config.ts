import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-chai-matchers'
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
        blockNumber: 15677043,
      },
    },
    // ethereum: {
    //   url: `${ETH}`,
    //   accounts: [`${ETH_ACC_1}`],
    // },
  },
}

export default config
