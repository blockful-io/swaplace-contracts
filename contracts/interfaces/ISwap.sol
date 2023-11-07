// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @dev Interface for the Structs used in the {Swaplace} implementation.
 */
interface ISwap {
    /**
     * @dev Assets can be ERC20 or ERC721.
     *
     * It is composed of:
     * - `addr` of the asset.
     * - `amountOrId` of the asset based on the standard.
     *
     * NOTE: `amountOrId` is the `amount` of ERC20 tokens or the ERC721 `tokenId`.
     */
    struct Asset {
        address addr;
        uint256 amountOrId;
    }

    /**
     * @dev The Swap struct is the heart of Swaplace.
     *
     * It is composed of:
     * - `owner` of the swap.
     * - `allowed` address to accept the swap.
     * - `expiry` date of the swap.
     * - `biding` assets that are being bided by the owner.
     * - `asking` assets that are being asked by the owner.
     *
     * NOTE: When `allowed` address is the zero address, anyone can accept the swap.
     */
    struct Swap {
        address owner;
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
}
