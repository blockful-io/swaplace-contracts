# ✧ Accepting

### AcceptSwap

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



**Parameters**



| Name     | Type    | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| swapId   | uint256 | is the ID of the Swap to be accepted.                |
| receiver | address | is the address that will receive the trading assets. |

| Name     | Type    | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| swapId   | uint256 | is the ID of the Swap to be accepted.                |
| receiver | address | is the address that will receive the trading assets. |
