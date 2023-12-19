# docs: research gas and cost efficiency for event emission 

## How I calculated the gas usage?

- Example:

```
uint256 startGas = gasleft();

// code

gasUsed = startGas - gasleft();
```

## Prepare a spreadsheet with the gas usage based on the current and proposed events emitted and set for a comparison.

- In the document I separeted a comparison about the options to emit events :)

## Estimate the gas when calling createSwap and record their gas usage.

- When we call the "createSwap" event with the current parameters (id, owner and expiry) the gas usage is 1932.

```
event SwapCreated(
    uint256 indexed id,
    address indexed owner,
    uint256 indexed expiry
);
```

```
emit SwapCreated(swapId, msg.sender, swap.expiry);
```

- But we can optimize with assembly, so the gas usage can be: 1919

```
//keccak-256(SwapCreated(uint256,address,uint256))
bytes32 private constant EVENT_SWAP_CREATED_SIGNATURE =
    0xecac413765eac3982e66e569ad3a200e6b3f188ac4d7d44cc5da667779ca8d05;
```

```
uint256 swapExpiry = swap.expiry;
assembly {
    log4(0x00, 0x00, EVENT_SWAP_CREATED_SIGNATURE, swapId, caller(), swapExpiry)
}
```

## Take measures of the gas usage.

- I change the emit of events to use assembly to reduce the gas usage.

## Add the allowed field in the events. Take Measure.

- Gas usage with Solidity: 2702

```
event SwapCreated(
    uint256 indexed id,
    address indexed owner,
    uint256 indexed expiry,
    address allowed
);
```

``` 
emit SwapCreated(swapId, msg.sender, swap.expiry, swap.allowed);
```

- But we can optimize with assembly, so the gas usage can be: 2502

```
//keccak-256(SwapCreated(uint256,address,uint256,address))
bytes32 private constant EVENT_SWAP_CREATED_SIGNATURE =
    0x43a58bfac3282e5ce3bfd714c5bc0ddff8d6f2cd049db0b02a25d7cdd5026efb;
```

```
uint256 swapExpiry = swap.expiry;
address allowed = swap.allowed;
assembly {
    mstore(0x00, allowed)
    log4(0x00, 0x20, EVENT_SWAP_CREATED_SIGNATURE, swapId, caller(), swapExpiry)
}
```

## Add the bidding and asking field in the events. Take Measure.

- Gas usage with Solidity: 7646

```
event SwapCreated(
    uint256 indexed id,
    address indexed owner,
    uint256 indexed expiry,
    address allowed,
    ISwap.Asset[] biding,
    ISwap.Asset[] asking
);
```

```
emit SwapCreated(swapId, msg.sender, swap.expiry, swap.allowed, swap.biding, swap.asking);
```

## Add the price of ETH at $2.200 and calculate the gas cost in dollars.

- I don't know how I can make this setting the ETH value. (help me please :) 

# Conclusion

- After the study about gas usage in the swaplace, I came to the conclusion that we can add the "allowed" field in the "SwapCreated" event, but if we add the "biding" and "asking" fields, we will increase a lot the gas usage in the emit of events, so I this PR I added the "allowed" field in the swap created event and refactored all events to use assembly to reduce the gas usage.

- And about the "biding" and "asking" fields, I think that is have a lot of gas usage and I'm studying about how we can emit the event with assembly there paramters, I tried but I couldn't, I'm trying yet :)

- If possible, I need your review about this PR :), I'm ready to fix/improve something and work togheter!!!