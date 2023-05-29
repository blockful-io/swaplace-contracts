// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {SwapFactory} from "./SwapFactory.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";

error InvalidAddressForOwner(address caller);
error InvalidExpiryDate(uint256 timestamp);

/**
 *  ________   ___        ________   ________   ___  __     ________  ___  ___   ___
 * |\   __  \ |\  \      |\   __  \ |\   ____\ |\  \|\  \  |\  _____\|\  \|\  \ |\  \
 * \ \  \|\ /_\ \  \     \ \  \|\  \\ \  \___| \ \  \/  /|_\ \  \__/ \ \  \\\  \\ \  \
 *  \ \   __  \\ \  \     \ \  \\\  \\ \  \     \ \   ___  \\ \   __\ \ \  \\\  \\ \  \
 *   \ \  \|\  \\ \  \____ \ \  \\\  \\ \  \____ \ \  \\ \  \\ \  \_|  \ \  \\\  \\ \  \____
 *    \ \_______\\ \_______\\ \_______\\ \_______\\ \__\\ \__\\ \__\    \ \_______\\ \_______\
 *     \|_______| \|_______| \|_______| \|_______| \|__| \|__| \|__|     \|_______| \|_______|
 *
 * @title Swaplace
 * @author @dizzyaxis | @blockful_io
 * @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
 *        It allows users to propose and accept trades.
 *        It won't handle allowances, only transfers.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165, ReentrancyGuard {
    uint256 public tradeId = 0;

    mapping(uint256 => Trade) private trades;

    function createTrade(Trade calldata trade) public returns (uint256) {
        if (trade.owner == address(0) || trade.owner != msg.sender) {
            revert InvalidAddressForOwner(trade.owner);
        }

        if (trade.expiry < 1 days) {
            revert InvalidExpiryDate(trade.expiry);
        }

        unchecked {
            tradeId++;
        }

        trades[tradeId] = trade;

        unchecked {
            trades[tradeId].expiry += block.timestamp;
        }

        return tradeId;
    }

    function acceptTrade(uint256 id) public nonReentrant {
        Trade memory trade = trades[id];

        if (trade.expiry < block.timestamp) {
            revert InvalidExpiryDate(id);
        }

        Asset[] memory assets = trade.asking;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                msg.sender,
                trade.owner,
                assets[i].amountIdCall
            );
            unchecked {
                i++;
            }
        }

        assets = trade.biding;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                trade.owner,
                msg.sender,
                assets[i].amountIdCall
            );
            unchecked {
                i++;
            }
        }

        trades[id].expiry = 0;
    }

    function cancelTrade(uint256 id) public {
        Trade memory trade = trades[id];

        if (trade.expiry < block.timestamp) {
            revert InvalidExpiryDate(id);
        }

        if (trade.owner == msg.sender) {
            revert InvalidAddressForOwner(msg.sender);
        }

        trades[id].expiry = 0;
    }

    function getTrade(uint256 id) public view returns (Trade memory) {
        return trades[id];
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplace) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
