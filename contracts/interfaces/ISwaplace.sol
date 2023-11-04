// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

/**
 * @dev Interface to easily manage swaps.
 */
interface ISwaplace {
    /**
     * @dev Takes a swap parameter {ISwap-Swap} and returns the id of the created swap.
     */ 
    function createSwap(ISwap.Swap calldata swap) external returns (uint256);

    /**
     * @dev Accept an existing swap given its unique ID.
     */ 
    function acceptSwap(uint256 id) external;

    /**
     * @dev Cancels an existing swap given its unique ID.
    */ 
    function cancelSwap(uint256 id) external;

    /**
     * @dev Retrieves details of a specific swap as a {ISwap-Swap} type 
     */ 
    function getSwap(uint256 id) external view returns (ISwap.Swap memory);

    /**
     * @dev See {IERC165-supportsInterface}.
     */ 
    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}
