# Make Swap

### makeSwap( )

```solidity
function makeSwap(address owner, address allowed, uint32 expiry, uint8 recipient, uint56 value, struct ISwap.Asset[] assets, struct ISwap.Asset[] asking) external view returns (struct ISwap.Swap)
```

Build a swap struct to use in the {Swaplace-createSwap} function.

Requirements:

* `expiry` cannot be in the past.\_

#### Parameters

| Name      | Type                  | Description                                                                                                                                     |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| owner     | address               | is the address that created the Swap.                                                                                                           |
| allowed   | address               | is the address that can accept the Swap. If the allowed address is the zero address, then anyone can accept the Swap.                           |
| expiry    | uint32                | is the timestamp that the Swap will be available to accept.                                                                                     |
| recipient | uint8                 | is the address that will receive the ETH. `0` for the acceptee and `1<>255` for the owner.                                                      |
| value     | uint56                | is the amount of ETH that the recipient will receive. Maximum of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals. |
| assets    | struct ISwap.Asset\[] |                                                                                                                                                 |
| asking    | struct ISwap.Asset\[] |                                                                                                                                                 |

