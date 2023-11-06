// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwapFactory {

    /**
     * @dev Create a new asset that can be used in an exchange operation. 
     * It accepts an `addr` address and an `amountOrId` with ERC20 or ERC721 returning the {ISwap.Asset} data structure.
     */
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) external pure returns (ISwap.Asset memory);

    /**
     * @dev Creates an {ISwap.Swap} data structure that defines a swap operation. 
     * 
     * Requirements: 
     * 
     * - `owner` address 
     * - `allowed` address authorized to interact
     * - An expiration date, 
     * - Assets that are being offered
     * - Assets that are wanted in exchange
     */
    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        ISwap.Asset[] memory assets,
        ISwap.Asset[] memory asking
    ) external view returns (ISwap.Swap memory);
}
