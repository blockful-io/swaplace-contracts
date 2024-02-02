# Solidity API

## ITransfer

_Generalized Interface for {IERC20} and {IERC721} `transferFrom` functions._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amountOrId) external
```

_See {IERC20-transferFrom} or {IERC721-transferFrom}.

Moves an `amount` for ERC20 or `tokenId` for ERC721 from `from` to `to`.

Emits a {Transfer} event._

