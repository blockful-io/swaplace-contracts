# Solidity API

## ISwap

_Interface for the Swap Struct, used in the {Swaplace} implementation._

### Asset

```solidity
struct Asset {
  address addr;
  uint256 amountOrId;
}
```

### Swap

```solidity
struct Swap {
  address owner;
  uint256 config;
  struct ISwap.Asset[] biding;
  struct ISwap.Asset[] asking;
}
```

