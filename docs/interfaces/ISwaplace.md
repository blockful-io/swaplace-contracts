# Solidity API

## ISwaplace

_Interface of the {Swaplace} implementation._

### SwapCreated

```solidity
event SwapCreated(uint256 id, address owner, uint256 expiry)
```

_Emitted when a new Swap is created._

### SwapAccepted

```solidity
event SwapAccepted(uint256 id, address acceptee)
```

_Emitted when a Swap is accepted._

### SwapCanceled

```solidity
event SwapCanceled(uint256 id, address owner)
```

_Emitted when a Swap is canceled._

### createSwap

```solidity
function createSwap(struct ISwap.Swap Swap) external returns (uint256)
```

_Allow users to create a Swap. Each new Swap self-increments its id by one.

Requirements:

- `owner` must be the caller address.
- `expiry` should be bigger than timestamp.
- `biding` and `asking` must not be empty.

Emits a {SwapCreated} event._

### acceptSwap

```solidity
function acceptSwap(uint256 id) external returns (bool)
```

_Accepts a Swap. Once the Swap is accepted, the expiry is set
to zero to avoid reutilization.

Requirements:

- `allowed` must be the zero address or match the caller address.
- `expiry` must be bigger than timestamp.
- `biding` assets must be allowed to transfer.
- `asking` assets must be allowed to transfer.

Emits a {SwapAccepted} event.

NOTE: The expiry is set to 0, because if the Swap is expired it
will revert, preventing reentrancy attacks._

### cancelSwap

```solidity
function cancelSwap(uint256 id) external
```

_Cancels an active Swap by setting the expiry to zero.

Expiry with 0 seconds means that the Swap doesn't exist
or is already canceled.

Requirements:

- `owner` must be the caller adress.
- `expiry` must be bigger than timestamp.

Emits a {SwapCanceled} event._

### getSwap

```solidity
function getSwap(uint256 id) external view returns (struct ISwap.Swap)
```

_Retrieves the details of a Swap based on the `swapId` provided.

NOTE: If the Swaps doesn't exist, the values will be defaulted to 0.
You can check if a Swap exists by checking if the `owner` is the zero address.
If the `owner` is the zero address, then the Swap doesn't exist._

