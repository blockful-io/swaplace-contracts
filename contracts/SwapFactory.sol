// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./interfaces/ISwap.sol";
import {ISwapFactory} from "./interfaces/ISwapFactory.sol";

error InvalidAddress(address caller);
error InvalidAmount(uint256 amount);
error InvalidAssetsLength();
error InvalidExpiryDate(uint256 timestamp);
error InvalidMismatchingLengths(uint256 addr, uint256 amountOrId);

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
 * @author @0xneves | @blockful_io
 * @dev - Swap Factory is a factory for creating swaps. It's a helper for the core Swaplace features.
 *
 */
abstract contract SwapFactory is ISwapFactory, ISwap {
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) public pure virtual returns (Asset memory) {
        return Asset(addr, amountOrId);
    }

    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public view virtual returns (Swap memory) {
        if (owner == address(0)) {
            revert InvalidAddress(address(0));
        }

        if (expiry < block.timestamp) {
            revert InvalidExpiryDate(expiry);
        }

        if (biding.length == 0 || asking.length == 0) {
            revert InvalidAssetsLength();
        }

        return Swap(owner, allowed, expiry, biding, asking);
    }
}
