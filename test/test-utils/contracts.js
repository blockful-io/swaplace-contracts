const { ethers } = require('hardhat')

async function deploy(contractName, signer, ...args) {
  const artifact = await ethers.getContractFactory(contractName, signer)
  return artifact.deploy(...args)
}
module.exports = {
  deploy,
}
