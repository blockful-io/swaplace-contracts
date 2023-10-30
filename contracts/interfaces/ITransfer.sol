// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITransfer {
    function transferFrom(
        address from,
        address to,
        uint256 amountOrId
    ) external;
}
