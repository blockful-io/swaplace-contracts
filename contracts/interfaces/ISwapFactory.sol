// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwapFactory {
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) external pure returns (ISwap.Asset memory);

    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        ISwap.Asset[] memory assets,
        ISwap.Asset[] memory asking
    ) external view returns (ISwap.Swap memory);

    function composeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 indexFlipToAsking
    ) external view returns (ISwap.Swap memory);
}
