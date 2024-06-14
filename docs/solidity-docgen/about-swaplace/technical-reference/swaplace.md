# ✧ Swaplace

Swaplace is a decentralized, cross-chain and feeless swap dApp focused on the OTC and gaming markets. As it is ownerless, it cannot be stopped. Its core function is to facilitate swaps between virtual assets using the ERC standard. As simple as that.

_Users can propose or accept swaps by allowing Swaplace to move their assets using the `approve`, `permit` or similar functions._

* [Source Code](https://github.com/blockful-io/swaplace-contracts/blob/develop/contracts/Swaplace.sol)

### getSwap()

```solidity
function getSwap(uint256 swapId) public view returns (struct ISwap.Swap)
```

_See_[ ](interfaces/iswaplace.md#getswap)[_{ISwaplace-getSwap}_](#user-content-fn-1)[^1][_._](interfaces/iswaplace.md#getswap)

### totalSwaps()

```solidity
function totalSwaps() public view returns (uint256)
```

Getter function for _totalSwaps._

### createSwap()

```solidity
function createSwap(struct ISwap.Swap swap) public payable returns (uint256)
```

_See_ [_{ISwaplace-createSwap}_](#user-content-fn-2)[^2]_._

### acceptSwap()

```solidity
function acceptSwap(uint256 swapId, address receiver) public payable returns (bool)
```

_See_[ _{ISwaplace-acceptSwap}._](#user-content-fn-3)[^3]

### cancelSwap()

```solidity
function cancelSwap(uint256 swapId) public
```

_See_ [_{ISwaplace-cancelSwap}._](#user-content-fn-4)[^4]

### \_payNativeEth()

```solidity
function _payNativeEth(address receiver, uint256 value) internal
```

_Send an amount of native Ether to the receiver address._

### \_transferFrom()

```solidity
function _transferFrom(address from, address to, struct ISwap.Asset[] assets) internal
```

Transfer multiple 'assets' from 'from' to 'to'.

`0x23b872dd` - Selector of the `transferFrom` function (ERC20, ERC721). `0xf242432a` - Selector of the `safeTransferFrom` function (ERC1155).

### supportsInterface()

```solidity
function supportsInterface(bytes4 interfaceID) external pure returns (bool)
```

_See_ [_{IERC165-supportsInterface}_](#user-content-fn-5)[^5]_._

## Summary

**Core Features**

* **Decentralized and Feeless**: Swaplace eliminates intermediaries and transaction fees, providing a direct peer-to-peer trading environment.
* **Ownerless**: The protocol is designed to operate autonomously, free from centralized control or shutdown risks.
* **Support for ERC Standards**: It facilitates swaps across various ERC-compliant assets, including ERC20 (fungible tokens), ERC721 (non-fungible tokens), and ERC1155 (multi-token standards).

**Key Functions**

* **`getSwap()`**: Retrieves details of a swap by its unique identifier (`swapId`).
* **`totalSwaps()`**: Returns the count of all swaps created within the platform.
* **`createSwap()`**: Allows users to initiate a new swap by specifying the swap terms and conditions.
* **`acceptSwap()`**: Enables users to accept an existing swap offer, completing the trade.
* **`cancelSwap()`**: Cancels an active swap, making it unavailable for acceptance.
* **`_payNativeEth()`**: Internal function to send native Ether to a specified receiver.
* **`_transferFrom()`**: Transfers multiple assets from one address to another, supporting different ERC standards.
* **`supportsInterface()`**: Checks if the contract supports a given interface, adhering to the ERC165 standard.

[^1]: Retrieves the details of a Swap based on the `swapId` provided.\


    **NOTE:** If the Swaps doesn't exist, the values will be defaulted to 0. You can check if a Swap exists by checking if the `owner` is a zero address. If the `owner` is a zero address, then the Swap doesn't exist.

[^2]: **Requirements:**\


    Allow users to create a Swap. Each new Swap self-increments its ID by one.

    * `owner` must be the caller's address.
    * `expiry` should be bigger than the timestamp.
    * `biding` and `asking` must not be empty.

    _Emits a {SwapCreated} event._\


[^3]: Accepts a Swap. Once the Swap is accepted, the expiry is set to zero to avoid reutilization.\


    **Requirements:**

    * `allowed` must be the zero address or match the caller's address.
    * `expiry` must be bigger than the timestamp.
    * `biding` assets must be allowed to transfer.
    * `asking` assets must be allowed to transfer.

    Emits a {SwapAccepted} event.

    NOTE: The expiry is set to 0, because if the Swap is expired it will revert, preventing reentrancy attacks.\_

[^4]: Accepts a Swap. Once the Swap is accepted, the expiry is set to zero to avoid reutilization.

    **Requirements:**

    * `allowed` must be the zero address or match the caller's address.
    * `expiry` must be bigger than the timestamp.
    * `biding` assets must be allowed to transfer.
    * `asking` assets must be allowed to transfer.

    Emits a {SwapAccepted} event.

    NOTE: The expiry is set to 0, because if the Swap is expired it will revert, preventing reentrancy attacks.\_

[^5]: Returns true if this contract implements the interface defined by `interfaceId`. \
    \
    See the corresponding [https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified\[EIP section\]](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified\[EIP%20section]) to learn more about how these IDs are created.

    \
    This function call must use less than 30, 000 gas.
