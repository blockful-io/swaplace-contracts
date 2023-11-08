import { ethers } from "hardhat";
import { deploy } from "./utils/utils";

async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Deploy in the currrent network and return the Swaplace instance
	const Swaplace = await deploy("Swaplace", signer);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
