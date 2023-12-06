import { ethers } from 'hardhat'
import abiERC20 from '../artifacts/contracts/mock/MockERC20.sol/MockERC20.json'
import abiERC721 from '../artifacts/contracts/mock/MockERC721.sol/MockERC721.json'

export async function main() {
    // Get the first account from the list of accounts
    const [signer, owner, acceptee] = await ethers.getSigners()

    // Get the mockERC20 address from .env file
    const mockERC20Address: string = process.env.MOCKERC20_ADDRESS || ''

    // Get the mockERC721 address from .env file
    const mockERC721Address: string = process.env.MOCKERC721_ADDRESS || ''

    // Get the mockERC20 instance
    const mockERC20 = new ethers.Contract(
        mockERC20Address,
        abiERC20.abi,
        signer
    )

    // Get the mockERC721 instance
    const mockERC721 = new ethers.Contract(
        mockERC721Address,
        abiERC721.abi,
        signer
    )

    //approve ERC20 tokens to the acceptee
    let approve = await mockERC20.connect(owner).approve(acceptee.address, 1000)

    // Wait for the transaction to be mined
    let tx = await approve.wait()

    // Log the transaction hash
    console.log('\nTransaction Hash: ', tx)

    //log the allowance of the acceptee
    console.log(
        'Allowed amount by the owner to acceptee:' +
            (await mockERC20.allowance(owner.address, acceptee.address))
    )

    //approve token ID 1 to acceptee
    const tokenId = 1
    tx = await mockERC721.connect(owner).approve(acceptee.address, tokenId)

    // Log the transaction hash
    console.log('\nTransaction Hash: ', tx)

    //log the approved address of token ID 1
    console.log(
        'Approved address of token ID 1:' +
            (await mockERC721.getApproved(tokenId))
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
