// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IBaseSwap} from "./interfaces/swaps/IBaseSwap.sol";
import {ITransfer} from "./interfaces/utils/ITransfer.sol";
import {ISwap} from "./interfaces/swaps/ISwap.sol";

error InvalidAddress(address caller);
error InvalidSwap(uint256 id);

contract BaseSwap is IBaseSwap, ISwap {
    uint256 public swapId;

    mapping(uint256 => mapping(address => BaseSwap)) private _baseSwaps;

    mapping(uint256 => bool) private _finalized;

    function create(BaseSwap calldata swap) public returns (uint256) {
        if (msg.sender == address(0)) {
            revert InvalidAddress(msg.sender);
        }

        unchecked {
            swapId++;
        }

        _baseSwaps[swapId][msg.sender] = swap;

        return swapId;
    }

    function accept(uint256 id, address creator) public {
        if (_finalized[id]) {
            revert InvalidSwap(id);
        }
        _finalized[id] = true;

        BaseSwap memory swap = _baseSwaps[id][creator];

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
        BaseSwap memory swap = _baseSwaps[id][msg.sender];

        if (
            swap.biding.length == 0 || swap.asking.length == 0 || _finalized[id]
        ) {
            revert InvalidSwap(id);
        }

        _finalized[id] = true;
    }

    function getSwap(
        uint256 id,
        address creator
    ) public view returns (BaseSwap memory) {
        return _baseSwaps[id][creator];
    }
}
