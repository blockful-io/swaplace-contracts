// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./interfaces/swaps/ISwap.sol";

/**
 * @title SwapFactory
 * @author 0xneves | @blockful_io
 * @notice Factory contract to assist when creating swaps.
 */
contract SwapFactory is ISwap {
    /**
     * @notice Create a new asset.
     * @param addr - The address of the asset.
     * @param amountOrCallOrId - The uint256 corresponding type of call to the address.
     */
    function makeAsset(
        address addr,
        uint256 amountOrCallOrId
    ) public pure returns (Asset memory) {
        return Asset(addr, amountOrCallOrId);
    }

    /**
     * @notice Create a new base swap.
     * @param biding - The assets that the creator wants to give.
     * @param asking - The assets that the creator wants to receive.
     */
    function makeBaseSwap(
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (BaseSwap memory) {
        return BaseSwap(biding, asking);
    }

    /**
     * @notice Create a new private swap.
     * @param allowed - The address that is allowed to accept the swap.
     * @param biding - The assets that the creator wants to give.
     * @param asking - The assets that the creator wants to receive.
     */
    function makePvtSwap(
        address allowed,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (PvtSwap memory) {
        return PvtSwap(allowed, biding, asking);
    }

    /**
     * @notice Create a new timed swap.
     * @param expiry - The expiry date of the swap.
     * @param biding - The assets that the creator wants to give.
     * @param asking - The assets that the creator wants to receive.
     */
    function makeTimedSwap(
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (TimedSwap memory) {
        return TimedSwap(expiry, biding, asking);
    }

    /**
     * @notice Create a new timed private swap.
     * @param allowed - The address that is allowed to accept the swap.
     * @param expiry - The expiry date of the swap.
     * @param biding - The assets that the creator wants to give.
     * @param asking - The assets that the creator wants to receive.
     */
    function makeTimedPvtSwap(
        address allowed,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (TimedPvtSwap memory) {
        return TimedPvtSwap(allowed, expiry, biding, asking);
    }

    function composeBaseSwap(
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 bidLength
    ) public pure returns (BaseSwap memory) {
        (Asset[] memory biding, Asset[] memory asking) = composeAsset(
            addrs,
            amountOrId,
            bidLength
        );
        return makeBaseSwap(biding, asking);
    }

    function composePvtSwap(
        address allowed,
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 bidLength
    ) public pure returns (PvtSwap memory) {
        (Asset[] memory biding, Asset[] memory asking) = composeAsset(
            addrs,
            amountOrId,
            bidLength
        );
        return makePvtSwap(allowed, biding, asking);
    }

    function composeTimedSwap(
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 bidLength
    ) public pure returns (TimedSwap memory) {
        (Asset[] memory biding, Asset[] memory asking) = composeAsset(
            addrs,
            amountOrId,
            bidLength
        );
        return makeTimedSwap(expiry, biding, asking);
    }

    function composeTimedPvtSwap(
        address allowed,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 bidLength
    ) public pure returns (TimedPvtSwap memory) {
        (Asset[] memory biding, Asset[] memory asking) = composeAsset(
            addrs,
            amountOrId,
            bidLength
        );
        return makeTimedPvtSwap(allowed, expiry, biding, asking);
    }

    function composeAsset(
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 bidLength
    ) public pure returns (Asset[] memory, Asset[] memory) {
        Asset[] memory biding = new Asset[](bidLength);
        for (uint256 i = 0; i < bidLength; ) {
            biding[i] = makeAsset(addrs[i], amountOrId[i]);
            unchecked {
                i++;
            }
        }

        Asset[] memory asking = new Asset[](addrs.length - bidLength);
        for (uint256 i = bidLength; i < addrs.length; ) {
            asking[i - bidLength] = makeAsset(addrs[i], amountOrId[i]);
            unchecked {
                i++;
            }
        }
        return (biding, asking);
    }
}
