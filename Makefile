## Running compile to generate the abi's and the type-chain types.
compile:
	yarn compile

## Please specify which network following the available ones in hardhat.config.ts.
network=sepolia

## Deploying Swaplace contract to the desired network.
swaplace:
	yarn deploy:swaplace ${network}

## The mocks are essential to run the tests. We will be swapping token assets.
mocks:
	yarn deploy:mocks ${network}

## Mock deployments are a requirement to run the mint script, which will fund the signer's wallet.
mint:
	yarn mint ${network}

## Mock deployments are a requirement to run the mint script, which will fund the signer's wallet.
approve:
	yarn approve ${network}

## Create a swap on the swaplace contract and save the swap id in the .env file.
swap:
	yarn create-swap ${network}

## Accept a swap on the swaplace contract based on the swap id in the .env file.
accept:
	yarn accept-swap ${network}

## Cancel a swap on the swaplace contract based on the swap id in the .env file.
cancel:
	make compile
	yarn cancel-swap ${network}

## Run the entire test suite.
## Running a local node by using `npx hardhat node` in a separated terminal is
## a requirement to run the tests in the localhost network. 
test-suite-runner:
	yarn clean
	yarn compile
	make swaplace
	make mocks
	make mint
	make approve
	make swap
	make accept
	make swap
	make cancel

## Feed existing Swaplace contract with some transactions.
## make mint
transactions:
	make approve
	make swap
	make accept
	make swap
	make cancel