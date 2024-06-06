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
   * - `owner` creator of the Swap.
   * - `config` configuration of four packed values:
   * - - `allowed` for the allowed address to accept the swap.
   * - - `expiry` for the expiration date of the swap in unix time.
   * - - `recipient` for the address that will receive the ETH.
   * - - `value` for the amount of ETH that the recipient will receive.
   * - `biding` assets offered by the swap creator.
   * - `asking` assets asked by the swap creator.
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
