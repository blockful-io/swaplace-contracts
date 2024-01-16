// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../echidna/TestSwapFactory.sol";
import "../mock/MockERC20.sol";
import "../Swaplace.sol";

contract TestSwaplace is TestFactory {
  MockERC20 private _token;
  Swaplace private _swaplace;

  constructor() {
    _token = new MockERC20();
    _swaplace = new Swaplace();
    _token.mintTo(address(this), 100);
  }

  function echidna_create_swap() public returns (bool) {
    uint256 initId = _swaplace.totalSwaps();

    uint256 id = _swaplace.createSwap(
      make_valid_swap(address(this), address(_token), 100)
    );

    require(_swaplace.getSwap(id).owner == address(this));
    require(id > 0);
    return (initId + 1 == id);
  }

  function echidna_accept_swap() public returns (bool) {
    echidna_create_swap();
    _token.approve(address(_swaplace), type(uint256).max);

    uint256 lastId = _swaplace.totalSwaps();
    return (_swaplace.acceptSwap(lastId, address(0)));
  }

  function echidna_id_overflow() public view returns (bool) {
    return _swaplace.totalSwaps() < type(uint256).max;
  }

  function echidna_id_never_zero_after_init() public view returns (bool) {
    Swaplace.Swap memory swap = _swaplace.getSwap(0);
    return
      swap.owner == address(0)
        ? _swaplace.totalSwaps() == 0
        : _swaplace.totalSwaps() != 0;
  }
}
