// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/*
 * @author - Blockful.io
 * @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
 *        It allows users to propose trades and accept them.
 *        The contract will validate the trade, then transfer the assets.
 */
interface ISwaplaceV2 {
    enum AssetType {
        ERC20,
        ERC721
    }

    struct Asset {
        address addr;
        uint256 amountOrId;
        AssetType assetType;
    }

    struct Trade {
        uint256 tradeId;
        address owner;
        uint256 expirationDate;
        Asset listedAssets;
    }
}

contract SwaplaceV2 is ISwaplaceV2 {
    function createTrade() public {}

    function acceptTrade() public {}

    function cancelTrade() public {}

    function getTrade() public view {}

    /* Receive ETH */
    receive() external payable {}
}
