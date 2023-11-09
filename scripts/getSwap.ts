import { ethers } from "hardhat";
import abi from "../artifacts/contracts/Swaplace.sol/Swaplace.json";

export async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Get the Swaplace address from .env file
	const swaplaceAddress: string = process.env.SWAPLACE_ADDRESS || "";

	// Get the Swaplace instance
	const Swaplace = new ethers.Contract(swaplaceAddress, abi.abi, signer);

	// Get the swap id
	const swapId = 1;

	// Get the swap
	const swap = await Swaplace.getSwap(swapId);

	// Log the swap
	console.log("\nSwap %: ", swapId);
	console.log(swap);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
