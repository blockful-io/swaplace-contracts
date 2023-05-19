# Swaplace

## Context

In this new project, Blockful is a P2P Ownerless and Feeles MarketPlace:

Summarized:

A) Users propose a trade of any asset.

B) Users accept available trades.

Detailed:

A) User call public pure function `composeTrade`.

B) User provides allowances for the biding assets.

C) Returned Trade struct is used to call `createTrade`.

D) Trade acceptee provides allowances for asked assets.

D) `tradeId` is used to accept the trade.

E) Assets are swapped and the trade becomes unavailable.

### TLDR:

- The contracts cannot be upgraded.
- The contracts have no ownership.
- The contracts don't charge fees.
- Complex mechanics should be built by the community using the interface of Swaplace.
- There are no external contract dependencies.
- The protocol operates using allowances.

## System Actors

### Users and Contracts

Both EOA and Contracts can access all functions in the contract.

## Features

- Create Trade
- Accept Trade
- Cancel Trade
- Make Asset
- Make Trade
- Compose Trade
- GetTrade
- GetTradesBy

### Create Trade

The caller can store a trade request in the contract. One must give the contract allowance when transferring assets. Nevertheless, trades require a minimum expiration of 1 day.

### Accept Trade

The caller can accept any trade if the asked assets match the sender's ownership. The `tradeId` must be provided and the allowances of the sender must be in place.

### Cancel Trade

Provide the `tradeId` and be the trade owner to cancel a trade at will. It sets the trade as expired. Notice that the allowances won't dismiss, but new ones can take their place.

### Make Asset

Easily create and return the Asset type to use in your trade by calling this function. An Asset is a struct holding an address, an amount or id and an asset type, which can be ERC20 or ERC721.

```solidity
struct Asset {
    address addr;
    uint256 amountOrIdOrCall;
    AssetType assetType;
}
```

### Make Trade

A trade carries two arrays of Asset types, an owner and the expiry period in seconds. One can call `makeAsset` method to return the Asset types and use them as input when calling `makeTrade`, which will return the Trade struct used when proposing a trade.

The usage is on-chain focused, but when working with off-chain, the Trade struct should be built using methods not involving calling the blockchain multiple times.

### Compose Trade

Similar to `makeTrade`, compose trade will build the entire trade in a single function and return the Trade struct. Different from the make trade function, which requires pre-built assets, `composeTrade` will receive as parameters all the data from the assets involved in the trade in three arrays of data, corresponding to the Asset struct requirement.

To avoid having six arrays as parameters for both assets bided or asked, both of them should be placed in the same array and then specify the `uint256` integer representing the place at the index where the assets bided will turn assets asked. The variable `indexFlipToAsking` is the length of bided assets and also the beginning index of the assets being asked to fulfill the trade.

```solidity
function composeTrade(
    address owner,
    uint256 expiry,
    address[] memory addrs,
    uint256[] memory amountsOrIdsOrCalls,
    AssetType[] memory assetTypes,
    uint256 indexFlipToAsking
) public pure returns (Trade memory)
```

### Get Trade

Return the trade struct info by providing the `tradeId`.

### Get Trades By

Return the trades created by providing an `address`.

## Setup

Install dependencies.

```
yarn
npm i
```

### Test

The project is being tested in localhost.

```
npx hardhat test
```

## Team Contact

[Blockful](https://blockful.io)

Dex
Swaplace
Audit SoulPrime, DeTask
Designer, Layout
Cassino
