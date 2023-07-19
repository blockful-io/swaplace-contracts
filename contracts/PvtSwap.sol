// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IPvtSwap} from "./interfaces/swaps/IPvtSwap.sol";
import {ITransfer} from "./interfaces/utils/ITransfer.sol";
import {ISwap} from "./interfaces/swaps/ISwap.sol";

error InvalidAddress(address caller);
error InvalidSwap(uint256 id);

contract PvtSwap is IPvtSwap, ISwap {
    uint256 public swapId;

    mapping(uint256 => mapping(address => PvtSwap)) private _pvtSwaps;

    mapping(uint256 => bool) private _finalized;

    function create(PvtSwap calldata swap) public returns (uint256) {
        if (msg.sender == address(0)) {
            revert InvalidAddress(msg.sender);
        }

        unchecked {
            swapId++;
        }

        _pvtSwaps[swapId][msg.sender] = swap;

        return swapId;
    }

    function accept(uint256 id, address creator) public {
        if (_finalized[id]) {
            revert InvalidSwap(id);
        }
        _finalized[id] = true;

        PvtSwap memory swap = _pvtSwaps[id][creator];

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
        PvtSwap memory swap = _pvtSwaps[id][msg.sender];

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
    ) public view returns (PvtSwap memory) {
        return _pvtSwaps[id][creator];
    }
}
