// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./interfaces/IERC20.sol";
import {IERC20Permit} from "./interfaces/IERC20Permit.sol";
import {IERC20Errors} from "./interfaces/IERC20Errors.sol";

/**
 * @author @ownerlessinc | @Blockful_io
 * @dev Lightweight ERC20 with Permit extension.
 */
abstract contract ERC20 is IERC20, IERC20Permit, IERC20Errors {
    /**
     * @dev The bytes32 signature of the permit function and args name and type.
     */
    bytes32 private constant _permitTypehash =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

    /**
     *  @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
     */
    bytes32 private immutable _domainSeparator;

    /**
     * @dev See {IERC20-name}.
     */
    string private _name;

    /**
     * @dev See {IERC20-symbol}.
     */
    string private _symbol;

    /**
     * @dev See {IERC20-totalSupply}.
     */
    uint256 private _totalSupply;

    /**
     * @dev Map accounts to spender to the allowed transfereable value.
     */
    mapping(address account => mapping(address spender => uint256))
        private _allowance;

    /**
     * @dev Map accounts to balance of Tokens.
     */
    mapping(address account => uint256 balance) private _balances;

    /**
     * @dev Map accounts to its current nonce.
     */
    mapping(address => uint256) private _nonces;

    /**
     * @dev Sets the values for {name} and {symbol}.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(name_)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(
        address owner,
        address spender
    ) public view virtual returns (uint256) {
        return _allowance[owner][spender];
    }

    /**
     * @dev Returns the current nonce of an address.
     */
    function nonces(address owner) public view virtual returns (uint256) {
        return _nonces[owner];
    }

    /**
     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
     */
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return _domainSeparator;
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     */
    function approve(
        address spender,
        uint256 value
    ) public virtual returns (bool) {
        _allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    /**
     * @dev See {IERC20-increaseAllowance}.
     */
    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public virtual returns (bool) {
        // Overflow check required: allowance should never overflow
        uint256 updatedAllowance = _allowance[msg.sender][spender] + addedValue;

        _allowance[msg.sender][spender] = updatedAllowance;

        emit Approval(msg.sender, spender, updatedAllowance);

        return true;
    }

    /**
     * @dev See {IERC20-decreaseAllowance}.
     *
     * Requirements:
     *
     * - `spender` must have allowance for the caller of at least
     * `requestedDecrease`.
     */
    function decreaseAllowance(
        address spender,
        uint256 requestedDecrease
    ) public virtual returns (bool) {
        uint256 currentAllowance = _allowance[msg.sender][spender];
        if (currentAllowance < requestedDecrease) {
            revert ERC20FailedDecreaseAllowance(
                spender,
                currentAllowance,
                requestedDecrease
            );
        }

        unchecked {
            // Underflow not possible: requestedDecrease <= currentAllowance.
            _allowance[msg.sender][spender] =
                currentAllowance -
                requestedDecrease;

            emit Approval(
                msg.sender,
                spender,
                currentAllowance - requestedDecrease
            );
        }

        return true;
    }

    /**
     * @dev See {IERC20Permit-permit}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {IERC20Permit-nonces}).
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual returns (bool) {
        if (block.timestamp > deadline) {
            revert ERC2612ExpiredSignature(deadline);
        }

        // Overflow not possible: nonces will never reach max uint256.
        unchecked {
            bytes32 structHash = keccak256(
                abi.encode(
                    _permitTypehash,
                    owner,
                    spender,
                    value,
                    _nonces[owner]++,
                    deadline
                )
            );
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(hex"19_01", _domainSeparator, structHash)
                ),
                v,
                r,
                s
            );
            if (recoveredAddress != owner) {
                revert ERC2612InvalidSigner(recoveredAddress, owner);
            }
        }

        _allowance[owner][spender] = value;

        emit Approval(owner, spender, value);

        return true;
    }

    /**
     * @dev Creates an `value` of tokens and assigns them to `to` by creating supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     */
    function _mint(address to, uint256 value) internal {
        // Overflow check required: _totalSupply should never overflow
        _totalSupply += value;

        unchecked {
            // Overflow not possible: value <= _totalSupply.
            _balances[to] += value;
        }

        emit Transfer(address(0), to, value);
    }

    /**
     * @dev Destroys an `value` of tokens from `from` by lowering the total supply.
     *
     * Requirements:
     *
     * - `from` must have a balance of at least `value`.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     */
    function _burn(address from, uint256 value) internal {
        uint256 fromBalance = _balances[from];
        if (fromBalance < value) {
            revert ERC20InsufficientBalance(from, fromBalance, value);
        }

        unchecked {
            // Underflow not possible: value <= _totalSupply or value <= fromBalance <= _totalSupply.
            _totalSupply -= value;
            _balances[from] -= value;
        }

        emit Transfer(from, address(0), value);
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        uint256 fromBalance = _balances[msg.sender];
        if (fromBalance < value) {
            revert ERC20InsufficientBalance(msg.sender, fromBalance, value);
        }

        // Underflow and overflow not possible: value <= _totalSupply or value <= fromBalance <= _totalSupply.
        unchecked {
            _balances[msg.sender] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(msg.sender, to, value);

        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Requirements:
     *
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for `from`'s tokens of at least
     * `value`.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual returns (bool) {
        uint256 currentAllowance = _allowance[from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(
                    msg.sender,
                    currentAllowance,
                    value
                );
            }
            // Underflow not possible: value <= currentAllowance
            unchecked {
                _allowance[from][msg.sender] = currentAllowance - value;
            }
        }

        uint256 fromBalance = _balances[from];
        if (fromBalance < value) {
            revert ERC20InsufficientBalance(from, fromBalance, value);
        }

        // Underflow and overflow not possible: value <= fromBalance and value <= _totalSupply.
        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);

        return true;
    }

    /**
     * @dev See {IERC20Permit-permitTransfer}.
     *
     * Requirements:
     *
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `from`
     * over the EIP712-formatted function arguments.
     * - the signature must use `from`'s current nonce (see {IERC20Permit-nonces}).
     */
    function permitTransfer(
        address from,
        address to,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual returns (bool) {
        if (block.timestamp > deadline) {
            revert ERC2612ExpiredSignature(deadline);
        }

        // Overflow not possible: nonces will never reach max uint256.
        unchecked {
            bytes32 structHash = keccak256(
                abi.encode(
                    _permitTypehash,
                    from,
                    to,
                    value,
                    _nonces[from]++,
                    deadline
                )
            );
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(hex"19_01", _domainSeparator, structHash)
                ),
                v,
                r,
                s
            );
            if (recoveredAddress != from) {
                revert ERC2612InvalidSigner(recoveredAddress, from);
            }
        }

        uint256 fromBalance = _balances[from];
        if (fromBalance < value) {
            revert ERC20InsufficientBalance(from, fromBalance, value);
        }

        // Underflow and overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);

        return true;
    }
}
