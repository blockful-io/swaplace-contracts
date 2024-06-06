// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @dev Errors only interface for the {Swaplace} implementations.
 */
interface IErrors {
  /**
   * @dev Displayed when the caller is not the owner of the swap.
   */
  error InvalidAddress();

  /**
   * @dev Displayed when the `expiry` date is in the past.
   */
  error InvalidExpiry();

  /**
   * @dev Displayed when the `msg.value` doesn't match the swap request.
   */
  error InvalidValue();

  /**
   * @dev Displayed when a low level call failed to execute.
   */
  error InvalidCall();
}
