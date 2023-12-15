# Solidity API

## ISwap

Interface for the Swap Struct, used in the {Swaplace} implementation.

### Asset

```solidity
struct Asset {
  address addr;
  uint256 amountOrId;
}
```

Assets can be ERC20 or ERC721.

It is composed of:

-   `addr` of the asset.
-   `amountOrId` of the asset based on the standard.

NOTE: `amountOrId` is the `amount` of ERC20 or the `tokenId` of ERC721.

### Swap

```solidity
struct Swap {
  address owner;
  address allowed;
  uint256 expiry;
  struct ISwap.Asset[] biding;
  struct ISwap.Asset[] asking;
}
```

The Swap struct is the heart of Swaplace.

It is composed of:

-   `owner` of the Swap.
-   `allowed` address to accept the Swap.
-   `expiry` date of the Swap.
-   `biding` assets that are being bided by the owner.
-   `asking` assets that are being asked by the owner.

NOTE: When `allowed` address is the zero address, anyone can accept the Swap.
