// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ITimedSwap} from "./interfaces/swaps/ITimedSwap.sol";
import {ITransfer} from "./interfaces/utils/ITransfer.sol";
import {ISwap} from "./interfaces/swaps/ISwap.sol";

error InvalidAddress(address caller);
error InvalidExpiryPeriod(uint256 expiry);
error InvalidSwap(uint256 id);

contract TimedSwap is ITimedSwap, ISwap {
    uint256 public swapId;

    mapping(uint256 => mapping(address => TimedSwap)) private _timedSwaps;

    mapping(uint256 => bool) private _finalized;

    function create(TimedSwap calldata swap) public returns (uint256) {
        if (msg.sender == address(0)) {
            revert InvalidAddress(msg.sender);
        }

        if (swap.expiry < 1) {
            revert InvalidExpiryPeriod(swap.expiry);
        }

        unchecked {
            swapId++;
        }

        _timedSwaps[swapId][msg.sender] = swap;
        _timedSwaps[swapId][msg.sender].expiry = swap.expiry;

        return swapId;
    }

    function accept(uint256 id, address creator) public {
        if (_finalized[id]) {
            revert InvalidSwap(id);
        }
        _finalized[id] = true;

        TimedSwap memory swap = _timedSwaps[id][creator];

        if (swap.expiry < block.timestamp) {
            revert InvalidExpiryPeriod(swap.expiry);
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
        TimedSwap memory swap = _timedSwaps[id][msg.sender];

        if (
            swap.biding.length == 0 ||
            swap.asking.length == 0 ||
            _finalized[id] ||
            swap.expiry < block.timestamp
        ) {
            revert InvalidSwap(id);
        }

        _finalized[id] = true;
    }

    function getSwap(
        uint256 id,
        address creator
    ) public view returns (TimedSwap memory) {
        return _timedSwaps[id][creator];
    }
}
