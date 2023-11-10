import { ethers } from "hardhat";
import { blocktimestamp } from "../test/utils/utils";
import { Swap, composeSwap } from "../test/utils/SwapFactory";
import abi from "../artifacts/contracts/Swaplace.sol/Swaplace.json";

export async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Get the Swaplace address from .env file
	const swaplaceAddress: string = process.env.SWAPLACE_ADDRESS || "";

	// Get the Swaplace instance
	const Swaplace = new ethers.Contract(swaplaceAddress, abi.abi, signer);

	// Fill the Swap struct
	const owner = signer.address;
	const allowed = ethers.constants.AddressZero;
	const expiry = (await blocktimestamp()* 2);

	// Build the biding assets
	const bidingAddr = ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]; // USDC
	const bidingAmountOrId = [1000];

	// Build the asking assets
	const askingAddr = ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"]; // WBTC
	const askingAmountOrId = [1];

	// Compose the swap
	const swap: Swap = await composeSwap(
		owner,
		allowed,
		expiry,
		bidingAddr,
		bidingAmountOrId,
		askingAddr,
		askingAmountOrId
	);

	// Create the swap
	const tx = await Swaplace.createSwap(swap);

	// Wait for the transaction to be mined
	await tx.wait();

	// Log the transaction hash
	console.log("\nTransaction Hash: ", tx);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
