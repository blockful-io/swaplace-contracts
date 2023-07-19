// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IBaseSwap} from "./interfaces/swaps/IBaseSwap.sol";
import {IPvtSwap} from "./interfaces/swaps/IPvtSwap.sol";
import {ITimedSwap} from "./interfaces/swaps/ITimedSwap.sol";
import {ITimedPvtSwap} from "./interfaces/swaps/ITimedPvtSwap.sol";

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ISwaplace} from "./interfaces/ISwaplace.sol";

contract Swaplace is ISwaplace, IERC165 {
    IBaseSwap public immutable IBS;
    IPvtSwap public immutable IPS;
    ITimedSwap public immutable ITS;
    ITimedPvtSwap public immutable ITPS;

    constructor(
        address _baseSwap,
        address _pvtSwap,
        address _timedSwap,
        address _timedPvtSwap
    ) {
        IBS = IBaseSwap(_baseSwap);
        IPS = IPvtSwap(_pvtSwap);
        ITS = ITimedSwap(_timedSwap);
        ITPS = ITimedPvtSwap(_timedPvtSwap);
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure override(IERC165, ISwaplace) returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(ISwaplace).interfaceId;
    }
}
