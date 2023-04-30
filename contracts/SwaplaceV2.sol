// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/*
 * @author - Blockful.io
 * @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
 *        It allows users to propose trades and accept them.
 *        The contract will validate the trade and transfer the assets.
 */
contract SwaplaceV2 {
    function sayHi() public pure returns (string memory) {
        return "hi";
    }

    /* Receive ETH */
    receive() external payable {}
}
