# Swaplace

## Context

In this new project, Blockful is a P2P Ownerless and Feeles MarketPlace:

Summarized:

A) Users propose a Swap of any asset.

B) Users accept available Swaps.

Detailed:

A) User calls public pure function `composeSwap`.

B) User provides allowances for the biding assets.

C) Returned Swap struct is used to call `createSwap`.

D) Swap acceptee provides allowances for asked assets.

D) `swapId` is used to accept the Swap.

E) Assets are swapped and the Swap becomes unavailable.

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

- Create Swap
- Accept Swap
- Cancel Swap
- Make Asset
- Make Swap
- Compose Swap
- GetSwap

### Create Swap

The caller can store a Swap request in the contract. One must give the contract allowance when transferring assets. Nevertheless, Swaps require a minimum expiration of 1 day.

### Accept Swap

The caller can accept any Swap if the asked assets match the sender's ownership. The `swapId` must be provided and the allowances of the sender must be in place.

### Cancel Swap

Provide the `swapId` and be the Swap owner to cancel a Swap at will. It sets the Swap as expired. Notice that the allowances won't dismiss, but new ones can take their place.

### Make Asset

Easily create and return the Asset type to use in your Swap by calling this function. An Asset is a struct holding an address, an amount or id and an asset type, which can be ERC20 or ERC721.

```solidity
struct Asset {
    address addr;
    uint256 amountOrCallOrId;
    AssetType assetType;
}
```

### Make Swap

A Swap carries two arrays of Asset types, an owner and the expiry period in seconds. One can call `makeAsset` method to return the Asset types and use them as input when calling `makeSwap`, which will return the Swap struct used when proposing a Swap.

The usage is on-chain focused, but when working with off-chain, the Swap struct should be built using methods not involving calling the blockchain multiple times.

### Compose Swap

Similar to `makeSwap`, compose Swap will build the entire Swap in a single function and return the Swap struct. Different from the make Swap function, which requires pre-built assets, `composeSwap` will receive as parameters all the data from the assets involved in the Swap in three arrays of data, corresponding to the Asset struct requirement.

To avoid having six arrays as parameters for both assets bid or asked, both of them should be placed in the same array and then specify the `uint256` integer representing the place at the index where the assets bid will flip assets asked. The variable `indexFlipToAsking` is the length of bid assets and also the beginning index of the assets being asked to fulfill the Swap.

```solidity
function composeSwap(
    address owner,
    uint256 expiry,
    address[] memory addrs,
    uint256[] memory amountsOrIdsOrCalls,
    AssetType[] memory assetTypes,
    uint256 indexFlipToAsking
) public pure returns (Swap memory)
```

### Get Swap

Return the Swap struct info by providing the `swapId`.

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
