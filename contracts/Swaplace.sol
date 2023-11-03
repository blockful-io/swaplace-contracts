// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {IErrors} from "./interfaces/IErrors.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";

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
contract Swaplace is SwapFactory, ISwaplace, IErrors, IERC165 {
    uint256 public swapId;

    mapping(uint256 => Swap) private swaps;

    /**
     * @dev Allow users to create a swap.
     * Each new task increments its id by one.
     *
     * Requirements:
     *
     * - `owner` of the swap must be the caller of this function.
     * - `expiry` of the swap should be bigger than timestamp.
     * - `biding` and `asking` must not be empty.
     */
    function createSwap(Swap calldata swap) public returns (uint256) {
        if (swap.owner != msg.sender) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryDate(swap.expiry);
        }

        if (swap.biding.length == 0 || swap.asking.length == 0) {
            revert InvalidAssetsLength();
        }

        unchecked {
            swapId++;
        }

        swaps[swapId] = swap;

        return swapId;
    }

    /**
     * @dev Accepts a swap.
     * Once the swap is accepted, the expiry is set to zero to avoid reutilization.
     *
     * NOTE: If the swap is expired, it will revert. This prevents reentrancy attacks.
     *
     * Requirements:
     *
     * - `allowed` must be the zero address or match the caller address
     * - `expiry` must be bigger than timestamp.
     *
     */
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

    /**
     * @dev Cancels an active swap.
     * On successful cancellation, it sets the expiry of the swap to zero to avoid reutilization.
     *
     * Requirements:
     *
     * - `expiry` must be bigger than timestamp
     * - `owner` must be the caller adress
     */
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

    /**
     * @dev Retrieves the details of a swap from a mapping based on its `id`.
     *
     * NOTE: If the swaps doesn't exist, the values will be defaulted.
     */
    function getSwap(uint256 id) public view returns (Swap memory) {
        return swaps[id];
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplace) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
