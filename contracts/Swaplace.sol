// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "./ISwaplace.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/*
* @author - Swaplace
* @dev - Swaplace is a decentralized exchange for ERC20 and ERC721 tokens.
*        It allows users to propose trades and accept them.
*        The contract will validate the trade and transfer the assets.
*/

contract Swaplace is ISwaplace {

    uint256 public tradeIds;

    mapping(uint256 => Trade) public trades;
    mapping(uint256=>uint256[]) public tradeReferences; 

    /*
    * @param - tradeIdRef - the trade id reference
    * @param - timestamp - the time in seconds that the trade will be valid
    * @param - withdrawAddress - the address where the assets will be sent
    * @param - allowedAddresses - the addresses that are allowed to accept the trade
    * @param - assetsToSend - the assets that the user wants to send
    * @param - assetsToReceive - the assets that the user wants to receive
    * @dev - Proposes a trade by providing assetsToSend and assetsToReceive.
    */
    function proposeTrade(
        uint256 tradeIdRef,
        uint256 timestamp,
        address withdrawAddress,
        address[] calldata allowedAddresses, 
        Assets calldata assetsToSend,
        Assets calldata assetsToReceive
    ) external {

        // transfer the assets to the contract
        for(uint256 i = 0; i < assetsToSend.erc20.length; i++) {
            IERC20(assetsToSend.erc20[i].addr).transferFrom(msg.sender, address(this), assetsToSend.erc20[i].amount);
        }
        for(uint256 i = 0; i < assetsToSend.erc721.length; i++) {
            IERC721(assetsToSend.erc721[i].addr).safeTransferFrom(msg.sender, address(this), assetsToSend.erc721[i].tokenId);
        }

        // must generate hashproof and store
        bytes32 hashproof = keccak256(abi.encode(assetsToSend, assetsToReceive));
        
        // increment tradeId
        tradeIds++;

        // add tradeIdRef to the tradeReferences map
        tradeReferences[tradeIdRef].push(tradeIds);
        
        // stores the assets that the user has in the contract
        trades[tradeIds].tradeIdRef = tradeIdRef;
        trades[tradeIds].proposer = msg.sender;
        trades[tradeIds].timestamp = block.timestamp + timestamp;
        trades[tradeIds].withdrawAddress = withdrawAddress;
        trades[tradeIds].allowedAddresses = allowedAddresses;
        trades[tradeIds].hashproof = hashproof;
        trades[tradeIds].assetsToSend = assetsToSend;
        trades[tradeIds].assetsToReceive = assetsToReceive;

        emit TradeProposed(
            tradeIds,
            msg.sender,
            allowedAddresses,
            timestamp,
            tradeIdRef
        );
    }

    /*
    * @param - id - the trade id
    * @param - assetsToSend - the assets that the user wants to send
    * @param - withdrawAddress - the address where the assets will be sent
    * @param - imAllowed - the index of the allowedAddresses array that the msg.sender is
    * @dev - Accepts a trade by providing requested assets.
    *        The transfer function will validate that.
    *        The hashproof will match assetsToSend with the one in the trade map.
    */
    function acceptTrade(
        uint256 id, 
        Assets calldata assetsToSend, 
        address withdrawAddress,
        uint256 imAllowed
    ) external {

        // check if the trade exists and if its still valid
        require(trades[id].timestamp > block.timestamp &&
                trades[id].timestamp > 0,  
        "Trade is not valid anymore");

        // must check if there is white list and check if the trade is allowed for the user
        if(trades[id].allowedAddresses.length > 0) {
            checkAllowedAddress(id, imAllowed, msg.sender);
        }

        // store the hashproof
        bytes32 hashproof = keccak256(abi.encode(assetsToSend, trades[id].assetsToReceive));
        require(hashproof == trades[id].hashproof, "Hashproof does not match");

        // transfer assetsToSend to the propose withdrawAddress
        for(uint256 i = 0; i < assetsToSend.erc20.length; i++) {
            IERC20(assetsToSend.erc20[i].addr).transferFrom(msg.sender, trades[id].withdrawAddress, assetsToSend.erc20[i].amount);
        }
        for(uint256 i = 0; i < assetsToSend.erc721.length; i++) {
            IERC721(assetsToSend.erc721[i].addr).safeTransferFrom(msg.sender, trades[id].withdrawAddress, assetsToSend.erc721[i].tokenId);
        }

        // transfer assetsToReceive from this contract to withdrawAddress
        for(uint256 i = 0; i < trades[id].assetsToReceive.erc20.length; i++) {
            IERC20(trades[id].assetsToReceive.erc20[i].addr).transferFrom(address(this), withdrawAddress, trades[id].assetsToReceive.erc20[i].amount);
        }
        for(uint256 i = 0; i < assetsToSend.erc721.length; i++) {
            IERC721(trades[id].assetsToReceive.erc721[i].addr).safeTransferFrom(address(this), withdrawAddress, assetsToSend.erc721[i].tokenId);
        }

        // delete the trade
        delete trades[id];
        
        emit TradeAccepted(
            id,
            msg.sender,
            withdrawAddress
        );
    }

    /*
    * @param - id - the trade id
    * @dev - Cancels a trade.
    */
    function cancelTrade(uint256 _tradeId) external {
        require(trades[_tradeId].proposer == msg.sender, "Only the proposer can cancel the trade");
        delete trades[_tradeId];
        emit TradeCancelled(
            _tradeId,
            msg.sender
        );
    }
    
    /*
    * @param - id - the trade id
    * @dev - Gets a trade.
    */
    function getTrade(uint256 _tradeId) external view returns(Trade memory) {
        return trades[_tradeId];
    }

    /*
    * @param - id - the trade id
    * @dev - Gets all trades.
    */
    function getAllTradeReferences(uint256 _tradeId) external view returns(uint256[] memory) {
        return tradeReferences[_tradeId];
    }

    /*
    * @param - id - the trade id
    * @dev - Gets all trades.
    */
    function checkAllowedAddress(uint256 _tradeId, uint256 imAllowed, address addr) public view {
        require(trades[_tradeId].allowedAddresses[imAllowed] == addr, "Trade not allowed for this address");
    }

    /*
    * @param - id - the trade id
    * @dev - Gets all trades.
    */
    function getAllowedAddressIndex(uint256 _tradeId, address _address) public view returns(uint256) {
        for(uint256 i = 0; i < trades[_tradeId].allowedAddresses.length; i++) {
            if(trades[_tradeId].allowedAddresses[i] == _address) {
                return i;
            }
        }
        revert("Address not allowed to accept this trade");
    }

}
