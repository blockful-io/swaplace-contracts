// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IErrors} from "./interfaces/IErrors.sol";
import {ISwap} from "./interfaces/ISwap.sol";
import {ISwapFactory} from "./interfaces/ISwapFactory.sol";

/**
 * @dev SwapFactory is a helper for creating Swaps and making asset structs.
 *
 * This helper can be used on and off-chain to easily create a Swap struct to be
 * used in the {Swaplace-createSwap} function.
 *
 * Swaplace uses a {ISwap-Swap} struct to represent a Swap. This struct is
 * composed of:
 *
 * - The `owner` of the Swap is the address that created the Swap.
 * - The `allowed` address is the address that can accept the Swap. If the allowed
 *   address is the zero address, then anyone can accept the Swap.
 * - The `expiry` date is the timestamp that the Swap will be available to accept.
 * - The `recipient` is the address that will receive the ETH as type uint8. If the
 * recipient is equals to 0, the acceptee will receive the ETH. If the recipient is
 * between 1<>255 then the recipient will be the owner of the Swap.
 * - The `value` is the amount of ETH that the recipient will receive with a maximum
 * of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.
 * - The `biding` are the assets that the owner is offering.
 * - The `asking` are the assets that the owner wants in exchange.
 *
 * The Swap struct uses an {Asset} struct to represent the asset. This struct is
 * composed of:
 *
 * - The `address` of the token asset.
 * - The `amount` or `id` of the asset. This amount can be the amount of ERC20 tokens
 *  or the NFT ID of an ERC721.
 * - The `amount` and `id` can be encoded together in a single uint256, allowing the
 * ERC1155 tokens to be swapped.
 */
abstract contract SwapFactory is ISwapFactory, ISwap, IErrors {
  /**
   * @dev See {ISwapFactory-makeAsset}.
   */
  function makeAsset(
    address addr,
    uint256 amountOrId
  ) public pure virtual returns (Asset memory) {
    return Asset(addr, amountOrId);
  }

  /**
   * @dev See {ISwapFactory-make1155Asset}.
   */
  function make1155Asset(
    address addr,
    uint120 tokenId,
    uint120 tokenAmount
  ) public pure virtual returns (Asset memory) {
    return Asset(addr, encodeAsset(tokenId, tokenAmount));
  }

  /**
   * @dev See {ISwapFactory-makeSwap}.
   */
  function makeSwap(
    address owner,
    address allowed,
    uint32 expiry,
    uint8 recipient,
    uint56 value,
    Asset[] memory biding,
    Asset[] memory asking
  ) public view virtual returns (Swap memory) {
    if (expiry < block.timestamp) revert InvalidExpiry();
    uint256 config = encodeConfig(allowed, expiry, recipient, value);
    return Swap(owner, config, biding, asking);
  }

  /**
   * @dev See {ISwapFactory-encodeAsset}.
   */
  function encodeAsset(
    uint120 tokenId,
    uint120 tokenAmount
  ) public pure returns (uint256 amountAndId) {
    return
      (uint256(type(uint16).max) << 240) |
      (uint256(tokenId) << 120) |
      uint256(tokenAmount);
  }

  /**
   * @dev See {ISwapFactory-decodeAsset}.
   */
  function decodeAsset(
    uint256 amountOrId
  )
    public
    pure
    returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount)
  {
    return (
      uint16(amountOrId >> 240),
      uint256(uint120(amountOrId >> 120)),
      uint256(uint120(amountOrId))
    );
  }

  /**
   * @dev See {ISwapFactory-encodeConfig}.
   */
  function encodeConfig(
    address allowed,
    uint32 expiry,
    uint8 recipient,
    uint56 value
  ) public pure returns (uint256) {
    return
      (uint256(uint160(allowed)) << 96) |
      (uint256(expiry) << 64) |
      (uint256(recipient) << 56) |
      uint256(value);
  }

  /**
   * @dev See {ISwapFactory-decodeConfig}.
   */
  function decodeConfig(
    uint256 config
  ) public pure returns (address, uint32, uint8, uint56) {
    return (
      address(uint160(config >> 96)),
      uint32(config >> 64),
      uint8(config >> 56),
      uint56(config)
    );
  }
}
