// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface of the {Swaplace} implementation.
 */
interface ISwaplace {
    /**
     * @dev Emitted when a new swap is created.
     */
    event SwapCreated(
        uint256 indexed id,
        address indexed owner,
        uint256 indexed expiry
    );

    /**
     * @dev Emitted when a swap is accepted.
     */
    event SwapAccepted(uint256 indexed id, address indexed accepter);

    /**
     * @dev Emitted when a swap is cancelled.
     */
    event SwapCanceled(uint256 indexed id, address indexed canceler);

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
    function createSwap(ISwap.Swap calldata swap) external returns (uint256);

    /**
     * @dev Accepts a swap.
     * Once the swap is accepted, the expiry is set to zero to avoid reutilization.
     *
     * NOTE: Set the expiry to 0, because if the swap is expired, it will revert.
     * This prevents reentrancy attacks.
     *
     * Requirements:
     *
     * - `allowed` must be the zero address or match the caller address
     * - `expiry` must be bigger than timestamp.
     */
    function acceptSwap(uint256 id) external returns (bool);

    /**
     * @dev Cancels an active swap.
     * On successful cancellation, it sets the expiry of the swap to zero to avoid reutilization.
     *
     * Requirements:
     *
     * - `expiry` must be bigger than timestamp
     * - `owner` must be the caller adress
     */
    function cancelSwap(uint256 id) external;

    /**
     * @dev Retrieves the details of a swap from a mapping based on its `id`.
     *
     * NOTE: If the swaps doesn't exist, the values will be defaulted to 0.
     * You can check if a swap exists by checking if the `owner` is the zero address.
     * If the `owner` is the zero address, then the swap doesn't exist.
     */
    function getSwap(uint256 id) external view returns (ISwap.Swap memory);
}
