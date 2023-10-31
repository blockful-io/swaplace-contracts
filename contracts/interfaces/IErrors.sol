// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IErrors {
    /**
     * @dev Displayed when the caller is not the owner of the swap.
     */
    error InvalidAddress(address caller);

    error InvalidAssetsLength();

    error InvalidExpiryDate(uint256 timestamp);

    error InvalidFunctionCall(bytes reason);
}
