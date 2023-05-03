// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error ExpiryMustBeBiggerThanOneDay(uint256 timestamp);
error CannotInputEmptyAssets();
error CannotBeZeroAddress(address addr);
error CannotBeZeroAmountWhenERC20(uint256 amountOrId);
error InvalidAssetType(uint256 assetType);
error LengthMismatchWhenComposing(
    uint256 addr,
    uint256 amountOrId,
    uint256 assetType
);

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
        ERC721
    }

    struct Asset {
        address addr;
        uint256 amountOrId;
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

contract SwaplaceV2 is ISwaplaceV2, IERC165 {
    uint256 public tradeCount = 0;

    mapping(uint256 => Trade) private trades;
    mapping(address => uint256[]) private owners;

    function createTrade(Trade calldata trade) public returns (uint256) {
        valid(trade.expiry);

        tradeCount++;
        trades[tradeCount] = trade;
        owners[msg.sender].push(tradeCount);

        return tradeCount;
    }

    function acceptTrade() public {}

    function cancelTrade() public {}

    function valid(uint256 expiry) public pure {
        // Required the expiration date to be at least 1 day in the future
        if (expiry < 1 days) {
            revert ExpiryMustBeBiggerThanOneDay(expiry);
        }
    }

    function makeAsset(
        address addr,
        uint256 amountOrId,
        AssetType assetType
    ) public pure returns (Asset memory) {
        if (assetType != AssetType.ERC20 && assetType != AssetType.ERC721) {
            revert InvalidAssetType(uint256(assetType));
        }

        if (assetType == AssetType.ERC20) {
            if (amountOrId == 0) {
                revert CannotBeZeroAmountWhenERC20(amountOrId);
            }
        }

        return Asset(addr, amountOrId, assetType);
    }

    function makeTrade(
        address owner,
        uint256 expiry,
        Asset[] memory assets,
        Asset[] memory asking
    ) public pure returns (Trade memory) {
        valid(expiry);

        if (owner == address(0)) {
            revert CannotBeZeroAddress(owner);
        }

        if (assets.length == 0 || asking.length == 0) {
            revert CannotInputEmptyAssets();
        }

        return Trade(owner, expiry, assets, asking);
    }

    function composeTrade(
        address owner,
        uint256 expiry,
        address[] memory addrs,
        uint256[] memory amountsOrIds,
        AssetType[] memory assetTypes,
        uint256 indexFlipSide
    ) public pure returns (Trade memory) {
        if (
            addrs.length != amountsOrIds.length ||
            addrs.length != assetTypes.length
        ) {
            revert LengthMismatchWhenComposing(
                addrs.length,
                amountsOrIds.length,
                assetTypes.length
            );
        }

        Asset[] memory assets = new Asset[](indexFlipSide);
        for (uint256 i = 0; i < indexFlipSide; i++) {
            assets[i] = makeAsset(addrs[i], amountsOrIds[i], assetTypes[i]);
        }

        Asset[] memory asking = new Asset[](addrs.length - indexFlipSide);
        for (uint256 i = indexFlipSide; i < addrs.length; i++) {
            asking[i - indexFlipSide] = makeAsset(
                addrs[i],
                amountsOrIds[i],
                assetTypes[i]
            );
        }

        return makeTrade(owner, expiry, assets, asking);
    }

    function getTrade(uint256 id) public view returns (Trade memory) {
        return trades[id];
    }

    function ownerOf(address addr) public view returns (uint256[] memory) {
        return owners[addr];
    }

    function day() public pure returns (uint256) {
        return 1 days;
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplaceV2) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplaceV2).interfaceId;
    }

    /* Receive ETH */
    receive() external payable {}
}
