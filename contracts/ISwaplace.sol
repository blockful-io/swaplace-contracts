// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISwaplace {

    struct erc20Asset {
        address addr;
        uint256 amount;
    }
    struct erc721Asset {
        address addr;
        uint256 tokenId;
    }
    struct Assets {
        erc20Asset[] erc20;
        erc721Asset[] erc721;
    }

    struct Trade {
        uint256 tradeIdRef;
        address proposer;
        uint256 timestamp;
        address withdrawAddress;
        address[] allowedAddresses;
        bytes32 hashproof;
        Assets assetsToSend;
        Assets assetsToReceive;
    }

    event TradeProposed(
        uint256 indexed tradeId,
        address proposer,
        address[] allowedAddresses,
        uint256 timestamp,
        uint256 tradeIdRef
    );

    event TradeAccepted(
        uint256 indexed tradeId,
        address accepter,
        address withdrawAddress
    );

    event TradeCancelled(
        uint256 indexed tradeId,
        address indexed proposer
    );

    function proposeTrade(        
        uint256,
        uint256,
        address,
        address[] calldata, 
        Assets calldata,
        Assets calldata
    ) external;

    function acceptTrade(        
        uint256, 
        Assets calldata, 
        address,
        uint256
    ) external;

    function cancelTrade(
        uint256
    ) external;

    function checkAllowedAddress(
        uint256, 
        uint256, 
        address
    ) external view;

    function getAllowedAddressIndex(
        uint256, 
        address
    ) external view returns(uint256);
}