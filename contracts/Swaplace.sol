// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {IErrors} from "./interfaces/IErrors.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";

import {DataPalace} from "./DataPalace.sol";
import {SwapFactory} from "./SwapFactory.sol";

/**  ___ _    ___   ___ _  _____ _   _ _
 *  | _ ) |  / _ \ / __| |/ / __| | | | |
 *  | _ \ |_| (_) | (__| ' <| _|| |_| | |__
 *  |___/____\___/ \___|_|\_\_|  \___/|____|
 * @author @0xneves | @blockful_io
 * @dev - Swaplace is a Decentralized Feeless DEX. It has no owners, it cannot be stoped.
 * Its core idea is to facilitate swaps between virtual assets following the ERC standard.
 * Users can propose or accept swaps by allowing Swaplace to move their assets using the
 * `approve` function of the Token standard or `permit` if available.
 */
contract Swaplace is SwapFactory, DataPalace, ISwaplace, IErrors, IERC165 {
    uint256 public swapId;

    mapping(uint256 => Swap) private swaps;

    function createSwap(Swap calldata swap) public returns (uint256) {
        if (swap.owner != msg.sender) {
            revert InvalidAddress(swap.owner);
        }

        if (swap.expiry == 0) {
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

    function acceptSwap(uint256 id) public {
        Swap memory swap = swaps[id];

        if (swap.allowed != address(0) && swap.allowed != msg.sender) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryDate(swap.expiry);
        }

        swaps[id].expiry = 0;

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
    }

    function cancelSwap(uint256 id) public {
        Swap memory swap = swaps[id];

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryDate(swap.expiry);
        }

        if (swap.owner != msg.sender) {
            revert InvalidAddress(msg.sender);
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
