// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../SwapFactory.sol";

contract TestFactory is SwapFactory {
  Asset[] private _asset;

  function has_values() public {
    _asset[0] = makeAsset(address(0), 0);
    assert(_asset[0].addr == address(0));
    assert(_asset[0].amountOrId == 0);
  }

  function make_asset_array(
    address addr,
    uint256 amountOrId
  ) public pure returns (Asset[] memory) {
    Asset[] memory asset = new Asset[](1);
    asset[0] = makeAsset(addr, amountOrId);

    assert(asset[0].addr == addr);
    assert(asset[0].amountOrId == amountOrId);
    return asset;
  }

  function make_valid_swap(
    address owner,
    address addr,
    uint256 amountOrId
  ) public view returns (Swap memory) {
    Swap memory swap = makeSwap(
      owner,
      address(0),
      block.timestamp + 1000,
      make_asset_array(addr, amountOrId),
      make_asset_array(addr, amountOrId)
    );

    ( , uint256 expiry) = parseData(swap.config);

    assert(expiry > block.timestamp);
    assert(swap.biding.length > 0);
    assert(swap.asking.length > 0);
    return swap;
  }

  function echidna_revert_invalid_expiry() public view {
    makeSwap(address(0), address(0), block.timestamp - 100, _asset, _asset);
  }

  function echidna_revert_invalid_length() public view {
    makeSwap(
      address(0),
      address(0),
      block.timestamp + 100,
      new Asset[](0),
      new Asset[](0)
    );
  }
}
