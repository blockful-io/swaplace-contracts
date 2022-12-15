import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Swaplace', async function () {
  async function forkWithAddress(address: any) {
    const signer = await ethers.getImpersonatedSigner(address)
    expect(signer.address).to.be.equal(address)
  }

  const {
    evm: { advanceTime },
    contracts: { deploy },
  } = require('../test-utils')

  before(async () => {
    const signer = await forkWithAddress(
      '0x36cc7b13029b5dee4034745fb4f24034f3f2ffc6',
    )
  })

  it('Should deploy the contract', async function () {
    // let contract = new ethers.Contract(contractAddress, targetAbi, signer)
    // console.log('Success loading contract. Address: ', contract.address)
    // contract.'function'
  })

  it('Should propose a trade', async function () {})

  it('Should propose a trade that gets accepted', async function () {})

  it('Should propose a trade that gets another proposal for it', async function () {})

  it('Should propose tradeA that gets another proposal tradeB. Then ', async function () {})
})
