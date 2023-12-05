// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Standard ERC20 Errors
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(
        address sender,
        uint256 balance,
        uint256 needed
    );

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */

    error ERC20InsufficientAllowance(
        address spender,
        uint256 allowance,
        uint256 needed
    );

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` want to operate with.
     * @param needed Amount required to decrease the allowance.
     */
    error ERC20FailedDecreaseAllowance(
        address spender,
        uint256 allowance,
        uint256 needed
    );

    /**
     * @dev Indicates the nonce used for an `account` is not the expected current nonce.
     * @param account Address whose nonce is being checked.
     * @param nonce Expected nonce for the given `account`.
     */
    error ERC20PermitInvalidNonce(address account, uint256 nonce);

    /**
     * @dev Indicates the expiration of a permit to be used.
     * @param deadline Expiration time limit in seconds.
     */
    error ERC2612ExpiredSignature(uint256 deadline);

    /**
     * @dev Indicates the mismatched owner when validating the signature.
     * @param signer Address of the signer recovered.
     * @param owner Address of the owner expected to match `signer`.
     */
    error ERC2612InvalidSigner(address signer, address owner);
}
