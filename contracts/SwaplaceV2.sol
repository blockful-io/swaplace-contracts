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
interface ISwaplaceV2 {
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

contract SwaplaceV2 is ISwaplaceV2, IERC165, ReentrancyGuard {
    uint256 public tradeId = 0;

    mapping(uint256 => Trade) private trades;
    mapping(address => uint256[]) private tradesOwned;

    /// Executions - Will be moved to a new contract, then imported here

    uint256 public index = 0;
    mapping(bytes32 => bytes) private executions;

    function registerExecution(bytes calldata data) public {
        index++;
        bytes32 id = keccak256(abi.encodePacked(index, msg.sender, data));
        executions[id] = data;
    }

    function getExecutionId(
        uint256 _index,
        address _addr,
        bytes memory data
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_index, _addr, data));
    }

    function getExecutions(bytes32 id) public view returns (bytes memory) {
        return executions[id];
    }

    /// Trades

    function createTrade(
        Trade calldata trade
    ) public nonReentrant returns (uint256) {
        valid(trade.owner, trade.expiry);

        unchecked {
            tradeId++;
        }

        trades[tradeId] = trade;
        trades[tradeId].expiry += block.timestamp; // explain this

        tradesOwned[msg.sender].push(tradeId); // develop this

        return tradeId;
    }

    function acceptTrade(uint256 _tradeId) public nonReentrant {
        Trade memory trade = trades[_tradeId];

        if (trade.expiry < block.timestamp) {
            revert TradeExpired(_tradeId);
        }

        Asset[] memory assets = trade.asking;

        for (uint256 i = 0; i < assets.length; ) {
            if (assets[i].assetType == AssetType.FUNCTION_CALL) {
                (bool success, bytes memory reason) = assets[i].addr.call(
                    executions[bytes32(assets[i].amountOrIdOrCall)]
                );

                if (!success) {
                    revert FunctionCallFailedWithReason(reason);
                }
            } else {
                IUniversalTransfer(assets[i].addr).transferFrom(
                    msg.sender,
                    trade.owner,
                    assets[i].amountOrIdOrCall
                );
            }
            unchecked {
                i++;
            }
        }

        assets = trade.assets;

        for (uint256 i = 0; i < assets.length; ) {
            if (assets[i].assetType == AssetType.FUNCTION_CALL) {
                (bool success, bytes memory reason) = assets[i].addr.call(
                    executions[bytes32(assets[i].amountOrIdOrCall)]
                );

                if (!success) {
                    revert FunctionCallFailedWithReason(reason);
                }
            } else {
                IUniversalTransfer(assets[i].addr).transferFrom(
                    trade.owner,
                    msg.sender,
                    assets[i].amountOrIdOrCall
                );
            }
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

    function valid(address owner, uint256 expiry) internal view {
        if (owner == address(0)) {
            revert CannotBeZeroAddress();
        }
        if (owner != msg.sender) {
            revert OwnerMustBeMsgSender();
        }
        // Required the expiration date to be at least 1 day in the future
        if (expiry < 1 days) {
            revert CannotBeLesserThanOneDay(expiry);
        }
    }

    function valid(uint256 expiry) internal pure {
        // Required the expiration date to be at least 1 day in the future
        if (expiry < 1 days) {
            revert CannotBeLesserThanOneDay(expiry);
        }
    }

    function makeAsset(
        address addr,
        uint256 amountOrIdOrCall,
        AssetType assetType
    ) public pure returns (Asset memory) {
        if (
            assetType != AssetType.ERC20 &&
            assetType != AssetType.ERC721 &&
            assetType != AssetType.FUNCTION_CALL
        ) {
            revert InvalidAssetType(uint256(assetType));
        }

        if (
            (assetType == AssetType.ERC20 && amountOrIdOrCall == 0) ||
            (assetType == AssetType.FUNCTION_CALL && amountOrIdOrCall == 0)
        ) {
            revert CannotBeZeroForAmountOrCall();
        }

        return Asset(addr, amountOrIdOrCall, assetType);
    }

    function makeTrade(
        address owner,
        uint256 expiry,
        Asset[] memory assets,
        Asset[] memory asking
    ) public pure returns (Trade memory) {
        valid(expiry);

        if (owner == address(0)) {
            revert CannotBeZeroAddress();
        }

        if (assets.length == 0 || asking.length == 0) {
            revert CannotBeEmptyAssets();
        }

        return Trade(owner, expiry, assets, asking);
    }

    function composeTrade(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountsOrIdsOrCalls,
        AssetType[] memory assetTypes,
        uint256 indexFlipToAsking
    ) public pure returns (Trade memory) {
        if (
            addrs.length != amountsOrIdsOrCalls.length ||
            addrs.length != assetTypes.length
        ) {
            revert LengthMismatchWhenComposing(
                addrs.length,
                amountsOrIdsOrCalls.length,
                assetTypes.length
            );
        }

        Asset[] memory assets = new Asset[](indexFlipToAsking);
        for (uint256 i = 0; i < indexFlipToAsking; ) {
            assets[i] = makeAsset(
                addrs[i],
                amountsOrIdsOrCalls[i],
                assetTypes[i]
            );
            unchecked {
                i++;
            }
        }

        Asset[] memory asking = new Asset[](addrs.length - indexFlipToAsking);
        for (uint256 i = indexFlipToAsking; i < addrs.length; ) {
            asking[i - indexFlipToAsking] = makeAsset(
                addrs[i],
                amountsOrIdsOrCalls[i],
                assetTypes[i]
            );
            unchecked {
                i++;
            }
        }

        return makeTrade(owner, expiry, assets, asking);
    }

    function getTrade(uint256 id) public view returns (Trade memory) {
        return trades[id];
    }

    function getTradesBy(address addr) public view returns (uint256[] memory) {
        return tradesOwned[addr];
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplaceV2) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplaceV2).interfaceId;
    }
}
