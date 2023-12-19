// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC20} from "./ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
  constructor() ERC20("MockERC20", "ERC20") {}

  function mintTo(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
