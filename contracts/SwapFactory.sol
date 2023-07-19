// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./interfaces/ISwap.sol";

error InvalidExpiryDate(uint256 timestamp);
error InvalidMismatchingLengths(uint256 addr, uint256 amountOrCallOrId);

abstract contract SwapFactory is ISwap {
    function makeAsset(
        address addr,
        uint256 amountOrCallOrId
    ) public pure returns (Asset memory) {
        return Asset(addr, amountOrCallOrId);
    }

    function makeBaseSwap(
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (BaseSwap memory) {
        return BaseSwap(biding, asking);
    }

    function makePvtSwap(
        address allowed,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (PvtSwap memory) {
        return PvtSwap(allowed, biding, asking);
    }

    function makeTimedSwap(
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (TimedSwap memory) {
        if (expiry == 0) {
            revert InvalidExpiryDate(expiry);
        }

        return TimedSwap(expiry, biding, asking);
    }

    function makeTimedPvtSwap(
        address allowed,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (TimedPvtSwap memory) {
        if (expiry == 0) {
            revert InvalidExpiryDate(expiry);
        }

        return TimedPvtSwap(allowed, expiry, biding, asking);
    }
}
