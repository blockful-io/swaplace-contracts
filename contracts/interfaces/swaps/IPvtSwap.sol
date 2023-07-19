// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface IPvtSwap {
    function create(ISwap.PvtSwap calldata swap) external returns (uint256);

    function accept(uint256 id, address creator) external;

    function cancelSwap(uint256 id) external;
}
