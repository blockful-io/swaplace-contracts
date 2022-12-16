// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TypeOneMockERC20 is ERC20 {
    constructor() ERC20("TypeOneMockERC20", "TOM20") {
    }

    function mintTo(address to) public {
        _mint(to, 100e18);
    }

}