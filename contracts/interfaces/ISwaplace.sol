// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwaplace {
    /**
     * @dev Creates a new swap in the swaplace system given its ID.
     */
    function createSwap(ISwap.Swap calldata swap) external returns (uint256);

    /**
     * @dev Accepts an existing swap in the swaplace system given its ID.
     */
    function acceptSwap(uint256 id) external;

    /**
     * @dev Cancels an existing swap in the swaplace system given its ID.
     */
    function cancelSwap(uint256 id) external;

    /**
     * @dev Retrieves the details of a specific swap from the swaplace system given its ID.
     */
    function getSwap(uint256 id) external view returns (ISwap.Swap memory);
}
