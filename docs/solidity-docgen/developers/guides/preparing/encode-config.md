# Encode config

### encodeConfig( )

```solidity
function encodeConfig(address allowed, uint32 expiry, uint8 recipient, uint56 value) external pure returns (uint256 config)
```

_This function uses bitwise to return an encoded uint256 of the following parameters._

#### Parameters

<table><thead><tr><th>Name</th><th width="150">Type</th><th>Description</th></tr></thead><tbody><tr><td>allowed</td><td>address</td><td>address is the address that can accept the Swap. If the allowed address is the zero address, then anyone can accept the Swap.</td></tr><tr><td>expiry</td><td>uint32</td><td>date is the timestamp that the Swap will be available to accept.</td></tr><tr><td>recipient</td><td>uint8</td><td>is the address that will receive the ETH as type uint8. If the recipient is equals to 0, the acceptee will receive the ETH. If the recipient is between 1&#x3C;>255 then the recipient will be the owner of the Swap.</td></tr><tr><td>value</td><td>uint56</td><td>is the amount of ETH that the recipient will receive with a maximum of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.</td></tr></tbody></table>
