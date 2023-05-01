// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 totalSupply;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mintTo(address to) public {
        totalSupply++;
        _mint(to, totalSupply);
    }
}
