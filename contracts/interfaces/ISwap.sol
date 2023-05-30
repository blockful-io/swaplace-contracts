// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISwap {
    enum AssetType {
        ERC20,
        ERC721
    }

    struct Asset {
        address addr;
        uint256 amountOrId;
        AssetType assetType;
    }

    struct Swap {
        address owner;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
}
