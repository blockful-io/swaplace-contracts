import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blocktimestamp, storeEnv } from "../test/utils/utils";
import { Swap, composeSwap } from "../test/utils/SwapFactory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export async function main() {
  /// @dev This is the list of mock deployments addresses that were stored in the `.env` file.
  const ERC20_ADDRESS = process.env.ERC20_ADDRESS || 0x0;
  const ERC721_ADDRESS = process.env.ERC721_ADDRESS || 0x0;
  /// @dev The Swaplace address also needs to be instance to receive the approvals.
  const SWAPLACE_ADDRESS = process.env.SWAPLACE_ADDRESS || 0x0;
  /// @dev Will throw an error if any of the addresses were not set in the `.env` file.
  if (!ERC20_ADDRESS || !ERC721_ADDRESS || !SWAPLACE_ADDRESS) {
    throw new Error(
      "Invalid ERC20, ERC721 or Swaplace address, please check if the addresse in the `.env` file is set up correctly.",
    );
  }

  /// @dev Quantity of tokens to approve.
  let amount = process.env.AMOUNT || 0x0;

  /// @dev Last token ID or choosed token ID to mint.
  let tokenId = process.env.TOKEN_ID || 0x0;

  /// @dev No point in approving if the quantities and target token IDs are not set.
  if (!tokenId || !amount) {
    throw new Error(
      "Invalid token ID or amount, please check if the values are set up correctly in the `.env` file.",
    );
  }

  /// @dev This is the list of accounts that were set in the hardhat config file.
  /// The first account will be performing the signing of the transactions, hence becoming the contract deployer.
  let signers: SignerWithAddress[];

  /// @dev The returned contract instance that will be deployed via the deploy function in utils.
  let Swaplace: Contract;

  /// @dev will throw an error if any of the accounts was not set up correctly.
  try {
    signers = await ethers.getSigners();
  } catch (error) {
    throw new Error(
      `Error getting the first account from the list of accounts. Make sure it is 
      set up in correctly in hardhat.config.ts. 
      ${error}`,
    );
  }

  /// @dev Will throw an error if we fail to load the contract's instance.
  try {
    Swaplace = await ethers.getContractAt(
      "Swaplace",
      SWAPLACE_ADDRESS,
      signers[0],
    );
  } catch (error) {
    throw new Error(
      `Error instancing the Swaplace contract.
      Make sure if the network is correct and that the contract has the right
      deployment address. Ultimately check for errors in the ABI by calling the
      script 'npx hardhat clean' and then 'npx hardhat compile'.
      ${error}`,
    );
  }

  /// @dev Fill the Swap struct
  const owner = signers[0].address;
  const allowed = ethers.constants.AddressZero;
  const expiry = (await blocktimestamp()) * 2;

  /// @dev Build the biding assets
  const bidingAddr = [ERC20_ADDRESS];
  const bidingAmountOrId = [amount];

  /// @dev Build the asking assets
  const askingAddr = [ERC721_ADDRESS];
  const askingAmountOrId = [tokenId];

  /// @dev Pack the config together
  const config = (BigInt(allowed) << BigInt(96)) | BigInt(expiry);

  /// @dev Compose the above swap into the Swap Struct
  const swap: Swap = await composeSwap(
    owner,
    config,
    bidingAddr,
    bidingAmountOrId,
    askingAddr,
    askingAmountOrId,
  );

  /// @dev Response from the `creatSwap` transaction.
  let tx;

  /// @dev Catching any errors while creating the swap.
  try {
    tx = await Swaplace.createSwap(swap);
    // @dev Wait for the transaction to be mined
    await tx.wait();
  } catch (error) {
    throw new Error(
      `Error while creating the swap. Make sure that the struct is correctly
      filled accordingly to the contract interface specification.
      ${error}`,
    );
  }

  /// @dev Log the transactions
  console.log("\nSwaplace created the Swap \nAt Tx %s", tx.hash);

  /// @dev Store the recently created swap and it's corresponding ID in the `.env` file.
  const swapId = await Swaplace.totalSwaps();
  await storeEnv(swapId, "SWAP_ID", tx.hash);

  /// @dev Awaits for the transaction to be mined.
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
