// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "./interfaces/IERC165.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";
import {SwapFactory} from "./SwapFactory.sol";

/**
 * @author @0xneves | @blockful_io
 * @dev Swaplace is a Decentralized Feeless DEX. It has no owners, it cannot be stopped.
 * Its cern is to facilitate swaps between virtual assets following the ERC standard.
 * Users can propose or accept swaps by allowing Swaplace to move their assets using the
 * `approve` or `permit` function.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165 {
  /// @dev Swap Identifier counter.
  uint256 private _totalSwaps;

  /// @dev Mapping of Swap ID to Swap struct. See {ISwap-Swap}.
  mapping(uint256 => Swap) private _swaps;

  /**
   * @dev See {ISwaplace-createSwap}.
   */
  function createSwap(Swap calldata swap) public returns (uint256) {
    if (swap.owner != msg.sender) revert InvalidAddress(msg.sender);

    unchecked {
      assembly {
        sstore(_totalSwaps.slot, add(sload(_totalSwaps.slot), 1))
      }
    }

    uint256 swapId = _totalSwaps;

    _swaps[swapId] = swap;

    emit SwapCreated(swapId);

    return swapId;
  }

  /**
   * @dev See {ISwaplace-acceptSwap}.
   */
  function acceptSwap(uint256 swapId, address receiver) public returns (bool) {
    Swap memory swap = _swaps[swapId];

    (address allowed, uint256 expiry) = parseData(swap.config);

    if (allowed != address(0) && allowed != msg.sender)
      revert InvalidAddress(msg.sender);

    if (expiry < block.timestamp) revert InvalidExpiry(expiry);

    _swaps[swapId].config = packData(allowed, 0);

    Asset[] memory assets = swap.asking;

    for (uint256 i = 0; i < assets.length; ) {
      ITransfer(assets[i].addr).transferFrom(
        msg.sender,
        swap.owner,
        assets[i].amountOrId
      );
      unchecked {
        assembly {
          i := mload(0x40)
          i := add(i, 1)
          mstore(0x40, i)
        }
      }
    }

    assets = swap.biding;

    for (uint256 i = 0; i < assets.length; ) {
      ITransfer(assets[i].addr).transferFrom(
        swap.owner,
        receiver,
        assets[i].amountOrId
      );
      unchecked {
        assembly {
          i := mload(0x40)
          i := add(i, 1)
          mstore(0x40, i)
        }
      }
    }

    emit SwapAccepted(swapId, msg.sender);

    return true;
  }

  /**
   * @dev See {ISwaplace-cancelSwap}.
   */
  function cancelSwap(uint256 swapId) public {
    Swap memory swap = _swaps[swapId];

    if (swap.owner != msg.sender) revert InvalidAddress(msg.sender);

    (address allowed, uint256 expiry) = parseData(swap.config);

    if (expiry < block.timestamp) revert InvalidExpiry(expiry);

    _swaps[swapId].config = packData(allowed, 0);

    emit SwapCanceled(swapId, msg.sender);
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
