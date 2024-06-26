# ✧ Overview

## Run your local Swaplace

Follow trhough [this ](setting-up-your-local-environment.md)guide to learn how to run the Swaplace locally

## Encoding data and making swap

Swaplace provides utility functions to efficiently encode and decode assets and configuration data, optimizing storage and retrieval processes. To encode an asset, it uses the [encodeConfig( )](preparing/encode-config.md) and [make1155Asset( ) ](preparing/encode-erc1155-asset.md#make1155asset)functions to convert ERC20, ERC721 and ERC1155 token IDs and amounts into a single data unit.&#x20;

When [making a swap](preparing/make-swap.md), the smart contract needs to assemble a Swap struct with detailed parameters including the _**owner**_, _**allowed participants**_, _**expiry date**_, _**recipient**_, _**value**_, and the _**assets**_ being offered and requested. This structured approach ensures that all necessary information is included for a successful swap.

## Accepting and canceling swaps

Swaplace allows users to [accept ](accepting.md)or [cancel ](canceling.md)swaps with ease.&#x20;

To accept a swap, ensure that the allowed address matches the caller's address or is set to zero, and that the expiry date is valid. Once a swap is accepted, its expiry is set to zero to prevent reuse.&#x20;

If you need to cancel a swap, you can do so by setting its expiry to zero, provided that you are the owner and the expiry date is still valid.
