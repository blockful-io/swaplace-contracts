# ✧ Canceling

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

**Parameters**

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| swapId | uint256 | is the ID of the Swap to be canceled. |
