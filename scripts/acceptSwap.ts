import { ethers } from "hardhat";
import abi from "../artifacts/contracts/Swaplace.sol/Swaplace.json";

export async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Get the Swaplace address from .env file
	const swaplaceAddress: string = process.env.SWAPLACE_ADDRESS || "";

	// Get the Swaplace instance
	const Swaplace = new ethers.Contract(swaplaceAddress, abi.abi, signer);

	// Get the swap id to be accepted
	const swapId = 1;

	// Accept the swap
	const tx = await Swaplace.acceptSwap(swapId);

	// Wait for the transaction to be mined
	await tx.wait();

	// Log the transaction hash
	console.log("\nTransaction Hash: ", tx);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
