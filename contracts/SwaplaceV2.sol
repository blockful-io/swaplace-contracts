// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error expiryTooOld(uint256 timestamp);

/*
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
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}

contract SwaplaceV2 is ISwaplaceV2, IERC165 {
    mapping(bytes32 => Trade) public trades;

    function createTrade(uint256 expiry, Asset[] calldata assets) public {
        valid(expiry);
        bytes32 id = generateTradeId(msg.sender, expiry);

        for (uint256 i = 0; i < assets.length; i++) {
            if (assets[i].assetType == AssetType.ERC20) {}
            if (assets[i].assetType == AssetType.ERC721) {}
        } // this would calculate for everysingle one, maybe not necessary in case we pre-request them

        trades[id].owner = msg.sender;
        trades[id].expiry = expiry;
    }

    function acceptTrade() public {}

    function cancelTrade() public {}

    function generateTradeId(
        address owner,
        uint256 expiry
    ) public view returns (bytes32 id) {
        id = keccak256(abi.encodePacked(owner, expiry, block.timestamp));
    }

    function valid(uint256 expiry) public view {
        // Required the expiration date to be at least 1 day in the future
        if (expiry < block.timestamp + 1 days) {
            revert expiryTooOld(expiry);
        }
    }

    function makeAsset(
        address addr,
        uint256 amountOrId,
        AssetType assetType
    ) public pure returns (Asset memory) {
        return Asset(addr, amountOrId, assetType);
    }

    function makeTrade(
        uint256 expiry,
        Asset[] memory assets
    ) public view returns (Trade memory) {
        return Trade(msg.sender, expiry, assets);
    }

    // function composeTrade(
    //     uint256 expiry,
    //     address[] memory addrs,
    //     uint256[] memory amountsOrIds,
    //     AssetType[] memory assetTypes
    // ) public view returns (Trade memory) {
    //     Asset[] memory assets = new Asset[](addrs.length);
    //     for (uint256 i = 0; i < addrs.length; i++) {
    //         assets[i] = makeAsset(addrs[i], amountsOrIds[i], assetTypes[i]);
    //     }
    //     return makeTrade(expiry, assets);
    // }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplaceV2) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplaceV2).interfaceId;
    }

    function getTrade() public view {}

    function getDay() public pure returns (uint256) {
        return 1 days;
    }

    /* Receive ETH */
    receive() external payable {}
}
