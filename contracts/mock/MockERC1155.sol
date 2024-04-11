// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MockERC1155 is ERC1155 {
  using Strings for uint256;

  string private _name;
  string private _symbol;

  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  constructor()
    ERC1155("ipfs://QmQJnHseE9VPw5qVxuEhxTiZ7avzgkCdFz69rg86UvTZdk/")
  {
    _name = "MockERC1155";
    _symbol = "M1155";
  }

  function mint(address to, uint256 id, uint256 amount) public {
    _mint(to, id, amount, "");
  }

  function tokenURI(
    uint256 tokenId
  ) public view virtual returns (string memory) {
    return uri(tokenId);
  }
}
