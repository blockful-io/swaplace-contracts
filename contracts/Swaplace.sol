// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";
import {SwapFactory} from "./SwapFactory.sol";

/**  ___ _    ___   ___ _  _____ _   _ _
 *  | _ ) |  / _ \ / __| |/ / __| | | | |
 *  | _ \ |_| (_) | (__| ' <| _|| |_| | |__
 *  |___/____\___/ \___|_|\_\_|  \___/|____|
 * @author @0xneves | @blockful_io
 * @dev - Swaplace is a Decentralized Feeless DEX and OTC. It has no owners, it cannot be stoped.
 * Its core idea is to facilitate swaps between virtual assets following the ERC standard.
 * Users can propose or accept swaps by allowing Swaplace to move their assets using the
 * `approve` function of the Token standard or `permit` if available.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165 {
    /// @dev Swap Identificator counter.
    uint256 public swapId;

    /// @dev Mapping of `swapId` to Swap struct. See {ISwap-Swap}.
    mapping(uint256 => Swap) private swaps;

    /**
     * @dev See {ISwaplace-createSwap}.
     */
    function createSwap(Swap calldata swap) public returns (uint256) {
        if (swap.owner != msg.sender) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiry(swap.expiry);
        }

        if (swap.biding.length == 0 || swap.asking.length == 0) {
            revert InvalidAssetsLength();
        }

        unchecked {
            swapId++;
        }

        swaps[swapId] = swap;

        emit SwapCreated(swapId, msg.sender, swap.expiry);

        return swapId;
    }

    /**
     * @dev See {ISwaplace-acceptSwap}.
     */
    function acceptSwap(uint256 id) public returns (bool) {
        Swap memory swap = swaps[id];

        if (swap.allowed != address(0) && swap.allowed != msg.sender) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiry(swap.expiry);
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

        emit SwapAccepted(id, msg.sender);

        return true;
    }

    /**
     * @dev See {ISwaplace-cancelSwap}.
     */
    function cancelSwap(uint256 id) public {
        Swap memory swap = swaps[id];

        if (swap.owner != msg.sender) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiry(swap.expiry);
        }

        swaps[id].expiry = 0;

        emit SwapCanceled(id, msg.sender);
    }

    /**
     * @dev See {ISwaplace-getSwap}.
     */
    function getSwap(uint256 id) public view returns (Swap memory) {
        return swaps[id];
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
