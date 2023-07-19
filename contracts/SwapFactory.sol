// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./interfaces/ISwap.sol";
import {ISwapFactory} from "./interfaces/ISwapFactory.sol";

error InvalidAddressForOwner(address caller);
error InvalidAmount(uint256 amount);
error InvalidAssetsLength();
error InvalidAssetType(uint256 assetType);
error InvalidExpiryDate(uint256 timestamp);
error InvalidMismatchingLengths(
    uint256 addr,
    uint256 amountOrCallOrId,
    uint256 assetType
);

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
        uint256 amountOrCallOrId,
        AssetType assetType
    ) public pure returns (Asset memory) {
        if (assetType != AssetType.ERC20 && assetType != AssetType.ERC721) {
            revert InvalidAssetType(uint256(assetType));
        }

        if (assetType == AssetType.ERC20 && amountOrCallOrId == 0) {
            revert InvalidAmount(amountOrCallOrId);
        }

        return Asset(addr, amountOrCallOrId, assetType);
    }

    function makeSwap(
        address owner,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public pure returns (Swap memory) {
        if (owner == address(0)) {
            revert InvalidAddressForOwner(address(0));
        }

        if (expiry < 0) {
            revert InvalidExpiryDate(expiry);
        }

        if (biding.length == 0 || asking.length == 0) {
            revert InvalidAssetsLength();
        }

        return Swap(owner, expiry, biding, asking);
    }

    function composeSwap(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrCallOrId,
        AssetType[] memory assetTypes,
        uint256 bidFlipAsk
    ) public pure returns (Swap memory) {
        if (
            addrs.length != amountOrCallOrId.length ||
            addrs.length != assetTypes.length
        ) {
            revert InvalidMismatchingLengths(
                addrs.length,
                amountOrCallOrId.length,
                assetTypes.length
            );
        }

        Asset[] memory biding = new Asset[](bidFlipAsk);
        for (uint256 i = 0; i < bidFlipAsk; ) {
            biding[i] = makeAsset(addrs[i], amountOrCallOrId[i], assetTypes[i]);
            unchecked {
                i++;
            }
        }

        Asset[] memory asking = new Asset[](addrs.length - bidFlipAsk);
        for (uint256 i = bidFlipAsk; i < addrs.length; ) {
            asking[i - bidFlipAsk] = makeAsset(
                addrs[i],
                amountOrCallOrId[i],
                assetTypes[i]
            );
            unchecked {
                i++;
            }
        }

        return makeSwap(owner, expiry, biding, asking);
    }
}
