// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./interfaces/ISwap.sol";
import {ISwapFactory} from "./interfaces/ISwapFactory.sol";

error InvalidAddress(address caller);
error InvalidAmount(uint256 amount);
error InvalidAssetsLength();
error InvalidExpiryDate(uint256 timestamp);
error InvalidMismatchingLengths(uint256 addr, uint256 amountOrCallOrId);

/**
 *  ________   ___        ________   ________   ___  __     ________  ___  ___   ___
 * |\   __  \ |\  \      |\   __  \ |\   ____\ |\  \|\  \  |\  _____\|\  \|\  \ |\  \
 * \ \  \|\ /_\ \  \     \ \  \|\  \\ \  \___| \ \  \/  /|_\ \  \__/ \ \  \\\  \\ \  \
 *  \ \   __  \\ \  \     \ \  \\\  \\ \  \     \ \   ___  \\ \   __\ \ \  \\\  \\ \  \
 *   \ \  \|\  \\ \  \____ \ \  \\\  \\ \  \____ \ \  \\ \  \\ \  \_|  \ \  \\\  \\ \  \____
 *    \ \_______\\ \_______\\ \_______\\ \_______\\ \__\\ \__\\ \__\    \ \_______\\ \_______\
 *     \|_______| \|_______| \|_______| \|_______| \|__| \|__| \|__|     \|_______| \|_______|
 *
 * @title Swaplace
 * @author @dizzyaxis | @blockful_io
 * @dev - Swap Factory is a factory for creating swaps. It's a helper for the core Swaplace features.
 *
 */
abstract contract SwapFactory is ISwapFactory, ISwap {
    function makeAsset(
        address addr,
        uint256 amountOrCallOrId
    ) public pure returns (Asset memory) {
        return Asset(addr, amountOrCallOrId);
    }

    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (Swap memory) {
        if (owner == address(0)) {
            revert InvalidAddress(address(0));
        }

        if (expiry == 0) {
            revert InvalidExpiryDate(expiry);
        }

        if (biding.length == 0 || asking.length == 0) {
            revert InvalidAssetsLength();
        }

        return Swap(owner, allowed, expiry, biding, asking);
    }

    function composeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrCallOrId,
        uint256 bidFlipAsk
    ) public pure returns (Swap memory) {
        if (addrs.length != amountOrCallOrId.length) {
            revert InvalidMismatchingLengths(
                addrs.length,
                amountOrCallOrId.length
            );
        }

        Asset[] memory biding = new Asset[](bidFlipAsk);
        for (uint256 i = 0; i < bidFlipAsk; ) {
            biding[i] = makeAsset(addrs[i], amountOrCallOrId[i]);
            unchecked {
                i++;
            }
        }

        Asset[] memory asking = new Asset[](addrs.length - bidFlipAsk);
        for (uint256 i = bidFlipAsk; i < addrs.length; ) {
            asking[i - bidFlipAsk] = makeAsset(addrs[i], amountOrCallOrId[i]);
            unchecked {
                i++;
            }
        }

        return makeSwap(owner, allowed, expiry, biding, asking);
    }
}
