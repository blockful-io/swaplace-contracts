import { ethers } from 'hardhat'
import { deploy } from '../test/utils/utils'

export async function main() {
    // Get the first account from the list of accounts
    const [signer] = await ethers.getSigners()

    // Deploy in the currrent network and return the contract instance
    const MockERC20 = await deploy('MockERC20', signer)
    const MockERC721 = await deploy('MockERC721', signer)

    // Log Contract address, the Tx then return the Contract instance of MockERC20
    console.log(
        '\nDEPLOY:\nContract %s \nDeployed to %s \nAt Tx %s',
        'MockERC20',
        MockERC20.address,
        MockERC20.deployTransaction.hash
    )

    // Log Contract address, the Tx then return the Contract instance of MockERC721
    console.log(
        '\nContract %s \nDeployed to %s \nAt Tx %s',
        'MockERC721',
        MockERC721.address,
        MockERC721.deployTransaction.hash
    )

    //Mint ERC20 69 tokens
    const amountToMint = ethers.utils.parseUnits('69')
    let mintTo = await MockERC20.mintTo(signer.address, amountToMint)

    // Wait for the transaction to be mined
    await mintTo.wait()

    //Log the signer's ERC20 balance in terms of wei after minting 69 tokens
    console.log(
        '\nMINT:\nERC20 balance of the signer:' +
            (await MockERC20.balanceOf(signer.address))
    )

    //Mint ERC721 token
    const tokenId = 1
    mintTo = await MockERC721.mintTo(signer.address, tokenId)

    // Wait for the transaction to be mined
    await mintTo.wait()

    //Log the owner of the tokenId=1
    console.log('Owner of tokeId 1:' + (await MockERC721.ownerOf(tokenId)))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
