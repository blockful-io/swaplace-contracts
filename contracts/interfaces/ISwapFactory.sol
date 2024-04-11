// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface of the {SwapFactory} implementation.
 */
interface ISwapFactory {
  /**
   * @dev Constructs an {ISwap-Asset} struct to work with token standards.
   */
  function makeAsset(
    address addr,
    uint256 amountOrId
  ) external pure returns (ISwap.Asset memory);

  /**
   * @dev Build a swap struct to use in the {Swaplace-createSwap} function.
   *
   * Requirements:
   *
   * - `expiry` cannot be in the past.
   */
  function makeSwap(
    address owner,
    address allowed,
    uint32 expiry,
    uint8 recipient,
    uint56 value,
    ISwap.Asset[] memory assets,
    ISwap.Asset[] memory asking
  ) external view returns (ISwap.Swap memory);

  /**
   * @dev This function uses bitwise to return a uint256.
   */
  function encodeConfig(
    address allowed,
    uint32 expiry,
    uint8 recipient,
    uint56 value
  ) external pure returns (uint256);

  /**
   * @dev Decode `config` into their respective variables.
   */
  function decodeConfig(
    uint256 config
  )
    external
    pure
    returns (address allowed, uint32 expiry, uint8 recipient, uint56 value);
}
