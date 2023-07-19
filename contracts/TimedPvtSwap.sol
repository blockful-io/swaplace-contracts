// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ITimedPvtSwap} from "./interfaces/swaps/ITimedPvtSwap.sol";
import {ITransfer} from "./interfaces/utils/ITransfer.sol";
import {ISwap} from "./interfaces/swaps/ISwap.sol";

error InvalidAddress(address caller);
error InvalidExpiryPeriod(uint256 expiry);
error InvalidSwap(uint256 id);

contract TimedPvtSwap is ITimedPvtSwap, ISwap {
    uint256 public swapId;

    mapping(uint256 => mapping(address => TimedPvtSwap)) private _timedPvtSwaps;

    mapping(uint256 => bool) public finalized;

    function create(TimedPvtSwap calldata swap) public returns (uint256) {
        if (msg.sender == address(0)) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < 1) {
            revert InvalidExpiryPeriod(swap.expiry);
        }

        unchecked {
            swapId++;
        }

        _timedPvtSwaps[swapId][msg.sender] = swap;
        _timedPvtSwaps[swapId][msg.sender].expiry =
            swap.expiry +
            block.timestamp;

        return swapId;
    }

    function accept(uint256 id, address creator) public {
        if (finalized[id]) {
            revert InvalidSwap(id);
        }
        finalized[id] = true;

        TimedPvtSwap memory swap = _timedPvtSwaps[id][creator];

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryPeriod(swap.expiry);
        }

        if (swap.allowed != address(0) && msg.sender != swap.allowed) {
            revert InvalidAddress(msg.sender);
        }

        Asset[] memory assets = swap.asking;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                msg.sender,
                creator,
                assets[i].amountOrCallOrId
            );
            unchecked {
                i++;
            }
        }

        assets = swap.biding;

        for (uint256 i = 0; i < assets.length; ) {
            ITransfer(assets[i].addr).transferFrom(
                creator,
                msg.sender,
                assets[i].amountOrCallOrId
            );
            unchecked {
                i++;
            }
        }
    }

    function cancelSwap(uint256 id) public {
        TimedPvtSwap memory swap = _timedPvtSwaps[id][msg.sender];

        if (
            swap.biding.length == 0 ||
            swap.asking.length == 0 ||
            finalized[id] ||
            swap.expiry < block.timestamp
        ) {
            revert InvalidSwap(id);
        }

        finalized[id] = true;
    }

    function getSwap(
        uint256 id,
        address creator
    ) public view returns (TimedPvtSwap memory) {
        return _timedPvtSwaps[id][creator];
    }
}
