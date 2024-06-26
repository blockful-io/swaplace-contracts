# Encode ERC1155 Asset

### make1155Asset( )

```solidity
function make1155Asset(address addr, uint120 tokenId, uint120 tokenAmount) external pure returns (struct ISwap.Asset)
```

Make an {ISwap-Asset} struct to work with token standards.

{% hint style="info" %}
**NOTE**\
Different from the {makeAsset} function, this function is used to encode the token ID and token amount into a single uint256. This is made to work with the ERC1155 standard.
{% endhint %}

#### Parameters

<table><thead><tr><th>Name</th><th width="168">Type</th><th>Description</th></tr></thead><tbody><tr><td>addr</td><td>address</td><td>is the address of the token asset.</td></tr><tr><td>tokenId</td><td>uint120</td><td>is the ID of the ERC1155 token.</td></tr><tr><td>tokenAmount</td><td>uint120</td><td>is the amount of the ERC1155 token.</td></tr></tbody></table>
