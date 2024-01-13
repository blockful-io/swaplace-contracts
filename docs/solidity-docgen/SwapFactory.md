# Solidity API

## SwapFactory

SwapFactory is a helper for creating Swaps and making asset structs.

This helper can be used on and off-chain to easily create a Swap struct to be
used in the {Swaplace-createSwap} function.

Swaplace uses a {ISwap-Swap} struct to represent a Swap. This struct is
composed of:

- The `owner` of the Swap is the address that created the Swap.
- The `allowed` address is the address that can accept the Swap. If the allowed
  address is the zero address, then anyone can accept the Swap.
- The `expiry` date is the timestamp that the Swap will be available to accept.
- The `biding` are the assets that the owner is offering.
- The `asking` are the assets that the owner wants in exchange.

The Swap struct uses an {Asset} struct to represent the asset. This struct is
composed of:

- The `address` of the asset. This address can be from an ERC20 or ERC721 contract.
- The `amount` or `id` of the asset. This amount can be the amount of ERC20 tokens
  or the ID of an ERC721 token.

To use other standards, like ERC1155, you can wrap the ownership of the asset
in an a trusted contract and Swap as an ERC721. This way, you can tokenize any
on-chain execution and trade on Swaplace.

### makeAsset

```solidity
function makeAsset(address addr, uint256 amountOrId) public pure virtual returns (struct ISwap.Asset)
```

_See {ISwapFactory-makeAsset}._

### makeSwap

```solidity
function makeSwap(address owner, address allowed, uint256 expiry, struct ISwap.Asset[] biding, struct ISwap.Asset[] asking) public view virtual returns (struct ISwap.Swap)
```

_See {ISwapFactory-makeSwap}._
