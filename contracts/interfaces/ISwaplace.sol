// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwaplace {
    /**
     * @dev Create a new swap operation with the parameters specified in the {ISwap.Swap} structure. 
     * When called, it must register the new exchange operation and return a unique identifier id for that exchange.
     */ 
    function createSwap(ISwap.Swap calldata swap) external returns (uint256);

    /**
     * @dev Allows a user to accept an existing exchange operation using their unique id. 
     * When called complete the exchange operation between the two parties involved.
     */ 
    function acceptSwap(uint256 id) external;

    /**
     * @dev This function is used to cancel an exchange operation. 
    */ 
    function cancelSwap(uint256 id) external;

    /**
     * @dev This function provides a way to query the details of a specific exchange operation. 
     * When providing the swap operation id, it should return the {ISwap.Swap} data structure containing all details about the swap operation.
     */ 
    function getSwap(uint256 id) external view returns (ISwap.Swap memory);

    /**
     * @dev Returns true if this contract implements the interface defined by `interfaceID`. 
     */
    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}
