import { ethers } from "hardhat";

/**
 * @dev See {ISwapFactory-Asset}.
 */
export interface Asset {
  addr: string;
  amountOrId: bigint | number;
}

/**
 * @dev See {ISwap-Swap}.
 */
export interface Swap {
  owner: string;
  config: bigint;
  biding: Asset[];
  asking: Asset[];
}

/**
 * @dev See {ISwapFactory-encodeConfig}.
 */
export async function encodeConfig(
  allowed: string,
  expiry: bigint | number,
  recipient: bigint | number,
  value: bigint | number,
): Promise<bigint> {
  return (
    (BigInt(allowed) << BigInt(96)) |
    (BigInt(expiry) << BigInt(64)) |
    (BigInt(recipient) << BigInt(56)) |
    BigInt(value)
  );
}

/**
 * @dev See {ISwapFactory-decodeConfig}.
 */
export async function decodeConfig(config: bigint): Promise<{
  allowed: string;
  expiry: bigint | number;
  recipient: bigint | number;
  value: bigint | number;
}> {
  return {
    allowed:
      config >> BigInt(96) == BigInt(0)
        ? ethers.constants.AddressZero
        : ethers.utils.getAddress(
            `0x${(config >> BigInt(96)).toString(16).padStart(40, "0")}`,
          ),
    expiry: (config >> BigInt(64)) & ((BigInt(1) << BigInt(32)) - BigInt(1)),
    recipient: (config >> BigInt(56)) & ((BigInt(1) << BigInt(8)) - BigInt(1)),
    value: config & ((BigInt(1) << BigInt(56)) - BigInt(1)),
  };
}

/**
 * @dev See {ISwapFactory-makeAsset}.
 */
export async function makeAsset(
  addr: string,
  amountOrId: bigint | number,
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
    amountOrId: amountOrId,
  };

  return asset;
}

/**
 * @dev See {ISwapFactory-encodeAsset}.
 */
export async function encodeAsset(
  tokenId: bigint | number,
  tokenAmount: bigint | number,
): Promise<bigint> {
  // if the amount or ID is negative, it will throw an error
  if (tokenId < 0 || tokenAmount < 0) {
    throw new Error("tokenId or tokenAmount cannot be less than 0");
  }

  const uint16Max = 65535;

  return BigInt(
    (BigInt(uint16Max) << BigInt(240)) |
      (BigInt(tokenId) << BigInt(120)) |
      BigInt(tokenAmount),
  );
}

/**
 * @dev See {ISwapFactory-makeSwap}.
 */
export async function makeSwap(
  owner: string,
  config: bigint,
  biding: Asset[],
  asking: Asset[],
) {
  const expiry: bigint =
    BigInt(config) & ((BigInt(1) << BigInt(96)) - BigInt(1));

  // check for the current `block.timestamp` because `expiry` cannot be in the past
  const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
  if (expiry < currentTimestamp) {
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
    config: config,
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
  owner: string,
  config: bigint,
  bidingAddr: string[],
  bidingAmountOrId: bigint[] | number[],
  askingAddr: string[],
  askingAmountOrId: bigint[] | number[],
) {
  // lenght of addresses and their respective amounts must be equal
  if (
    bidingAddr.length != bidingAmountOrId.length ||
    askingAddr.length != askingAmountOrId.length
  ) {
    throw new Error("InvalidAssetsLength");
  }

  // push new assets to the array of bids and asks
  const biding: Asset[] = [];
  bidingAddr.forEach(async (addr, index) => {
    biding.push(await makeAsset(addr, bidingAmountOrId[index]));
  });

  const asking: Asset[] = [];
  askingAddr.forEach(async (addr, index) => {
    asking.push(await makeAsset(addr, askingAmountOrId[index]));
  });

  return await makeSwap(owner, config, biding, asking);
}

module.exports = {
  makeAsset,
  makeSwap,
  composeSwap,
  encodeConfig,
  decodeConfig,
};
