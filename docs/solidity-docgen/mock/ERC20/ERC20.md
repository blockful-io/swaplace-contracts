# Solidity API

## ERC20

_Lightweight ERC20 with Permit extension._

### constructor

```solidity
constructor(string name_, string symbol_) internal
```

_Sets the values for {name} and {symbol}._

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the symbol of the token, usually a shorter version of the
name._

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the default value returned by this function, unless
it's overridden.

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_See {IERC20-totalSupply}._

### balanceOf

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

_See {IERC20-balanceOf}._

### allowance

```solidity
function allowance(address owner, address spender) public view virtual returns (uint256)
```

_See {IERC20-allowance}._

### nonces

```solidity
function nonces(address owner) public view virtual returns (uint256)
```

_Returns the current nonce of an address._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() public view virtual returns (bytes32)
```

_See {IERC20Permit-DOMAIN_SEPARATOR}._

### approve

```solidity
function approve(address spender, uint256 value) public virtual returns (bool)
```

_See {IERC20-approve}.

NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
`transferFrom`. This is semantically equivalent to an infinite approval._

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool)
```

_See {IERC20-increaseAllowance}._

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 requestedDecrease) public virtual returns (bool)
```

_See {IERC20-decreaseAllowance}.

Requirements:

- `spender` must have allowance for the caller of at least
`requestedDecrease`._

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual returns (bool)
```

_See {IERC20Permit-permit}.

Requirements:

- `spender` cannot be the zero address.
- `deadline` must be a timestamp in the future.
- `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
over the EIP712-formatted function arguments.
- the signature must use ``owner``'s current nonce (see {IERC20Permit-nonces})._

### _mint

```solidity
function _mint(address to, uint256 value) internal
```

_Creates an `value` of tokens and assigns them to `to` by creating supply.

Emits a {Transfer} event with `from` set to the zero address._

### _burn

```solidity
function _burn(address from, uint256 value) internal
```

_Destroys an `value` of tokens from `from` by lowering the total supply.

Requirements:

- `from` must have a balance of at least `value`.

Emits a {Transfer} event with `to` set to the zero address._

### transfer

```solidity
function transfer(address to, uint256 value) public virtual returns (bool)
```

_See {IERC20-transfer}.

Requirements:

- the caller must have a balance of at least `value`._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) public virtual returns (bool)
```

_See {IERC20-transferFrom}.

Requirements:

- `from` must have a balance of at least `value`.
- the caller must have allowance for `from`'s tokens of at least
`value`.

NOTE: Does not update the allowance if the current allowance
is the maximum `uint256`._

### permitTransfer

```solidity
function permitTransfer(address from, address to, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual returns (bool)
```

_See {IERC20Permit-permitTransfer}.

Requirements:

- `deadline` must be a timestamp in the future.
- `v`, `r` and `s` must be a valid `secp256k1` signature from `from`
over the EIP712-formatted function arguments.
- the signature must use `from`'s current nonce (see {IERC20Permit-nonces})._

