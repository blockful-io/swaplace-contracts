// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISwaplace {

    struct ERC20Asset {
        address addr;
        uint256 amount;
    }
    struct ERC721Asset {
        address addr;
        uint256 tokenId;
    }
    struct ERC721Options {
        address addr;
        uint256 amount;
    }
    struct Assets {
        ERC20Asset[] erc20;
        ERC721Asset[] erc721;
        ERC721Options[] erc721Options;
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
        uint256,
        uint256[] memory
    ) external;

    function cancelTrade(
        uint256
    ) external;

    function getTrade(
        uint256
    ) external view returns(Trade memory);

    function getAllTradeReferences(
        uint256
    ) external view returns(uint256[] memory);

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