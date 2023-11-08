import { ethers } from "hardhat";

/**
 * @dev Validates if the address is a valid ethereum address.
 */
export function isValidAddr(addr: string): boolean {
	return !/^0x[a-fA-F0-9]{40}$/gm.test(addr);
}

/**
 * @dev Get the current `block.timestamp` in seconds from the current
 * selected network.
 *
 * Use `-- network localhost` to run the tests in a local network.
 * Networks should be in `hardhat.config.ts` file or via command line.
 */
export async function blocktimestamp(): Promise<any> {
	return (await ethers.provider.getBlock("latest")).timestamp;
}

/**
 * @dev Deploys a contract and returns the contract instance.
 * The signer is optional, if not provided, the first signer will be used.
 * @param contractName The contract name to deploy.
 * @param signer The signer to use.
 */
export async function deploy(contractName: string, signer?: any) {
	// Get Contract Factory for contractName
	const ContractFactory = await ethers.getContractFactory(contractName, signer);

	// Deploy the Contract
	const Contract = await ContractFactory.deploy();

	// Wait for Contract to be deployed
	const tx = await Contract.deployed();

	// Log Contract address, the Tx then return the Contract instance
	console.log(
		"\nContract %s \nDeployed to %s \nAt Tx %s",
		contractName,
		Contract.address,
		tx
	);

	return Contract;
}

module.exports = {
	isValidAddr,
	blocktimestamp,
};
