// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @dev Interface for the Swap Struct, used in the {Swaplace} implementation.
 */
interface ISwap {
  /**
   * @dev Assets can be ERC20 or ERC721.
   *
   * It is composed of:
   * - `addr` of the asset.
   * - `amountOrId` of the asset based on the standard.
   *
   * NOTE: `amountOrId` is the `amount` of ERC20 or the `tokenId` of ERC721.
   */
  struct Asset {
    address addr;
    uint256 amountOrId;
  }

  /**
   * @dev The Swap struct is the heart of Swaplace.
   *
   * It is composed of:
   * - `owner` of the Swap.
   * - `config` represents two packed values:
   * - - `allowed` for the allowed address to accept the swap
   * - - `expiry` for the expiration date of the swap.
   * - - `recipient` for the address that will receive the ETH.
   * - - `value` for the amount of ETH that the recipient will receive.
   * - `biding` assets that are being bided by the owner.
   * - `asking` assets that are being asked by the owner.
   *
   * NOTE: When `allowed` address is the zero address, anyone can accept the Swap.
   */
  struct Swap {
    address owner;
    uint256 config;
    Asset[] biding;
    Asset[] asking;
  }
}
