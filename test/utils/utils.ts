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
export async function blocktimestamp(): Promise<number> {
	return (await ethers.provider.getBlock("latest")).timestamp;
}

module.exports = {
	isValidAddr,
	blocktimestamp,
};
