// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "./interfaces/IERC165.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";
import {ITransfer} from "./interfaces/ITransfer.sol";
import {SwapFactory} from "./SwapFactory.sol";

/**
 * @author @0xneves | @blockful_io
 * @dev Swaplace is a decentralized and feeless DEX/OTC. Ownerless, it cannot be stopped.
 * It's core is to facilitate swaps between virtual assets using the ERC standard.
 * Users can propose or accept swaps by allowing Swaplace to move their assets using the
 * `approve`, `permit` or similar functions.
 */
contract Swaplace is SwapFactory, ISwaplace, IERC165 {
  /// @dev Swap Identifier counter.
  uint256 private _totalSwaps;

  /// @dev Mapping of Swap ID to Swap struct. See {ISwap-Swap}.
  mapping(uint256 => Swap) private _swaps;

  /**
   * @dev See {ISwaplace-getSwap}.
   */
  function getSwap(uint256 swapId) public view returns (Swap memory) {
    return _swaps[swapId];
  }

  /**
   * @dev Getter function for _totalSwaps.
   */
  function totalSwaps() public view returns (uint256) {
    return _totalSwaps;
  }

  /**
   * @dev See {ISwaplace-createSwap}.
   */
  function createSwap(Swap calldata swap) public payable returns (uint256) {
    if (swap.owner != msg.sender) revert InvalidAddress();

    assembly {
      sstore(_totalSwaps.slot, add(sload(_totalSwaps.slot), 1))
    }

    uint256 swapId = _totalSwaps;
    _swaps[swapId] = swap;

    (address allowed, , uint8 recipient, uint56 value) = decodeConfig(
      swap.config
    );

    if (value > 0 && recipient == 0) {
      if (value * 1e12 != msg.value) revert InvalidValue();
    }

    emit SwapCreated(swapId, msg.sender, allowed);

    return swapId;
  }

  /**
   * @dev See {ISwaplace-acceptSwap}.
   */
  function acceptSwap(
    uint256 swapId,
    address receiver
  ) public payable returns (bool) {
    Swap memory swap = _swaps[swapId];

    (
      address allowed,
      uint32 expiry,
      uint8 recipient,
      uint56 value
    ) = decodeConfig(swap.config);

    if (allowed != address(0) && allowed != msg.sender) revert InvalidAddress();
    if (expiry < block.timestamp) revert InvalidExpiry();
    _swaps[swapId].config = 0;

    _transferFrom(msg.sender, swap.owner, swap.asking);
    _transferFrom(swap.owner, receiver, swap.biding);

    if (value > 0)
      if (recipient == 0) _payNativeEth(receiver, value * 1e12);
      else if (recipient > 0 && value * 1e12 == msg.value)
        _payNativeEth(swap.owner, value * 1e12);
      else revert InvalidValue();

    emit SwapAccepted(swapId, swap.owner, msg.sender);

    return true;
  }

  /**
   * @dev See {ISwaplace-cancelSwap}.
   */
  function cancelSwap(uint256 swapId) public {
    Swap memory swap = _swaps[swapId];
    if (swap.owner != msg.sender) revert InvalidAddress();

    (, uint32 expiry, uint8 recipient, uint56 value) = decodeConfig(
      swap.config
    );

    if (expiry < block.timestamp) revert InvalidExpiry();
    _swaps[swapId].config = 0;

    if (value > 0 && recipient == 0) _payNativeEth(msg.sender, value * 1e12);

    emit SwapCanceled(swapId, msg.sender);
  }

  /**
   * @dev Send an amount of native Ether to the receiver address.
   */
  function _payNativeEth(address receiver, uint256 value) internal {
    (bool success, ) = receiver.call{value: value}("");
    if (!success) revert InvalidValue();
  }

  /**
   * @dev Transfer multiple 'assets' from 'from' to 'to'.
   *
   * `0x23b872dd` - Selector of the `transferFrom` function (ERC20, ERC721).
   * `0xf242432a` - Selector of the `safeTransferFrom` function (ERC1155).
   */
  function _transferFrom(
    address from,
    address to,
    Asset[] memory assets
  ) internal {
    for (uint256 i; i < assets.length; ) {
      (uint16 assetType, uint256 tokenId, uint256 tokenAmount) = decodeAsset(
        assets[i].amountOrId
      );
      if (assetType == type(uint16).max) {
        (bool success, ) = address(assets[i].addr).call(
          abi.encodeWithSelector(0xf242432a, from, to, tokenId, tokenAmount, "")
        );
        if (!success) revert InvalidCall();
      } else {
        (bool success, ) = address(assets[i].addr).call(
          abi.encodeWithSelector(0x23b872dd, from, to, tokenAmount)
        );
        if (!success) revert InvalidCall();
      }
      assembly {
        i := add(i, 1)
      }
    }
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
}
