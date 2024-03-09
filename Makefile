## Running compile first to generate the type-chain types
compile:
	yarn compile

## Deploying Swaplace contract to the desired network
## Please specify which network following the available ones in hardhat.config.ts
network=hardhat
deploy-swaplace:
	make compile
	yarn deploy:swaplace ${network}

## The mocks are essential to run the tests precisely, we are swapping nonetherless
deploy-mocks:
	make compile
	yarn deploy:mocks ${network}


