// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwapFactory {
    function makeAsset(
        address addr,
        uint256 amountIdCall,
        ISwap.AssetType assetType
    ) external pure returns (ISwap.Asset memory);

    function makeSwap(
        address owner,
        uint256 expiry,
        ISwap.Asset[] memory assets,
        ISwap.Asset[] memory asking
    ) external pure returns (ISwap.Swap memory);

    function composeSwap(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountsOrIdsOrCalls,
        ISwap.AssetType[] memory assetTypes,
        uint256 indexFlipToAsking
    ) external pure returns (ISwap.Swap memory);
}
