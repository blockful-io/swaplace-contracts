# Solidity API

## SwapFactory

_SwapFactory is a helper for creating Swaps and making asset structs.

This helper can be used on and off-chain to easily create a Swap struct to be
used in the {Swaplace-createSwap} function.

Swaplace uses a {ISwap-Swap} struct to represent a Swap. This struct is
composed of:

- The `owner` of the Swap is the address that created the Swap.
- The `allowed` address is the address that can accept the Swap. If the allowed
  address is the zero address, then anyone can accept the Swap.
- The `expiry` date is the timestamp that the Swap will be available to accept.
- The `recipient` is the address that will receive the ETH as type uint8. If the
recipient is equals to 0, the acceptee will receive the ETH. If the recipient is
between 1<>255 then the recipient will be the owner of the Swap.
- The `value` is the amount of ETH that the recipient will receive with a maximum
of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.
- The `biding` are the assets that the owner is offering.
- The `asking` are the assets that the owner wants in exchange.

The Swap struct uses an {Asset} struct to represent the asset. This struct is
composed of:

- The `address` of the token asset.
- The `amount` or `id` of the asset. This amount can be the amount of ERC20 tokens
 or the NFT ID of an ERC721.
- The `amount` and `id` can be encoded together in a single uint256, allowing the
ERC1155 tokens to be swapped._

### makeAsset

```solidity
function makeAsset(address addr, uint256 amountOrId) public pure virtual returns (struct ISwap.Asset)
```

_See {ISwapFactory-makeAsset}._

### make1155Asset

```solidity
function make1155Asset(address addr, uint120 tokenId, uint120 tokenAmount) public pure virtual returns (struct ISwap.Asset)
```

_See {ISwapFactory-make1155Asset}._

### makeSwap

```solidity
function makeSwap(address owner, address allowed, uint32 expiry, uint8 recipient, uint56 value, struct ISwap.Asset[] biding, struct ISwap.Asset[] asking) public view virtual returns (struct ISwap.Swap)
```

_See {ISwapFactory-makeSwap}._

### encodeAsset

```solidity
function encodeAsset(uint120 tokenId, uint120 tokenAmount) public pure returns (uint256 amountAndId)
```

_See {ISwapFactory-encodeAsset}._

### decodeAsset

```solidity
function decodeAsset(uint256 amountOrId) public pure returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount)
```

_See {ISwapFactory-decodeAsset}._

### encodeConfig

```solidity
function encodeConfig(address allowed, uint32 expiry, uint8 recipient, uint56 value) public pure returns (uint256)
```

_See {ISwapFactory-encodeConfig}._

### decodeConfig

```solidity
function decodeConfig(uint256 config) public pure returns (address, uint32, uint8, uint56)
```

_See {ISwapFactory-decodeConfig}._

