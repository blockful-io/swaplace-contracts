// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface of the {SwapFactory} implementation.
 */
interface ISwapFactory {
  /**
   * @dev Make an {ISwap-Asset} struct to work with token standards.
   */
  function makeAsset(
    address addr,
    uint256 amountOrId
  ) external pure returns (ISwap.Asset memory);

  /**
   * @dev Make an {ISwap-Asset} struct to work with token standards.
   *
   * NOTE: Different from the {makeAsset} function, this function is used to
   * encode the token ID and token amount into a single uint256. This is made
   * to work with the ERC1155 standard.
   */
  function make1155Asset(
    address addr,
    uint120 tokenId,
    uint120 tokenAmount
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
   * @dev Encode `tokenId` and `tokenAmount` into a single uint256 while adding a flag
   * to indicate that it's an ERC1155 token.
   */
  function encodeAsset(
    uint120 tokenId,
    uint120 tokenAmount
  ) external pure returns (uint256 amountOrId);

  /**
   * @dev Decode `amountOrId` to check if the first 4 bytes are set to 0xFFFFFFFF.
   * If the flag is set to 0xFFFFFFFF, then it's an ERC1155 standard, otherwise it's
   * assumed to be an ERC20 or ERC721 standard.
   *
   * NOTE: If it's an ERC1155 token, then the next 120 bits are the token ID and the next
   * 120 bits are the token amount.
   */
  function decodeAsset(
    uint256 amountOrId
  )
    external
    pure
    returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount);

  /**
   * @dev This function uses bitwise to return an encoded uint256 of the following parameters.
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
