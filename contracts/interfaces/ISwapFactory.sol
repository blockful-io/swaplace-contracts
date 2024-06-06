// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface of the {SwapFactory} implementation.
 */
interface ISwapFactory {
  /**
   * @dev Make an {ISwap-Asset} struct to work with token standards.
   *
   * @param addr is the address of the token asset.
   * @param amountOrId is the amount of tokens or the ID of the NFT.
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
   *
   * @param addr is the address of the token asset.
   * @param tokenId is the ID of the ERC1155 token.
   * @param tokenAmount is the amount of the ERC1155 token.
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
   *
   * @param owner is the address that created the Swap.
   * @param allowed is the address that can accept the Swap. If the allowed
   *  address is the zero address, then anyone can accept the Swap.
   * @param expiry is the timestamp that the Swap will be available to accept.
   * @param recipient is the address that will receive the ETH. `0` for the acceptee
   * and `1<>255` for the owner.
   * @param value is the amount of ETH that the recipient will receive. Maximum of
   * 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.
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
   *
   * NOTE: The flag is set to 0xFFFFFFFF.
   *
   * @param tokenId is the ID of the ERC1155 token.
   * @param tokenAmount is the amount of the ERC1155 token.
   */
  function encodeAsset(
    uint120 tokenId,
    uint120 tokenAmount
  ) external pure returns (uint256 amountAndId);

  /**
   * @dev Decode `amountOrId` returning the first 4 bytes to try match with 0xFFFFFFFF.
   * If the flag is set to 0xFFFFFFFF, then it's an ERC1155 standard, otherwise it's
   * assumed to be an ERC20 or ERC721.
   *
   * NOTE: If it's an ERC1155 token, then the next 120 bits are the token ID and the next
   * 120 bits are the token amount.
   *
   * WARNING: Swaplace cannot handle ERC1155 tokens where the ID or the amount is greater
   * than 120 bits.
   *
   * @param amountAndId is the amount of tokens and the ID of the ERC1155 token.
   * @return tokenType is the flag to indicate the token standard.
   * @return tokenId is the ID of the ERC1155 token.
   * @return tokenAmount is the amount of the ERC1155 token.
   *
   */
  function decodeAsset(
    uint256 amountAndId
  )
    external
    pure
    returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount);

  /**
   * @dev This function uses bitwise to return an encoded uint256 of the following parameters.
   *
   * @param allowed address is the address that can accept the Swap. If the allowed
   *   address is the zero address, then anyone can accept the Swap.
   * @param expiry date is the timestamp that the Swap will be available to accept.
   * @param recipient is the address that will receive the ETH as type uint8. If the
   * recipient is equals to 0, the acceptee will receive the ETH. If the recipient is
   * between 1<>255 then the recipient will be the owner of the Swap.
   * @param value is the amount of ETH that the recipient will receive with a maximum
   * of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.
   */
  function encodeConfig(
    address allowed,
    uint32 expiry,
    uint8 recipient,
    uint56 value
  ) external pure returns (uint256 config);

  /**
   * @dev Decode `config` into their respective variables.
   *
   * @param config is the encoded uint256 configuration of the Swap.
   */
  function decodeConfig(
    uint256 config
  )
    external
    pure
    returns (address allowed, uint32 expiry, uint8 recipient, uint56 value);
}
