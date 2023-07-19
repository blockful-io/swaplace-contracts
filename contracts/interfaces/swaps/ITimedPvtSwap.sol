// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ISwap} from "./ISwap.sol";

interface ITimedPvtSwap {
    function create(
        ISwap.TimedPvtSwap calldata swap
    ) external returns (uint256);

    function accept(uint256 id, address creator) external;

    function cancelSwap(uint256 id) external;
}
