// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface to easily make new assets and swaps.
 */
interface ISwapFactory {

    /**
     * @dev Emits a event to change `addr` and `amountOrId` in {ISwap-Asset} memory.
     */
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) external pure returns (ISwap.Asset memory);


    /**
     * @dev Emits a event to include `assets` and `asking` in {ISwap-Swap}. 
     */
    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        ISwap.Asset[] memory assets,
        ISwap.Asset[] memory asking
    ) external view returns (ISwap.Swap memory);
}
