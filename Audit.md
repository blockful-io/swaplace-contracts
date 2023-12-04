- [Installation](#Installation)
- [Testing with Echidna](#testing-properties-with-echidna)

# Installation

**Echidna**
See [Echidna Installation](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna#installation).

```
solc-select use 0.8.17
```

```
echidna . --contract CONTRACT_NAME --test-mode <ASSERTION/PROPERTY> --config CONFIG_FILE.yaml
```

Test if crytic-compile and slither are working properly in the contracts directory.
```
yarn compile-echidna
```

Test-mode set to `ASSERTION(a)` will run the assertions, while `PROPERTY(p)` will run the properties.
```
yarn fuzz-p
yarn fuzz-a
```


## Properties

Echidna properties can be broadly divided in two categories: general properties of the contracts that states what user can and cannot do and
specific properties based on unit tests.

To test a property, run `echidna . CONTRACT_name --config CONFIG_FILE.yaml`.

## General Properties

| Description | Name | Contract | Finding | Status | 
|:---|:---:|:---:|:---:|:---:|
| Swap count should be impossible to overflow.|[`id_overflow`](contracts/echidna/TestSwaplace.sol#L38-L40)|[`TestSwaplace`](contracts/echidna/TestSwaplace.sol)|PASSED||
| Swap count is only 0 at initialization, then increments.|[`id_never_zero_after_init`](contracts/echidna/TestSwaplace.sol#L42-L48)|[`TestSwaplace`](contracts/echidna/TestSwaplace.sol)|PASSED||
| Sender is always the owner of the swap and IDs always increment.| [`create_swap`](contracts/echidna/TestSwaplace.sol#L18-L28)|[`TestSwaplace`](contracts/echidna/TestSwaplace.sol)|PASSED||
| Accepting swaps through allowances shouldn't mess the swap.| [`accept_swap`](contracts/echidna/TestSwaplace.sol#L30-L36)  | [`TestSwaplace`](contracts/echidna/TestSwaplace.sol)|PASSED||
| Invalid swap expiration should not be allowed to be created.| [`revert_invalid_expiry`](contracts/echidna/TestSwapFactory.sol#L53-L55)| [`TestSwapFactory`](contracts/echidna/TestSwapFactory.sol)|PASSED ||
| Empty asset class should not be allowed in the swap.|[`revert_invalid_length`](contracts/echidna/TestSwapFactory.sol#L57-L65)|[`TestSwapFactory`](contracts/echidna/TestSwapFactory.sol)|PASSED||


## General Assertions

| Description | Name | Contract | Finding | Status | 
|:---|:---:|:---:|:---:|:---:|
| Any inputs within the type should be considered valid. | [`has_values`](contracts/echidna/TestSwapFactory.sol#L9-L13)  | [`TestSwapFactory`](contracts/echidna/TestSwapFactory.sol)|PASSED||
| Should make an array with a single asset for the swap. | [`make_asset_array`](contracts/echidna/TestSwapFactory.sol#L15-L25)| [`TestSwapFactory`](contracts/echidna/TestSwapFactory.sol)|PASSED ||
| Should build a valid swap for the `createSwap` function. |[`make_valid_swap`](contracts/echidna/TestSwapFactory.sol#L27-L45)|[`TestSwapFactory`](contracts/echidna/TestSwapFactory.sol)|PASSED||