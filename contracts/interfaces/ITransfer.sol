// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @dev Generalized Interface for {IERC20} and {IERC721} `transferFrom` functions.
 */
interface ITransfer {
  /**
   * @dev See {IERC20-transferFrom} or {IERC721-transferFrom}.
   *
   * Moves an `amount` for ERC20 or `tokenId` for ERC721 from `from` to `to`.
   *
   * Emits a {Transfer} event.
   */
  function transferFrom(address from, address to, uint256 amountOrId) external;
}
