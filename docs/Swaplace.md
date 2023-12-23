# Solidity API

## Swaplace

Swaplace is a Decentralized Feeless DEX. It has no owners, it cannot be stoped.
Its cern is to facilitate swaps between virtual assets following the ERC standard.
Users can propose or accept swaps by allowing Swaplace to move their assets using the
`approve` function or `permit` if available.

### createSwap

```solidity
function createSwap(struct ISwap.Swap swap) public returns (uint256)
```

_See {ISwaplace-createSwap}._

### acceptSwap

```solidity
function acceptSwap(uint256 swapId) public returns (bool)
```

_See {ISwaplace-acceptSwap}._

### cancelSwap

```solidity
function cancelSwap(uint256 swapId) public
```

_See {ISwaplace-cancelSwap}._

### getSwap

```solidity
function getSwap(uint256 swapId) public view returns (struct ISwap.Swap)
```

_See {ISwaplace-getSwap}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceID) external pure returns (bool)
```

_See {IERC165-supportsInterface}._

### totalSwaps

```solidity
function totalSwaps() public view returns (uint256)
```

_Getter function for \_totalSwaps._
