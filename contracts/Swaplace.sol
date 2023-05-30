// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {SwapFactory} from "./SwapFactory.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";

error InvalidAddressForOwner(address caller);
error InvalidAssetsLength();
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
 *        It allows users to propose and accept swaps.
 *        It won't handle allowances, only transfers.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165, ReentrancyGuard {
    uint256 public swapId = 0;

    mapping(uint256 => Swap) private swaps;

    function createSwap(Swap calldata swap) public returns (uint256) {
        if (swap.owner == address(0) || swap.owner != msg.sender) {
            revert InvalidAddressForOwner(swap.owner);
        }

        if (swap.expiry < 1 days) {
            revert InvalidExpiryDate(swap.expiry);
        }

        if (swap.biding.length == 0 || swap.asking.length == 0) {
            revert InvalidAssetsLength();
        }

        unchecked {
            swapId++;
        }

        swaps[swapId] = swap;
        swaps[swapId].expiry = swap.expiry + block.timestamp;

        return swapId;
    }

    function acceptSwap(uint256 id) public nonReentrant {
        Swap memory swap = swaps[id];

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryDate(swap.expiry);
        }

        Asset[] memory assets = swap.asking;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                msg.sender,
                swap.owner,
                assets[i].amountOrId
            );
            unchecked {
                i++;
            }
        }

        assets = swap.biding;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                swap.owner,
                msg.sender,
                assets[i].amountOrId
            );
            unchecked {
                i++;
            }
        }

        swaps[id].expiry = 0;
    }

    function cancelSwap(uint256 id) public {
        Swap memory swap = swaps[id];

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryDate(swap.expiry);
        }

        if (swap.owner != msg.sender) {
            revert InvalidAddressForOwner(msg.sender);
        }

        swaps[id].expiry = 0;
    }

    function getSwap(uint256 id) public view returns (Swap memory) {
        return swaps[id];
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplace) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
