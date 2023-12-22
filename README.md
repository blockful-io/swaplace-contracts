# Swaplace

[![Tests](https://github.com/blockful-io/swaplace-contracts/actions/workflows/tests.yml/badge.svg)](https://github.com/blockful-io/swaplace-contracts/actions/workflows/tests.yml)
[![Fuzz Testing](https://github.com/blockful-io/swaplace-contracts/actions/workflows/fuzz-testing.yml/badge.svg)](https://github.com/blockful-io/swaplace-contracts/actions/workflows/fuzz-testing.yml)

This repository contains the core smart contracts for the Swaplace Protocol; The lightest Swap protocol in the market.

## Incentives

This repository is subjected to incentives for the community to contribute to the project. The incentive distribution and amount are being discussed but the eligibility has already started.

### TL;DR

-   Contracts cannot be upgraded.
-   Contracts have no ownership.
-   Contracts don't charge fees.
-   There are no external contract dependencies.
-   The protocol operates using available allowances.

## Setup

You should install the dependencies using Yarn to deploy this code to a local testnet. The project uses Hardhat as a development environment. Which relies on Node.js (Recommended v18.16.0).

```
npm install --global yarn
yarn --version
```

Later on, install the dependencies using Yarn.

```
yarn install
```

### Environment Variables

The project comes with a `.env.example` file. You should rename it to `.env` and fill the variables with your own values. Most RPC providers offer free testnet nodes. You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) to get a free node.

WARNING: The private keys used in the `.env` file are from hardhat accounts. They are not meant to be used in production.

### Testing and Deploying

Run the tests in `localhost` or try the contracts in a desired network by specifying the network name in `hardhat.config.js`.

```
yarn test
yarn testnet <network>
```

Deploy the contracts in the desired network according to the networks available in `hardhat.config.js`.

```
yarn deploy <network>
```

### TLDR:

-   Contracts cannot be upgraded.
-   Contracts have no ownership.
-   Contracts don't charge fees.
-   There are no external contract dependencies.
-   The protocol operates using available allowances.

### Making Assets

An `Asset` is a struct that stores the contract address and the amount or ID of ERC20 or ERC721.

```
struct Asset {
    address addr;
    uint256 amountOrId;
}
```

### Making Swaps

A Swap also has an `owner` and an `allowed` address. The `owner` is the one that can cancel the swap while the `allowed` address is the one that can execute the swap but anyone can accept if
it`s set as the Zero Address.

A Swap also has an `expiry` period in seconds. The Swap can only be executed before the expiry period is reached.

The `Asset` type represents in one hand the asset being bidded and the other for the asset being asked.

```
    struct Swap {
        address owner;
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
```
