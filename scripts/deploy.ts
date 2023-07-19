import { ethers } from "hardhat";

async function main() {
	// Get signer
	const [signer] = await ethers.getSigners();

	// Get Swaplace Factory
	const SwaplaceFactory = await ethers.getContractFactory("Swaplace", signer);

	// Deploy Swaplace
	const Swaplace = await SwaplaceFactory.deploy();

	// Wait for Swaplace to be deployed
	await Swaplace.deployed();

	// Log Swaplace address and Tx with polygon scan link
	console.log("Swaplace deployed to:", Swaplace.address);
	console.log("https://polygonscan.com/tx/" + Swaplace.deployTransaction.hash);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
