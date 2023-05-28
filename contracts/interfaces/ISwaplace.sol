// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ITrade} from "./ITrade.sol";

interface ISwaplace {
    function createTrade(
        ITrade.Trade calldata trade
    ) external returns (uint256);

    function acceptTrade(uint256 id) external;

    function cancelTrade(uint256 id) external;

    function getTrade(uint256 id) external view returns (ITrade.Trade memory);

    function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}
