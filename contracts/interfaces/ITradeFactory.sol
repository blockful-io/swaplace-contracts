// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ITrade} from "./ITrade.sol";

interface ITradeFactory {
    function makeAsset(
        address addr,
        uint256 amountIdCall,
        ITrade.AssetType assetType
    ) external pure returns (ITrade.Asset memory);

    function makeTrade(
        address owner,
        uint256 expiry,
        ITrade.Asset[] memory assets,
        ITrade.Asset[] memory asking
    ) external pure returns (ITrade.Trade memory);

    function composeTrade(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountsOrIdsOrCalls,
        ITrade.AssetType[] memory assetTypes,
        uint256 indexFlipToAsking
    ) external pure returns (ITrade.Trade memory);
}
