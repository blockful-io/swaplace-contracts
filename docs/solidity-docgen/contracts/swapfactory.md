# SwapFactory

SwapFactory is a helper for creating Swaps and making asset structs.

This helper can be used on and off-chain to easily create a Swap struct to be used in the {Swaplace-createSwap} function.

Swaplace uses a {ISwap-Swap} struct to represent a Swap. This struct is composed of:

* The `owner` of the Swap is the address that created the Swap.
* The `allowed` address is the address that can accept the Swap. If the allowed address is the zero address, then anyone can accept the Swap.
* The `expiry` date is the timestamp that the Swap will be available to accept.
* The `recipient` is the address that will receive the ETH as type uint8. If the recipient is equals to 0, the acceptee will receive the ETH. If the recipient is between 1<>255 then the recipient will be the owner of the Swap.
* The `value` is the amount of ETH that the recipient will receive with a maximum of 6 decimals (0.000001 ETH). The contract will fill the value up to 18 decimals.
* The `biding` are the assets that the owner is offering.
* The `asking` are the assets that the owner wants in exchange.

The Swap struct uses an {Asset} struct to represent the asset. This struct is composed of:

* The `address` of the token asset.
* The `amount` or `id` of the asset. This amount can be the amount of ERC20 tokens or the NFT ID of an ERC721.
* The `amount` and `id` can be encoded together in a single uint256, allowing the ERC1155 tokens to be swapped.



* [Source Code](https://github.com/blockful-io/swaplace-contracts/blob/develop/contracts/SwapFactory.sol)

### makeAsset()

```solidity
function makeAsset(address addr, uint256 amountOrId) public pure virtual returns (struct ISwap.Asset)
```

_See_ [_{ISwapFactory-makeAsset}_](#user-content-fn-1)[^1]_._

### make1155Asset()

```solidity
function make1155Asset(address addr, uint120 tokenId, uint120 tokenAmount) public pure virtual returns (struct ISwap.Asset)
```

_See_ [_{ISwapFactory-make1155Asset}_](#user-content-fn-2)[^2]_._

### makeSwap()

```solidity
function makeSwap(address owner, address allowed, uint32 expiry, uint8 recipient, uint56 value, struct ISwap.Asset[] biding, struct ISwap.Asset[] asking) public view virtual returns (struct ISwap.Swap)
```

_See_ [_{ISwapFactory-makeSwap}._](#user-content-fn-3)[^3]

### encodeAsset()

```solidity
function encodeAsset(uint120 tokenId, uint120 tokenAmount) public pure returns (uint256 amountAndId)
```

_See_ [_{ISwapFactory-encodeAsset}_](#user-content-fn-4)[^4]_._

### decodeAsset()

```solidity
function decodeAsset(uint256 amountOrId) public pure returns (uint16 tokenType, uint256 tokenId, uint256 tokenAmount)
```

_See_ [_{ISwapFactory-decodeAsset}._](#user-content-fn-5)[^5]

### encodeConfig()

```solidity
function encodeConfig(address allowed, uint32 expiry, uint8 recipient, uint56 value) public pure returns (uint256)
```

_See_ [_{ISwapFactory-encodeConfig}._](#user-content-fn-6)[^6]

### decodeConfig()

```solidity
function decodeConfig(uint256 config) public pure returns (address, uint32, uint8, uint56)
```

_See_ [_{ISwapFactory-decodeConfig}_](#user-content-fn-7)[^7]_._



## Summary

**Core Features**

* **Asset Struct Creation**: Facilitates the construction of asset structs for ERC20, ERC721, and ERC1155 tokens, enabling precise representation of digital assets in swaps.
* **Swap Struct Assembly**: Simplifies the generation of `Swap` structs, which are foundational for initiating swaps within the Swaplace ecosystem.
* **Encoding and Decoding Utilities**: Provides functions to encode and decode asset and configuration data efficiently, optimizing storage and retrieval processes.

**Key Functions**

* **`makeAsset()`**: Constructs an `Asset` struct for ERC20 and ERC721 tokens, taking the token address and either the token amount or NFT ID as inputs.
* **`make1155Asset()`**: Specialized function for creating `Asset` structs for ERC1155 tokens, encoding both the token ID and amount into a single `uint256`.
* **`makeSwap()`**: Assembles a `Swap` struct with detailed parameters including owner, allowed participants, expiry, recipient, value, and the assets being offered and requested.
* **`encodeAsset()` & `decodeAsset()`**: Utility functions for encoding ERC1155 token IDs and amounts into a single `uint256` and decoding them back into their original components.
* **`encodeConfig()` & `decodeConfig()`**: Functions to encode and decode swap configuration data, such as allowed addresses, expiry timestamps, recipients, and values, into and from a compact `uint256` format.

These key functionalities of `SwaplaceFactory` ensure that the process of creating and managing swaps within the Swaplace platform is streamlined and accessible, both on-chain and off-chain.

[^1]: _Make an {ISwap-Asset} struct to work with token standards._

[^2]: Make an {ISwap-Asset} struct to work with token standards.\


    **NOTE:** Different from the {makeAsset} function, this function is used to encode the token ID and token amount into a single uint256. This is made to work with the ERC1155 standard.

[^3]: _Make an {ISwap-Asset} struct to work with token standards._

[^4]: Encode `tokenId` and `tokenAmount` into a single uint256 while adding a flag to indicate that it's an ERC1155 token.\


    **NOTE:** The flag is set to 0xFFFFFFFF.

[^5]: Decode `amountOrId` returning the first 4 bytes to try match with 0xFFFFFFFF. If the flag is set to 0xFFFFFFFF, then it's an ERC1155 standard, otherwise, it's assumed to be an ERC20 or ERC721.\


    **NOTE:** If it's an ERC1155 token, then the next 120 bits are the token ID and the next 120 bits are the token amount.\


    **WARNING:** Swaplace cannot handle ERC1155 tokens where the ID or the amount is greater than 120 bits.

[^6]: _This function uses bitwise to return an encoded uint256 of the following parameters._

[^7]: _Decode `config` into their respective variables._
