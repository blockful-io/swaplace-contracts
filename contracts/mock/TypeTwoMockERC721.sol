// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TypeTwoMockERC721 is ERC721 {
    uint256 totalSupply;
    constructor() ERC721("TypeTwoMockERC721", "TTM721") {
    }

    function mintTo(address to) public {
        _mint(to, totalSupply);
        totalSupply++;
    }

}