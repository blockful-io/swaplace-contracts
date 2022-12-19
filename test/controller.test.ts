import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import { describe, before } from 'mocha'
import { evm, contracts } from './test-utils'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Swaplace, MockERC20, MockERC721 } from '../typechain-types'
import { abi as abiERC20 } from '../artifacts/contracts/mock/MockERC20.sol/MockERC20.json'
import { abi as abiERC721 } from '../artifacts/contracts/mock/MockERC721.sol/MockERC721.json'
import { moveMessagePortToContext } from 'worker_threads'
const deploy = contracts.deploy

describe('Swaplace', async function () {
  interface ERC20Asset {
    addr: any
    amountOrId: any
  }
  interface ERC721Asset {
    addr: any
    amountOrId: number
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

  interface MockList {
    contractAddress: string
    contractName: string
  }
  let mockList: MockList[] = []

  let deployer: SignerWithAddress
  let userA: SignerWithAddress
  let userB: SignerWithAddress
  let receiverA: SignerWithAddress
  let receiverB: SignerWithAddress

  let swaplace: any
  let connectUserA: any
  let connectUserB: any

  const DAYS = 24 * 60 * 60 // 86,400

  before(async () => {
    deployer = await beAddress('0xa152F8bb749c55E9943A3a0A3111D18ee2B3f94E')
    userA = await beAddress('0x9Bc254355E7b8E3c1D5c0518e04d041A7236aCCf')
    userB = await beAddress('0x07B664C8aF37EdDAa7e3b6030ed1F494975e9DFB')
    receiverA = await beAddress('0x0BB0636129782924eEb38E9a3Cdaa432Df3786ec')
    receiverB = await beAddress('0x187E3534f461d7C59a7d6899a983A5305b48f93F')

    swaplace = await deploy('Swaplace', deployer)
    connectUserA = await swaplace.connect(userA)
    connectUserB = await swaplace.connect(userB)
  })

  // This function is used to impersonate an address
  // and return the signer of that address
  // @param address - The address to be impersonated
  async function beAddress(address: any) {
    const signer = await ethers.getImpersonatedSigner(address)
    expect(signer.address).to.be.equal(address)
    return signer
  }

  // This function is used to get a random number
  // between a min and max number
  // @param min - The minimum number
  async function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  // Basically, whoever calls this function will request the deployer
  // to deploy a mock based on the type, while also minting to the
  // signer's address and returning the interface of Asset based on type.
  // This creates the assets to be sent or received and mint those assets
  // to the account that will send them.
  // @param signer - The signer that will send the assets
  // @param contractName - The name of the contract to be deployed
  // @param type - The type of the contract to be deployed
  // @param amountOrId - The amount or id of the asset to be minted based on type
  async function getMockAssetsToSendOrReceive(
    signer: SignerWithAddress,
    contractName: string,
    type: string,
    amountOrId: number,
  ): Promise<ERC20Asset | ERC721Asset> {
    // check which type we'll be hanadling
    if (type.toUpperCase() !== 'ERC20' && type.toUpperCase() !== 'ERC721') {
      throw new Error('Invalid type')
    }

    let abi = type.toUpperCase() === 'ERC20' ? abiERC20 : abiERC721
    let factoryName =
      type.toUpperCase() === 'ERC20' ? 'MockERC20' : 'MockERC721'

    // Try to find the contract in the mockList
    let findContract = mockList.find(
      (mock) => mock.contractName === contractName,
    )

    // if the contract is not found, deploy it and mint to the user
    let mockContract: any
    if (!findContract) {
      // get a random number to use as the contract symbol
      let contractSymbol = (await getRandomArbitrary(100, 9999999)).toString()
      // deploy the contract and mint to the receiver
      mockContract = await deploy(
        factoryName,
        deployer,
        contractName,
        contractSymbol,
      )
    } else {
      // if the contract already exists, we fetch the instance
      mockContract = new ethers.Contract(factoryName, abi, deployer)
    }

    // then we connect to the contract with the signer requesting the assets
    const mockConnection = mockContract.connect(signer)

    // mint to the signer's address
    await mockConnection.mintTo(
      signer.address,
      type.toUpperCase() === 'ERC20'
        ? ethers.utils.parseUnits(amountOrId.toString(), 18)
        : amountOrId,
    )

    // add the contract to the mockList
    mockList.push({
      contractAddress: mockConnection.address,
      contractName: contractName,
    })

    // return the assets to be sent or received
    if (type.toUpperCase() === 'ERC20') {
      let asset_erc20: ERC20Asset = {
        addr: mockConnection.address,
        amountOrId: ethers.utils.parseUnits(amountOrId.toString(), 18),
      }
      return asset_erc20
    } else if (type.toUpperCase() === 'ERC721') {
      let asset_erc721: ERC721Asset = {
        addr: mockConnection.address,
        amountOrId: amountOrId,
      }
      return asset_erc721
    }

    throw new Error('Impossible error happened')
  }

  // This will grant allowance for the Assets to be sent to the swaplace contract
  // @params assets: Assets
  // @params user: SignerWithAddress
  async function allowanceOfAssets(assets: Assets, user: SignerWithAddress) {
    for (let i = 0; i < assets.erc20.length; i++) {
      const contract = new ethers.Contract(assets.erc20[i].addr, abiERC20, user)
      let tx = await contract.approve(
        swaplace.address,
        assets.erc20[i].amountOrId,
      )
      expect(tx).to.not.be.reverted
    }
    for (let i = 0; i < assets.erc721.length; i++) {
      const contract = new ethers.Contract(
        assets.erc721[i].addr,
        abiERC20,
        user,
      )
      let tx = await contract.approve(
        swaplace.address,
        assets.erc721[i].amountOrId,
      )
      expect(tx).to.not.be.reverted
    }
    for (let i = 0; i < assets.erc721Options.length; i++) {
      const contract = new ethers.Contract(
        assets.erc721Options[i].addr,
        abiERC20,
        user,
      )
      let tx = await contract.approve(
        swaplace.address,
        assets.erc20[i].amountOrId,
      )
      expect(tx).to.not.be.reverted
    }
  }

  it('Should propose a trade sending AssetA, asking for AssetB', async function () {
    // Preparation of Trade Proposal
    let send_erc20: ERC20Asset = await getMockAssetsToSendOrReceive(
      userA,
      'TokenA',
      'erc20',
      10,
    )
    let receive_erc20 = await getMockAssetsToSendOrReceive(
      userB,
      'TokenB',
      'erc20',
      50,
    )
    let assetsToBid: Assets = {
      erc20: [send_erc20],
      erc721: [],
      erc721Options: [],
    }
    let assetsToAsk: Assets = {
      erc20: [receive_erc20],
      erc721: [],
      erc721Options: [],
    }

    // Allowance for the amount to be transfered
    allowanceOfAssets(assetsToBid, userA)
    allowanceOfAssets(assetsToAsk, userB)

    // Propose Trade
    let tx = await connectUserA.proposeTrade(
      0, // tradeRefId -> 0 because there is no other trades
      DAYS, // expirationDate
      userA.address, // withdrawAddress
      [], // allowedAddress list, only those listed can accept the trade
      assetsToBid,
      assetsToAsk,
    )
    await expect(tx)
      .to.emit(swaplace, 'TradeProposed')
      .withArgs(1, 0, DAYS, userA.address, userA.address, [])

    // Accept Trade
    tx = await connectUserB.acceptTrade(
      1, // trade id for which the trade will be accepted
      assetsToAsk,
      userB.address, // the withdraw address for the trade
      0, // the index of allowance in case the trade has an allowedAddress list
      [], // the token idsOptions asked by the trace creator
    )
    await expect(tx)
      .to.emit(swaplace, 'TradeAccepted')
      .withArgs(1, userB.address, userB.address)
  })

  it('Should propose a trade that gets accepted', async function () {})

  it('Should propose a trade that gets another proposal for it', async function () {})

  it('Should propose tradeA that gets another proposal tradeB. Then ', async function () {})
})
