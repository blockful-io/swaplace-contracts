import { ethers } from "hardhat";

/**
 * @dev Validates if the address is a valid ethereum address.
 */
export function isValidAddr(addr: string): boolean {
	return !/^0x[a-fA-F0-9]{40}$/gm.test(addr);
}

module.exports = {
	isValidAddr,
};
