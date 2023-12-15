# Solidity API

## TestFactory

### has_values

```solidity
function has_values() public
```

### make_asset_array

```solidity
function make_asset_array(address addr, uint256 amountOrId) public pure returns (struct ISwap.Asset[])
```

### make_valid_swap

```solidity
function make_valid_swap(address owner, address addr, uint256 amountOrId) public view returns (struct ISwap.Swap)
```

### echidna_revert_invalid_expiry

```solidity
function echidna_revert_invalid_expiry() public view
```

### echidna_revert_invalid_length

```solidity
function echidna_revert_invalid_length() public view
```

