# Solidity API

## Swaplace

___ _    ___   ___ _  _____ _   _ _
 | _ ) |  / _ \ / __| |/ / __| | | | |
 | _ \ |_| (_) | (__| ' <| _|| |_| | |__
 |___/____\___/ \___|_|\_\_|  \___/|____|

_- Swaplace is a Decentralized Feeless DEX. It has no owners, it cannot be stoped.
Its core idea is to facilitate swaps between virtual assets following the ERC standard.
Users can propose or accept swaps by allowing Swaplace to move their assets using the
`approve` function of the Token standard or `permit` if available._

### swapId

```solidity
uint256 swapId
```

_Swap Identifier counter._

### createSwap

```solidity
function createSwap(struct ISwap.Swap swap) public returns (uint256)
```

_See {ISwaplace-createSwap}._

### acceptSwap

```solidity
function acceptSwap(uint256 id) public returns (bool)
```

_See {ISwaplace-acceptSwap}._

### cancelSwap

```solidity
function cancelSwap(uint256 id) public
```

_See {ISwaplace-cancelSwap}._

### getSwap

```solidity
function getSwap(uint256 id) public view returns (struct ISwap.Swap)
```

_See {ISwaplace-getSwap}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceID) external pure returns (bool)
```

_See {IERC165-supportsInterface}._

