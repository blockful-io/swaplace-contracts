// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "./ISwaplace.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/*
 * @author - Swaplace
 * @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
 *        It allows users to propose trades and accept them.
 *        The contract will validate the trade and transfer the assets.
 */
contract Swaplace is ISwaplace {
    // is lacking ETH_RECEIVER

    uint256 public tradeIds;

    mapping(uint256 => Trade) public trades;
    mapping(uint256 => uint256[]) public tradeReferences;

    /*
     * @param - tradeIdRef - the trade id reference
     * @param - timestamp - the time in seconds that the trade will be valid
     * @param - withdrawAddress - the address where the assets will be sent
     * @param - allowedAddresses - the addresses that are allowed to accept the trade
     * @param - assetsToAsk - the assets that the user wants to send
     * @param - assetsToBid - the assets that the user wants to receive
     * @dev - Proposes a trade by providing assetsToAsk and assetsToBid.
     */
    function proposeTrade(
        uint256 tradeIdRef,
        uint256 expirationDate,
        address withdrawAddress,
        address[] calldata allowedAddresses,
        Assets calldata assetsToBid,
        Assets calldata assetsToAsk
    ) external returns (uint256) {
        // transfer the assets to the contract
        for (uint256 i = 0; i < assetsToBid.erc20.length; i++) {
            IERC20(assetsToBid.erc20[i].addr).transferFrom(
                msg.sender,
                address(this),
                assetsToBid.erc20[i].amountOrId
            );
        }
        for (uint256 i = 0; i < assetsToBid.erc721.length; i++) {
            IERC721(assetsToBid.erc721[i].addr).safeTransferFrom(
                msg.sender,
                address(this),
                assetsToBid.erc721[i].amountOrId
            );
        }

        // increment tradeId
        // this should be the only counter
        // why???
        tradeIds++;

        // must generate hashproof and store
        // must also have a unique variable to this hash like the tradeId
        bytes32 hashproof = keccak256(
            abi.encode(assetsToBid, assetsToAsk, tradeIds)
        );

        // add tradeIdRef to the tradeReferences map
        if (tradeIdRef > 0) {
            tradeReferences[tradeIdRef].push(tradeIds);
        }

        // stores the assets that the user has in the contract
        trades[tradeIds].tradeIdRef = tradeIdRef;
        trades[tradeIds].proposer = msg.sender;
        trades[tradeIds].expirationDate = block.timestamp + expirationDate;
        trades[tradeIds].withdrawAddress = withdrawAddress;
        trades[tradeIds].allowedAddresses = allowedAddresses;
        trades[tradeIds].hashproof = hashproof;
        trades[tradeIds].assetsToBid = assetsToBid;
        trades[tradeIds].assetsToAsk = assetsToAsk;

        emit TradeProposed(
            tradeIds,
            tradeIdRef,
            expirationDate,
            msg.sender,
            withdrawAddress,
            allowedAddresses
        );

        return tradeIds;
    }

    /*
     * @param - id - the trade id
     * @param - assetsToAsk - the assets that the user wants to send
     * @param - withdrawAddress - the address where the assets will be sent
     * @param - imAllowed - the index of the allowedAddresses array that the msg.sender is
     * @dev - Accepts a trade by providing requested assets.
     *        The transfer function will validate that.
     *        The hashproof will match assetsToAsk with the one in the trade map.
     */
    function acceptTrade(
        uint256 id,
        Assets calldata assetsToAsk,
        address withdrawAddress,
        uint256 index,
        uint256[] memory tokenIdsOptions
    ) external {
        // check if the trade exists and if its still valid
        require(
            trades[id].expirationDate > block.timestamp,
            "Trade is not valid anymore"
        );

        // must check if there is white list and check if the trade is allowed for the user
        if (trades[id].allowedAddresses.length > 0) {
            checkAllowedAddress(id, index, msg.sender);
        }

        // check if the hashproof matches
        bytes32 hashproof = keccak256(
            abi.encode(trades[id].assetsToBid, assetsToAsk, id)
        );
        require(hashproof == trades[id].hashproof, "Hashproof does not match");

        // transfer from msg.sender to the trade creator's withdrawAddress
        for (uint256 i = 0; i < assetsToAsk.erc20.length; i++) {
            IERC20(assetsToAsk.erc20[i].addr).transferFrom(
                msg.sender,
                trades[id].withdrawAddress,
                assetsToAsk.erc20[i].amountOrId
            );
        }
        for (uint256 i = 0; i < assetsToAsk.erc721.length; i++) {
            IERC721(assetsToAsk.erc721[i].addr).safeTransferFrom(
                msg.sender,
                trades[id].withdrawAddress,
                assetsToAsk.erc721[i].amountOrId
            );
        }

        // transfer the options asset from msg.sender to the trade creator
        uint256 h = 0;
        for (uint256 i = 0; i < assetsToAsk.erc721Options.length; i++) {
            for (
                uint256 j = 0;
                j < assetsToAsk.erc721Options[i].amountOrId; //this is bad
                // should not mix bot mechanics in the same contract or function
                j++
            ) {
                IERC721(assetsToAsk.erc721Options[i].addr).safeTransferFrom(
                    msg.sender,
                    trades[id].withdrawAddress,
                    assetsToAsk.erc721Options[i].amountOrId
                );
                h++;
            }
        }

        // transfer from this contract(trade creator's asset) to withdrawAddress
        for (uint256 i = 0; i < trades[id].assetsToBid.erc20.length; i++) {
            IERC20(trades[id].assetsToBid.erc20[i].addr).approve(
                address(this),
                trades[id].assetsToBid.erc20[i].amountOrId
            );
            IERC20(trades[id].assetsToBid.erc20[i].addr).transferFrom(
                address(this),
                withdrawAddress,
                trades[id].assetsToBid.erc20[i].amountOrId
            );
        }
        for (uint256 i = 0; i < trades[id].assetsToBid.erc721.length; i++) {
            IERC721(trades[id].assetsToBid.erc721[i].addr).safeTransferFrom(
                address(this),
                withdrawAddress,
                trades[id].assetsToBid.erc721[i].amountOrId
            );
        }

        // delete the trade
        delete trades[id];

        emit TradeAccepted(id, msg.sender, withdrawAddress);
    }

    // make a get function to make a ready Assets var returned from the trade proposalz

    /*
     * @param - id - the trade id
     * @dev - Cancels a trade.
     */
    function cancelTrade(uint256 _tradeId) external {
        require(
            trades[_tradeId].proposer == msg.sender,
            "Only the proposer can cancel the trade"
        );
        delete trades[_tradeId];
        // must send assets back kkkkk
        emit TradeCancelled(_tradeId, msg.sender);
    }

    /*
     * @param - id - the trade id
     * @dev - Gets a trade.
     */
    function getTrade(uint256 _tradeId) external view returns (Trade memory) {
        return trades[_tradeId];
    }

    /*
     * @param - id - the trade id
     * @dev - Gets all trade references.
     */
    function getAllTradeReferences(
        uint256 _tradeId
    ) external view returns (uint256[] memory) {
        return tradeReferences[_tradeId];
    }

    /*
     * @param - id - the trade id
     * @dev - Check if the address is allowed to accept the trade.
     */
    function checkAllowedAddress(
        uint256 _tradeId,
        uint256 index,
        address addr
    ) public view {
        require(
            trades[_tradeId].allowedAddresses[index] == addr,
            "Trade not allowed for this address"
        );
    }

    /*
     * @param - id - the trade id
     * @dev - Gets the index of the allowed address.
     */
    function getAllowedAddressIndex(
        uint256 _tradeId,
        address _address
    ) public view returns (uint256) {
        for (uint256 i = 0; i < trades[_tradeId].allowedAddresses.length; i++) {
            if (trades[_tradeId].allowedAddresses[i] == _address) {
                return i;
            }
        }
        revert("Address not allowed to accept this trade");
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
