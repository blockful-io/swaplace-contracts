// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ITrade} from "./interfaces/ITrade.sol";

error InvalidAssetType(uint256 assetType);
error InvalidAddressForOwner(address caller);
error InvalidAmountOrCallId(uint256 amountOrCallId);
error InvalidAssetsLength();
error InvalidExpiryDate(uint256 timestamp);
error InvalidMismatchingLengths(
    uint256 addr,
    uint256 amountIdCall,
    uint256 assetType
);

abstract contract TradeFactory is ITrade {
    function makeAsset(
        address addr,
        uint256 amountIdCall,
        AssetType assetType
    ) public pure returns (Asset memory) {
        if (
            assetType != AssetType.ERC20 &&
            assetType != AssetType.ERC721 &&
            assetType != AssetType.FUNCTION_CALL
        ) {
            revert InvalidAssetType(uint256(assetType));
        }

        if (
            (assetType == AssetType.ERC20 && amountIdCall == 0) ||
            (assetType == AssetType.FUNCTION_CALL && amountIdCall == 0)
        ) {
            revert InvalidAmountOrCallId(amountIdCall);
        }

        return Asset(addr, amountIdCall, assetType);
    }

    function makeTrade(
        address owner,
        uint256 expiry,
        Asset[] memory assets,
        Asset[] memory asking
    ) public pure returns (Trade memory) {
        if (expiry < 1 days) {
            revert InvalidExpiryDate(expiry);
        }

        if (owner == address(0)) {
            revert InvalidAddressForOwner(address(0));
        }

        if (assets.length == 0 || asking.length == 0) {
            revert InvalidAssetsLength();
        }

        return Trade(owner, expiry, assets, asking);
    }

    function composeTrade(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountsOrIdsOrCalls,
        AssetType[] memory assetTypes,
        uint256 indexFlipToAsking
    ) public pure returns (Trade memory) {
        if (
            addrs.length != amountsOrIdsOrCalls.length ||
            addrs.length != assetTypes.length
        ) {
            revert InvalidMismatchingLengths(
                addrs.length,
                amountsOrIdsOrCalls.length,
                assetTypes.length
            );
        }

        Asset[] memory assets = new Asset[](indexFlipToAsking);
        for (uint256 i = 0; i < indexFlipToAsking; ) {
            assets[i] = makeAsset(
                addrs[i],
                amountsOrIdsOrCalls[i],
                assetTypes[i]
            );
            unchecked {
                i++;
            }
        }

        Asset[] memory asking = new Asset[](addrs.length - indexFlipToAsking);
        for (uint256 i = indexFlipToAsking; i < addrs.length; ) {
            asking[i - indexFlipToAsking] = makeAsset(
                addrs[i],
                amountsOrIdsOrCalls[i],
                assetTypes[i]
            );
            unchecked {
                i++;
            }
        }

        return makeTrade(owner, expiry, assets, asking);
    }
}
