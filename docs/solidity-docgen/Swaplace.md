# Solidity API

## Swaplace

_Swaplace is a decentralized and feeless DEX/OTC. Ownerless, it cannot be stopped.
It's core is to facilitate swaps between virtual assets using the ERC standard.
Users can propose or accept swaps by allowing Swaplace to move their assets using the
`approve`, `permit` or similar functions._

### getSwap

```solidity
function getSwap(uint256 swapId) public view returns (struct ISwap.Swap)
```

_See {ISwaplace-getSwap}._

### totalSwaps

```solidity
function totalSwaps() public view returns (uint256)
```

_Getter function for _totalSwaps._

### createSwap

```solidity
function createSwap(struct ISwap.Swap swap) public payable returns (uint256)
```

_See {ISwaplace-createSwap}._

### acceptSwap

```solidity
function acceptSwap(uint256 swapId, address receiver) public payable returns (bool)
```

_See {ISwaplace-acceptSwap}._

### cancelSwap

```solidity
function cancelSwap(uint256 swapId) public
```

_See {ISwaplace-cancelSwap}._

### _payNativeEth

```solidity
function _payNativeEth(address receiver, uint256 value) internal
```

_Send an amount of native Ether to the receiver address._

### _transferFrom

```solidity
function _transferFrom(address from, address to, struct ISwap.Asset[] assets) internal
```

_Transfer multiple 'assets' from 'from' to 'to'.

`0x23b872dd` - Selector of the `transferFrom` function (ERC20, ERC721).
`0xf242432a` - Selector of the `safeTransferFrom` function (ERC1155)._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceID) external pure returns (bool)
```

_See {IERC165-supportsInterface}._

