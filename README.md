# Swaplace

[![Tests](https://github.com/blockful-io/swaplace-contracts/actions/workflows/tests.yml/badge.svg)](https://github.com/blockful-io/swaplace-contracts/actions/workflows/tests.yml)
[![Fuzz Testing](https://github.com/blockful-io/swaplace-contracts/actions/workflows/fuzz-testing.yml/badge.svg)](https://github.com/blockful-io/swaplace-contracts/actions/workflows/fuzz-testing.yml)

This repository contains the core smart contracts for the Swaplace Protocol; The lightest Swap protocol in the market.

### TL;DR

-   Contracts cannot be upgraded.
-   Contracts have no ownership.
-   Contracts don't charge fees.
-   There are no external contract dependencies.
-   The protocol operates using available allowances.

## Incentives

This repository is subjected to incentives for the community to contribute to the project. The incentive distribution and amount are being discussed but the eligibility has already started.

## Features

- **Create Swaps**: A Swap has an `owner` and an `allowed` address. The `owner` is the one that can cancel the swap while the `allowed` address is the one that can execute the swap but anyone can accept if it's set as the Zero Address. A Swap also has an `expiry` period in seconds. The Swap can only be executed before the expiry period is reached. The `Asset` type represents on one hand the bidding assets and on the other hand the asking assets.

```
    struct Swap {
        address owner;
        address allowed;
        uint256 expiry;
        Asset[] biding;
        Asset[] asking;
    }
```

- **Accept Swaps**: You can accept swaps that have an `allowed` address equal to your or the `Zero Address`. As long as you provide the asked assets.

- **Cancel Swaps**: You can cancel swaps that haven't been `expired`.

- **Swap Factory**: Aids new swap creations to be used on Swaplace. Check `contracts/SwapFactory.sol`.

## Setup

You should install the dependencies using Yarn (used in the project) or npm to deploy this code. The project uses Hardhat as a development environment. Which relies on Node.js (Recommended version [v18.16.0](https://nodejs.org/download/release/v18.16.0/)).

To make sure that NodeJS is installed correctly, open the integrated terminal and run the following command:

```
node -v
```

### Yarn:

Install Yarn globally and check if the version appears:

```
npm install --global yarn
yarn --version
```

Install the dependencies using Yarn:

```
yarn install
```

### npm:

Install the dependencies using npm:

```
npm install
```

### Environment Variables

The project comes with a `.env.example` file. You should rename it to `.env` and fill the variables with your values. Most RPC providers offer free testnet nodes. You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) to get a free node.

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

## Contributing

- To know more about how you can contribute [see our notion page](https://blockful.notion.site/Swaplace-Call-for-Contributors-6e4895d2a7264f679439ab2c124603fe).