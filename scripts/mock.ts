import {ethers} from "hardhat";
import { deploy } from "../test/utils/utils";


export async function main() {
    // Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

    // Deploy in the currrent network and return the contract instance
	const MockERC20 = await deploy("MockERC20", signer);
    const MockERC721 = await deploy("MockERC721", signer);

    // Log Contract address, the Tx then return the Contract instance of MockERC20
	console.log(
		"\nContract %s \nDeployed to %s \nAt Tx %s",
		"MockERC20",
		MockERC20.address,
		MockERC20.deployTransaction.hash
	);

    // Log Contract address, the Tx then return the Contract instance of MockERC721
	console.log(
		"\nContract %s \nDeployed to %s \nAt Tx %s",
		"MockERC721",
		MockERC721.address,
		MockERC721.deployTransaction.hash
	);

    //Mint ERC20 1000000 tokens
    const amountToMint = ethers.utils.parseUnits('1000000', 18);
    const mintTo=await MockERC20.mintTo(signer,amountToMint);
    console.log("ERC20 balance of the signer:"+await MockERC20.balanceOf(signer));

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});