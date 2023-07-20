// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ISwaplace {
    function createSwap(ISwap.Swap calldata swap) external returns (uint256);

    function acceptSwap(uint256 id) external;

    function cancelSwap(uint256 id) external;

    function getSwap(uint256 id) external view returns (ISwap.Swap memory);

    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}
