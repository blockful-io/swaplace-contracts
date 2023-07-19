// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISwap {
    struct Asset {
        address addr;
        uint256 amountOrCallOrId;
    }

    struct BaseSwap {
        Asset[] biding;
        Asset[] asking;
    }

    struct PvtSwap {
        address allowed;
        Asset[] biding;
        Asset[] asking;
    }

    struct TimedSwap {
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }

    struct TimedPvtSwap {
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
}
