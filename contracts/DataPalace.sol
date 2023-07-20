// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

/** vOne&only
 *  ________   ___        ________   ________   ___  __     ________  ___  ___   ___
 * |\   __  \ |\  \      |\   __  \ |\   ____\ |\  \|\  \  |\  _____\|\  \|\  \ |\  \
 * \ \  \|\ /_\ \  \     \ \  \|\  \\ \  \___| \ \  \/  /|_\ \  \__/ \ \  \\\  \\ \  \
 *  \ \   __  \\ \  \     \ \  \\\  \\ \  \     \ \   ___  \\ \   __\ \ \  \\\  \\ \  \
 *   \ \  \|\  \\ \  \____ \ \  \\\  \\ \  \____ \ \  \\ \  \\ \  \_|  \ \  \\\  \\ \  \____
 *    \ \_______\\ \_______\\ \_______\\ \_______\\ \__\\ \__\\ \__\    \ \_______\\ \_______\
 *     \|_______| \|_______| \|_______| \|_______| \|__| \|__| \|__|     \|_______| \|_______|
 *
 * @title Data Palace
 * @author @dizzyaxis | @blockful_io
 * @dev - This contract is a little bit odd. It's a contract that calls itself to execute anything
 * for anyones that codes for it. Its an shared/personal public allowance place for function calls.
 *
 * This is an application that can extends Swaplace into infinite possibilities. It works like a
 * looped multicall. Transactions can be chainned for executions to allow a trade to conclude on
 * Swaplace.
 *
 * In theory you can trade anything you let this contract do in your behalf. It stores and executes
 * allowed function calls.
 *
 * This also abstract {Multicall} from OpenZeppelin to allow for a more flexible use for devs.
 * This contract has no owner and cannot be upgraded or altered in any way.
 */

abstract contract DataPalace is Multicall {
    // The id of the call It will be incremented on every new call.
    uint256 public callId = 0;

    // The mapping holding all possible calldata combinations.
    mapping(uint256 => bytes) private datas;

    /**
     * @dev - Emitted when a call is executed.
     * @param id The id of the saved calldata.
     * @param creator The address of the creator of the saved calldata.
     */
    event Saved(uint256 indexed id, address indexed creator);

    /**
     * @dev - Saves the calldata for a specific call.
     * @param _data - The calldata to be saved.
     * @return - The id of the saved calldata.
     */
    function save(bytes calldata _data) external returns (uint256) {
        unchecked {
            callId++;
        }

        datas[callId] = _data;
        emit Saved(callId, msg.sender);

        return callId;
    }

    /**
     * @dev - Returns the bytes memory for a specific call.
     * @param _id - The id of the saved calldata.
     * @return - The calldata for the specific call.
     */
    function data(uint256 _id) public view returns (bytes memory) {
        return datas[_id];
    }
}
