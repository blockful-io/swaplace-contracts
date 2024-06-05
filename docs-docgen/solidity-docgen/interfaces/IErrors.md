# Solidity API

## IErrors

_Errors only interface for the {Swaplace} implementations._

### InvalidAddress

```solidity
error InvalidAddress(address caller)
```

_Displayed when the caller is not the owner of the swap._

### InvalidAssetsLength

```solidity
error InvalidAssetsLength()
```

_Displayed when the amount of {ISwap-Asset} has a length of zero.

NOTE: The `biding` or `asking` array must not be empty to avoid mistakes
when creating a swap. Assuming one side of the swap is empty, the
correct approach should be the usage of {transferFrom} and we reinforce
this behavior by requiring the length of the array to be bigger than zero._

### InvalidExpiry

```solidity
error InvalidExpiry(uint256 timestamp)
```

_Displayed when the `expiry` date is in the past._

