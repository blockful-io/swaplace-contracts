# Solidity API

## IErrors

Errors only interface for the {Swaplace} implementations.

### InvalidAddress

```solidity
error InvalidAddress(address caller)
```

Displayed when the caller is not the owner of the swap.

### InvalidAssetsLength

```solidity
error InvalidAssetsLength()
```

Displayed when the amount of {ISwap-Asset} has a length of zero.

NOTE: The `biding` or `asking` array must not be empty to avoid mistakes
when creating a swap. Assuming one side of the swap is empty, the
correct approach should be the usage of {transferFrom} and we reinforce
this behavior by requiring the length of the array to be bigger than zero.

### InvalidExpiry

```solidity
error InvalidExpiry(uint256 timestamp)
```

Displayed when the `expiry` date is in the past.
