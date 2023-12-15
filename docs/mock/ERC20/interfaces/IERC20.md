# Solidity API

## IERC20

_Interface of the ERC20 standard as defined in the EIP._

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

_Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance._

### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

_Emitted when `value` tokens are moved from `from` to `to`.

NOTE: `value` can be zero._

### name

```solidity
function name() external view returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the symbol of the token._

### decimals

```solidity
function decimals() external view returns (uint8)
```

_Returns the decimals places of the token._

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the value of tokens in existence._

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

_Returns the value of tokens owned by `account`._

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.

NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
`transferFrom`. This is semantically equivalent to an infinite approval._

### approve

```solidity
function approve(address spender, uint256 value) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) external returns (bool)
```

_Atomically increases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {IERC20-Approval} event indicating the updated allowance._

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 requestedDecrease) external returns (bool)
```

_Atomically decreases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

NOTE: Although this function is designed to avoid double spending with {approval},
it can still be frontrunned, preventing any attempt of allowance reduction._

### transfer

```solidity
function transfer(address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to`.
Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the
allowance mechanism. `value` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

