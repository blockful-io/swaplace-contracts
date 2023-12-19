import { ethers } from "hardhat"
import { ERC20ABI } from "../test/utils/utils";

export async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Get the Swaplace address from .env file
	const swaplaceAddress: string = process.env.SWAPLACE_ADDRESS || "";

    // Get the token contract, replace to the token that you want approve
    const tokenContract = '';

	// Get the token instance
	const Token = new ethers.Contract(tokenContract, ERC20ABI, signer);

    // Get the value to approve token, replace to value that you need
    const valueApproveToken = BigInt(99999 * (10**18));
    
	// Make the approve
	const tx = Token.approve(swaplaceAddress, valueApproveToken)

	// Wait for the transaction to be mined
	await tx.wait();

	// Log the transaction hash
	console.log("\nTransaction Hash: ", tx);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
