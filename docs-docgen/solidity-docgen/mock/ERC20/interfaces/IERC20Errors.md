# Solidity API

## IERC20Errors

_Standard ERC20 Errors_

### ERC20InsufficientBalance

```solidity
error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)
```

_Indicates an error related to the current `balance` of a `sender`. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | Address whose tokens are being transferred. |
| balance | uint256 | Current balance for the interacting account. |
| needed | uint256 | Minimum amount required to perform a transfer. |

### ERC20InsufficientAllowance

```solidity
error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)
```

_Indicates a failure with the `spender`’s `allowance`. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | Address that may be allowed to operate on tokens without being their owner. |
| allowance | uint256 | Amount of tokens a `spender` is allowed to operate with. |
| needed | uint256 | Minimum amount required to perform a transfer. |

### ERC20FailedDecreaseAllowance

```solidity
error ERC20FailedDecreaseAllowance(address spender, uint256 allowance, uint256 needed)
```

_Indicates a failed `decreaseAllowance` request._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | Address that may be allowed to operate on tokens without being their owner. |
| allowance | uint256 | Amount of tokens a `spender` want to operate with. |
| needed | uint256 | Amount required to decrease the allowance. |

### ERC20PermitInvalidNonce

```solidity
error ERC20PermitInvalidNonce(address account, uint256 nonce)
```

_Indicates the nonce used for an `account` is not the expected current nonce._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address whose nonce is being checked. |
| nonce | uint256 | Expected nonce for the given `account`. |

### ERC2612ExpiredSignature

```solidity
error ERC2612ExpiredSignature(uint256 deadline)
```

_Indicates the expiration of a permit to be used._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| deadline | uint256 | Expiration time limit in seconds. |

### ERC2612InvalidSigner

```solidity
error ERC2612InvalidSigner(address signer, address owner)
```

_Indicates the mismatched owner when validating the signature._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | Address of the signer recovered. |
| owner | address | Address of the owner expected to match `signer`. |

