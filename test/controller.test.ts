import { expect } from 'chai'
import { ethers } from 'hardhat'
import { describe, before } from 'mocha'
import {
  Swaplace,
  TypeOneMockERC20,
  TypeOneMockERC721,
  TypeTwoMockERC20,
  TypeTwoMockERC721,
} from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { evm, contracts } from './test-utils'
const deploy = contracts.deploy

describe('Swaplace', async function () {
  interface ERC20Asset {
    addr: any
    amount: any
  }
  interface ERC721Asset {
    addr: any
    tokenId: number
  }
  interface ERC721Options {
    addr: any
    amount: number
  }
  interface Assets {
    erc20: ERC20Asset[]
    erc721: ERC721Asset[]
    erc721Options: ERC721Options[]
  }
  interface Trade {
    tradeIdRef: number
    proposer: any
    timestamp: number
    withdrawAddress: number
    allowedAddresses: any[]
    hashproof: any
    assetsToSend: Assets
    assetsToReceive: Assets
  }

  let mockTokenOne: any
  let mockTokenTwo: any
  let mockNftOne: any
  let mockNftTWo: any

  let swaplace: any
  let connectUserA: any
  let connectUserB: any

  let deployer: SignerWithAddress
  let userA: SignerWithAddress
  let userB: SignerWithAddress
  let receiverA: SignerWithAddress
  let receiverB: SignerWithAddress

  const DAYS = 24 * 60 * 60 // 86,400

  before(async () => {
    deployer = await beAddress('0xa152F8bb749c55E9943A3a0A3111D18ee2B3f94E')
    userA = await beAddress('0x9Bc254355E7b8E3c1D5c0518e04d041A7236aCCf')
    receiverA = await beAddress('0x0BB0636129782924eEb38E9a3Cdaa432Df3786ec')
    userB = await beAddress('0x07B664C8aF37EdDAa7e3b6030ed1F494975e9DFB')
    receiverB = await beAddress('0x187E3534f461d7C59a7d6899a983A5305b48f93F')
    swaplace = await deploy('Swaplace', deployer)
    mockTokenOne = await deploy('TypeOneMockERC20', deployer)
    mockTokenTwo = await deploy('TypeTwoMockERC20', deployer)
    mockNftOne = await deploy('TypeOneMockERC721', deployer)
    mockNftTWo = await deploy('TypeTwoMockERC721', deployer)

    connectUserA = await swaplace.connect(userA)
    connectUserB = await swaplace.connect(userB)

    await mockTokenOne.mintTo(userA.address)
    await mockTokenTwo.mintTo(userB.address)
  })

  it('Should propose a trade sending AssetA, asking for AssetB', async function () {
    const send_erc20_1: ERC20Asset = {
      addr: mockTokenOne.address,
      amount: 10,
    }
    const receive_erc20_1: ERC20Asset = {
      addr: mockTokenTwo.address,
      amount: 20,
    }
    const assetsToSend: Assets = {
      erc20: [send_erc20_1],
      erc721: [],
      erc721Options: [],
    }
    const assetsToReceive: Assets = {
      erc20: [receive_erc20_1],
      erc721: [],
      erc721Options: [],
    }

    let tx = await connectUserA.proposeTrade(
      0,
      DAYS,
      userA.address,
      [],
      assetsToSend,
      assetsToReceive,
    )
    console.log(tx)
  })

  it('Should propose a trade that gets accepted', async function () {})

  it('Should propose a trade that gets another proposal for it', async function () {})

  it('Should propose tradeA that gets another proposal tradeB. Then ', async function () {})

  async function beAddress(address: any) {
    const signer = await ethers.getImpersonatedSigner(address)
    expect(signer.address).to.be.equal(address)
    return signer
  }
})
