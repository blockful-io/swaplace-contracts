# ISwaplace

_Interface of the {Swaplace} implementation._

* [Source Code](https://github.com/blockful-io/swaplace-contracts/blob/develop/contracts/interfaces/ISwaplace.sol)

### SwapCreated

```solidity
event SwapCreated(uint256 swapId, address owner, address allowed)
```

_Emitted when a new Swap is created._

### SwapAccepted

```solidity
event SwapAccepted(uint256 swapId, address owner, address allowed)
```

_Emitted when a Swap is accepted._

### SwapCanceled

```solidity
event SwapCanceled(uint256 swapId, address owner)
```

_Emitted when a Swap is canceled._

### createSwap

```solidity
function createSwap(struct ISwap.Swap Swap) external payable returns (uint256)
```

Requirements:

Allow users to create a Swap. Each new Swap self-increments its ID by one.

* `owner` must be the caller's address.
* `expiry` should be bigger than the timestamp.
* `biding` and `asking` must not be empty.

Emits a {SwapCreated} event.

### acceptSwap

```solidity
function acceptSwap(uint256 swapId, address receiver) external payable returns (bool)
```

Accepts a Swap. Once the Swap is accepted, the expiry is set to zero to avoid reutilization.

Requirements:

* `allowed` must be the zero address or match the caller's address.
* `expiry` must be bigger than the timestamp.
* `biding` assets must be allowed to transfer.
* `asking` assets must be allowed to transfer.

Emits a {SwapAccepted} event.

{% hint style="info" %}
**NOTE**

The expiry is set to 0, because if the Swap is expired it will revert, preventing reentrancy attacks.
{% endhint %}

### cancelSwap

```solidity
function cancelSwap(uint256 swapId) external
```

Cancels an active Swap by setting the expiry to zero.

Expiry with 0 seconds means that the Swap doesn't exist or is already canceled.

Requirements:

* `owner` must be the caller's address.
* `expiry` must be bigger than the timestamp.

Emits a {SwapCanceled} event.

### getSwap

```solidity
function getSwap(uint256 swapId) external view returns (struct ISwap.Swap)
```

Retrieves the details of a Swap based on the `swapId` provided.

{% hint style="info" %}
**NOTE**

If the Swaps don't exist, the values will be defaulted to 0. You can check if a Swap exists by checking if the `owner` is a zero address. If the `owner` is a zero address, then the Swap doesn't exist.
{% endhint %}
