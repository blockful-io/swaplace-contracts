import { ethers } from "hardhat";
import { deploy } from "../test/utils/utils";

async function main() {
	// Get the first account from the list of accounts
	const [signer] = await ethers.getSigners();

	// Deploy in the currrent network and return the Swaplace instance
	const Swaplace = await deploy("Swaplace", signer);

	// Log Contract address, the Tx then return the Contract instance
	console.log(
		"\nContract %s \nDeployed to %s \nAt Tx %s",
		"Swaplace",
		Swaplace.address,
		Swaplace.deployTransaction.hash
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
