// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 */
interface IERC20Permit {
    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases `owner`'s nonce by one.
     * This prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);

    /**
     * @dev Sets `value` as the allowance of `spender` over `owner`'s tokens,
     * given `owner`'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {IERC20-Approval} event.
     *
     * NOTE: `spender` can be the zero address. Checking this on-chain is a bad
     * usage of gas. For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIPsection].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool);

    /**
     * @dev Allows {IERC20-transferFrom} to be used with the `owner`'s signature.
     * Similar to permit but changing the scope to handle the balance instead of
     * allowance.
     *
     * Requires less gas than regular {permit} and {IERC20-transferFrom}.
     *
     * IMPORTANT: `owner` works as `from` and `spender` as `to` (see {IERC20Permit-permit}).
     *
     * Emits an {IERC20-Transfer} event.
     *
     * NOTE: Realize that {PERMIT_TYPEHASH} is different from the one in {permit}.
     * This is because the arguments name differ. But won't result in a different
     * output as long as it is encoded following the EIP712 and ERC20Permit specs.
     */
    function permitTransfer(
        address from,
        address to,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool);
}
