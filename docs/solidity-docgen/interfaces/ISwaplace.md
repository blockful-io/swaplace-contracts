# Solidity API

## ISwaplace

Interface of the {Swaplace} implementation.

### SwapCreated

```solidity
event SwapCreated(uint256 swapId, address owner, address allowed, uint256 expiry)
```

Emitted when a new Swap is created.

### SwapAccepted

```solidity
event SwapAccepted(uint256 swapId, address acceptee)
```

Emitted when a Swap is accepted.

### SwapCanceled

```solidity
event SwapCanceled(uint256 swapId, address owner)
```

Emitted when a Swap is canceled.

### createSwap

```solidity
function createSwap(struct ISwap.Swap Swap) external returns (uint256)
```

Allow users to create a Swap. Each new Swap self-increments its ID by one.

Requirements:

- `owner` must be the caller address.
- `expiry` should be bigger than timestamp.
- `biding` and `asking` must not be empty.

Emits a {SwapCreated} event.

### acceptSwap

```solidity
function acceptSwap(uint256 swapId) external returns (bool)
```

Accepts a Swap. Once the Swap is accepted, the expiry is set
to zero to avoid reutilization.

Requirements:

- `allowed` must be the zero address or match the caller address.
- `expiry` must be bigger than timestamp.
- `biding` assets must be allowed to transfer.
- `asking` assets must be allowed to transfer.

Emits a {SwapAccepted} event.

NOTE: The expiry is set to 0, because if the Swap is expired it
will revert, preventing reentrancy attacks.

### cancelSwap

```solidity
function cancelSwap(uint256 swapId) external
```

Cancels an active Swap by setting the expiry to zero.

Expiry with 0 seconds means that the Swap doesn't exist
or is already canceled.

Requirements:

- `owner` must be the caller adress.
- `expiry` must be bigger than timestamp.

Emits a {SwapCanceled} event.

### getSwap

```solidity
function getSwap(uint256 swapId) external view returns (struct ISwap.Swap)
```

Retrieves the details of a Swap based on the `swapId` provided.

NOTE: If the Swaps doesn't exist, the values will be defaulted to 0.
You can check if a Swap exists by checking if the `owner` is the zero address.
If the `owner` is the zero address, then the Swap doesn't exist.
