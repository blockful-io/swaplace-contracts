# IErrors

_Errors only interface for the {Swaplace} implementations._

* [Source Code](https://github.com/blockful-io/swaplace-contracts/blob/develop/contracts/interfaces/IErrors.sol)

### InvalidAddress()

```solidity
error InvalidAddress()
```

_Displayed when the caller is not the owner of the swap._

### InvalidExpiry()

```solidity
error InvalidExpiry()
```

_Displayed when the `expiry` date is in the past._

### InvalidValue()

```solidity
error InvalidValue()
```

_Displayed when the `msg.value` doesn't match the swap request._

### InvalidCall()

```solidity
error InvalidCall()
```

_Displayed when a low-level call failed to execute._
