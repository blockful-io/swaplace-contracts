# Solidity API

## ISwapFactory

_Interface of the {SwapFactory} implementation._

### makeAsset

```solidity
function makeAsset(address addr, uint256 amountOrId) external pure returns (struct ISwap.Asset)
```

_Constructs an asset struct that works for ERC20 or ERC721.
This function is a utility to easily create an `Asset` struct on-chain or off-chain._

### makeSwap

```solidity
function makeSwap(address owner, address allowed, uint256 expiry, struct ISwap.Asset[] assets, struct ISwap.Asset[] asking) external view returns (struct ISwap.Swap)
```

_Build a swap struct to use in the {Swaplace-createSwap} function.

Requirements:

- `expiry` cannot be in the past timestamp.
- `biding` and `asking` cannot be empty._

### packData

```solidity
function packData(address allowed, uint256 expiry) external pure returns (uint256)
```

_Packs `allowed` and the `expiry`.
This function returns the bitwise packing of `allowed` and `expiry` as a uint256._

### parseData

```solidity
function parseData(uint256 config) external pure returns (address, uint256)
```

_Parsing the `config`.
This function returns the extracted values of `allowed` and `expiry`._

