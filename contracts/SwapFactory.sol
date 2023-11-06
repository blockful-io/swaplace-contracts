// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IErrors} from "./interfaces/IErrors.sol";
import {ISwap} from "./interfaces/ISwap.sol";
import {ISwapFactory} from "./interfaces/ISwapFactory.sol";

/**
 * @dev - SwapFactory is a helper for creating swaps and making asset structs.
 *
 * This helper can be used off-chain to easily create a swap struct and use it
 * in the {Swaplace-createSwap} function or any other implementation. But it also
 * can be used to create a swap struct on-chain.
 *
 * Swaplace uses a {ISwap-Swap} struct to represent a swap. This struct is
 * composed of:
 *
 * - The owner of the swap is the address that created the swap.
 * - The allowed address is the address that can accept the swap. If the allowed
 *   address is the zero address, then anyone can accept the swap.
 * - The expiry date is the timestamp that the swap will be available to accept.
 * - The biding assets are the assets that the owner is offering.
 * - The asking assets are the assets that the owner wants in exchange.
 *
 * The Swap struct uses an {Asset} struct to represent an asset. This struct is
 * composed of:
 *
 * - The address of the asset. This address can be an ERC20 or ERC721 contract.
 * - The amount or id of the asset. This amount can be the amount of ERC20 tokens
 *  or the id of an ERC721 token.
 *
 * To use other standards, like ERC1155, you can wrap the ownership of the asset
 * in an a trusted contract and swap as an ERC721. But you don't have to stop there,
 * by delegating ownership over a contract, you can tokenize any on-chain execution.
 */
abstract contract SwapFactory is ISwapFactory, ISwap, IErrors {
    /**
     * @dev See {ISwapFactory-makeAsset}.
     */
    function makeAsset(
        address addr,
        uint256 amountOrId
    ) public pure virtual returns (Asset memory) {
        return Asset(addr, amountOrId);
    }

    /**
     *  @dev See {ISwapFactory-makeSwap}.
     */
    function makeSwap(
        address owner,
        address allowed,
        uint256 expiry,
        Asset[] memory biding,
        Asset[] memory asking
    ) public view virtual returns (Swap memory) {
        if (expiry < block.timestamp) {
            revert InvalidExpiry(expiry);
        }

        if (biding.length == 0 || asking.length == 0) {
            revert InvalidAssetsLength();
        }

        return Swap(owner, allowed, expiry, biding, asking);
    }
}
