// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISwap {
    enum AssetType {
        ERC20,
        ERC721,
        CALL
    }

    struct Asset {
        address addr;
        uint256 amountOrCallOrId;
        AssetType assetType;
    }

    struct Swap {
        address owner;
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
}
