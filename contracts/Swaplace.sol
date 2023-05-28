// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error CannotBeEmptyAssets();
error CannotBeLesserThanOneDay(uint256 timestamp);
error CannotBeZeroAddress();
error CannotBeZeroForAmountOrCall();
error FunctionCallFailedWithReason(bytes reason);
error InvalidAssetType(uint256 assetType);
error LengthMismatchWhenComposing(
    uint256 addr,
    uint256 amountOrIdOrCall,
    uint256 assetType
);
error OwnerMustBeMsgSender();
error TradeExpired(uint256 id);

/* v2.0.0
 *  ________   ___        ________   ________   ___  __     ________  ___  ___   ___
 * |\   __  \ |\  \      |\   __  \ |\   ____\ |\  \|\  \  |\  _____\|\  \|\  \ |\  \
 * \ \  \|\ /_\ \  \     \ \  \|\  \\ \  \___| \ \  \/  /|_\ \  \__/ \ \  \\\  \\ \  \
 *  \ \   __  \\ \  \     \ \  \\\  \\ \  \     \ \   ___  \\ \   __\ \ \  \\\  \\ \  \
 *   \ \  \|\  \\ \  \____ \ \  \\\  \\ \  \____ \ \  \\ \  \\ \  \_|  \ \  \\\  \\ \  \____
 *    \ \_______\\ \_______\\ \_______\\ \_______\\ \__\\ \__\\ \__\    \ \_______\\ \_______\
 *     \|_______| \|_______| \|_______| \|_______| \|__| \|__| \|__|     \|_______| \|_______|
 *
 * @author - Blockful.io
 * @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
 *        It allows users to propose trades and accept them.
 *        The contract will validate the trade, then transfer the assets.
 */
interface ISwaplace {
    enum AssetType {
        ERC20,
        ERC721,
        FUNCTION_CALL
    }

    struct Asset {
        address addr;
        uint256 amountOrIdOrCall;
        AssetType assetType;
    }

    struct Trade {
        address owner;
        uint256 expiry;
        Asset[] assets;
        Asset[] asking;
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}

interface IUniversalTransfer {
    function transferFrom(
        address from,
        address to,
        uint256 amountOrIdOrCall
    ) external;
}

contract Swaplace is ISwaplace, IERC165, ReentrancyGuard {
    uint256 public tradeId = 0;

    mapping(uint256 => Trade) private trades;

    function createTrade(
        Trade calldata trade
    ) public nonReentrant returns (uint256) {
        if (trade.owner == address(0) || trade.owner != msg.sender) {
            revert CannotBeZeroAddress();
        }

        if (trade.expiry < 1 days) {
            revert CannotBeLesserThanOneDay(trade.expiry);
        }

        unchecked {
            tradeId++;
        }

        trades[tradeId] = trade;

        unchecked {
            trades[tradeId].expiry += block.timestamp;
        }

        return tradeId;
    }

    function acceptTrade(uint256 _tradeId) public nonReentrant {
        Trade memory trade = trades[_tradeId];

        if (trade.expiry < block.timestamp) {
            revert TradeExpired(_tradeId);
        }

        Asset[] memory assets = trade.asking;

        for (uint256 i = 0; i < assets.length; ) {
            IUniversalTransfer(assets[i].addr).transferFrom(
                msg.sender,
                trade.owner,
                assets[i].amountOrIdOrCall
            );
            unchecked {
                i++;
            }
        }

        assets = trade.assets;

        for (uint256 i = 0; i < assets.length; ) {
            IUniversalTransfer(assets[i].addr).transferFrom(
                trade.owner,
                msg.sender,
                assets[i].amountOrIdOrCall
            );
            unchecked {
                i++;
            }
        }

        trades[_tradeId].expiry = 0;
    }

    function cancelTrade(uint256 _tradeId) public {
        Trade memory trade = trades[_tradeId];

        if (trade.expiry < block.timestamp) {
            revert TradeExpired(_tradeId);
        }

        if (trade.owner == msg.sender) {
            revert OwnerMustBeMsgSender();
        }

        trades[_tradeId].expiry = 0;
    }

    function getTrade(uint256 id) public view returns (Trade memory) {
        return trades[id];
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplace) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
