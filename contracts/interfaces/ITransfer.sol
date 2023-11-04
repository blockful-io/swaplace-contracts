// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITransfer {
    
    /**
     * @dev Moves a `amountOrId` ERC20 or ERC721 `from` to `to` using the allowance mechanism.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amountOrId
    ) external;
}
