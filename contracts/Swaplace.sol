// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "./interfaces/IERC165.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";
import {SwapFactory} from "./SwapFactory.sol";

/**
 * @author @0xneves | @blockful_io
 * @dev Swaplace is a Decentralized Feeless DEX. It has no owners, it cannot be stoped.
 * Its cern is to facilitate swaps between virtual assets following the ERC standard.
 * Users can propose or accept swaps by allowing Swaplace to move their assets using the
 * `approve` or `permit` function.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165 {
  /// @dev Swap Identifier counter.
  uint256 private _totalSwaps;

  /**
   * @dev Emitted when a new Swap is created.
   * keccak-256(SwapCreated(uint256,address,uint256,address))
   */
  bytes32 private constant EVENT_SWAP_CREATED_SIGNATURE =
    0x43a58bfac3282e5ce3bfd714c5bc0ddff8d6f2cd049db0b02a25d7cdd5026efb;

  /**
   * @dev Emitted when a Swap is accepted.
   * keccak-256(SwapAccepted(uint256,address))
   */
  bytes32 private constant EVENT_SWAP_ACCEPTED_SIGNATURE =
    0x38eced64b5c4ab50bb61d2f5fcace3c629a2d92f974374bf4a4f3e8a7c49caef;

  /**
   * @dev Emitted when a Swap is canceled.
   * keccak-256(SwapCanceled(uint256,address))
   */
  bytes32 private constant EVENT_SWAP_CANCELED_SIGNATURE =
    0x0a01e988a96145b1dd49cafc687666a0525e6b929299df4652cc646915e696d8;

  /// @dev Mapping of Swap ID to Swap struct. See {ISwap-Swap}.
  mapping(uint256 => Swap) private _swaps;

  /**
   * @dev See {ISwaplace-createSwap}.
   */
  function createSwap(Swap calldata swap) public returns (uint256) {
    if (swap.owner != msg.sender) {
      revert InvalidAddress(msg.sender);
    }

    if (swap.expiry < block.timestamp) {
      revert InvalidExpiry(swap.expiry);
    }

    if (swap.biding.length == 0 || swap.asking.length == 0) {
      revert InvalidAssetsLength();
    }

    unchecked {
      assembly {
        sstore(_totalSwaps.slot, add(sload(_totalSwaps.slot), 1))
      }
    }

    uint256 swapId = _totalSwaps;

    _swaps[swapId] = swap;

    uint256 swapExpiry = swap.expiry;
    address allowed = swap.allowed;
    assembly {
      mstore(0x00, allowed)
      log4(
        0x00,
        0x20,
        EVENT_SWAP_CREATED_SIGNATURE,
        swapId,
        caller(),
        swapExpiry
      )
    }

    return swapId;
  }

  /**
   * @dev See {ISwaplace-acceptSwap}.
   */
  function acceptSwap(uint256 id) public returns (bool) {
    Swap memory swap = _swaps[id];

    if (swap.allowed != address(0) && swap.allowed != msg.sender) {
      revert InvalidAddress(msg.sender);
    }

    if (swap.expiry < block.timestamp) {
      revert InvalidExpiry(swap.expiry);
    }

    _swaps[id].expiry = 0;

    Asset[] memory assets = swap.asking;

    for (uint256 i = 0; i < assets.length; ) {
      ITransfer(assets[i].addr).transferFrom(
        msg.sender,
        swap.owner,
        assets[i].amountOrId
      );
      unchecked {
        i++;
      }
    }

    assets = swap.biding;

    for (uint256 i = 0; i < assets.length; ) {
      ITransfer(assets[i].addr).transferFrom(
        swap.owner,
        msg.sender,
        assets[i].amountOrId
      );
      unchecked {
        i++;
      }
    }

    assembly {
      log3(0x00, 0x00, EVENT_SWAP_ACCEPTED_SIGNATURE, id, caller())
    }

    return true;
  }

  /**
   * @dev See {ISwaplace-cancelSwap}.
   */
  function cancelSwap(uint256 id) public {
    Swap memory swap = _swaps[id];

    if (swap.owner != msg.sender) {
      revert InvalidAddress(msg.sender);
    }

    if (swap.expiry < block.timestamp) {
      revert InvalidExpiry(swap.expiry);
    }

    _swaps[id].expiry = 0;

    assembly {
      log3(0x00, 0x00, EVENT_SWAP_CANCELED_SIGNATURE, id, caller())
    }
  }

  /**
   * @dev See {ISwaplace-getSwap}.
   */
  function getSwap(uint256 swapId) public view returns (Swap memory) {
    return _swaps[swapId];
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceID
  ) external pure override(IERC165) returns (bool) {
    return
      interfaceID == type(IERC165).interfaceId ||
      interfaceID == type(ISwaplace).interfaceId;
  }

  /**
   * @dev Getter function for _totalSwaps.
   */
  function totalSwaps() public view returns (uint256) {
    return _totalSwaps;
  }
}
