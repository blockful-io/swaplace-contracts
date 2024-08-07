# Solidity API

## ISwapFactory

_Interface of the {SwapFactory} implementation._

### makeAsset

```solidity
function makeAsset(address addr, uint256 amountOrId) external pure returns (struct ISwap.Asset)
```

_Make an {ISwap-Asset} struct to work with token standards._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | is the address of the token asset. |
| amountOrId | uint256 | is the amount of tokens or the ID of the NFT. |

### make1155Asset

```solidity
function make1155Asset(address addr, uint120 tokenId, uint120 tokenAmount) external pure returns (struct ISwap.Asset)
```

_Make an {ISwap-Asset} struct to work with token standards.

NOTE: Different from the {makeAsset} function, this function is used to
encode the token ID and token amount into a single uint256. This is made
to work with the ERC1155 standard._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | is the address of the token asset. |
| tokenId | uint120 | is the ID of the ERC1155 token. |
| tokenAmount | uint120 | is the amount of the ERC1155 token. |

### makeSwap

```solidity
function makeSwap(address owner, address allowed, uint32 expiry, uint8 recipient, uint56 value, struct ISwap.Asset[] assets, struct ISwap.Asset[] asking) external view returns (struct ISwap.Swap)
```

_Build a swap struct to use in the {Swaplace-createSwap} function.

Requirements:

- `expiry` cannot be in the past._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | is the address that created the Swap. |
| allowed | address | is the address that can accept the Swap. If the allowed  address is the zero address, then anyone can accept the Swap. |
| expiry | uint32 | is the timestamp that the Swap will be available to accept. |
| recipient | uint8 | is the address that will receive the ETH. `0` for the acceptee and `1<>255` for the owner. |
| value | uint56 | is the amount of ETH that the recipient will receive. Maximum of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals. |
| assets | struct ISwap.Asset[] |  |
| asking | struct ISwap.Asset[] |  |

### encodeAsset

```solidity
function encodeAsset(uint120 tokenId, uint120 tokenAmount) external pure returns (uint256 amountAndId)
```

_Encode `tokenId` and `tokenAmount` into a single uint256 while adding a flag
to indicate that it's an ERC1155 token.

NOTE: The flag is set to 0xFFFFFFFF._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint120 | is the ID of the ERC1155 token. |
| tokenAmount | uint120 | is the amount of the ERC1155 token. |

### decodeAsset

```solidity
function decodeAsset(uint256 amountAndId) external pure returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount)
```

_Decode `amountOrId` returning the first 4 bytes to try match with 0xFFFFFFFF.
If the flag is set to 0xFFFFFFFF, then it's an ERC1155 standard, otherwise it's
assumed to be an ERC20 or ERC721.

NOTE: If it's an ERC1155 token, then the next 120 bits are the token ID and the next
120 bits are the token amount.

WARNING: Swaplace cannot handle ERC1155 tokens where the ID or the amount is greater
than 120 bits._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountAndId | uint256 | is the amount of tokens and the ID of the ERC1155 token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenType | uint16 | is the flag to indicate the token standard. |
| tokenId | uint256 | is the ID of the ERC1155 token. |
| tokenAmount | uint256 | is the amount of the ERC1155 token. |

### encodeConfig

```solidity
function encodeConfig(address allowed, uint32 expiry, uint8 recipient, uint56 value) external pure returns (uint256 config)
```

_This function uses bitwise to return an encoded uint256 of the following parameters._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| allowed | address | address is the address that can accept the Swap. If the allowed   address is the zero address, then anyone can accept the Swap. |
| expiry | uint32 | date is the timestamp that the Swap will be available to accept. |
| recipient | uint8 | is the address that will receive the ETH as type uint8. If the recipient is equals to 0, the acceptee will receive the ETH. If the recipient is between 1<>255 then the recipient will be the owner of the Swap. |
| value | uint56 | is the amount of ETH that the recipient will receive with a maximum of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals. |

### decodeConfig

```solidity
function decodeConfig(uint256 config) external pure returns (address allowed, uint32 expiry, uint8 recipient, uint56 value)
```

_Decode `config` into their respective variables._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| config | uint256 | is the encoded uint256 configuration of the Swap. |

