// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwapFactory {

    /**
     * @dev Creates a new asset in the swaplace system given its ID.
     */
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) external pure returns (ISwap.Asset memory);


    /**
     * @dev Creates a new swap in the swaplace system given its ID.
     */
    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        ISwap.Asset[] memory assets,
        ISwap.Asset[] memory asking
    ) external view returns (ISwap.Swap memory);


    /**
     * @dev Generates the ID of a new swap composition in the swapplace system
     */
    function composeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountOrId,
        uint256 indexFlipToAsking
    ) external view returns (ISwap.Swap memory);
}
