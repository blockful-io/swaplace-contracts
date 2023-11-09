import { ethers } from "hardhat";

/**
 * @dev See {ISwapFactory-Asset}.
 */
export interface Asset {
	addr: string;
	amountOrId: bigint;
}

/**
 * @dev See {ISwap-Swap}.
 */
export interface Swap {
	owner: string;
	allowed: string;
	expiry: number;
	biding: Asset[];
	asking: Asset[];
}

/**
 * @dev See {ISwapFactory-makeAsset}.
 */
export async function makeAsset(
	addr: string,
	amountOrId: number | bigint
): Promise<Asset> {
	// validate if its an ethereum address
	if (!ethers.utils.isAddress(addr)) {
		throw new Error("InvalidAddressFormat");
	}

	// if the amount is negative, it will throw an error
	if (amountOrId < 0) {
		throw new Error("AmountOrIdCannotBeNegative");
	}

	/**
	 * @dev Create a new Asset type described by the contract interface.
	 *
	 * NOTE: If the amount is in number format, it will be converted to bigint.
	 * EVM works with a lot of decimals and might overload using number type.
	 */
	const asset: Asset = {
		addr: addr,
		amountOrId: typeof amountOrId == "number" ? BigInt(amountOrId) : amountOrId,
	};

	return asset;
}

/**
 * @dev See {ISwapFactory-makeSwap}.
 */
export async function makeSwap(
	owner: any,
	allowed: any,
	expiry: any,
	biding: Asset[],
	asking: Asset[]
) {
	// check for the current `block.timestamp` because `expiry` cannot be in the past
	const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
	if (expiry < timestamp) {
		throw new Error("InvalidExpiry");
	}

	/**
	 * @dev one of the swapped assets should never be empty or it should be directly
	 * transfered using {ERC20-transferFrom} or {ERC721-safeTransferFrom}
	 *
	 * NOTE: if the purpose of the swap is to transfer the asset directly using Swaplace,
	 * then any small token quantity should be used as the swap asset.
	 */
	if (biding.length == 0 || asking.length == 0) {
		throw new Error("InvalidAssetsLength");
	}

	const swap: Swap = {
		owner: owner,
		allowed: allowed,
		expiry: expiry,
		biding: biding,
		asking: asking,
	};

	return swap;
}

/**
 * @dev Facilitate to create a swap when the swap is too large.
 *
 * Directly composing swaps to avoid to calling {ISwapFactory-makeAsset}
 * multiple times.
 *
 * NOTE:
 *
 * - This function is not implemented in the contract.
 * - This function needs to be async because it calls for `block.timestamp`.
 *
 * Requirements:
 *
 * - `owner` cannot be the zero address.
 * - `expiry` cannot be in the past timestamp.
 * - `bidingAddr` and `askingAddr` cannot be empty.
 * - `bidingAddr` and `bidingAmountOrId` must have the same length.
 * - `askingAddr` and `askingAmountOrId` must have the same length.
 */
export async function composeSwap(
	owner: any,
	allowed: any,
	expiry: any,
	bidingAddr: any[],
	bidingAmountOrId: any[],
	askingAddr: any[],
	askingAmountOrId: any[]
) {
	// lenght of addresses and their respective amounts must be equal
	if (
		bidingAddr.length != bidingAmountOrId.length ||
		askingAddr.length != askingAmountOrId.length
	) {
		throw new Error("InvalidAssetsLength");
	}

	// push new assets to the array of bids and asks
	const biding: any[] = [];
	bidingAddr.forEach(async (addr, index) => {
		biding.push(await makeAsset(addr, bidingAmountOrId[index]));
	});

	const asking: any[] = [];
	askingAddr.forEach(async (addr, index) => {
		asking.push(await makeAsset(addr, askingAmountOrId[index]));
	});

	return await makeSwap(owner, allowed, expiry, biding, asking);
}

module.exports = {
	makeAsset,
	makeSwap,
	composeSwap,
};
