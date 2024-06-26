# Native Ether

The `createSwap` function in the `Swaplace` contract allows users to create a new swap, including handling _**native Ether**_. This function ensures that the swap is created by the owner, increments the swap ID, stores the swap details, and emits a `SwapCreated` event.&#x20;

> Check the testsuit for this case [here](https://github.com/blockful-io/swaplace-contracts/blob/026d8cc3bc871936a2737e6e45ae1afb290dd05d/test/TestSwaplace.test.ts#L514)

## Step-by-Step Implementation

### Step 1: Verify the Owner

Ensure that the caller of the function is the owner of the swap. This is done by comparing the `swap.owner` with `msg.sender`.

```solidity
if (swap.owner != msg.sender) revert InvalidAddress();
```

### Step 2: Increment the Swap ID

Use inline assembly to increment the `_totalSwaps` counter. This ensures that each new swap gets a unique ID.

```solidity
assembly {
  sstore(_totalSwaps.slot, add(sload(_totalSwaps.slot), 1))
}
```

### Step 3: Store the Swap Details

Store the swap details in the `_swaps` mapping using the newly incremented swap ID.

```solidity
uint256 swapId = _totalSwaps;
_swaps[swapId] = swap;
```

### Step 4: Decode the [encoded ](../preparing/)Swap Configuration

Decode the swap configuration to extract the allowed address, recipient, and value.

```solidity
(address allowed, , uint8 recipient, uint256 value) = decodeConfig(swap.config);
```

### Step 5: Validate the Value

Check if the value is greater than zero. If it is, ensure that the value matches the `msg.value` if the recipient is zero. If the recipient is not zero, ensure that `msg.value` is zero.

```solidity
if (value > 0) {
  if (recipient == 0) {
    if (value * 1e12 != msg.value) revert InvalidValue();
  } else if (msg.value > 0) revert InvalidValue();
}
```

### Step 6: Emit the `SwapCreated` Event

Emit the `SwapCreated` event with the swap ID, owner, and allowed address.

```solidity
emit SwapCreated(swapId, msg.sender, allowed);
```

### Step 7: Return the Swap ID

Finally, return the newly created swap ID.

```solidity
return swapId;
```

> You can check the full code [here](https://github.com/blockful-io/swaplace-contracts/blob/026d8cc3bc871936a2737e6e45ae1afb290dd05d/contracts/Swaplace.sol)

