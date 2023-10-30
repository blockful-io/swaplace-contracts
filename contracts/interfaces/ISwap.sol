// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISwap {
    struct Asset {
        address addr;
        uint256 amountOrId;
    }

    struct Swap {
        address owner;
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
}
